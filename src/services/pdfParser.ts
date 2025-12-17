/**
 * PDF Parser Service
 *
 * Uses pdf.js to extract text content from PDF screenplays.
 * Includes screenplay-specific parsing logic to identify:
 * - Scene headings (INT./EXT.)
 * - Character names
 * - Dialogue
 * - Action/description
 * - Parentheticals
 * - Transitions
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// =============================================================================
// TYPES
// =============================================================================

export interface PDFTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  fontSize: number;
  pageNumber: number;
}

export interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  items: PDFTextItem[];
}

export interface ParsedScriptElement {
  type: 'scene_heading' | 'character' | 'dialogue' | 'action' | 'parenthetical' | 'transition' | 'unknown';
  text: string;
  pageNumber: number;
  position: { x: number; y: number };
  confidence: number;
}

export interface ParsedScene {
  heading: string;
  location: string;
  timeOfDay: string;
  pageNumber: number;
  elements: ParsedScriptElement[];
  characters: string[];
  rawContent: string;
}

export interface PDFParseResult {
  title: string;
  author?: string;
  totalPages: number;
  scenes: ParsedScene[];
  characters: string[];
  rawText: string;
  metadata: {
    creationDate?: string;
    modificationDate?: string;
    producer?: string;
  };
}

export interface PDFParseProgress {
  stage: 'loading' | 'extracting' | 'parsing' | 'analyzing' | 'complete' | 'error';
  progress: number; // 0-100
  currentPage?: number;
  totalPages?: number;
  message: string;
}

// =============================================================================
// SCREENPLAY PATTERNS
// =============================================================================

const PATTERNS = {
  // Scene heading patterns (sluglines)
  sceneHeading: /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s*.+/i,
  sceneHeadingStrict: /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s+([A-Z\s\-'\.,]+)\s*[-–]\s*(DAY|NIGHT|MORNING|AFTERNOON|EVENING|DAWN|DUSK|LATER|CONTINUOUS|SAME|MOMENTS LATER)/i,

  // Character name (typically all caps, centered or left-indented)
  characterName: /^[A-Z][A-Z\s\-'\.]{1,30}(\s*\(V\.O\.\)|\s*\(O\.S\.\)|\s*\(O\.C\.\)|\s*\(CONT'D\)|\s*\(CONT\))?$/,

  // Parenthetical (in parentheses, typically under character name)
  parenthetical: /^\s*\([^)]+\)\s*$/,

  // Transition (all caps, typically right-aligned)
  transition: /^(FADE IN:|FADE OUT\.|FADE TO:|CUT TO:|DISSOLVE TO:|SMASH CUT:|MATCH CUT:|JUMP CUT:|TIME CUT:|WIPE TO:|IRIS IN:|IRIS OUT:)/i,

  // Title page elements
  titlePage: /^(Title:|Written by|By|Draft|Date|Contact|Address:|Phone:|Email:)/i,
};

// Standard screenplay margins (in points, assuming 8.5x11 inch page at 72 DPI)
const MARGINS = {
  // Character names are typically centered around 3.7" from left
  characterLeft: 250,
  characterRight: 380,
  // Dialogue is typically 2.5" from left to 6" (145-432 points)
  dialogueLeft: 145,
  dialogueRight: 432,
  // Action runs full width (1.5" to 7.5" = 108-540 points)
  actionLeft: 100,
  actionRight: 550,
  // Parentheticals are slightly narrower than dialogue
  parentheticalLeft: 180,
  parentheticalRight: 400,
};

// =============================================================================
// PDF EXTRACTION
// =============================================================================

/**
 * Load and extract raw text content from a PDF file
 */
