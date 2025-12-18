/**
 * ContextPanel - Side panel for beats, notes, tracking, and AI chat
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, NoteType, BoneyardItem } from '../config/types';
import {
  analyzeSceneGap,
  chatWithScriptDoctor,
  generateAlternativeBeat,
  generateDialogue,
  checkContinuity
} from '../services/geminiService';

interface ContextPanelProps {
  scene: Scene;
  allScenes: Scene[];
  boneyard: BoneyardItem[];
  addToBoneyard: (item: BoneyardItem) => void;
}

enum Tab {
  BEATS = 'Beats',
  NOTES = 'Notes',
  TRACKING = 'Tracking',
  BONEYARD = 'Boneyard',
  DOCTOR = 'Dr. Gemini'
}

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

  const [activeTab, setActiveTab] = useState<Tab>(Tab.BEATS);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(384); // 24rem default (w-96)
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(280, Math.min(800, newWidth))); // Min 280px, max 800px
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

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

  // Boneyard State
  const [snippetInput, setSnippetInput] = useState('');
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);
  const [generatedAlt, setGeneratedAlt] = useState<string | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

    const newHistory = [...chatHistory, { role: 'user', parts: [{ text: userMsg }] }];
    setChatHistory(newHistory);
    setIsChatting(true);

    const response = await chatWithScriptDoctor(newHistory, userMsg, allScenes, config);
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
      style={{ width: panelWidth }}
      className="bg-zinc-900 border-l border-zinc-800 flex flex-col h-full relative shrink-0"
    >
      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-20 ${isResizing ? 'bg-blue-500' : 'bg-transparent'}`}
      />

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-hide shrink-0">
        {Object.values(Tab).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[70px] py-3 text-[10px] font-medium uppercase tracking-wider transition-colors whitespace-nowrap px-2 ${
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

        {/* NOTES TAB */}
        {activeTab === Tab.NOTES && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 mb-2">Rewrite Notes</h3>
            {scene.notes.map((note) => (
              <div key={note.id} className={`p-3 rounded border ${getNoteColor(note.type)}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold">{note.author}</span>
                  <span className="text-[10px] uppercase opacity-70 border px-1 rounded border-current">{note.type}</span>
                </div>
                <p className="text-sm leading-relaxed opacity-90">{note.content}</p>
              </div>
            ))}

            {/* Page-specific feedback notes from rewrite data */}
            {(relevantPageNotes.amazon.length > 0 || relevantPageNotes.pointGrey.length > 0) && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">
                  Feedback for Page {scene.pageNumber}
                </h4>

                {relevantPageNotes.amazon.map((item, idx) => (
                  <div key={`amazon-${idx}`} className="p-3 rounded border mb-2 bg-orange-900/10 border-orange-800/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-orange-400">Amazon</span>
                      <span className="text-[10px] text-orange-400/70">{item.page}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item.note}</p>
                  </div>
                ))}

                {relevantPageNotes.pointGrey.map((item, idx) => (
                  <div key={`pg-${idx}`} className="p-3 rounded border mb-2 bg-purple-900/10 border-purple-800/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-purple-400">Point Grey</span>
                      <span className="text-[10px] text-purple-400/70">{item.page}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item.note}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded font-bold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-lg"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Scene Gaps"}
            </button>
            {analysis && (
              <div className="mt-4 p-4 bg-zinc-800/50 rounded border border-zinc-700">
                <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">AI Analysis Results</h4>
                <MarkdownRenderer content={analysis} />
              </div>
            )}
          </div>
        )}

        {/* TRACKING TAB */}
        {activeTab === Tab.TRACKING && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 mb-2">Tracking Areas</h3>
            {scene.tracking.map((item, idx) => (
              <div key={idx} className="group">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-1 group-hover:text-zinc-300 transition">{item.category}</h4>
                <p className="text-sm text-zinc-300 border-l-2 border-zinc-700 pl-3 py-1 group-hover:border-blue-500 transition">{item.description}</p>
              </div>
            ))}

            {/* AI Continuity Check */}
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <div className="bg-gradient-to-b from-amber-900/10 to-transparent p-3 rounded border border-amber-900/30">
                <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">AI Continuity Check</h4>
                <p className="text-xs text-zinc-500 mb-3">Check this scene for timeline issues, logic errors, and missing setup/payoff.</p>
                <button
                  onClick={handleCheckContinuity}
                  disabled={isCheckingContinuity}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded shadow-lg shadow-amber-900/20 transition disabled:opacity-50"
                >
                  {isCheckingContinuity ? "Checking..." : "Check Continuity"}
                </button>

                {continuityResult && (
                  <div className="mt-3 p-3 bg-zinc-900 rounded border border-zinc-700 max-h-64 overflow-y-auto">
                    <MarkdownRenderer content={continuityResult} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BONEYARD TAB */}
        {activeTab === Tab.BONEYARD && (
          <div className="space-y-4">
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Quick Save</h4>
              <textarea
                value={snippetInput}
                onChange={(e) => setSnippetInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-zinc-300 mb-2 h-20 focus:border-blue-500 outline-none resize-none"
                placeholder="Paste cut dialogue or idea here..."
              />
              <button onClick={handleSaveSnippet} className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-xs uppercase font-bold text-zinc-400 rounded transition">
                Save to Boneyard
              </button>
            </div>

            <div className="bg-gradient-to-b from-blue-900/10 to-transparent p-3 rounded border border-blue-900/30">
              <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">AI Idea Generator</h4>
              <p className="text-xs text-zinc-500 mb-3">Stuck? Generate 3 radically different versions of this beat.</p>
              <button
                onClick={handleGenerateAlt}
                disabled={isGeneratingAlt}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg shadow-blue-900/20 transition"
              >
                {isGeneratingAlt ? "Brainstorming..." : "Generate Alternatives"}
              </button>

              {generatedAlt && (
                <div className="mt-3 p-3 bg-zinc-900 rounded border border-zinc-700">
                  <MarkdownRenderer content={generatedAlt} />
                  <button onClick={saveGeneratedAlt} className="w-full mt-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] uppercase font-bold text-green-400 rounded">
                    Keep in Boneyard
                  </button>
                </div>
              )}
            </div>

            {/* AI Dialogue Generator */}
            <div className="bg-gradient-to-b from-emerald-900/10 to-transparent p-3 rounded border border-emerald-900/30">
              <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">AI Dialogue Generator</h4>
              <p className="text-xs text-zinc-500 mb-3">Generate 3 dialogue options: direct, subtextual, and thematic.</p>
              <input
                type="text"
                value={dialogueCharacter}
                onChange={(e) => setDialogueCharacter(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-sm text-zinc-300 mb-2 focus:border-emerald-500 outline-none"
                placeholder="Character name..."
              />
              <input
                type="text"
                value={dialogueIntent}
                onChange={(e) => setDialogueIntent(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-sm text-zinc-300 mb-2 focus:border-emerald-500 outline-none"
                placeholder="What they need to convey..."
              />
              <button
                onClick={handleGenerateDialogue}
                disabled={isGeneratingDialogue || !dialogueCharacter.trim() || !dialogueIntent.trim()}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-lg shadow-emerald-900/20 transition disabled:opacity-50"
              >
                {isGeneratingDialogue ? "Writing..." : "Generate Dialogue"}
              </button>

              {generatedDialogue && (
                <div className="mt-3 p-3 bg-zinc-900 rounded border border-zinc-700 max-h-48 overflow-y-auto">
                  <MarkdownRenderer content={generatedDialogue} />
                  <button onClick={saveGeneratedDialogue} className="w-full mt-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] uppercase font-bold text-green-400 rounded">
                    Keep in Boneyard
                  </button>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Saved Items</h4>
              <div className="space-y-2">
                {boneyard.length === 0 && <p className="text-xs text-zinc-600 italic">Boneyard is empty.</p>}
                {boneyard.map(item => (
                  <div key={item.id} className="p-2 bg-zinc-800/50 rounded border border-zinc-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] uppercase px-1 rounded ${item.type === 'ai-generated' ? 'bg-blue-900/30 text-blue-400' : 'bg-zinc-700 text-zinc-400'}`}>{item.type}</span>
                      <span className="text-[10px] text-zinc-600">{item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-zinc-300 line-clamp-4 whitespace-pre-wrap">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCTOR TAB */}
        {activeTab === Tab.DOCTOR && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px] p-1">
              {chatHistory.length === 0 && (
                <div className="text-center text-zinc-500 text-sm mt-10 px-4">
                  <p className="mb-2"><strong>Script Doctor is Online</strong></p>
                  <p className="text-xs">I've read "{config.title}". Ask me about continuity, tone, or character voice.</p>
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
    </div>
  );
};

export default ContextPanel;
