import { describe, it, expect } from 'vitest';
import {
  calculatePacingScore,
  getPacingColor,
  analyzeCharacterVoice,
  parseFountainToReact,
  lintScript,
  countDialogueLines,
  generateScriptExport,
  calculateScriptStats,
} from './scriptUtils';
import { createMockScene, createMockSequence } from '../test/utils';

describe('scriptUtils', () => {
  describe('calculatePacingScore', () => {
    it('returns 0 for empty content', () => {
      expect(calculatePacingScore('')).toBe(0);
    });

    it('returns a score between 0 and 100', () => {
      const content = `INT. ROOM - DAY

Some action line that describes what happens.

CHARACTER
Hello there.`;

      const score = calculatePacingScore(content);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('gives higher score for action-heavy content', () => {
      const actionHeavy = `INT. EXPLOSION - DAY

BANG! The building explodes! Fire everywhere! People run for their lives! Everything is chaos!
Glass shatters! Debris flies through the air! Sirens wail in the distance!`;

      const dialogueHeavy = `INT. ROOM - DAY

ALICE
Hello.

BOB
Hi.

ALICE
How are you?

BOB
Fine.`;

      const actionScore = calculatePacingScore(actionHeavy);
      const dialogueScore = calculatePacingScore(dialogueHeavy);

      expect(actionScore).toBeGreaterThan(dialogueScore);
    });
  });

  describe('getPacingColor', () => {
    it('returns blue for slow pacing (< 30)', () => {
      expect(getPacingColor(20)).toBe('bg-blue-500');
    });

    it('returns emerald for balanced pacing (30-60)', () => {
      expect(getPacingColor(45)).toBe('bg-emerald-500');
    });

    it('returns amber for energetic pacing (60-80)', () => {
      expect(getPacingColor(70)).toBe('bg-amber-500');
    });

    it('returns red for high octane pacing (> 80)', () => {
      expect(getPacingColor(90)).toBe('bg-red-600');
    });
  });

  describe('analyzeCharacterVoice', () => {
    it('analyzes dialogue patterns for a character', () => {
      const content = `INT. COFFEE SHOP - DAY

ALICE
Hello there! How are you doing today?
I've been thinking about our conversation.

BOB
Fine.`;

      const analysis = analyzeCharacterVoice(content, 'Alice');

      expect(analysis.totalWords).toBeGreaterThan(0);
      expect(analysis.inquisitiveness).toBeGreaterThanOrEqual(0);
    });

    it('returns zeros when character has no dialogue', () => {
      const content = `INT. ROOM - DAY

BOB
Hello.`;

      const analysis = analyzeCharacterVoice(content, 'Alice');

      expect(analysis.totalWords).toBe(0);
    });
  });

  describe('parseFountainToReact', () => {
    it('parses sluglines correctly', () => {
      const result = parseFountainToReact('INT. COFFEE SHOP - DAY', 0);

      expect(result.type).toBe('slugline');
      expect(result.content).toBe('INT. COFFEE SHOP - DAY');
      expect(result.classes).toContain('font-bold');
    });

    it('parses EXT. sluglines', () => {
      const result = parseFountainToReact('EXT. PARK - NIGHT', 0);

      expect(result.type).toBe('slugline');
    });

    it('parses character names', () => {
      const result = parseFountainToReact('ALICE', 0);

      expect(result.type).toBe('character');
      expect(result.content).toBe('ALICE');
    });

    it('parses parentheticals', () => {
      const result = parseFountainToReact('(whispering)', 0);

      expect(result.type).toBe('parenthetical');
      expect(result.classes).toContain('italic');
    });

    it('parses transitions', () => {
      const result = parseFountainToReact('CUT TO:', 0);

      expect(result.type).toBe('transition');
    });

    it('parses FADE OUT', () => {
      const result = parseFountainToReact('FADE OUT.', 0);

      expect(result.type).toBe('transition');
    });

    it('defaults to action for regular text', () => {
      const result = parseFountainToReact('She walks across the room.', 0);

      expect(result.type).toBe('action');
    });
  });

  describe('lintScript', () => {
    const mockScene = createMockScene();

    it('detects passive voice', () => {
      const content = 'He was walking down the street.';
      const issues = lintScript(content, mockScene);

      const passiveIssue = issues.find(i => i.id.includes('passive'));
      expect(passiveIssue).toBeDefined();
      expect(passiveIssue?.type).toBe('style');
    });

    it('detects weasel words', () => {
      const content = 'Suddenly, he runs away.';
      const issues = lintScript(content, mockScene);

      const weaselIssue = issues.find(i => i.id.includes('weasel'));
      expect(weaselIssue).toBeDefined();
    });

    it('warns about camera directions', () => {
      const content = 'We see Alice entering the room.';
      const issues = lintScript(content, mockScene);

      const cameraIssue = issues.find(i => i.id.includes('camera'));
      expect(cameraIssue).toBeDefined();
    });

    it('flags unfilmable actions', () => {
      const content = 'Alice thinks about her past.';
      const issues = lintScript(content, mockScene);

      const unfilmableIssue = issues.find(i => i.id.includes('unfilmable'));
      expect(unfilmableIssue).toBeDefined();
      expect(unfilmableIssue?.type).toBe('logic');
    });

    it('returns empty array for clean script', () => {
      const content = `INT. ROOM - DAY

ALICE
Hello.`;
      const issues = lintScript(content, mockScene);

      expect(issues.length).toBe(0);
    });
  });

  describe('countDialogueLines', () => {
    it('counts character appearances in dialogue', () => {
      const content = `INT. ROOM - DAY

ALICE
Hello.

BOB
Hi.

ALICE
How are you?`;

      expect(countDialogueLines(content, 'Alice')).toBe(2);
      expect(countDialogueLines(content, 'Bob')).toBe(1);
    });

    it('returns 0 for non-speaking character', () => {
      const content = `INT. ROOM - DAY

ALICE
Hello.`;

      expect(countDialogueLines(content, 'Bob')).toBe(0);
    });
  });

  describe('generateScriptExport', () => {
    it('generates basic export without options', () => {
      const sequences = [createMockSequence()];
      const output = generateScriptExport(sequences);

      expect(output).toContain('INT. TEST LOCATION - DAY');
    });

    it('includes tracking when option is set', () => {
      const sequence = createMockSequence({
        scenes: [
          createMockScene({
            tracking: [{ category: 'Plot', description: 'Test tracking' }],
          }),
        ],
      });

      const output = generateScriptExport([sequence], { includeTracking: true });

      expect(output).toContain('TRACKING');
      expect(output).toContain('Test tracking');
    });

    it('includes notes when option is set', () => {
      const sequence = createMockSequence({
        scenes: [
          createMockScene({
            notes: [{
              id: 'note-1',
              author: 'TT',
              content: 'Test note',
              type: 'REWRITE' as any,
            }],
          }),
        ],
      });

      const output = generateScriptExport([sequence], { includeNotes: true });

      expect(output).toContain('NOTES');
      expect(output).toContain('Test note');
    });
  });

  describe('calculateScriptStats', () => {
    it('calculates correct statistics', () => {
      const sequences = [
        createMockSequence({
          scenes: [
            createMockScene({
              pageNumber: 10,
              beats: [
                { id: 'b1', description: 'Beat 1', completed: true },
                { id: 'b2', description: 'Beat 2', completed: false },
              ],
              notes: [
                { id: 'n1', author: 'TT', content: 'Note', type: 'REWRITE' as any },
              ],
            }),
            createMockScene({
              id: 'SC-002',
              pageNumber: 20,
            }),
          ],
        }),
      ];

      const stats = calculateScriptStats(sequences);

      expect(stats.totalScenes).toBe(2);
      expect(stats.totalSequences).toBe(1);
      expect(stats.totalBeats).toBe(2);
      expect(stats.completedBeats).toBe(1);
      expect(stats.beatCompletion).toBe(50);
      expect(stats.totalNotes).toBe(1);
      expect(stats.estimatedPages).toBe(20);
    });

    it('handles empty sequences', () => {
      const stats = calculateScriptStats([]);

      expect(stats.totalScenes).toBe(0);
      expect(stats.beatCompletion).toBe(0);
    });
  });
});
