/**
 * Character Analysis Service
 *
 * Writer-focused character metrics that actually help craft distinct voices:
 * - Speaking patterns (verbal tics, catchphrases)
 * - Speaking partners (who do they talk to most?)
 * - Emotional register (where in the script do emotions shift?)
 * - Arc tracking (first/last appearance, transformation markers)
 */

import { Scene, Sequence, CharacterConfig } from '../config/types';

// =============================================================================
// TYPES
// =============================================================================

export interface VerbalTic {
  phrase: string;
  count: number;
  category: 'filler' | 'catchphrase' | 'pattern';
}

export interface SpeakingPartner {
  name: string;
  sceneCount: number;
  lineExchanges: number;
}

export interface EmotionalBeat {
  sceneId: string;
  sceneTitle: string;
  register: 'neutral' | 'elevated' | 'conflict' | 'intimate' | 'comedic';
  sample: string;
}

export interface CharacterAnalysis {
  // Basic Stats
  totalWords: number;
  totalLines: number;
  avgWordsPerLine: number;
  sceneCount: number;

  // Writer-Useful Metrics
  verbalTics: VerbalTic[];
  speakingPartners: SpeakingPartner[];
  emotionalBeats: EmotionalBeat[];

  // Arc Markers
  firstAppearance: { sceneId: string; sceneTitle: string } | null;
  lastAppearance: { sceneId: string; sceneTitle: string } | null;
  peakActivity: { sceneId: string; sceneTitle: string; lineCount: number } | null;
}

// =============================================================================
// VERBAL TIC DETECTION
// =============================================================================

/** Common filler patterns to detect */
const FILLER_PATTERNS = [
  /\buh+\b/gi,
  /\bum+\b/gi,
  /\byou know\b/gi,
  /\blike,?\s/gi,
  /\bi mean\b/gi,
  /\bbasically\b/gi,
  /\bhonestly\b/gi,
  /\bliterally\b/gi,
  /\bactually\b/gi,
  /\bseriously\b/gi,
  /\bwhatever\b/gi,
  /\bright\?/gi,
  /\bokay\?/gi,
];

