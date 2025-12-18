/**
 * ProjectContext - React context for project-wide configuration
 *
 * This provides access to project config throughout the component tree,
 * eliminating the need for hard-coded character lists, themes, etc.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import {
  ProjectConfig,
  ProjectData,
  Sequence,
  Scene,
  CharacterConfig,
  RewriteGoal,
  PageNotes,
  OpenQuestions,
  RewriteSummary,
  RewriteData,
} from './types';

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface ProjectContextValue {
  // Project configuration
  config: ProjectConfig;
  sequences: Sequence[];

  // Derived helpers
  mainCharacters: CharacterConfig[];
  supportingCharacters: CharacterConfig[];
  allCharacterNames: string[];

  // Rewrite tracking data
  rewriteData: RewriteData | null;
  hasRewriteData: boolean;

  // State management
  setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>;
  updateConfig: (updates: Partial<ProjectConfig>) => void;

  // Scene management
  addScene: (sequenceId: string, afterSceneId?: string) => Scene;
  deleteScene: (sceneId: string) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;

  // Sequence management
  addSequence: (title?: string) => Sequence;
  deleteSequence: (sequenceId: string) => void;
  updateSequence: (sequenceId: string, updates: Partial<Sequence>) => void;

  // Scene reordering
  moveScene: (sceneId: string, direction: 'up' | 'down') => void;
  reorderScene: (sceneId: string, targetSequenceId: string, targetIndex: number) => void;

  // Scene duplication
  duplicateScene: (sceneId: string) => Scene | null;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface ProjectProviderProps {
  children: ReactNode;
  projectData: ProjectData;
  rewriteData?: RewriteData;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  projectData,
  rewriteData: initialRewriteData,
}) => {
  const [config, setConfig] = useState<ProjectConfig>(projectData.config);
  const [sequences, setSequences] = useState<Sequence[]>(projectData.sequences);
  const [rewriteData] = useState<RewriteData | null>(initialRewriteData || null);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // =============================================================================
  // UNDO/REDO HISTORY STACK
  // =============================================================================

  const MAX_HISTORY_SIZE = 50;
  const historyRef = useRef<Sequence[][]>([projectData.sequences]);
  const historyIndexRef = useRef<number>(0);
  const isUndoingRef = useRef<boolean>(false);

  // Track whether we can undo/redo
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Update history when sequences change (not from undo/redo)
  useEffect(() => {
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
      return;
    }

    // Don't add to history if it's the same as current state
    const currentState = historyRef.current[historyIndexRef.current];
    if (JSON.stringify(currentState) === JSON.stringify(sequences)) {
      return;
    }

    // Truncate any redo history when making a new change
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);

    // Add new state
    historyRef.current.push(JSON.parse(JSON.stringify(sequences)));

    // Limit history size
    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }

    // Update can undo/redo states
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [sequences]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;

    isUndoingRef.current = true;
    historyIndexRef.current--;
    const previousState = historyRef.current[historyIndexRef.current];
    setSequences(JSON.parse(JSON.stringify(previousState)));

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  }, []);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    isUndoingRef.current = true;
    historyIndexRef.current++;
    const nextState = historyRef.current[historyIndexRef.current];
    setSequences(JSON.parse(JSON.stringify(nextState)));

    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  // Global keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z (Mac) or Ctrl+Z (Windows) for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Cmd+Shift+Z (Mac) or Ctrl+Shift+Z (Windows) for redo
      // Also Cmd+Y (Windows standard redo)
      if ((e.metaKey || e.ctrlKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Update config with partial updates
  const updateConfig = (updates: Partial<ProjectConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // --- Scene Management ---

  // Generate unique scene ID
  const generateSceneId = useCallback(() => {
    const allScenes = sequences.flatMap(seq => seq.scenes);
    const maxNum = allScenes.reduce((max, scene) => {
      const match = scene.id.match(/scene_(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    return `scene_${String(maxNum + 1).padStart(3, '0')}`;
  }, [sequences]);

  // Add a new scene to a sequence
  const addScene = useCallback((sequenceId: string, afterSceneId?: string): Scene => {
    const newScene: Scene = {
      id: generateSceneId(),
      sequenceId,
      title: 'New Scene',
      pageNumber: 1,
      scriptContent: 'INT. LOCATION - DAY\n\n',
      summary: '',
      beats: [],
      notes: [],
      tracking: [],
      status: 'draft',
      timeOfDay: 'DAY',
      location: 'LOCATION',
    };

    setSequences(prev => prev.map(seq => {
      if (seq.id !== sequenceId) return seq;

      if (afterSceneId) {
        const idx = seq.scenes.findIndex(s => s.id === afterSceneId);
        if (idx >= 0) {
          const newScenes = [...seq.scenes];
          newScenes.splice(idx + 1, 0, newScene);
          return { ...seq, scenes: newScenes };
        }
      }
      // Add at end if no afterSceneId or not found
      return { ...seq, scenes: [...seq.scenes, newScene] };
    }));

    return newScene;
  }, [generateSceneId]);

  // Delete a scene
  const deleteScene = useCallback((sceneId: string) => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.filter(s => s.id !== sceneId)
    })));
  }, []);

  // Update a scene
  const updateScene = useCallback((sceneId: string, updates: Partial<Scene>) => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(s =>
        s.id === sceneId ? { ...s, ...updates } : s
      )
    })));
  }, []);

  // --- Sequence Management ---

  // Generate unique sequence ID
  const generateSequenceId = useCallback(() => {
    const maxNum = sequences.reduce((max, seq) => {
      const match = seq.id.match(/seq_(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    return `seq_${maxNum + 1}`;
  }, [sequences]);

  // Add a new sequence
  const addSequence = useCallback((title?: string): Sequence => {
    const seqNum = sequences.length + 1;
    const newSequence: Sequence = {
      id: generateSequenceId(),
      title: title || `Act ${seqNum}`,
      dramaticQuestion: '',
      climax: '',
      resolution: '',
      scenes: [],
    };

    setSequences(prev => [...prev, newSequence]);
    return newSequence;
  }, [sequences.length, generateSequenceId]);

  // Delete a sequence (moves scenes to first remaining sequence or deletes them)
  const deleteSequence = useCallback((sequenceId: string) => {
    setSequences(prev => {
      if (prev.length <= 1) return prev; // Don't delete last sequence
      return prev.filter(seq => seq.id !== sequenceId);
    });
  }, []);

  // Update a sequence
  const updateSequence = useCallback((sequenceId: string, updates: Partial<Sequence>) => {
    setSequences(prev => prev.map(seq =>
      seq.id === sequenceId ? { ...seq, ...updates } : seq
    ));
  }, []);

  // Move a scene up or down within its sequence
  const moveScene = useCallback((sceneId: string, direction: 'up' | 'down') => {
    setSequences(prev => prev.map(seq => {
      const sceneIndex = seq.scenes.findIndex(s => s.id === sceneId);
      if (sceneIndex === -1) return seq;

      const newScenes = [...seq.scenes];
      const targetIndex = direction === 'up' ? sceneIndex - 1 : sceneIndex + 1;

      // Check bounds
      if (targetIndex < 0 || targetIndex >= newScenes.length) return seq;

      // Swap scenes
      [newScenes[sceneIndex], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[sceneIndex]];

      return { ...seq, scenes: newScenes };
    }));
  }, []);

  // Reorder a scene to a specific position (supports cross-sequence moves)
  const reorderScene = useCallback((sceneId: string, targetSequenceId: string, targetIndex: number) => {
    setSequences(prev => {
      // Find the scene and its source sequence
      let movedScene: Scene | null = null;
      let sourceSequenceId: string | null = null;

      for (const seq of prev) {
        const scene = seq.scenes.find(s => s.id === sceneId);
        if (scene) {
          movedScene = { ...scene, sequenceId: targetSequenceId };
          sourceSequenceId = seq.id;
          break;
        }
      }

      if (!movedScene || !sourceSequenceId) return prev;

      return prev.map(seq => {
        if (seq.id === sourceSequenceId && seq.id === targetSequenceId) {
          // Moving within the same sequence
          const currentIndex = seq.scenes.findIndex(s => s.id === sceneId);
          const newScenes = seq.scenes.filter(s => s.id !== sceneId);
          // Adjust target index if moving down
          const adjustedIndex = targetIndex > currentIndex ? targetIndex - 1 : targetIndex;
          newScenes.splice(Math.min(adjustedIndex, newScenes.length), 0, movedScene!);
          return { ...seq, scenes: newScenes };
        } else if (seq.id === sourceSequenceId) {
          // Remove from source sequence
          return { ...seq, scenes: seq.scenes.filter(s => s.id !== sceneId) };
        } else if (seq.id === targetSequenceId) {
          // Add to target sequence
          const newScenes = [...seq.scenes];
          newScenes.splice(Math.min(targetIndex, newScenes.length), 0, movedScene!);
          return { ...seq, scenes: newScenes };
        }
        return seq;
      });
    });
  }, []);

  // Duplicate a scene (creates a copy right after the original)
  const duplicateScene = useCallback((sceneId: string): Scene | null => {
    let duplicatedScene: Scene | null = null;

    setSequences(prev => prev.map(seq => {
      const sceneIndex = seq.scenes.findIndex(s => s.id === sceneId);
      if (sceneIndex === -1) return seq;

      const originalScene = seq.scenes[sceneIndex];
      duplicatedScene = {
        ...JSON.parse(JSON.stringify(originalScene)),
        id: generateSceneId(),
        title: `${originalScene.title} (Copy)`,
        status: 'draft' as const, // Reset status on duplicate
      };

      const newScenes = [...seq.scenes];
      newScenes.splice(sceneIndex + 1, 0, duplicatedScene);

      return { ...seq, scenes: newScenes };
    }));

    return duplicatedScene;
  }, [generateSceneId]);

  // Derived values
  const mainCharacters = config.characters.filter(c => c.role === 'main');
  const supportingCharacters = config.characters.filter(c => c.role === 'supporting');
  const allCharacterNames = config.characters.map(c => c.name);
  const hasRewriteData = rewriteData !== null && rewriteData.goals.length > 0;

  const value: ProjectContextValue = {
    config,
    sequences,
    mainCharacters,
    supportingCharacters,
    allCharacterNames,
    rewriteData,
    hasRewriteData,
    setSequences,
    updateConfig,
    addScene,
    deleteScene,
    updateScene,
    addSequence,
    deleteSequence,
    updateSequence,
    moveScene,
    reorderScene,
    duplicateScene,
    undo,
    redo,
    canUndo,
    canRedo,
    isLoading,
    error,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useProject = (): ProjectContextValue => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

// =============================================================================
// UTILITY: Load project dynamically
// =============================================================================

export const loadProject = async (projectId: string): Promise<ProjectData> => {
  try {
    // Dynamic import of project data
    const projectModule = await import(`../projects/${projectId}/index.ts`);
    const projectData = projectModule.default as ProjectData;

    // Include rewrite data if exported by the project
    if (projectModule.rewriteData) {
      projectData.rewriteData = projectModule.rewriteData;
    }

    return projectData;
  } catch (err) {
    console.error(`Failed to load project: ${projectId}`, err);
    throw new Error(`Project "${projectId}" not found or failed to load.`);
  }
};

export default ProjectContext;
