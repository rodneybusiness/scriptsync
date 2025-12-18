/**
 * SuggestionsPanel - Floating panel showing AI agent suggestions
 *
 * Shows suggestions from Voice Keeper and Continuity Tracker.
 * Can be toggled on/off and positioned in the UI.
 */

import React, { useState } from 'react';
import { useAIAgents, useSceneSuggestions } from '../contexts/AIAgentsContext';
import { MarginNotesContainer } from './MarginNote';

interface SuggestionsPanelProps {
  sceneId: string;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ sceneId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { acceptSuggestion, dismissSuggestion, isProcessing } = useAIAgents();
  const suggestions = useSceneSuggestions(sceneId);

  if (suggestions.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between px-3 py-2
          bg-zinc-800 border border-zinc-700 rounded-t-lg
          hover:bg-zinc-700 transition-colors
          ${!isExpanded ? 'rounded-b-lg' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          {/* Brain icon */}
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
            AI Suggestions
          </span>
          {suggestions.length > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full">
              {suggestions.length}
            </span>
          )}
          {isProcessing && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="bg-zinc-900 border border-t-0 border-zinc-700 rounded-b-lg max-h-80 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-xs text-zinc-500">
                {isProcessing ? 'Analyzing...' : 'No suggestions for this scene'}
              </p>
            </div>
          ) : (
            <MarginNotesContainer
              suggestions={suggestions}
              onAccept={acceptSuggestion}
              onDismiss={dismissSuggestion}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Status indicator for the toolbar
export const SuggestionsIndicator: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const { isProcessing } = useAIAgents();
  const suggestions = useSceneSuggestions(sceneId);

  const hasWarnings = suggestions.some(s => s.severity === 'warning' || s.severity === 'error');

  return (
    <div className="flex items-center gap-1.5">
      {isProcessing ? (
        <>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-zinc-500">Analyzing...</span>
        </>
      ) : suggestions.length > 0 ? (
        <>
          <div className={`w-2 h-2 rounded-full ${hasWarnings ? 'bg-amber-500' : 'bg-blue-500'}`} />
          <span className={`text-[10px] ${hasWarnings ? 'text-amber-400' : 'text-blue-400'}`}>
            {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
          </span>
        </>
      ) : null}
    </div>
  );
};

export default SuggestionsPanel;