/** Detect repeated phrases that could be verbal tics or catchphrases */
const detectVerbalTics = (dialogueLines: string[]): VerbalTic[] => {
  const allDialogue = dialogueLines.join(' ').toLowerCase();
  const tics: Map<string, { count: number; category: VerbalTic['category'] }> = new Map();

  // Check for fillers
  FILLER_PATTERNS.forEach(pattern => {
    const matches = allDialogue.match(pattern);
    if (matches && matches.length >= 2) {
      const phrase = matches[0].trim().toLowerCase();
      tics.set(phrase, {
        count: matches.length,
        category: 'filler'
      });
    }
  });

  // Find repeated 2-3 word phrases (potential catchphrases)
  const words = allDialogue.split(/\s+/).filter(w => w.length > 1);
  const phrases: Map<string, number> = new Map();

  for (let i = 0; i < words.length - 2; i++) {
    const twoWord = `${words[i]} ${words[i + 1]}`;
    const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;

    phrases.set(twoWord, (phrases.get(twoWord) || 0) + 1);
    phrases.set(threeWord, (phrases.get(threeWord) || 0) + 1);
  }

  // Add phrases that appear 3+ times as potential patterns
  phrases.forEach((count, phrase) => {
    if (count >= 3 && !tics.has(phrase)) {
      // Filter out common/boring phrases
      const boring = ['and the', 'in the', 'to the', 'of the', 'it was', 'i was', 'you are', 'i am'];
      if (!boring.some(b => phrase.includes(b))) {
        tics.set(phrase, { count, category: 'pattern' });
      }
    }
  });

  return Array.from(tics.entries())
    .map(([phrase, data]) => ({ phrase, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 verbal tics
};

// =============================================================================
// SPEAKING PARTNER DETECTION
// =============================================================================

/**
 * Analyze who this character speaks with most often.
 * Tracks both scene co-appearances and dialogue exchanges (back-and-forth).
 */
const analyzeSpeakingPartners = (
  charName: string,
  searchTerms: string[],
  allScenes: Scene[],
  allCharacters: CharacterConfig[]
): SpeakingPartner[] => {
  const partners: Map<string, { sceneCount: number; lineExchanges: number }> = new Map();

  // Initialize all characters as potential partners
  allCharacters.forEach(c => {
    if (c.name !== charName) {
      partners.set(c.name, { sceneCount: 0, lineExchanges: 0 });
    }
  });

  allScenes.forEach(scene => {
    const script = scene.scriptContent.toUpperCase();
    const charAppears = searchTerms.some(term => script.includes(term));
    if (!charAppears) return;

    // Find other characters who appear in this scene
    allCharacters.forEach(otherChar => {
      if (otherChar.name === charName) return;

      const otherTerms = [otherChar.name.toUpperCase()];
      if (otherChar.aliases) {
        otherTerms.push(...otherChar.aliases.map(a => a.toUpperCase()));
      }

      const otherAppears = otherTerms.some(term => script.includes(term));
      if (otherAppears) {
        const current = partners.get(otherChar.name) || { sceneCount: 0, lineExchanges: 0 };
        current.sceneCount++;

        // Count dialogue exchanges (character name followed by other character name within ~10 lines)
        const lines = script.split('\n');
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          const isCharLine = searchTerms.some(term => line === term || line.startsWith(term + ' ('));
          if (isCharLine) {
            // Look ahead for other character's line
            for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
              const nextLine = lines[j].trim();
              if (otherTerms.some(term => nextLine === term || nextLine.startsWith(term + ' ('))) {
                current.lineExchanges++;
                break;
              }
            }
          }
        }

        partners.set(otherChar.name, current);
      }
    });
  });

  return Array.from(partners.entries())
    .map(([name, data]) => ({ name, ...data }))
    .filter(p => p.sceneCount > 0)
    .sort((a, b) => b.lineExchanges - a.lineExchanges);
};

// =============================================================================
// EMOTIONAL REGISTER DETECTION
// =============================================================================

/** Keywords and patterns that suggest emotional register */
const REGISTER_PATTERNS = {
  conflict: [/\bwhy\b.*\?/i, /\bhow could\b/i, /\bdamn\b/i, /\bhell\b/i, /\bstop\b/i, /\bdon't\b.*!/i, /!/],
  intimate: [/\blove\b/i, /\bmiss\b/i, /\bsorry\b/i, /\bwish\b/i, /\bremember when\b/i, /\bI feel\b/i],
  elevated: [/\bmust\b/i, /\bnever\b/i, /\balways\b/i, /\beverything\b/i, /\bnothing\b/i, /\bdestiny\b/i],
  comedic: [/\blol\b/i, /\bha+\b/i, /\bwait,?\s+what\b/i, /\bseriously\?/i, /\bdude\b/i]
};

const detectEmotionalRegister = (dialogue: string): EmotionalBeat['register'] => {
  let scores = { conflict: 0, intimate: 0, elevated: 0, comedic: 0, neutral: 0 };

  Object.entries(REGISTER_PATTERNS).forEach(([register, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(dialogue)) {
        scores[register as keyof typeof scores]++;
      }
    });
  });

  // Find highest scoring register
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'neutral';

  const winner = Object.entries(scores).find(([, score]) => score === maxScore);
  return (winner?.[0] || 'neutral') as EmotionalBeat['register'];
};

const analyzeEmotionalBeats = (
  searchTerms: string[],
  allScenes: Scene[]
): EmotionalBeat[] => {
  const beats: EmotionalBeat[] = [];

  allScenes.forEach(scene => {
    const script = scene.scriptContent;
    const lines = script.split('\n');
    let charDialogue: string[] = [];
    let isCharSpeaking = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      const upper = trimmed.toUpperCase();

      if (searchTerms.some(term => upper === term || upper.startsWith(term + ' ('))) {
        isCharSpeaking = true;
        return;
      }

      if (isCharSpeaking && trimmed && !trimmed.startsWith('(')) {
        if (/^[A-Z]{2,}/.test(trimmed)) {
          isCharSpeaking = false;
        } else {
          charDialogue.push(trimmed);
        }
      }
    });

    if (charDialogue.length > 0) {
      const combinedDialogue = charDialogue.join(' ');
      const register = detectEmotionalRegister(combinedDialogue);

      if (register !== 'neutral') {
        beats.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          register,
          sample: charDialogue[0].substring(0, 60) + (charDialogue[0].length > 60 ? '...' : '')
        });
      }
    }
  });

  return beats;
};

