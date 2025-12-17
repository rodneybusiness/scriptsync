/**
 * Character Arc Tracker
 *
 * AI-powered character arc analysis and document generation.
 * Can both import arc tracking documents AND generate them from scripts.
 */

import { GoogleGenAI } from '@google/genai';
import { Sequence, Scene, CharacterConfig, ProjectConfig } from '../../config/types';

// =============================================================================
// AI INITIALIZATION
// =============================================================================

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const MODEL = 'gemini-2.0-flash';

// =============================================================================
// ARC TYPES
// =============================================================================

export interface CharacterArcPoint {
  sceneId: string;
  sceneTitle: string;
  arcStage: 'setup' | 'catalyst' | 'debate' | 'break_into_2' | 'midpoint' | 'low_point' | 'climax' | 'resolution' | 'other';
  emotionalState: string;
  want: string;          // What they want in this moment
  need: string;          // What they actually need (may be hidden)
  obstacle: string;      // What's blocking them
  change: string;        // How they've changed from previous appearance
  keyLine?: string;      // Memorable dialogue
  notes?: string;
}

export interface CharacterArc {
  characterName: string;
  role: 'main' | 'supporting' | 'minor';
  overallArc: string;    // One-sentence arc summary
  flaw: string;          // Core flaw at start
  transformation: string; // Who they become
  wantVsNeed: {
    want: string;        // External goal
    need: string;        // Internal need
  };
  arcPoints: CharacterArcPoint[];
  scenes: string[];      // Scene IDs where character appears
  totalAppearances: number;
  dialogueCount: number;
}

export interface ArcTrackingDocument {
  projectId: string;
  projectTitle: string;
  generatedAt: Date;
  characters: CharacterArc[];
  thematicConnections: {
    character1: string;
    character2: string;
    connection: string;
  }[];
}

// =============================================================================
// ARC GENERATION FROM SCRIPT
// =============================================================================

/**
 * Generate comprehensive character arcs from the script
 */
export const generateCharacterArcs = async (
  config: ProjectConfig,
  sequences: Sequence[]
): Promise<ArcTrackingDocument> => {
  const allScenes = sequences.flatMap(s => s.scenes);
  const mainCharacters = config.characters.filter(c => c.role === 'main');
  const supportingCharacters = config.characters.filter(c => c.role === 'supporting');

  const arcs: CharacterArc[] = [];

  // Process main characters with full arc analysis
  for (const char of mainCharacters) {
    const arc = await analyzeCharacterArc(char, allScenes, 'main');
    arcs.push(arc);
  }

  // Process supporting characters with lighter analysis
  for (const char of supportingCharacters) {
    const arc = await analyzeCharacterArc(char, allScenes, 'supporting');
    arcs.push(arc);
  }

  // Find thematic connections between characters
  const thematicConnections = await findThematicConnections(arcs);

  return {
    projectId: config.id,
    projectTitle: config.title,
    generatedAt: new Date(),
    characters: arcs,
    thematicConnections,
  };
};

/**
 * Analyze a single character's arc across all scenes
 */
const analyzeCharacterArc = async (
  character: CharacterConfig,
  scenes: Scene[],
  depth: 'main' | 'supporting'
): Promise<CharacterArc> => {
  // Find all scenes where character appears
  const charScenes = scenes.filter(scene =>
    scene.scriptContent.toUpperCase().includes(character.name.toUpperCase())
  );

  // Count dialogue instances
  const dialogueRegex = new RegExp(`^${character.name.toUpperCase()}\\s*(\\(.*\\))?$`, 'gm');
  const totalDialogue = scenes.reduce((count, scene) => {
    const matches = scene.scriptContent.match(dialogueRegex);
    return count + (matches?.length || 0);
  }, 0);

  // Build scene summaries for AI analysis
  const sceneSummaries = charScenes.map(s => ({
    id: s.id,
    title: s.title,
    summary: s.summary,
    content: s.scriptContent.substring(0, 500),
  }));

  const prompt = `
Analyze the character arc for ${character.name} across these screenplay scenes.

CHARACTER: ${character.name}
ROLE: ${character.role}
DESCRIPTION: ${character.description || 'Not provided'}

SCENES WHERE CHARACTER APPEARS (${charScenes.length} scenes):
${sceneSummaries.map(s => `
[${s.id}] ${s.title}
${s.summary}
Excerpt: ${s.content.substring(0, 300)}...
`).join('\n---\n')}

${depth === 'main' ? `
As a MAIN character, provide deep analysis:
` : `
As a SUPPORTING character, provide focused analysis:
`}

Return a JSON object:
{
  "overallArc": "One sentence describing their complete journey",
  "flaw": "Their core flaw at the beginning",
  "transformation": "Who they become by the end",
  "want": "Their external goal",
  "need": "Their internal need (often hidden/unconscious)",
  "arcPoints": [
    {
      "sceneId": "1.1",
      "arcStage": "setup|catalyst|debate|break_into_2|midpoint|low_point|climax|resolution|other",
      "emotionalState": "How they feel",
      "want": "What they want here",
      "need": "What they need here",
      "obstacle": "What blocks them",
      "change": "How they've changed since last appearance",
      "keyLine": "A memorable line if applicable"
    }
  ]
}

Arc stages should follow story structure where applicable.
Return ONLY valid JSON.
`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: depth === 'main' ? 2048 : 1024 },
      },
    });

    const result = JSON.parse(response.text || '{}');

    return {
      characterName: character.name,
      role: character.role,
      overallArc: result.overallArc || 'Arc pending analysis',
      flaw: result.flaw || 'Unknown',
      transformation: result.transformation || 'Unknown',
      wantVsNeed: {
        want: result.want || 'Unknown',
        need: result.need || 'Unknown',
      },
      arcPoints: (result.arcPoints || []).map((ap: CharacterArcPoint) => ({
        ...ap,
        sceneTitle: charScenes.find(s => s.id === ap.sceneId)?.title || 'Unknown Scene',
      })),
      scenes: charScenes.map(s => s.id),
      totalAppearances: charScenes.length,
      dialogueCount: totalDialogue,
    };
  } catch (error) {
    console.error(`Arc analysis failed for ${character.name}:`, error);
    return {
      characterName: character.name,
      role: character.role,
      overallArc: 'Analysis failed - please retry',
      flaw: 'Unknown',
      transformation: 'Unknown',
      wantVsNeed: { want: 'Unknown', need: 'Unknown' },
      arcPoints: [],
      scenes: charScenes.map(s => s.id),
      totalAppearances: charScenes.length,
      dialogueCount: totalDialogue,
    };
  }
};

