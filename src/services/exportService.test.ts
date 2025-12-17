/**
 * Export Service Tests
 */

import { describe, it, expect } from 'vitest';
import {
  exportToFountain,
  exportToText,
  exportBeatSheetToCSV,
} from './exportService';
import { ProjectData, Scene, Sequence, Beat, NoteType } from '../config/types';

// =============================================================================
// TEST FIXTURES
// =============================================================================

const createMockBeat = (partial: Partial<Beat> = {}): Beat => ({
  id: `beat-${Math.random().toString(36).substr(2, 9)}`,
  description: 'Test beat',
  completed: false,
  ...partial,
});

const createMockScene = (partial: Partial<Scene> = {}): Scene => ({
  id: `scene-${Math.random().toString(36).substr(2, 9)}`,
  sequenceId: 'seq-1',
  title: 'Test Scene',
  summary: 'A test scene summary',
  scriptContent: 'FADE IN:\n\nINT. TEST LOCATION - DAY\n\nAction happens here.',
  beats: [createMockBeat()],
  notes: [],
  tracking: [],
  pageNumber: 1,
  connections: [],
  location: 'INT. TEST LOCATION',
  timeOfDay: 'DAY',
  ...partial,
});

const createMockSequence = (partial: Partial<Sequence> = {}): Sequence => ({
  id: `seq-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Sequence',
  dramaticQuestion: 'Will the test pass?',
  scenes: [createMockScene()],
  climax: 'The climax',
  resolution: 'The resolution',
  ...partial,
});

const createMockProject = (partial: Partial<ProjectData> = {}): ProjectData => ({
  config: {
    id: 'test-project',
    title: 'Test Screenplay',
    logline: 'A test screenplay for testing purposes.',
    genres: ['Drama', 'Comedy'],
    themes: ['Testing', 'Quality'],
    characters: [
      { name: 'HERO', role: 'main', description: 'The main character', arc: 'Growth' },
      { name: 'VILLAIN', role: 'supporting', description: 'The bad guy', arc: 'Downfall' },
    ],
    settings: [],
    meta: {
      author: 'Test Author',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  sequences: [createMockSequence()],
  ...partial,
});

// =============================================================================
// FOUNTAIN EXPORT TESTS
// =============================================================================

describe('exportToFountain', () => {
  it('should export basic project structure', () => {
    const project = createMockProject();
    const result = exportToFountain(project);

    expect(result).toContain('Title: Test Screenplay');
    expect(result).toContain('Author: Test Author');
    expect(result).toContain('# Test Sequence');
  });

  it('should include scene headings', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({
              location: 'INT. OFFICE',
              timeOfDay: 'NIGHT',
            }),
          ],
        }),
      ],
    });

    const result = exportToFountain(project);
    expect(result).toContain('INT. OFFICE - NIGHT');
  });

  it('should include script content', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({
              scriptContent: 'HERO\nHello, world!\n\nAction description here.',
            }),
          ],
        }),
      ],
    });

    const result = exportToFountain(project);
    expect(result).toContain('HERO');
    expect(result).toContain('Hello, world!');
    expect(result).toContain('Action description here.');
  });

  it('should add page breaks between sequences', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({ title: 'ACT ONE' }),
        createMockSequence({ title: 'ACT TWO' }),
      ],
    });

    const result = exportToFountain(project);
    expect(result).toContain('==='); // Page break marker in Fountain
  });

  it('should handle empty script content', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({ scriptContent: '' }),
          ],
        }),
      ],
    });

    const result = exportToFountain(project);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});

// =============================================================================
// TEXT EXPORT TESTS
// =============================================================================

describe('exportToText', () => {
  it('should export with title and metadata', () => {
    const project = createMockProject();
    const result = exportToText(project);

    expect(result).toContain('TEST SCREENPLAY');
    expect(result).toContain('Logline:');
    expect(result).toContain('Genres: Drama, Comedy');
    expect(result).toContain('Themes: Testing, Quality');
  });

  it('should include sequence headers', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({ title: 'THE SETUP' }),
        createMockSequence({ title: 'THE CONFRONTATION' }),
      ],
    });

    const result = exportToText(project);
    expect(result).toContain('SEQUENCE 1: THE SETUP');
    expect(result).toContain('SEQUENCE 2: THE CONFRONTATION');
  });

  it('should include scene details', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({
              title: 'Opening Scene',
              summary: 'The story begins',
              pageNumber: 1,
            }),
          ],
        }),
      ],
    });

    const result = exportToText(project);
    expect(result).toContain('Opening Scene');
    expect(result).toContain('Page 1');
  });

  it('should include beats when option is set', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({
              beats: [
                createMockBeat({ description: 'First beat', completed: true }),
                createMockBeat({ description: 'Second beat', completed: false }),
              ],
            }),
          ],
        }),
      ],
    });

    const result = exportToText(project, { includeBeats: true });
    expect(result).toContain('BEATS:');
    expect(result).toContain('First beat');
    expect(result).toContain('Second beat');
    expect(result).toContain('✓'); // Completed marker
    expect(result).toContain('○'); // Incomplete marker
  });

  it('should include notes when option is set', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({
              notes: [
                {
                  id: 'note-1',
                  content: 'This needs revision',
                  type: NoteType.REWRITE,
                  author: 'Editor',
                  timestamp: new Date(),
                },
              ],
            }),
          ],
        }),
      ],
    });

    const result = exportToText(project, { includeNotes: true });
    expect(result).toContain('NOTES:');
    expect(result).toContain('This needs revision');
    expect(result).toContain('REWRITE');
    expect(result).toContain('Editor');
  });

  it('should include export timestamp', () => {
    const project = createMockProject();
    const result = exportToText(project);

    expect(result).toContain('Exported:');
    expect(result).toContain('Total Scenes:');
  });
});

// =============================================================================
// CSV EXPORT TESTS
// =============================================================================

describe('exportBeatSheetToCSV', () => {
  it('should include CSV header row', () => {
    const project = createMockProject();
    const result = exportBeatSheetToCSV(project);

    const lines = result.split('\n');
    expect(lines[0]).toContain('Sequence');
    expect(lines[0]).toContain('Scene');
    expect(lines[0]).toContain('Page');
    expect(lines[0]).toContain('Title');
    expect(lines[0]).toContain('Summary');
    expect(lines[0]).toContain('Beats');
  });

  it('should escape quotes in CSV fields', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({
              summary: 'A scene with "quotes" in it',
            }),
          ],
        }),
      ],
    });

    const result = exportBeatSheetToCSV(project);
    expect(result).toContain('""quotes""'); // Double-escaped quotes
  });

  it('should include beat status', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({
              beats: [
                createMockBeat({ completed: true }),
                createMockBeat({ completed: true }),
                createMockBeat({ completed: false }),
              ],
            }),
          ],
        }),
      ],
    });

    const result = exportBeatSheetToCSV(project);
    expect(result).toContain('2/3 complete');
  });

  it('should handle scenes with no beats', () => {
    const project = createMockProject({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({ beats: [] }),
          ],
        }),
      ],
    });

    const result = exportBeatSheetToCSV(project);
    expect(result).toContain('No beats');
  });
});
