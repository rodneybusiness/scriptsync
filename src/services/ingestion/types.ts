/**
 * Ingestion Pipeline Types
 *
 * Defines the structure for document processing and QC validation.
 */

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

export type DocumentType =
  | 'fountain'      // .fountain screenplay files
  | 'fdx'           // Final Draft XML
  | 'pdf'           // PDF scripts
  | 'txt'           // Plain text scripts
  | 'csv'           // Rewrite plans, beat sheets
  | 'markdown'      // Notes, outlines
  | 'json'          // Structured data exports
  | 'docx';         // Word documents

export interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  content: string;        // Raw file content
  size: number;
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

// =============================================================================
// PROCESSING STAGES
// =============================================================================

export type ProcessingStage =
  | 'parsing'           // Extract raw text/structure
  | 'scene_detection'   // Identify scene boundaries
  | 'character_extraction' // Find all characters
  | 'beat_analysis'     // Analyze story beats
  | 'note_extraction'   // Extract notes/comments
  | 'connection_mapping' // Find scene connections
  | 'qc_validation'     // Quality control checks
  | 'finalization';     // Final assembly

export interface ProcessingProgress {
  stage: ProcessingStage;
  progress: number;      // 0-100
  message: string;
  details?: string[];
}

// =============================================================================
// PARSED RESULTS
// =============================================================================

export interface ParsedScene {
  sceneNumber?: string;
  slugline: string;
  content: string;
  pageStart?: number;
  pageEnd?: number;
  characters: string[];
  estimatedBeats: string[];
}

export interface ParsedScript {
  title: string;
  author?: string;
  scenes: ParsedScene[];
  allCharacters: string[];
  estimatedPageCount: number;
}

export interface ParsedNotes {
  items: {
    targetScene?: string;    // Scene reference if identifiable
    content: string;
    author?: string;
    type?: 'rewrite' | 'character' | 'logic' | 'theme' | 'general';
  }[];
}

export interface ParsedBeatSheet {
  sequences: {
    name: string;
    dramaticQuestion?: string;
    beats: {
      description: string;
      scene?: string;
    }[];
  }[];
}

// =============================================================================
// QC VALIDATION
// =============================================================================

export type QCIssueSeverity = 'error' | 'warning' | 'info';

export interface QCIssue {
  id: string;
  severity: QCIssueSeverity;
  category: 'structure' | 'character' | 'continuity' | 'formatting' | 'data';
  message: string;
  location?: string;       // Scene ID or line number
  suggestion?: string;
  autoFixable: boolean;
}

export interface QCReport {
  documentId: string;
  timestamp: Date;
  issues: QCIssue[];
  stats: {
    totalScenes: number;
    totalCharacters: number;
    totalBeats: number;
    totalNotes: number;
    missingData: string[];
  };
  confidence: number;      // 0-100 overall confidence score
  approved: boolean;
}

// =============================================================================
// INGESTION JOB
// =============================================================================

export interface IngestionJob {
  id: string;
  projectId: string;
  documents: UploadedDocument[];
  progress: ProcessingProgress;
  parsedScript?: ParsedScript;
  parsedNotes?: ParsedNotes;
  parsedBeatSheet?: ParsedBeatSheet;
  qcReport?: QCReport;
  createdAt: Date;
  completedAt?: Date;
}

// =============================================================================
// AI PROCESSING CONFIG
// =============================================================================

export interface AIProcessingConfig {
  /** Use AI for scene boundary detection */
  aiSceneDetection: boolean;
  /** Use AI for character role classification */
  aiCharacterClassification: boolean;
  /** Use AI for beat generation from content */
  aiBeatGeneration: boolean;
  /** Use AI to find thematic connections */
  aiConnectionMapping: boolean;
  /** Confidence threshold for auto-acceptance (0-100) */
  autoAcceptThreshold: number;
}

export const DEFAULT_AI_CONFIG: AIProcessingConfig = {
  aiSceneDetection: true,
  aiCharacterClassification: true,
  aiBeatGeneration: true,
  aiConnectionMapping: true,
  autoAcceptThreshold: 85,
};
