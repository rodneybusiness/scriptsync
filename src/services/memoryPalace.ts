/**
 * Memory Palace - Persistent AI memory using IndexedDB
 *
 * Stores character voice models, corrections, continuity facts,
 * and user preferences. Survives page refreshes and sessions.
 */

// Voice fingerprint for a character
export interface CharacterVoice {
  characterName: string;
  projectId: string;
  updatedAt: number;

  // Linguistic patterns
  avgSentenceLength: number;
  usesContractions: boolean;
  vocabularyTier: 'formal' | 'casual' | 'street' | 'technical' | 'mixed';
  verbalTics: string[]; // "Look," "I mean," etc.
  avoidPatterns: string[]; // Things they'd never say

  // Sample dialogue (for few-shot prompting)
  dialogueSamples: string[];

  // User corrections
  corrections: {
    timestamp: number;
    original: string;
    feedback: string;
  }[];
}

// A fact about the story world (for continuity)
export interface StoryFact {
  id: string;
  projectId: string;
  sceneId: string; // Where established
  category: 'prop' | 'location' | 'timeline' | 'character_state' | 'knowledge';
  subject: string; // e.g., "the gun", "Maya", "apartment"
  fact: string; // e.g., "is in Jake's car", "knows about the affair"
  establishedAt: number;
  invalidatedAt?: number; // If the fact was superseded
  invalidatedBy?: string; // Scene that invalidated it
}

// A suggestion shown to the user
export interface Suggestion {
  id: string;
  projectId: string;
  sceneId: string;
  lineNumber?: number;
  type: 'voice' | 'continuity' | 'style';
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion?: string;
  createdAt: number;
  status: 'pending' | 'accepted' | 'dismissed' | 'expired';
  agentId: string;
}

// User style preferences
export interface StylePreference {
  projectId: string;
  key: string;
  value: string;
  learnedFrom: string; // What correction taught us this
  createdAt: number;
}

const DB_NAME = 'scriptsync-memory-palace';
const DB_VERSION = 1;

class MemoryPalaceDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open Memory Palace:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Character voices store
        if (!db.objectStoreNames.contains('voices')) {
          const voiceStore = db.createObjectStore('voices', {
            keyPath: ['projectId', 'characterName'],
          });
          voiceStore.createIndex('byProject', 'projectId');
        }

        // Story facts store
        if (!db.objectStoreNames.contains('facts')) {
          const factStore = db.createObjectStore('facts', { keyPath: 'id' });
          factStore.createIndex('byProject', 'projectId');
          factStore.createIndex('byScene', 'sceneId');
          factStore.createIndex('bySubject', ['projectId', 'subject']);
        }

        // Suggestions store
        if (!db.objectStoreNames.contains('suggestions')) {
          const sugStore = db.createObjectStore('suggestions', { keyPath: 'id' });
          sugStore.createIndex('byProject', 'projectId');
          sugStore.createIndex('byScene', 'sceneId');
          sugStore.createIndex('byStatus', ['projectId', 'status']);
        }

        // Style preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          const prefStore = db.createObjectStore('preferences', {
            keyPath: ['projectId', 'key'],
          });
          prefStore.createIndex('byProject', 'projectId');
        }
      };
    });

    return this.initPromise;
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // Character Voice Methods
  async getCharacterVoice(projectId: string, characterName: string): Promise<CharacterVoice | undefined> {
    const store = await this.getStore('voices');
    return new Promise((resolve, reject) => {
      const request = store.get([projectId, characterName]);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveCharacterVoice(voice: CharacterVoice): Promise<void> {
    const store = await this.getStore('voices', 'readwrite');
    return new Promise((resolve, reject) => {
      voice.updatedAt = Date.now();
      const request = store.put(voice);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProjectVoices(projectId: string): Promise<CharacterVoice[]> {
    const store = await this.getStore('voices');
    const index = store.index('byProject');
    return new Promise((resolve, reject) => {
      const request = index.getAll(projectId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addVoiceCorrection(
    projectId: string,
    characterName: string,
    original: string,
    feedback: string
  ): Promise<void> {
    let voice = await this.getCharacterVoice(projectId, characterName);

    if (!voice) {
      voice = {
        characterName,
        projectId,
        updatedAt: Date.now(),
        avgSentenceLength: 0,
        usesContractions: true,
        vocabularyTier: 'mixed',
        verbalTics: [],
        avoidPatterns: [],
        dialogueSamples: [],
        corrections: [],
      };
    }

    voice.corrections.push({
      timestamp: Date.now(),
      original,
      feedback,
    });

    // Keep only last 20 corrections
    if (voice.corrections.length > 20) {
      voice.corrections = voice.corrections.slice(-20);
    }

    await this.saveCharacterVoice(voice);
  }

  // Story Facts Methods
  async addFact(fact: Omit<StoryFact, 'id' | 'establishedAt'>): Promise<string> {
    const store = await this.getStore('facts', 'readwrite');
    const id = `fact_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const fullFact: StoryFact = {
      ...fact,
      id,
      establishedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.add(fullFact);
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getFactsForSubject(projectId: string, subject: string): Promise<StoryFact[]> {
    const store = await this.getStore('facts');
    const index = store.index('bySubject');
    return new Promise((resolve, reject) => {
      const request = index.getAll([projectId, subject]);
      request.onsuccess = () => resolve(request.result.filter(f => !f.invalidatedAt));
      request.onerror = () => reject(request.error);
    });
  }

  async getFactsForScene(sceneId: string): Promise<StoryFact[]> {
    const store = await this.getStore('facts');
    const index = store.index('byScene');
    return new Promise((resolve, reject) => {
      const request = index.getAll(sceneId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async invalidateFact(factId: string, invalidatedBySceneId: string): Promise<void> {
    const store = await this.getStore('facts', 'readwrite');
    return new Promise((resolve, reject) => {
      const getReq = store.get(factId);
      getReq.onsuccess = () => {
        const fact = getReq.result;
        if (fact) {
          fact.invalidatedAt = Date.now();
          fact.invalidatedBy = invalidatedBySceneId;
          store.put(fact);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  // Suggestions Methods
  async addSuggestion(suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const store = await this.getStore('suggestions', 'readwrite');
    const id = `sug_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const fullSuggestion: Suggestion = {
      ...suggestion,
      id,
      createdAt: Date.now(),
      status: 'pending',
    };

    return new Promise((resolve, reject) => {
      const request = store.add(fullSuggestion);
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingSuggestions(projectId: string): Promise<Suggestion[]> {
    const store = await this.getStore('suggestions');
    const index = store.index('byStatus');
    return new Promise((resolve, reject) => {
      const request = index.getAll([projectId, 'pending']);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSuggestionsForScene(sceneId: string): Promise<Suggestion[]> {
    const store = await this.getStore('suggestions');
    const index = store.index('byScene');
    return new Promise((resolve, reject) => {
      const request = index.getAll(sceneId);
      request.onsuccess = () => resolve(request.result.filter(s => s.status === 'pending'));
      request.onerror = () => reject(request.error);
    });
  }

  async updateSuggestionStatus(id: string, status: Suggestion['status']): Promise<void> {
    const store = await this.getStore('suggestions', 'readwrite');
    return new Promise((resolve, reject) => {
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const suggestion = getReq.result;
        if (suggestion) {
          suggestion.status = status;
          store.put(suggestion);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  // Style Preferences Methods
  async setPreference(projectId: string, key: string, value: string, learnedFrom: string): Promise<void> {
    const store = await this.getStore('preferences', 'readwrite');
    const pref: StylePreference = {
      projectId,
      key,
      value,
      learnedFrom,
      createdAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(pref);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPreference(projectId: string, key: string): Promise<string | undefined> {
    const store = await this.getStore('preferences');
    return new Promise((resolve, reject) => {
      const request = store.get([projectId, key]);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPreferences(projectId: string): Promise<StylePreference[]> {
    const store = await this.getStore('preferences');
    const index = store.index('byProject');
    return new Promise((resolve, reject) => {
      const request = index.getAll(projectId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all data for a project
  async clearProject(projectId: string): Promise<void> {
    const stores = ['voices', 'facts', 'suggestions', 'preferences'];

    for (const storeName of stores) {
      const store = await this.getStore(storeName, 'readwrite');
      const index = store.index('byProject');

      await new Promise<void>((resolve, reject) => {
        const request = index.getAllKeys(projectId);
        request.onsuccess = () => {
          for (const key of request.result) {
            store.delete(key);
          }
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    }
  }
}

// Singleton instance
export const memoryPalace = new MemoryPalaceDB();
