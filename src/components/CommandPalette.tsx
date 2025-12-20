/**
 * CommandPalette - Quick access to all app actions via ⌘K
 *
 * Provides fuzzy search across:
 * - Navigation (scenes, sequences)
 * - Views (timeline, characters, board, tracker, plants)
 * - Actions (export, settings, AI features)
 * - Characters
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene } from '../config/types';

type CommandCategory = 'navigation' | 'view' | 'action' | 'character' | 'ai';

interface Command {
  id: string;
  label: string;
  description?: string;
  category: CommandCategory;
  icon: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScene: (scene: Scene) => void;
  onChangeView: (view: string) => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  allScenes: Scene[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectScene,
  onChangeView,
  onOpenExport,
  onOpenSettings,
  allScenes,
}) => {
  const { config, sequences } = useProject();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build command list
  const commands = useMemo((): Command[] => {
    const cmds: Command[] = [];

    // View commands
    cmds.push(
      { id: 'view-script', label: 'Go to Script', category: 'view', icon: '📝', action: () => onChangeView('script'), keywords: ['editor', 'write'] },
      { id: 'view-timeline', label: 'Go to Timeline', category: 'view', icon: '📊', action: () => onChangeView('timeline'), keywords: ['structure', 'acts'] },
      { id: 'view-characters', label: 'Go to Characters', category: 'view', icon: '👥', action: () => onChangeView('characters'), keywords: ['cast', 'actors'] },
      { id: 'view-board', label: 'Go to Beat Board', category: 'view', icon: '🎯', action: () => onChangeView('board'), keywords: ['beats', 'kanban'] },
      { id: 'view-tracker', label: 'Go to Rewrite Tracker', category: 'view', icon: '📋', action: () => onChangeView('tracker'), keywords: ['goals', 'notes'] },
      { id: 'view-plants', label: 'Go to Plant/Payoff Tracker', category: 'view', icon: '🌱', action: () => onChangeView('plants'), keywords: ['setup', 'foreshadow', 'callback'] },
    );

    // Action commands
    cmds.push(
      { id: 'action-export', label: 'Export Project', category: 'action', icon: '📤', action: onOpenExport, keywords: ['pdf', 'fountain', 'fdx', 'download'] },
      { id: 'action-settings', label: 'Open Settings', category: 'action', icon: '⚙️', action: onOpenSettings, keywords: ['config', 'preferences'] },
    );

    // Scene navigation
    allScenes.forEach(scene => {
      cmds.push({
        id: `scene-${scene.id}`,
        label: scene.title,
        description: `Scene ${scene.id}`,
        category: 'navigation',
        icon: '📄',
        action: () => onSelectScene(scene),
        keywords: [scene.id, scene.location || '', scene.summary?.slice(0, 50) || ''],
      });
    });

    // Sequence navigation
    sequences.forEach(seq => {
      const firstScene = seq.scenes[0];
      if (firstScene) {
        cmds.push({
          id: `seq-${seq.id}`,
          label: seq.title,
          description: `${seq.scenes.length} scenes`,
          category: 'navigation',
          icon: '📁',
          action: () => onSelectScene(firstScene),
          keywords: [seq.dramaticQuestion || ''],
        });
      }
    });

    // Character navigation
    config.characters.forEach(char => {
      // Find first scene with this character
      const charScene = allScenes.find(s =>
        s.scriptContent.toUpperCase().includes(char.name.toUpperCase())
      );
      if (charScene) {
        cmds.push({
          id: `char-${char.name}`,
          label: char.name,
          description: char.role === 'main' ? 'Main Character' : 'Supporting',
          category: 'character',
          icon: char.role === 'main' ? '⭐' : '👤',
          action: () => onSelectScene(charScene),
          keywords: [char.function || '', ...(char.aliases || [])],
        });
      }
    });

    return cmds;
  }, [allScenes, sequences, config.characters, onChangeView, onOpenExport, onOpenSettings, onSelectScene]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      // Show recent/popular commands when no query
      return commands.slice(0, 10);
    }

    const lowerQuery = query.toLowerCase();
    return commands
      .filter(cmd => {
        const searchText = [
          cmd.label,
          cmd.description || '',
          ...(cmd.keywords || []),
        ].join(' ').toLowerCase();
        return searchText.includes(lowerQuery);
      })
      .slice(0, 15);
  }, [commands, query]);

  // Reset selection when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const executeCommand = useCallback((cmd: Command) => {
    cmd.action();
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [filteredCommands, selectedIndex, executeCommand, onClose]);

  if (!isOpen) return null;

  const categoryLabels: Record<CommandCategory, string> = {
    navigation: 'Navigation',
    view: 'Views',
    action: 'Actions',
    character: 'Characters',
    ai: 'AI Features',
  };

  const categoryIcons: Record<CommandCategory, string> = {
    navigation: '📍',
    view: '👁',
    action: '⚡',
    character: '👥',
    ai: '🤖',
  };

  // Group filtered commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<CommandCategory, Command[]>);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <span className="text-zinc-500">⌘</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, scenes, characters..."
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">No results for "{query}"</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/50 sticky top-0">
                  {categoryIcons[category as CommandCategory]} {categoryLabels[category as CommandCategory]}
                </div>
                {cmds.map((cmd, idx) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={cmd.id}
                      data-selected={isSelected}
                      onClick={() => executeCommand(cmd)}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition ${
                        isSelected
                          ? 'bg-blue-600/20 text-zinc-100'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-lg">{cmd.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{cmd.label}</div>
                        {cmd.description && (
                          <div className="text-xs text-zinc-500 truncate">{cmd.description}</div>
                        )}
                      </div>
                      {isSelected && (
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-700 text-zinc-300 rounded">↵</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50 flex items-center gap-4 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-zinc-800 rounded">↑</kbd>
            <kbd className="px-1 py-0.5 bg-zinc-800 rounded">↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-zinc-800 rounded">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-zinc-800 rounded">ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
