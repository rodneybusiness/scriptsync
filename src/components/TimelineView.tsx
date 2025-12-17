/**
 * TimelineView - Visual timeline for tracking scene connections
 */

import React, { useMemo } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, Sequence } from '../config/types';

interface TimelineViewProps {
  onSelectScene: (scene: Scene) => void;
  scriptData: Sequence[];
}

const TimelineView: React.FC<TimelineViewProps> = ({ onSelectScene, scriptData }) => {
  const { config } = useProject();

  const flattenedScenes = useMemo(() => scriptData.flatMap(seq => seq.scenes), [scriptData]);

  // Generic timeline detection - looks for patterns in titles/summaries
  // Projects can customize this by adding timeline metadata to scenes
  const getTimelineInfo = (scene: Scene) => {
    const title = scene.title.toLowerCase();
    const summary = scene.summary.toLowerCase();

    // Look for year patterns or "past"/"present"/"future" keywords
    const pastPatterns = ['past', 'flashback', 'earlier', '197', '198', '195', '196'];
    const futurePatterns = ['future', '202', '203', 'present day', 'current'];

    const isPast = pastPatterns.some(p => title.includes(p) || summary.includes(p));
    const isFuture = futurePatterns.some(p => title.includes(p) || summary.includes(p));

    // Default: first sequence = primary timeline, rest = secondary
    if (!isPast && !isFuture) {
      if (scene.sequenceId === scriptData[0]?.id) {
        return { timeline: 'primary', label: 'Primary Timeline' };
      }
      return { timeline: 'secondary', label: 'Secondary Timeline' };
    }

    return isPast
      ? { timeline: 'secondary', label: 'Past Timeline' }
      : { timeline: 'primary', label: 'Primary Timeline' };
  };

  // Calculate connections for SVG
  const renderConnections = () => {
    return flattenedScenes.flatMap((sourceScene, sIdx) => {
      if (!sourceScene.connections) return [];

      return sourceScene.connections.map((conn, cIdx) => {
        const targetScene = flattenedScenes.find(s => s.id === conn.targetSceneId);
        if (!targetScene) return null;

        const sourceY = flattenedScenes.findIndex(s => s.id === sourceScene.id) * 140 + 80;
        const targetY = flattenedScenes.findIndex(s => s.id === targetScene.id) * 140 + 80;

        const sourceInfo = getTimelineInfo(sourceScene);
        const targetInfo = getTimelineInfo(targetScene);

        const isSourcePrimary = sourceInfo.timeline === 'primary';
        const isTargetPrimary = targetInfo.timeline === 'primary';

        const startX = isSourcePrimary ? 288 : 864;
        const endX = isTargetPrimary ? 288 : 864;

        const startXAdjusted = isSourcePrimary ? startX + 180 : startX - 180;
        const endXAdjusted = isTargetPrimary ? endX + 180 : endX - 180;

        const strokeColor = conn.type === 'causal' ? '#f87171' :
          conn.type === 'echo' ? '#60a5fa' :
          conn.type === 'foreshadow' ? '#34d399' :
          '#a78bfa';

        return (
          <g key={`${sourceScene.id}-${conn.targetSceneId}-${cIdx}`}>
            <path
              d={`M ${startXAdjusted} ${sourceY} C ${startXAdjusted + (isSourcePrimary ? 50 : -50)} ${sourceY}, ${endXAdjusted + (isTargetPrimary ? 50 : -50)} ${targetY}, ${endXAdjusted} ${targetY}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray="5,5"
              className="opacity-40 hover:opacity-100 transition-opacity duration-300"
            />
            <circle cx={endXAdjusted} cy={targetY} r="3" fill={strokeColor} />
          </g>
        );
      });
    });
  };

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-8 min-h-screen relative">
      <div className="max-w-6xl mx-auto relative">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Dynamic Timeline Visualization</h1>
        <p className="text-zinc-400 mb-8">
          Track continuity and ripple effects in <span className="text-blue-400">{config.title}</span>.
          Dashed lines indicate scene connections.
        </p>

        <div className="grid grid-cols-2 gap-12 relative z-10">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 transform -translate-x-1/2"></div>

          {/* Columns Headers */}
          <div className="text-center pb-4 border-b border-zinc-800">
            <h2 className="text-blue-400 font-mono text-lg uppercase tracking-widest">Primary Timeline</h2>
          </div>
          <div className="text-center pb-4 border-b border-zinc-800">
            <h2 className="text-amber-500 font-mono text-lg uppercase tracking-widest">Secondary Timeline</h2>
          </div>

          {/* SVG Overlay Layer */}
          <svg className="absolute top-[100px] left-0 w-full h-[2000px] pointer-events-none z-0 overflow-visible">
            {renderConnections()}
          </svg>

          {/* Content Mapping */}
          <div className="col-span-2 space-y-0 mt-8">
            {flattenedScenes.map((scene) => {
              const { timeline } = getTimelineInfo(scene);
              const isPrimary = timeline === 'primary';

              return (
                <div key={scene.id} className={`flex items-center h-[140px] relative ${isPrimary ? 'justify-start' : 'justify-end'}`}>
                  {/* Scene Card */}
                  <div
                    onClick={() => onSelectScene(scene)}
                    className={`w-[45%] p-4 rounded border cursor-pointer transition hover:border-opacity-100 hover:bg-zinc-900 relative z-20 ${
                      isPrimary
                        ? 'border-blue-900/50 bg-blue-900/10 mr-auto text-right'
                        : 'border-amber-900/50 bg-amber-900/10 ml-auto text-left'
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-1 ${isPrimary ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-mono text-xs text-zinc-500">{scene.id}</span>
                      <h4 className={`font-bold text-sm ${isPrimary ? 'text-blue-200' : 'text-amber-200'}`}>{scene.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">{scene.summary}</p>

                    {/* Tags */}
                    <div className={`flex gap-1 mt-2 ${isPrimary ? 'justify-end' : 'justify-start'}`}>
                      {scene.connections?.map((c, i) => (
                        <span key={i} className="text-[9px] px-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                          {c.targetSceneId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
