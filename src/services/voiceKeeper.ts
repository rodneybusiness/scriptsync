/**
 * Voice Keeper - Character voice consistency agent
 *
 * Lightweight agent that monitors dialogue changes and flags
 * when a character sounds "off" from their established voice.
 * Uses Haiku for speed (~200ms response time).
 */

import { memoryPalace, CharacterVoice, Suggestion } from './memoryPalace';
import { ScriptChange } from '../hooks/useScriptMembrane';
import { Scene } from '../config/types';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

interface VoiceCheckResult {
  isConsistent: boolean;
  confidence: number; // 0-1
  issue?: string;
  suggestion?: string;
  characterName: string;
}

// Extract dialogue blocks from script content
function extractDialogueBlocks(content: string): { character: string; dialogue: string; lineStart: number }[] {
  const blocks: { character: string; dialogue: string; lineStart: number }[] = [];
  const lines = content.split('\n');

  let currentCharacter: string | null = null;
  let currentDialogue: string[] = [];
  let dialogueStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Character name line (all caps, not a scene heading)
    if (/^[A-Z][A-Z\s]+$/.test(trimmed) && !trimmed.startsWith('INT.') && !trimmed.startsWith('EXT.')) {
      // Save previous dialogue block
      if (currentCharacter && currentDialogue.length > 0) {
        blocks.push({
          character: currentCharacter,
          dialogue: currentDialogue.join(' ').trim(),
          lineStart: dialogueStartLine,
        });
      }

      currentCharacter = trimmed;
      currentDialogue = [];
      dialogueStartLine = i + 1;
    }
    // Dialogue line (indented, not empty)
    else if (currentCharacter && trimmed && !trimmed.startsWith('(')) {
      currentDialogue.push(trimmed);
    }
    // Empty line or parenthetical ends dialogue
    else if (currentCharacter && (!trimmed || trimmed.startsWith('('))) {
      if (currentDialogue.length > 0) {
        blocks.push({
          character: currentCharacter,
          dialogue: currentDialogue.join(' ').trim(),
          lineStart: dialogueStartLine,
        });
        currentDialogue = [];
      }
      if (!trimmed) currentCharacter = null;
    }
  }

  // Don't forget last block
  if (currentCharacter && currentDialogue.length > 0) {
    blocks.push({
      character: currentCharacter,
      dialogue: currentDialogue.join(' ').trim(),
      lineStart: dialogueStartLine,
    });
  }

  return blocks;
}

// Build a voice profile from dialogue samples
function buildVoiceProfile(voice: CharacterVoice): string {
  const parts: string[] = [];

  if (voice.dialogueSamples.length > 0) {
    parts.push(`Example dialogue:\n${voice.dialogueSamples.slice(0, 3).map(d => `- "${d}"`).join('\n')}`);
  }

  if (voice.verbalTics.length > 0) {
    parts.push(`Verbal tics: ${voice.verbalTics.join(', ')}`);
  }

  if (voice.avoidPatterns.length > 0) {
    parts.push(`Would NEVER say: ${voice.avoidPatterns.join(', ')}`);
  }

  parts.push(`Style: ${voice.vocabularyTier}, ${voice.usesContractions ? 'uses' : 'avoids'} contractions`);

  if (voice.corrections.length > 0) {
    const recentCorrections = voice.corrections.slice(-3);
    parts.push(`Recent corrections:\n${recentCorrections.map(c => `- "${c.original}" → feedback: "${c.feedback}"`).join('\n')}`);
  }

  return parts.join('\n\n');
}

// Check voice consistency using Claude Haiku
async function checkVoiceWithAI(
  characterName: string,
  dialogue: string,
  voiceProfile: string,
  projectContext: string
): Promise<VoiceCheckResult> {
  if (!ANTHROPIC_API_KEY) {
    return {
      isConsistent: true,
      confidence: 0,
      characterName,
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 256,
        temperature: 0.3,
        system: `You are a script supervisor checking character voice consistency. Be concise.
Respond in JSON format: {"consistent": boolean, "confidence": 0-1, "issue": "brief issue if any", "suggestion": "brief fix if needed"}`,
        messages: [{
          role: 'user',
          content: `Project: ${projectContext}

CHARACTER: ${characterName}
VOICE PROFILE:
${voiceProfile}

NEW DIALOGUE TO CHECK:
"${dialogue}"

Does this dialogue sound like ${characterName}? Check vocabulary, tone, and patterns against their established voice.`,
        }],
      }),
    });

    if (!response.ok) {
      console.error('Voice check API error:', response.status);
      return { isConsistent: true, confidence: 0, characterName };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        isConsistent: parsed.consistent,
        confidence: parsed.confidence || 0.5,
        issue: parsed.issue,
        suggestion: parsed.suggestion,
        characterName,
      };
    }
  } catch (error) {
    console.error('Voice check failed:', error);
  }

  return { isConsistent: true, confidence: 0, characterName };
}

