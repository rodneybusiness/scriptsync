/**
 * Welcome Page / Landing Component
 *
 * Shown to new users and when no project is loaded.
 * Features:
 * - App introduction and value proposition
 * - Feature highlights
 * - Quick start options
 * - Recent projects
 */

import React from 'react';
import { ProjectIndexEntry, getProjectsIndex } from '../services/storage';

// =============================================================================
// TYPES
// =============================================================================

interface WelcomePageProps {
  onNewProject: () => void;
  onImportProject: (file: File) => void;
  onLoadProject: (projectId: string) => void;
}

// =============================================================================
// FEATURE DATA
// =============================================================================

const FEATURES = [
  {
    icon: '📝',
    title: 'Smart Script Import',
    description: 'Import Fountain files or PDFs. ScriptSync automatically parses scenes, characters, and dialogue.',
  },
  {
    icon: '🎬',
    title: 'Beat Board',
    description: 'Visual story planning with drag-and-drop beat cards. Track story structure at a glance.',
  },
  {
    icon: '👥',
    title: 'Character Arcs',
    description: 'Map character journeys across your screenplay. Track appearances and development.',
  },
  {
    icon: '🤖',
    title: 'AI Analysis',
    description: 'Get intelligent feedback on pacing, dialogue, and structure. Powered by Google Gemini.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard Shortcuts',
    description: 'Power-user friendly with comprehensive keyboard navigation. Press ? for shortcuts.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Visualize your script with word counts, character stats, and scene distribution.',
  },
];

const QUICK_TIPS = [
  'Press Ctrl+? or Shift+? to view all keyboard shortcuts',
  'Drag and drop scenes in Beat Board to reorganize your story',
  'Use Ctrl+S to force save at any time (autosave is enabled)',
  'Export to Fountain format for compatibility with Final Draft',
  'Click any beat to expand and edit its details inline',
];

// =============================================================================
// COMPONENT
// =============================================================================

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNewProject,
  onImportProject,
  onLoadProject,
}) => {
  const [recentProjects] = React.useState<ProjectIndexEntry[]>(getProjectsIndex);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.fountain') || file.name.endsWith('.pdf') || file.name.endsWith('.json'))) {
      onImportProject(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportProject(file);
    }
  };

  const randomTip = QUICK_TIPS[Math.floor(Math.random() * QUICK_TIPS.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-5xl">🎬</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ScriptSync
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-4">
            A context-aware screenwriting environment with AI-powered script analysis
          </p>
          <p className="text-zinc-500">
            Track beats, characters, themes, and continuity across your screenplay.
          </p>
        </div>

        {/* Quick Actions */}
        <div
          className={`relative mb-16 p-8 rounded-2xl border-2 border-dashed transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-zinc-700 hover:border-zinc-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <p className="text-zinc-400 mb-6">
              {isDragging ? 'Drop your file here...' : 'Drag & drop a screenplay file, or'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onNewProject}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import Screenplay
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".fountain,.pdf,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <p className="text-xs text-zinc-600 mt-4">
              Supports: Fountain (.fountain), PDF (.pdf), JSON backup (.json)
            </p>
          </div>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-zinc-500">📂</span> Recent Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.slice(0, 6).map((project) => (
                <button
                  key={project.id}
                  onClick={() => onLoadProject(project.id)}
                  className="p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg text-left transition-all group"
                >
                  <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    {project.sceneCount} scenes • {project.characterCount} characters
                  </p>
                  <p className="text-xs text-zinc-600 mt-2">
                    Last edited: {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-white mb-6 text-center">
            Everything you need to write great screenplays
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="p-5 bg-zinc-800/30 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
              >
                <span className="text-2xl mb-3 block">{feature.icon}</span>
                <h3 className="font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="mb-16">
          <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-medium text-blue-400">Quick Tip</p>
              <p className="text-sm text-zinc-400">{randomTip}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-zinc-600 text-sm">
          <p className="mb-2">
            ScriptSync is open source and built with ❤️ for screenwriters
          </p>
          <p>
            Version 1.0.0 • Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">?</kbd> for help
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;
