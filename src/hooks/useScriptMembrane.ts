/**
 * useScriptMembrane - Real-time script change observation layer
 *
 * The "membrane" sits between user edits and AI agents.
 * It debounces changes, batches updates, and dispatches to agents.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { Scene } from '../config/types';

export interface ScriptChange {
  sceneId: string;
  field: 'scriptContent' | 'title' | 'beats' | 'notes';
  previousValue: string;
  newValue: string;
  timestamp: number;
  characterMentioned?: string; // If dialogue was edited
}

export interface MembraneState {
  pendingChanges: ScriptChange[];
  lastFlush: number;
  isProcessing: boolean;
}

interface AgentSubscription {
  id: string;
  filter: (change: ScriptChange) => boolean;
  handler: (changes: ScriptChange[]) => Promise<void>;
  priority: number; // Lower = higher priority
}

const DEBOUNCE_MS = 2000; // Wait 2s of inactivity before dispatching

export function useScriptMembrane(currentScene: Scene | undefined) {
  const [state, setState] = useState<MembraneState>({
    pendingChanges: [],
    lastFlush: Date.now(),
    isProcessing: false,
  });

  const subscriptions = useRef<AgentSubscription[]>([]);
  const previousContent = useRef<Map<string, string>>(new Map());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Subscribe an agent to changes
  const subscribe = useCallback((subscription: AgentSubscription) => {
    subscriptions.current.push(subscription);
    subscriptions.current.sort((a, b) => a.priority - b.priority);

    return () => {
      subscriptions.current = subscriptions.current.filter(s => s.id !== subscription.id);
    };
  }, []);

  // Detect if a change involves dialogue (for Voice Keeper)
  const detectDialogueCharacter = (content: string, previousContent: string): string | undefined => {
    // Find new dialogue blocks by comparing content
    const dialoguePattern = /^\s*([A-Z][A-Z\s]+)\s*$/gm;
    const newMatches = [...content.matchAll(dialoguePattern)];
    const oldMatches = [...previousContent.matchAll(dialoguePattern)];

    // If there are new character names that weren't there before
    const newChars = newMatches.map(m => m[1].trim());
    const oldChars = oldMatches.map(m => m[1].trim());
    const addedChars = newChars.filter(c => !oldChars.includes(c));

    if (addedChars.length > 0) {
      return addedChars[0];
    }

    // Check if content around existing character names changed
    // (simplified: just return the last character mentioned)
    if (newChars.length > 0) {
      return newChars[newChars.length - 1];
    }

    return undefined;
  };

  // Record a change
  const recordChange = useCallback((
    sceneId: string,
    field: ScriptChange['field'],
    newValue: string
  ) => {
    const previousValue = previousContent.current.get(`${sceneId}:${field}`) || '';

    // Skip if no actual change
    if (previousValue === newValue) return;

    const change: ScriptChange = {
      sceneId,
      field,
      previousValue,
      newValue,
      timestamp: Date.now(),
    };

    // Detect dialogue character for voice checking
    if (field === 'scriptContent') {
      change.characterMentioned = detectDialogueCharacter(newValue, previousValue);
    }

    // Update previous content cache
    previousContent.current.set(`${sceneId}:${field}`, newValue);

    // Add to pending changes
    setState(prev => ({
      ...prev,
      pendingChanges: [...prev.pendingChanges, change],
    }));

    // Reset debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      flush();
    }, DEBOUNCE_MS);
  }, []);

  // Flush pending changes to agents
  const flush = useCallback(async () => {
    setState(prev => {
      if (prev.pendingChanges.length === 0 || prev.isProcessing) {
        return prev;
      }

      // Process asynchronously
      const changesToProcess = [...prev.pendingChanges];

      (async () => {
        setState(s => ({ ...s, isProcessing: true }));

        // Dispatch to each subscribed agent
        for (const sub of subscriptions.current) {
          const relevantChanges = changesToProcess.filter(sub.filter);
          if (relevantChanges.length > 0) {
            try {
              await sub.handler(relevantChanges);
            } catch (error) {
              console.error(`Agent ${sub.id} failed:`, error);
            }
          }
        }

        setState(s => ({
          ...s,
          isProcessing: false,
          lastFlush: Date.now(),
        }));
      })();

      return {
        ...prev,
        pendingChanges: [],
      };
    });
  }, []);

  // Force immediate flush (e.g., on scene change)
  const forceFlush = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    flush();
  }, [flush]);

  // Track scene content changes
  useEffect(() => {
    if (!currentScene) return;

    const prevContent = previousContent.current.get(`${currentScene.id}:scriptContent`);
    if (prevContent !== undefined && prevContent !== currentScene.scriptContent) {
      recordChange(currentScene.id, 'scriptContent', currentScene.scriptContent);
    } else if (prevContent === undefined) {
      // Initialize tracking for this scene
      previousContent.current.set(`${currentScene.id}:scriptContent`, currentScene.scriptContent);
    }
  }, [currentScene?.scriptContent, currentScene?.id, recordChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    state,
    subscribe,
    recordChange,
    forceFlush,
    pendingCount: state.pendingChanges.length,
    isProcessing: state.isProcessing,
  };
}

export type ScriptMembraneContext = ReturnType<typeof useScriptMembrane>;
