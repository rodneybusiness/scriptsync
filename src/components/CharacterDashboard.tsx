/**
 * CharacterDashboard - Character arc tracking and analysis
 *
 * Uses project config for character lists instead of hard-coded values.
 */

import React, { useState, useMemo } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene } from '../config/types';
import { analyzeCharacterVoice, countDialogueLines } from '../services/scriptUtils';

interface CharacterDashboardProps {
  onSelectScene: (scene: Scene) => void;
}

const CharacterDashboard: React.FC<CharacterDashboardProps> = ({ onSelectScene }) => {
  const { config, sequences, mainCharacters, supportingCharacters } = useProject();

  const [selectedChar, setSelectedChar] = useState<string>(
    mainCharacters[0]?.name || supportingCharacters[0]?.name || ''
  );

  // Aggregate Global Stats for the Character
  const globalStats = useMemo(() => {
    let combinedScript = "";
    sequences.forEach(seq => seq.scenes.forEach(s => combinedScript += "\n" + s.scriptContent));
    return analyzeCharacterVoice(combinedScript, selectedChar);
  }, [selectedChar, sequences]);

  // Deep scan to find every relevant scene
  const arcPoints = useMemo(() => {
    return sequences.flatMap(seq =>
      seq.scenes.flatMap(scene => {
        const charUpper = selectedChar.toUpperCase();
        const relevantTracking = scene.tracking.filter(t =>
          t.description.toUpperCase().includes(charUpper) || t.category.toUpperCase().includes(charUpper)
        );
        const relevantNotes = scene.notes.filter(n =>
          n.content.toUpperCase().includes(charUpper)
        );
        const lineCount = countDialogueLines(scene.scriptContent, selectedChar);

        // Check if this is a main character (for "group" references like "Angels")
        const isMainChar = mainCharacters.some(c => c.name === selectedChar);
        const relevantBeats = scene.beats.filter(b => {
          const desc = b.description.toUpperCase();
          return desc.includes(charUpper) || (isMainChar && mainCharacters.every(c => desc.includes(c.name.toUpperCase())));
        });
        const inSummary = scene.summary.toUpperCase().includes(charUpper);
        const hasPresence = relevantTracking.length > 0 || relevantNotes.length > 0 || lineCount > 0 || relevantBeats.length > 0 || inSummary;

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
          relevantBeatIds: new Set(relevantBeats.map(b => b.id))
        };
      })
    );
  }, [selectedChar, sequences, mainCharacters]);

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-8 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header & Controls */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Character Arc Tracker</h1>
            <p className="text-zinc-400 mb-6 max-w-xl">
              Analysis of character continuity for <span className="text-blue-400 font-bold">{config.title}</span>.
            </p>

            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 backdrop-blur-sm">
              {/* Main Characters */}
              {mainCharacters.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {mainCharacters.map(char => (
                    <button
                      key={char.name}
                      onClick={() => setSelectedChar(char.name)}
                      className={`flex-1 min-w-[80px] py-3 px-4 text-sm font-bold uppercase tracking-wide rounded-lg transition-all shadow-sm ${
                        selectedChar === char.name
                          ? 'bg-blue-600 text-white shadow-blue-900/20 transform scale-105'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                      }`}
                    >
                      {char.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Supporting Characters */}
              {supportingCharacters.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mr-2">Supporting Cast:</span>
                  {supportingCharacters.map(char => (
                    <button
                      key={char.name}
                      onClick={() => setSelectedChar(char.name)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                        selectedChar === char.name
                          ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                          : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {char.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DIALOGUE DNA PANEL */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Dialogue DNA
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/50 p-3 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Avg Sentence</span>
                <div className="text-2xl font-bold text-white">{globalStats.avgSentenceLength} <span className="text-xs font-normal text-zinc-600">words</span></div>
              </div>
              <div className="bg-zinc-950/50 p-3 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Complexity</span>
                <div className="text-2xl font-bold text-blue-400">{globalStats.complexity}%</div>
              </div>
              <div className="bg-zinc-950/50 p-3 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Questions</span>
                <div className="text-2xl font-bold text-purple-400">{globalStats.inquisitiveness}%</div>
              </div>
              <div className="bg-zinc-950/50 p-3 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Aggression</span>
                <div className="text-2xl font-bold text-red-400">{globalStats.aggression}%</div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <p className="text-[10px] text-zinc-600 italic text-center">Based on {globalStats.totalWords} analyzed words.</p>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="space-y-8 relative pb-24">
          {/* Timeline Line */}
          <div className="absolute left-[5.5rem] top-4 bottom-4 w-0.5 bg-zinc-800/50"></div>

          {arcPoints.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
              <p className="text-zinc-500 text-lg">No scenes found for <span className="text-zinc-300">{selectedChar}</span>.</p>
            </div>
          ) : (
            arcPoints.map((point, idx) => (
              <div key={idx} className="relative flex gap-8 group">

                {/* Left Meta Column */}
                <div className="w-20 flex-shrink-0 flex flex-col items-end pt-5 z-10">
                  <span className="font-mono text-sm font-bold text-blue-500 bg-zinc-950 px-1">{point.sceneId}</span>
                  {point.lineCount > 0 && (
                    <span className="text-[10px] text-zinc-500 mt-1 font-medium bg-zinc-950 px-1">
                      {point.lineCount} Lines
                    </span>
                  )}
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-[5.5rem] top-7 w-3 h-3 bg-zinc-800 rounded-full transform -translate-x-1/2 border-2 border-zinc-950 group-hover:bg-blue-500 group-hover:scale-125 transition z-10"></div>

                {/* Main Scene Card */}
                <div
                  onClick={() => onSelectScene(point.fullScene)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0 overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer group-hover:translate-x-1 duration-200"
                >
                  {/* Card Header */}
                  <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-800/30 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-blue-400 transition">{point.sceneTitle}</h3>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{point.sequence}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wide font-bold border border-zinc-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Go to Scene
                    </span>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* BEATS COLUMN */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Scene Beats</h4>
                      <div className="space-y-2">
                        {point.beats.map(beat => {
                          const isRelevant = point.relevantBeatIds.has(beat.id);
                          return (
                            <div key={beat.id} className={`flex gap-3 text-sm leading-relaxed p-2 rounded ${isRelevant ? 'bg-blue-900/10 border border-blue-900/30' : 'opacity-60'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isRelevant ? 'bg-blue-400' : 'bg-zinc-700'}`}></div>
                              <span className={isRelevant ? 'text-blue-100 font-medium' : 'text-zinc-400'}>
                                {beat.description}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* NOTES & TRACKING COLUMN */}
                    <div className="space-y-6">
                      {point.trackings.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Arc Tracking</h4>
                          <div className="space-y-2">
                            {point.trackings.map((t, i) => (
                              <div key={i} className="bg-zinc-950 border border-zinc-800 rounded p-2">
                                <span className="text-[10px] font-mono text-purple-400 block mb-1 uppercase">{t.category}</span>
                                <p className="text-xs text-zinc-300">{t.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterDashboard;
