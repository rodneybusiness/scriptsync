/**
 * ProjectContext - React context for project-wide configuration
 *
 * This provides access to project config throughout the component tree,
 * eliminating the need for hard-coded character lists, themes, etc.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProjectConfig, ProjectData, Sequence, CharacterConfig } from './types';

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

  // State management
  setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>;
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
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children, projectData }) => {
  const [config] = useState<ProjectConfig>(projectData.config);
  const [sequences, setSequences] = useState<Sequence[]>(projectData.sequences);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Derived values
  const mainCharacters = config.characters.filter(c => c.role === 'main');
  const supportingCharacters = config.characters.filter(c => c.role === 'supporting');
  const allCharacterNames = config.characters.map(c => c.name);

  const value: ProjectContextValue = {
    config,
    sequences,
    mainCharacters,
    supportingCharacters,
    allCharacterNames,
    setSequences,
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
    return projectModule.default as ProjectData;
  } catch (err) {
    console.error(`Failed to load project: ${projectId}`, err);
    throw new Error(`Project "${projectId}" not found or failed to load.`);
  }
};

export default ProjectContext;
