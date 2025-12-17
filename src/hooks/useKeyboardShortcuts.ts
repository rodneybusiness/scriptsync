/**
 * Keyboard Shortcuts Hook
 *
 * Global keyboard shortcut system with customizable bindings.
 */

import { useEffect, useCallback, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface KeyBinding {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  category: 'navigation' | 'editing' | 'view' | 'ai' | 'general';
}

export interface ShortcutAction {
  binding: KeyBinding;
  action: () => void;
  enabled?: boolean;
}

// =============================================================================
// DEFAULT SHORTCUTS
// =============================================================================

export const DEFAULT_SHORTCUTS: Record<string, KeyBinding> = {
  // Navigation
  prevScene: { key: 'ArrowUp', ctrl: true, description: 'Previous scene', category: 'navigation' },
  nextScene: { key: 'ArrowDown', ctrl: true, description: 'Next scene', category: 'navigation' },
  firstScene: { key: 'Home', ctrl: true, description: 'First scene', category: 'navigation' },
  lastScene: { key: 'End', ctrl: true, description: 'Last scene', category: 'navigation' },
  goToScene: { key: 'g', ctrl: true, description: 'Go to scene...', category: 'navigation' },

  // View modes
  viewScript: { key: '1', ctrl: true, description: 'Script view', category: 'view' },
  viewBoard: { key: '2', ctrl: true, description: 'Beat board', category: 'view' },
  viewTimeline: { key: '3', ctrl: true, description: 'Timeline view', category: 'view' },
  viewCharacters: { key: '4', ctrl: true, description: 'Character arcs', category: 'view' },

  // Editing
  save: { key: 's', ctrl: true, description: 'Save now', category: 'editing' },
  undo: { key: 'z', ctrl: true, description: 'Undo', category: 'editing' },
  redo: { key: 'z', ctrl: true, shift: true, description: 'Redo', category: 'editing' },
  addNote: { key: 'n', ctrl: true, shift: true, description: 'Add note', category: 'editing' },
  addBeat: { key: 'b', ctrl: true, shift: true, description: 'Add beat', category: 'editing' },

  // AI
  analyzeScene: { key: 'a', ctrl: true, shift: true, description: 'AI analyze scene', category: 'ai' },
  aiChat: { key: '/', ctrl: true, description: 'Open AI chat', category: 'ai' },

  // General
  export: { key: 'e', ctrl: true, shift: true, description: 'Export', category: 'general' },
  help: { key: '?', shift: true, description: 'Show shortcuts', category: 'general' },
  escape: { key: 'Escape', description: 'Close/cancel', category: 'general' },
  search: { key: 'f', ctrl: true, description: 'Search', category: 'general' },
  projects: { key: 'p', ctrl: true, shift: true, description: 'Project manager', category: 'general' },
};

// =============================================================================
// HOOK
// =============================================================================

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (
  shortcuts: ShortcutAction[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Skip if typing in input/textarea
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow certain shortcuts even in inputs
      const allowInInput = ['Escape', 's'];
      if (!allowInInput.includes(event.key) || !event.ctrlKey) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      if (shortcut.enabled === false) continue;

      const { binding, action } = shortcut;
      const matches =
        event.key.toLowerCase() === binding.key.toLowerCase() &&
        !!event.ctrlKey === !!binding.ctrl &&
        !!event.altKey === !!binding.alt &&
        !!event.shiftKey === !!binding.shift &&
        !!event.metaKey === !!binding.meta;

      if (matches) {
        if (preventDefault) {
          event.preventDefault();
        }
        action();
        return;
      }
    }
  }, [enabled, shortcuts, preventDefault]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// =============================================================================
// SHORTCUTS HELP MODAL HOOK
// =============================================================================

export const useShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Register ? shortcut
  useKeyboardShortcuts([
    {
      binding: DEFAULT_SHORTCUTS.help,
      action: toggle,
    },
    {
      binding: DEFAULT_SHORTCUTS.escape,
      action: close,
      enabled: isOpen,
    },
  ]);

  return { isOpen, toggle, open, close };
};

// =============================================================================
// FORMAT SHORTCUT
// =============================================================================

export const formatShortcut = (binding: KeyBinding): string => {
  const parts: string[] = [];

  if (binding.ctrl) parts.push('Ctrl');
  if (binding.alt) parts.push('Alt');
  if (binding.shift) parts.push('Shift');
  if (binding.meta) parts.push('Cmd');

  // Format key nicely
  let key = binding.key;
  if (key === ' ') key = 'Space';
  else if (key === 'ArrowUp') key = '↑';
  else if (key === 'ArrowDown') key = '↓';
  else if (key === 'ArrowLeft') key = '←';
  else if (key === 'ArrowRight') key = '→';
  else if (key.length === 1) key = key.toUpperCase();

  parts.push(key);

  return parts.join('+');
};

// =============================================================================
// SHORTCUTS BY CATEGORY
// =============================================================================

export const getShortcutsByCategory = (): Record<string, KeyBinding[]> => {
  const categories: Record<string, KeyBinding[]> = {
    navigation: [],
    view: [],
    editing: [],
    ai: [],
    general: [],
  };

  Object.values(DEFAULT_SHORTCUTS).forEach(binding => {
    categories[binding.category].push(binding);
  });

  return categories;
};

export default useKeyboardShortcuts;
