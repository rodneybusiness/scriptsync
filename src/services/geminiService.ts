/**
 * Gemini AI Service - Template-based prompts for script analysis
 *
 * All prompts are dynamically generated based on the active project's configuration.
 * This allows the same tool to work for any screenplay project.
 */

import { GoogleGenAI } from "@google/genai";
import { Scene, ProjectConfig } from "../config/types";

// =============================================================================
// AI INITIALIZATION
// =============================================================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";

// =============================================================================
// SESSION MEMORY (In-memory storage for corrections and preferences)
// =============================================================================

interface SessionCorrection {
  timestamp: Date;
  type: 'dialogue_style' | 'character_voice' | 'pacing' | 'tone' | 'general';
  correction: string;
  context?: string; // What was being discussed when the correction was made
}

interface SessionMemory {
  corrections: SessionCorrection[];
  preferredStyle?: string; // User's preferred writing style for this session
  avoidPatterns: string[]; // Patterns/words to avoid (user feedback)
  characterNotes: Map<string, string[]>; // Character-specific notes
}

// Session memory singleton (resets on page refresh)
const sessionMemory: SessionMemory = {
  corrections: [],
  avoidPatterns: [],
  characterNotes: new Map()
};

/**
 * Add a correction to session memory
 */
export const addSessionCorrection = (
  type: SessionCorrection['type'],
  correction: string,
  context?: string
): void => {
  sessionMemory.corrections.push({
    timestamp: new Date(),
    type,
    correction,
    context
  });

  // Keep only the last 20 corrections to prevent memory bloat
  if (sessionMemory.corrections.length > 20) {
    sessionMemory.corrections = sessionMemory.corrections.slice(-20);
  }
};

/**
 * Add a pattern to avoid
 */
export const addAvoidPattern = (pattern: string): void => {
  if (!sessionMemory.avoidPatterns.includes(pattern)) {
    sessionMemory.avoidPatterns.push(pattern);
  }
};

/**
 * Add a character-specific note
 */
export const addCharacterNote = (characterName: string, note: string): void => {
  const normalized = characterName.toUpperCase();
  const existing = sessionMemory.characterNotes.get(normalized) || [];
  existing.push(note);
  sessionMemory.characterNotes.set(normalized, existing.slice(-5)); // Keep last 5 per character
};

/**
 * Get session memory context for prompts
 */
const buildSessionMemoryContext = (characterName?: string): string => {
  const parts: string[] = [];

  // Recent corrections
  if (sessionMemory.corrections.length > 0) {
    const recentCorrections = sessionMemory.corrections.slice(-5);
    parts.push(`=== SESSION CORRECTIONS (Apply these learnings) ===`);
    recentCorrections.forEach((c, i) => {
      parts.push(`${i + 1}. [${c.type}] ${c.correction}`);
    });
  }

  // Patterns to avoid
  if (sessionMemory.avoidPatterns.length > 0) {
    parts.push(`\n=== AVOID THESE PATTERNS (User feedback) ===`);
    parts.push(sessionMemory.avoidPatterns.map(p => `- ${p}`).join('\n'));
  }

  // Character-specific notes
  if (characterName) {
    const charNotes = sessionMemory.characterNotes.get(characterName.toUpperCase());
    if (charNotes && charNotes.length > 0) {
      parts.push(`\n=== NOTES FOR ${characterName.toUpperCase()} ===`);
      parts.push(charNotes.map(n => `- ${n}`).join('\n'));
    }
  }

  // Preferred style
  if (sessionMemory.preferredStyle) {
    parts.push(`\n=== USER'S PREFERRED STYLE ===`);
    parts.push(sessionMemory.preferredStyle);
  }

  return parts.length > 0 ? parts.join('\n') : '';
};

/**
 * Clear session memory (e.g., when starting a new project)
 */
