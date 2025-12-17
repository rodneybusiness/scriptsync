/**
 * Document Parsers
 *
 * Parse various document formats into normalized structures.
 */

import { DocumentType, ParsedScript, ParsedScene, ParsedNotes, ParsedBeatSheet } from './types';

// =============================================================================
// FOUNTAIN PARSER
// =============================================================================

export const parseFountain = (content: string): ParsedScript => {
  const lines = content.split('\n');
  const scenes: ParsedScene[] = [];
  let currentScene: ParsedScene | null = null;
  let title = 'Untitled';
  let author: string | undefined;
  const allCharacters = new Set<string>();

  // Parse title page if present
  const titleMatch = content.match(/Title:\s*(.+)/i);
  const authorMatch = content.match(/Author:\s*(.+)/i);
  if (titleMatch) title = titleMatch[1].trim();
  if (authorMatch) author = authorMatch[1].trim();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Scene heading detection
    if (/^(INT\.|EXT\.|I\/E\.|INT\/EXT)/.test(trimmed.toUpperCase())) {
      // Save previous scene
      if (currentScene) {
        scenes.push(currentScene);
      }

      currentScene = {
        slugline: trimmed,
        content: trimmed + '\n',
        characters: [],
        estimatedBeats: [],
      };
      continue;
    }

    // Character detection (all caps line followed by dialogue)
    const charMatch = trimmed.match(/^([A-Z][A-Z\s\.']+)(\s*\(.*\))?$/);
    if (charMatch && currentScene && trimmed.length < 50) {
      const charName = charMatch[1].trim();
      // Exclude common non-character caps
      if (!['CUT TO', 'FADE IN', 'FADE OUT', 'DISSOLVE TO', 'SMASH CUT', 'THE END'].includes(charName)) {
        allCharacters.add(charName);
        if (!currentScene.characters.includes(charName)) {
          currentScene.characters.push(charName);
        }
      }
    }

    // Add to current scene content
    if (currentScene) {
      currentScene.content += line + '\n';
    }
  }

  // Don't forget last scene
  if (currentScene) {
    scenes.push(currentScene);
  }

  // Estimate page count (industry standard: ~1 page per minute, ~56 lines/page)
  const totalLines = content.split('\n').length;
  const estimatedPageCount = Math.ceil(totalLines / 56);

  return {
    title,
    author,
    scenes,
    allCharacters: Array.from(allCharacters),
    estimatedPageCount,
  };
};

// =============================================================================
// PLAIN TEXT PARSER
// =============================================================================

export const parsePlainText = (content: string): ParsedScript => {
  // Try to detect if it's screenplay format
  const hasSluglines = /^(INT\.|EXT\.)/m.test(content);

  if (hasSluglines) {
    return parseFountain(content);
  }

  // Otherwise, treat as prose/notes - create single "scene"
  return {
    title: 'Imported Text',
    scenes: [{
      slugline: 'IMPORTED CONTENT',
      content: content,
      characters: [],
      estimatedBeats: [],
    }],
    allCharacters: [],
    estimatedPageCount: Math.ceil(content.split('\n').length / 56),
  };
};

// =============================================================================
// CSV PARSER (Beat Sheets / Rewrite Plans)
// =============================================================================

export const parseCSV = (content: string): ParsedBeatSheet => {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length === 0) {
    return { sequences: [] };
  }

  // Parse header row
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

  // Find relevant columns
  const sequenceCol = headers.findIndex(h =>
    h.includes('sequence') || h.includes('act') || h.includes('section')
  );
  const beatCol = headers.findIndex(h =>
    h.includes('beat') || h.includes('description') || h.includes('action') || h.includes('note')
  );
  const sceneCol = headers.findIndex(h =>
    h.includes('scene') || h.includes('number')
  );

  // Default to first columns if not found
  const seqIdx = sequenceCol >= 0 ? sequenceCol : 0;
  const beatIdx = beatCol >= 0 ? beatCol : 1;
  const sceneIdx = sceneCol >= 0 ? sceneCol : -1;

  const sequenceMap = new Map<string, { name: string; beats: { description: string; scene?: string }[] }>();

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    if (cells.length <= beatIdx) continue;

    const seqName = cells[seqIdx]?.trim() || 'Sequence 1';
    const beat = cells[beatIdx]?.trim();
    const scene = sceneIdx >= 0 ? cells[sceneIdx]?.trim() : undefined;

    if (!beat) continue;

    if (!sequenceMap.has(seqName)) {
      sequenceMap.set(seqName, { name: seqName, beats: [] });
    }

    sequenceMap.get(seqName)!.beats.push({
      description: beat,
      scene: scene || undefined,
    });
  }

  return {
    sequences: Array.from(sequenceMap.values()),
  };
};

