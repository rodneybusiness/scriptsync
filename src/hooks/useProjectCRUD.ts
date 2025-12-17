/**
 * useProjectCRUD Hook
 *
 * Provides CRUD operations for project data with optimistic updates
 * and automatic persistence to localStorage.
 */

import { useCallback } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, Beat, SceneNote, SceneConnection, Sequence, TrackingPoint, NoteType } from '../config/types';
import { saveNow } from '../services/storage';

// =============================================================================
// ID GENERATION
// =============================================================================

const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// =============================================================================
// TYPES
// =============================================================================

export interface CRUDOperations {
  // Scene operations
  addScene: (sequenceId: string, scene: Partial<Scene>) => Scene;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  deleteScene: (sceneId: string) => void;
  moveScene: (sceneId: string, toSequenceId: string, toIndex?: number) => void;

  // Beat operations
  addBeat: (sceneId: string, beat: Partial<Beat>) => Beat;
  updateBeat: (sceneId: string, beatId: string, updates: Partial<Beat>) => void;
  deleteBeat: (sceneId: string, beatId: string) => void;
  reorderBeats: (sceneId: string, beatIds: string[]) => void;

  // Note operations
  addNote: (sceneId: string, note: Partial<SceneNote>) => SceneNote;
  updateNote: (sceneId: string, noteId: string, updates: Partial<SceneNote>) => void;
  deleteNote: (sceneId: string, noteId: string) => void;

  // Connection operations
  addConnection: (sceneId: string, connection: Partial<SceneConnection>) => SceneConnection & { id: string };
  deleteConnection: (sceneId: string, targetSceneId: string) => void;

  // Tracking operations
  addTrackingItem: (sceneId: string, item: Partial<TrackingPoint>) => TrackingPoint;
  deleteTrackingItem: (sceneId: string, category: string, description: string) => void;

  // Sequence operations
  addSequence: (sequence: Partial<Sequence>) => Sequence;
  updateSequence: (sequenceId: string, updates: Partial<Sequence>) => void;
  deleteSequence: (sequenceId: string) => void;
  reorderSequences: (sequenceIds: string[]) => void;

