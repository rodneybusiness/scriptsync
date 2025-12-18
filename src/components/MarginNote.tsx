/**
 * MarginNote - Inline suggestion component
 *
 * Non-modal, dismissable suggestions that appear in the script margin.
 * Supports accept, dismiss, and expand actions.
 */

import React, { useState } from 'react';
import { Suggestion } from '../services/memoryPalace';

interface MarginNoteProps {
  suggestion: Suggestion;
  onAccept?: (suggestion: Suggestion) => void;
  onDismiss?: (suggestion: Suggestion) => void;
  onExpand?: (suggestion: Suggestion) => void;
}

const SEVERITY_STYLES = {
  info: {
    bg: 'bg-blue-900/20',
    border: 'border-blue-700/40',
    icon: 'text-blue-400',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/40',
    icon: 'text-amber-400',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  error: {
    bg: 'bg-red-900/20',
    border: 'border-red-700/40',
    icon: 'text-red-400',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
};

const TYPE_LABELS = {
  voice: 'Voice',
  continuity: 'Continuity',
  style: 'Style',
};

const MarginNote: React.FC<MarginNoteProps> = ({
  suggestion,
  onAccept,
  onDismiss,
  onExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const styles = SEVERITY_STYLES[suggestion.severity];
  const typeLabel = TYPE_LABELS[suggestion.type];

  const handleAccept = () => {
    onAccept?.(suggestion);
  };

  const handleDismiss = () => {
    onDismiss?.(suggestion);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      onExpand?.(suggestion);
    }
  };

  return (
    <div
      className={`
        rounded-lg border transition-all duration-200
        ${styles.bg} ${styles.border}
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start gap-2 p-2">
        {/* Icon */}
        <svg
          className={`w-4 h-4 shrink-0 mt-0.5 ${styles.icon}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={styles.iconPath}
          />
        </svg>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] uppercase tracking-wider font-bold ${styles.icon}`}>
              {typeLabel}
            </span>
            <span className="text-[9px] text-zinc-600">
              {suggestion.agentId}
            </span>
          </div>

          {/* Message */}
          <p className="text-xs text-zinc-300 leading-relaxed">
            {suggestion.message}
          </p>

          {/* Expanded suggestion */}
          {isExpanded && suggestion.suggestion && (
            <div className="mt-2 p-2 bg-zinc-900/50 rounded border border-zinc-800">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">
                Suggestion
              </p>
              <p className="text-xs text-zinc-200 font-mono whitespace-pre-wrap">
                {suggestion.suggestion}
              </p>
            </div>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
          title="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Actions */}
      {(suggestion.suggestion || isHovered) && (
        <div className="flex items-center gap-1 px-2 pb-2 pt-0">
          {suggestion.suggestion && (
            <>
              <button
                onClick={handleAccept}
                className="px-2 py-1 text-[10px] font-medium uppercase tracking-wide
                  bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50
                  rounded transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleExpand}
                className="px-2 py-1 text-[10px] font-medium uppercase tracking-wide
                  bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300
                  rounded transition-colors"
              >
                {isExpanded ? 'Hide' : 'Show'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Container for multiple margin notes
interface MarginNotesContainerProps {
  suggestions: Suggestion[];
  onAccept?: (suggestion: Suggestion) => void;
  onDismiss?: (suggestion: Suggestion) => void;
}

export const MarginNotesContainer: React.FC<MarginNotesContainerProps> = ({
  suggestions,
  onAccept,
  onDismiss,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2 p-2">
      {suggestions.map((suggestion) => (
        <MarginNote
          key={suggestion.id}
          suggestion={suggestion}
          onAccept={onAccept}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default MarginNote;
