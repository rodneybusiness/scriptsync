/**
 * useColumnLayout - Manages resizable, reorderable columns
 *
 * Handles column widths, ordering, drag-and-drop reordering,
 * and persists settings to localStorage.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export type ColumnId = 'navigation' | 'script' | 'context';

export interface ColumnConfig {
  id: ColumnId;
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
}

export interface ColumnState {
  id: ColumnId;
  width: number;
}

const COLUMN_CONFIGS: Record<ColumnId, ColumnConfig> = {
  navigation: { id: 'navigation', minWidth: 200, maxWidth: 400, defaultWidth: 288 },
  script: { id: 'script', minWidth: 400, maxWidth: 2000, defaultWidth: 0 }, // 0 = flex
  context: { id: 'context', minWidth: 280, maxWidth: 600, defaultWidth: 384 },
};

const DEFAULT_ORDER: ColumnId[] = ['navigation', 'script', 'context'];
const STORAGE_KEY = 'scriptsync-column-layout';

interface StoredLayout {
  order: ColumnId[];
  widths: Record<ColumnId, number>;
}

function loadFromStorage(): StoredLayout | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveToStorage(layout: StoredLayout) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // Ignore storage errors
  }
}

export function useColumnLayout() {
  const stored = loadFromStorage();

  const [columnOrder, setColumnOrder] = useState<ColumnId[]>(
    stored?.order || DEFAULT_ORDER
  );

  const [columnWidths, setColumnWidths] = useState<Record<ColumnId, number>>(() => {
    const defaults: Record<ColumnId, number> = {
      navigation: COLUMN_CONFIGS.navigation.defaultWidth,
      script: COLUMN_CONFIGS.script.defaultWidth,
      context: COLUMN_CONFIGS.context.defaultWidth,
    };
    if (stored?.widths) {
      return { ...defaults, ...stored.widths };
    }
    return defaults;
  });

  // Dragging state for reordering
  const [draggedColumn, setDraggedColumn] = useState<ColumnId | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

  // Resizing state
  const [resizingColumn, setResizingColumn] = useState<ColumnId | null>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  // Persist to localStorage
  useEffect(() => {
    saveToStorage({ order: columnOrder, widths: columnWidths });
  }, [columnOrder, columnWidths]);

  // Handle resize start
  const startResize = useCallback((columnId: ColumnId, clientX: number) => {
    setResizingColumn(columnId);
    resizeStartX.current = clientX;
    resizeStartWidth.current = columnWidths[columnId];
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [columnWidths]);

  // Handle resize move
  const handleResizeMove = useCallback((clientX: number) => {
    if (!resizingColumn) return;

    const config = COLUMN_CONFIGS[resizingColumn];
    const delta = clientX - resizeStartX.current;
    const newWidth = Math.max(
      config.minWidth,
      Math.min(config.maxWidth, resizeStartWidth.current + delta)
    );

    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth,
    }));
  }, [resizingColumn]);

  // Handle resize end
  const endResize = useCallback(() => {
    setResizingColumn(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Global mouse events for resizing
  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleResizeMove(e.clientX);
    };

    const handleMouseUp = () => {
      endResize();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, handleResizeMove, endResize]);

  // Handle drag start for reordering
  const startDrag = useCallback((columnId: ColumnId) => {
    setDraggedColumn(columnId);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((columnId: ColumnId) => {
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  }, [draggedColumn]);

  // Handle drop for reordering
  const handleDrop = useCallback((targetColumnId: ColumnId) => {
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    setColumnOrder(prev => {
      const newOrder = [...prev];
      const dragIndex = newOrder.indexOf(draggedColumn);
      const dropIndex = newOrder.indexOf(targetColumnId);

      // Remove dragged item
      newOrder.splice(dragIndex, 1);
      // Insert at new position
      newOrder.splice(dropIndex, 0, draggedColumn);

      return newOrder;
    });

    setDraggedColumn(null);
    setDragOverColumn(null);
  }, [draggedColumn]);

  // End drag without drop
  const endDrag = useCallback(() => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, []);

  // Reset to defaults
  const resetLayout = useCallback(() => {
    setColumnOrder(DEFAULT_ORDER);
    setColumnWidths({
      navigation: COLUMN_CONFIGS.navigation.defaultWidth,
      script: COLUMN_CONFIGS.script.defaultWidth,
      context: COLUMN_CONFIGS.context.defaultWidth,
    });
  }, []);

  // Get column style
  const getColumnStyle = useCallback((columnId: ColumnId): React.CSSProperties => {
    const width = columnWidths[columnId];
    if (columnId === 'script' || width === 0) {
      return { flex: 1, minWidth: COLUMN_CONFIGS[columnId].minWidth };
    }
    return { width, flexShrink: 0 };
  }, [columnWidths]);

  return {
    columnOrder,
    columnWidths,
    draggedColumn,
    dragOverColumn,
    resizingColumn,
    startResize,
    startDrag,
    handleDragOver,
    handleDrop,
    endDrag,
    resetLayout,
    getColumnStyle,
    configs: COLUMN_CONFIGS,
  };
}