export const clearSessionMemory = (): void => {
  sessionMemory.corrections = [];
  sessionMemory.avoidPatterns = [];
  sessionMemory.characterNotes.clear();
  sessionMemory.preferredStyle = undefined;
};

/**
 * Set preferred style for the session
 */
export const setSessionPreferredStyle = (style: string): void => {
  sessionMemory.preferredStyle = style;
};

/**
 * Get current session memory state (for debugging/display)
 */
export const getSessionMemoryState = (): {
  correctionCount: number;
  avoidPatterns: string[];
  characterNotes: Record<string, string[]>;
  hasPreferredStyle: boolean;
} => {
  return {
    correctionCount: sessionMemory.corrections.length,
    avoidPatterns: [...sessionMemory.avoidPatterns],
    characterNotes: Object.fromEntries(sessionMemory.characterNotes),
    hasPreferredStyle: Boolean(sessionMemory.preferredStyle)
  };
};

/**
 * Check if AI is available (API key is set)
 */
export const isAIAvailable = (): boolean => {
  return Boolean(API_KEY && API_KEY.length > 0 && API_KEY !== 'your_api_key_here');
};

/**
 * Get the AI client, or throw a helpful error if not configured
 */
const getAI = () => {
  if (!isAIAvailable()) {
    throw new Error('AI_NOT_CONFIGURED: Gemini API key is not set. Add VITE_GEMINI_API_KEY to your .env.local file.');
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

/**
 * Wrapper for AI calls with graceful fallback
 */
export const safeAICall = async <T>(
  aiCall: () => Promise<T>,
  fallback: T,
  errorPrefix: string = 'AI Error'
): Promise<{ result: T; isAI: boolean; error?: string }> => {
  if (!isAIAvailable()) {
    return {
      result: fallback,
      isAI: false,
      error: 'AI features are disabled. Set VITE_GEMINI_API_KEY in .env.local to enable.'
    };
  }

  try {
    const result = await aiCall();
    return { result, isAI: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${errorPrefix}:`, error);

    // Check for specific error types
    if (message.includes('401') || message.includes('API key')) {
      return {
        result: fallback,
        isAI: false,
        error: 'Invalid API key. Please check your VITE_GEMINI_API_KEY.'
      };
    }
    if (message.includes('429') || message.includes('quota')) {
      return {
        result: fallback,
        isAI: false,
        error: 'API quota exceeded. Please try again later.'
      };
    }
    if (message.includes('network') || message.includes('fetch')) {
      return {
        result: fallback,
        isAI: false,
        error: 'Network error. Please check your connection.'
      };
    }

    return {
      result: fallback,
      isAI: false,
      error: `AI error: ${message}`
    };
  }
};

// =============================================================================
// CONTEXT BUILDERS
// =============================================================================

/**
 * Build a high-level outline of all scenes
 */
const buildGlobalContext = (allScenes: Scene[]): string => {
  return allScenes.map(s => `[${s.id}] ${s.title}: ${s.summary}`).join('\n');
};

// =============================================================================
// CHARACTER VOICE EXTRACTION
// =============================================================================

/**
 * Extract dialogue samples for a specific character from all scenes.
 * Uses standard screenplay format parsing (CHARACTER NAME followed by dialogue).
 */
const extractCharacterDialogue = (
  characterName: string,
  allScenes: Scene[],
  maxSamples: number = 5
): string[] => {
  const dialogueSamples: { dialogue: string; scene: string }[] = [];

  // Normalize character name for matching (handle aliases)
  const normalizedName = characterName.toUpperCase().trim();

  for (const scene of allScenes) {
    const content = scene.scriptContent || '';

    // Standard screenplay format: CHARACTER NAME in caps, followed by dialogue on next lines
    // Pattern matches: CHARACTER NAME (possibly with parenthetical), then dialogue until next character/action
    const dialoguePattern = new RegExp(
      `^\\s*${escapeRegex(normalizedName)}\\s*(?:\\([^)]+\\))?\\s*\\n([^A-Z\\n][^\\n]+(?:\\n(?![A-Z]{2,})[^\\n]+)*)`,
      'gm'
    );

    let match;
    while ((match = dialoguePattern.exec(content)) !== null) {
      const dialogue = match[1].trim();
      if (dialogue.length > 10 && dialogue.length < 500) { // Filter out very short or very long
        dialogueSamples.push({
          dialogue,
          scene: scene.title
        });
      }
    }

    // Also try simpler pattern for less structured scripts
    const simplePattern = new RegExp(
      `${escapeRegex(normalizedName)}:\\s*[""]?([^""\n]+(?:[^""\n]*)?)"?`,
      'gi'
    );

    while ((match = simplePattern.exec(content)) !== null) {
      const dialogue = match[1].trim();
      if (dialogue.length > 10 && dialogue.length < 500) {
        dialogueSamples.push({
          dialogue,
          scene: scene.title
        });
      }
    }
  }

  // Return unique samples, preferring longer ones
  const unique = [...new Map(dialogueSamples.map(s => [s.dialogue, s])).values()];
  const sorted = unique.sort((a, b) => b.dialogue.length - a.dialogue.length);

  return sorted.slice(0, maxSamples).map(s => `"${s.dialogue}" (${s.scene})`);
};

/**
 * Escape special regex characters in a string
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Get character metadata from project config
 */
const getCharacterMetadata = (
  characterName: string,
  config: ProjectConfig
): { description?: string; arc?: string; role?: string } | null => {
  const normalizedName = characterName.toUpperCase().trim();

  const character = config.characters.find(c => {
    const nameMatch = c.name.toUpperCase() === normalizedName;
    const aliasMatch = c.aliases?.some(a => a.toUpperCase() === normalizedName);
    return nameMatch || aliasMatch;
  });

  if (!character) return null;

  return {
    description: character.description,
    arc: character.arc,
    role: character.role
  };
};

/**
 * Build comprehensive character context including voice samples and metadata
 */
const buildCharacterContext = (
  characterName: string,
  allScenes: Scene[],
  config: ProjectConfig
): string => {
  const metadata = getCharacterMetadata(characterName, config);
  const dialogueSamples = extractCharacterDialogue(characterName, allScenes, 5);

  let context = `CHARACTER: ${characterName}\n`;

  if (metadata) {
    if (metadata.role) {
      context += `ROLE: ${metadata.role} character\n`;
    }
    if (metadata.description) {
      context += `DESCRIPTION: ${metadata.description}\n`;
    }
    if (metadata.arc) {
      context += `ARC: ${metadata.arc}\n`;
    }
  }

  if (dialogueSamples.length > 0) {
    context += `\nEXISTING DIALOGUE SAMPLES (for voice consistency):\n`;
    context += dialogueSamples.map((s, i) => `${i + 1}. ${s}`).join('\n');
    context += `\n\nIMPORTANT: Match the character's established voice, vocabulary, and speech patterns.`;
  } else {
    context += `\nNo existing dialogue found. Establish voice based on character description.`;
  }

  return context;
};

/**
 * Build detailed context including adjacent scenes (legacy - kept for compatibility)
 */
const buildDetailedContext = (scene: Scene, allScenes: Scene[]): string => {
  const currentIndex = allScenes.findIndex(s => s.id === scene.id);
  const prev = allScenes[currentIndex - 1];
  const next = allScenes[currentIndex + 1];

  return `
GLOBAL STORY OUTLINE:
${buildGlobalContext(allScenes)}

IMMEDIATE CONTEXT:
PREVIOUS SCENE: ${prev ? `${prev.title} - ${prev.summary}` : "START OF FILM"}
NEXT SCENE: ${next ? `${next.title} - ${next.summary}` : "END OF FILM"}
  `.trim();
};

// =============================================================================
// TIERED CONTEXT BUILDING (Enhanced context with relevance-based detail)
// =============================================================================

/**
 * Extract key dialogue exchanges from a scene (first ~200 chars of dialogue)
 */
const extractKeyDialogue = (scene: Scene): string => {
  const content = scene.scriptContent || '';
  // Find dialogue patterns (CHARACTER NAME followed by dialogue)
  const dialogueMatches = content.match(/^[A-Z]{2,}[A-Z\s]*(?:\([^)]+\))?\n[^A-Z\n][^\n]+/gm) || [];
  const keyExchanges = dialogueMatches.slice(0, 2).join('\n');
  return keyExchanges.substring(0, 200);
};