/**
 * Find thematic connections between character arcs
 */
const findThematicConnections = async (
  arcs: CharacterArc[]
): Promise<{ character1: string; character2: string; connection: string }[]> => {
  if (arcs.length < 2) return [];

  const arcSummaries = arcs.map(a => ({
    name: a.characterName,
    arc: a.overallArc,
    flaw: a.flaw,
    want: a.wantVsNeed.want,
    need: a.wantVsNeed.need,
  }));

  const prompt = `
Analyze these character arcs and find thematic connections between them.

CHARACTERS:
${arcSummaries.map(a => `
${a.name}:
- Arc: ${a.arc}
- Flaw: ${a.flaw}
- Want: ${a.want}
- Need: ${a.need}
`).join('\n')}

Find meaningful connections like:
- Mirror relationships (similar journeys)
- Foil relationships (opposite journeys)
- Thematic parallels
- Complementary arcs

Return a JSON array:
[
  {"character1": "Name1", "character2": "Name2", "connection": "Description of their thematic connection"}
]

Find the 3-5 most significant connections. Return ONLY valid JSON array.
`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};

// =============================================================================
// ARC DOCUMENT IMPORT
// =============================================================================

/**
 * Parse an imported arc tracking document (CSV, markdown, etc.)
 */
export const parseArcDocument = (content: string, format: 'csv' | 'markdown' | 'json'): Partial<ArcTrackingDocument> => {
  switch (format) {
    case 'csv':
      return parseArcCSV(content);
    case 'markdown':
      return parseArcMarkdown(content);
    case 'json':
      return JSON.parse(content);
    default:
      return {};
  }
};

const parseArcCSV = (content: string): Partial<ArcTrackingDocument> => {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return {};

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  // Find relevant columns
  const charCol = headers.findIndex(h => h.includes('character') || h.includes('name'));
  const sceneCol = headers.findIndex(h => h.includes('scene'));
  const stageCol = headers.findIndex(h => h.includes('stage') || h.includes('arc'));
  const stateCol = headers.findIndex(h => h.includes('emotional') || h.includes('state') || h.includes('feeling'));
  const wantCol = headers.findIndex(h => h.includes('want') || h.includes('goal'));
  const obstacleCol = headers.findIndex(h => h.includes('obstacle') || h.includes('conflict'));

  const characterMap = new Map<string, CharacterArcPoint[]>();

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));

    const charName = cells[charCol] || 'Unknown';
    if (!characterMap.has(charName)) {
      characterMap.set(charName, []);
    }

    characterMap.get(charName)!.push({
      sceneId: cells[sceneCol] || String(i),
      sceneTitle: cells[sceneCol] || `Scene ${i}`,
      arcStage: (cells[stageCol]?.toLowerCase() as CharacterArcPoint['arcStage']) || 'other',
      emotionalState: cells[stateCol] || '',
      want: cells[wantCol] || '',
      need: '',
      obstacle: cells[obstacleCol] || '',
      change: '',
    });
  }

  const characters: CharacterArc[] = Array.from(characterMap.entries()).map(([name, points]) => ({
    characterName: name,
    role: 'supporting',
    overallArc: 'Imported from CSV',
    flaw: '',
    transformation: '',
    wantVsNeed: { want: '', need: '' },
    arcPoints: points,
    scenes: points.map(p => p.sceneId),
    totalAppearances: points.length,
    dialogueCount: 0,
  }));

  return { characters };
};