// Main voice keeper class
class VoiceKeeperAgent {
  private projectId: string = '';
  private projectContext: string = '';
  private isProcessing: boolean = false;
  private pendingChecks: Map<string, NodeJS.Timeout> = new Map();

  setProject(projectId: string, context: string) {
    this.projectId = projectId;
    this.projectContext = context;
  }

  // Process script changes from the membrane
  async processChanges(
    changes: ScriptChange[],
    allScenes: Scene[]
  ): Promise<Suggestion[]> {
    if (this.isProcessing || !this.projectId) return [];
    this.isProcessing = true;

    const suggestions: Suggestion[] = [];

    try {
      // Get all dialogue changes
      const dialogueChanges = changes.filter(c => c.field === 'scriptContent');

      for (const change of dialogueChanges) {
        // Find the scene
        const scene = allScenes.find(s => s.id === change.sceneId);
        if (!scene) continue;

        // Extract dialogue blocks from new content
        const dialogueBlocks = extractDialogueBlocks(change.newValue);

        // Check each character's dialogue
        for (const block of dialogueBlocks) {
          // Get or create voice profile
          let voice = await memoryPalace.getCharacterVoice(this.projectId, block.character);

          if (!voice) {
            // Create new voice profile from this dialogue
            voice = {
              characterName: block.character,
              projectId: this.projectId,
              updatedAt: Date.now(),
              avgSentenceLength: block.dialogue.split(/[.!?]/).length,
              usesContractions: /\w'\w/.test(block.dialogue),
              vocabularyTier: 'mixed',
              verbalTics: [],
              avoidPatterns: [],
              dialogueSamples: [block.dialogue],
              corrections: [],
            };
            await memoryPalace.saveCharacterVoice(voice);
            continue; // First time seeing this character, no check needed
          }

          // Add to dialogue samples if novel
          if (!voice.dialogueSamples.includes(block.dialogue)) {
            voice.dialogueSamples.push(block.dialogue);
            if (voice.dialogueSamples.length > 10) {
              voice.dialogueSamples = voice.dialogueSamples.slice(-10);
            }
            await memoryPalace.saveCharacterVoice(voice);
          }

          // Only check if we have enough history
          if (voice.dialogueSamples.length < 3 && voice.corrections.length === 0) {
            continue;
          }

          // Build voice profile and check
          const voiceProfile = buildVoiceProfile(voice);
          const result = await checkVoiceWithAI(
            block.character,
            block.dialogue,
            voiceProfile,
            this.projectContext
          );

          // Create suggestion if voice is inconsistent
          if (!result.isConsistent && result.confidence > 0.6) {
            const suggestionId = await memoryPalace.addSuggestion({
              projectId: this.projectId,
              sceneId: change.sceneId,
              lineNumber: block.lineStart,
              type: 'voice',
              severity: result.confidence > 0.8 ? 'warning' : 'info',
              message: result.issue || `${block.character}'s dialogue may be inconsistent with their voice.`,
              suggestion: result.suggestion,
              agentId: 'voice-keeper',
            });

            const fullSuggestion = await memoryPalace.getPendingSuggestions(this.projectId);
            const newSuggestion = fullSuggestion.find(s => s.id === suggestionId);
            if (newSuggestion) {
              suggestions.push(newSuggestion);
            }
          }
        }
      }
    } catch (error) {
      console.error('Voice keeper processing failed:', error);
    }

    this.isProcessing = false;
    return suggestions;
  }

  // Learn from user correction
  async learnCorrection(
    characterName: string,
    originalDialogue: string,
    feedback: string
  ): Promise<void> {
    await memoryPalace.addVoiceCorrection(
      this.projectId,
      characterName,
      originalDialogue,
      feedback
    );
  }

  // Manually add an avoid pattern
  async addAvoidPattern(characterName: string, pattern: string): Promise<void> {
    const voice = await memoryPalace.getCharacterVoice(this.projectId, characterName);
    if (voice) {
      if (!voice.avoidPatterns.includes(pattern)) {
        voice.avoidPatterns.push(pattern);
        await memoryPalace.saveCharacterVoice(voice);
      }
    }
  }

  // Manually add a verbal tic
  async addVerbalTic(characterName: string, tic: string): Promise<void> {
    const voice = await memoryPalace.getCharacterVoice(this.projectId, characterName);
    if (voice) {
      if (!voice.verbalTics.includes(tic)) {
        voice.verbalTics.push(tic);
        await memoryPalace.saveCharacterVoice(voice);
      }
    }
  }
}

// Singleton instance
export const voiceKeeper = new VoiceKeeperAgent();
