/**
 * ScriptSync - Main Application Component
 *
 * A context-aware screenwriting environment with AI-powered analysis.
 */

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useProject } from './config/ProjectContext';
import Navigation from './components/Navigation';
import ScriptView from './components/ScriptView';
import ContextPanel from './components/ContextPanel';
import ResizeHandle from './components/ResizeHandle';
import ColumnWrapper from './components/ColumnWrapper';
import AppStatusBar from './components/AppStatusBar';
import { useColumnLayout, ColumnId } from './hooks/useColumnLayout';
import { AIAgentsProvider } from './contexts/AIAgentsContext';
import { Scene, BoneyardItem } from './config/types';
import { scheduleAutoSave } from './services/storage';
import { ErrorBoundary, AIErrorBoundary } from './components/ErrorBoundary';
import {
  BeatBoardSkeleton,
  TimelineSkeleton,
  CharacterDashboardSkeleton,
  Spinner,
} from './components/LoadingStates';

// Lazy load heavy components
const TimelineView = lazy(() => import('./components/TimelineView'));
const CharacterDashboard = lazy(() => import('./components/CharacterDashboard'));
const BeatBoard = lazy(() => import('./components/BeatBoard'));
const ExportModal = lazy(() => import('./components/ExportModal'));
const ProjectOverview = lazy(() => import('./components/ProjectOverview'));
const RewriteTracker = lazy(() => import('./components/RewriteTracker'));

type ViewMode = 'script' | 'timeline' | 'characters' | 'board' | 'tracker';

interface AppProps {
  onBackToProjects?: () => void;
}

