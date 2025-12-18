/**
 * ResizeHandle - Draggable handle for resizing columns
 *
 * Features a visible grab bar with hover/active states.
 * Easy to see and use without being distracting.
 */

import React from 'react';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isResizing?: boolean;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, isResizing }) => {
  return (
    <div
      className={`
        group relative w-2 h-full cursor-col-resize
        flex items-center justify-center
        hover:bg-blue-500/10 transition-colors duration-150
        ${isResizing ? 'bg-blue-500/20' : ''}
      `}
      onMouseDown={onMouseDown}
    >
      {/* Visible grab bar */}
      <div
        className={`
          w-1 h-12 rounded-full
          transition-all duration-150
          ${isResizing
            ? 'bg-blue-500 h-20'
            : 'bg-zinc-600 group-hover:bg-blue-400 group-hover:h-16'
          }
        `}
      />

      {/* Expanded hit area (invisible) */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
};

export default ResizeHandle;
