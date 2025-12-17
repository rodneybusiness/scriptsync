/**
 * Version History Service
 *
 * Provides comprehensive version control for screenplay scenes:
 * - Automatic snapshots on significant changes
 * - Manual save points
 * - Diff generation between versions
 * - Version restoration
 * - Space-efficient storage with pruning
 */

import { Scene } from '../config/types';

// =============================================================================
// TYPES
// =============================================================================

export interface SceneVersion {
  id: string;
  sceneId: string;
  timestamp: number;
  label?: string; // Optional user label (e.g., "Before major rewrite")
  snapshot: SceneSnapshot;
  changeType: ChangeType;
  changeSummary: string;
  author?: string;
}

export interface SceneSnapshot {
  title: string;
  summary: string;
  scriptContent: string;
  beats: string; // JSON-stringified beats for compact storage
  location: string;
  timeOfDay: string;
}

export type ChangeType =
  | 'initial'
  | 'content_edit'
  | 'beats_update'
  | 'metadata_change'
  | 'manual_save'
  | 'ai_suggestion'
  | 'merge'
  | 'restore';

export interface VersionDiff {
  field: keyof SceneSnapshot;
  label: string;
  before: string;
  after: string;
  changePercent: number; // Percentage of text changed
}

export interface VersionHistoryOptions {
  maxVersionsPerScene?: number; // Default 50
  autoSaveInterval?: number; // Milliseconds between auto-saves (0 = disabled)
  minChangeThreshold?: number; // Minimum characters changed to create version
  storageKey?: string;
}

// =============================================================================
// STORAGE CONSTANTS
// =============================================================================

const DEFAULT_OPTIONS: Required<VersionHistoryOptions> = {
  maxVersionsPerScene: 50,
  autoSaveInterval: 0, // Disabled by default
  minChangeThreshold: 10,
  storageKey: 'scriptsync_versions',
};

const PRUNE_KEEP_RECENT = 10; // Always keep last N versions
const PRUNE_KEEP_LABELED = true; // Keep versions with labels

// =============================================================================
// VERSION STORE
// =============================================================================

interface VersionStore {
  versions: Record<string, SceneVersion[]>; // Keyed by sceneId
  lastUpdated: number;
}

/**
 * Load version store from localStorage
 */
const loadStore = (storageKey: string): VersionStore => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load version history:', e);
  }
  return { versions: {}, lastUpdated: Date.now() };
};

/**
 * Save version store to localStorage
 */
const saveStore = (store: VersionStore, storageKey: string): void => {
  try {
    store.lastUpdated = Date.now();
    localStorage.setItem(storageKey, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save version history:', e);

    // If storage is full, try to prune
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      pruneAllVersions(store, 20); // Aggressive prune
      try {
        localStorage.setItem(storageKey, JSON.stringify(store));
      } catch {
        console.error('Failed to save even after pruning');
      }
    }
  }
};

// =============================================================================
// VERSION OPERATIONS
// =============================================================================

/**
 * Create a snapshot from a scene
 */
const createSnapshot = (scene: Scene): SceneSnapshot => ({
  title: scene.title,
  summary: scene.summary,
  scriptContent: scene.scriptContent,
  beats: JSON.stringify(scene.beats),
  location: scene.location || '',
  timeOfDay: scene.timeOfDay || 'DAY',
});

/**
 * Generate a unique version ID
 */
const generateVersionId = (): string => {
  return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate similarity between two strings (0-1)
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  if (str1 === str2) return 1;
  if (!str1 || !str2) return 0;

  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;

  // Simple Levenshtein distance approximation for performance
  let matches = 0;

  // Count matching characters in order
  let j = 0;
  for (let i = 0; i < str1.length && j < str2.length; i++) {
    if (str1[i] === str2[j]) {
      matches++;
      j++;
    }
  }

  return matches / maxLen;
};

/**
 * Detect type of change between two snapshots
 */
