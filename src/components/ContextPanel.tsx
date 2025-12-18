/**
 * ContextPanel - Side panel for beats, notes, tracking, and AI chat
 */

import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, NoteType, BoneyardItem, RewriteStatus, RewritePriority } from '../config/types';
import {
  analyzeSceneGap,
  chatWithScriptDoctor,
  generateAlternativeBeat,
  detectAndStoreCorrection,
  detectCharacterCorrection,
  addCharacterNote,
  getSessionMemoryState,
  generateDialogue,
  checkContinuity
} from '../services/geminiService';
import { SessionMemoryPanel } from './SessionMemoryPanel';
import { useAIAgents, useSceneSuggestions } from '../contexts/AIAgentsContext';
import { MarginNotesContainer } from './MarginNote';

interface ContextPanelProps {
  scene: Scene;
  allScenes: Scene[];
  boneyard: BoneyardItem[];
  addToBoneyard: (item: BoneyardItem) => void;
}

enum Tab {
  BEATS = 'Beats',
  NOTES = 'Notes',
  DOCTOR = 'AI',
  MORE = 'More'
}

// Sub-sections within More tab
type MoreSection = 'track' | 'cuts' | 'dialogue' | 'ideas';

// Simple Markdown Renderer Component
const MarkdownRenderer: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, idx) => {
        const key = idx;
        const trimmed = line.trim();

        if (trimmed.startsWith('###')) {
          return <h3 key={key} className="text-blue-400 font-bold text-sm mt-4 uppercase tracking-wide">{trimmed.replace(/###/g, '').trim()}</h3>;
        }
        if (trimmed.startsWith('##')) {
          return <h3 key={key} className="text-zinc-200 font-bold text-sm mt-3">{trimmed.replace(/##/g, '').trim()}</h3>;
        }
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return <p key={key} className="font-bold text-zinc-200 text-sm">{trimmed.replace(/\*\*/g, '')}</p>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.substring(2);
          const parts = text.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={key} className="flex gap-2 text-sm text-zinc-300 pl-2">
              <span className="text-blue-500">*</span>
              <p>
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-zinc-100 font-semibold">{part.replace(/\*\*/g, '')}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </p>
            </div>
          );
        }
        if (/^\d+\./.test(trimmed)) {
          return <div key={key} className="font-bold text-zinc-300 text-sm mt-2 mb-1">{trimmed}</div>;
        }

        if (trimmed === '') return <div key={key} className="h-2"></div>;

        return <p key={key} className="text-sm text-zinc-400 leading-relaxed">{trimmed}</p>;
      })}
    </div>
  );
};

// Helper to check if a page number falls within a page note key (e.g., "p1-4", "p5")
const isPageInRange = (pageKey: string, pageNumber: number): boolean => {
  const match = pageKey.match(/p(\d+)(?:-(\d+))?/i);
  if (!match) return false;

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : start;

  return pageNumber >= start && pageNumber <= end;
};