// Helper to parse CSV line (handles quoted fields)
const parseCSVLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());

  return cells;
};

// =============================================================================
// MARKDOWN PARSER (Notes / Outlines)
// =============================================================================

export const parseMarkdown = (content: string): ParsedNotes => {
  const items: ParsedNotes['items'] = [];
  const lines = content.split('\n');

  let currentNote = '';
  let currentType: 'rewrite' | 'character' | 'logic' | 'theme' | 'general' = 'general';
  let currentScene: string | undefined;

  const typePatterns: Record<string, 'rewrite' | 'character' | 'logic' | 'theme'> = {
    'rewrite': 'rewrite',
    'fix': 'rewrite',
    'change': 'rewrite',
    'character': 'character',
    'arc': 'character',
    'motivation': 'character',
    'logic': 'logic',
    'continuity': 'logic',
    'plot hole': 'logic',
    'theme': 'theme',
    'thematic': 'theme',
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Scene reference pattern: "Scene 1.2:" or "[1.2]" or "# Scene 1.2"
    const sceneMatch = trimmed.match(/(?:scene\s*)?(\d+(?:\.\d+)?)/i);

    // Header = new section
    if (trimmed.startsWith('#')) {
      // Save previous note
      if (currentNote.trim()) {
        items.push({
          content: currentNote.trim(),
          type: currentType,
          targetScene: currentScene,
        });
      }

      currentNote = '';
      currentType = 'general';

      // Try to detect type from header
      const headerLower = trimmed.toLowerCase();
      for (const [pattern, type] of Object.entries(typePatterns)) {
        if (headerLower.includes(pattern)) {
          currentType = type;
          break;
        }
      }

      // Try to detect scene
      if (sceneMatch) {
        currentScene = sceneMatch[1];
      }

      continue;
    }

    // Bullet points or numbered items = separate notes
    if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      if (currentNote.trim()) {
        items.push({
          content: currentNote.trim(),
          type: currentType,
          targetScene: currentScene,
        });
      }
      currentNote = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
    } else if (trimmed) {
      currentNote += (currentNote ? ' ' : '') + trimmed;
    }
  }

  // Don't forget last note
  if (currentNote.trim()) {
    items.push({
      content: currentNote.trim(),
      type: currentType,
      targetScene: currentScene,
    });
  }

  return { items };
};

// =============================================================================
// MAIN PARSER DISPATCHER
// =============================================================================

export const parseDocument = (
  content: string,
  type: DocumentType
): { script?: ParsedScript; notes?: ParsedNotes; beatSheet?: ParsedBeatSheet } => {
  switch (type) {
    case 'fountain':
    case 'txt':
      return { script: parsePlainText(content) };

    case 'csv':
      return { beatSheet: parseCSV(content) };

    case 'markdown':
      return { notes: parseMarkdown(content) };

    case 'fdx':
      // Final Draft XML - would need XML parsing
      // For now, try to extract text content
      const textContent = content.replace(/<[^>]+>/g, '\n');
      return { script: parsePlainText(textContent) };

    case 'pdf':
      // PDF would need a library - for now return raw
      return { notes: { items: [{ content: 'PDF parsing requires manual review', type: 'general' }] } };

    case 'json':
      // Try to parse as structured data
      try {
        const data = JSON.parse(content);
        // Could be scene data, beat sheet, etc.
        if (data.scenes) {
          return { script: data as ParsedScript };
        }
        if (data.sequences) {
          return { beatSheet: data as ParsedBeatSheet };
        }
        return { notes: { items: [{ content: JSON.stringify(data, null, 2), type: 'general' }] } };
      } catch {
        return { notes: { items: [{ content: 'Invalid JSON', type: 'general' }] } };
      }

    default:
      return { notes: { items: [{ content, type: 'general' }] } };
  }
};

// =============================================================================
// FILE TYPE DETECTION
// =============================================================================

export const detectDocumentType = (filename: string, content?: string): DocumentType => {
  const ext = filename.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'fountain':
      return 'fountain';
    case 'fdx':
      return 'fdx';
    case 'pdf':
      return 'pdf';
    case 'csv':
      return 'csv';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'json':
      return 'json';
    case 'docx':
      return 'docx';
    case 'txt':
    default:
      // Try to detect from content
      if (content) {
        if (content.includes('INT.') || content.includes('EXT.')) return 'fountain';
        if (content.startsWith('{') || content.startsWith('[')) return 'json';
        if (content.includes('<?xml')) return 'fdx';
      }
      return 'txt';
  }
};