/**
 * Build tiered context with varying detail levels based on relevance
 *
 * TIER 1: Current scene - FULL content (already provided separately)
 * TIER 2: Adjacent scenes - Rich summaries + key dialogue + connections
 * TIER 3: Connected scenes - Summaries with connection context
 * TIER 4: Global outline - Compressed story structure
 */
const buildTieredContext = (
  scene: Scene,
  allScenes: Scene[],
  config: ProjectConfig
): string => {
  const currentIndex = allScenes.findIndex(s => s.id === scene.id);

  // TIER 2: Adjacent scenes (high detail)
  const adjacentScenes: string[] = [];
  const prevScene = allScenes[currentIndex - 1];
  const nextScene = allScenes[currentIndex + 1];

  if (prevScene) {
    const keyDialogue = extractKeyDialogue(prevScene);
    adjacentScenes.push(`PREVIOUS: "${prevScene.title}"
Summary: ${prevScene.summary}
Location: ${prevScene.location || 'Unknown'}
${keyDialogue ? `Key Exchange:\n${keyDialogue}` : ''}
Tracking: ${prevScene.tracking?.map(t => t.description).join('; ') || 'None'}`);
  }

  if (nextScene) {
    const keyDialogue = extractKeyDialogue(nextScene);
    adjacentScenes.push(`NEXT: "${nextScene.title}"
Summary: ${nextScene.summary}
Location: ${nextScene.location || 'Unknown'}
${keyDialogue ? `Key Exchange:\n${keyDialogue}` : ''}`);
  }

  // TIER 3: Connected scenes (via scene connections)
  const connectedScenes: string[] = [];
  const connections = scene.connections || [];

  for (const conn of connections) {
    const targetScene = allScenes.find(s => s.id === conn.targetSceneId);
    if (targetScene) {
      connectedScenes.push(`[${conn.type.toUpperCase()}] "${targetScene.title}": ${conn.description}
   → ${targetScene.summary}`);
    }
  }

  // Also find scenes that connect TO this scene
  const incomingConnections = allScenes.filter(s =>
    s.connections?.some(c => c.targetSceneId === scene.id)
  );
  for (const srcScene of incomingConnections.slice(0, 3)) {
    const conn = srcScene.connections?.find(c => c.targetSceneId === scene.id);
    if (conn) {
      connectedScenes.push(`[INCOMING ${conn.type.toUpperCase()}] from "${srcScene.title}": ${conn.description}`);
    }
  }

  // TIER 4: Global outline (compressed - just key story beats)
  const totalScenes = allScenes.length;
  const actBreaks = [
    Math.floor(totalScenes * 0.25),  // End of Act 1
    Math.floor(totalScenes * 0.5),   // Midpoint
    Math.floor(totalScenes * 0.75),  // End of Act 2
  ];

  const keyStoryBeats = [
    { label: 'Opening', scene: allScenes[0] },
    { label: 'Catalyst (~10%)', scene: allScenes[Math.floor(totalScenes * 0.1)] },
    { label: 'End Act 1', scene: allScenes[actBreaks[0]] },
    { label: 'Midpoint', scene: allScenes[actBreaks[1]] },
    { label: 'End Act 2', scene: allScenes[actBreaks[2]] },
    { label: 'Climax', scene: allScenes[totalScenes - 2] },
    { label: 'Resolution', scene: allScenes[totalScenes - 1] },
  ].filter(b => b.scene && b.scene.id !== scene.id);

  const globalOutline = keyStoryBeats
    .map(b => `${b.label}: "${b.scene.title}" - ${b.scene.summary.substring(0, 80)}...`)
    .join('\n');

  // Compile tiered context
  let context = `=== TIERED STORY CONTEXT ===

--- TIER 2: ADJACENT SCENES (High Detail) ---
${adjacentScenes.length > 0 ? adjacentScenes.join('\n\n') : 'No adjacent scenes.'}
`;

  if (connectedScenes.length > 0) {
    context += `
--- TIER 3: CONNECTED SCENES (Plot/Theme Links) ---
${connectedScenes.join('\n')}
`;
  }

  context += `
--- TIER 4: STORY STRUCTURE (Key Beats) ---
${globalOutline}

--- CURRENT POSITION ---
Scene ${currentIndex + 1} of ${totalScenes} (${Math.round((currentIndex / totalScenes) * 100)}% through story)
`;

  // Add character roster summary
  const mainChars = config.characters
    .filter(c => c.role === 'main')
    .map(c => `${c.name}: ${c.arc || c.description || 'No arc defined'}`);

  if (mainChars.length > 0) {
    context += `
--- MAIN CHARACTER ARCS ---
${mainChars.join('\n')}
`;
  }

  return context;
};

