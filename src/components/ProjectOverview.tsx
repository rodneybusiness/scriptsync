/**
 * ProjectOverview - Display all project config data
 *
 * Shows themes, genres, logline, AI settings, unique constraints, etc.
 * This gives users visibility into what data the AI is using.
 */

import React, { useState, useMemo } from 'react';
import { useProject } from '../config/ProjectContext';

interface ProjectOverviewProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Estimate pages from script content (industry standard: ~1 page per minute, ~250 words) */
const estimatePages = (content: string): number => {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(0.5, Math.round((words / 250) * 2) / 2);
};

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ isOpen, onClose }) => {
  const { config, sequences } = useProject();
  const [activeSection, setActiveSection] = useState<'overview' | 'characters' | 'ai'>('overview');

  // Project stats
  const stats = useMemo(() => {
    const allScenes = sequences.flatMap(s => s.scenes);
    const totalPages = allScenes.reduce((sum, s) => sum + estimatePages(s.scriptContent), 0);
    const totalNotes = allScenes.reduce((sum, s) => sum + s.notes.length, 0);
    return {
      pages: Math.round(totalPages),
      scenes: allScenes.length,
      sequences: sequences.length,
      notes: totalNotes
    };
  }, [sequences]);

  if (!isOpen) return null;

  const mainCharacters = config.characters.filter(c => c.role === 'main');
  const supportingCharacters = config.characters.filter(c => c.role === 'supporting');
  const minorCharacters = config.characters.filter(c => c.role === 'minor');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{config.title}</h1>
              <p className="text-sm text-zinc-400">{config.description}</p>
              {/* Project Stats */}
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="text-zinc-500">
                  <span className="text-zinc-300 font-medium">~{stats.pages}</span> pages
                </span>
                <span className="text-zinc-500">
                  <span className="text-zinc-300 font-medium">{stats.sequences}</span> sequences
                </span>
                <span className="text-zinc-500">
                  <span className="text-zinc-300 font-medium">{stats.scenes}</span> scenes
                </span>
                {stats.notes > 0 && (
                  <span className="text-zinc-500">
                    <span className="text-amber-400 font-medium">{stats.notes}</span> notes
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 mt-4">
            {(['overview', 'characters', 'ai'] as const).map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  activeSection === section
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {section === 'overview' && 'Overview'}
                {section === 'characters' && `Characters (${config.characters.length})`}
                {section === 'ai' && 'AI Settings'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Logline */}
              <section>
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">Logline</h3>
                <p className="text-zinc-200 leading-relaxed bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  {config.logline}
                </p>
              </section>

              {/* Genres */}
              <section>
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {config.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-purple-900/30 text-purple-300 rounded-full text-sm font-medium border border-purple-700/50"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </section>

              {/* Theme - New structured model */}
              {config.theme ? (
                <section>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-3">Theme</h3>
                  <div className="space-y-3">
                    {/* Core Theme Statement */}
                    <div className="p-4 bg-emerald-900/10 rounded-lg border border-emerald-900/30">
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wide mb-2 font-bold">
                        The Story Argues
                      </p>
                      <p className="text-zinc-100 leading-relaxed italic">"{config.theme.core}"</p>
                    </div>
                    {/* Counter-Argument */}
                    <div className="p-4 bg-red-900/10 rounded-lg border border-red-900/30">
                      <p className="text-[10px] text-red-400 uppercase tracking-wide mb-2 font-bold">
                        The Counter-Argument
                      </p>
                      <p className="text-zinc-300 leading-relaxed italic">"{config.theme.counterArgument}"</p>
                    </div>
                  </div>
                </section>
              ) : config.themes && config.themes.length > 0 ? (
                /* Legacy themes display for backwards compatibility */
                <section>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">
                    Themes ({config.themes.length})
                    <span className="text-zinc-500 font-normal ml-2">(legacy format)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {config.themes.map((theme, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-emerald-900/50 text-emerald-400 rounded text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-zinc-200 text-sm">{theme}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Motifs */}
              {config.motifs && config.motifs.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2">
                    Recurring Motifs
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {config.motifs.map((motif, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-cyan-900/20 text-cyan-300 rounded-full text-sm border border-cyan-700/30"
                      >
                        {motif}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Tracking Categories */}
              {config.trackingCategories && config.trackingCategories.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
                    Tracking Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {config.trackingCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-amber-900/20 text-amber-300 rounded text-xs border border-amber-700/30"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Note Authors */}
              {config.noteAuthors && config.noteAuthors.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">
                    Note Authors
                  </h3>
                  <div className="flex gap-2">
                    {config.noteAuthors.map((author, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-mono"
                      >
                        {author}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Meta */}
              {config.meta && (
                <section className="text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                  <span>Version {config.meta.version}</span>
                  {config.meta.author && <span> • By {config.meta.author}</span>}
                </section>
              )}
            </div>
          )}

          {/* CHARACTERS SECTION */}
          {activeSection === 'characters' && (
            <div className="space-y-6">
              {/* Main Characters */}
              {mainCharacters.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-3">
                    Main Characters ({mainCharacters.length})
                  </h3>
                  <div className="space-y-3">
                    {mainCharacters.map((char, idx) => (
                      <div key={idx} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-white">{char.name}</h4>
                          {char.aliases && char.aliases.length > 0 && (
                            <span className="text-xs text-zinc-500">
                              ({char.aliases.join(', ')})
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{char.description}</p>
                        {char.arc && (
                          <p className="mt-2 text-sm text-blue-400 italic">Arc: {char.arc}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Supporting Characters */}
              {supportingCharacters.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-3">
                    Supporting Characters ({supportingCharacters.length})
                  </h3>
                  <div className="space-y-2">
                    {supportingCharacters.map((char, idx) => (
                      <div key={idx} className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-800">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-zinc-200">{char.name}</h4>
                          {char.aliases && char.aliases.length > 0 && (
                            <span className="text-xs text-zinc-500">
                              ({char.aliases.join(', ')})
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">{char.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Minor Characters */}
              {minorCharacters.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
                    Minor Characters ({minorCharacters.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {minorCharacters.map((char, idx) => (
                      <div key={idx} className="p-2 bg-zinc-800/20 rounded border border-zinc-800">
                        <span className="font-medium text-zinc-300 text-sm">{char.name}</span>
                        {char.description && (
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{char.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* AI SETTINGS SECTION */}
          {activeSection === 'ai' && (
            <div className="space-y-6">
              {config.ai ? (
                <>
                  {/* Tone */}
                  {config.ai.toneDescriptor && (
                    <section>
                      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">
                        Tone / Voice
                      </h3>
                      <p className="text-zinc-200 bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                        {config.ai.toneDescriptor}
                      </p>
                    </section>
                  )}

                  {/* Style References */}
                  {config.ai.styleReferences && config.ai.styleReferences.length > 0 && (
                    <section>
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-2">
                        Style References
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {config.ai.styleReferences.map((ref, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-purple-900/30 text-purple-300 rounded-lg text-sm border border-purple-700/50"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Unique Constraints */}
                  {config.ai.uniqueConstraints && config.ai.uniqueConstraints.length > 0 && (
                    <section>
                      <h3 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2">
                        Unique Constraints ({config.ai.uniqueConstraints.length})
                      </h3>
                      <div className="space-y-2">
                        {config.ai.uniqueConstraints.map((constraint, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-red-900/10 rounded-lg border border-red-900/30"
                          >
                            <span className="w-5 h-5 flex items-center justify-center bg-red-900/50 text-red-400 rounded text-xs font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-zinc-200 text-sm">{constraint}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Custom Instructions */}
                  {config.ai.customInstructions && (
                    <section>
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">
                        Custom AI Instructions
                      </h3>
                      <pre className="text-sm text-zinc-300 bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                        {config.ai.customInstructions}
                      </pre>
                    </section>
                  )}
                </>
              ) : (
                <div className="text-center text-zinc-500 py-8">
                  <p>No AI settings configured for this project.</p>
                  <p className="text-sm mt-1">Add an `ai` section to your config.ts to customize AI behavior.</p>
                </div>
              )}

              {/* Models Info */}
              <section className="pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">
                  Active AI Models
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
                    <div className="text-xs text-zinc-500 mb-1">Complex Analysis</div>
                    <div className="text-sm text-zinc-200 font-mono">Claude Opus 4</div>
                  </div>
                  <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
                    <div className="text-xs text-zinc-500 mb-1">Creative Writing</div>
                    <div className="text-sm text-zinc-200 font-mono">Claude Sonnet 4.5</div>
                  </div>
                  <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
                    <div className="text-xs text-zinc-500 mb-1">Chat / Fast Tasks</div>
                    <div className="text-sm text-zinc-200 font-mono">Claude Sonnet 4</div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
