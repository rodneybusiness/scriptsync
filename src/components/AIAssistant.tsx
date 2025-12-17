/**
 * AI Assistant Components
 *
 * Inline AI suggestions, quick actions, and smart rewrite helpers.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Scene, ProjectConfig } from '../config/types';
import {
  analyzeSceneGap,
  generateDialogue,
  generateAlternativeBeat,
  checkContinuity,
  isAIAvailable,
} from '../services/geminiService';
import { Spinner } from './LoadingStates';

// =============================================================================
// AI STATUS INDICATOR
// =============================================================================

export const AIStatusIndicator: React.FC = () => {
  const available = isAIAvailable();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
      <span className="text-xs text-zinc-400">
        {available ? 'AI Ready' : 'AI Offline'}
      </span>
    </div>
  );
};

// =============================================================================
// QUICK AI ACTIONS
// =============================================================================

interface QuickAIActionsProps {
  scene: Scene;
  allScenes: Scene[];
  config: ProjectConfig;
  onInsertText?: (text: string) => void;
}

export const QuickAIActions: React.FC<QuickAIActionsProps> = ({
  scene,
  allScenes,
  config,
  onInsertText,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const available = isAIAvailable();

  const handleAction = useCallback(async (
    action: string,
    fn: () => Promise<string>
  ) => {
    if (!available) {
      setError('AI is not configured. Add VITE_GEMINI_API_KEY to enable.');
      return;
    }

    setLoading(action);
    setError(null);
    setResult(null);

    try {
      const response = await fn();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoading(null);
    }
  }, [available]);

  const actions = [
    {
      id: 'analyze',
      label: 'Analyze Scene',
      icon: '🔍',
      action: () => analyzeSceneGap(scene, allScenes, config),
    },
    {
      id: 'continuity',
      label: 'Check Continuity',
      icon: '🔗',
      action: () => checkContinuity(scene, allScenes, config),
    },
    {
      id: 'dialogue',
      label: 'Generate Dialogue',
      icon: '💬',
      action: () => generateDialogue(scene, 'CHARACTER', 'Express emotion', allScenes, config),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {actions.map(a => (
          <button
            key={a.id}
            onClick={() => handleAction(a.id, a.action)}
            disabled={loading !== null || !available}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition ${
              !available
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : loading === a.id
                ? 'bg-blue-900 text-blue-300'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {loading === a.id ? <Spinner size="sm" /> : <span>{a.icon}</span>}
            {a.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 uppercase font-medium">AI Analysis</span>
            <div className="flex gap-2">
              {onInsertText && (
                <button
                  onClick={() => onInsertText(result)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Insert
                </button>
              )}
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs text-zinc-400 hover:text-zinc-300"
              >
                Copy
              </button>
              <button
                onClick={() => setResult(null)}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            </div>
          </div>
          <div
            className="prose prose-invert prose-sm max-w-none text-zinc-300"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(result) }}
          />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// INLINE SUGGESTION
// =============================================================================

interface InlineSuggestionProps {
  trigger: string;
  scene: Scene;
  allScenes: Scene[];
  config: ProjectConfig;
  onAccept: (text: string) => void;
  onDismiss: () => void;
}

export const InlineSuggestion: React.FC<InlineSuggestionProps> = ({
  trigger,
  scene,
  allScenes,
  config,
  onAccept,
  onDismiss,
}) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isAIAvailable()) {
        setError('AI not configured');
        setLoading(false);
        return;
      }

      try {
        // Generate based on trigger context
        let result: string;
        if (trigger.includes('beat')) {
          result = await generateAlternativeBeat(scene, trigger, allScenes, config);
        } else {
          result = await generateDialogue(scene, 'CHARACTER', trigger, allScenes, config);
        }

        // Parse result into options
        const lines = result.split('\n').filter(l => l.trim());
        setSuggestions(lines.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [trigger, scene, allScenes, config]);

  if (loading) {
    return (
      <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-3 z-50">
        <div className="flex items-center gap-2 text-zinc-400">
          <Spinner size="sm" />
          Generating suggestions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-full left-0 mt-1 bg-red-900/50 border border-red-800 rounded-lg shadow-xl p-3 z-50">
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={onDismiss} className="text-xs text-zinc-400 mt-1">
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 min-w-[300px] max-w-[500px]">
      <div className="px-3 py-2 border-b border-zinc-700 flex items-center justify-between">
        <span className="text-xs text-zinc-500 uppercase">AI Suggestions</span>
        <button onClick={onDismiss} className="text-zinc-500 hover:text-zinc-300">×</button>
      </div>
      <div className="p-2 space-y-1">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onAccept(suggestion)}
            className="w-full text-left p-2 text-sm text-zinc-300 hover:bg-zinc-700 rounded transition"
          >
            {suggestion}
          </button>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-zinc-700 text-xs text-zinc-600">
        Press Tab to accept, Esc to dismiss
      </div>
    </div>
  );
};

// =============================================================================
// BEAT ALTERNATIVES PANEL
// =============================================================================

interface BeatAlternativesPanelProps {
  scene: Scene;
  beat: { id: string; description: string };
  allScenes: Scene[];
  config: ProjectConfig;
  onSelectAlternative: (description: string) => void;
  onClose: () => void;
}

export const BeatAlternativesPanel: React.FC<BeatAlternativesPanelProps> = ({
  scene,
  beat,
  allScenes,
  config,
  onSelectAlternative: _onSelectAlternative,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [alternatives, setAlternatives] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlternatives = async () => {
      if (!isAIAvailable()) {
        setError('AI not configured');
        setLoading(false);
        return;
      }

      try {
        const result = await generateAlternativeBeat(scene, beat.description, allScenes, config);
        setAlternatives(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate');
      } finally {
        setLoading(false);
      }
    };

    fetchAlternatives();
  }, [scene, beat, allScenes, config]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Beat Alternatives</h3>
            <p className="text-sm text-zinc-500 mt-1">"{beat.description}"</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(alternatives) }}
            />
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// AI CHAT WIDGET
// =============================================================================

interface AIChatWidgetProps {
  scene: Scene;
  allScenes: Scene[];
  config: ProjectConfig;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  scene,
  allScenes,
  config,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const available = isAIAvailable();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !available) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Use scene analysis for context-aware response
      const response = await analyzeSceneGap(
        { ...scene, summary: `User question: ${userMessage}\n\nOriginal summary: ${scene.summary}` },
        allScenes,
        config
      );
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, available, scene, allScenes, config]);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition ${
          available ? 'bg-blue-600 hover:bg-blue-500' : 'bg-zinc-700 cursor-not-allowed'
        }`}
        disabled={!available}
        title={available ? 'Open AI Chat' : 'AI not configured'}
      >
        🤖
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🤖</span>
          <span className="font-medium text-white">Script Doctor</span>
        </div>
        <button onClick={() => setIsExpanded(false)} className="text-zinc-500 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 text-sm py-8">
            Ask me anything about your scene!
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-blue-900/50 text-blue-100 ml-8'
                : 'bg-zinc-800 text-zinc-300 mr-8'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Spinner size="sm" />
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this scene..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white rounded-lg transition"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Simple markdown to HTML converter
 */
const formatMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-white font-medium mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-white font-medium text-lg mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-white font-bold text-xl mt-4 mb-2">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-2">')
    // Wrap in paragraph
    .replace(/^/, '<p class="mb-2">')
    .replace(/$/, '</p>');
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  AIStatusIndicator,
  QuickAIActions,
  InlineSuggestion,
  BeatAlternativesPanel,
  AIChatWidget,
};
