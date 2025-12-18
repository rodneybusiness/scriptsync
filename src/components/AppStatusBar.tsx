/**
 * AppStatusBar - Consolidated, calm status bar
 *
 * Reduces 8+ elements to 3 main areas:
 * 1. Project title + view mode
 * 2. Context info (sequence in script mode)
 * 3. Actions menu + AI status
 *
 * Uses calm indicators - no perpetual animations.
 */

import React, { useState } from 'react';
import { useAIAgents } from '../contexts/AIAgentsContext';
import { StatusIndicator } from './StatusIndicator';

interface AppStatusBarProps {
  projectTitle: string;
  viewMode: 'script' | 'timeline' | 'characters' | 'board';
  onViewModeChange: (mode: 'script' | 'timeline' | 'characters' | 'board') => void;
  sequenceId?: string;
  onOpenInfo: () => void;
  onOpenExport: () => void;
  onBackToProjects?: () => void;
  onResetLayout?: () => void;
}

const AppStatusBar: React.FC<AppStatusBarProps> = ({
  projectTitle,
  viewMode,
  onViewModeChange,
  sequenceId,
  onOpenInfo,
  onOpenExport,
  onBackToProjects,
  onResetLayout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isProcessing, pendingSuggestions } = useAIAgents();

  // Determine AI status
  const aiStatus = isProcessing ? 'processing' : 'idle';
  const suggestionCount = pendingSuggestions.length;

  return (
    <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/80 backdrop-blur-sm z-10 shrink-0">
      {/* Left: Project + View Mode */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-zinc-100 truncate max-w-[200px]">
          {projectTitle}
        </span>

        {/* Compact View Switcher */}
        <div className="flex bg-zinc-950/80 rounded-lg p-0.5 border border-zinc-800/50">
          {(['script', 'board', 'timeline', 'characters'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md transition-all ${
                viewMode === mode
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {mode === 'characters' ? 'Arcs' : mode === 'board' ? 'Board' : mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Sequence Context (script mode only) */}
        {viewMode === 'script' && sequenceId && (
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
            SEQ {sequenceId.split('_')[1]}
          </span>
        )}
      </div>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-3">
        {/* AI Status - calm, only pulses when actually processing */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-800/30">
          <StatusIndicator
            status={aiStatus}
            label={isProcessing ? 'AI working...' : suggestionCount > 0 ? `${suggestionCount} suggestions` : 'AI ready'}
          />
        </div>

        {/* Actions Menu - consolidated */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
            title="Actions"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                <button
                  onClick={() => { onOpenInfo(); setMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Project Info
                </button>

                <button
                  onClick={() => { onOpenExport(); setMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Script
                </button>

                {viewMode === 'script' && onResetLayout && (
                  <button
                    onClick={() => { onResetLayout(); setMenuOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Layout
                  </button>
                )}

                {onBackToProjects && (
                  <>
                    <div className="my-1 border-t border-zinc-800" />
                    <button
                      onClick={() => { onBackToProjects(); setMenuOpen(false); }}
                      className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      All Projects
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppStatusBar;