export const extractPDFContent = async (
  file: File,
  onProgress?: (progress: PDFParseProgress) => void
): Promise<{ pages: PDFPage[]; metadata: Record<string, unknown> }> => {
  onProgress?.({
    stage: 'loading',
    progress: 0,
    message: 'Loading PDF file...',
  });

  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

  loadingTask.onProgress = (data: { loaded: number; total: number }) => {
    const progress = Math.round((data.loaded / data.total) * 20);
    onProgress?.({
      stage: 'loading',
      progress,
      message: 'Loading PDF file...',
    });
  };

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  const metadata = await pdf.getMetadata();

  onProgress?.({
    stage: 'extracting',
    progress: 20,
    totalPages,
    message: `Extracting text from ${totalPages} pages...`,
  });

  const pages: PDFPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();

    const items: PDFTextItem[] = textContent.items
      .filter((item): item is { str: string; dir: string; width: number; height: number; transform: number[]; fontName: string; hasEOL: boolean } => 'str' in item && typeof (item as { str?: string }).str === 'string')
      .map((item) => {
        const tx = item.transform;
        return {
          text: item.str,
          x: tx[4],
          y: viewport.height - tx[5], // Flip Y coordinate
          width: item.width,
          height: item.height,
          fontName: item.fontName,
          fontSize: Math.abs(tx[0]) || 12,
          pageNumber: i,
        };
      });

    pages.push({
      pageNumber: i,
      width: viewport.width,
      height: viewport.height,
      items,
    });

    const progress = 20 + Math.round((i / totalPages) * 40);
    onProgress?.({
      stage: 'extracting',
      progress,
      currentPage: i,
      totalPages,
      message: `Extracting page ${i} of ${totalPages}...`,
    });
  }

  return {
    pages,
    metadata: metadata.info as Record<string, unknown>,
  };
};

// =============================================================================
// LINE RECONSTRUCTION
// =============================================================================

interface TextLine {
  text: string;
  y: number;
  x: number;
  width: number;
  pageNumber: number;
  fontSize: number;
  fontName: string;
}

/**
 * Reconstruct lines from PDF text items
 */
const reconstructLines = (pages: PDFPage[]): TextLine[] => {
  const lines: TextLine[] = [];

  for (const page of pages) {
    // Group items by Y position (with tolerance)
    const lineGroups = new Map<number, PDFTextItem[]>();

    for (const item of page.items) {
      const roundedY = Math.round(item.y / 2) * 2; // Round to nearest 2 points
      const group = lineGroups.get(roundedY) || [];
      group.push(item);
      lineGroups.set(roundedY, group);
    }

    // Sort each group by X position and combine
    for (const [y, items] of lineGroups) {
      const sortedItems = items.sort((a, b) => a.x - b.x);

      let lineText = '';
      let prevX = 0;
      let prevWidth = 0;

      for (const item of sortedItems) {
        // Add space if there's a gap between items
        if (prevX > 0 && item.x - (prevX + prevWidth) > 3) {
          lineText += ' ';
        }
        lineText += item.text;
        prevX = item.x;
        prevWidth = item.width;
      }

      lineText = lineText.trim();
      if (lineText) {
        const firstItem = sortedItems[0];
        lines.push({
          text: lineText,
          y,
          x: firstItem.x,
          width: (sortedItems[sortedItems.length - 1].x + sortedItems[sortedItems.length - 1].width) - firstItem.x,
          pageNumber: page.pageNumber,
          fontSize: firstItem.fontSize,
          fontName: firstItem.fontName,
        });
      }
    }
  }

  // Sort by page and Y position
  return lines.sort((a, b) => {
    if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
    return a.y - b.y;
  });
};

// =============================================================================
// SCREENPLAY ELEMENT CLASSIFICATION
// =============================================================================

/**
 * Classify a line of text as a screenplay element
 */
