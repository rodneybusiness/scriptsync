/**
 * BeatBoard - Kanban-style sequence/scene overview
 */

import React, { useState } from 'react';
import { Scene, Sequence } from '../config/types';
import { calculatePacingScore, getPacingColor } from '../services/scriptUtils';

interface BeatBoardProps {
  sequences: Sequence[];
  onSelectScene: (scene: Scene) => void;
  onMoveScene?: (sceneId: string, targetSeqId: string) => void;
}

const BeatBoard: React.FC<BeatBoardProps> = ({ sequences, onSelectScene }) => {
  const [draggedScene, setDraggedScene] = useState<Scene | null>(null);

  // Calculate sequence stats
  const getSequenceStats = (seq: Sequence) => {
    const totalScenes = seq.scenes.length;
    const completedBeats = seq.scenes.flatMap(s => s.beats).filter(b => b.completed).length;
    const totalBeats = seq.scenes.flatMap(s => s.beats).length;
    const progress = totalBeats ? Math.round((completedBeats / totalBeats) * 100) : 0;
    return { totalScenes, progress };
  };

  return (
    <div className="flex-1 bg-zinc-950 overflow-x-auto overflow-y-hidden p-8 h-full min-h-screen flex flex-col">
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-1">The Beat Board</h1>
          <p className="text-zinc-400 text-sm">Structural Overview | Pacing Visualization</p>
        </div>
        <div className="flex gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div> Slow/Atmospheric
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div> Balanced
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div> Tension
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-600"></div> Action
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-full pb-10 min-w-max">
        {sequences.map((seq) => {
          const stats = getSequenceStats(seq);
          return (
            <div key={seq.id} className="w-80 flex flex-col h-full bg-zinc-900/30 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
              {/* Column Header */}
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 rounded-t-xl sticky top-0 z-10">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-zinc-200 text-sm uppercase tracking-wide truncate pr-2">{seq.title}</h2>
                  <span className="text-[10px] font-mono text-zinc-500">{seq.id}</span>
                </div>

                {/* Sequence Metadata */}
                {seq.dramaticQuestion && (
                  <div className="mb-2 p-2 bg-zinc-800/50 rounded border-l-2 border-emerald-500">
                    <p className="text-[9px] text-emerald-400 uppercase tracking-wide font-bold mb-0.5">Dramatic Question</p>
                    <p className="text-[10px] text-zinc-300 leading-snug">{seq.dramaticQuestion}</p>
                  </div>
                )}

                {(seq.climax || seq.resolution) && (
                  <div className="flex gap-2 mb-2">
                    {seq.climax && (
                      <div className="flex-1 p-1.5 bg-red-900/10 rounded border border-red-900/30">
                        <p className="text-[8px] text-red-400 uppercase font-bold">Climax</p>
                        <p className="text-[9px] text-zinc-400 line-clamp-2">{seq.climax}</p>
                      </div>
                    )}
                    {seq.resolution && (
                      <div className="flex-1 p-1.5 bg-blue-900/10 rounded border border-blue-900/30">
                        <p className="text-[8px] text-blue-400 uppercase font-bold">Resolution</p>
                        <p className="text-[9px] text-zinc-400 line-clamp-2">{seq.resolution}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${stats.progress}%` }}></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-zinc-500">{stats.totalScenes} Scenes</span>
                  <span className="text-[10px] text-blue-400 font-bold">{stats.progress}% Ready</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-hide">
                {seq.scenes.map((scene) => {
                  const pacingScore = calculatePacingScore(scene.scriptContent);
                  const pacingColor = getPacingColor(pacingScore);

                  return (
                    <div
                      key={scene.id}
                      draggable
                      onDragStart={() => setDraggedScene(scene)}
                      onDragEnd={() => setDraggedScene(null)}
                      onClick={() => onSelectScene(scene)}
                      className={`group bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-blue-500/50 rounded-lg p-3 cursor-pointer transition-all shadow-sm hover:shadow-lg hover:shadow-blue-900/10 active:scale-95 ${draggedScene?.id === scene.id ? 'opacity-50 border-dashed' : ''}`}
                    >
                      {/* Pacing Strip */}
                      <div className={`h-1 w-8 rounded-full mb-2 ${pacingColor}`}></div>

                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-zinc-200 leading-tight group-hover:text-blue-400 transition">{scene.title}</h3>
                        <span className="text-[10px] font-mono text-zinc-600">{scene.id}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-3 mb-3 leading-relaxed">{scene.summary}</p>

                      {/* Footer Meta */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                        <div className="flex gap-1">
                          {scene.connections && scene.connections.length > 0 && (
                            <span className="text-[9px] bg-purple-900/30 text-purple-400 px-1.5 rounded border border-purple-900/50">
                              Linked
                            </span>
                          )}
                          {scene.beats.some(b => !b.completed) && (
                            <span className="text-[9px] bg-amber-900/30 text-amber-400 px-1.5 rounded border border-amber-900/50">
                              WIP
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-zinc-600 font-mono uppercase">Pg {scene.pageNumber}</span>
                      </div>
                    </div>
                  );
                })}
                {/* Add Card Placeholder */}
                <button className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-600 text-xs font-bold uppercase hover:border-zinc-600 hover:text-zinc-400 transition">
                  + Add Scene
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeatBoard;