/**
 * Build project-specific AI context from config
 */
const buildProjectContext = (config: ProjectConfig): string => {
  const genres = config.genres.join(', ');
  const themes = config.themes.join(', ');
  const ai = config.ai;
  const constraints = ai?.uniqueConstraints && ai.uniqueConstraints.length > 0
    ? `\nUNIQUE CONSTRAINTS:\n${ai.uniqueConstraints.map(c => `- ${c}`).join('\n')}`
    : '';

  return `
PROJECT: "${config.title}"
GENRE: ${genres}
LOGLINE: ${config.logline}
THEMES: ${themes}
${constraints}
${ai?.customInstructions ? `\nADDITIONAL NOTES:\n${ai.customInstructions}` : ''}
  `.trim();
};

// =============================================================================
// FEW-SHOT EXAMPLES (Curated examples for better AI output quality)
// =============================================================================

/**
 * Few-shot example for scene gap analysis
 */
const SCENE_ANALYSIS_EXAMPLE = `
### Example Analysis Output

**SCENE**: "The Confrontation" - INT. DETECTIVE'S OFFICE - NIGHT

### Beat Realization ✓
The intended beats are **partially achieved**:
- ✓ "Sarah reveals the evidence" - Effectively shown through dialogue lines 12-18
- ○ "Detective realizes betrayal" - **WEAK**: The reaction is too on-the-nose. Line 24 "I can't believe you betrayed me" should be shown through action/silence.

### Dialogue Quality
**On-The-Nose Issues Found:**
1. Line 24: "I can't believe you betrayed me" → SUGGESTION: Cut line, add action: *Detective slowly sets down his badge. His hands shake.*
2. Line 31: "I'm scared of what happens next" → SUGGESTION: Subtext version: "What time is it? I should... I should call my mother."

### Continuity Check ✓
- Props continuity: The coffee cup introduced in Scene 12 is correctly tracked
- **ISSUE**: Sarah mentions "the file" but it was established as a USB drive in Scene 8

### Pacing Analysis
At 45% through the story, this scene's 3-page length is appropriate for a midpoint revelation. However, consider **trimming the opening 4 lines** which repeat information from the previous scene.

### High-Impact Suggestions
1. **ADD VISUAL**: When Sarah hands over the evidence, have her **hesitate** - creates subtext
2. **CUT LINES 5-8**: Exposition already covered; trust your audience
3. **STRENGTHEN ENDING**: Current ending trails off. Add a decisive action or callback to the opening image.
`;