const classifyElement = (line: TextLine, prevLine?: TextLine, nextLine?: TextLine): ParsedScriptElement => {
  const text = line.text.trim();
  const x = line.x;

  // Scene heading detection
  if (PATTERNS.sceneHeading.test(text)) {
    return {
      type: 'scene_heading',
      text,
      pageNumber: line.pageNumber,
      position: { x: line.x, y: line.y },
      confidence: PATTERNS.sceneHeadingStrict.test(text) ? 0.95 : 0.8,
    };
  }

  // Transition detection (typically right-aligned or matches pattern)
  if (PATTERNS.transition.test(text)) {
    return {
      type: 'transition',
      text,
      pageNumber: line.pageNumber,
      position: { x: line.x, y: line.y },
      confidence: 0.9,
    };
  }

  // Parenthetical detection
  if (PATTERNS.parenthetical.test(text)) {
    return {
      type: 'parenthetical',
      text,
      pageNumber: line.pageNumber,
      position: { x: line.x, y: line.y },
      confidence: 0.9,
    };
  }

  // Character name detection (centered, all caps, followed by dialogue)
  if (PATTERNS.characterName.test(text) && x > MARGINS.characterLeft && x < MARGINS.characterRight) {
    // Check if next line looks like dialogue
    const isFollowedByDialogue = nextLine &&
      nextLine.x > MARGINS.dialogueLeft &&
      nextLine.x < MARGINS.dialogueRight;

    return {
      type: 'character',
      text,
      pageNumber: line.pageNumber,
      position: { x: line.x, y: line.y },
      confidence: isFollowedByDialogue ? 0.9 : 0.7,
    };
  }

  // Dialogue detection (indented, typically follows character name)
  if (x > MARGINS.dialogueLeft && x < MARGINS.characterLeft) {
    const prevWasCharacter = prevLine && PATTERNS.characterName.test(prevLine.text);
    const prevWasParenthetical = prevLine && PATTERNS.parenthetical.test(prevLine.text);

    return {
      type: 'dialogue',
      text,
      pageNumber: line.pageNumber,
      position: { x: line.x, y: line.y },
      confidence: (prevWasCharacter || prevWasParenthetical) ? 0.85 : 0.6,
    };
  }

  // Default to action
  return {
    type: 'action',
    text,
    pageNumber: line.pageNumber,
    position: { x: line.x, y: line.y },
    confidence: 0.7,
  };
};

// =============================================================================
// SCENE PARSING
// =============================================================================

/**
 * Parse scene heading to extract location and time of day
 */
const parseSceneHeading = (heading: string): { location: string; timeOfDay: string } => {
  // Remove scene number if present
  let cleaned = heading.replace(/^\d+\s*/, '');

  // Try strict pattern first
  const strictMatch = cleaned.match(PATTERNS.sceneHeadingStrict);
  if (strictMatch) {
    return {
      location: `${strictMatch[1]} ${strictMatch[2].trim()}`,
      timeOfDay: strictMatch[3].toUpperCase(),
    };
  }

  // Fallback: try to split on common separators
  const parts = cleaned.split(/\s*[-–]\s*/);
  if (parts.length >= 2) {
    const timeMatch = parts[parts.length - 1].match(/(DAY|NIGHT|MORNING|AFTERNOON|EVENING|DAWN|DUSK|LATER|CONTINUOUS|SAME)/i);
    if (timeMatch) {
      return {
        location: parts.slice(0, -1).join(' - ').trim(),
        timeOfDay: timeMatch[1].toUpperCase(),
      };
    }
  }

  return {
    location: cleaned,
    timeOfDay: 'DAY',
  };
};

/**
 * Group elements into scenes
 */
