/**
 * Shortcuts Help Modal
 *
 * Displays all available keyboard shortcuts organized by category.
 */

import React from 'react';
import { getShortcutsByCategory, formatShortcut, KeyBinding } from '../hooks/useKeyboardShortcuts';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, { label: string; icon: string }> = {
  navigation: { label: 'Navigation', icon: '🧭' },
  view: { label: 'View Modes', icon: '👁️' },
  editing: { label: 'Editing', icon: '✏️' },
  ai: { label: 'AI Features', icon: '🤖' },
  general: { label: 'General', icon: '⚙️' },
};

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutsByCategory = getShortcutsByCategory();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className="bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">⌨️</span>
            <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase mb-3">
                  <span>{categoryLabels[category]?.icon || '📋'}</span>
                  {categoryLabels[category]?.label || category}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, i) => (
                    <ShortcutRow key={i} binding={shortcut} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">?</kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
};

const ShortcutRow: React.FC<{ binding: KeyBinding }> = ({ binding }) => {
  const keys = formatShortcut(binding).split('+');

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-zinc-800/50 transition">
      <span className="text-sm text-zinc-300">{binding.description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <React.Fragment key={i}>
            <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 font-mono min-w-[24px] text-center">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="text-zinc-600 text-xs">+</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ShortcutsHelp;