/**
 * Few-shot example for dialogue generation
 */
const DIALOGUE_GENERATION_EXAMPLE = `
### Example Dialogue Options

**CHARACTER**: MARCUS (world-weary detective, dry wit, avoids emotional vulnerability)
**INTENT**: Express hidden love for partner while maintaining tough exterior

---

**1. Direct & Punchy**
> "You're not dying on me, Sarah. I don't have time to break in a new partner."
*Why it fits*: Uses Marcus's established deflection pattern. The word "partner" carries double meaning.

**2. Subtextual/Deflective**
> (adjusting her collar) "This vest is crooked. Always was lousy at taking care of yourself."
*Why it fits*: Physical action replaces words. Mirrors his "fixing things" coping mechanism from Scene 3.

**3. Thematic (ties to "Finding Home" theme)**
> "Fourteen years. You're the only person who knows I take my coffee black."
*Why it fits*: Connects to project theme of found family. Specific detail (coffee) makes it feel earned, not sentimental.
`;

/**
 * Few-shot example for beat alternatives
 */
const BEAT_ALTERNATIVES_EXAMPLE = `
### Example Beat Alternatives

**CURRENT BEAT**: "Protagonist discovers the secret door"

---

**Alternative A: High Octane** 🔥
The protagonist doesn't *discover* the door—they're *thrown through it*. During the chase sequence, they crash through what seemed like a solid wall, revealing the hidden passage. Adds urgency and raises stakes.

**Alternative B: Character Conflict** 💔
The protagonist's mentor casually opens the "secret" door to grab a coat. The secret wasn't a secret at all—just from *them*. Forces confrontation about trust and hierarchy.

**Alternative C: The "Smart" Twist** 🧠
The protagonist has been using the secret door the whole time—it's their bedroom door. A shift in perspective reveals their apartment IS the hidden chamber. Recasts every previous scene.
`;

