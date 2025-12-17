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

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const MODEL = "gemini-2.0-flash";

// =============================================================================
// CONTEXT BUILDERS
// =============================================================================

/**
 * Build a high-level outline of all scenes
 */
const buildGlobalContext = (allScenes: Scene[]): string => {
  return allScenes.map(s => `[${s.id}] ${s.title}: ${s.summary}`).join('\n');
};

/**
 * Build detailed context including adjacent scenes
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

/**
 * Build project-specific AI context from config
 */
const buildProjectContext = (config: ProjectConfig): string => {
  const genres = config.genres.join(', ');
  const themes = config.themes.join(', ');
  const constraints = config.ai.uniqueConstraints.length > 0
    ? `\nUNIQUE CONSTRAINTS:\n${config.ai.uniqueConstraints.map(c => `- ${c}`).join('\n')}`
    : '';

  return `
PROJECT: "${config.title}"
GENRE: ${genres}
LOGLINE: ${config.logline}
THEMES: ${themes}
${constraints}
${config.ai.customInstructions ? `\nADDITIONAL NOTES:\n${config.ai.customInstructions}` : ''}
  `.trim();
};

// =============================================================================
// SCENE ANALYSIS
// =============================================================================

export const analyzeSceneGap = async (
  scene: Scene,
  allScenes: Scene[],
  config: ProjectConfig
): Promise<string> => {
  const projectContext = buildProjectContext(config);
  const storyContext = buildDetailedContext(scene, allScenes);

  const prompt = `
Role: Elite Hollywood Script Doctor (${config.ai.toneDescriptor}).
Style Reference: ${config.ai.styleReferences.join(', ') || 'Professional screenwriter'}

PROJECT CONTEXT:
${projectContext}

STORY CONTEXT:
${storyContext}

CURRENT SCENE DATA:
Title: ${scene.title}
Summary: ${scene.summary}
Intended Beats: ${scene.beats.map(b => b.description).join(' -> ')}
Tracking Notes: ${scene.tracking.map(t => `${t.category}: ${t.description}`).join(', ')}

SCRIPT CONTENT:
"${scene.scriptContent}"

INSTRUCTIONS:
1. Compare the SCRIPT CONTENT against the INTENDED BEATS. Are the beats effectively realized?
2. Check for "On The Nose" dialogue. Suggest subtextual improvements.
3. Analyze the pacing relative to the scene's position in the sequence.
4. Provide 3 high-impact, specific suggestions.

FORMATTING:
- Use Markdown headers (###) for sections.
- Use bolding (**text**) for emphasis.
- Be concise but deep.
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
  _allScenes: Scene[],
  config: ProjectConfig
): Promise<string> => {
  const styleRef = config.ai.styleReferences.join(' / ') || 'Natural, character-driven';

  const prompt = `
Role: Screenwriter (${styleRef} style).
Project: "${config.title}" (${config.genres.join('/')}).

SCENE CONTEXT:
${scene.title}
${scene.summary}

CHARACTER: ${character}
INTENT: ${intent}

CURRENT SCRIPT:
${scene.scriptContent}

PROJECT THEMES: ${config.themes.join(', ')}

TASK:
Write 3 distinct dialogue options for ${character} that achieve the intent.

OPTIONS:
1. **Direct & Punchy**: Short, action-oriented.
2. **Subtextual/Deflective**: Hiding the true feeling with humor or deflection.
3. **Thematic**: Tying into the project's central themes.

Output in Markdown.
  `.trim();

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
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
  config: ProjectConfig
): Promise<string> => {
  const globalContext = buildGlobalContext(allScenes);

  try {
    const chat = getAI().chats.create({
      model: MODEL,
      history: history,
      config: {
        systemInstruction: `
You are the Lead Story Architect for "${config.title}".
Genre: ${config.genres.join(', ')}
Themes: ${config.themes.join(', ')}

You have deep knowledge of the entire script structure:
${globalContext}

Your goal is to ensure emotional resonance and logical continuity.
When answering, always consider:
1. Does this contradict established story logic?
2. Is the character voice consistent?
3. Is the pacing tight?
4. Does it serve the project's themes?

${config.ai.uniqueConstraints.length > 0 ? `
SPECIAL CONSIDERATIONS FOR THIS PROJECT:
${config.ai.uniqueConstraints.map(c => `- ${c}`).join('\n')}
` : ''}

Format your answers with Markdown for readability. Use lists and bold text freely.
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

REQUIREMENTS:
- Alternative A: High Octane (Focus on visual spectacle or tension).
- Alternative B: Character Conflict (Focus on emotional friction).
- Alternative C: The "Smart" Twist (A clever subversion of expectations).

Each alternative should still serve the project's themes and maintain story logic.

Format as a Markdown list with bold headers.
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