const parseArcMarkdown = (content: string): Partial<ArcTrackingDocument> => {
  const characters: CharacterArc[] = [];
  const sections = content.split(/^#+\s+/m).filter(s => s.trim());

  for (const section of sections) {
    const lines = section.split('\n');
    const charName = lines[0]?.trim();
    if (!charName) continue;

    const arcPoints: CharacterArcPoint[] = [];
    let currentPoint: Partial<CharacterArcPoint> = {};

    for (const line of lines.slice(1)) {
      const trimmed = line.trim();

      // Scene reference
      if (trimmed.match(/scene\s*\d/i)) {
        if (currentPoint.sceneId) {
          arcPoints.push(currentPoint as CharacterArcPoint);
        }
        const sceneMatch = trimmed.match(/(\d+(?:\.\d+)?)/);
        currentPoint = {
          sceneId: sceneMatch?.[1] || '',
          sceneTitle: trimmed,
          arcStage: 'other',
          emotionalState: '',
          want: '',
          need: '',
          obstacle: '',
          change: '',
        };
      }

      // Parse labeled fields
      if (trimmed.toLowerCase().startsWith('want:')) {
        currentPoint.want = trimmed.substring(5).trim();
      }
      if (trimmed.toLowerCase().startsWith('obstacle:')) {
        currentPoint.obstacle = trimmed.substring(9).trim();
      }
      if (trimmed.toLowerCase().startsWith('emotional:') || trimmed.toLowerCase().startsWith('feeling:')) {
        currentPoint.emotionalState = trimmed.split(':')[1]?.trim() || '';
      }
    }

    if (currentPoint.sceneId) {
      arcPoints.push(currentPoint as CharacterArcPoint);
    }

    if (arcPoints.length > 0) {
      characters.push({
        characterName: charName,
        role: 'supporting',
        overallArc: 'Imported from markdown',
        flaw: '',
        transformation: '',
        wantVsNeed: { want: '', need: '' },
        arcPoints,
        scenes: arcPoints.map(p => p.sceneId),
        totalAppearances: arcPoints.length,
        dialogueCount: 0,
      });
    }
  }

  return { characters };
};

// =============================================================================
// EXPORT TO VARIOUS FORMATS
// =============================================================================

/**
 * Export arc tracking document to markdown
 */
export const exportArcToMarkdown = (doc: ArcTrackingDocument): string => {
  let output = `# Character Arcs: ${doc.projectTitle}\n\n`;
  output += `Generated: ${doc.generatedAt.toLocaleDateString()}\n\n`;
  output += `---\n\n`;

  for (const char of doc.characters) {
    output += `## ${char.characterName} (${char.role})\n\n`;
    output += `**Overall Arc:** ${char.overallArc}\n\n`;
    output += `**Flaw:** ${char.flaw}\n\n`;
    output += `**Transformation:** ${char.transformation}\n\n`;
    output += `**Want:** ${char.wantVsNeed.want}\n\n`;
    output += `**Need:** ${char.wantVsNeed.need}\n\n`;
    output += `**Appearances:** ${char.totalAppearances} scenes, ${char.dialogueCount} dialogue instances\n\n`;

    if (char.arcPoints.length > 0) {
      output += `### Arc Progression\n\n`;
      output += `| Scene | Stage | Emotional State | Want | Obstacle |\n`;
      output += `|-------|-------|-----------------|------|----------|\n`;

      for (const point of char.arcPoints) {
        output += `| ${point.sceneId} | ${point.arcStage} | ${point.emotionalState} | ${point.want} | ${point.obstacle} |\n`;
      }
      output += `\n`;

      if (char.arcPoints.some(p => p.keyLine)) {
        output += `### Key Lines\n\n`;
        for (const point of char.arcPoints.filter(p => p.keyLine)) {
          output += `- **Scene ${point.sceneId}:** "${point.keyLine}"\n`;
        }
        output += `\n`;
      }
    }

    output += `---\n\n`;
  }

  if (doc.thematicConnections.length > 0) {
    output += `## Thematic Connections\n\n`;
    for (const conn of doc.thematicConnections) {
      output += `- **${conn.character1} ↔ ${conn.character2}:** ${conn.connection}\n`;
    }
  }

  return output;
};

/**
 * Export arc tracking document to CSV
 */
export const exportArcToCSV = (doc: ArcTrackingDocument): string => {
  let output = 'Character,Role,Scene,Stage,Emotional State,Want,Need,Obstacle,Change,Key Line\n';

  for (const char of doc.characters) {
    for (const point of char.arcPoints) {
      const row = [
        char.characterName,
        char.role,
        point.sceneId,
        point.arcStage,
        point.emotionalState,
        point.want,
        point.need,
        point.obstacle,
        point.change,
        point.keyLine || '',
      ].map(cell => `"${(cell || '').replace(/"/g, '""')}"`);

      output += row.join(',') + '\n';
    }
  }

  return output;
};
