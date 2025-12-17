/**
 * Loading State Components
 *
 * Skeletons and loading indicators for better UX during data operations.
 */

import React from 'react';

// =============================================================================
// SPINNER
// =============================================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-zinc-600 border-t-zinc-300 rounded-full animate-spin ${className}`}
    />
  );
};

// =============================================================================
// SKELETON PRIMITIVES
// =============================================================================

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`bg-zinc-800 animate-pulse rounded ${className}`} style={style} />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
      />
    ))}
  </div>
);

// =============================================================================
// SCENE LIST SKELETON
// =============================================================================

export const SceneListSkeleton: React.FC = () => (
  <div className="space-y-2 p-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg animate-pulse"
      >
        <Skeleton className="w-6 h-6 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// =============================================================================
// SCRIPT VIEW SKELETON
// =============================================================================

export const ScriptViewSkeleton: React.FC = () => (
  <div className="flex-1 p-8 overflow-hidden">
    {/* Header */}
    <div className="mb-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-40" />
    </div>

    {/* Script content */}
    <div className="space-y-6">
      {/* Scene heading */}
      <Skeleton className="h-6 w-48" />

      {/* Action lines */}
      <SkeletonText lines={4} />

      {/* Character name */}
      <Skeleton className="h-4 w-24 mx-auto" />

      {/* Dialogue */}
      <div className="max-w-md mx-auto">
        <SkeletonText lines={2} />
      </div>

      {/* More action */}
      <SkeletonText lines={3} />
    </div>
  </div>
);

// =============================================================================
// CONTEXT PANEL SKELETON
// =============================================================================

export const ContextPanelSkeleton: React.FC = () => (
  <div className="w-80 border-l border-zinc-800 bg-zinc-900/50 p-4 space-y-6">
    {/* Tabs */}
    <div className="flex gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-16 rounded" />
      ))}
    </div>

    {/* Content */}
    <div className="space-y-4">
      <Skeleton className="h-5 w-24" />
      <SkeletonText lines={3} />

      <Skeleton className="h-5 w-32 mt-6" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// =============================================================================
// BEAT BOARD SKELETON
// =============================================================================

export const BeatBoardSkeleton: React.FC = () => (
  <div className="flex-1 p-6 overflow-auto">
    <div className="flex gap-6">
      {Array.from({ length: 4 }).map((_, seqI) => (
        <div key={seqI} className="w-72 shrink-0">
          {/* Column header */}
          <Skeleton className="h-8 w-full rounded-t-lg mb-3" />

          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: 3 + (seqI % 2) }).map((_, cardI) => (
              <div
                key={cardI}
                className="bg-zinc-900/50 rounded-lg p-4 animate-pulse"
              >
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// TIMELINE SKELETON
// =============================================================================

export const TimelineSkeleton: React.FC = () => (
  <div className="flex-1 p-6 overflow-auto">
    {/* Timeline header */}
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="h-8 w-32" />
      <div className="flex-1 h-px bg-zinc-800" />
      <Skeleton className="h-6 w-24" />
    </div>

    {/* Timeline rows */}
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <Skeleton className="w-20 h-4" />
          <div className="flex-1 flex gap-2">
            {Array.from({ length: 3 + (i % 3) }).map((_, j) => (
              <Skeleton
                key={j}
                className="h-12 rounded"
                style={{ width: `${80 + (j * 20)}px` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// CHARACTER DASHBOARD SKELETON
// =============================================================================

export const CharacterDashboardSkeleton: React.FC = () => (
  <div className="flex-1 p-6 overflow-auto">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-32" />
    </div>

    {/* Character cards grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-900/50 rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <SkeletonText lines={2} />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// AI PROCESSING INDICATOR
// =============================================================================

interface AIProcessingProps {
  message?: string;
  subMessage?: string;
}

export const AIProcessing: React.FC<AIProcessingProps> = ({
  message = 'Processing with AI...',
  subMessage,
}) => (
  <div className="flex items-center gap-3 p-4 bg-blue-950/30 border border-blue-900/50 rounded-lg">
    <div className="relative">
      <Spinner size="md" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs">🤖</span>
      </div>
    </div>
    <div>
      <p className="text-sm text-blue-400 font-medium">{message}</p>
      {subMessage && (
        <p className="text-xs text-zinc-500">{subMessage}</p>
      )}
    </div>
  </div>
);

// =============================================================================
// FULL PAGE LOADING
// =============================================================================

interface FullPageLoadingProps {
  message?: string;
  subMessage?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = 'Loading...',
  subMessage,
}) => (
  <div className="bg-zinc-950 h-screen w-screen flex items-center justify-center">
    <div className="text-center">
      <div className="text-2xl font-bold text-zinc-300 mb-4">ScriptSync</div>
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-zinc-400">{message}</p>
      {subMessage && (
        <p className="text-xs text-zinc-600 mt-1">{subMessage}</p>
      )}
    </div>
  </div>
);

// =============================================================================
// INLINE LOADING
// =============================================================================

interface InlineLoadingProps {
  text?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ text = 'Loading' }) => (
  <span className="inline-flex items-center gap-2 text-zinc-500">
    <Spinner size="sm" />
    <span className="text-sm">{text}</span>
  </span>
);

// =============================================================================
// SAVING INDICATOR
// =============================================================================

interface SavingIndicatorProps {
  isSaving: boolean;
  lastSaved?: Date | null;
}

export const SavingIndicator: React.FC<SavingIndicatorProps> = ({
  isSaving,
  lastSaved,
}) => {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Spinner size="sm" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-600">
        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>Saved {formatRelativeTime(lastSaved)}</span>
      </div>
    );
  }

  return null;
};

// Helper to format relative time
const formatRelativeTime = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return date.toLocaleDateString();
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  Spinner,
  Skeleton,
  SkeletonText,
  SceneListSkeleton,
  ScriptViewSkeleton,
  ContextPanelSkeleton,
  BeatBoardSkeleton,
  TimelineSkeleton,
  CharacterDashboardSkeleton,
  AIProcessing,
  FullPageLoading,
  InlineLoading,
  SavingIndicator,
};
