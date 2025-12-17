/**
 * ScriptSync - Main Application Component
 *
 * A context-aware screenwriting environment with AI-powered analysis.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useProject } from './config/ProjectContext';
import Navigation from './components/Navigation';
import ScriptView from './components/ScriptView';
import TimelineView from './components/TimelineView';
import CharacterDashboard from './components/CharacterDashboard';
import ContextPanel from './components/ContextPanel';
import BeatBoard from './components/BeatBoard';
import ExportModal from './components/ExportModal';
import { Scene, BoneyardItem, Sequence } from './config/types';

type ViewMode = 'script' | 'timeline' | 'characters' | 'board';

const App: React.FC = () => {
  const { config, sequences, setSequences } = useProject();

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
              <ScriptView
                scene={currentScene}
                allScenes={allScenes}
                onUpdateScript={(newContent) => handleUpdateScript(currentScene.id, newContent)}
                onSelectScene={handleNavigate}
              />
              <ContextPanel
                scene={currentScene}
                allScenes={allScenes}
                boneyard={boneyard}
                addToBoneyard={addToBoneyard}
              />
            </>
          )}

          {viewMode === 'board' && (
            <BeatBoard
              sequences={sequences}
              onSelectScene={handleNavigate}
            />
          )}

          {viewMode === 'timeline' && (
            <TimelineView
              onSelectScene={handleNavigate}
              scriptData={sequences}
            />
          )}

          {viewMode === 'characters' && (
            <CharacterDashboard onSelectScene={handleNavigate} />
          )}
        </div>

        {/* Export Modal */}
        {isExportOpen && (
          <ExportModal sequences={sequences} onClose={() => setIsExportOpen(false)} />
        )}
      </main>
    </div>
  );
};

export default App;
