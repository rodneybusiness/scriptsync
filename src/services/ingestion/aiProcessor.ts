/**
 * AI-Powered Document Processor
 *
 * Uses Gemini to intelligently process and enrich parsed documents
 * into the exact format ScriptSync needs.
 */

import { GoogleGenAI } from '@google/genai';
import {
  ParsedScript,
  ParsedScene,
  ParsedNotes,
  ParsedBeatSheet,
  AIProcessingConfig,
  QCReport,
  QCIssue,
} from './types';
import {
  ProjectConfig,
  Sequence,
  Scene,
  Beat,
  SceneNote,
  NoteType,
  CharacterConfig,
  SceneConnection,
} from '../../config/types';

// =============================================================================
// AI INITIALIZATION
// =============================================================================

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const MODEL = 'gemini-2.0-flash';

// =============================================================================
// PROJECT CONFIG GENERATION
// =============================================================================

/**
 * Generate a complete ProjectConfig from parsed documents
 */
export const generateProjectConfig = async (
  projectName: string,
  parsedScript: ParsedScript,
  parsedNotes?: ParsedNotes,
  parsedBeatSheet?: ParsedBeatSheet
): Promise<ProjectConfig> => {
  const prompt = `
You are an expert script analyst. Analyze the following screenplay data and generate a project configuration.

SCRIPT TITLE: ${parsedScript.title}
AUTHOR: ${parsedScript.author || 'Unknown'}
TOTAL SCENES: ${parsedScript.scenes.length}
ESTIMATED PAGES: ${parsedScript.estimatedPageCount}

CHARACTERS FOUND:
${parsedScript.allCharacters.join(', ')}

SAMPLE SCENES (first 3):
${parsedScript.scenes.slice(0, 3).map(s => `- ${s.slugline}\n  Characters: ${s.characters.join(', ')}`).join('\n')}

${parsedBeatSheet ? `
BEAT SHEET DATA:
${parsedBeatSheet.sequences.map(seq => `${seq.name}: ${seq.beats.length} beats`).join('\n')}
` : ''}

${parsedNotes ? `
NOTES FOUND: ${parsedNotes.items.length} items
Sample: ${parsedNotes.items.slice(0, 3).map(n => n.content.substring(0, 100)).join(' | ')}
` : ''}

Generate a JSON object with this EXACT structure:
{
  "title": "Display title for the project",
  "description": "2-3 sentence description of the screenplay",
  "genres": ["Genre1", "Genre2"],
  "logline": "One-sentence logline",
  "themes": ["Theme1", "Theme2", "Theme3"],
  "characters": [
    {"name": "CHARACTER NAME", "role": "main|supporting|minor", "description": "Brief description"}
  ],
  "ai": {
    "styleReferences": ["Writer/Director style reference"],
    "toneDescriptor": "Brief tone description for AI context",
    "uniqueConstraints": ["Any special rules for this story"]
  },
  "trackingCategories": ["Plot", "Character Arc", "Theme", "Setup", "Payoff"],
  "noteAuthors": ["RR"]
}

Classify characters as:
- "main": Characters with significant screen time and arcs (usually 1-4)
- "supporting": Important recurring characters
- "minor": Brief appearances

Return ONLY valid JSON, no markdown formatting.
`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');

    // Merge with defaults and ensure ID
    const config: ProjectConfig = {
      id: projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: result.title || parsedScript.title,
      description: result.description || '',
      genres: result.genres || ['Drama'],
      logline: result.logline || '',
      characters: (result.characters || []).map((c: CharacterConfig) => ({
        name: c.name,
        role: c.role || 'supporting',
        description: c.description,
      })),
      themes: result.themes || [],
      ai: {
        styleReferences: result.ai?.styleReferences || [],
        toneDescriptor: result.ai?.toneDescriptor || 'Professional screenwriter',
        uniqueConstraints: result.ai?.uniqueConstraints || [],
      },
      trackingCategories: result.trackingCategories || ['Plot', 'Character Arc', 'Theme', 'Setup', 'Payoff'],
      noteAuthors: result.noteAuthors || ['USER'],
      meta: {
        version: '1.0.0',
        author: parsedScript.author,
        createdAt: new Date(),
      },
    };

    return config;
  } catch (error) {
    console.error('AI config generation failed:', error);
    // Return a basic config
    return {
      id: projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: parsedScript.title,
      description: 'Imported screenplay',
      genres: ['Drama'],
      logline: '',
      characters: parsedScript.allCharacters.slice(0, 10).map(name => ({
        name,
        role: 'supporting' as const,
      })),
      themes: [],
      ai: {
        styleReferences: [],
        toneDescriptor: 'Screenwriter',
        uniqueConstraints: [],
      },
      trackingCategories: ['Plot', 'Character Arc', 'Theme', 'Setup', 'Payoff'],
      noteAuthors: ['USER'],
    };
  }
};

