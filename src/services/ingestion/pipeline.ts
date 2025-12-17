/**
 * Ingestion Pipeline
 *
 * Master orchestrator for document processing.
 * Supports: Fountain, Final Draft, PDF, CSV, Markdown, Notion, Miro, Scapple
 */

import {
  IngestionJob,
  UploadedDocument,
  ProcessingProgress,
  ProcessingStage,
  ParsedScript,
  ParsedNotes,
  ParsedBeatSheet,
  QCReport,
  AIProcessingConfig,
  DEFAULT_AI_CONFIG,
  DocumentType,
} from './types';
import { parseDocument, detectDocumentType } from './parsers';
import {
  generateProjectConfig,
  generateSequences,
  generateConnections,
  runQualityControl,
} from './aiProcessor';
import { ArcTrackingDocument } from './arcTracker';
import { ProjectConfig, ProjectData, Sequence } from '../../config/types';

// =============================================================================
// PIPELINE STATE
// =============================================================================

export type PipelineStatus = 'idle' | 'processing' | 'review' | 'complete' | 'error';

export interface PipelineState {
  status: PipelineStatus;
  job: IngestionJob | null;
  progress: ProcessingProgress;
  documents: UploadedDocument[];
  parsedScript: ParsedScript | null;
  parsedNotes: ParsedNotes | null;
  parsedBeatSheet: ParsedBeatSheet | null;
  generatedConfig: ProjectConfig | null;
  generatedSequences: Sequence[] | null;
  generatedArcs: ArcTrackingDocument | null;
  qcReport: QCReport | null;
  error: string | null;
}

export const initialPipelineState: PipelineState = {
  status: 'idle',
  job: null,
  progress: { stage: 'parsing', progress: 0, message: 'Ready' },
  documents: [],
  parsedScript: null,
  parsedNotes: null,
  parsedBeatSheet: null,
  generatedConfig: null,
  generatedSequences: null,
  generatedArcs: null,
  qcReport: null,
  error: null,
};

// =============================================================================
// PIPELINE CALLBACKS
// =============================================================================

export interface PipelineCallbacks {
  onProgress: (progress: ProcessingProgress) => void;
  onStageComplete: (stage: ProcessingStage, data: unknown) => void;
  onError: (error: string) => void;
  onComplete: (result: ProjectData) => void;
  onQCRequired: (report: QCReport) => void;
}

// =============================================================================
// MAIN PIPELINE
// =============================================================================

/**
 * Run the full ingestion pipeline
 */
