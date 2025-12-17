/**
 * ScriptSync - Core Type Definitions
 *
 * These types define the structure of screenplay data and project configuration.
 * They are project-agnostic and can be used for any screenplay.
 */

// =============================================================================
// NOTE TYPES
// =============================================================================

export enum NoteType {
  REWRITE = 'REWRITE',
  LOGIC = 'LOGIC',
  CHARACTER = 'CHARACTER',
  THEME = 'THEME',
  PRODUCTION = 'PRODUCTION',
  DIALOGUE = 'DIALOGUE',
}

// =============================================================================
// SCRIPT DATA TYPES
// =============================================================================

export interface TrackingPoint {
  category: string;
  description: string;
}

export interface Beat {
  id: string;
  description: string;
  completed: boolean;
}

export interface SceneNote {
  id: string;
  author: string;
  content: string;
  type: NoteType;
  timestamp?: Date;
}

export interface SceneConnection {
  targetSceneId: string;
  type: 'causal' | 'thematic' | 'echo' | 'foreshadow' | 'callback';
  description: string;
}

export interface Scene {
  id: string;
  sequenceId: string;
  title: string;
  pageNumber: number;
  scriptContent: string;
  variants?: { [key: string]: string };
  activeVariant?: string;
  beats: Beat[];
  notes: SceneNote[];
  tracking: TrackingPoint[];
  summary: string;
  connections?: SceneConnection[];
  location?: string;
  timeOfDay?: 'DAY' | 'NIGHT' | 'DAWN' | 'DUSK' | 'CONTINUOUS';
}

export interface Sequence {
  id: string;
  title: string;
  dramaticQuestion: string;
  climax: string;
  resolution: string;
  scenes: Scene[];
}

// =============================================================================
// AI CHAT TYPES
// =============================================================================

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// =============================================================================
// BONEYARD (CUT CONTENT)
// =============================================================================

export interface BoneyardItem {
  id: string;
  content: string;
  type: 'snippet' | 'idea' | 'ai-generated' | 'cut-scene';
  date: Date;
  sourceSceneId?: string;
}

// =============================================================================
// LINTER
// =============================================================================

export interface LintIssue {
  id: string;
  line: number;
  type: 'formatting' | 'style' | 'logic' | 'continuity';
  message: string;
  severity: 'warning' | 'error' | 'info';
  suggestion?: string;
}

// =============================================================================
// EXPORT
// =============================================================================

export interface ExportOptions {
  includeNotes: boolean;
  includeBoneyard: boolean;
  includeTracking: boolean;
  format: 'txt' | 'fountain' | 'pdf' | 'fdx';
}

// =============================================================================
// PROJECT CONFIGURATION
// =============================================================================

export interface CharacterConfig {
  name: string;
  role: 'main' | 'supporting' | 'minor';
  description?: string;
  aliases?: string[]; // Alternative names/spellings to track
}

export interface AIConfig {
  /** Writing style references (e.g., "Shane Black", "Aaron Sorkin") */
  styleReferences: string[];
  /** Genre/tone descriptor for AI prompts (e.g., "Action/Comedy Specialist") */
  toneDescriptor: string;
  /** Project-specific constraints the AI should consider */
  uniqueConstraints: string[];
  /** Custom system instruction additions */
  customInstructions?: string;
}

export interface ProjectConfig {
  /** Unique project identifier (kebab-case) */
  id: string;
  /** Display title */
  title: string;
  /** Brief description */
  description: string;
  /** Genre tags */
  genres: string[];
  /** One-sentence logline */
  logline: string;
  /** Character roster */
  characters: CharacterConfig[];
  /** Central themes to track */
  themes: string[];
  /** AI behavior configuration */
  ai: AIConfig;
  /** Tracking categories used in this project */
  trackingCategories: string[];
  /** Note authors (initials) */
  noteAuthors: string[];
  /** Project metadata */
  meta?: {
    createdAt?: Date;
    updatedAt?: Date;
    version?: string;
    author?: string;
  };
}

// =============================================================================
// PROJECT DATA (Combined config + script data)
// =============================================================================

export interface ProjectData {
  config: ProjectConfig;
  sequences: Sequence[];
}