  // Bulk operations
  duplicateScene: (sceneId: string) => Scene | null;
  saveImmediately: () => void;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export const useProjectCRUD = (): CRUDOperations => {
  const { config, sequences, setSequences } = useProject();

  // Helper to find scene and its sequence
  const findScene = useCallback((sceneId: string) => {
    for (const seq of sequences) {
      const scene = seq.scenes.find(s => s.id === sceneId);
      if (scene) return { scene, sequence: seq };
    }
    return null;
  }, [sequences]);

  // ===================
  // SCENE OPERATIONS
  // ===================

  const addScene = useCallback((sequenceId: string, sceneData: Partial<Scene>): Scene => {
    const newScene: Scene = {
      id: generateId('scene'),
      sequenceId,
      title: sceneData.title || 'New Scene',
      pageNumber: sceneData.pageNumber || 1,
      summary: sceneData.summary || '',
      scriptContent: sceneData.scriptContent || '',
      beats: sceneData.beats || [],
      notes: sceneData.notes || [],
      connections: sceneData.connections || [],
      tracking: sceneData.tracking || [],
      location: sceneData.location || 'INT. LOCATION',
      timeOfDay: sceneData.timeOfDay || 'DAY',
    };

    setSequences(prev => prev.map(seq => {
      if (seq.id === sequenceId) {
        return { ...seq, scenes: [...seq.scenes, newScene] };
      }
      return seq;
    }));

    return newScene;
  }, [setSequences]);

  const updateScene = useCallback((sceneId: string, updates: Partial<Scene>): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene =>
        scene.id === sceneId ? { ...scene, ...updates } : scene
      ),
    })));
  }, [setSequences]);

  const deleteScene = useCallback((sceneId: string): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.filter(s => s.id !== sceneId),
    })));
  }, [setSequences]);

  const moveScene = useCallback((sceneId: string, toSequenceId: string, toIndex?: number): void => {
    const found = findScene(sceneId);
    if (!found) return;

    const { scene, sequence: fromSequence } = found;

    setSequences(prev => {
      // Remove from original sequence
      const withoutScene = prev.map(seq => {
        if (seq.id === fromSequence.id) {
          return { ...seq, scenes: seq.scenes.filter(s => s.id !== sceneId) };
        }
        return seq;
      });

      // Add to target sequence
      return withoutScene.map(seq => {
        if (seq.id === toSequenceId) {
          const updatedScene = { ...scene, sequenceId: toSequenceId };
          const newScenes = [...seq.scenes];
          if (toIndex !== undefined) {
            newScenes.splice(toIndex, 0, updatedScene);
          } else {
            newScenes.push(updatedScene);
          }
          return { ...seq, scenes: newScenes };
        }
        return seq;
      });
    });
  }, [findScene, setSequences]);

  // ===================
  // BEAT OPERATIONS
  // ===================

  const addBeat = useCallback((sceneId: string, beatData: Partial<Beat>): Beat => {
    const newBeat: Beat = {
      id: generateId('beat'),
      description: beatData.description || 'New beat',
      completed: beatData.completed || false,
    };

    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return { ...scene, beats: [...scene.beats, newBeat] };
        }
        return scene;
      }),
    })));

    return newBeat;
  }, [setSequences]);

  const updateBeat = useCallback((sceneId: string, beatId: string, updates: Partial<Beat>): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            beats: scene.beats.map(beat =>
              beat.id === beatId ? { ...beat, ...updates } : beat
            ),
          };
        }
        return scene;
      }),
    })));
  }, [setSequences]);

  const deleteBeat = useCallback((sceneId: string, beatId: string): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            beats: scene.beats.filter(b => b.id !== beatId),
          };
        }
        return scene;
      }),
    })));
  }, [setSequences]);

  const reorderBeats = useCallback((sceneId: string, beatIds: string[]): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          const beatMap = new Map(scene.beats.map(b => [b.id, b]));
          const reorderedBeats = beatIds
            .map(id => beatMap.get(id))
            .filter((b): b is Beat => b !== undefined);
          return { ...scene, beats: reorderedBeats };
        }
        return scene;
      }),
    })));
  }, [setSequences]);

  // ===================
  // NOTE OPERATIONS
  // ===================

  const addNote = useCallback((sceneId: string, noteData: Partial<SceneNote>): SceneNote => {
    const newNote: SceneNote = {
      id: generateId('note'),
      author: noteData.author || 'User',
      content: noteData.content || '',
      type: noteData.type || NoteType.REWRITE,
      timestamp: new Date(),
    };

    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return { ...scene, notes: [...scene.notes, newNote] };
        }
        return scene;
      }),
    })));

    return newNote;
  }, [setSequences]);

  const updateNote = useCallback((sceneId: string, noteId: string, updates: Partial<SceneNote>): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            notes: scene.notes.map(note =>
              note.id === noteId ? { ...note, ...updates } : note
            ),
          };
        }
        return scene;
      }),
    })));
  }, [setSequences]);

  const deleteNote = useCallback((sceneId: string, noteId: string): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            notes: scene.notes.filter(n => n.id !== noteId),
          };
        }
        return scene;
      }),
    })));
  }, [setSequences]);

  // ===================
  // CONNECTION OPERATIONS
  // ===================

  const addConnection = useCallback((sceneId: string, connectionData: Partial<SceneConnection>): SceneConnection & { id: string } => {
    const newConnection: SceneConnection = {
      targetSceneId: connectionData.targetSceneId || '',
      type: connectionData.type || 'causal',
      description: connectionData.description || '',
    };

    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            connections: [...(scene.connections || []), newConnection],
          };
        }
        return scene;
      }),
    })));

    return { ...newConnection, id: generateId('conn') };
  }, [setSequences]);

  const deleteConnection = useCallback((sceneId: string, targetSceneId: string): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            connections: (scene.connections || []).filter(c => c.targetSceneId !== targetSceneId),
          };
        }
        return scene;
      }),
    })));
  }, [setSequences]);

  // ===================
  // TRACKING OPERATIONS
  // ===================

  const addTrackingItem = useCallback((sceneId: string, itemData: Partial<TrackingPoint>): TrackingPoint => {
    const newItem: TrackingPoint = {
      category: itemData.category || 'prop',
      description: itemData.description || '',
    };

    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return { ...scene, tracking: [...scene.tracking, newItem] };
        }
        return scene;
      }),
    })));

    return newItem;
  }, [setSequences]);

  const deleteTrackingItem = useCallback((sceneId: string, category: string, description: string): void => {
    setSequences(prev => prev.map(seq => ({
      ...seq,
      scenes: seq.scenes.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            tracking: scene.tracking.filter(t =>
              !(t.category === category && t.description === description)
            ),
          };
        }
        return scene;
      }),
    })));
  }, [setSequences]);

  // ===================
  // SEQUENCE OPERATIONS
  // ===================

  const addSequence = useCallback((sequenceData: Partial<Sequence>): Sequence => {
    const sequenceNumber = sequences.length + 1;
    const newSequence: Sequence = {
      id: generateId('seq'),
      title: sequenceData.title || `Sequence ${sequenceNumber}`,
      dramaticQuestion: sequenceData.dramaticQuestion || '',
      climax: sequenceData.climax || '',
      resolution: sequenceData.resolution || '',
      scenes: sequenceData.scenes || [],
    };

    setSequences(prev => [...prev, newSequence]);
    return newSequence;
  }, [sequences.length, setSequences]);

  const updateSequence = useCallback((sequenceId: string, updates: Partial<Sequence>): void => {
    setSequences(prev => prev.map(seq =>
      seq.id === sequenceId ? { ...seq, ...updates } : seq
    ));
  }, [setSequences]);

  const deleteSequence = useCallback((sequenceId: string): void => {
    setSequences(prev => prev.filter(seq => seq.id !== sequenceId));
  }, [setSequences]);

  const reorderSequences = useCallback((sequenceIds: string[]): void => {
    setSequences(prev => {
      const seqMap = new Map(prev.map(s => [s.id, s]));
      return sequenceIds
        .map(id => seqMap.get(id))
        .filter((s): s is Sequence => s !== undefined);
    });
  }, [setSequences]);

  // ===================
  // BULK OPERATIONS
  // ===================

  const duplicateScene = useCallback((sceneId: string): Scene | null => {
    const found = findScene(sceneId);
    if (!found) return null;

    const { scene, sequence } = found;
    const newScene: Scene = {
      ...scene,
      id: generateId('scene'),
      title: `${scene.title} (Copy)`,
      beats: scene.beats.map(b => ({ ...b, id: generateId('beat') })),
      notes: scene.notes.map(n => ({ ...n, id: generateId('note'), timestamp: new Date() })),
      connections: scene.connections ? [...scene.connections] : [],
      tracking: [...scene.tracking],
    };

    setSequences(prev => prev.map(seq => {
      if (seq.id === sequence.id) {
        const index = seq.scenes.findIndex(s => s.id === sceneId);
        const newScenes = [...seq.scenes];
        newScenes.splice(index + 1, 0, newScene);
        return { ...seq, scenes: newScenes };
      }
      return seq;
    }));

    return newScene;
  }, [findScene, setSequences]);

  const saveImmediately = useCallback((): void => {
    saveNow({ config, sequences });
  }, [config, sequences]);

  // ===================
  // RETURN OPERATIONS
  // ===================

  return {
    // Scene operations
    addScene,
    updateScene,
    deleteScene,
    moveScene,

    // Beat operations
    addBeat,
    updateBeat,
    deleteBeat,
    reorderBeats,

    // Note operations
    addNote,
    updateNote,
    deleteNote,

    // Connection operations
    addConnection,
    deleteConnection,

    // Tracking operations
    addTrackingItem,
    deleteTrackingItem,

    // Sequence operations
    addSequence,
    updateSequence,
    deleteSequence,
    reorderSequences,

    // Bulk operations
    duplicateScene,
    saveImmediately,
  };
};

export default useProjectCRUD;