// =============================================================================
// SEQUENCE GENERATION
// =============================================================================

/**
 * Convert parsed script into Sequences with AI-enhanced beats and summaries
 */
export const generateSequences = async (
  parsedScript: ParsedScript,
  parsedBeatSheet?: ParsedBeatSheet,
  parsedNotes?: ParsedNotes,
  config?: AIProcessingConfig
): Promise<Sequence[]> => {
  // Group scenes into sequences (default: ~8-12 scenes per sequence)
  const scenesPerSequence = Math.ceil(parsedScript.scenes.length / Math.max(1, Math.ceil(parsedScript.scenes.length / 10)));
  const sequenceCount = Math.ceil(parsedScript.scenes.length / scenesPerSequence);

  // If we have a beat sheet, use its structure
  if (parsedBeatSheet && parsedBeatSheet.sequences.length > 0) {
    return await generateSequencesFromBeatSheet(parsedScript, parsedBeatSheet, parsedNotes);
  }

  // Otherwise, use AI to analyze and structure
  const sequences: Sequence[] = [];

  for (let seqIdx = 0; seqIdx < sequenceCount; seqIdx++) {
    const startIdx = seqIdx * scenesPerSequence;
    const endIdx = Math.min(startIdx + scenesPerSequence, parsedScript.scenes.length);
    const seqScenes = parsedScript.scenes.slice(startIdx, endIdx);

    const seqId = `SEQ_${seqIdx + 1}`;

    // Generate sequence metadata with AI
    const seqMetadata = await generateSequenceMetadata(seqScenes, seqIdx + 1, sequenceCount);

    // Convert scenes to ScriptSync format
    const scenes: Scene[] = await Promise.all(
      seqScenes.map((ps, idx) =>
        convertParsedScene(ps, seqId, startIdx + idx + 1, parsedNotes, config)
      )
    );

    sequences.push({
      id: seqId,
      title: seqMetadata.title,
      dramaticQuestion: seqMetadata.dramaticQuestion,
      climax: seqMetadata.climax,
      resolution: seqMetadata.resolution,
      scenes,
    });
  }

  return sequences;
};

/**
 * Generate sequences using beat sheet structure as guide
 */
const generateSequencesFromBeatSheet = async (
  parsedScript: ParsedScript,
  beatSheet: ParsedBeatSheet,
  parsedNotes?: ParsedNotes
): Promise<Sequence[]> => {
  const sequences: Sequence[] = [];
  const scenesPerSeq = Math.ceil(parsedScript.scenes.length / beatSheet.sequences.length);

  for (let seqIdx = 0; seqIdx < beatSheet.sequences.length; seqIdx++) {
    const bsSeq = beatSheet.sequences[seqIdx];
    const seqId = `SEQ_${seqIdx + 1}`;

    // Map scenes to this sequence
    const startIdx = seqIdx * scenesPerSeq;
    const endIdx = Math.min(startIdx + scenesPerSeq, parsedScript.scenes.length);
    const seqScenes = parsedScript.scenes.slice(startIdx, endIdx);

    // Convert scenes, using beat sheet beats
    const scenes: Scene[] = await Promise.all(
      seqScenes.map(async (ps, idx) => {
        const sceneNum = startIdx + idx + 1;
        const scene = await convertParsedScene(ps, seqId, sceneNum, parsedNotes);

        // Try to match beats from beat sheet
        const matchingBeats = bsSeq.beats.filter(b =>
          b.scene?.includes(String(sceneNum)) ||
          b.description.toLowerCase().includes(ps.slugline.toLowerCase().substring(0, 20))
        );

        if (matchingBeats.length > 0) {
          scene.beats = matchingBeats.map((b, i) => ({
            id: `${scene.id}-b${i + 1}`,
            description: b.description,
            completed: false,
          }));
        }

        return scene;
      })
    );

    sequences.push({
      id: seqId,
      title: `SEQUENCE ${seqIdx + 1}: ${bsSeq.name.toUpperCase()}`,
      dramaticQuestion: bsSeq.dramaticQuestion || `What happens in ${bsSeq.name}?`,
      climax: 'To be determined',
      resolution: 'To be determined',
      scenes,
    });
  }

  return sequences;
};