// =============================================================================
// MAIN ANALYSIS FUNCTION
// =============================================================================

/**
 * Comprehensive character analysis for writer-useful metrics.
 * Replaces the old analyzeCharacterVoice with actually helpful data.
 */
export const analyzeCharacter = (
  charName: string,
  charConfig: CharacterConfig | undefined,
  sequences: Sequence[],
  allCharacters: CharacterConfig[]
): CharacterAnalysis => {
  // Build search terms (name + aliases)
  const searchTerms: string[] = [charName.toUpperCase()];
  if (charConfig?.aliases) {
    searchTerms.push(...charConfig.aliases.map(a => a.toUpperCase()));
  }
  // Add first name
  const firstName = charName.split(' ')[0].toUpperCase();
  if (firstName !== charName.toUpperCase() && firstName.length > 2) {
    searchTerms.push(firstName);
  }

  // Flatten all scenes
  const allScenes = sequences.flatMap(seq => seq.scenes);

  // Extract all dialogue for this character
  let totalWords = 0;
  let totalLines = 0;
  const dialogueLines: string[] = [];
  let firstAppearance: CharacterAnalysis['firstAppearance'] = null;
  let lastAppearance: CharacterAnalysis['lastAppearance'] = null;
  let peakActivity: CharacterAnalysis['peakActivity'] = null;
  let sceneCount = 0;

  allScenes.forEach(scene => {
    const script = scene.scriptContent;
    const lines = script.split('\n');
    let isCharSpeaking = false;
    let sceneLineCount = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      const upper = trimmed.toUpperCase();

      if (searchTerms.some(term => upper === term || upper.startsWith(term + ' ('))) {
        isCharSpeaking = true;
        return;
      }

      if (isCharSpeaking && trimmed && !trimmed.startsWith('(')) {
        if (/^[A-Z]{2,}/.test(trimmed)) {
          isCharSpeaking = false;
        } else {
          dialogueLines.push(trimmed);
          totalWords += trimmed.split(/\s+/).filter(Boolean).length;
          totalLines++;
          sceneLineCount++;
        }
      }
    });

    if (sceneLineCount > 0) {
      sceneCount++;

      // Track appearances
      if (!firstAppearance) {
        firstAppearance = { sceneId: scene.id, sceneTitle: scene.title };
      }
      lastAppearance = { sceneId: scene.id, sceneTitle: scene.title };

      if (!peakActivity || sceneLineCount > peakActivity.lineCount) {
        peakActivity = { sceneId: scene.id, sceneTitle: scene.title, lineCount: sceneLineCount };
      }
    }
  });

  return {
    totalWords,
    totalLines,
    avgWordsPerLine: totalLines > 0 ? Math.round((totalWords / totalLines) * 10) / 10 : 0,
    sceneCount,
    verbalTics: detectVerbalTics(dialogueLines),
    speakingPartners: analyzeSpeakingPartners(charName, searchTerms, allScenes, allCharacters),
    emotionalBeats: analyzeEmotionalBeats(searchTerms, allScenes),
    firstAppearance,
    lastAppearance,
    peakActivity
  };
};

/**
 * Get a color for emotional register badges
 */
export const getRegisterColor = (register: EmotionalBeat['register']): string => {
  switch (register) {
    case 'conflict': return 'text-red-400 bg-red-900/30 border-red-700/50';
    case 'intimate': return 'text-pink-400 bg-pink-900/30 border-pink-700/50';
    case 'elevated': return 'text-purple-400 bg-purple-900/30 border-purple-700/50';
    case 'comedic': return 'text-amber-400 bg-amber-900/30 border-amber-700/50';
    default: return 'text-zinc-400 bg-zinc-900/30 border-zinc-700/50';
  }
};
