/**
 * ProjectSettings - Edit all project configuration
 *
 * Accessible from:
 * - Status bar gear icon
 * - ProjectOverview "Edit Settings" button
 * - Cmd/Ctrl + , shortcut
 *
 * Tabs: Basic | Characters | Theme | AI | Tracking
 */

import React, { useState, useCallback } from 'react';
import {
  ProjectConfig,
  CharacterConfig,
  ThemeStatement,
  AIConfig,
} from '../config/types';

// =============================================================================
// TYPES
// =============================================================================

interface ProjectSettingsProps {
  config: ProjectConfig;
  onSave: (updates: Partial<ProjectConfig>) => void;
  onClose: () => void;
}

type SettingsTab = 'basic' | 'characters' | 'theme' | 'ai' | 'tracking';

// =============================================================================
// GENRE OPTIONS
// =============================================================================

const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Film Noir', 'History',
  'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
  'Thriller', 'War', 'Western'
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  config,
  onSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('basic');
  const [hasChanges, setHasChanges] = useState(false);

  // Local state for editing (copy of config)
  const [title, setTitle] = useState(config.title);
  const [logline, setLogline] = useState(config.logline || '');
  const [description, setDescription] = useState(config.description || '');
  const [genres, setGenres] = useState<string[]>(config.genres || []);
  const [characters, setCharacters] = useState<CharacterConfig[]>(config.characters || []);
  const [theme, setTheme] = useState<ThemeStatement | null>(config.theme || null);
  const [motifs, setMotifs] = useState<string[]>(config.motifs || []);
  const [aiConfig, setAiConfig] = useState<AIConfig>(config.ai || {
    styleReferences: [],
    toneDescriptor: '',
    uniqueConstraints: [],
  });
  const [trackingCategories, setTrackingCategories] = useState<string[]>(
    config.trackingCategories || []
  );

  // Track changes
  const markChanged = useCallback(() => setHasChanges(true), []);

  // Save handler
  const handleSave = useCallback(() => {
    const updates: Partial<ProjectConfig> = {
      title,
      logline,
      description,
      genres,
      characters,
      theme: theme || undefined,
      motifs,
      ai: aiConfig,
      trackingCategories,
    };
    onSave(updates);
    setHasChanges(false);
  }, [title, logline, description, genres, characters, theme, motifs, aiConfig, trackingCategories, onSave]);

  // Tab content renderers
  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'characters', label: 'Characters' },
    { id: 'theme', label: 'Theme' },
    { id: 'ai', label: 'AI' },
    { id: 'tracking', label: 'Tracking' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-100">Project Settings</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition p-1"
            title="Close (Esc)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 border-b border-zinc-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-zinc-100 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <BasicTab
              title={title}
              setTitle={(v) => { setTitle(v); markChanged(); }}
              logline={logline}
              setLogline={(v) => { setLogline(v); markChanged(); }}
              description={description}
              setDescription={(v) => { setDescription(v); markChanged(); }}
              genres={genres}
              setGenres={(v) => { setGenres(v); markChanged(); }}
            />
          )}

          {activeTab === 'characters' && (
            <CharactersTab
              characters={characters}
              setCharacters={(v) => { setCharacters(v); markChanged(); }}
            />
          )}

          {activeTab === 'theme' && (
            <ThemeTab
              theme={theme}
              setTheme={(v) => { setTheme(v); markChanged(); }}
              motifs={motifs}
              setMotifs={(v) => { setMotifs(v); markChanged(); }}
              legacyThemes={config.themes}
            />
          )}

          {activeTab === 'ai' && (
            <AITab
              aiConfig={aiConfig}
              setAiConfig={(v) => { setAiConfig(v); markChanged(); }}
            />
          )}

          {activeTab === 'tracking' && (
            <TrackingTab
              categories={trackingCategories}
              setCategories={(v) => { setTrackingCategories(v); markChanged(); }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-500">
            {hasChanges ? 'Unsaved Changes' : 'No Changes'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// BASIC TAB
// =============================================================================

interface BasicTabProps {
  title: string;
  setTitle: (v: string) => void;
  logline: string;
  setLogline: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  genres: string[];
  setGenres: (v: string[]) => void;
}

const BasicTab: React.FC<BasicTabProps> = ({
  title, setTitle,
  logline, setLogline,
  description, setDescription,
  genres, setGenres,
}) => {
  const [newGenre, setNewGenre] = useState('');

  const addGenre = (genre: string) => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
    setNewGenre('');
  };

  const removeGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="My Screenplay"
        />
      </div>

      {/* Logline */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Logline
        </label>
        <textarea
          value={logline}
          onChange={(e) => setLogline(e.target.value)}
          rows={2}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="A burned-out detective must solve one last case before..."
        />
        <div className="text-xs text-zinc-500 mt-1">
          One sentence that captures your story's hook
        </div>
      </div>

      {/* Genres */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Genres
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {genres.map(genre => (
            <span
              key={genre}
              className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300"
            >
              {genre}
              <button
                onClick={() => removeGenre(genre)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={newGenre}
            onChange={(e) => { addGenre(e.target.value); }}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Add genre...</option>
            {GENRE_OPTIONS.filter(g => !genres.includes(g)).map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Description
          <span className="text-zinc-500 font-normal ml-2">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Additional context about your project..."
        />
      </div>
    </div>
  );
};

// =============================================================================
// CHARACTERS TAB
// =============================================================================

interface CharactersTabProps {
  characters: CharacterConfig[];
  setCharacters: (v: CharacterConfig[]) => void;
}

const CharactersTab: React.FC<CharactersTabProps> = ({ characters, setCharacters }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCharacter, setNewCharacter] = useState<Partial<CharacterConfig>>({});

  const addCharacter = () => {
    if (newCharacter.name?.trim()) {
      setCharacters([
        ...characters,
        {
          name: newCharacter.name.trim(),
          role: newCharacter.role || 'supporting',
          description: newCharacter.description || '',
          arc: newCharacter.arc || '',
        }
      ]);
      setNewCharacter({});
    }
  };

  const updateCharacter = (index: number, updates: Partial<CharacterConfig>) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], ...updates };
    setCharacters(updated);
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  if (characters.length === 0 && !newCharacter.name) {
    return (
      <div className="text-center py-12">
        <div className="text-zinc-400 text-lg mb-2">No characters defined yet</div>
        <div className="text-zinc-500 text-sm mb-6">
          Add them as you write, or describe your protagonist to get started.
        </div>
        <button
          onClick={() => setNewCharacter({ name: '', role: 'main' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          + Add First Character
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Character list */}
      {characters.map((char, index) => (
        <div
          key={char.name}
          className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                char.role === 'main' ? 'bg-blue-900/50 text-blue-400' :
                char.role === 'supporting' ? 'bg-amber-900/50 text-amber-400' :
                'bg-zinc-700 text-zinc-400'
              }`}>
                {char.role}
              </span>
              <input
                type="text"
                value={char.name}
                onChange={(e) => updateCharacter(index, { name: e.target.value })}
                className="bg-transparent text-zinc-100 font-medium focus:outline-none focus:bg-zinc-800 px-2 py-1 rounded"
              />
            </div>
            <button
              onClick={() => removeCharacter(index)}
              className="text-zinc-500 hover:text-red-400 transition"
              title="Remove character"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
            <select
              value={char.role}
              onChange={(e) => updateCharacter(index, { role: e.target.value as CharacterConfig['role'] })}
              className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-300"
            >
              <option value="main">Main</option>
              <option value="supporting">Supporting</option>
              <option value="minor">Minor</option>
            </select>
          </div>

          <textarea
            value={char.arc || ''}
            onChange={(e) => updateCharacter(index, { arc: e.target.value })}
            placeholder="Character arc (e.g., SKEPTIC → BELIEVER)"
            rows={1}
            className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>
      ))}

      {/* Add new character form */}
      {newCharacter.name !== undefined ? (
        <div className="bg-zinc-800/30 border border-dashed border-zinc-600 rounded-lg p-4">
          <div className="text-sm font-medium text-zinc-400 mb-3">New Character</div>
          <div className="space-y-3">
            <input
              type="text"
              value={newCharacter.name || ''}
              onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
              placeholder="Character name"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <select
              value={newCharacter.role || 'supporting'}
              onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value as CharacterConfig['role'] })}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-300"
            >
              <option value="main">Main</option>
              <option value="supporting">Supporting</option>
              <option value="minor">Minor</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={addCharacter}
                disabled={!newCharacter.name?.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Add Character
              </button>
              <button
                onClick={() => setNewCharacter({})}
                className="px-4 py-2 text-zinc-400 text-sm hover:text-zinc-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setNewCharacter({ name: '', role: 'supporting' })}
          className="w-full py-3 border border-dashed border-zinc-600 rounded-lg text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition"
        >
          + Add Character
        </button>
      )}
    </div>
  );
};

// =============================================================================
// THEME TAB
// =============================================================================

interface ThemeTabProps {
  theme: ThemeStatement | null;
  setTheme: (v: ThemeStatement | null) => void;
  motifs: string[];
  setMotifs: (v: string[]) => void;
  legacyThemes?: string[];
}

const ThemeTab: React.FC<ThemeTabProps> = ({
  theme,
  setTheme,
  motifs,
  setMotifs,
  legacyThemes,
}) => {
  const [newMotif, setNewMotif] = useState('');

  const addMotif = () => {
    if (newMotif.trim() && !motifs.includes(newMotif.trim())) {
      setMotifs([...motifs, newMotif.trim()]);
      setNewMotif('');
    }
  };

  const removeMotif = (motif: string) => {
    setMotifs(motifs.filter(m => m !== motif));
  };

  // Show migration prompt for legacy themes
  if (legacyThemes && legacyThemes.length > 0 && !theme) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
          <div className="text-amber-400 font-medium mb-2">Legacy Theme Format Detected</div>
          <div className="text-sm text-zinc-400 mb-3">
            Your project uses the old theme format: <span className="text-zinc-300">{legacyThemes.join(', ')}</span>
          </div>
          <div className="text-sm text-zinc-500 mb-4">
            The new format uses a core argument and counter-argument for richer theme development.
          </div>
          <button
            onClick={() => setTheme({ core: '', counterArgument: '' })}
            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-500 transition"
          >
            Convert to New Format
          </button>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-zinc-400 text-lg mb-2">Theme develops through revision</div>
          <div className="text-zinc-500 text-sm mb-4">
            What argument is your story making? What's the counter-argument?
          </div>
          <div className="text-xs text-zinc-600 mb-6 max-w-md mx-auto">
            Example: "Trust requires vulnerability" vs "Vulnerability invites exploitation"
          </div>
          <button
            onClick={() => setTheme({ core: '', counterArgument: '' })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            + Define Theme
          </button>
        </div>

        {/* Motifs section even without theme */}
        <MotifsSection motifs={motifs} setMotifs={setMotifs} newMotif={newMotif} setNewMotif={setNewMotif} addMotif={addMotif} removeMotif={removeMotif} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Core Argument */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Core Argument
          <span className="text-zinc-500 font-normal ml-2">What is your story arguing?</span>
        </label>
        <textarea
          value={theme.core}
          onChange={(e) => setTheme({ ...theme, core: e.target.value })}
          rows={2}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Control destroys what makes life worth living"
        />
      </div>

      {/* Counter Argument */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Counter-Argument
          <span className="text-zinc-500 font-normal ml-2">What's the opposing position?</span>
        </label>
        <textarea
          value={theme.counterArgument}
          onChange={(e) => setTheme({ ...theme, counterArgument: e.target.value })}
          rows={2}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Without control, chaos destroys everything"
        />
      </div>

      {/* Remove theme */}
      <button
        onClick={() => setTheme(null)}
        className="text-xs text-zinc-500 hover:text-red-400 transition"
      >
        Remove theme
      </button>

      {/* Motifs */}
      <MotifsSection motifs={motifs} setMotifs={setMotifs} newMotif={newMotif} setNewMotif={setNewMotif} addMotif={addMotif} removeMotif={removeMotif} />
    </div>
  );
};

// Motifs sub-section
const MotifsSection: React.FC<{
  motifs: string[];
  setMotifs: (v: string[]) => void;
  newMotif: string;
  setNewMotif: (v: string) => void;
  addMotif: () => void;
  removeMotif: (m: string) => void;
}> = ({ motifs, newMotif, setNewMotif, addMotif, removeMotif }) => (
  <div className="pt-6 border-t border-zinc-800">
    <label className="block text-sm font-medium text-zinc-300 mb-2">
      Motifs
      <span className="text-zinc-500 font-normal ml-2">Recurring images or symbols</span>
    </label>
    <div className="flex flex-wrap gap-2 mb-3">
      {motifs.map(motif => (
        <span
          key={motif}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-900/30 border border-purple-700/50 rounded-full text-sm text-purple-300"
        >
          {motif}
          <button
            onClick={() => removeMotif(motif)}
            className="text-purple-400 hover:text-purple-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={newMotif}
        onChange={(e) => setNewMotif(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addMotif()}
        placeholder="Add motif (e.g., Locked doors, Rain)"
        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={addMotif}
        disabled={!newMotif.trim()}
        className="px-3 py-2 bg-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition"
      >
        Add
      </button>
    </div>
  </div>
);

// =============================================================================
// AI TAB
// =============================================================================

interface AITabProps {
  aiConfig: AIConfig;
  setAiConfig: (v: AIConfig) => void;
}

const AITab: React.FC<AITabProps> = ({ aiConfig, setAiConfig }) => {
  const [newRef, setNewRef] = useState('');
  const [newConstraint, setNewConstraint] = useState('');

  const addStyleRef = () => {
    if (newRef.trim() && !aiConfig.styleReferences.includes(newRef.trim())) {
      setAiConfig({
        ...aiConfig,
        styleReferences: [...aiConfig.styleReferences, newRef.trim()]
      });
      setNewRef('');
    }
  };

  const removeStyleRef = (ref: string) => {
    setAiConfig({
      ...aiConfig,
      styleReferences: aiConfig.styleReferences.filter(r => r !== ref)
    });
  };

  const addConstraint = () => {
    if (newConstraint.trim() && !aiConfig.uniqueConstraints.includes(newConstraint.trim())) {
      setAiConfig({
        ...aiConfig,
        uniqueConstraints: [...aiConfig.uniqueConstraints, newConstraint.trim()]
      });
      setNewConstraint('');
    }
  };

  const removeConstraint = (c: string) => {
    setAiConfig({
      ...aiConfig,
      uniqueConstraints: aiConfig.uniqueConstraints.filter(x => x !== c)
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-zinc-500 mb-4">
        Configure how AI assistants understand your project's voice and constraints.
      </div>

      {/* Style References */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Style References
          <span className="text-zinc-500 font-normal ml-2">Writers/films to emulate</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {aiConfig.styleReferences.map(ref => (
            <span
              key={ref}
              className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300"
            >
              {ref}
              <button onClick={() => removeStyleRef(ref)} className="text-zinc-500 hover:text-zinc-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newRef}
            onChange={(e) => setNewRef(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addStyleRef()}
            placeholder="e.g., Shane Black, Aaron Sorkin"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={addStyleRef} disabled={!newRef.trim()} className="px-3 py-2 bg-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition">
            Add
          </button>
        </div>
      </div>

      {/* Tone Descriptor */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Tone Descriptor
        </label>
        <input
          type="text"
          value={aiConfig.toneDescriptor}
          onChange={(e) => setAiConfig({ ...aiConfig, toneDescriptor: e.target.value })}
          placeholder="e.g., Noir thriller with mordant wit"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Unique Constraints */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Unique Constraints
          <span className="text-zinc-500 font-normal ml-2">Rules the AI should follow</span>
        </label>
        <div className="space-y-2 mb-3">
          {aiConfig.uniqueConstraints.map(c => (
            <div key={c} className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2">
              <span className="flex-1 text-sm text-zinc-300">{c}</span>
              <button onClick={() => removeConstraint(c)} className="text-zinc-500 hover:text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newConstraint}
            onChange={(e) => setNewConstraint(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addConstraint()}
            placeholder="e.g., Keep scenes under 3 pages"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={addConstraint} disabled={!newConstraint.trim()} className="px-3 py-2 bg-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition">
            Add
          </button>
        </div>
      </div>

      {/* Custom Instructions */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Custom AI Instructions
          <span className="text-zinc-500 font-normal ml-2">(optional)</span>
        </label>
        <textarea
          value={aiConfig.customInstructions || ''}
          onChange={(e) => setAiConfig({ ...aiConfig, customInstructions: e.target.value })}
          rows={3}
          placeholder="Additional instructions for AI assistants..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
};

// =============================================================================
// TRACKING TAB
// =============================================================================

interface TrackingTabProps {
  categories: string[];
  setCategories: (v: string[]) => void;
}

const TrackingTab: React.FC<TrackingTabProps> = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  const defaultCategories = ['Props', 'Costumes', 'Locations', 'VFX', 'Stunts', 'Vehicles'];

  return (
    <div className="space-y-6">
      <div className="text-sm text-zinc-500 mb-4">
        Define categories for tracking continuity items across scenes.
      </div>

      {/* Current categories */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Active Categories
        </label>
        {categories.length === 0 ? (
          <div className="text-zinc-500 text-sm mb-4">
            No tracking categories defined. Add some below or use suggested defaults.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-sm text-emerald-300"
              >
                {cat}
                <button onClick={() => removeCategory(cat)} className="text-emerald-400 hover:text-emerald-200">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add new */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          placeholder="Add category..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={addCategory} disabled={!newCategory.trim()} className="px-3 py-2 bg-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition">
          Add
        </button>
      </div>

      {/* Suggested defaults */}
      <div className="pt-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500 mb-2">Suggested categories:</div>
        <div className="flex flex-wrap gap-2">
          {defaultCategories.filter(d => !categories.includes(d)).map(cat => (
            <button
              key={cat}
              onClick={() => setCategories([...categories, cat])}
              className="px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition"
            >
              + {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
