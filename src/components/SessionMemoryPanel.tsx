/**
 * SessionMemoryPanel - UI for viewing and managing AI session memory
 *
 * Shows what the AI has learned during this session:
 * - Corrections the user has made
 * - Patterns to avoid
 * - Character-specific notes
 * - Preferred style settings
 */

import React, { useState, useEffect } from 'react';
import {
  getSessionMemoryState,
  clearSessionMemory,
  addSessionCorrection,
  addAvoidPattern,
  addCharacterNote,
  setSessionPreferredStyle
} from '../services/geminiService';

interface SessionMemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  characterNames?: string[];
}

export const SessionMemoryPanel: React.FC<SessionMemoryPanelProps> = ({
  isOpen,
  onClose,
  characterNames = []
}) => {
  const [memoryState, setMemoryState] = useState(getSessionMemoryState());
  const [newCorrection, setNewCorrection] = useState('');
  const [correctionType, setCorrectionType] = useState<'dialogue_style' | 'character_voice' | 'pacing' | 'tone' | 'general'>('general');
  const [newAvoidPattern, setNewAvoidPattern] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [newCharacterNote, setNewCharacterNote] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');

  // Refresh state periodically
  useEffect(() => {
    if (isOpen) {
      setMemoryState(getSessionMemoryState());
    }
  }, [isOpen]);

  const handleAddCorrection = () => {
    if (!newCorrection.trim()) return;
    addSessionCorrection(correctionType, newCorrection.trim());
    setNewCorrection('');
    setMemoryState(getSessionMemoryState());
  };

  const handleAddAvoidPattern = () => {
    if (!newAvoidPattern.trim()) return;
    addAvoidPattern(newAvoidPattern.trim());
    setNewAvoidPattern('');
    setMemoryState(getSessionMemoryState());
  };

  const handleAddCharacterNote = () => {
    if (!selectedCharacter || !newCharacterNote.trim()) return;
    addCharacterNote(selectedCharacter, newCharacterNote.trim());
    setNewCharacterNote('');
    setMemoryState(getSessionMemoryState());
  };

  const handleSetPreferredStyle = () => {
    if (!preferredStyle.trim()) return;
    setSessionPreferredStyle(preferredStyle.trim());
    setMemoryState(getSessionMemoryState());
  };

  const handleClearAll = () => {
    if (confirm('Clear all session memory? The AI will forget all corrections and preferences.')) {
      clearSessionMemory();
      setMemoryState(getSessionMemoryState());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">AI Session Memory</h2>
            <p className="text-xs text-zinc-500">
              {memoryState.correctionCount} corrections • {memoryState.avoidPatterns.length} avoid patterns
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Add Correction */}
          <section>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3">
              Add Correction
            </h3>
            <div className="space-y-2">
              <select
                value={correctionType}
                onChange={(e) => setCorrectionType(e.target.value as typeof correctionType)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200"
              >
                <option value="general">General</option>
                <option value="dialogue_style">Dialogue Style</option>
                <option value="character_voice">Character Voice</option>
                <option value="pacing">Pacing</option>
                <option value="tone">Tone</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCorrection}
                  onChange={(e) => setNewCorrection(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCorrection()}
                  placeholder="e.g., 'Keep dialogue under 3 lines per character'"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600"
                />
                <button
                  onClick={handleAddCorrection}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </section>

          {/* Avoid Patterns */}
          <section>
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-3">
              Patterns to Avoid
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAvoidPattern}
                onChange={(e) => setNewAvoidPattern(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAvoidPattern()}
                placeholder="e.g., 'cliché one-liners', 'exposition dumps'"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600"
              />
              <button
                onClick={handleAddAvoidPattern}
                className="px-4 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-500 transition"
              >
                Add
              </button>
            </div>
            {memoryState.avoidPatterns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {memoryState.avoidPatterns.map((pattern, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-amber-900/30 text-amber-400 text-xs rounded border border-amber-700/50"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Character Notes */}
          <section>
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">
              Character-Specific Notes
            </h3>
            <div className="space-y-2 mb-3">
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200"
              >
                <option value="">Select character...</option>
                {characterNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCharacterNote}
                  onChange={(e) => setNewCharacterNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCharacterNote()}
                  placeholder="e.g., 'Never uses contractions', 'Speaks in short sentences'"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600"
                  disabled={!selectedCharacter}
                />
                <button
                  onClick={handleAddCharacterNote}
                  disabled={!selectedCharacter}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
            {Object.keys(memoryState.characterNotes).length > 0 && (
              <div className="space-y-2">
                {Object.entries(memoryState.characterNotes).map(([char, notes]) => (
                  <div key={char} className="bg-zinc-800/50 rounded p-2">
                    <div className="text-xs font-bold text-purple-400 mb-1">{char}</div>
                    <ul className="text-xs text-zinc-400 space-y-1">
                      {notes.map((note, idx) => (
                        <li key={idx}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Preferred Style */}
          <section>
            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-3">
              Preferred Writing Style
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetPreferredStyle()}
                placeholder="e.g., 'Terse, Hemingway-esque prose with visual emphasis'"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600"
              />
              <button
                onClick={handleSetPreferredStyle}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-500 transition"
              >
                Set
              </button>
            </div>
            {memoryState.hasPreferredStyle && (
              <p className="mt-2 text-xs text-green-400">✓ Style preference is set</p>
            )}
          </section>

          {/* Quick Tips */}
          <section className="bg-zinc-800/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">💡 Tips</h3>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>• Corrections are automatically detected when you say things like "actually..." or "don't..."</li>
              <li>• Session memory resets when you refresh the page</li>
              <li>• Character notes help maintain voice consistency across dialogue generation</li>
              <li>• The AI applies all corrections to future responses in this session</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SessionMemoryPanel;