const detectChangeType = (
  oldSnapshot: SceneSnapshot | null,
  newSnapshot: SceneSnapshot
): { type: ChangeType; summary: string } => {
  if (!oldSnapshot) {
    return { type: 'initial', summary: 'Initial version' };
  }

  const changes: string[] = [];

  if (oldSnapshot.scriptContent !== newSnapshot.scriptContent) {
    const sim = calculateSimilarity(oldSnapshot.scriptContent, newSnapshot.scriptContent);
    if (sim < 0.5) {
      changes.push('major content rewrite');
    } else if (sim < 0.9) {
      changes.push('content edits');
    } else {
      changes.push('minor content changes');
    }
  }

  if (oldSnapshot.beats !== newSnapshot.beats) {
    changes.push('beats updated');
  }

  if (oldSnapshot.title !== newSnapshot.title) {
    changes.push('title changed');
  }

  if (oldSnapshot.summary !== newSnapshot.summary) {
    changes.push('summary updated');
  }

  if (oldSnapshot.location !== newSnapshot.location || oldSnapshot.timeOfDay !== newSnapshot.timeOfDay) {
    changes.push('scene info updated');
  }

  if (changes.length === 0) {
    return { type: 'content_edit', summary: 'No changes detected' };
  }

  // Determine primary change type
  let type: ChangeType = 'content_edit';
  if (changes.includes('beats updated') && changes.length === 1) {
    type = 'beats_update';
  } else if (!changes.includes('major content rewrite') && !changes.includes('content edits')) {
    type = 'metadata_change';
  }

  return { type, summary: changes.join(', ') };
};

// =============================================================================
// PRUNING
// =============================================================================

/**
 * Prune versions for a single scene to stay within limits
 */
const pruneVersions = (
  versions: SceneVersion[],
  maxVersions: number
): SceneVersion[] => {
  if (versions.length <= maxVersions) return versions;

  // Sort by timestamp (newest first)
  const sorted = [...versions].sort((a, b) => b.timestamp - a.timestamp);

  // Always keep recent versions
  const recentVersions = sorted.slice(0, PRUNE_KEEP_RECENT);

  // Filter labeled versions from older ones
  const labeledVersions = PRUNE_KEEP_LABELED
    ? sorted.slice(PRUNE_KEEP_RECENT).filter(v => v.label)
    : [];

  // Keep initial version if it exists
  const initialVersion = sorted.find(v => v.changeType === 'initial');

  // Calculate how many more we can keep
  const remainingSlots = maxVersions - recentVersions.length - labeledVersions.length;

  // From remaining older versions, keep evenly distributed samples
  const olderVersions = sorted
    .slice(PRUNE_KEEP_RECENT)
    .filter(v => !v.label && v.changeType !== 'initial');

  const sampledVersions: SceneVersion[] = [];
  if (remainingSlots > 0 && olderVersions.length > 0) {
    const step = Math.max(1, Math.floor(olderVersions.length / remainingSlots));
    for (let i = 0; i < olderVersions.length && sampledVersions.length < remainingSlots; i += step) {
      sampledVersions.push(olderVersions[i]);
    }
  }

  // Combine and dedupe
  const combined = new Map<string, SceneVersion>();
  [...recentVersions, ...labeledVersions, ...sampledVersions].forEach(v => {
    combined.set(v.id, v);
  });
  if (initialVersion) combined.set(initialVersion.id, initialVersion);

  return Array.from(combined.values()).sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Prune all versions across all scenes
 */
const pruneAllVersions = (store: VersionStore, maxPerScene: number): void => {
  for (const sceneId of Object.keys(store.versions)) {
    store.versions[sceneId] = pruneVersions(store.versions[sceneId], maxPerScene);
  }
};

// =============================================================================
// DIFF GENERATION
// =============================================================================

/**
 * Generate a diff between two versions
 */
export const generateDiff = (
  oldVersion: SceneVersion,
  newVersion: SceneVersion
): VersionDiff[] => {
  const diffs: VersionDiff[] = [];

  const oldSnap = oldVersion.snapshot;
  const newSnap = newVersion.snapshot;

  const fields: { key: keyof SceneSnapshot; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'summary', label: 'Summary' },
    { key: 'scriptContent', label: 'Script Content' },
    { key: 'beats', label: 'Beats' },
    { key: 'location', label: 'Location' },
    { key: 'timeOfDay', label: 'Time of Day' },
  ];

  for (const { key, label } of fields) {
    const before = oldSnap[key];
    const after = newSnap[key];

    if (before !== after) {
      const similarity = calculateSimilarity(before, after);
      diffs.push({
        field: key,
        label,
        before,
        after,
        changePercent: Math.round((1 - similarity) * 100),
      });
    }
  }

  return diffs;
};

/**
 * Generate inline diff for text content (simple word-based)
 */
