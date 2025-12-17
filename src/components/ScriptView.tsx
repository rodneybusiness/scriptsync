/**
 * ScriptView - Main script editing and viewing component
 */

import React, { useState, useEffect } from 'react';
import { Scene, LintIssue } from '../config/types';
import { parseFountainToReact, calculatePacingScore, getPacingColor, lintScript } from '../services/scriptUtils';
import { stopSpeaking } from '../services/ttsService';

interface ScriptViewProps {
  scene: Scene;
  allScenes: Scene[];
  onUpdateScript: (newContent: string) => void;
  onSelectScene: (scene: Scene) => void;
}

const ScriptView: React.FC<ScriptViewProps> = ({ scene, allScenes, onUpdateScript, onSelectScene }) => {
  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(scene.scriptContent);
  const [activeVariant, setActiveVariant] = useState('A');

  // Features
  const [paradoxWarning, setParadoxWarning] = useState<string | null>(null);
  const [lintIssues, setLintIssues] = useState<LintIssue[]>([]);

  // Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeechLine, setCurrentSpeechLine] = useState<number>(-1);

  // --- EFFECTS ---

  // Sync content when scene changes or variant toggles
  useEffect(() => {
    const content = (scene.variants && scene.variants[activeVariant]) ? scene.variants[activeVariant] : scene.scriptContent;
    setEditContent(content);
    setIsEditing(false);
    setParadoxWarning(null);
    setLintIssues([]);
    stopSpeaking();
    setIsPlaying(false);
  }, [scene.id, activeVariant, scene.scriptContent, scene.variants]);

  // Causal Ripple & Proactive Linter
  useEffect(() => {
    if (isEditing) {
      // Ripple Check
      if (scene.connections && scene.connections.length > 0) {
        const originalLength = scene.scriptContent.length;
        const currentLength = editContent.length;
        const diff = Math.abs(currentLength - originalLength);
        if (diff > 50) {
          setParadoxWarning("Significant edits detected. Check linked scenes for continuity.");
        } else {
          setParadoxWarning(null);
        }
      }

      // Proactive Linter (Debounced 1s)
      const timer = setTimeout(() => {
        const issues = lintScript(editContent, scene);
        setLintIssues(issues);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [editContent, isEditing, scene.connections, scene.scriptContent, scene]);

  // --- HANDLERS ---

  const handleSave = () => {
    onUpdateScript(editContent);
    setIsEditing(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      setCurrentSpeechLine(-1);
      return;
    }
    // TTS implementation would go here
    setIsPlaying(true);
  };

  const getConnectedScene = (id: string) => allScenes.find(s => s.id === id);
  const pacingScore = calculatePacingScore(editContent);
  const pacingColor = getPacingColor(pacingScore);

  return (
    <div className="flex-1 bg-zinc-950 overflow-hidden relative flex flex-col h-full">

      {/* Main Scroll Area */}
      <div className="flex-1 overflow-y-auto flex">

        {/* LEFT MARGIN: Causal Ripple Engine */}
        <div className="w-16 border-r border-zinc-800/50 flex flex-col items-center py-8 bg-zinc-950/50 shrink-0 z-20">
          {scene.connections?.map((conn, idx) => {
            const target = getConnectedScene(conn.targetSceneId);
            const isRisk = paradoxWarning && conn.type === 'causal';

            return (
              <div key={idx} className="mb-8 relative group flex flex-col items-center">
                <div className={`w-px h-8 mb-2 ${isRisk ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                <button
                  onClick={() => target && onSelectScene(target)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all relative z-10 ${
                    conn.type === 'causal'
                      ? isRisk ? 'bg-red-900 text-red-100 border-red-500 animate-pulse' : 'bg-red-900/20 text-red-400 border-red-900/50'
                      : conn.type === 'echo'
                        ? 'bg-blue-900/20 text-blue-400 border-blue-900/50'
                        : 'bg-purple-900/20 text-purple-400 border-purple-900/50'
                  }`}
                >
                  {idx + 1}
                </button>
                {/* Tooltip */}
                <div className="absolute left-10 top-0 w-48 bg-zinc-900 border border-zinc-700 p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition z-50">
                  <p className="text-[10px] font-bold uppercase mb-1 text-zinc-500">{conn.type} Link</p>
                  <p className="text-xs text-zinc-200 mb-2">{conn.description}</p>
                  {target && (
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                      <span className="text-[10px] font-mono text-blue-400">{target.id}</span>
                      <span className="text-[10px] text-zinc-400 truncate">{target.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER: Script Page */}
        <div className="flex-1 py-12 px-12 lg:px-24 max-w-5xl mx-auto relative">

          {/* Header & Toolbar */}
          <div className="mb-8 sticky top-0 bg-zinc-950/95 backdrop-blur z-10 pb-4 border-b border-zinc-800">
            {paradoxWarning && (
              <div className="mb-2 bg-red-900/20 border border-red-900/50 text-red-200 text-xs font-bold px-4 py-2 rounded flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">!</span>
                  <span>{paradoxWarning}</span>
                </div>
                <button className="underline opacity-80 hover:opacity-100 uppercase text-[10px]">Review Connections</button>
              </div>
            )}

            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-900/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Current Scene {scene.id}
                  </span>
                  {/* Linter Status */}
                  {lintIssues.length > 0 && isEditing && (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-900/20 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      <span>*</span> {lintIssues.length} Issues Found
                    </span>
                  )}

                  {/* Pacing Badge */}
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800`}>
                    <div className={`w-2 h-2 rounded-full ${pacingColor}`}></div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">{pacingScore}/100 Pacing</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 font-script tracking-tight">{scene.title.toUpperCase()}</h1>
              </div>

              <div className="flex gap-2">
                {/* Audio Button */}
                <button
                  onClick={togglePlay}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isPlaying ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                  title="AI Table Read"
                >
                  {isPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  ) : (
                    <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>

                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`text-xs font-bold uppercase px-6 py-2 rounded transition shadow-sm ${
                    isEditing
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-white'
                  }`}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {/* Branching Realities Tabs */}
            {scene.variants && (
              <div className="flex mt-4 border-b border-zinc-800">
                <button
                  onClick={() => setActiveVariant('A')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeVariant === 'A' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                  Version A (Original)
                </button>
                <button
                  onClick={() => setActiveVariant('B')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeVariant === 'B' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                  Version B (Alternate)
                </button>
              </div>
            )}
          </div>

          {/* Script Content Editor */}
          <div className="min-h-[800px] bg-zinc-900/30 rounded-sm border-l-4 border-zinc-800 p-8 lg:p-16 shadow-inner relative">

            {isEditing ? (
              <div className="relative">
                {/* Linter Highlights Overlay */}
                <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col items-end pt-1">
                  {lintIssues.map(issue => (
                    <div
                      key={issue.id}
                      className="absolute right-0 w-2 h-2 rounded-full bg-amber-500 cursor-help group"
                      style={{ top: `${(issue.line * 1.5) + 1}rem` }}
                    >
                      <div className="absolute left-4 top-0 w-48 bg-zinc-800 text-xs p-2 rounded border border-zinc-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                        <span className="font-bold text-amber-400 block mb-1 capitalize">{issue.type} Issue</span>
                        {issue.message}
                      </div>
                    </div>
                  ))}
                </div>

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-[800px] bg-transparent text-zinc-200 font-script text-lg leading-relaxed border-none focus:ring-0 resize-none outline-none"
                  spellCheck={false}
                  autoFocus
                />
              </div>
            ) : (
              <div className="font-script space-y-1">
                {editContent.split('\n').map((line, i) => {
                  const { content, classes } = parseFountainToReact(line, i);
                  const isSpoken = isPlaying && i === currentSpeechLine;
                  return (
                    <div key={i} className={`${classes} ${isSpoken ? 'bg-yellow-900/30 text-yellow-100 transition duration-300 rounded px-2 -mx-2' : ''}`}>
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptView;
