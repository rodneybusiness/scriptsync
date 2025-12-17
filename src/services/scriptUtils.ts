/**
 * Script Utilities - Parsing, analysis, and export functions
 *
 * These utilities work with any screenplay project.
 */

import { Scene, LintIssue, Sequence, ExportOptions } from "../config/types";

// =============================================================================
// PACING ANALYSIS
// =============================================================================

/**
 * Calculates a "Pacing Score" (0-100)
 * Higher = faster paced (more action, shorter dialogue)
 */
export const calculatePacingScore = (scriptContent: string): number => {
  if (!scriptContent) return 0;

  const lines = scriptContent.split('\n');
  let actionLines = 0;
  let dialogueLines = 0;
  let exclamations = 0;
  let totalWords = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.')) return;

    // Skip character headings
    if (/^[A-Z0-9\s\.]+$/.test(trimmed) && !trimmed.includes('INT.') && !trimmed.includes('EXT.')) {
      return;
    }

    totalWords += trimmed.split(' ').length;
    exclamations += (trimmed.match(/!/g) || []).length;
    if (trimmed.length > 60) actionLines++;
    else dialogueLines++;
  });

  let score = 50;
  score += (exclamations * 2);
  score += (actionLines * 1.5);
  score -= (dialogueLines * 0.5);

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Get color class based on pacing score
 */
export const getPacingColor = (score: number): string => {
  if (score < 30) return 'bg-blue-500';    // Slow/contemplative
  if (score < 60) return 'bg-emerald-500'; // Balanced
  if (score < 80) return 'bg-amber-500';   // Energetic
  return 'bg-red-600';                      // High octane
};

// =============================================================================
// CHARACTER VOICE ANALYSIS
// =============================================================================

export interface VoiceAnalysis {
  avgSentenceLength: string | number;
  complexity: number;
  inquisitiveness: number;
  aggression: number;
  totalWords: number;
}

/**
 * Analyze a character's dialogue patterns
 */
export const analyzeCharacterVoice = (scriptContent: string, charName: string): VoiceAnalysis => {
  const regex = new RegExp(`^${charName.toUpperCase()}\\s*(\\(.*\\))?$`, 'gm');
  const lines = scriptContent.split('\n');

  let sentenceCount = 0;
  let totalWords = 0;
  let complexWords = 0;
  let questions = 0;
  let aggression = 0;

  let isCharSpeaking = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (regex.test(trimmed)) {
      isCharSpeaking = true;
      return;
    }
    if (isCharSpeaking && (/^[A-Z]{2,}/.test(trimmed) || trimmed === '')) {
      if (trimmed !== '' && !trimmed.startsWith('(')) isCharSpeaking = false;
    }

    if (isCharSpeaking && trimmed && !trimmed.startsWith('(')) {
      const words = trimmed.split(/\s+/);
      totalWords += words.length;
      sentenceCount += (trimmed.match(/[.!?]/g) || []).length || 1;
      complexWords += words.filter(w => w.length > 6).length;
      questions += (trimmed.match(/\?/g) || []).length;
      aggression += (trimmed.match(/!/g) || []).length;
    }
  });

  return {
    avgSentenceLength: sentenceCount ? (totalWords / sentenceCount).toFixed(1) : 0,
    complexity: totalWords ? Math.round((complexWords / totalWords) * 100) : 0,
    inquisitiveness: totalWords ? Math.round((questions / totalWords) * 100) : 0,
    aggression: totalWords ? Math.round((aggression / totalWords) * 100) : 0,
    totalWords
  };
};

// =============================================================================
// FOUNTAIN PARSING
// =============================================================================

export interface ParsedLine {
  type: 'slugline' | 'transition' | 'character' | 'parenthetical' | 'action' | 'dialogue';
  content: string;
  classes: string;
}

/**
 * Parse a line of Fountain-formatted script into a renderable object
 */
export const parseFountainToReact = (line: string, _index: number): ParsedLine => {
  const trimmed = line.trim();

  // Scene heading (slugline)
  if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.') || trimmed.startsWith('I/E.')) {
    return {
      type: 'slugline',
      content: trimmed,
      classes: "font-bold text-zinc-100 mt-8 mb-4 uppercase tracking-widest text-lg border-b border-zinc-800 pb-2"
    };
  }

  // Transition
  if (trimmed.endsWith(' TO:') || trimmed === 'FADE OUT.' || trimmed === 'CUT TO BLACK.' || trimmed === 'FADE IN:') {
    return {
      type: 'transition',
      content: trimmed,
      classes: "font-bold text-zinc-400 mt-4 mb-4 uppercase text-right w-full tracking-wider text-sm"
    };
  }

  // Character heading (all caps)
  const isCharacter = /^[A-Z][A-Z0-9\s\.\']+$/.test(trimmed) &&
    !trimmed.includes('EXT.') &&
    !trimmed.includes('INT.') &&
    trimmed.length < 50;
  if (isCharacter) {
    return {
      type: 'character',
      content: trimmed,
      classes: "font-bold text-zinc-200 mt-6 mb-0 w-[60%] mx-auto text-center tracking-wide"
    };
  }

  // Parenthetical
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return {
      type: 'parenthetical',
      content: trimmed,
      classes: "text-zinc-400 w-[50%] mx-auto text-center text-sm italic mb-1"
    };
  }

  // Default: action/description line
  return {
    type: 'action',
    content: line,
    classes: "text-zinc-300 whitespace-pre-wrap max-w-3xl leading-relaxed font-script text-[1.1rem]"
  };
};

