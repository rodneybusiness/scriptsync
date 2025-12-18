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

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 font-sans">
      <Navigation
        currentSceneId={currentScene.id}
        onSelectScene={handleNavigate}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Status Bar */}
        <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            {/* Project Title */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-100">{config.title}</span>
              <span className="text-zinc-700">/</span>
            </div>

            {/* View Mode Tabs */}
            <div className="flex bg-zinc-950 rounded p-1 border border-zinc-800">
              <button
                onClick={() => setViewMode('script')}
                className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${viewMode === 'script' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Script
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${viewMode === 'board' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Beat Board
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${viewMode === 'timeline' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('characters')}
                className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${viewMode === 'characters' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Arcs
              </button>
              {hasRewriteData && (
                <button
                  onClick={() => setViewMode('tracker')}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded transition ${viewMode === 'tracker' ? 'bg-zinc-800 text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Tracker
                </button>
              )}
            </div>

            {viewMode === 'script' && (
              <>
                <span className="text-zinc-700 text-lg font-light">/</span>
                <span className="text-xs font-mono text-blue-400">
                  SEQUENCE {currentScene.sequenceId.split('_')[1]}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-xs font-bold uppercase text-zinc-500 hover:text-white transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            {onBackToProjects && (
              <>
                <div className="w-px h-4 bg-zinc-800"></div>
                <button
                  onClick={onBackToProjects}
                  className="text-xs font-bold uppercase text-zinc-500 hover:text-white transition flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Projects
                </button>
              </>
            )}
            <div className="w-px h-4 bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-zinc-400">Gemini Active</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {viewMode === 'script' && (
            <>
              <ErrorBoundary level="component">
                <ScriptView
                  scene={currentScene}
                  allScenes={allScenes}
                  onUpdateScript={(newContent) => handleUpdateScript(currentScene.id, newContent)}
                  onSelectScene={handleNavigate}
                />
              </ErrorBoundary>
              <AIErrorBoundary fallbackMessage="AI features temporarily unavailable. Script editing still works.">
                <ContextPanel
                  scene={currentScene}
                  allScenes={allScenes}
                  boneyard={boneyard}
                  addToBoneyard={addToBoneyard}
                />
              </AIErrorBoundary>
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
      </main>
    </div>
  );
};

export default App;
