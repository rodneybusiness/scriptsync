/**
 * TimelineView - Story Structure Visualization
 *
 * Designed for standard linear screenplays (90% of projects).
 * Shows: Act structure, sequence density, character presence, scene flow.
 *
 * For multi-timeline stories (like Bell Bottoms), this can be extended
 * with a toggle, but the default is single-timeline structural view.
 */

import React, { useMemo, useState } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, Sequence } from '../config/types';

interface TimelineViewProps {
  onSelectScene: (scene: Scene) => void;
  scriptData: Sequence[];
}

/** Estimate pages from script content */
const estimatePages = (content: string): number => {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(0.5, Math.round((words / 250) * 2) / 2);
};

/** Act type including 2A and 2B */
type ActType = '1' | '2A' | '2B' | '3';

/** Map sequences to acts (Act 1: ~25%, Act 2A: ~25%, Act 2B: ~25%, Act 3: ~25%) */
const getActForSequence = (seqIndex: number, totalSequences: number): ActType => {
  if (totalSequences <= 4) {
    // For small scripts, distribute evenly
    if (seqIndex === 0) return '1';
    if (seqIndex === totalSequences - 1) return '3';
    if (seqIndex <= Math.floor(totalSequences / 2)) return '2A';
    return '2B';
  }
  const proportion = seqIndex / totalSequences;
  if (proportion < 0.25) return '1';
  if (proportion < 0.50) return '2A';
  if (proportion < 0.75) return '2B';
  return '3';
};

