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
        group relative w-3 h-full cursor-col-resize
        flex items-center justify-center
        bg-zinc-800/50 hover:bg-blue-500/20 transition-colors duration-150
        ${isResizing ? 'bg-blue-500/30' : ''}
      `}
      onMouseDown={onMouseDown}
      title="Drag to resize"
    >
      {/* Visible grab bar - always visible */}
      <div
        className={`
          w-1.5 h-24 rounded-full
          transition-all duration-150
          ${isResizing
            ? 'bg-blue-400 h-32 w-2'
            : 'bg-zinc-500 group-hover:bg-blue-400 group-hover:h-32'
          }
        `}
      />

      {/* Grip lines for better visibility */}
      <div className="absolute inset-y-0 left-0 right-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <div className={`w-0.5 h-2 rounded-full ${isResizing ? 'bg-blue-300' : 'bg-zinc-600 group-hover:bg-blue-300'}`} />
        <div className={`w-0.5 h-2 rounded-full ${isResizing ? 'bg-blue-300' : 'bg-zinc-600 group-hover:bg-blue-300'}`} />
        <div className={`w-0.5 h-2 rounded-full ${isResizing ? 'bg-blue-300' : 'bg-zinc-600 group-hover:bg-blue-300'}`} />
      </div>

      {/* Expanded hit area (invisible) */}
      <div className="absolute inset-y-0 -left-2 -right-2" />
    </div>
  );
};

export default ResizeHandle;