// =============================================================================
// SCENE ANALYSIS
// =============================================================================

export const analyzeSceneGap = async (
  scene: Scene,
  allScenes: Scene[],
  config: ProjectConfig
): Promise<string> => {
  const projectContext = buildProjectContext(config);
  // Use enhanced tiered context instead of basic detailed context
  const storyContext = buildTieredContext(scene, allScenes, config);

  const prompt = `
Role: Elite Hollywood Script Doctor (${config.ai?.toneDescriptor || 'Professional'}).
Style Reference: ${config.ai?.styleReferences?.join(', ') || 'Professional screenwriter'}

=== PROJECT CONTEXT ===
${projectContext}

${storyContext}

=== CURRENT SCENE (TIER 1: Full Detail) ===
Title: ${scene.title}
Location: ${scene.location || 'Not specified'} - ${scene.timeOfDay || 'Unspecified time'}
Summary: ${scene.summary}
Intended Beats: ${scene.beats.map(b => `${b.completed ? '✓' : '○'} ${b.description}`).join(' → ')}
Tracking Notes: ${scene.tracking.map(t => `[${t.category}] ${t.description}`).join('\n')}

=== SCRIPT CONTENT ===
${scene.scriptContent}

=== ANALYSIS INSTRUCTIONS ===
Using ALL the context above (adjacent scenes, connected scenes, story structure):

1. **BEAT REALIZATION**: Compare SCRIPT CONTENT against INTENDED BEATS. Are beats effectively executed?
2. **DIALOGUE QUALITY**: Check for "On The Nose" dialogue. Suggest subtextual improvements.
3. **CONTINUITY CHECK**: Using TIER 2/3 context, verify continuity with adjacent and connected scenes.
4. **PACING ANALYSIS**: Is this scene's pacing appropriate for its position (${Math.round((allScenes.findIndex(s => s.id === scene.id) / allScenes.length) * 100)}% through story)?
5. **HIGH-IMPACT SUGGESTIONS**: 3 specific, actionable improvements.

=== EXAMPLE OUTPUT (Follow this structure and quality level) ===
${SCENE_ANALYSIS_EXAMPLE}

=== NOW ANALYZE THE CURRENT SCENE ===
Use the same structure as the example above. Be specific to THIS scene's content.
  `.trim();

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error analyzing scene. Please check API key.";
  }
};