export const generateInlineDiff = (
  before: string,
  after: string
): { type: 'unchanged' | 'added' | 'removed'; text: string }[] => {
  const result: { type: 'unchanged' | 'added' | 'removed'; text: string }[] = [];

  const beforeWords = before.split(/\s+/);
  const afterWords = after.split(/\s+/);

  // Simple word-by-word comparison
  let bi = 0;
  let ai = 0;

  while (bi < beforeWords.length || ai < afterWords.length) {
    if (bi >= beforeWords.length) {
      // Remaining words are additions
      result.push({ type: 'added', text: afterWords.slice(ai).join(' ') });
      break;
    }

    if (ai >= afterWords.length) {
      // Remaining words are removals
      result.push({ type: 'removed', text: beforeWords.slice(bi).join(' ') });
      break;
    }

    if (beforeWords[bi] === afterWords[ai]) {
      // Match - collect consecutive matches
      const matchStart = bi;
      while (bi < beforeWords.length && ai < afterWords.length && beforeWords[bi] === afterWords[ai]) {
        bi++;
        ai++;
      }
      result.push({ type: 'unchanged', text: beforeWords.slice(matchStart, bi).join(' ') });
    } else {
      // Mismatch - look ahead to find next match
      let foundMatch = false;

      // Check if current before word appears later in after
      const afterIndex = afterWords.indexOf(beforeWords[bi], ai);
      if (afterIndex !== -1 && afterIndex - ai < 10) {
        // Words were added
        result.push({ type: 'added', text: afterWords.slice(ai, afterIndex).join(' ') });
        ai = afterIndex;
        foundMatch = true;
      }

      if (!foundMatch) {
        // Check if current after word appears later in before
        const beforeIndex = beforeWords.indexOf(afterWords[ai], bi);
        if (beforeIndex !== -1 && beforeIndex - bi < 10) {
          // Words were removed
          result.push({ type: 'removed', text: beforeWords.slice(bi, beforeIndex).join(' ') });
          bi = beforeIndex;
        } else {
          // Simple replacement
          result.push({ type: 'removed', text: beforeWords[bi] });
          result.push({ type: 'added', text: afterWords[ai] });
          bi++;
          ai++;
        }
      }
    }
  }

  return result;
};

// =============================================================================
// MAIN CLASS
// =============================================================================

export class VersionHistoryManager {
  private store: VersionStore;
  private options: Required<VersionHistoryOptions>;
  private lastSnapshots: Map<string, SceneSnapshot> = new Map();

  constructor(options: VersionHistoryOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.store = loadStore(this.options.storageKey);
  }

  /**
   * Record a new version for a scene
   */
  recordVersion(
    scene: Scene,
    changeType?: ChangeType,
    label?: string
  ): SceneVersion | null {
    const snapshot = createSnapshot(scene);
    const lastSnapshot = this.lastSnapshots.get(scene.id);

    // Check if change meets threshold
    if (lastSnapshot && !label) {
      const contentDiff = Math.abs(
        snapshot.scriptContent.length - lastSnapshot.scriptContent.length
      );
      const similarity = calculateSimilarity(snapshot.scriptContent, lastSnapshot.scriptContent);

      if (contentDiff < this.options.minChangeThreshold && similarity > 0.98) {
        // Change too small, don't record
        return null;
      }
    }

    // Detect change type if not provided
    const detection = changeType
      ? { type: changeType, summary: label || `${changeType} change` }
      : detectChangeType(lastSnapshot || null, snapshot);

    const version: SceneVersion = {
      id: generateVersionId(),
      sceneId: scene.id,
      timestamp: Date.now(),
      label,
      snapshot,
      changeType: detection.type,
      changeSummary: detection.summary,
    };

    // Initialize versions array if needed
    if (!this.store.versions[scene.id]) {
      this.store.versions[scene.id] = [];
    }

    // Add version
    this.store.versions[scene.id].unshift(version);

    // Prune if necessary
    this.store.versions[scene.id] = pruneVersions(
      this.store.versions[scene.id],
      this.options.maxVersionsPerScene
    );

    // Update last snapshot
    this.lastSnapshots.set(scene.id, snapshot);

    // Save to storage
    saveStore(this.store, this.options.storageKey);

    return version;
  }

  /**
   * Get version history for a scene
   */
  getHistory(sceneId: string): SceneVersion[] {
    return this.store.versions[sceneId] || [];
  }