// =============================================================================
// SCRIPT LINTING
// =============================================================================

/**
 * Lint script content for common issues
 */
export const lintScript = (content: string, _scene: Scene): LintIssue[] => {
  const issues: LintIssue[] = [];
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const lineNum = idx + 1;

    const isSlug = trimmed.startsWith('INT.') || trimmed.startsWith('EXT.');
    const isChar = /^[A-Z][A-Z0-9\s\.\']+$/.test(trimmed) && trimmed.length < 50;
    const isAction = !isSlug && !isChar && trimmed.length > 0;

    if (isAction) {
      // Passive voice detection
      if (/\b(is|are|was|were) \w+ing\b/i.test(trimmed)) {
        issues.push({
          id: `passive-${lineNum}`,
          line: lineNum,
          type: 'style',
          message: "Passive voice detected. Use active verbs.",
          severity: 'warning',
          suggestion: "Replace 'was walking' with 'walks'."
        });
      }

      // Weasel words
      if (/\b(suddenly|then|very|really|just)\b/i.test(trimmed)) {
        issues.push({
          id: `weasel-${lineNum}`,
          line: lineNum,
          type: 'style',
          message: "Avoid weak words like 'suddenly', 'then', 'very'. Show the action directly.",
          severity: 'warning'
        });
      }

      // Camera directions in spec scripts
      if (/\b(we see|we hear|camera|zoom|pan|close on)\b/i.test(trimmed)) {
        issues.push({
          id: `camera-${lineNum}`,
          line: lineNum,
          type: 'style',
          message: "Avoid camera directions in spec scripts. Describe what the audience experiences.",
          severity: 'info'
        });
      }
    }

    // Check for unfilmables
    if (/\b(thinks|remembers|knows|feels|realizes)\b/i.test(trimmed) && isAction) {
      issues.push({
        id: `unfilmable-${lineNum}`,
        line: lineNum,
        type: 'logic',
        message: "Unfilmable action detected. How do we SEE this on screen?",
        severity: 'warning',
        suggestion: "Show the emotion through action or dialogue instead."
      });
    }
  });

  return issues;
};

// =============================================================================
// DIALOGUE LINE COUNTING
// =============================================================================

/**
 * Count lines of dialogue for a character in a script
 */
export const countDialogueLines = (scriptContent: string, charName: string): number => {
  const regex = new RegExp(`^${charName.toUpperCase()}\\s*(\\(.*\\))?$`, 'gm');
  return (scriptContent.match(regex) || []).length;
};

// =============================================================================
// EXPORT FUNCTIONS
// =============================================================================

/**
 * Generate exportable script text
 */
export const generateScriptExport = (
  sequences: Sequence[],
  options: Partial<ExportOptions> = {}
): string => {
  const opts = {
    includeNotes: false,
    includeBoneyard: false,
    includeTracking: false,
    format: 'fountain' as const,
    ...options
  };

  let output = "";

  sequences.forEach(seq => {
    if (opts.includeNotes || opts.includeTracking) {
      output += `\n# ${seq.title}\n`;
      output += `# Dramatic Question: ${seq.dramaticQuestion}\n\n`;
    }

    seq.scenes.forEach(scene => {
      output += `\n${scene.scriptContent}\n`;

      if (opts.includeTracking && scene.tracking.length > 0) {
        output += `\n/* TRACKING:\n`;
        scene.tracking.forEach(t => {
          output += `[${t.category}] ${t.description}\n`;
        });
        output += `*/\n`;
      }

      if (opts.includeNotes && scene.notes.length > 0) {
        output += `\n/* NOTES:\n`;
        scene.notes.forEach(note => {
          output += `${note.author} (${note.type}): ${note.content}\n`;
        });
        output += `*/\n`;
      }
    });
  });

  return output;
};

/**
 * Calculate overall script statistics
 */
export const calculateScriptStats = (sequences: Sequence[]) => {
  let totalScenes = 0;
  let totalBeats = 0;
  let completedBeats = 0;
  let totalNotes = 0;
  let totalPages = 0;

  sequences.forEach(seq => {
    seq.scenes.forEach(scene => {
      totalScenes++;
      totalBeats += scene.beats.length;
      completedBeats += scene.beats.filter(b => b.completed).length;
      totalNotes += scene.notes.length;
      totalPages = Math.max(totalPages, scene.pageNumber);
    });
  });

  return {
    totalScenes,
    totalSequences: sequences.length,
    totalBeats,
    completedBeats,
    beatCompletion: totalBeats ? Math.round((completedBeats / totalBeats) * 100) : 0,
    totalNotes,
    estimatedPages: totalPages
  };
};
