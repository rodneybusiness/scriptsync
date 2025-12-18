/**
 * CharacterDashboard - Writer-focused character analysis
 *
 * Overhauled to show actually useful metrics:
 * - Speaking partners (who do they talk to?)
 * - Verbal tics (speech patterns, catchphrases)
 * - Emotional register shifts (where do things get heated/intimate?)
 * - Arc markers (first/last appearance, peak activity)
 *
 * Removed useless academic metrics (complexity%, aggression%, questions%).
 */

import React, { useState, useMemo } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene } from '../config/types';
import { analyzeCharacter, getRegisterColor } from '../services/characterAnalysis';
import { countDialogueLines } from '../services/scriptUtils';

interface CharacterDashboardProps {
  onSelectScene: (scene: Scene) => void;
}

const CharacterDashboard: React.FC<CharacterDashboardProps> = ({ onSelectScene }) => {
  const { config, sequences, mainCharacters, supportingCharacters } = useProject();

  const [selectedChar, setSelectedChar] = useState<string>(
    mainCharacters[0]?.name || supportingCharacters[0]?.name || ''
  );

  // Get the full character config for selected character
  const selectedCharConfig = useMemo(() => {
    return config.characters.find(c => c.name === selectedChar);
  }, [selectedChar, config.characters]);

  // Run the new comprehensive analysis
  const analysis = useMemo(() => {
    return analyzeCharacter(selectedChar, selectedCharConfig, sequences, config.characters);
  }, [selectedChar, selectedCharConfig, sequences, config.characters]);

  // Get all search terms (name + aliases + first name)
  const searchTerms = useMemo(() => {
    const terms: string[] = [selectedChar.toUpperCase()];
    if (selectedCharConfig?.aliases) {
      terms.push(...selectedCharConfig.aliases.map(a => a.toUpperCase()));
    }
    const firstName = selectedChar.split(' ')[0].toUpperCase();
    if (firstName !== selectedChar.toUpperCase() && firstName.length > 2) {
      terms.push(firstName);
    }
    return [...new Set(terms)];
  }, [selectedChar, selectedCharConfig]);

  // Helper to check if text contains any search term
  const containsCharacter = (text: string): boolean => {
    const upper = text.toUpperCase();
    return searchTerms.some(term => upper.includes(term));
  };

  // Deep scan to find every relevant scene
  const arcPoints = useMemo(() => {
    return sequences.flatMap(seq =>
      seq.scenes.flatMap(scene => {
        const relevantTracking = scene.tracking.filter(t =>
          containsCharacter(t.description) || containsCharacter(t.category)
        );
        const relevantNotes = scene.notes.filter(n =>
          containsCharacter(n.content)
        );

        let lineCount = 0;
        searchTerms.forEach(term => {
          lineCount += countDialogueLines(scene.scriptContent, term);
        });

        const relevantBeats = scene.beats.filter(b => containsCharacter(b.description));
        const inSummary = containsCharacter(scene.summary);
        const inScript = containsCharacter(scene.scriptContent);

        const hasPresence = relevantTracking.length > 0 ||
                           relevantNotes.length > 0 ||
                           lineCount > 0 ||
                           relevantBeats.length > 0 ||
                           inSummary ||
                           inScript;

        if (!hasPresence) return [];

        return {
          sceneId: scene.id,
          sceneTitle: scene.title,
          sequence: seq.title,
          trackings: relevantTracking,
          notes: relevantNotes,
          beats: scene.beats,
          lineCount,
          fullScene: scene,
          relevantBeatIds: new Set(relevantBeats.map(b => b.id)),
          summary: scene.summary
        };
      })
    );
  }, [selectedChar, sequences, searchTerms]);

  // Parse the arc into label and description
  const arcParts = useMemo(() => {
    if (!selectedCharConfig?.arc) return null;
    const arc = selectedCharConfig.arc;
    const match = arc.match(/^([A-Z][A-Z\s→]+):\s*(.+)$/s);
    if (match) {
      return { label: match[1].trim(), description: match[2].trim() };
    }
    return { label: null, description: arc };
  }, [selectedCharConfig]);

  // Get display name (first name only for buttons)
  const getDisplayName = (name: string) => {
    const first = name.split(' ')[0];
    if (first.includes("'")) return name;
    return first;
  };

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-4 lg:p-8 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">Character Voice</h1>

        {/* Character Selector */}
        <div className="mb-6 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
          {mainCharacters.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {mainCharacters.map(char => (
                <button
                  key={char.name}
                  onClick={() => setSelectedChar(char.name)}
                  className={`py-2 px-4 text-sm font-bold uppercase tracking-wide rounded-lg transition-all ${
                    selectedChar === char.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {getDisplayName(char.name)}
                </button>
              ))}
            </div>
          )}

          {supportingCharacters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Supporting:</span>
              {supportingCharacters.map(char => (
                <button
                  key={char.name}
                  onClick={() => setSelectedChar(char.name)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition ${
                    selectedChar === char.name
                      ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                      : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {getDisplayName(char.name)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Character Arc Card */}
        {selectedCharConfig && (
          <div className="mb-8 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            {/* Arc Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedChar}</h2>
                  {selectedCharConfig.aliases && selectedCharConfig.aliases.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {selectedCharConfig.aliases.map((alias, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                          {alias}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{analysis.sceneCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Scenes</div>
                </div>
              </div>
            </div>

            {/* Arc Journey */}
            {selectedCharConfig.arc && (
              <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                {arcParts?.label && (
                  <div className="mb-3">
                    <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-lg text-sm font-bold text-blue-300">
                      {arcParts.label}
                    </span>
                  </div>
                )}
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {arcParts?.description || selectedCharConfig.arc}
                </p>
              </div>
            )}

            {/* NEW: Simplified Stats Row */}
            <div className="px-6 py-4 grid grid-cols-3 gap-4 bg-zinc-950/30 border-b border-zinc-800">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{analysis.totalLines}</div>
                <div className="text-[10px] text-zinc-500 uppercase">Total Lines</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{analysis.avgWordsPerLine}</div>
                <div className="text-[10px] text-zinc-500 uppercase">Words/Line</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{analysis.totalWords.toLocaleString()}</div>
                <div className="text-[10px] text-zinc-500 uppercase">Total Words</div>
              </div>
            </div>

            {/* NEW: Arc Markers */}
            {(analysis.firstAppearance || analysis.peakActivity) && (
              <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/30">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-3">Arc Markers</h4>
                <div className="grid grid-cols-3 gap-4">
                  {analysis.firstAppearance && (
                    <button
                      onClick={() => {
                        const scene = arcPoints.find(p => p.sceneId === analysis.firstAppearance?.sceneId)?.fullScene;
                        if (scene) onSelectScene(scene);
                      }}
                      className="text-left p-3 bg-emerald-900/20 rounded-lg border border-emerald-900/30 hover:border-emerald-700/50 transition"
                    >
                      <div className="text-[9px] text-emerald-400 uppercase font-bold mb-1">First Appearance</div>
                      <div className="text-xs text-zinc-300 truncate">{analysis.firstAppearance.sceneId}</div>
                    </button>
                  )}
                  {analysis.peakActivity && (
                    <button
                      onClick={() => {
                        const scene = arcPoints.find(p => p.sceneId === analysis.peakActivity?.sceneId)?.fullScene;
                        if (scene) onSelectScene(scene);
                      }}
                      className="text-left p-3 bg-amber-900/20 rounded-lg border border-amber-900/30 hover:border-amber-700/50 transition"
                    >
                      <div className="text-[9px] text-amber-400 uppercase font-bold mb-1">Peak Activity</div>
                      <div className="text-xs text-zinc-300 truncate">{analysis.peakActivity.sceneId}</div>
                      <div className="text-[10px] text-zinc-500">{analysis.peakActivity.lineCount} lines</div>
                    </button>
                  )}
                  {analysis.lastAppearance && (
                    <button
                      onClick={() => {
                        const scene = arcPoints.find(p => p.sceneId === analysis.lastAppearance?.sceneId)?.fullScene;
                        if (scene) onSelectScene(scene);
                      }}
                      className="text-left p-3 bg-red-900/20 rounded-lg border border-red-900/30 hover:border-red-700/50 transition"
                    >
                      <div className="text-[9px] text-red-400 uppercase font-bold mb-1">Last Appearance</div>
                      <div className="text-xs text-zinc-300 truncate">{analysis.lastAppearance.sceneId}</div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* NEW: Speaking Partners */}
            {analysis.speakingPartners.length > 0 && (
              <div className="px-6 py-4 border-b border-zinc-800">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-3">Speaks Most With</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.speakingPartners.slice(0, 6).map((partner, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center gap-2"
                    >
                      <span className="text-sm text-zinc-200 font-medium">{getDisplayName(partner.name)}</span>
                      <span className="text-[10px] text-zinc-500">
                        {partner.sceneCount} scene{partner.sceneCount !== 1 ? 's' : ''}
                      </span>
                      {partner.lineExchanges > 0 && (
                        <span className="text-[10px] text-blue-400">
                          {partner.lineExchanges} exchange{partner.lineExchanges !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW: Verbal Tics */}
            {analysis.verbalTics.length > 0 && (
              <div className="px-6 py-4 border-b border-zinc-800">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-3">Speech Patterns</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.verbalTics.map((tic, idx) => (
                    <div
                      key={idx}
                      className={`px-2 py-1 rounded text-xs border ${
                        tic.category === 'filler'
                          ? 'bg-amber-900/20 border-amber-900/30 text-amber-300'
                          : tic.category === 'catchphrase'
                            ? 'bg-purple-900/20 border-purple-900/30 text-purple-300'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      "{tic.phrase}"
                      <span className="ml-1 text-zinc-500">×{tic.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW: Emotional Beats */}
            {analysis.emotionalBeats.length > 0 && (
              <div className="px-6 py-4 border-b border-zinc-800">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-3">
                  Emotional Moments ({analysis.emotionalBeats.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analysis.emotionalBeats.slice(0, 8).map((beat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const scene = arcPoints.find(p => p.sceneId === beat.sceneId)?.fullScene;
                        if (scene) onSelectScene(scene);
                      }}
                      className="w-full text-left p-2 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition flex items-start gap-3"
                    >
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded border ${getRegisterColor(beat.register)}`}>
                        {beat.register}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-zinc-400 truncate">{beat.sample}</div>
                        <div className="text-[10px] text-zinc-600">{beat.sceneId}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Character Description - Collapsible */}
            {selectedCharConfig.description && (
              <details className="border-t border-zinc-800">
                <summary className="px-6 py-3 cursor-pointer text-xs font-bold text-zinc-500 uppercase hover:text-zinc-300 transition">
                  Full Character Notes
                </summary>
                <div className="px-6 pb-4">
                  <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedCharConfig.description}
                  </pre>
                </div>
              </details>
            )}
          </div>
        )}

        {/* Scene Timeline */}
        <div>
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wide mb-4">
            Scene Appearances ({arcPoints.length})
          </h3>

          {arcPoints.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
              <p className="text-zinc-500">No scenes found for <span className="text-zinc-300">{selectedChar}</span>.</p>
              <p className="text-xs text-zinc-600 mt-2">
                Searching for: {searchTerms.join(', ')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {arcPoints.map((point, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectScene(point.fullScene)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer group"
                >
                  {/* Scene Header */}
                  <div className="px-4 py-3 bg-zinc-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-blue-400 bg-zinc-950 px-2 py-0.5 rounded">
                        {point.sceneId}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-blue-300 transition">
                          {point.sceneTitle}
                        </h4>
                        <span className="text-[10px] text-zinc-600 uppercase">{point.sequence}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {point.lineCount > 0 && (
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                          {point.lineCount} lines
                        </span>
                      )}
                      <span className="text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition">
                        View →
                      </span>
                    </div>
                  </div>

                  {/* Scene Content */}
                  <div className="px-4 py-3">
                    {point.summary && (
                      <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{point.summary}</p>
                    )}

                    {point.relevantBeatIds.size > 0 && (
                      <div className="space-y-1 mb-2">
                        {point.beats.filter(b => point.relevantBeatIds.has(b.id)).slice(0, 3).map(beat => (
                          <div key={beat.id} className="flex items-start gap-2 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            <span className="text-blue-200 line-clamp-1">{beat.description}</span>
                          </div>
                        ))}
                        {point.beats.filter(b => point.relevantBeatIds.has(b.id)).length > 3 && (
                          <span className="text-[10px] text-zinc-600 ml-3">
                            +{point.beats.filter(b => point.relevantBeatIds.has(b.id)).length - 3} more beats
                          </span>
                        )}
                      </div>
                    )}

                    {point.trackings.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {point.trackings.slice(0, 3).map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-900/30 text-purple-300 rounded">
                            {t.category}: {t.description.substring(0, 40)}...
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterDashboard;
