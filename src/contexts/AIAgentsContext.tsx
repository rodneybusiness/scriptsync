/**
 * AIAgentsContext - Central coordination for AI agents
 *
 * Provides the script membrane, voice keeper, and suggestion state
 * to all components that need them.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useScriptMembrane, ScriptChange } from '../hooks/useScriptMembrane';
import { voiceKeeper } from '../services/voiceKeeper';
import { memoryPalace, Suggestion } from '../services/memoryPalace';
import { Scene } from '../config/types';
import { useProject } from '../config/ProjectContext';

interface AIAgentsContextValue {
  // Suggestions state
  suggestions: Suggestion[];
  pendingSuggestions: Suggestion[];

  // Actions
  acceptSuggestion: (suggestion: Suggestion) => Promise<void>;
  dismissSuggestion: (suggestion: Suggestion) => Promise<void>;

  // Membrane state
  pendingChanges: number;
  isProcessing: boolean;

  // Voice keeper
  teachVoice: (characterName: string, feedback: string, originalDialogue?: string) => Promise<void>;
}

const AIAgentsContext = createContext<AIAgentsContextValue | null>(null);

interface AIAgentsProviderProps {
  children: React.ReactNode;
  currentScene?: Scene;
  allScenes: Scene[];
}

export const AIAgentsProvider: React.FC<AIAgentsProviderProps> = ({
  children,
  currentScene,
  allScenes,
}) => {
  const { config } = useProject();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const membrane = useScriptMembrane(currentScene);
  const initializedRef = useRef(false);

  // Initialize agents on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Initialize memory palace
    memoryPalace.init().then(() => {
      console.log('Memory Palace initialized');
    });

    // Set up voice keeper
    const projectContext = `${config.title} - ${config.genres?.join(', ') || 'Drama'}`;
    voiceKeeper.setProject(config.title, projectContext);
  }, [config.title, config.genres]);

  // Subscribe voice keeper to membrane
  useEffect(() => {
    const unsubscribe = membrane.subscribe({
      id: 'voice-keeper',
      priority: 1,
      filter: (change: ScriptChange) => change.field === 'scriptContent',
      handler: async (changes: ScriptChange[]) => {
        const newSuggestions = await voiceKeeper.processChanges(changes, allScenes);
        if (newSuggestions.length > 0) {
          setSuggestions(prev => [...prev, ...newSuggestions]);
        }
      },
    });

    return unsubscribe;
  }, [membrane, allScenes]);

  // Load pending suggestions for current scene
  useEffect(() => {
    if (!currentScene) return;

    memoryPalace.getSuggestionsForScene(currentScene.id).then((sceneSuggestions) => {
      setSuggestions(prev => {
        // Merge without duplicates
        const ids = new Set(prev.map(s => s.id));
        const newOnes = sceneSuggestions.filter(s => !ids.has(s.id));
        return [...prev, ...newOnes];
      });
    });
  }, [currentScene?.id]);

  const acceptSuggestion = useCallback(async (suggestion: Suggestion) => {
    await memoryPalace.updateSuggestionStatus(suggestion.id, 'accepted');
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  }, []);

  const dismissSuggestion = useCallback(async (suggestion: Suggestion) => {
    await memoryPalace.updateSuggestionStatus(suggestion.id, 'dismissed');
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  }, []);

  const teachVoice = useCallback(async (
    characterName: string,
    feedback: string,
    originalDialogue?: string
  ) => {
    await voiceKeeper.learnCorrection(
      characterName,
      originalDialogue || '',
      feedback
    );
  }, []);

  // Filter to pending suggestions only
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  const value: AIAgentsContextValue = {
    suggestions,
    pendingSuggestions,
    acceptSuggestion,
    dismissSuggestion,
    pendingChanges: membrane.pendingCount,
    isProcessing: membrane.isProcessing,
    teachVoice,
  };

  return (
    <AIAgentsContext.Provider value={value}>
      {children}
    </AIAgentsContext.Provider>
  );
};

export function useAIAgents(): AIAgentsContextValue {
  const context = useContext(AIAgentsContext);
  if (!context) {
    throw new Error('useAIAgents must be used within AIAgentsProvider');
  }
  return context;
}

// Hook for getting suggestions for a specific scene
export function useSceneSuggestions(sceneId: string): Suggestion[] {
  const { pendingSuggestions } = useAIAgents();
  return pendingSuggestions.filter(s => s.sceneId === sceneId);
}