// =============================================================================
// SCENE CONVERSION
// =============================================================================

/**
 * Convert a ParsedScene to a full Scene with AI-generated beats and summary
 */
const convertParsedScene = async (
  parsed: ParsedScene,
  sequenceId: string,
  sceneNumber: number,
  notes?: ParsedNotes,
  config?: AIProcessingConfig
): Promise<Scene> => {
  const sceneId = `${sceneNumber}`;

  // Generate summary and beats with AI
  let summary = '';
  let beats: Beat[] = [];

  if (!config || config.aiBeatGeneration) {
    const analysis = await analyzeSceneContent(parsed.content, parsed.characters);
    summary = analysis.summary;
    beats = analysis.beats.map((b, i) => ({
      id: `${sceneId}-b${i + 1}`,
      description: b,
      completed: false,
    }));
  } else {
    summary = `Scene at ${parsed.slugline}`;
    beats = parsed.estimatedBeats.map((b, i) => ({
      id: `${sceneId}-b${i + 1}`,
      description: b,
      completed: false,
    }));
  }

  // Find matching notes
  const sceneNotes: SceneNote[] = [];
  if (notes) {
    const matchingNotes = notes.items.filter(n =>
      n.targetScene === sceneId ||
      n.targetScene === String(sceneNumber) ||
      n.content.toLowerCase().includes(parsed.slugline.toLowerCase().substring(0, 15))
    );

    matchingNotes.forEach((n, i) => {
      sceneNotes.push({
        id: `n${sceneId}-${i + 1}`,
        author: n.author || 'USER',
        content: n.content,
        type: mapNoteType(n.type),
        timestamp: new Date(),
      });
    });
  }

  return {
    id: sceneId,
    sequenceId,
    title: `${sceneNumber}: ${parsed.slugline.replace(/^(INT\.|EXT\.|I\/E\.)\s*/, '').substring(0, 40)}`,
    pageNumber: parsed.pageStart || sceneNumber,
    scriptContent: parsed.content.trim(),
    beats,
    notes: sceneNotes,
    tracking: [],
    summary,
    connections: [],
    location: parsed.slugline,
  };
};

const mapNoteType = (type?: string): NoteType => {
  switch (type) {
    case 'rewrite':
      return NoteType.REWRITE;
    case 'character':
      return NoteType.CHARACTER;
    case 'logic':
      return NoteType.LOGIC;
    case 'theme':
      return NoteType.THEME;
    default:
      return NoteType.REWRITE;
  }
};

// =============================================================================
// AI ANALYSIS HELPERS
// =============================================================================

/**
 * Generate sequence metadata using AI
 */
const generateSequenceMetadata = async (
  scenes: ParsedScene[],
  seqNumber: number,
  totalSequences: number
): Promise<{ title: string; dramaticQuestion: string; climax: string; resolution: string }> => {
  const sceneList = scenes.map(s => s.slugline).join('\n');

  const prompt = `
Analyze these screenplay scenes and generate sequence metadata.

SEQUENCE ${seqNumber} of ${totalSequences}
SCENES:
${sceneList}

Generate a JSON object:
{
  "title": "SEQUENCE ${seqNumber}: [DESCRIPTIVE NAME IN CAPS]",
  "dramaticQuestion": "The central question driving this sequence",
  "climax": "The high point or turning point",
  "resolution": "How the sequence resolves"
}

Return ONLY valid JSON.
`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text || '{}');
  } catch {
    return {
      title: `SEQUENCE ${seqNumber}: ACT ${seqNumber}`,
      dramaticQuestion: 'What happens next?',
      climax: 'To be determined',
      resolution: 'To be determined',
    };
  }
};

/**
 * Analyze scene content for summary and beats
 */
const analyzeSceneContent = async (
  content: string,
  characters: string[]
): Promise<{ summary: string; beats: string[] }> => {
  const prompt = `
Analyze this screenplay scene and extract:

SCENE CONTENT:
${content.substring(0, 2000)}

CHARACTERS IN SCENE: ${characters.join(', ')}

Generate a JSON object:
{
  "summary": "One sentence summary of what happens",
  "beats": ["Beat 1 description", "Beat 2 description", "Beat 3 description"]
}

Beats should be specific story moments or actions, not vague descriptions.
Return ONLY valid JSON.
`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text || '{}');
  } catch {
    return {
      summary: 'Scene summary pending analysis',
      beats: ['Scene begins', 'Action develops', 'Scene ends'],
    };
  }
};