const App: React.FC<AppProps> = ({ onBackToProjects }) => {
  const { config, sequences, setSequences, hasRewriteData } = useProject();

  const allScenes = useMemo(() => sequences.flatMap(s => s.scenes), [sequences]);

  const [currentScene, setCurrentScene] = useState<Scene | undefined>(allScenes[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('script');
  const [boneyard, setBoneyard] = useState<BoneyardItem[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProjectOverviewOpen, setIsProjectOverviewOpen] = useState(false);

  // Column layout management
  const {
    columnOrder,
    draggedColumn,
    dragOverColumn,
    resizingColumn,
    startResize,
    startDrag,
    handleDragOver,
    handleDrop,
    endDrag,
    resetLayout,
    getColumnStyle,
  } = useColumnLayout();

  // Sync currentScene when sequences update
  useEffect(() => {
    if (currentScene) {
      const foundScene = allScenes.find(s => s.id === currentScene.id);
      if (foundScene && foundScene.scriptContent !== currentScene.scriptContent) {
        setCurrentScene(foundScene);
      }
    }
  }, [sequences, currentScene?.id, allScenes]);

  // Auto-save when sequences change
  const autoSave = useCallback(() => {
    scheduleAutoSave({ config, sequences });
  }, [config, sequences]);

  useEffect(() => {
    // Skip initial render
    if (sequences.length > 0) {
      autoSave();
    }
  }, [sequences, autoSave]);

  if (!currentScene) {
    return (
      <div className="bg-zinc-950 h-screen w-screen text-zinc-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-zinc-300 mb-2">ScriptSync</div>
          <div>Loading {config.title}...</div>
        </div>
      </div>
    );
  }

  const addToBoneyard = (item: BoneyardItem) => {
    setBoneyard(prev => [item, ...prev]);
  };

  const handleUpdateScript = (sceneId: string, newContent: string) => {
    setSequences(prevData => {
      return prevData.map(seq => ({
        ...seq,
        scenes: seq.scenes.map(s =>
          s.id === sceneId ? { ...s, scriptContent: newContent } : s
        )
      }));
    });
  };

  const handleNavigate = (scene: Scene) => {
    setCurrentScene(scene);
    if (viewMode !== 'script') setViewMode('script');
  };

  // Render column content based on columnId
  const renderColumnContent = (columnId: ColumnId) => {
    switch (columnId) {
      case 'navigation':
        return (
          <Navigation
            currentSceneId={currentScene.id}
            onSelectScene={handleNavigate}
          />
        );
      case 'script':
        return (
          <ErrorBoundary level="component">
            <ScriptView
              scene={currentScene}
              allScenes={allScenes}
              onUpdateScript={(newContent) => handleUpdateScript(currentScene.id, newContent)}
              onSelectScene={handleNavigate}
            />
          </ErrorBoundary>
        );
      case 'context':
        return (
          <AIErrorBoundary fallbackMessage="AI features temporarily unavailable. Script editing still works.">
            <ContextPanel
              scene={currentScene}
              allScenes={allScenes}
              boneyard={boneyard}
              addToBoneyard={addToBoneyard}
            />
          </AIErrorBoundary>
        );
    }
  };

  const columnTitles: Record<ColumnId, string> = {
    navigation: 'Navigation',
    script: 'Script',
    context: 'Context',
  };

  return (
    <AIAgentsProvider currentScene={currentScene} allScenes={allScenes}>
      <div className="flex h-screen bg-zinc-950 text-zinc-200 font-sans">
        <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Consolidated Status Bar */}
        <AppStatusBar
          projectTitle={config.title}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sequenceId={currentScene.sequenceId}
          onOpenInfo={() => setIsProjectOverviewOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onBackToProjects={onBackToProjects}
          onResetLayout={viewMode === 'script' ? resetLayout : undefined}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {viewMode === 'script' && (
            <>
              {columnOrder.map((columnId, index) => (
                <React.Fragment key={columnId}>
                  <ColumnWrapper
                    columnId={columnId}
                    title={columnTitles[columnId]}
                    style={getColumnStyle(columnId)}
                    isDragging={draggedColumn === columnId}
                    isDragOver={dragOverColumn === columnId}
                    onDragStart={() => startDrag(columnId)}
                    onDragOver={() => handleDragOver(columnId)}
                    onDrop={() => handleDrop(columnId)}
                    onDragEnd={endDrag}
                  >
                    {renderColumnContent(columnId)}
                  </ColumnWrapper>

                  {/* Resize handle between columns (not after the last one) */}
                  {index < columnOrder.length - 1 && (
                    <ResizeHandle
                      onMouseDown={(e) => {
                        // Resize the column to the LEFT of the handle (current column)
                        // unless it's a flex column, then resize the column to the RIGHT
                        const nextColumnId = columnOrder[index + 1];
                        const targetColumn = columnId === 'script' ? nextColumnId : columnId;
                        startResize(targetColumn, e.clientX);
                      }}
                      isResizing={resizingColumn === columnId || resizingColumn === columnOrder[index + 1]}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          )}

          {viewMode === 'board' && (
            <ErrorBoundary level="component">
              <Suspense fallback={<BeatBoardSkeleton />}>
                <BeatBoard
                  sequences={sequences}
                  onSelectScene={handleNavigate}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {viewMode === 'timeline' && (
            <ErrorBoundary level="component">
              <Suspense fallback={<TimelineSkeleton />}>
                <TimelineView
                  onSelectScene={handleNavigate}
                  scriptData={sequences}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {viewMode === 'characters' && (
            <ErrorBoundary level="component">
              <Suspense fallback={<CharacterDashboardSkeleton />}>
                <CharacterDashboard onSelectScene={handleNavigate} />
              </Suspense>
            </ErrorBoundary>
          )}

          {viewMode === 'tracker' && (
            <ErrorBoundary level="component">
              <Suspense fallback={
                <div className="flex-1 bg-zinc-950 p-8">
                  <div className="max-w-6xl mx-auto">
                    <div className="h-8 bg-zinc-800 rounded w-48 mb-4 animate-pulse" />
                    <div className="h-4 bg-zinc-800 rounded w-96 mb-8 animate-pulse" />
                    <div className="grid grid-cols-8 gap-3 mb-8">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-20 bg-zinc-900 rounded-xl animate-pulse" />
                      ))}
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-24 bg-zinc-900 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              }>
                <RewriteTracker />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>

        {/* Export Modal */}
        {isExportOpen && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-zinc-900 rounded-lg p-8">
                <Spinner size="lg" />
              </div>
            </div>
          }>
            <ExportModal sequences={sequences} onClose={() => setIsExportOpen(false)} />
          </Suspense>
        )}

        {/* Project Overview Modal */}
        {isProjectOverviewOpen && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-zinc-900 rounded-lg p-8">
                <Spinner size="lg" />
              </div>
            </div>
          }>
            <ProjectOverview isOpen={isProjectOverviewOpen} onClose={() => setIsProjectOverviewOpen(false)} />
          </Suspense>
        )}
        </main>
      </div>
    </AIAgentsProvider>
  );
};

export default App;
