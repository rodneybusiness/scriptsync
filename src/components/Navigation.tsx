/**
 * Navigation - Scene browser sidebar
 *
 * Uses project context for sequences - no hard-coded data.
 * Features: scene badges, quick filters, page estimates, status indicators
 */

import React, { useState, useMemo } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, SceneStatus } from '../config/types';
import { calculatePacingScore, getPacingColor } from '../services/scriptUtils';

/** Quick filter options */
type FilterMode = 'all' | 'has-notes' | 'incomplete-beats' | 'needs-work';

/** Estimate pages from script content (industry standard: ~1 page per minute, ~250 words) */
const estimatePages = (content: string): number => {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(0.5, Math.round((words / 250) * 2) / 2); // Round to nearest 0.5
};

/** Get status badge styling */
const getStatusStyle = (status?: SceneStatus): { bg: string; text: string; label: string } => {
  switch (status) {
    case 'locked':
      return { bg: 'bg-emerald-900/40', text: 'text-emerald-400', label: 'Locked' };
    case 'polished':
      return { bg: 'bg-blue-900/40', text: 'text-blue-400', label: 'Polished' };
    case 'review':
      return { bg: 'bg-amber-900/40', text: 'text-amber-400', label: 'Review' };
    default:
      return { bg: 'bg-zinc-800/40', text: 'text-zinc-500', label: 'Draft' };
  }
};

interface NavigationProps {
  currentSceneId: string;
  onSelectScene: (scene: Scene) => void;
  onOpenProjectInfo?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSceneId, onSelectScene, onOpenProjectInfo }) => {
  const { config, sequences } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  // Filter Logic - search + quick filters
  const filteredData = useMemo(() => {
    return sequences.map(seq => ({
      ...seq,
      scenes: seq.scenes.filter(scene => {
        // Text search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesSearch =
            scene.title.toLowerCase().includes(q) ||
            scene.summary.toLowerCase().includes(q) ||
            scene.scriptContent.toLowerCase().includes(q) ||
            scene.id.includes(q);
          if (!matchesSearch) return false;
        }

        // Quick filters
        switch (filterMode) {
          case 'has-notes':
            return scene.notes.length > 0;
          case 'incomplete-beats':
            return scene.beats.some(b => !b.completed);
          case 'needs-work':
            return !scene.status || scene.status === 'draft' || scene.status === 'review';
          default:
            return true;
        }
      })
    })).filter(seq => seq.scenes.length > 0);
  }, [sequences, searchQuery, filterMode]);

  return (
    <div
      className="w-full bg-transparent flex flex-col h-full font-sans"
    >
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight">ScriptSync</h1>
        <button
          onClick={onOpenProjectInfo}
          className="text-xs text-zinc-500 uppercase tracking-wider mt-1 mb-3 hover:text-blue-400 transition-colors text-left group flex items-center gap-1"
          title="View project info"
        >
          {config.title}
          <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

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

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-1 mt-2">
          {[
            { key: 'all' as FilterMode, label: 'All' },
            { key: 'has-notes' as FilterMode, label: 'Has Notes' },
            { key: 'incomplete-beats' as FilterMode, label: 'Incomplete' },
            { key: 'needs-work' as FilterMode, label: 'Needs Work' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterMode(key)}
              className={`px-2 py-0.5 text-[9px] rounded transition ${
                filterMode === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

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
                  const pages = estimatePages(scene.scriptContent);
                  const completedBeats = scene.beats.filter(b => b.completed).length;
                  const totalBeats = scene.beats.length;
                  const statusStyle = getStatusStyle(scene.status);

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
                        <span className="truncate text-xs font-medium flex-1">
                          {scene.id} <span className={currentSceneId === scene.id ? 'text-blue-400' : 'text-zinc-500'}>|</span> {scene.title.split(':')[1] || scene.title}
                        </span>

                        {/* Scene Badges - compact row */}
                        <div className="flex items-center gap-1.5 ml-2 shrink-0">
                          {/* Page estimate */}
                          <span className="text-[9px] text-zinc-600" title={`${pages} page${pages !== 1 ? 's' : ''}`}>
                            {pages}p
                          </span>

                          {/* Notes badge */}
                          {scene.notes.length > 0 && (
                            <span
                              className="w-4 h-4 flex items-center justify-center bg-amber-900/40 text-amber-400 text-[9px] rounded-full"
                              title={`${scene.notes.length} note${scene.notes.length !== 1 ? 's' : ''}`}
                            >
                              {scene.notes.length}
                            </span>
                          )}

                          {/* Beats progress */}
                          {totalBeats > 0 && (
                            <span
                              className={`text-[9px] ${
                                completedBeats === totalBeats
                                  ? 'text-emerald-400'
                                  : completedBeats > 0
                                    ? 'text-amber-400'
                                    : 'text-zinc-600'
                              }`}
                              title={`${completedBeats}/${totalBeats} beats complete`}
                            >
                              {completedBeats}/{totalBeats}
                            </span>
                          )}

                          {/* Status indicator */}
                          {scene.status && scene.status !== 'draft' && (
                            <span
                              className={`px-1 py-0.5 text-[8px] rounded ${statusStyle.bg} ${statusStyle.text}`}
                              title={statusStyle.label}
                            >
                              {scene.status === 'locked' ? '✓' : scene.status === 'polished' ? '◆' : '○'}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Genre Tags - at bottom */}
        {config.genres && config.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-6 px-3 pb-2">
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
      </div>
    </div>
  );
};

export default Navigation;
