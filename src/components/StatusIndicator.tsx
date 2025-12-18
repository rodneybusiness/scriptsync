/**
 * StatusIndicator - Calm state indicators
 *
 * Shows status without perpetual animation.
 * Only animates during actual state transitions.
 */

import React from 'react';

interface StatusIndicatorProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  label?: string;
  showLabel?: boolean;
}

const STATUS_CONFIG = {
  idle: {
    dot: 'bg-emerald-500',
    text: 'text-zinc-500',
    label: 'Ready',
  },
  processing: {
    dot: 'bg-blue-500 animate-pulse',
    text: 'text-blue-400',
    label: 'Working...',
  },
  success: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
    label: 'Done',
  },
  error: {
    dot: 'bg-red-500',
    text: 'text-red-400',
    label: 'Error',
  },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showLabel = true,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.dot}`} />
      {showLabel && (
        <span className={`text-xs ${config.text}`}>
          {label || config.label}
        </span>
      )}
    </div>
  );
};

// Saved status with relative time
interface SaveStatusProps {
  lastSaved?: Date;
  isSaving?: boolean;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ lastSaved, isSaving }) => {
  if (isSaving) {
    return <StatusIndicator status="processing" label="Saving..." />;
  }

  if (!lastSaved) {
    return <StatusIndicator status="idle" label="Not saved" />;
  }

  const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
  const label = seconds < 5 ? 'Saved' : seconds < 60 ? `Saved ${seconds}s ago` : 'Saved';

  return (
    <div className="flex items-center gap-2">
      <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );
};

export default StatusIndicator;