// =============================================================================
// DIALOGUE GENERATION
// =============================================================================

export const generateDialogue = async (
  scene: Scene,
  character: string,
  intent: string,
  allScenes: Scene[],
  config: ProjectConfig
): Promise<string> => {
  const styleRef = config.ai?.styleReferences?.join(' / ') || 'Natural, character-driven';

  // Build comprehensive character context with voice samples
  const characterContext = buildCharacterContext(character, allScenes, config);

  // Get session memory for this character
  const sessionContext = buildSessionMemoryContext(character);

  const prompt = `
Role: Screenwriter (${styleRef} style).
Project: "${config.title}" (${config.genres.join('/')}).
Logline: ${config.logline}

=== CHARACTER PROFILE ===
${characterContext}

=== SCENE CONTEXT ===
${scene.title}
${scene.summary}

INTENT FOR THIS DIALOGUE: ${intent}

=== CURRENT SCRIPT ===
${scene.scriptContent}

=== PROJECT THEMES ===
${config.themes.join(', ')}

${sessionContext ? `${sessionContext}\n` : ''}=== EXAMPLE OUTPUT (Follow this structure and quality level) ===
${DIALOGUE_GENERATION_EXAMPLE}

=== NOW GENERATE DIALOGUE FOR ${character.toUpperCase()} ===
Write 3 distinct dialogue options that achieve the intent: "${intent}"
CRITICAL: Maintain the character's established voice and speech patterns from the samples above.
${sessionContext ? 'IMPORTANT: Apply any session corrections listed above.' : ''}

FORMAT:
1. **Direct & Punchy**: Short, action-oriented, gets to the point.
2. **Subtextual/Deflective**: Hiding the true feeling with humor, deflection, or subtext.
3. **Thematic**: Explicitly tying into the project's central themes.

For each option, briefly explain WHY it fits this character's voice.
  `.trim();

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Increased for voice analysis
      }
    });
    return response.text || "No dialogue generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating dialogue.";
  }
};

// =============================================================================
// CHAT WITH SCRIPT DOCTOR
// =============================================================================