const TimelineView: React.FC<TimelineViewProps> = ({ onSelectScene, scriptData }) => {
  const { config } = useProject();
  const [hoveredSceneId, setHoveredSceneId] = useState<string | null>(null);

  // Flatten scenes with sequence info
  const scenesWithMeta = useMemo(() => {
    return scriptData.flatMap((seq, seqIdx) =>
      seq.scenes.map(scene => ({
        ...scene,
        sequenceTitle: seq.title,
        sequenceIndex: seqIdx,
        act: getActForSequence(seqIdx, scriptData.length),
        pages: estimatePages(scene.scriptContent)
      }))
    );
  }, [scriptData]);

  // Calculate act totals
  const actStats = useMemo(() => {
    const stats: Record<ActType, { pages: number; scenes: number }> = {
      '1': { pages: 0, scenes: 0 },
      '2A': { pages: 0, scenes: 0 },
      '2B': { pages: 0, scenes: 0 },
      '3': { pages: 0, scenes: 0 }
    };
    scenesWithMeta.forEach(s => {
      stats[s.act].pages += s.pages;
      stats[s.act].scenes += 1;
    });
    return stats;
  }, [scenesWithMeta]);

  // Calculate character presence across scenes
  const characterPresence = useMemo(() => {
    const mainChars = config.characters.filter(c => c.role === 'main').slice(0, 5);

    return mainChars.map(char => {
      const searchTerms = [char.name.toUpperCase()];
      if (char.aliases) {
        searchTerms.push(...char.aliases.map(a => a.toUpperCase()));
      }

      const presence = scenesWithMeta.map(scene => {
        const script = scene.scriptContent.toUpperCase();
        return searchTerms.some(term => script.includes(term));
      });

      return { name: char.name, presence };
    });
  }, [config.characters, scenesWithMeta]);

  // Group scenes by sequence for density view
  const sequenceStats = useMemo(() => {
    return scriptData.map((seq, idx) => ({
      id: seq.id,
      title: seq.title.split(':')[0] || seq.title,
      sceneCount: seq.scenes.length,
      pages: seq.scenes.reduce((sum, s) => sum + estimatePages(s.scriptContent), 0),
      act: getActForSequence(idx, scriptData.length)
    }));
  }, [scriptData]);

  const totalPages = useMemo(() =>
    scenesWithMeta.reduce((sum, s) => sum + s.pages, 0),
    [scenesWithMeta]
  );

  // Compute connected scene IDs for hover highlighting
  const connectedSceneIds = useMemo(() => {
    if (!hoveredSceneId) return new Set<string>();

    const connected = new Set<string>();
    const hoveredScene = scenesWithMeta.find(s => s.id === hoveredSceneId);

    // Add scenes this scene connects TO
    if (hoveredScene?.connections) {
      hoveredScene.connections.forEach(conn => {
        connected.add(conn.targetSceneId);
      });
    }

    // Add scenes that connect TO this scene (incoming connections)
    scenesWithMeta.forEach(scene => {
      if (scene.connections) {
        scene.connections.forEach(conn => {
          if (conn.targetSceneId === hoveredSceneId) {
            connected.add(scene.id);
          }
        });
      }
    });

    return connected;
  }, [hoveredSceneId, scenesWithMeta]);

  // Colors for acts - cool to warm progression
  const actColors: Record<ActType, { bg: string; border: string; text: string; bar: string; label: string }> = {
    '1':  { bg: 'bg-blue-900/20',    border: 'border-blue-700/50',    text: 'text-blue-400',    bar: 'bg-blue-500',    label: 'Setup' },
    '2A': { bg: 'bg-emerald-900/20', border: 'border-emerald-700/50', text: 'text-emerald-400', bar: 'bg-emerald-500', label: 'Fun & Games' },
    '2B': { bg: 'bg-amber-900/20',   border: 'border-amber-700/50',   text: 'text-amber-400',   bar: 'bg-amber-500',   label: 'Bad Guys Close In' },
    '3':  { bg: 'bg-red-900/20',     border: 'border-red-700/50',     text: 'text-red-400',     bar: 'bg-red-500',     label: 'Resolution' }
  };

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-zinc-100 mb-1">Story Structure</h1>
          <p className="text-sm text-zinc-500">
            <span className="text-zinc-300">{config.title}</span> • ~{Math.round(totalPages)} pages • {scenesWithMeta.length} scenes
          </p>
        </div>

        {/* Act Overview Bar */}
        <div className="mb-8">
          <div className="flex gap-1 h-12 rounded-lg overflow-hidden border border-zinc-800">
            {(['1', '2A', '2B', '3'] as ActType[]).map(act => {
              const width = totalPages > 0 ? (actStats[act].pages / totalPages) * 100 : 25;
              return (
                <div
                  key={act}
                  className={`${actColors[act].bg} flex flex-col items-center justify-center transition-all`}
                  style={{ width: `${Math.max(width, 8)}%` }}
                >
                  <span className={`text-xs font-bold ${actColors[act].text}`}>
                    ACT {act}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    ~{Math.round(actStats[act].pages)}p
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex mt-1 text-[10px] text-zinc-600">
            {(['1', '2A', '2B', '3'] as ActType[]).map(act => (
              <div
                key={act}
                className="text-center"
                style={{ width: `${totalPages > 0 ? Math.max((actStats[act].pages / totalPages) * 100, 8) : 25}%` }}
              >
                {actColors[act].label}
              </div>
            ))}
          </div>
        </div>

        {/* Sequence Blocks */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Sequences</h2>
          <div className="flex gap-1">
            {sequenceStats.map((seq, idx) => {
              const widthPercent = totalPages > 0 ? (seq.pages / totalPages) * 100 : 10;
              const colors = actColors[seq.act];
              return (
                <div
                  key={seq.id}
                  className={`${colors.bg} ${colors.border} border rounded p-2 flex flex-col justify-between min-w-[60px] transition-all hover:opacity-80`}
                  style={{ width: `${Math.max(widthPercent, 5)}%` }}
                  title={`${seq.title}: ${seq.sceneCount} scenes, ~${Math.round(seq.pages)} pages`}
                >
                  <div className="text-[9px] text-zinc-400 truncate">{seq.title}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    {seq.sceneCount}sc • {Math.round(seq.pages)}p
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Character Presence Swimlanes */}
        {characterPresence.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Character Presence</h2>
            <div className="space-y-2">
              {characterPresence.map((char, charIdx) => (
                <div key={char.name} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-zinc-400 truncate" title={char.name}>
                    {char.name.split(' ')[0]}
                  </div>
                  <div className="flex-1 flex gap-px">
                    {char.presence.map((present, sceneIdx) => (
                      <div
                        key={sceneIdx}
                        className={`h-4 flex-1 rounded-sm transition-all ${
                          present
                            ? 'bg-emerald-500/60 hover:bg-emerald-500'
                            : 'bg-zinc-800/50'
                        }`}
                        title={`${scenesWithMeta[sceneIdx]?.title || 'Scene'}: ${present ? 'Present' : 'Absent'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scene Cards Flow */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Scene Flow</h2>
          <div className="relative">
            {/* Connection lines layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              {scenesWithMeta.flatMap((scene, sceneIdx) => {
                if (!scene.connections) return [];
                return scene.connections.map((conn, connIdx) => {
                  const targetIdx = scenesWithMeta.findIndex(s => s.id === conn.targetSceneId);
                  if (targetIdx === -1) return null;

                  // Calculate positions based on card layout
                  const cardsPerRow = 8;
                  const cardWidth = 100;
                  const cardHeight = 90;
                  const gap = 8;

                  const sourceRow = Math.floor(sceneIdx / cardsPerRow);
                  const sourceCol = sceneIdx % cardsPerRow;
                  const targetRow = Math.floor(targetIdx / cardsPerRow);
                  const targetCol = targetIdx % cardsPerRow;

                  const startX = sourceCol * (cardWidth + gap) + cardWidth / 2;
                  const startY = sourceRow * (cardHeight + gap) + cardHeight;
                  const endX = targetCol * (cardWidth + gap) + cardWidth / 2;
                  const endY = targetRow * (cardHeight + gap);

                  const strokeColor = conn.type === 'causal' ? '#f87171' :
                    conn.type === 'echo' ? '#60a5fa' :
                    conn.type === 'foreshadow' ? '#34d399' :
                    '#a78bfa';

                  // Check if this connection should be highlighted
                  const isHighlighted = hoveredSceneId === scene.id || hoveredSceneId === conn.targetSceneId;
                  const isDimmed = hoveredSceneId && !isHighlighted;

                  return (
                    <g
                      key={`${scene.id}-${conn.targetSceneId}-${connIdx}`}
                      className={`transition-all duration-200 ${isDimmed ? 'opacity-10' : ''}`}
                    >
                      <path
                        d={`M ${startX} ${startY} Q ${startX} ${(startY + endY) / 2}, ${(startX + endX) / 2} ${(startY + endY) / 2} T ${endX} ${endY}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isHighlighted ? 3 : 1.5}
                        strokeDasharray={isHighlighted ? "0" : "4,4"}
                        className={isHighlighted ? 'opacity-90' : 'opacity-30'}
                      />
                      <circle
                        cx={endX}
                        cy={endY}
                        r={isHighlighted ? 5 : 3}
                        fill={strokeColor}
                        className={isHighlighted ? 'opacity-100' : 'opacity-50'}
                      />
                      {/* Glow effect for highlighted connections */}
                      {isHighlighted && (
                        <path
                          d={`M ${startX} ${startY} Q ${startX} ${(startY + endY) / 2}, ${(startX + endX) / 2} ${(startY + endY) / 2} T ${endX} ${endY}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="6"
                          className="opacity-20"
                          filter="blur(3px)"
                        />
                      )}
                    </g>
                  );
                });
              })}
            </svg>

            {/* Scene cards grid */}
            <div className="grid grid-cols-8 gap-2 relative z-10">
              {scenesWithMeta.map((scene, idx) => {
                const colors = actColors[scene.act];
                const hasConnections = scene.connections && scene.connections.length > 0;

                // Determine if this scene is highlighted or dimmed
                const isHovered = hoveredSceneId === scene.id;
                const isConnected = connectedSceneIds.has(scene.id);
                const isDimmed = hoveredSceneId && !isHovered && !isConnected;

                return (
                  <div
                    key={scene.id}
                    onClick={() => onSelectScene(scene)}
                    onMouseEnter={() => setHoveredSceneId(scene.id)}
                    onMouseLeave={() => setHoveredSceneId(null)}
                    className={`
                      ${colors.bg} ${colors.border} border rounded-lg p-2 cursor-pointer transition-all group relative
                      ${isHovered ? 'scale-110 z-20 shadow-xl ring-2 ring-white/30' : 'hover:scale-105 hover:z-20 hover:shadow-lg'}
                      ${isConnected ? 'scale-105 z-15 shadow-lg ring-2 ring-purple-500/50' : ''}
                      ${isDimmed ? 'opacity-30' : ''}
                    `}
                  >
                    {/* Connection indicator */}
                    {hasConnections && (
                      <div className={`absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full transition-transform ${isHovered ? 'scale-150' : ''}`} />
                    )}

                    {/* Connected indicator (shows when this scene is connected to hovered scene) */}
                    {isConnected && !isHovered && (
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    )}

                    <div className="text-[9px] font-mono text-zinc-500 mb-1">{scene.id}</div>
                    <div className={`text-[10px] font-medium ${isConnected && !isHovered ? 'text-purple-300' : colors.text} line-clamp-2 leading-tight mb-1`}>
                      {scene.title.split(':').pop()?.trim() || scene.title}
                    </div>
                    <div className="text-[9px] text-zinc-600">
                      {Math.round(scene.pages * 10) / 10}p
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      <div className="text-xs text-zinc-200 font-medium mb-1">{scene.title}</div>
                      <div className="text-[10px] text-zinc-400 line-clamp-3">{scene.summary}</div>
                      {hasConnections && (
                        <div className="mt-2 pt-2 border-t border-zinc-700">
                          <div className="text-[9px] text-zinc-500">
                            Connects to: {scene.connections?.map(c => c.targetSceneId).join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 border-t border-zinc-800 pt-4">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-900/50 rounded" /> Act 1
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-900/50 rounded" /> Act 2A
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-900/50 rounded" /> Act 2B
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-900/50 rounded" /> Act 3
          </span>
          <span className="text-zinc-700">|</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full" /> Has connections
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-1 bg-teal-500/60 rounded" /> Character present
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
