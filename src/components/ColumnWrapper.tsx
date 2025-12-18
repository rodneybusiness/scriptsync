/**
 * ColumnWrapper - Wraps a column with drag handle and styling
 *
 * Provides:
 * - Drag handle for reordering (grip icon at top)
 * - Subtle visual distinction between columns
 * - Drop zone highlighting
 */

import React from 'react';
import { ColumnId } from '../hooks/useColumnLayout';

interface ColumnWrapperProps {
  columnId: ColumnId;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
  showHeader?: boolean;
}

// Subtle color accents for each column type
const COLUMN_ACCENTS: Record<ColumnId, string> = {
  navigation: 'border-l-zinc-700',
  script: 'border-l-blue-900/50',
  context: 'border-l-purple-900/50',
};

// Subtle background differences - barely noticeable but provides structure
const COLUMN_BG: Record<ColumnId, string> = {
  navigation: 'bg-zinc-950',
  script: 'bg-[#0f0f12]', // Slightly warmer than zinc-950
  context: 'bg-zinc-900',
};

const ColumnWrapper: React.FC<ColumnWrapperProps> = ({
  columnId,
  title,
  children,
  style,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  showHeader = true,
}) => {
  return (
    <div
      className={`
        flex flex-col h-full relative transition-all duration-200
        ${COLUMN_BG[columnId]}
        ${isDragging ? 'opacity-50 scale-[0.98]' : ''}
        ${isDragOver ? 'ring-2 ring-blue-500/40 ring-inset' : ''}
      `}
      style={style}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.();
      }}
    >
      {/* Drag Handle Header */}
      {showHeader && (
        <div
          className={`
            flex items-center justify-center h-6 shrink-0
            cursor-grab active:cursor-grabbing
            border-b border-zinc-800/50
            bg-gradient-to-b from-zinc-800/30 to-transparent
            hover:from-zinc-700/40 transition-colors
            group
          `}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = 'move';
            onDragStart?.();
          }}
          onDragEnd={onDragEnd}
          title={`Drag to reorder ${title}`}
        >
          {/* Grip dots */}
          <div className="flex gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
          </div>
        </div>
      )}

      {/* Subtle left accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${COLUMN_ACCENTS[columnId]}`} />

      {/* Column content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>

      {/* Drop indicator overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none flex items-center justify-center">
          <div className="px-3 py-1.5 bg-blue-500/20 rounded text-blue-300 text-xs font-medium">
            Drop here
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnWrapper;