  /**
   * Get a specific version
   */
  getVersion(sceneId: string, versionId: string): SceneVersion | null {
    const versions = this.store.versions[sceneId];
    if (!versions) return null;
    return versions.find(v => v.id === versionId) || null;
  }

  /**
   * Restore a scene to a previous version
   */
  restoreVersion(
    scene: Scene,
    versionId: string,
    updateCallback: (updates: Partial<Scene>) => void
  ): boolean {
    const version = this.getVersion(scene.id, versionId);
    if (!version) return false;

    // Record current state before restore
    this.recordVersion(scene, 'restore', `Before restore to ${version.label || new Date(version.timestamp).toLocaleString()}`);

    // Parse beats from snapshot
    let beats: Scene['beats'] = [];
    try {
      beats = JSON.parse(version.snapshot.beats);
    } catch {
      console.error('Failed to parse beats from version');
    }

    // Apply restoration
    const timeOfDay = version.snapshot.timeOfDay as Scene['timeOfDay'];
    updateCallback({
      title: version.snapshot.title,
      summary: version.snapshot.summary,
      scriptContent: version.snapshot.scriptContent,
      beats,
      location: version.snapshot.location,
      timeOfDay,
    });

    // Record restored state
    const restoredScene: Scene = {
      ...scene,
      title: version.snapshot.title,
      summary: version.snapshot.summary,
      scriptContent: version.snapshot.scriptContent,
      beats,
      location: version.snapshot.location,
      timeOfDay,
    };
    this.recordVersion(
      restoredScene,
      'restore',
      `Restored from ${version.label || new Date(version.timestamp).toLocaleString()}`
    );

    return true;
  }

  /**
   * Add a label to an existing version
   */
  labelVersion(sceneId: string, versionId: string, label: string): boolean {
    const versions = this.store.versions[sceneId];
    if (!versions) return false;

    const version = versions.find(v => v.id === versionId);
    if (!version) return false;

    version.label = label;
    saveStore(this.store, this.options.storageKey);
    return true;
  }

  /**
   * Delete a specific version
   */
  deleteVersion(sceneId: string, versionId: string): boolean {
    const versions = this.store.versions[sceneId];
    if (!versions) return false;

    const index = versions.findIndex(v => v.id === versionId);
    if (index === -1) return false;

    versions.splice(index, 1);
    saveStore(this.store, this.options.storageKey);
    return true;
  }

  /**
   * Clear all versions for a scene
   */
  clearHistory(sceneId: string): void {
    delete this.store.versions[sceneId];
    this.lastSnapshots.delete(sceneId);
    saveStore(this.store, this.options.storageKey);
  }

  /**
   * Get storage statistics
   */
  getStats(): {
    totalVersions: number;
    sceneCount: number;
    storageSize: number;
    oldestVersion: number | null;
    newestVersion: number | null;
  } {
    let totalVersions = 0;
    let oldestVersion: number | null = null;
    let newestVersion: number | null = null;

    for (const versions of Object.values(this.store.versions)) {
      totalVersions += versions.length;
      for (const v of versions) {
        if (oldestVersion === null || v.timestamp < oldestVersion) {
          oldestVersion = v.timestamp;
        }
        if (newestVersion === null || v.timestamp > newestVersion) {
          newestVersion = v.timestamp;
        }
      }
    }

    const storageSize = new Blob([JSON.stringify(this.store)]).size;

    return {
      totalVersions,
      sceneCount: Object.keys(this.store.versions).length,
      storageSize,
      oldestVersion,
      newestVersion,
    };
  }

  /**
   * Force save current state
   */
  save(): void {
    saveStore(this.store, this.options.storageKey);
  }

  /**
   * Export version history for backup
   */
  export(): string {
    return JSON.stringify(this.store, null, 2);
  }

  /**
   * Import version history from backup
   */
  import(data: string): boolean {
    try {
      const imported = JSON.parse(data) as VersionStore;
      if (!imported.versions || typeof imported.versions !== 'object') {
        return false;
      }
      this.store = imported;
      saveStore(this.store, this.options.storageKey);
      return true;
    } catch {
      return false;
    }
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let managerInstance: VersionHistoryManager | null = null;

export const getVersionHistoryManager = (
  options?: VersionHistoryOptions
): VersionHistoryManager => {
  if (!managerInstance) {
    managerInstance = new VersionHistoryManager(options);
  }
  return managerInstance;
};

export default VersionHistoryManager;