export const runIngestionPipeline = async (
  projectName: string,
  documents: UploadedDocument[],
  config: AIProcessingConfig = DEFAULT_AI_CONFIG,
  callbacks: PipelineCallbacks
): Promise<ProjectData | null> => {
  const updateProgress = (stage: ProcessingStage, progress: number, message: string, details?: string[]) => {
    callbacks.onProgress({ stage, progress, message, details });
  };

  try {
    // ===================
    // STAGE 1: PARSING
    // ===================
    updateProgress('parsing', 0, 'Parsing uploaded documents...');

    let parsedScript: ParsedScript | null = null;
    let parsedNotes: ParsedNotes | null = null;
    let parsedBeatSheet: ParsedBeatSheet | null = null;

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      updateProgress('parsing', (i / documents.length) * 100, `Parsing ${doc.name}...`);

      const result = parseDocument(doc.content, doc.type);

      if (result.script) {
        // Merge scripts if multiple
        if (parsedScript) {
          parsedScript.scenes = [...parsedScript.scenes, ...result.script.scenes];
          parsedScript.allCharacters = [...new Set([...parsedScript.allCharacters, ...result.script.allCharacters])];
        } else {
          parsedScript = result.script;
        }
      }

      if (result.notes) {
        if (parsedNotes) {
          parsedNotes.items = [...parsedNotes.items, ...result.notes.items];
        } else {
          parsedNotes = result.notes;
        }
      }

      if (result.beatSheet) {
        if (parsedBeatSheet) {
          parsedBeatSheet.sequences = [...parsedBeatSheet.sequences, ...result.beatSheet.sequences];
        } else {
          parsedBeatSheet = result.beatSheet;
        }
      }
    }

    if (!parsedScript || parsedScript.scenes.length === 0) {
      throw new Error('No script content found in uploaded documents');
    }

    callbacks.onStageComplete('parsing', { parsedScript, parsedNotes, parsedBeatSheet });

    // ===================
    // STAGE 2: SCENE DETECTION (AI Enhanced)
    // ===================
    updateProgress('scene_detection', 0, 'Analyzing scene structure...');

    // AI can refine scene boundaries if needed
    if (config.aiSceneDetection && parsedScript.scenes.length === 1) {
      // Single scene might mean parser didn't detect boundaries - use AI
      updateProgress('scene_detection', 50, 'Using AI to detect scene boundaries...');
      // This would call an AI function to split the content
    }

    callbacks.onStageComplete('scene_detection', parsedScript.scenes.length);

    // ===================
    // STAGE 3: CHARACTER EXTRACTION
    // ===================
    updateProgress('character_extraction', 0, 'Extracting characters...');

    // Already done in parsing, but can enhance with AI
    if (config.aiCharacterClassification) {
      updateProgress('character_extraction', 50, 'Classifying character roles with AI...');
    }

    callbacks.onStageComplete('character_extraction', parsedScript.allCharacters);

    // ===================
    // STAGE 4: BEAT ANALYSIS
    // ===================
    updateProgress('beat_analysis', 0, 'Analyzing story beats...');

    // Generate project config (includes AI analysis)
    updateProgress('beat_analysis', 30, 'Generating project configuration...');
    const projectConfig = await generateProjectConfig(
      projectName,
      parsedScript,
      parsedNotes ?? undefined,
      parsedBeatSheet ?? undefined
    );

    // Generate sequences with beats
    updateProgress('beat_analysis', 60, 'Generating sequences and beats...');
    let sequences = await generateSequences(
      parsedScript,
      parsedBeatSheet ?? undefined,
      parsedNotes ?? undefined,
      config
    );

    callbacks.onStageComplete('beat_analysis', { projectConfig, sequences });

    // ===================
    // STAGE 5: NOTE EXTRACTION
    // ===================
    updateProgress('note_extraction', 0, 'Processing notes and annotations...');

    // Notes are already applied to scenes in generateSequences
    const totalNotes = sequences.reduce((sum, seq) =>
      sum + seq.scenes.reduce((ssum, scene) => ssum + scene.notes.length, 0), 0
    );

    callbacks.onStageComplete('note_extraction', totalNotes);

    // ===================
    // STAGE 6: CONNECTION MAPPING
    // ===================
    updateProgress('connection_mapping', 0, 'Finding scene connections...');

    if (config.aiConnectionMapping) {
      updateProgress('connection_mapping', 50, 'Using AI to map story connections...');
      sequences = await generateConnections(sequences);
    }

    const totalConnections = sequences.reduce((sum, seq) =>
      sum + seq.scenes.reduce((ssum, scene) => ssum + (scene.connections?.length || 0), 0), 0
    );

    callbacks.onStageComplete('connection_mapping', totalConnections);

    // ===================
    // STAGE 7: QC VALIDATION
    // ===================
    updateProgress('qc_validation', 0, 'Running quality control checks...');

    const qcReport = await runQualityControl(projectConfig, sequences);

    updateProgress('qc_validation', 100, `QC Complete: ${qcReport.confidence}% confidence`);
    callbacks.onStageComplete('qc_validation', qcReport);

    // If QC confidence is below threshold, require review
    if (qcReport.confidence < config.autoAcceptThreshold || !qcReport.approved) {
      callbacks.onQCRequired(qcReport);
    }

    // ===================
    // STAGE 8: FINALIZATION
    // ===================
    updateProgress('finalization', 0, 'Finalizing project data...');

    const projectData: ProjectData = {
      config: projectConfig,
      sequences,
    };

    updateProgress('finalization', 100, 'Import complete!');
    callbacks.onComplete(projectData);

    return projectData;

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during processing';
    callbacks.onError(message);
    return null;
  }
};

// =============================================================================
// FILE READING UTILITIES
// =============================================================================

/**
 * Read file content from File object
 */
export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    // Handle different file types
    if (file.type === 'application/pdf') {
      // PDF requires special handling - for now return placeholder
      resolve(`[PDF Content - ${file.name}]\n\nPDF parsing requires manual review or OCR.`);
    } else {
      reader.readAsText(file);
    }
  });
};

/**
 * Create UploadedDocument from File
 */
export const createUploadedDocument = async (file: File): Promise<UploadedDocument> => {
  const content = await readFileContent(file);
  const type = detectDocumentType(file.name, content);

  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: file.name,
    type,
    content,
    size: file.size,
    uploadedAt: new Date(),
    status: 'pending',
  };
};

// =============================================================================
// SPECIALIZED PARSERS FOR PRO TOOLS
// =============================================================================

/**
 * Parse Final Draft XML (.fdx)
 */
export const parseFinalDraft = (xmlContent: string): ParsedScript => {
  // Final Draft uses XML format
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');

  const title = doc.querySelector('HeaderAndFooter TitlePage Title')?.textContent || 'Untitled';
  const scenes: ParsedScript['scenes'] = [];
  const allCharacters = new Set<string>();

  // Find all paragraphs
  const paragraphs = doc.querySelectorAll('Paragraph');
  let currentScene: ParsedScript['scenes'][0] | null = null;

  paragraphs.forEach(p => {
    const type = p.getAttribute('Type');
    const text = p.querySelector('Text')?.textContent || '';

    if (type === 'Scene Heading') {
      if (currentScene) scenes.push(currentScene);
      currentScene = {
        slugline: text,
        content: text + '\n',
        characters: [],
        estimatedBeats: [],
      };
    } else if (type === 'Character' && currentScene) {
      allCharacters.add(text.trim());
      if (!currentScene.characters.includes(text.trim())) {
        currentScene.characters.push(text.trim());
      }
      currentScene.content += '\n' + text.toUpperCase() + '\n';
    } else if (currentScene) {
      currentScene.content += text + '\n';
    }
  });

  if (currentScene) scenes.push(currentScene);

  return {
    title,
    scenes,
    allCharacters: Array.from(allCharacters),
    estimatedPageCount: Math.ceil(scenes.length * 2),
  };
};