const groupIntoScenes = (elements: ParsedScriptElement[]): ParsedScene[] => {
  const scenes: ParsedScene[] = [];
  let currentScene: ParsedScene | null = null;

  for (const element of elements) {
    if (element.type === 'scene_heading') {
      // Start a new scene
      const { location, timeOfDay } = parseSceneHeading(element.text);
      currentScene = {
        heading: element.text,
        location,
        timeOfDay,
        pageNumber: element.pageNumber,
        elements: [element],
        characters: [],
        rawContent: element.text + '\n',
      };
      scenes.push(currentScene);
    } else if (currentScene) {
      currentScene.elements.push(element);
      currentScene.rawContent += element.text + '\n';

      // Track characters
      if (element.type === 'character') {
        const charName = element.text
          .replace(/\s*\(V\.O\.\)/i, '')
          .replace(/\s*\(O\.S\.\)/i, '')
          .replace(/\s*\(O\.C\.\)/i, '')
          .replace(/\s*\(CONT'D\)/i, '')
          .replace(/\s*\(CONT\)/i, '')
          .trim();

        if (!currentScene.characters.includes(charName)) {
          currentScene.characters.push(charName);
        }
      }
    }
    // Skip elements before first scene heading (title page, etc.)
  }

  return scenes;
};

// =============================================================================
// CHARACTER EXTRACTION
// =============================================================================

/**
 * Extract unique character names from parsed scenes
 */
const extractCharacters = (scenes: ParsedScene[]): string[] => {
  const characterCounts = new Map<string, number>();

  for (const scene of scenes) {
    for (const char of scene.characters) {
      const count = characterCounts.get(char) || 0;
      characterCounts.set(char, count + 1);
    }
  }

  // Sort by frequency (most frequent first)
  return Array.from(characterCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
};

// =============================================================================
// TITLE EXTRACTION
// =============================================================================

/**
 * Try to extract title from first page
 */
const extractTitle = (pages: PDFPage[], filename: string): string => {
  if (pages.length === 0) return filename;

  const firstPage = pages[0];
  const lines = reconstructLines([firstPage]);

  // Look for title in first few lines
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];

    // Skip "Title:" prefix lines
    if (PATTERNS.titlePage.test(line.text)) continue;

    // Title is usually centered, larger font, in upper portion of page
    if (
      line.y < firstPage.height * 0.4 &&
      line.fontSize >= 14 &&
      line.x > firstPage.width * 0.2 &&
      line.x < firstPage.width * 0.5 &&
      !PATTERNS.sceneHeading.test(line.text)
    ) {
      return line.text.trim();
    }
  }

  // Fallback to filename without extension
  return filename.replace(/\.pdf$/i, '');
};

/**
 * Try to extract author from first page
 */
const extractAuthor = (pages: PDFPage[]): string | undefined => {
  if (pages.length === 0) return undefined;

  const firstPage = pages[0];
  const lines = reconstructLines([firstPage]);

  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i];

    // Look for "Written by" or "By"
    if (/^(Written by|By)\s*$/i.test(line.text)) {
      // Author should be on next line
      if (i + 1 < lines.length) {
        return lines[i + 1].text.trim();
      }
    }

    // Look for "Written by NAME"
    const byMatch = line.text.match(/^(?:Written by|By)\s+(.+)/i);
    if (byMatch) {
      return byMatch[1].trim();
    }
  }

  return undefined;
};

// =============================================================================
// MAIN PARSE FUNCTION
// =============================================================================

/**
 * Parse a PDF file and extract screenplay structure
 */
export const parsePDF = async (
  file: File,
  onProgress?: (progress: PDFParseProgress) => void
): Promise<PDFParseResult> => {
  try {
    // Extract raw content
    const { pages, metadata } = await extractPDFContent(file, onProgress);

    onProgress?.({
      stage: 'parsing',
      progress: 60,
      message: 'Reconstructing screenplay structure...',
    });

    // Reconstruct lines
    const lines = reconstructLines(pages);

    onProgress?.({
      stage: 'parsing',
      progress: 70,
      message: 'Classifying screenplay elements...',
    });

    // Classify each line
    const elements: ParsedScriptElement[] = [];
    for (let i = 0; i < lines.length; i++) {
      const element = classifyElement(
        lines[i],
        i > 0 ? lines[i - 1] : undefined,
        i < lines.length - 1 ? lines[i + 1] : undefined
      );
      elements.push(element);
    }

    onProgress?.({
      stage: 'analyzing',
      progress: 80,
      message: 'Grouping scenes and extracting characters...',
    });

    // Group into scenes
    const scenes = groupIntoScenes(elements);

    // Extract characters
    const characters = extractCharacters(scenes);

    // Extract title and author
    const title = extractTitle(pages, file.name);
    const author = extractAuthor(pages);

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: `Successfully parsed ${scenes.length} scenes`,
    });

    return {
      title,
      author,
      totalPages: pages.length,
      scenes,
      characters,
      rawText: lines.map(l => l.text).join('\n'),
      metadata: {
        creationDate: metadata.creationDate as string | undefined,
        modificationDate: metadata.modificationDate as string | undefined,
        producer: metadata.producer as string | undefined,
      },
    };
  } catch (error) {
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: error instanceof Error ? error.message : 'Failed to parse PDF',
    });
    throw error;
  }
};

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate that a file is a valid PDF
 */
export const validatePDFFile = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Check file type
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'File is not a PDF' };
  }

  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'PDF file is too large (max 50MB)' };
  }

  // Try to read first bytes to verify PDF magic number
  try {
    const slice = file.slice(0, 5);
    const buffer = await slice.arrayBuffer();
    const header = new TextDecoder().decode(buffer);

    if (!header.startsWith('%PDF')) {
      return { valid: false, error: 'File does not appear to be a valid PDF' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Could not read file' };
  }
};

export default parsePDF;
