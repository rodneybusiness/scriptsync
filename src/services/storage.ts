/**
 * Storage Service
 *
 * Handles localStorage persistence for project data with auto-save.
 */

import { ProjectData, Sequence, Scene } from '../config/types';

// =============================================================================
// STORAGE KEYS
// =============================================================================

const STORAGE_PREFIX = 'scriptsync_';
const PROJECTS_INDEX_KEY = `${STORAGE_PREFIX}projects_index`;
const PROJECT_DATA_KEY = (id: string) => `${STORAGE_PREFIX}project_${id}`;
const ACTIVE_PROJECT_KEY = `${STORAGE_PREFIX}active_project`;

// =============================================================================
// PROJECT INDEX
// =============================================================================

export interface ProjectIndexEntry {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  sceneCount: number;
  characterCount: number;
}

/**
 * Get list of all saved projects
 */
export const getProjectsIndex = (): ProjectIndexEntry[] => {
  try {
    const data = localStorage.getItem(PROJECTS_INDEX_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Update project index entry
 */
export const updateProjectIndex = (entry: ProjectIndexEntry): void => {
  const index = getProjectsIndex();
  const existingIdx = index.findIndex(p => p.id === entry.id);

  if (existingIdx >= 0) {
    index[existingIdx] = entry;
  } else {
    index.push(entry);
  }

  localStorage.setItem(PROJECTS_INDEX_KEY, JSON.stringify(index));
};

/**
 * Remove project from index
 */
export const removeFromProjectIndex = (id: string): void => {
  const index = getProjectsIndex().filter(p => p.id !== id);
  localStorage.setItem(PROJECTS_INDEX_KEY, JSON.stringify(index));
};

// =============================================================================
// PROJECT DATA
// =============================================================================

/**
 * Save project data to localStorage
 */
export const saveProject = (data: ProjectData): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(PROJECT_DATA_KEY(data.config.id), serialized);

    // Update index
    const sceneCount = data.sequences.reduce((sum, seq) => sum + seq.scenes.length, 0);
    updateProjectIndex({
      id: data.config.id,
      title: data.config.title,
      updatedAt: new Date().toISOString(),
      createdAt: data.config.meta?.createdAt?.toString() || new Date().toISOString(),
      sceneCount,
      characterCount: data.config.characters.length,
    });

    console.log(`Project saved: ${data.config.id}`);
  } catch (error) {
    console.error('Failed to save project:', error);
    throw new Error('Failed to save project to localStorage');
  }
};

/**
 * Load project data from localStorage
 */
export const loadProject = (id: string): ProjectData | null => {
  try {
    const data = localStorage.getItem(PROJECT_DATA_KEY(id));
    if (!data) return null;

    const parsed = JSON.parse(data) as ProjectData;

    // Restore Date objects
    if (parsed.config.meta?.createdAt) {
      parsed.config.meta.createdAt = new Date(parsed.config.meta.createdAt);
    }
    if (parsed.config.meta?.updatedAt) {
      parsed.config.meta.updatedAt = new Date(parsed.config.meta.updatedAt);
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
};

/**
 * Delete project data from localStorage
 */
export const deleteProject = (id: string): void => {
  localStorage.removeItem(PROJECT_DATA_KEY(id));
  removeFromProjectIndex(id);
};

/**
 * Check if project exists in localStorage
 */
export const projectExists = (id: string): boolean => {
  return localStorage.getItem(PROJECT_DATA_KEY(id)) !== null;
};

// =============================================================================
// ACTIVE PROJECT
// =============================================================================

/**
 * Set the active project ID
 */
export const setActiveProject = (id: string): void => {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
};

/**
 * Get the active project ID
 */
export const getActiveProject = (): string | null => {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
};

// =============================================================================
// AUTO-SAVE
// =============================================================================

let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;
const AUTO_SAVE_DELAY = 2000; // 2 seconds debounce

/**
 * Schedule an auto-save (debounced)
 */
export const scheduleAutoSave = (data: ProjectData): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(() => {
    saveProject(data);
    autoSaveTimeout = null;
  }, AUTO_SAVE_DELAY);
};

/**
 * Force immediate save (cancels pending auto-save)
 */
export const saveNow = (data: ProjectData): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
  saveProject(data);
};

// =============================================================================
// SCENE-LEVEL UPDATES
// =============================================================================

/**
 * Update a single scene within a project
 */
export const updateScene = (
  projectId: string,
  sceneId: string,
  updates: Partial<Scene>
): ProjectData | null => {
  const project = loadProject(projectId);
  if (!project) return null;

  let found = false;
  const updatedSequences = project.sequences.map(seq => ({
    ...seq,
    scenes: seq.scenes.map(scene => {
      if (scene.id === sceneId) {
        found = true;
        return { ...scene, ...updates };
      }
      return scene;
    }),
  }));

  if (!found) return null;

  const updatedProject = { ...project, sequences: updatedSequences };
  saveProject(updatedProject);
  return updatedProject;
};

/**
 * Add a new scene to a sequence
 */
export const addScene = (
  projectId: string,
  sequenceId: string,
  scene: Scene
): ProjectData | null => {
  const project = loadProject(projectId);
  if (!project) return null;

  const updatedSequences = project.sequences.map(seq => {
    if (seq.id === sequenceId) {
      return { ...seq, scenes: [...seq.scenes, scene] };
    }
    return seq;
  });

  const updatedProject = { ...project, sequences: updatedSequences };
  saveProject(updatedProject);
  return updatedProject;
};

/**
 * Delete a scene
 */
export const deleteScene = (
  projectId: string,
  sceneId: string
): ProjectData | null => {
  const project = loadProject(projectId);
  if (!project) return null;

  const updatedSequences = project.sequences.map(seq => ({
    ...seq,
    scenes: seq.scenes.filter(s => s.id !== sceneId),
  }));

  const updatedProject = { ...project, sequences: updatedSequences };
  saveProject(updatedProject);
  return updatedProject;
};

// =============================================================================
// SEQUENCE-LEVEL UPDATES
// =============================================================================

/**
 * Update a sequence
 */
export const updateSequence = (
  projectId: string,
  sequenceId: string,
  updates: Partial<Sequence>
): ProjectData | null => {
  const project = loadProject(projectId);
  if (!project) return null;

  const updatedSequences = project.sequences.map(seq => {
    if (seq.id === sequenceId) {
      return { ...seq, ...updates };
    }
    return seq;
  });

  const updatedProject = { ...project, sequences: updatedSequences };
  saveProject(updatedProject);
  return updatedProject;
};

/**
 * Add a new sequence
 */
export const addSequence = (
  projectId: string,
  sequence: Sequence
): ProjectData | null => {
  const project = loadProject(projectId);
  if (!project) return null;

  const updatedProject = {
    ...project,
    sequences: [...project.sequences, sequence],
  };
  saveProject(updatedProject);
  return updatedProject;
};

// =============================================================================
// EXPORT/IMPORT
// =============================================================================

/**
 * Export project data as JSON file
 */
export const exportProjectJSON = (data: ProjectData): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.config.id}-backup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Import project data from JSON
 */
export const importProjectJSON = async (file: File): Promise<ProjectData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ProjectData;

        // Validate structure
        if (!data.config || !data.sequences) {
          reject(new Error('Invalid project file format'));
          return;
        }

        // Save to localStorage
        saveProject(data);
        resolve(data);
      } catch {
        reject(new Error('Failed to parse project file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// =============================================================================
// STORAGE STATS
// =============================================================================

/**
 * Get localStorage usage stats
 */
export const getStorageStats = (): { used: number; available: number; projects: number } => {
  let totalSize = 0;
  const projects = getProjectsIndex();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const value = localStorage.getItem(key) || '';
      totalSize += key.length + value.length;
    }
  }

  // localStorage limit is typically 5-10MB
  const estimatedLimit = 5 * 1024 * 1024; // 5MB

  return {
    used: totalSize,
    available: estimatedLimit - totalSize,
    projects: projects.length,
  };
};