export const chatWithScriptDoctor = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  allScenes: Scene[],
  config: ProjectConfig,
  currentScene?: Scene
): Promise<string> => {
  // Use tiered context if a current scene is provided, otherwise use global context
  const storyContext = currentScene
    ? buildTieredContext(currentScene, allScenes, config)
    : buildGlobalContext(allScenes);

  // Build character roster for reference
  const characterRoster = config.characters
    .map(c => `${c.name} (${c.role}): ${c.description || 'No description'} | Arc: ${c.arc || 'Not defined'}`)
    .join('\n');

  // Get session memory context (without character filter for general chat)
  const sessionContext = buildSessionMemoryContext();

  try {
    const chat = getAI().chats.create({
      model: MODEL,
      history: history,
      config: {
        systemInstruction: `
You are the Lead Story Architect for "${config.title}".
Genre: ${config.genres.join(', ')}
Logline: ${config.logline}
Themes: ${config.themes.join(', ')}

=== CHARACTER ROSTER ===
${characterRoster}

=== STORY CONTEXT ===
${storyContext}

${sessionContext ? `${sessionContext}\n` : ''}=== YOUR EXPERTISE ===
You ensure emotional resonance, logical continuity, and thematic depth.
When answering, ALWAYS consider:
1. Does this contradict established story logic or character behavior?
2. Is the character voice consistent with their established patterns?
3. Is the pacing appropriate for this story position?
4. Does it serve the project's central themes?
5. Are there opportunities to deepen subtext or visual storytelling?
${sessionContext ? '6. Apply any session corrections the user has provided.' : ''}

${config.ai?.uniqueConstraints && config.ai.uniqueConstraints.length > 0 ? `
=== PROJECT-SPECIFIC RULES ===
${config.ai.uniqueConstraints.map(c => `- ${c}`).join('\n')}
` : ''}

${config.ai?.styleReferences && config.ai.styleReferences.length > 0 ? `
=== STYLE REFERENCES ===
Channel the sensibilities of: ${config.ai.styleReferences.join(', ')}
` : ''}

=== OUTPUT FORMAT ===
- Use Markdown for readability
- Be specific and actionable
- Reference character names and scene titles directly
- When suggesting dialogue, match established character voice

=== SPECIAL INSTRUCTIONS ===
If the user corrects you or expresses a preference (e.g., "actually, this character wouldn't say that" or "I prefer shorter dialogue"), acknowledge it and incorporate it into future responses. These corrections help you learn their vision for the project.
        `.trim(),
        thinkingConfig: { thinkingBudget: 4096 },
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error connecting to the AI.";
  }
};

// =============================================================================
// ALTERNATIVE BEAT GENERATION
// =============================================================================

export const generateAlternativeBeat = async (
  scene: Scene,
  beatDescription: string,
  allScenes: Scene[],
  config: ProjectConfig
): Promise<string> => {
  const storyContext = buildDetailedContext(scene, allScenes);

  const prompt = `
Role: Creative Screenwriter for "${config.title}" (${config.genres.join('/')}).
Task: Brainstorm 3 radically different alternative versions of a specific story beat.

CONTEXT:
${storyContext}

CURRENT SCENE: ${scene.title}
BEAT TO REIMAGINE: "${beatDescription}"

PROJECT THEMES: ${config.themes.join(', ')}

=== EXAMPLE OUTPUT (Follow this quality and creativity level) ===
${BEAT_ALTERNATIVES_EXAMPLE}

=== NOW REIMAGINE THIS BEAT: "${beatDescription}" ===
REQUIREMENTS:
- **Alternative A: High Octane** 🔥 - Focus on visual spectacle, action, or tension.
- **Alternative B: Character Conflict** 💔 - Focus on emotional friction, relationship dynamics.
- **Alternative C: The "Smart" Twist** 🧠 - A clever subversion of expectations.

Each alternative MUST:
1. Still serve the project's themes (${config.themes.slice(0, 3).join(', ')})
2. Maintain story logic and character consistency
3. Be specific and filmable (not vague concepts)
  `.trim();

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });
    return response.text || "No alternatives generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating alternatives.";
  }
};

// =============================================================================
// CONTINUITY CHECK
// =============================================================================

export const checkContinuity = async (
  scene: Scene,
  allScenes: Scene[],
  config: ProjectConfig
): Promise<string> => {
  const storyContext = buildGlobalContext(allScenes);

  const prompt = `
Role: Script Supervisor / Continuity Expert for "${config.title}".

FULL SCRIPT OUTLINE:
${storyContext}

SCENE TO CHECK: ${scene.id} - ${scene.title}
SCENE CONTENT:
${scene.scriptContent}

CONNECTIONS DEFINED:
${scene.connections?.map(c => `- ${c.type.toUpperCase()}: Links to ${c.targetSceneId} - ${c.description}`).join('\n') || 'None defined'}

TASK:
1. Check for logical continuity errors (props, locations, character knowledge)
2. Verify causal chains are intact
3. Flag any timeline inconsistencies
4. Suggest any missing setup/payoff connections

Format as Markdown with severity levels (Critical/Warning/Suggestion).
  `.trim();

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
      }
    });
    return response.text || "No continuity analysis generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error checking continuity.";
  }
};