/**
 * Parse Scapple file (.scap)
 * Scapple uses XML format for mind maps
 */
export const parseScapple = (xmlContent: string): ParsedBeatSheet => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');

  const notes = doc.querySelectorAll('Note');
  const beats: { description: string; scene?: string }[] = [];

  notes.forEach(note => {
    const text = note.querySelector('String')?.textContent;
    if (text) {
      // Try to detect scene references
      const sceneMatch = text.match(/scene\s*(\d+)/i);
      beats.push({
        description: text,
        scene: sceneMatch?.[1],
      });
    }
  });

  return {
    sequences: [{
      name: 'Scapple Import',
      beats,
    }],
  };
};

// =============================================================================
// NOTION INTEGRATION
// =============================================================================

/**
 * Import from Notion (requires Notion API or exported markdown)
 */
export const parseNotionExport = (content: string): ParsedNotes => {
  // Notion exports as markdown or CSV
  // This handles markdown export format

  const items: ParsedNotes['items'] = [];
  const lines = content.split('\n');

  let currentSection = '';
  let currentType: 'rewrite' | 'character' | 'logic' | 'theme' | 'general' = 'general';

  for (const line of lines) {
    const trimmed = line.trim();

    // Notion uses specific formatting
    if (trimmed.startsWith('#')) {
      currentSection = trimmed.replace(/^#+\s*/, '');

      // Detect type from section name
      if (currentSection.toLowerCase().includes('character')) currentType = 'character';
      else if (currentSection.toLowerCase().includes('rewrite')) currentType = 'rewrite';
      else if (currentSection.toLowerCase().includes('logic')) currentType = 'logic';
      else if (currentSection.toLowerCase().includes('theme')) currentType = 'theme';
      else currentType = 'general';

      continue;
    }

    // Checkboxes, bullets, or plain text as notes
    if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
      items.push({
        content: trimmed.replace(/^-\s*\[.\]\s*/, ''),
        type: currentType,
      });
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      items.push({
        content: trimmed.replace(/^[-*]\s*/, ''),
        type: currentType,
      });
    } else if (trimmed && !trimmed.startsWith('|')) { // Skip tables
      items.push({
        content: trimmed,
        type: currentType,
      });
    }
  }

  return { items };
};

/**
 * Parse Miro board export (JSON or CSV)
 */
export const parseMiroExport = (content: string): ParsedBeatSheet => {
  // Miro exports boards as JSON
  try {
    const data = JSON.parse(content);

    // Miro structure varies, but typically has widgets/items
    const widgets = data.widgets || data.items || [];
    const beats: { description: string; scene?: string }[] = [];

    for (const widget of widgets) {
      const text = widget.text || widget.plainText || widget.title;
      if (text) {
        const sceneMatch = text.match(/scene\s*(\d+)/i);
        beats.push({
          description: text,
          scene: sceneMatch?.[1],
        });
      }
    }

    return {
      sequences: [{
        name: 'Miro Import',
        beats,
      }],
    };
  } catch {
    // If not JSON, treat as text
    return {
      sequences: [{
        name: 'Miro Import',
        beats: content.split('\n').filter(l => l.trim()).map(l => ({
          description: l.trim(),
        })),
      }],
    };
  }
};

// =============================================================================
// ENHANCED DOCUMENT TYPE DETECTION
// =============================================================================

/**
 * Enhanced document type detection for pro tools
 */
export const detectProToolFormat = (filename: string, content: string): DocumentType | 'fdx' | 'scapple' | 'miro' | 'notion' => {
  const ext = filename.split('.').pop()?.toLowerCase();

  // Check extensions first
  if (ext === 'fdx') return 'fdx';
  if (ext === 'scap' || ext === 'scapple') return 'scapple' as DocumentType;

  // Check content signatures
  if (content.includes('<FinalDraft')) return 'fdx';
  if (content.includes('<ScappleDocument')) return 'scapple' as DocumentType;
  if (content.includes('"type":"miro"') || content.includes('"widgets"')) return 'miro' as DocumentType;

  // Notion exports often have specific formatting
  if (content.includes('notion.so') || content.match(/^#\s+\w+\n\n[-*]/m)) return 'notion' as DocumentType;

  // Fall back to basic detection
  return detectDocumentType(filename, content);
};
