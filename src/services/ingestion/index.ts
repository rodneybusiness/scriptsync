/**
 * Ingestion Module Exports
 */

// Types
export * from './types';

// Parsers
export {
  parseDocument,
  detectDocumentType,
  parseFountain,
  parsePlainText,
  parseCSV,
  parseMarkdown,
} from './parsers';

// AI Processor
export {
  generateProjectConfig,
  generateSequences,
  generateConnections,
  runQualityControl,
} from './aiProcessor';

// Arc Tracker
export {
  generateCharacterArcs,
  parseArcDocument,
  exportArcToMarkdown,
  exportArcToCSV,
  type CharacterArc,
  type CharacterArcPoint,
  type ArcTrackingDocument,
} from './arcTracker';

// Pipeline
export {
  runIngestionPipeline,
  readFileContent,
  createUploadedDocument,
  parseFinalDraft,
  parseScapple,
  parseNotionExport,
  parseMiroExport,
  detectProToolFormat,
  type PipelineState,
  type PipelineStatus,
  type PipelineCallbacks,
  initialPipelineState,
} from './pipeline';
