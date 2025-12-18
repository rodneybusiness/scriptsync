/**
 * Navigation - Scene browser sidebar
 *
 * Uses project context for sequences - no hard-coded data.
 * Features: scene badges, quick filters, page estimates, status indicators
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, SceneStatus } from '../config/types';

/** Confirm dialog state */
interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}
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
}

/** Status options with styling */
const STATUS_OPTIONS: { value: SceneStatus; label: string; icon: string; color: string }[] = [
  { value: 'draft', label: 'Draft', icon: '○', color: 'text-zinc-400 bg-zinc-800/50' },
  { value: 'review', label: 'Review', icon: '◎', color: 'text-amber-400 bg-amber-900/30' },
  { value: 'polished', label: 'Polished', icon: '◆', color: 'text-blue-400 bg-blue-900/30' },
  { value: 'locked', label: 'Locked', icon: '✓', color: 'text-emerald-400 bg-emerald-900/30' },
];

/** Drag state for scene reordering */
interface DragState {
  sceneId: string;
  sourceSequenceId: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentSceneId, onSelectScene }) => {
  const { config, sequences, addScene, deleteScene, addSequence, deleteSequence, moveScene, reorderScene, updateScene, duplicateScene, canUndo, canRedo, undo, redo } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [statusMenuSceneId, setStatusMenuSceneId] = useState<string | null>(null);

  // Drag-and-drop state
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropTargetInfo, setDropTargetInfo] = useState<{ sequenceId: string; index: number } | null>(null);

  // Inline editing state
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Collapsed sequences state
  const [collapsedSequences, setCollapsedSequences] = useState<Set<string>>(new Set());

  // Keyboard shortcuts help modal
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Close status menu when clicking outside
  useEffect(() => {
    if (!statusMenuSceneId) return;
    const handleClick = () => setStatusMenuSceneId(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [statusMenuSceneId]);

  // Close confirmation dialog
  const closeConfirm = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Add a new scene to a sequence
  const handleAddScene = useCallback((sequenceId: string, afterSceneId?: string) => {
    const newScene = addScene(sequenceId, afterSceneId);
    onSelectScene(newScene);
  }, [addScene, onSelectScene]);

  // Delete a scene with confirmation
  const handleDeleteScene = useCallback((sceneId: string, sceneTitle: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Scene',
      message: `Are you sure you want to delete "${sceneTitle}"? This cannot be undone.`,
      onConfirm: () => {
        deleteScene(sceneId);
        closeConfirm();
      },
    });
  }, [deleteScene, closeConfirm]);

  // Add a new sequence
  const handleAddSequence = useCallback(() => {
    addSequence();
  }, [addSequence]);

  // Delete a sequence with confirmation
  const handleDeleteSequence = useCallback((sequenceId: string, sequenceTitle: string, sceneCount: number) => {
    if (sequences.length <= 1) {
      setConfirmDialog({
        isOpen: true,
        title: 'Cannot Delete',
        message: 'You must have at least one sequence in your project.',
        onConfirm: closeConfirm,
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Sequence',
      message: `Are you sure you want to delete "${sequenceTitle}"${sceneCount > 0 ? ` and its ${sceneCount} scene${sceneCount > 1 ? 's' : ''}` : ''}? This cannot be undone.`,
      onConfirm: () => {
        deleteSequence(sequenceId);
        closeConfirm();
      },
    });
  }, [sequences.length, deleteSequence, closeConfirm]);

  // Change scene status
  const handleStatusChange = useCallback((sceneId: string, status: SceneStatus) => {
    updateScene(sceneId, { status });
    setStatusMenuSceneId(null);
  }, [updateScene]);

  // Duplicate a scene
  const handleDuplicateScene = useCallback((sceneId: string) => {
    const newScene = duplicateScene(sceneId);
    if (newScene) {
      onSelectScene(newScene);
    }
  }, [duplicateScene, onSelectScene]);

  // Inline title editing handlers
  const startEditingTitle = useCallback((sceneId: string, currentTitle: string) => {
    setEditingSceneId(sceneId);
    setEditingTitle(currentTitle);
    // Focus input after render
    setTimeout(() => editInputRef.current?.focus(), 0);
  }, []);

  const saveEditingTitle = useCallback(() => {
    if (editingSceneId && editingTitle.trim()) {
      updateScene(editingSceneId, { title: editingTitle.trim() });
    }
    setEditingSceneId(null);
    setEditingTitle('');
  }, [editingSceneId, editingTitle, updateScene]);

  const cancelEditingTitle = useCallback(() => {
    setEditingSceneId(null);
    setEditingTitle('');
  }, []);

  // Toggle sequence collapse
  const toggleSequenceCollapse = useCallback((sequenceId: string) => {
    setCollapsedSequences(prev => {
      const next = new Set(prev);
      if (next.has(sequenceId)) {
        next.delete(sequenceId);
      } else {
        next.add(sequenceId);
      }
      return next;
    });
  }, []);

  // Drag-and-drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, sceneId: string, sequenceId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sceneId);
    setDragState({ sceneId, sourceSequenceId: sequenceId });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
    setDropTargetInfo(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, sequenceId: string, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetInfo({ sequenceId, index });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTargetInfo(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetSequenceId: string, targetIndex: number) => {
    e.preventDefault();
    if (dragState) {
      reorderScene(dragState.sceneId, targetSequenceId, targetIndex);
    }
    setDragState(null);
    setDropTargetInfo(null);
  }, [dragState, reorderScene]);

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

  // Flat list of all visible scenes for keyboard navigation
  const allVisibleScenes = useMemo(() => {
    return filteredData.flatMap(seq => seq.scenes);
  }, [filteredData]);

  // Keyboard navigation state
  const [focusedSceneId, setFocusedSceneId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Register scene button ref
  const setSceneRef = useCallback((sceneId: string, el: HTMLButtonElement | null) => {
    if (el) {
      sceneRefs.current.set(sceneId, el);
    } else {
      sceneRefs.current.delete(sceneId);
    }
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (confirmDialog.isOpen) return; // Don't navigate when dialog is open

    const scenes = allVisibleScenes;
    if (scenes.length === 0) return;

    const currentIndex = focusedSceneId
      ? scenes.findIndex(s => s.id === focusedSceneId)
      : scenes.findIndex(s => s.id === currentSceneId);

    switch (e.key) {
      case 'ArrowDown':
      case 'j': // Vim-style navigation
        e.preventDefault();
        if (currentIndex < scenes.length - 1) {
          const nextScene = scenes[currentIndex + 1];
          setFocusedSceneId(nextScene.id);
          const el = sceneRefs.current.get(nextScene.id);
          el?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
        } else if (currentIndex === -1 && scenes.length > 0) {
          setFocusedSceneId(scenes[0].id);
        }
        break;

      case 'ArrowUp':
      case 'k': // Vim-style navigation
        e.preventDefault();
        if (currentIndex > 0) {
          const prevScene = scenes[currentIndex - 1];
          setFocusedSceneId(prevScene.id);
          const el = sceneRefs.current.get(prevScene.id);
          el?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
        } else if (currentIndex === -1 && scenes.length > 0) {
          setFocusedSceneId(scenes[scenes.length - 1].id);
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedSceneId) {
          const scene = scenes.find(s => s.id === focusedSceneId);
          if (scene) {
            onSelectScene(scene);
            setFocusedSceneId(null);
          }
        }
        break;

      case 'Escape':
        setFocusedSceneId(null);
        containerRef.current?.blur();
        break;

      case 'Home':
        e.preventDefault();
        if (scenes.length > 0) {
          setFocusedSceneId(scenes[0].id);
          const el = sceneRefs.current.get(scenes[0].id);
          el?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
        }
        break;

      case 'End':
        e.preventDefault();
        if (scenes.length > 0) {
          const lastScene = scenes[scenes.length - 1];
          setFocusedSceneId(lastScene.id);
          const el = sceneRefs.current.get(lastScene.id);
          el?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
        }
        break;

      case '?':
        e.preventDefault();
        setShowShortcutsHelp(true);
        break;

      case 'F2':
      case 'e':
        // Edit the focused or selected scene title
        e.preventDefault();
        const sceneToEdit = focusedSceneId
          ? scenes.find(s => s.id === focusedSceneId)
          : scenes.find(s => s.id === currentSceneId);
        if (sceneToEdit) {
          startEditingTitle(sceneToEdit.id, sceneToEdit.title);
        }
        break;

      case 'd':
        // Duplicate the focused or selected scene
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          const sceneToDuplicate = focusedSceneId || currentSceneId;
          if (sceneToDuplicate) {
            handleDuplicateScene(sceneToDuplicate);
          }
        }
        break;
    }
  }, [allVisibleScenes, focusedSceneId, currentSceneId, onSelectScene, confirmDialog.isOpen, startEditingTitle, handleDuplicateScene]);

  // Clear focus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocusedSceneId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full bg-transparent flex flex-col h-full font-sans outline-none focus:ring-1 focus:ring-blue-500/30"
      role="listbox"
      aria-label="Scene list"
      aria-activedescendant={focusedSceneId || currentSceneId}
    >
      <div className="p-4 border-b border-zinc-800">
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

        {/* Undo/Redo buttons - only show if there's history */}
        {(canUndo || canRedo) && (
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-zinc-800">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded transition ${
                canUndo
                  ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  : 'text-zinc-700 cursor-not-allowed'
              }`}
              title="Undo (Cmd+Z)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded transition ${
                canRedo
                  ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  : 'text-zinc-700 cursor-not-allowed'
              }`}
              title="Redo (Cmd+Shift+Z)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
              Redo
            </button>
          </div>
        )}

      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-zinc-500">
            {sequences.flatMap(s => s.scenes).length === 0 ? (
              <>
                <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p className="text-xs font-medium mb-1">Your script is empty</p>
                <p className="text-[10px] text-zinc-600">
                  Start writing in the editor, or import a screenplay
                </p>
              </>
            ) : searchQuery ? (
              <span className="text-xs italic">No scenes found matching "{searchQuery}"</span>
            ) : (
              <span className="text-xs italic">No scenes match the selected filter</span>
            )}
          </div>
        ) : (
          filteredData.map((seq) => (
            <div key={seq.id} className="mb-6">
              <div className="px-3 py-1 mb-2 flex justify-between items-center group/seq">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate" title={seq.title}>
                  {seq.title.split(':')[0]}
                </h2>
                <div className="flex items-center gap-1 opacity-0 group-hover/seq:opacity-100 transition-opacity">
                  {/* Add scene to this sequence */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddScene(seq.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-900/30 rounded transition"
                    title="Add scene to this sequence"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  {/* Delete sequence */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSequence(seq.id, seq.title, seq.scenes.length);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-900/30 rounded transition"
                    title="Delete sequence"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                className="space-y-0.5"
                onDragOver={(e) => {
                  // Only show end drop zone if we're dragging and this sequence has scenes
                  if (dragState && seq.scenes.length > 0) {
                    handleDragOver(e, seq.id, seq.scenes.length);
                  }
                }}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  if (dragState) {
                    handleDrop(e, seq.id, seq.scenes.length);
                  }
                }}
              >
                {seq.scenes.map((scene, sceneIndex) => {
                  const pacingScore = calculatePacingScore(scene.scriptContent);
                  const pacingColor = getPacingColor(pacingScore);
                  const pages = estimatePages(scene.scriptContent);
                  const completedBeats = scene.beats.filter(b => b.completed).length;
                  const totalBeats = scene.beats.length;
                  const statusStyle = getStatusStyle(scene.status);
                  const canMoveUp = sceneIndex > 0;
                  const canMoveDown = sceneIndex < seq.scenes.length - 1;
                  const isFocused = focusedSceneId === scene.id;
                  const isSelected = currentSceneId === scene.id;

                  const isDragging = dragState?.sceneId === scene.id;
                  const isDropTarget = dropTargetInfo?.sequenceId === seq.id && dropTargetInfo?.index === sceneIndex;

                  return (
                    <div key={scene.id} className="relative group/scene">
                      {/* Drop zone indicator (above scene) */}
                      {isDropTarget && (
                        <div className="absolute -top-1 left-2 right-2 h-0.5 bg-blue-500 rounded-full z-10" />
                      )}
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, scene.id, seq.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, seq.id, sceneIndex)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, seq.id, sceneIndex)}
                        className={`${isDragging ? 'opacity-50' : ''}`}
                      >
                        <button
                          ref={(el) => setSceneRef(scene.id, el)}
                          id={scene.id}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            onSelectScene(scene);
                            setFocusedSceneId(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all relative cursor-grab active:cursor-grabbing ${
                            isSelected
                              ? 'bg-zinc-900 text-white shadow-sm'
                              : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                          } ${
                            isFocused && !isSelected
                              ? 'ring-2 ring-blue-500/50 bg-zinc-900/50'
                              : ''
                          }`}
                        >
                        {/* Pacing Heatmap Indicator (Left Border) */}
                        <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-50 group-hover/scene:opacity-100 transition ${pacingColor} ${isSelected || isFocused ? 'opacity-100' : ''}`}></div>

                        <div className="flex items-center justify-between pl-2">
                          <span className="truncate text-xs font-medium flex-1">
                            {scene.id} <span className={isSelected ? 'text-blue-400' : isFocused ? 'text-blue-300' : 'text-zinc-500'}>|</span> {scene.title.split(':')[1] || scene.title}
                          </span>

                          {/* Scene Badges - compact row */}
                          <div className="flex items-center gap-1.5 ml-2 shrink-0">
                            {/* Page estimate */}
                            <span className="text-[9px] text-zinc-600 group-hover/scene:hidden" title={`${pages} page${pages !== 1 ? 's' : ''}`}>
                              {pages}p
                            </span>

                            {/* Notes badge */}
                            {scene.notes.length > 0 && (
                              <span
                                className="w-4 h-4 flex items-center justify-center bg-amber-900/40 text-amber-400 text-[9px] rounded-full group-hover/scene:hidden"
                                title={`${scene.notes.length} note${scene.notes.length !== 1 ? 's' : ''}`}
                              >
                                {scene.notes.length}
                              </span>
                            )}

                            {/* Beats progress */}
                            {totalBeats > 0 && (
                              <span
                                className={`text-[9px] group-hover/scene:hidden ${
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
                                className={`px-1 py-0.5 text-[8px] rounded group-hover/scene:hidden ${statusStyle.bg} ${statusStyle.text}`}
                                title={statusStyle.label}
                              >
                                {scene.status === 'locked' ? '✓' : scene.status === 'polished' ? '◆' : '○'}
                              </span>
                            )}
                          </div>
                        </div>
                        </button>
                      </div>

                      {/* Scene action buttons - appear on hover */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/scene:opacity-100 transition-opacity">
                        {/* Move up */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveScene(scene.id, 'up');
                          }}
                          disabled={!canMoveUp}
                          className={`p-1 rounded transition ${
                            canMoveUp
                              ? 'text-zinc-500 hover:text-blue-400 hover:bg-blue-900/30'
                              : 'text-zinc-700 cursor-not-allowed'
                          }`}
                          title="Move scene up"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        {/* Move down */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveScene(scene.id, 'down');
                          }}
                          disabled={!canMoveDown}
                          className={`p-1 rounded transition ${
                            canMoveDown
                              ? 'text-zinc-500 hover:text-blue-400 hover:bg-blue-900/30'
                              : 'text-zinc-700 cursor-not-allowed'
                          }`}
                          title="Move scene down"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Status toggle */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusMenuSceneId(statusMenuSceneId === scene.id ? null : scene.id);
                            }}
                            className={`p-1 rounded transition ${
                              STATUS_OPTIONS.find(s => s.value === (scene.status || 'draft'))?.color || 'text-zinc-500'
                            } hover:ring-1 hover:ring-zinc-600`}
                            title={`Status: ${scene.status || 'draft'}`}
                          >
                            <span className="text-[10px] font-bold">
                              {STATUS_OPTIONS.find(s => s.value === (scene.status || 'draft'))?.icon || '○'}
                            </span>
                          </button>
                          {/* Status dropdown menu */}
                          {statusMenuSceneId === scene.id && (
                            <div
                              className="absolute right-0 top-full mt-1 z-50 bg-zinc-900 border border-zinc-700 rounded-md shadow-xl py-1 min-w-[120px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(scene.id, opt.value);
                                  }}
                                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-zinc-800 transition ${
                                    (scene.status || 'draft') === opt.value ? 'bg-zinc-800' : ''
                                  }`}
                                >
                                  <span className={opt.color.split(' ')[0]}>{opt.icon}</span>
                                  <span className="text-zinc-300">{opt.label}</span>
                                  {(scene.status || 'draft') === opt.value && (
                                    <svg className="w-3 h-3 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Duplicate scene */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateScene(scene.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-purple-400 hover:bg-purple-900/30 rounded transition"
                          title="Duplicate scene"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {/* Add scene after this one */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddScene(seq.id, scene.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-900/30 rounded transition"
                          title="Add scene after this one"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        {/* Delete scene */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScene(scene.id, scene.title);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-900/30 rounded transition"
                          title="Delete scene"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
                {/* End drop zone indicator */}
                {dropTargetInfo?.sequenceId === seq.id && dropTargetInfo?.index === seq.scenes.length && (
                  <div className="h-0.5 bg-blue-500 rounded-full mx-2 my-1" />
                )}
              </div>
            </div>
          ))
        )}

        {/* Add Sequence Button */}
        <div className="px-3 py-2">
          <button
            onClick={handleAddSequence}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-900/20 border border-dashed border-zinc-700 hover:border-emerald-600/50 rounded-md text-xs transition"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Sequence
          </button>
        </div>

        {/* Genre Tags - at bottom */}
        {config.genres && config.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4 px-3 pb-2">
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

      {/* Confirmation Dialog Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl max-w-sm w-full mx-4 p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2">
              {confirmDialog.title}
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeConfirm}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className={`px-3 py-1.5 text-xs rounded transition ${
                  confirmDialog.title === 'Cannot Delete'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {confirmDialog.title === 'Cannot Delete' ? 'OK' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