// =============================================================================
// CONNECTION MAPPING
// =============================================================================

/**
 * Use AI to find thematic and causal connections between scenes
 */
export const generateConnections = async (
  sequences: Sequence[]
): Promise<Sequence[]> => {
  const allScenes = sequences.flatMap(s => s.scenes);

  // Build scene summary list for AI
  const sceneSummaries = allScenes.map(s => ({
    id: s.id,
    title: s.title,
    summary: s.summary,
  }));

  const prompt = `
Analyze these screenplay scenes and identify connections between them.

SCENES:
${sceneSummaries.map(s => `[${s.id}] ${s.title}: ${s.summary}`).join('\n')}

Find connections of these types:
- causal: Scene A directly causes Scene B
- echo: Similar imagery, dialogue, or situation
- foreshadow: Scene A sets up something in Scene B
- callback: Scene B references something from Scene A
- thematic: Scenes share thematic resonance

Return a JSON array of connections:
[
  {"sourceId": "1", "targetId": "5", "type": "foreshadow", "description": "Setup of X pays off here"}
]

Find the 10-15 most significant connections. Return ONLY valid JSON array.
`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const connections = JSON.parse(response.text || '[]') as Array<{
      sourceId: string;
      targetId: string;
      type: SceneConnection['type'];
      description: string;
    }>;

    // Apply connections to scenes
    for (const conn of connections) {
      const sourceScene = allScenes.find(s => s.id === conn.sourceId);
      if (sourceScene) {
        if (!sourceScene.connections) sourceScene.connections = [];
        sourceScene.connections.push({
          targetSceneId: conn.targetId,
          type: conn.type,
          description: conn.description,
        });
      }
    }
  } catch (error) {
    console.error('Connection mapping failed:', error);
  }

  return sequences;
};

// =============================================================================
// QC VALIDATION
// =============================================================================

/**
 * Run quality control checks on processed data
 */
export const runQualityControl = async (
  config: ProjectConfig,
  sequences: Sequence[]
): Promise<QCReport> => {
  const issues: QCIssue[] = [];
  const allScenes = sequences.flatMap(s => s.scenes);

  // Check 1: All characters have roles
  const scenechars = new Set(allScenes.flatMap(s =>
    s.scriptContent.match(/^[A-Z][A-Z\s\.']+$/gm) || []
  ));
  const configChars = new Set(config.characters.map(c => c.name.toUpperCase()));

  for (const char of scenechars) {
    if (!configChars.has(char) && char.length < 30) {
      issues.push({
        id: `char-${char}`,
        severity: 'warning',
        category: 'character',
        message: `Character "${char}" found in script but not in config`,
        suggestion: 'Add to character list or verify spelling',
        autoFixable: true,
      });
    }
  }

  // Check 2: Scenes have beats
  for (const scene of allScenes) {
    if (scene.beats.length === 0) {
      issues.push({
        id: `beats-${scene.id}`,
        severity: 'warning',
        category: 'structure',
        message: `Scene ${scene.id} has no beats defined`,
        location: scene.id,
        suggestion: 'Run AI beat analysis',
        autoFixable: true,
      });
    }
  }

  // Check 3: Scenes have content
  for (const scene of allScenes) {
    if (!scene.scriptContent || scene.scriptContent.length < 50) {
      issues.push({
        id: `content-${scene.id}`,
        severity: 'error',
        category: 'data',
        message: `Scene ${scene.id} has little or no script content`,
        location: scene.id,
        autoFixable: false,
      });
    }
  }

  // Check 4: Sequence structure
  if (sequences.length === 0) {
    issues.push({
      id: 'no-sequences',
      severity: 'error',
      category: 'structure',
      message: 'No sequences created',
      autoFixable: false,
    });
  }

  // Calculate confidence score
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const confidence = Math.max(0, 100 - (errorCount * 20) - (warningCount * 5));

  return {
    documentId: config.id,
    timestamp: new Date(),
    issues,
    stats: {
      totalScenes: allScenes.length,
      totalCharacters: config.characters.length,
      totalBeats: allScenes.reduce((sum, s) => sum + s.beats.length, 0),
      totalNotes: allScenes.reduce((sum, s) => sum + s.notes.length, 0),
      missingData: issues.filter(i => i.category === 'data').map(i => i.message),
    },
    confidence,
    approved: confidence >= 70 && errorCount === 0,
  };
};
