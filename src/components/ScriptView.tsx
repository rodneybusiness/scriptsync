/**
 * ScriptView - Main script editing and viewing component
 *
 * Features:
 * - Fountain syntax highlighting (view mode)
 * - Auto-save with debounce (2s after typing stops)
 * - Cmd+S manual save
 * - Dirty indicator (unsaved changes)
 * - Keyboard navigation (Shift+Arrow)
 * - Text size adjustment (Cmd+/-/0)
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, LintIssue } from '../config/types';
import { parseFountainToReact, lintScript } from '../services/scriptUtils';
import { SuggestionsIndicator } from './SuggestionsPanel';

// Auto-save delay in milliseconds
const AUTO_SAVE_DELAY = 2000;

interface ScriptViewProps {
  scene: Scene;
  allScenes: Scene[];
  onUpdateScript: (newContent: string) => void;
  onSelectScene: (scene: Scene) => void;
}

const ScriptView: React.FC<ScriptViewProps> = ({ scene, allScenes, onUpdateScript, onSelectScene }) => {
  const { config, sequences } = useProject();

  // Get current scene index for keyboard navigation
  const currentSceneIndex = useMemo(() =>
    allScenes.findIndex(s => s.id === scene.id),
    [allScenes, scene.id]
  );

  // Get current sequence for context
  const currentSequence = useMemo(() =>
    sequences.find(seq => seq.id === scene.sequenceId),
    [sequences, scene.sequenceId]
  );

  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [showLogline, setShowLogline] = useState(false);
  const [editContent, setEditContent] = useState(scene.scriptContent);
  const [activeVariant, setActiveVariant] = useState('A');

  // Dirty tracking (unsaved changes)
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(scene.scriptContent);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Text size (persisted) - scales from 0.8 to 1.4
  const [textScale, setTextScale] = useState(() => {
    const saved = localStorage.getItem('scriptsync-text-scale');
    return saved ? parseFloat(saved) : 1;
  });

  // Features
  const [paradoxWarning, setParadoxWarning] = useState<string | null>(null);
  const [lintIssues, setLintIssues] = useState<LintIssue[]>([]);

  // Save text scale preference
  useEffect(() => {
    localStorage.setItem('scriptsync-text-scale', textScale.toString());
  }, [textScale]);

  // --- EFFECTS ---

  // Sync content when scene changes or variant toggles
  useEffect(() => {
    const content = (scene.variants && scene.variants[activeVariant]) ? scene.variants[activeVariant] : scene.scriptContent;
    setEditContent(content);
    setLastSavedContent(content);
    setIsDirty(false);
    setSaveStatus('saved');
    setIsEditing(false);
    setParadoxWarning(null);
    setLintIssues([]);

    // Clear any pending auto-save when switching scenes
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, [scene.id, activeVariant, scene.scriptContent, scene.variants]);

  // Causal Ripple & Proactive Linter
  useEffect(() => {
    if (isEditing) {
      // Ripple Check
      if (scene.connections && scene.connections.length > 0) {
        const originalLength = scene.scriptContent.length;
        const currentLength = editContent.length;
        const diff = Math.abs(currentLength - originalLength);
        if (diff > 50) {
          setParadoxWarning("Significant edits detected. Check linked scenes for continuity.");
        } else {
          setParadoxWarning(null);
        }
      }

      // Proactive Linter (Debounced 1s)
      const timer = setTimeout(() => {
        const issues = lintScript(editContent, scene);
        setLintIssues(issues);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [editContent, isEditing, scene.connections, scene.scriptContent, scene]);

  // --- HANDLERS ---

  // Save current content
  const handleSave = useCallback(() => {
    if (editContent !== lastSavedContent) {
      setSaveStatus('saving');
      onUpdateScript(editContent);
      setLastSavedContent(editContent);
      setIsDirty(false);
      // Brief "saving" feedback then show "saved"
      setTimeout(() => setSaveStatus('saved'), 300);
    }
  }, [editContent, lastSavedContent, onUpdateScript]);

  // Handle content changes with dirty tracking and auto-save
  const handleContentChange = useCallback((newContent: string) => {
    setEditContent(newContent);

    // Mark as dirty if different from last saved
    if (newContent !== lastSavedContent) {
      setIsDirty(true);
      setSaveStatus('unsaved');
    } else {
      setIsDirty(false);
      setSaveStatus('saved');
    }

    // Clear existing auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new auto-save timer (only if content changed)
    if (newContent !== lastSavedContent) {
      autoSaveTimerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        onUpdateScript(newContent);
        setLastSavedContent(newContent);
        setIsDirty(false);
        setTimeout(() => setSaveStatus('saved'), 300);
      }, AUTO_SAVE_DELAY);
    }
  }, [lastSavedContent, onUpdateScript]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const getConnectedScene = (id: string) => allScenes.find(s => s.id === id);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cmd/Ctrl + S = Save (works in edit mode)
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (isEditing && isDirty) {
        handleSave();
      }
      return;
    }

    // Text size adjustment (works in any mode) - Cmd/Ctrl + Plus/Minus
    if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      setTextScale(prev => Math.min(1.4, prev + 0.1));
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '-') {
      e.preventDefault();
      setTextScale(prev => Math.max(0.8, prev - 0.1));
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '0') {
      e.preventDefault();
      setTextScale(1);
      return;
    }

    // Escape = Exit edit mode (save first if dirty)
    if (e.key === 'Escape' && isEditing) {
      e.preventDefault();
      if (isDirty) {
        handleSave();
      }
      setIsEditing(false);
      return;
    }

    // Only handle scene navigation when not editing
    if (isEditing) return;

    // Shift + Down Arrow = Next Scene
    if (e.shiftKey && e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentSceneIndex < allScenes.length - 1) {
        onSelectScene(allScenes[currentSceneIndex + 1]);
      }
    }

    // Shift + Up Arrow = Previous Scene
    if (e.shiftKey && e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentSceneIndex > 0) {
        onSelectScene(allScenes[currentSceneIndex - 1]);
      }
    }

    // Shift + Left Arrow = First scene in current sequence
    if (e.shiftKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      const sequenceScenes = allScenes.filter(s => s.sequenceId === scene.sequenceId);
      if (sequenceScenes.length > 0) {
        onSelectScene(sequenceScenes[0]);
      }
    }

    // Shift + Right Arrow = Last scene in current sequence
    if (e.shiftKey && e.key === 'ArrowRight') {
      e.preventDefault();
      const sequenceScenes = allScenes.filter(s => s.sequenceId === scene.sequenceId);
      if (sequenceScenes.length > 0) {
        onSelectScene(sequenceScenes[sequenceScenes.length - 1]);
      }
    }

    // 'e' key to enter edit mode
    if (e.key === 'e' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      setIsEditing(true);
    }
  }, [isEditing, isDirty, handleSave, currentSceneIndex, allScenes, onSelectScene, scene.sequenceId]);

  // Register keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex-1 bg-zinc-950 overflow-hidden relative flex flex-col h-full">

      {/* Main Scroll Area */}
      <div className="flex-1 overflow-y-auto flex">

        {/* LEFT MARGIN: Causal Ripple Engine */}
        <div className="w-16 border-r border-zinc-800/50 flex flex-col items-center py-8 bg-zinc-950/50 shrink-0 z-20">
          {scene.connections?.map((conn, idx) => {
            const target = getConnectedScene(conn.targetSceneId);
            const isRisk = paradoxWarning && conn.type === 'causal';

            return (
              <div key={idx} className="mb-8 relative group flex flex-col items-center">
                <div className={`w-px h-8 mb-2 ${isRisk ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                <button
                  onClick={() => target && onSelectScene(target)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all relative z-10 ${
                    conn.type === 'causal'
                      ? isRisk ? 'bg-red-900 text-red-100 border-red-500 animate-pulse' : 'bg-red-900/20 text-red-400 border-red-900/50'
                      : conn.type === 'echo'
                        ? 'bg-blue-900/20 text-blue-400 border-blue-900/50'
                        : 'bg-purple-900/20 text-purple-400 border-purple-900/50'
                  }`}
                >
                  {idx + 1}
                </button>
                {/* Tooltip */}
                <div className="absolute left-10 top-0 w-48 bg-zinc-900 border border-zinc-700 p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition z-50">
                  <p className="text-[10px] font-bold uppercase mb-1 text-zinc-500">{conn.type} Link</p>
                  <p className="text-xs text-zinc-200 mb-2">{conn.description}</p>
                  {target && (
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                      <span className="text-[10px] font-mono text-blue-400">{target.id}</span>
                      <span className="text-[10px] text-zinc-400 truncate">{target.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER: Script Page - Full width with responsive padding */}
        <div className="flex-1 py-8 px-6 md:px-10 lg:px-16 relative">

          {/* Logline Context Banner */}
          {config.logline && showLogline && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-900/30 relative">
              <button
                onClick={() => setShowLogline(false)}
                className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
              <p className="text-[10px] text-blue-400 uppercase tracking-wide mb-1 font-bold">Logline</p>
              <p className="text-sm text-zinc-300 leading-relaxed pr-6">{config.logline}</p>
            </div>
          )}

          {!showLogline && config.logline && (
            <button
              onClick={() => setShowLogline(true)}
              className="mb-4 text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-wide"
            >
              Show Logline
            </button>
          )}

          {/* Header & Toolbar - Minimal, clean design */}
          <div className="mb-6 sticky top-0 bg-zinc-950/95 backdrop-blur z-10 pb-4">
            {paradoxWarning && (
              <div className="mb-3 text-amber-400/80 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {paradoxWarning}
              </div>
            )}

            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Scene Title - Primary focus */}
                <h1 className="text-2xl font-bold text-zinc-100 mb-1 tracking-tight">{scene.title}</h1>

                {/* Subtle context line */}
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="font-mono">{scene.id}</span>
                  {currentSequence && (
                    <>
                      <span className="text-zinc-700">|</span>
                      <span className="italic truncate max-w-md">{currentSequence.dramaticQuestion}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Edit/Save button with status indicator */}
              <div className="flex items-center gap-3">
                {/* Save status indicator - only in edit mode */}
                {isEditing && (
                  <span className={`text-[10px] flex items-center gap-1.5 transition-opacity ${
                    saveStatus === 'saved' ? 'text-zinc-500' :
                    saveStatus === 'saving' ? 'text-blue-400' :
                    'text-amber-400'
                  }`}>
                    {saveStatus === 'saving' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    )}
                    {saveStatus === 'unsaved' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                    {saveStatus === 'saved' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    )}
                    {saveStatus === 'saving' ? 'Saving...' :
                     saveStatus === 'unsaved' ? 'Unsaved' :
                     'Saved'}
                  </span>
                )}
                <button
                  onClick={() => isEditing ? (isDirty ? handleSave() : setIsEditing(false)) : setIsEditing(true)}
                  className={`text-xs px-4 py-1.5 rounded transition ${
                    isEditing
                      ? isDirty
                        ? 'bg-emerald-600/90 text-white font-medium'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  {isEditing ? (isDirty ? 'Save' : 'Done') : 'Edit'}
                </button>
              </div>
            </div>

            {/* Linter warnings - only when editing */}
            {lintIssues.length > 0 && isEditing && (
              <div className="mt-3 text-xs text-amber-500/70 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {lintIssues.length} style suggestion{lintIssues.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* AI Suggestions - subtle indicator */}
            <div className="mt-2">
              <SuggestionsIndicator sceneId={scene.id} />
            </div>
          </div>

          {/* Branching Realities Tabs */}
          {scene.variants && (
            <div className="flex mb-6 gap-4">
              <button
                onClick={() => setActiveVariant('A')}
                className={`text-xs transition ${activeVariant === 'A' ? 'text-zinc-200 underline underline-offset-4' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Version A
              </button>
              <button
                onClick={() => setActiveVariant('B')}
                className={`text-xs transition ${activeVariant === 'B' ? 'text-zinc-200 underline underline-offset-4' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Version B
              </button>
            </div>
          )}

          {/* Script Content - Dark theme, full panel, responsive with text scaling */}
          <div className="flex-1 relative">
            {isEditing ? (
              <div className="relative h-full border border-zinc-700/50 rounded-lg bg-zinc-900/30">
                {/* Linter Highlights */}
                <div className="absolute left-2 top-6 bottom-6 w-4 flex flex-col items-end">
                  {lintIssues.map(issue => (
                    <div
                      key={issue.id}
                      className="absolute right-0 w-1.5 h-1.5 rounded-full bg-amber-500/70 cursor-help group"
                      style={{ top: `${(issue.line * 1.6 * textScale) + 0.5}rem` }}
                    >
                      <div className="absolute left-4 top-0 w-48 bg-zinc-800 text-xs p-2 rounded border border-zinc-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                        <span className="text-amber-400 block mb-1">{issue.type}</span>
                        <span className="text-zinc-400">{issue.message}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <textarea
                  value={editContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full min-h-[600px] bg-transparent text-zinc-200 font-script leading-relaxed border-none focus:ring-0 resize-none outline-none p-8 pl-10"
                  style={{ fontSize: `${13 * textScale}px` }}
                  spellCheck={false}
                  autoFocus
                />
              </div>
            ) : (
              /* Dark theme screenplay page with subtle border */
              <div className="h-full border border-zinc-800 rounded-lg bg-zinc-900/50 overflow-y-auto">
                {/* Page content with screenplay margins - text scale applied */}
                <div
                  className="px-6 md:px-10 lg:px-16 py-8"
                  style={{ fontSize: `${textScale}em` }}
                >
                  {editContent.split('\n').map((line, i) => {
                    const { content, classes } = parseFountainToReact(line, i);
                    return (
                      <div key={i} className={classes}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-[10px] text-zinc-600 flex flex-wrap gap-x-4 gap-y-1">
            <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">Shift</kbd> + <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">e</kbd> Edit</span>
            <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">⌘S</kbd> Save</span>
            <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">Esc</kbd> Done</span>
            <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">⌘</kbd><kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">+/-</kbd> Text size</span>
            <span className="text-zinc-700 ml-2">Auto-saves after 2s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptView;
