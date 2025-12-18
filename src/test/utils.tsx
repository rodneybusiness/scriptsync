/**
 * Test utilities for ScriptSync
 */
import React, { ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ProjectProvider } from '../config/ProjectContext';
import type { ProjectData, ProjectConfig, Sequence, Scene, RewriteData } from '../config/types';

// =============================================================================
// MOCK DATA FACTORIES
// =============================================================================

export const createMockScene = (overrides: Partial<Scene> = {}): Scene => ({
  id: 'SC-001',
  sequenceId: 'SEQ-1',
  title: 'Test Scene',
  pageNumber: 1,
  scriptContent: `INT. TEST LOCATION - DAY

This is test script content.

CHARACTER
(emotion)
Test dialogue.`,
  beats: [],
  notes: [],
  tracking: [],
  summary: 'A test scene summary',
  ...overrides,
});

export const createMockSequence = (overrides: Partial<Sequence> = {}): Sequence => ({
  id: 'SEQ-1',
  title: 'Test Sequence',
  dramaticQuestion: 'Will the test pass?',
  climax: 'The test runs',
  resolution: 'The test passes',
  scenes: [createMockScene()],
  ...overrides,
});

export const createMockConfig = (overrides: Partial<ProjectConfig> = {}): ProjectConfig => ({
  id: 'test-project',
  title: 'Test Project',
  description: 'A test screenplay project',
  genres: ['Test', 'Drama'],
  logline: 'A test project for testing purposes.',
  characters: [
    { name: 'Test Hero', role: 'main', description: 'The protagonist' },
    { name: 'Test Sidekick', role: 'supporting', description: 'The helper' },
  ],
  themes: ['Testing', 'Quality'],
  ai: {
    styleReferences: ['Test Writer'],
    toneDescriptor: 'Test Specialist',
    uniqueConstraints: ['Must be testable'],
  },
  trackingCategories: ['Plot', 'Character'],
  noteAuthors: ['TT'],
  ...overrides,
});

export const createMockRewriteData = (): RewriteData => ({
  goals: [
    {
      id: 'goal-1',
      goal: 'Test goal',
      actsAffected: ['ACT 1'],
      priority: 'HIGH',
      status: '🟡 POLISH',
      sources: ['Test'],
      concreteNextMove: 'Run tests',
      currentDraftHandling: { 'Test': 'Handled' },
      implementationNotes: 'Test notes',
      whatsStillOff: 'Nothing',
    },
  ],
  pageNotes: {
    amazon: { '1': 'Test note' },
    pointGrey: {},
  },
  openQuestions: {
    critical: [],
    high: ['Test question?'],
    medium: [],
    low: [],
  },
  summary: {
    total: 1,
    byStatus: { rebreak: 0, polish: 1, rework: 0 },
    byPriority: { critical: 0, high: 1, medium: 0, low: 0 },
  },
});

export const createMockProjectData = (overrides: Partial<ProjectData> = {}): ProjectData => ({
  config: createMockConfig(),
  sequences: [createMockSequence()],
  ...overrides,
});

// =============================================================================
// CUSTOM RENDER
// =============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  projectData?: ProjectData;
  rewriteData?: RewriteData;
}

export const renderWithProvider = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const {
    projectData = createMockProjectData(),
    rewriteData,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ProjectProvider projectData={projectData} rewriteData={rewriteData}>
      {children}
    </ProjectProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProvider as render };