const ContextPanel: React.FC<ContextPanelProps> = ({ scene, allScenes, boneyard, addToBoneyard }) => {
  const { config, rewriteData } = useProject();

  // AI Suggestions
  const suggestions = useSceneSuggestions(scene.id);
  const { dismissSuggestion, acceptSuggestion } = useAIAgents();
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>(Tab.BEATS);
  const [moreSection, setMoreSection] = useState<MoreSection>('track');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Get page notes relevant to current scene
  const relevantPageNotes = React.useMemo(() => {
    if (!rewriteData?.pageNotes || !scene.pageNumber) return { amazon: [], pointGrey: [] };

    const pageNum = scene.pageNumber;
    const amazonNotes: { page: string; note: string }[] = [];
    const pointGreyNotes: { page: string; note: string }[] = [];

    Object.entries(rewriteData.pageNotes.amazon).forEach(([page, note]) => {
      if (isPageInRange(page, pageNum)) {
        amazonNotes.push({ page, note });
      }
    });

    Object.entries(rewriteData.pageNotes.pointGrey).forEach(([page, note]) => {
      if (isPageInRange(page, pageNum)) {
        pointGreyNotes.push({ page, note });
      }
    });

    return { amazon: amazonNotes, pointGrey: pointGreyNotes };
  }, [rewriteData, scene.pageNumber]);

  // Get rewrite goals relevant to current scene's act/sequence
  const relevantGoals = React.useMemo(() => {
    if (!rewriteData?.goals) return [];

    // Extract sequence number from scene.sequenceId (e.g., "SEQ_1" -> "1")
    const seqMatch = scene.sequenceId?.match(/(\d+)/);
    const seqNum = seqMatch ? seqMatch[1] : null;

    return rewriteData.goals.filter(goal => {
      // Always include goals that affect "All" acts
      const affectsAll = goal.actsAffected.some(act =>
        act.toLowerCase().includes('all')
      );
      if (affectsAll) return true;

      // Check if any actsAffected matches the current sequence
      if (seqNum) {
        return goal.actsAffected.some(act => {
          // Match patterns like "1", "2B", "esp. 1 & 2", etc.
          const actNumbers = act.match(/\d+/g);
          return actNumbers?.includes(seqNum);
        });
      }

      return false;
    });
  }, [rewriteData, scene.sequenceId]);

  // Status label helpers for Passes display
  const getPriorityStyle = (priority: RewritePriority) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-500 bg-red-600/20 border-red-600/40';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'MEDIUM': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'LOW': return 'text-zinc-400 bg-zinc-700/30 border-zinc-600/30';
      default: return 'text-zinc-400 bg-zinc-700/30 border-zinc-600/30';
    }
  };

  // Boneyard State
  const [snippetInput, setSnippetInput] = useState('');
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);
  const [generatedAlt, setGeneratedAlt] = useState<string | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Session Memory Panel State
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [memoryState, setMemoryState] = useState(getSessionMemoryState());

  // Dialogue Generation State
  const [dialogueCharacter, setDialogueCharacter] = useState('');
  const [dialogueIntent, setDialogueIntent] = useState('');
  const [isGeneratingDialogue, setIsGeneratingDialogue] = useState(false);
  const [generatedDialogue, setGeneratedDialogue] = useState<string | null>(null);

  // Continuity Check State
  const [isCheckingContinuity, setIsCheckingContinuity] = useState(false);
  const [continuityResult, setContinuityResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeSceneGap(scene, allScenes, config);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');

    // Auto-detect corrections in user message
    const correctionDetected = detectAndStoreCorrection(userMsg);

    // Check for character-specific corrections
    const charCorrection = detectCharacterCorrection(userMsg);
    if (charCorrection) {
      addCharacterNote(charCorrection.character, charCorrection.note);
    }

    // Update memory state if corrections were detected
    if (correctionDetected || charCorrection) {
      setMemoryState(getSessionMemoryState());
    }

    const newHistory = [...chatHistory, { role: 'user', parts: [{ text: userMsg }] }];
    setChatHistory(newHistory);
    setIsChatting(true);

    const response = await chatWithScriptDoctor(newHistory, userMsg, allScenes, config, scene);
    setChatHistory([...newHistory, { role: 'model', parts: [{ text: response }] }]);
    setIsChatting(false);
  };

  const handleSaveSnippet = () => {
    if (!snippetInput.trim()) return;
    addToBoneyard({
      id: Date.now().toString(),
      content: snippetInput,
      type: 'snippet',
      date: new Date()
    });
    setSnippetInput('');
  };

  const handleGenerateAlt = async () => {
    setIsGeneratingAlt(true);
    const beat = scene.beats.find(b => !b.completed)?.description || scene.summary;
    const result = await generateAlternativeBeat(scene, beat, allScenes, config);
    setGeneratedAlt(result);
    setIsGeneratingAlt(false);
  };

  const saveGeneratedAlt = () => {
    if (generatedAlt) {
      addToBoneyard({
        id: Date.now().toString(),
        content: `Alt for ${scene.title}: ${generatedAlt}`,
        type: 'ai-generated',
        date: new Date()
      });
      setGeneratedAlt(null);
    }
  };

  const handleGenerateDialogue = async () => {
    if (!dialogueCharacter.trim() || !dialogueIntent.trim()) return;
    setIsGeneratingDialogue(true);
    const result = await generateDialogue(scene, dialogueCharacter, dialogueIntent, allScenes, config);
    setGeneratedDialogue(result);
    setIsGeneratingDialogue(false);
  };

  const saveGeneratedDialogue = () => {
    if (generatedDialogue) {
      addToBoneyard({
        id: Date.now().toString(),
        content: `Dialogue for ${dialogueCharacter}: ${generatedDialogue}`,
        type: 'ai-generated',
        date: new Date()
      });
      setGeneratedDialogue(null);
      setDialogueCharacter('');
      setDialogueIntent('');
    }
  };

  const handleCheckContinuity = async () => {
    setIsCheckingContinuity(true);
    const result = await checkContinuity(scene, allScenes, config);
    setContinuityResult(result);
    setIsCheckingContinuity(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const getNoteColor = (type: NoteType) => {
    switch (type) {
      case NoteType.REWRITE: return 'text-red-400 border-red-400/30 bg-red-400/10';
      case NoteType.LOGIC: return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case NoteType.CHARACTER: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case NoteType.THEME: return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div
      ref={panelRef}
      className="w-full bg-transparent flex flex-col h-full"
    >
      {/* AI Suggestions Section - Collapsible */}
      {suggestions.length > 0 && (
        <div className="border-b border-zinc-800 shrink-0">
          <button
            onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-zinc-300">
                {suggestions.length} AI Suggestion{suggestions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-zinc-500 transition-transform ${suggestionsExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {suggestionsExpanded && (
            <div className="px-2 pb-2">
              <MarginNotesContainer
                suggestions={suggestions}
                onAccept={acceptSuggestion}
                onDismiss={dismissSuggestion}
              />
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-hide shrink-0">
        {Object.values(Tab).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2.5 text-[9px] font-semibold uppercase tracking-wide transition-colors whitespace-nowrap px-3 ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400 bg-zinc-800/50'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* BEATS TAB */}
        {activeTab === Tab.BEATS && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 mb-2">Scene Beats</h3>
            {scene.beats.map((beat) => (
              <div key={beat.id} className="flex items-start gap-3 p-3 bg-zinc-950 rounded border border-zinc-800">
                <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${beat.completed ? 'bg-green-500/20 border-green-500' : 'border-zinc-600'}`}>
                  {beat.completed && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{beat.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* NOTES TAB - Scene notes + External Feedback + Rewrite Passes integrated */}
        {activeTab === Tab.NOTES && (
          <div className="space-y-4">
            {/* Scene Notes */}
            {scene.notes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Scene Notes</h3>
                  <span className="text-[10px] text-zinc-600">({scene.notes.length})</span>
                </div>
                {scene.notes.map((note) => (
                  <div key={note.id} className={`p-3 rounded border ${getNoteColor(note.type)}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold">{note.author}</span>
                      <span className="text-[10px] uppercase opacity-70 border px-1 rounded border-current">{note.type}</span>
                    </div>
                    <p className="text-sm leading-relaxed opacity-90">{note.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* External Feedback */}
            {(relevantPageNotes.amazon.length > 0 || relevantPageNotes.pointGrey.length > 0) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Studio Feedback</h3>
                  <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">p.{scene.pageNumber || '?'}</span>
                </div>
                {relevantPageNotes.amazon.map((item, idx) => (
                  <div key={`amazon-${idx}`} className="p-3 rounded border bg-orange-900/10 border-orange-800/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-orange-400">Amazon</span>
                      <span className="text-[10px] text-orange-400/70">{item.page}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item.note}</p>
                  </div>
                ))}
                {relevantPageNotes.pointGrey.map((item, idx) => (
                  <div key={`pg-${idx}`} className="p-3 rounded border bg-purple-900/10 border-purple-800/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-purple-400">Point Grey</span>
                      <span className="text-[10px] text-purple-400/70">{item.page}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Rewrite Passes - THE BRILLIANT INTEGRATION */}
            {relevantGoals.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide">Active Passes</h3>
                    <span className="text-[10px] text-zinc-600">({relevantGoals.length})</span>
                  </div>
                  <span className="text-[9px] text-zinc-600">
                    Seq {scene.sequenceId?.replace('SEQ_', '') || '?'}
                  </span>
                </div>

                {/* Priority-sorted goals with visual hierarchy */}
                {relevantGoals
                  .sort((a, b) => {
                    const priorityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map((goal) => (
                    <div
                      key={goal.id}
                      className={`p-3 rounded-lg border transition-all ${
                        goal.priority === 'CRITICAL'
                          ? 'bg-red-950/30 border-red-800/50 hover:border-red-600/50'
                          : goal.priority === 'HIGH'
                            ? 'bg-orange-950/20 border-orange-800/40 hover:border-orange-600/50'
                            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {/* Compact header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{goal.status.split(' ')[0]}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${getPriorityStyle(goal.priority)}`}>
                          {goal.priority}
                        </span>
                        {goal.passType && (
                          <span className="px-1.5 py-0.5 text-[9px] text-zinc-500 bg-zinc-800/80 rounded">
                            {goal.passType}
                          </span>
                        )}
                      </div>

                      {/* Goal - the what */}
                      <p className="text-sm font-medium text-zinc-200 mb-2 leading-snug">{goal.goal}</p>

                      {/* Next Move - the actionable part, highlighted */}
                      <div className="p-2 bg-emerald-900/20 rounded border border-emerald-900/40">
                        <div className="flex items-center gap-1 mb-1">
                          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-wide">Next Move</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">{goal.concreteNextMove}</p>
                      </div>

                      {/* Source tags */}
                      {goal.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {goal.sources.slice(0, 3).map((source, i) => (
                            <span key={i} className="px-1 py-0.5 text-[9px] bg-zinc-800/60 text-zinc-500 rounded">
                              {source}
                            </span>
                          ))}
                          {goal.sources.length > 3 && (
                            <span className="text-[9px] text-zinc-600">+{goal.sources.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Empty state */}
            {scene.notes.length === 0 && relevantPageNotes.amazon.length === 0 && relevantPageNotes.pointGrey.length === 0 && relevantGoals.length === 0 && (
              <div className="text-center py-8 text-zinc-600">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs italic">No notes or active passes for this scene</p>
              </div>
            )}

            {/* Quick Analysis button */}
            <div className="pt-3 border-t border-zinc-800">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3 h-3 border border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analyze Scene Gaps
                  </>
                )}
              </button>
              {analysis && (
                <div className="mt-3 p-3 bg-zinc-900/80 rounded border border-zinc-700 max-h-48 overflow-y-auto">
                  <MarkdownRenderer content={analysis} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* MORE TAB - Well-designed overflow for Track, Cuts, Dialogue, Ideas */}
        {activeTab === Tab.MORE && (
          <div className="space-y-4">
            {/* Section Switcher - Clean pill design */}
            <div className="flex gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
              {[
                { key: 'track' as MoreSection, label: 'Track', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { key: 'cuts' as MoreSection, label: 'Cuts', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                { key: 'dialogue' as MoreSection, label: 'Dialogue', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                { key: 'ideas' as MoreSection, label: 'Ideas', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setMoreSection(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-[10px] font-semibold uppercase tracking-wide rounded-md transition-all ${
                    moreSection === key
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon} />
                  </svg>
                  {label}
                </button>
              ))}
            </div>

            {/* TRACK Section - Scene tracking and continuity */}
            {moreSection === 'track' && (
              <div className="space-y-4">
                {scene.tracking.length > 0 ? (
                  <div className="space-y-3">
                    {scene.tracking.map((item, idx) => (
                      <div key={idx} className="group">
                        <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1 group-hover:text-zinc-300 transition">{item.category}</h4>
                        <p className="text-sm text-zinc-300 border-l-2 border-zinc-700 pl-3 py-1 group-hover:border-blue-500 transition">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 italic p-3 bg-zinc-900/50 rounded border border-zinc-800">
                    No tracking items for this scene.
                  </p>
                )}

                {/* AI Continuity Check */}
                <div className="p-3 bg-amber-900/10 rounded-lg border border-amber-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-xs font-bold text-amber-400 uppercase">Continuity Check</h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 mb-3">Scan for timeline issues, logic errors, missing setup/payoff.</p>
                  <button
                    onClick={handleCheckContinuity}
                    disabled={isCheckingContinuity}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCheckingContinuity ? (
                      <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Checking...</>
                    ) : (
                      'Check Continuity'
                    )}
                  </button>
                  {continuityResult && (
                    <div className="mt-3 p-3 bg-zinc-900 rounded border border-zinc-700 max-h-48 overflow-y-auto">
                      <MarkdownRenderer content={continuityResult} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CUTS Section - Boneyard */}
            {moreSection === 'cuts' && (
              <div className="space-y-4">
                {/* Quick Save */}
                <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Save to Boneyard</h4>
                  <textarea
                    value={snippetInput}
                    onChange={(e) => setSnippetInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 mb-2 h-20 focus:border-blue-500 outline-none resize-none"
                    placeholder="Paste cut dialogue or ideas here..."
                  />
                  <button
                    onClick={handleSaveSnippet}
                    disabled={!snippetInput.trim()}
                    className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 rounded transition disabled:opacity-50"
                  >
                    Save Snippet
                  </button>
                </div>

                {/* Saved Items */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">
                    Saved Items {boneyard.length > 0 && <span className="text-zinc-600">({boneyard.length})</span>}
                  </h4>
                  {boneyard.length === 0 ? (
                    <p className="text-xs text-zinc-600 italic p-3 bg-zinc-900/30 rounded border border-zinc-800">
                      Boneyard is empty. Save cut dialogue and ideas here.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {boneyard.map(item => (
                        <div key={item.id} className="p-2 bg-zinc-800/50 rounded border border-zinc-800">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${item.type === 'ai-generated' ? 'bg-blue-900/30 text-blue-400' : 'bg-zinc-700 text-zinc-400'}`}>{item.type}</span>
                            <span className="text-[9px] text-zinc-600">{item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-zinc-300 line-clamp-3 whitespace-pre-wrap">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DIALOGUE Section - AI Dialogue Generator */}
            {moreSection === 'dialogue' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-900/10 rounded-lg border border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase">Dialogue Generator</h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 mb-4">Generate 3 options: direct, subtextual, and thematic.</p>

                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={dialogueCharacter}
                      onChange={(e) => setDialogueCharacter(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:border-emerald-500 outline-none"
                      placeholder="Character name..."
                    />
                    <input
                      type="text"
                      value={dialogueIntent}
                      onChange={(e) => setDialogueIntent(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:border-emerald-500 outline-none"
                      placeholder="What they need to convey..."
                    />
                  </div>

                  <button
                    onClick={handleGenerateDialogue}
                    disabled={isGeneratingDialogue || !dialogueCharacter.trim() || !dialogueIntent.trim()}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGeneratingDialogue ? (
                      <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Writing...</>
                    ) : (
                      'Generate Dialogue'
                    )}
                  </button>

                  {generatedDialogue && (
                    <div className="mt-4 p-3 bg-zinc-900 rounded border border-zinc-700 max-h-48 overflow-y-auto">
                      <MarkdownRenderer content={generatedDialogue} />
                      <button
                        onClick={saveGeneratedDialogue}
                        className="w-full mt-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] uppercase font-bold text-emerald-400 rounded transition"
                      >
                        Save to Boneyard
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IDEAS Section - AI Idea Generator */}
            {moreSection === 'ideas' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-900/10 rounded-lg border border-blue-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h4 className="text-xs font-bold text-blue-400 uppercase">Idea Generator</h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 mb-4">Stuck? Generate 3 radically different versions of this beat.</p>

                  <button
                    onClick={handleGenerateAlt}
                    disabled={isGeneratingAlt}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGeneratingAlt ? (
                      <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Brainstorming...</>
                    ) : (
                      'Generate Alternatives'
                    )}
                  </button>

                  {generatedAlt && (
                    <div className="mt-4 p-3 bg-zinc-900 rounded border border-zinc-700 max-h-64 overflow-y-auto">
                      <MarkdownRenderer content={generatedAlt} />
                      <button
                        onClick={saveGeneratedAlt}
                        className="w-full mt-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] uppercase font-bold text-blue-400 rounded transition"
                      >
                        Save to Boneyard
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DOCTOR TAB */}
        {activeTab === Tab.DOCTOR && (
          <div className="flex flex-col h-full">
            {/* AI Context Header */}
            <div className="mb-3 pb-3 border-b border-zinc-800">
              {/* Tone descriptor */}
              {config.ai?.toneDescriptor && (
                <div className="mb-2 p-2 bg-blue-900/10 rounded border border-blue-900/30">
                  <p className="text-[10px] text-blue-400 uppercase tracking-wide mb-1">Tone</p>
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">{config.ai.toneDescriptor}</p>
                </div>
              )}

              {/* Key Constraints (collapsed preview) */}
              {config.ai?.uniqueConstraints && config.ai.uniqueConstraints.length > 0 && (
                <div className="p-2 bg-red-900/10 rounded border border-red-900/30">
                  <p className="text-[10px] text-red-400 uppercase tracking-wide mb-1">
                    {config.ai.uniqueConstraints.length} Story Constraints Active
                  </p>
                  <p className="text-[10px] text-zinc-500 italic line-clamp-1">
                    {config.ai.uniqueConstraints[0]}
                  </p>
                </div>
              )}

              {/* Memory Panel Toggle */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-800/50">
                <div className="text-xs text-zinc-500">
                  {memoryState.correctionCount > 0 && (
                    <span className="text-blue-400">{memoryState.correctionCount} corrections learned</span>
                  )}
                </div>
                <button
                  onClick={() => setShowMemoryPanel(true)}
                  className="px-2 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded uppercase tracking-wide transition"
                >
                  Memory Settings
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px] p-1">
              {chatHistory.length === 0 && (
                <div className="text-center text-zinc-500 text-sm mt-10 px-4">
                  <p className="mb-2"><strong>Script Doctor is Online</strong></p>
                  <p className="text-xs">I've read "{config.title}". Ask me about continuity, tone, or character voice.</p>
                  {config.ai?.styleReferences && config.ai.styleReferences.length > 0 && (
                    <p className="text-[10px] text-zinc-600 mt-2">
                      Style refs: {config.ai.styleReferences.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`rounded p-3 text-sm ${msg.role === 'user' ? 'bg-blue-600/10 border border-blue-600/20 ml-4' : 'bg-zinc-800 border border-zinc-700 mr-4'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-zinc-200">{msg.parts[0].text}</p>
                  ) : (
                    <MarkdownRenderer content={msg.parts[0].text} />
                  )}
                </div>
              ))}
              {isChatting && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs bg-zinc-900/50 p-2 rounded w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="pt-2 border-t border-zinc-800">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Ask specifically about this scene..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 resize-none h-20"
              />
              <div className="flex justify-end mt-2">
                <button onClick={handleSendMessage} disabled={isChatting} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition shadow-lg disabled:opacity-50">
                  SEND MESSAGE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Session Memory Panel Modal */}
      <SessionMemoryPanel
        isOpen={showMemoryPanel}
        onClose={() => {
          setShowMemoryPanel(false);
          setMemoryState(getSessionMemoryState()); // Refresh state after changes
        }}
        characterNames={allScenes.flatMap(s =>
          s.beats.map(b => b.description.match(/^([A-Z][A-Z\s]+):/)?.[1]).filter(Boolean) as string[]
        ).filter((v, i, a) => a.indexOf(v) === i)}
      />
    </div>
  );
};

export default ContextPanel;
