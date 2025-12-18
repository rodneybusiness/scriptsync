/**
 * Navigation - Scene browser sidebar
 *
 * Uses project context for sequences - no hard-coded data.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene } from '../config/types';
import { calculatePacingScore, getPacingColor } from '../services/scriptUtils';

interface NavigationProps {
  currentSceneId: string;
  onSelectScene: (scene: Scene) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSceneId, onSelectScene }) => {
  const { config, sequences } = useProject();
  const [searchQuery, setSearchQuery] = useState('');

  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(288); // 18rem default (w-72)
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      setSidebarWidth(Math.max(200, Math.min(500, newWidth))); // Min 200px, max 500px
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Filter Logic
  const filteredData = sequences.map(seq => ({
    ...seq,
    scenes: seq.scenes.filter(scene => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        scene.title.toLowerCase().includes(q) ||
        scene.summary.toLowerCase().includes(q) ||
        scene.scriptContent.toLowerCase().includes(q) ||
        scene.id.includes(q)
      );
    })
  })).filter(seq => seq.scenes.length > 0);

  return (
    <div
      style={{ width: sidebarWidth }}
      className="bg-zinc-950 border-r border-zinc-800 flex flex-col h-full font-sans relative shrink-0"
    >
      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-20 ${isResizing ? 'bg-blue-500' : 'bg-transparent'}`}
      />
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight">ScriptSync</h1>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{config.title}</p>

        {/* Genre Tags */}
        {config.genres && config.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-3">
            {config.genres.map((genre, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 bg-purple-900/30 text-purple-300 text-[9px] rounded border border-purple-700/30 font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search scenes, dialogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 pl-8 text-xs text-zinc-300 focus:border-blue-500 focus:outline-none transition"
          />
          <svg className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Style References (if any) */}
        {config.ai?.styleReferences && config.ai.styleReferences.length > 0 && (
          <div className="mt-3 pt-2 border-t border-zinc-800">
            <p className="text-[9px] text-zinc-600 uppercase tracking-wide mb-1.5">Style References</p>
            <div className="flex flex-wrap gap-1">
              {config.ai.styleReferences.slice(0, 4).map((ref, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[9px] rounded font-medium"
                  title={ref}
                >
                  {ref.length > 15 ? ref.slice(0, 15) + '...' : ref}
                </span>
              ))}
              {config.ai.styleReferences.length > 4 && (
                <span className="text-[9px] text-zinc-600">+{config.ai.styleReferences.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-xs italic">
            No scenes found matching "{searchQuery}"
          </div>
        ) : (
          filteredData.map((seq) => (
            <div key={seq.id} className="mb-6">
              <div className="px-3 py-1 mb-2 flex justify-between items-center">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate" title={seq.title}>
                  {seq.title.split(':')[0]}
                </h2>
              </div>
              <div className="space-y-0.5">
                {seq.scenes.map((scene) => {
                  const pacingScore = calculatePacingScore(scene.scriptContent);
                  const pacingColor = getPacingColor(pacingScore);

                  return (
                    <button
                      key={scene.id}
                      onClick={() => onSelectScene(scene)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all relative group ${
                        currentSceneId === scene.id
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      {/* Pacing Heatmap Indicator (Left Border) */}
                      <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-50 group-hover:opacity-100 transition ${pacingColor} ${currentSceneId === scene.id ? 'opacity-100' : ''}`}></div>

                      <div className="flex items-center justify-between pl-2">
                        <span className="truncate text-xs font-medium">
                          {scene.id} <span className={currentSceneId === scene.id ? 'text-blue-400' : 'text-zinc-500'}>|</span> {scene.title.split(':')[1] || scene.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Navigation;
