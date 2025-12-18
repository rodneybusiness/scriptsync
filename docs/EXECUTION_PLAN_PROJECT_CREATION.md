# ScriptSync Project Creation Enhancement - Execution Plan

> Generated: December 18, 2025
> **Updated: December 18, 2025** - Reflects recent UX overhaul changes
> Status: Planning Complete - Ready for Implementation
> Branch: `claude/align-project-creation-ui-0US27`

## Executive Summary

The current Import Wizard captures approximately **15% of the richness** demonstrated in the 8 Billion Genies sample project. This plan outlines how to close that gap through a **Multi-Path Architecture** that provides maximum power with minimum friction.

---

## Recent Codebase Changes (December 18, 2025)

> **IMPORTANT:** The following changes were implemented and must be reflected in this plan:

### Theme Model Restructured
- **OLD (deprecated):** `themes: string[]` - Simple array of theme words
- **NEW (preferred):** `theme: ThemeStatement` - Structured argument model
  ```typescript
  interface ThemeStatement {
    core: string;           // "Control destroys what makes life worth living"
    counterArgument: string; // "Without control, chaos destroys everything"
  }
  ```
- **Added:** `motifs: string[]` - Recurring visual/symbolic elements (separate from theme)
- Both formats accepted for backwards compatibility

### Scene Status Added
```typescript
type SceneStatus = 'draft' | 'review' | 'polished' | 'locked';
```
Scenes now have optional `status` field for workflow tracking.

### ContextPanel Tab Restructuring
- **Renamed:** "Goals" → "Passes" (industry terminology for rewrite work items)
- **Removed:** Standalone "Feedback" tab
- **Merged:** Studio feedback into Notes tab with source labels (`[AMAZON]`, `[POINT GREY]`)
- **Simplified:** "Track" tab (removed themes/constraints clutter)

### Character Analysis Overhauled
New `src/services/characterAnalysis.ts` replaces academic metrics with writer-useful data:
- **Removed:** complexity%, aggression%, questions% (not useful)
- **Added:**
  - Verbal tics detection (fillers, catchphrases, speech patterns)
  - Speaking partners analysis (who do they talk to most?)
  - Emotional register tracking (conflict, intimate, elevated, comedic)
  - Arc markers (first/last appearance, peak activity scene)

### Navigation Enhanced
- Project stats bar (estimated pages, scene count, notes count)
- Quick filters: All, Has Notes, Incomplete, Needs Work
- Scene badges: page estimate, note count, beat progress, status indicator

---

## Part 1: Current State Analysis

### What 8 Billion Genies Contains (4,117 lines total)

| Category | Volume | Lines | Currently Captured |
|----------|--------|-------|-------------------|
| Characters | 21 detailed profiles | ~300 | Brief name/role only |
| AI CustomInstructions | Comprehensive | ~750 | None |
| RewriteGoals | 32 items | ~400 | None |
| Page Notes | 47 (Amazon + Point Grey) | ~200 | None |
| Open Questions | 20 by priority | ~50 | None |
| Sequences | 8 with dramatic questions | ~100 | Structure only |
| Scenes | 32+ with full content | ~2,000 | Basic parsing |
| Theme | Core argument + counter | ~10 | ✓ NEW: Structured model |
| Motifs | Recurring symbols | ~5 | ✓ NEW: Separate field |

### What ImportWizard Currently Captures

```
src/components/ImportWizard.tsx - Line 306-373

Collects:
- Project Name (text input)
- 4 AI toggles (scene detection, character classification, beat generation, connection mapping)
- Auto-accept threshold slider (50-100%)
```

### The Gap

```
┌─────────────────────────────────────────────────────────────────┐
│ IMPORT WIZARD                    │ 8 BILLION GENIES SAMPLE     │
├─────────────────────────────────────────────────────────────────┤
│ projectName ─────────────────────│ config.title                │
│ (auto-extracted)                 │ config.id                   │
│                                  │ config.description          │
│                                  │ config.genres[]             │
│                                  │ config.logline              │
│                                  │ config.characters[] (21 detailed) │
│                                  │ config.theme (NEW structured)│
│                                  │ config.motifs[] (NEW)       │
│                                  │ config.trackingCategories[] │
│                                  │ config.noteAuthors[]        │
│                                  │ config.settings[]           │
│                                  │ config.ai.styleReferences[] │
│                                  │ config.ai.toneDescriptor    │
│                                  │ config.ai.uniqueConstraints[] │
│                                  │ config.ai.customInstructions (750+ lines) │
│                                  │ rewriteData.goals[] (32)    │
│                                  │ rewriteData.pageNotes (47)  │
│                                  │ rewriteData.openQuestions   │
│                                  │ rewriteData.summary         │
│                                  │ sequences[].dramaticQuestion │
│                                  │ sequences[].climax          │
│                                  │ sequences[].resolution      │
│                                  │ scenes[].connections[]      │
│                                  │ scenes[].beats[] (enriched) │
│                                  │ scenes[].notes[] (typed)    │
│                                  │ scenes[].tracking[]         │
│                                  │ scenes[].status (NEW)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 2: Recommended Solution - Multi-Path Architecture

After analyzing 43 approaches across 11 categories, the optimal solution combines:

### The Stacked Solution

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT CREATION PATHS                       │
├──────────────┬──────────────┬─────────────┬────────────────────┤
│ 1. Script    │ 2. Idea      │ 3. Template │ 4. AI JSON        │
│    Import    │    Start     │    Clone    │    Import         │
│  (existing)  │   (NEW)      │   (NEW)     │   (NEW)           │
├──────────────┼──────────────┼─────────────┼────────────────────┤
│ Upload docs  │ 3 fields:    │ Clone 8BG   │ Paste JSON from   │
│ AI processes │ - Title      │ structure,  │ Claude Project    │
│ QC review    │ - Logline    │ clear data  │ or ChatGPT GPT    │
│              │ - Genre      │             │                    │
│              │ AI expands   │             │ Full validation   │
└──────────────┴──────────────┴─────────────┴────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  POST-CREATION ENRICHMENT     │
              │  (Progressive Enhancement)    │
              ├───────────────────────────────┤
              │  - Character detail editor    │
              │  - Rewrite passes panel       │
              │  - Notes import (CSV/MD)      │
              │  - AI-assisted expansion      │
              │  - Theme statement editor     │
              └───────────────────────────────┘
```

### Why This Approach

1. **External AI Agent Pattern** (Power: 10/10, Work: 3/10)
   - Claude Projects / ChatGPT GPTs handle the heavy synthesis
   - User works in natural conversation to develop rich project data
   - Export as JSON, import into ScriptSync
   - Keeps ScriptSync focused on its core strengths

2. **Multiple Entry Points** (Flexibility)
   - Script Import: For users with existing screenplays
   - Idea Start: For projects at conception stage
   - Template Clone: Learn by example, instant richness
   - AI JSON Import: Maximum power users

3. **Progressive Enhancement** (Usability)
   - Start minimal, enrich over time
   - No overwhelming onboarding forms
   - Data grows with the project

---

## Part 3: Implementation Phases

### Phase 1: Foundation (Priority: CRITICAL)

#### 1.1 AI JSON Import Component

**File:** `src/components/ImportFromAI.tsx` (NEW)

**Why First:** Unlocks the external AI agent pattern immediately.

```typescript
/**
 * ImportFromAI - Import project data from Claude/ChatGPT JSON
 *
 * Validates against ProjectData schema and provides helpful error messages.
 * Supports both legacy themes[] and new theme: ThemeStatement formats.
 */

import React, { useState, useCallback } from 'react';
import { ProjectData, ProjectConfig, Sequence, RewriteData, ThemeStatement } from '../config/types';

interface ImportFromAIProps {
  onComplete: (projectData: ProjectData) => void;
  onCancel: () => void;
}

// Manual validation (Zod not installed in this project)
const validateProjectData = (data: unknown): {
  valid: boolean;
  data?: ProjectData;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid JSON object'], warnings: [] };
  }

  const d = data as Record<string, unknown>;

  // Validate config
  if (!d.config || typeof d.config !== 'object') {
    errors.push('Missing config object');
  } else {
    const config = d.config as Record<string, unknown>;
    if (typeof config.title !== 'string' || !config.title) {
      errors.push('config.title is required (string)');
    }
    if (typeof config.id !== 'string' || !config.id) {
      errors.push('config.id is required (kebab-case string)');
    }
    if (typeof config.logline !== 'string') {
      errors.push('config.logline is required (string)');
    }
    if (!Array.isArray(config.characters)) {
      errors.push('config.characters must be an array');
    } else {
      config.characters.forEach((char: unknown, i: number) => {
        const c = char as Record<string, unknown>;
        if (typeof c?.name !== 'string') {
          errors.push(`config.characters[${i}].name is required`);
        }
        if (!['main', 'supporting', 'minor'].includes(c?.role as string)) {
          errors.push(`config.characters[${i}].role must be 'main', 'supporting', or 'minor'`);
        }
      });
    }
    if (!Array.isArray(config.genres)) {
      errors.push('config.genres must be an array of strings');
    }

    // Theme validation - accept EITHER format
    const hasLegacyThemes = Array.isArray(config.themes);
    const hasNewTheme = config.theme && typeof config.theme === 'object';

    if (!hasLegacyThemes && !hasNewTheme) {
      warnings.push('No theme data provided. Consider adding config.theme with core and counterArgument.');
    } else if (hasLegacyThemes && !hasNewTheme) {
      warnings.push('Using legacy themes[] format. Consider migrating to theme: { core, counterArgument }.');
    } else if (hasNewTheme) {
      const theme = config.theme as Record<string, unknown>;
      if (typeof theme.core !== 'string') {
        errors.push('config.theme.core is required (string)');
      }
      if (typeof theme.counterArgument !== 'string') {
        errors.push('config.theme.counterArgument is required (string)');
      }
    }

    // Motifs validation (optional)
    if (config.motifs !== undefined && !Array.isArray(config.motifs)) {
      errors.push('config.motifs must be an array of strings');
    }
  }

  // Validate sequences
  if (!Array.isArray(d.sequences)) {
    errors.push('sequences must be an array');
  } else {
    d.sequences.forEach((seq: unknown, i: number) => {
      const s = seq as Record<string, unknown>;
      if (typeof s?.id !== 'string') errors.push(`sequences[${i}].id required`);
      if (typeof s?.title !== 'string') errors.push(`sequences[${i}].title required`);
      if (!Array.isArray(s?.scenes)) errors.push(`sequences[${i}].scenes must be array`);

      // Validate scene status if present
      if (Array.isArray(s?.scenes)) {
        (s.scenes as unknown[]).forEach((scene: unknown, j: number) => {
          const sc = scene as Record<string, unknown>;
          if (sc?.status !== undefined) {
            if (!['draft', 'review', 'polished', 'locked'].includes(sc.status as string)) {
              errors.push(`sequences[${i}].scenes[${j}].status must be 'draft', 'review', 'polished', or 'locked'`);
            }
          }
        });
      }
    });
  }

  // Validate rewriteData if present (optional but encouraged)
  if (d.rewriteData !== undefined) {
    const rw = d.rewriteData as Record<string, unknown>;
    if (!Array.isArray(rw?.goals)) {
      errors.push('rewriteData.goals must be an array');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  return { valid: true, data: d as ProjectData, errors: [], warnings };
};

const ImportFromAI: React.FC<ImportFromAIProps> = ({ onComplete, onCancel }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [preview, setPreview] = useState<ProjectData | null>(null);

  const handleValidate = useCallback(() => {
    setErrors([]);
    setWarnings([]);
    setPreview(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const result = validateProjectData(parsed);

      if (result.valid && result.data) {
        setPreview(result.data);
        setWarnings(result.warnings);
      } else {
        setErrors(result.errors);
        setWarnings(result.warnings);
      }
    } catch (e) {
      setErrors([`JSON Parse Error: ${(e as Error).message}`]);
    }
  }, [jsonInput]);

  const handleImport = useCallback(() => {
    if (preview) {
      onComplete(preview);
    }
  }, [preview, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">Import from AI</h2>
          <p className="text-zinc-400 mt-1">
            Paste JSON from Claude Project or ChatGPT GPT
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`Paste your project JSON here...\n\nExample structure:\n{\n  "config": {\n    "id": "my-project",\n    "title": "My Screenplay",\n    "logline": "A brief description...",\n    "genres": ["Drama"],\n    "characters": [...],\n    "theme": {\n      "core": "The story argues...",\n      "counterArgument": "But the opposition says..."\n    },\n    "motifs": ["Water", "Clocks"]\n  },\n  "sequences": [...]\n}`}
            className="w-full h-64 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 font-mono text-sm placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
          />

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="p-4 bg-amber-900/20 border border-amber-900/50 rounded-lg">
              <div className="text-amber-400 font-medium mb-2">Warnings:</div>
              <ul className="text-sm text-amber-300 space-y-1">
                {warnings.map((warn, i) => (
                  <li key={i}>• {warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
              <div className="text-red-400 font-medium mb-2">Validation Errors:</div>
              <ul className="text-sm text-red-300 space-y-1">
                {errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="p-4 bg-green-900/20 border border-green-900/50 rounded-lg">
              <div className="text-green-400 font-medium mb-3">Valid Project Data</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Title:</span>
                  <span className="text-zinc-200 ml-2">{preview.config.title}</span>
                </div>
                <div>
                  <span className="text-zinc-500">ID:</span>
                  <span className="text-zinc-200 ml-2 font-mono">{preview.config.id}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Characters:</span>
                  <span className="text-zinc-200 ml-2">{preview.config.characters.length}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Sequences:</span>
                  <span className="text-zinc-200 ml-2">{preview.sequences.length}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Scenes:</span>
                  <span className="text-zinc-200 ml-2">
                    {preview.sequences.reduce((sum, s) => sum + s.scenes.length, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Theme Model:</span>
                  <span className="text-zinc-200 ml-2">
                    {preview.config.theme ? 'Structured' : preview.config.themes ? 'Legacy' : 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Motifs:</span>
                  <span className="text-zinc-200 ml-2">
                    {preview.config.motifs?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Has Rewrite Data:</span>
                  <span className="text-zinc-200 ml-2">
                    {preview.rewriteData ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleValidate}
              disabled={!jsonInput.trim()}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition"
            >
              Validate
            </button>
            <button
              onClick={handleImport}
              disabled={!preview}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold rounded-lg transition"
            >
              Import Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportFromAI;
```

#### 1.2 Add to ProjectSelector

**File:** `src/index.tsx`

**Changes Required:**

```typescript
// Line 33 - Add new mode
type AppMode = 'loading' | 'selector' | 'import' | 'import-ai' | 'project';

// Line 27 - Add lazy import
const ImportFromAI = lazy(() => import('./components/ImportFromAI'));

// In ProjectSelector component - Add new button after "Import Screenplay"
<button
  onClick={onImportFromAI}
  className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl text-left hover:border-purple-500/60 transition group"
>
  <div className="text-3xl mb-3">🤖</div>
  <div className="text-lg font-bold text-white group-hover:text-purple-400 transition">
    Import from AI
  </div>
  <div className="text-sm text-zinc-400">
    Paste JSON from Claude or ChatGPT
  </div>
</button>

// In Root component - Handle new mode
case 'import-ai':
  return (
    <Suspense fallback={<FullPageLoading message="Loading AI Import..." />}>
      <ImportFromAI
        onComplete={handleImportComplete}
        onCancel={() => setMode('selector')}
      />
    </Suspense>
  );
```

### Phase 2: Quick Start Path

#### 2.1 Quick Start Component

**File:** `src/components/QuickStart.tsx` (NEW)

Minimal 3-field form that expands via AI:
- Title (required)
- Logline (required)
- Genre (dropdown, required)

AI generates initial `ProjectConfig` with:
- Characters (main/supporting/minor)
- Theme statement (core + counter-argument) - **NEW FORMAT**
- Motifs - **NEW FIELD**
- Tracking categories
- Default scene status: 'draft' - **NEW FIELD**

#### 2.2 AI Expansion Service

**File:** `src/services/aiExpander.ts` (NEW)

```typescript
/**
 * Generate initial project config from minimal user input
 * Uses Claude via existing geminiService patterns
 */

import { ProjectConfig, CharacterConfig, ThemeStatement } from '../config/types';

interface QuickStartInput {
  title: string;
  logline: string;
  genres: string[];
}

export const generateQuickStartConfig = async (
  input: QuickStartInput
): Promise<ProjectConfig> => {
  // Implementation will call Claude API with structured output prompt
  // Returns a complete ProjectConfig with:
  // - theme: ThemeStatement (core + counterArgument)
  // - motifs: string[]
  // - characters with arcs
  // - ai settings suggestions
};
```

**Note:** The `callClaude` function in `geminiService.ts` is internal. Options:
1. Export `callClaude` from geminiService.ts
2. Create new exported function `generateQuickStartConfig` in geminiService.ts
3. Create separate service file that duplicates API call logic

**Recommended:** Option 2 - Add to existing service.

### Phase 3: Template Clone Path

#### 3.1 Clone Template Component

**File:** `src/components/CloneTemplate.tsx` (NEW)

- Lists available templates (8 Billion Genies, Bell Bottoms)
- Shows preview of template structure
- Clones with data cleared, structure preserved
- User enters new title/logline
- **NEW:** Also offer a "Minimal Template" with just basic structure

### Phase 4: Claude Project Template

#### 4.1 Instructions Document

Create instructions that users can paste into a Claude Project:

```markdown
# ScriptSync Project Generator

You are a screenplay development assistant. Help the user develop their project
and generate ScriptSync-compatible JSON.

## Your Capabilities

1. **Discuss the project** - Ask questions about characters, plot, themes
2. **Develop character arcs** - Help write detailed character profiles
3. **Craft the theme** - Develop core argument AND counter-argument
4. **Identify motifs** - Recurring visual/symbolic elements
5. **Create rewrite passes** - Identify areas needing work (not "goals")
6. **Generate JSON** - Output validated ProjectData JSON

## Output Format

When the user says "generate JSON" or "export for ScriptSync", output:

\`\`\`json
{
  "config": {
    "id": "kebab-case-id",
    "title": "Project Title",
    "description": "Brief description",
    "genres": ["Genre1", "Genre2"],
    "logline": "One sentence logline",
    "characters": [
      {
        "name": "Character Name",
        "role": "main|supporting|minor",
        "description": "Multi-paragraph description...",
        "arc": "TRANSFORMATION TYPE: Character arc description...",
        "aliases": ["Nickname", "Alt Name"]
      }
    ],
    "theme": {
      "core": "The story argues that [complete moral statement]",
      "counterArgument": "But the opposition position is [complete opposing statement]"
    },
    "motifs": ["Recurring Symbol 1", "Recurring Symbol 2"],
    "ai": {
      "styleReferences": ["Writer1", "Writer2"],
      "toneDescriptor": "Genre/Tone Specialist",
      "uniqueConstraints": ["Constraint1"],
      "customInstructions": "Detailed AI behavior instructions..."
    },
    "trackingCategories": ["Character Arc", "Theme", "Setup/Payoff"],
    "noteAuthors": ["AUTHOR1", "AUTHOR2"]
  },
  "sequences": [
    {
      "id": "SEQ_1",
      "title": "Sequence Title",
      "dramaticQuestion": "What is at stake?",
      "climax": "The turning point",
      "resolution": "How it resolves",
      "scenes": [
        {
          "id": "SC-001",
          "sequenceId": "SEQ_1",
          "title": "Scene Title",
          "pageNumber": 1,
          "scriptContent": "INT. LOCATION - DAY\n\nAction...",
          "beats": [],
          "notes": [],
          "tracking": [],
          "summary": "Brief scene summary",
          "status": "draft"
        }
      ]
    }
  ],
  "rewriteData": {
    "goals": [
      {
        "id": "RW-001",
        "goal": "What needs to be addressed",
        "actsAffected": ["ACT ONE"],
        "priority": "CRITICAL|HIGH|MEDIUM|LOW",
        "status": "🔴 REBREAK|🟡 POLISH|🟠 REWORK",
        "sources": ["Note source"],
        "concreteNextMove": "Specific action to take",
        "currentDraftHandling": {},
        "implementationNotes": "",
        "whatsStillOff": ""
      }
    ],
    "pageNotes": { "amazon": {}, "pointGrey": {} },
    "openQuestions": { "critical": [], "high": [], "medium": [], "low": [] },
    "summary": { "total": 0, "byStatus": { "rebreak": 0, "polish": 0, "rework": 0 }, "byPriority": { "critical": 0, "high": 0, "medium": 0, "low": 0 } }
  }
}
\`\`\`

## Theme Development Guide

A proper theme is NOT a single word like "love" or "identity". It's a complete moral argument:

**Good theme:**
- core: "Control destroys what makes life worth living"
- counterArgument: "Without control, chaos destroys everything"

**Bad theme:**
- themes: ["Control", "Freedom", "Family"]

Help users develop their theme as an argument with tension.

## Conversation Flow

1. Start by asking about the project concept
2. Develop characters through discussion (ask about arcs, relationships)
3. Craft the theme as argument + counter-argument
4. Identify recurring motifs
5. Help formulate rewrite passes if applicable
6. Generate JSON when ready
```

---

## Part 4: Implementation Checklist

### Critical Path (Do First)

- [ ] **1.1** Create `ImportFromAI.tsx` component (with updated validation)
- [ ] **1.2** Add "Import from AI" button to ProjectSelector
- [ ] **1.3** Add `import-ai` mode handling in Root component
- [ ] **1.4** Test with sample JSON export from 8BG

### Quick Start Path (High Priority)

- [ ] **2.1** Create `QuickStart.tsx` component
- [ ] **2.2** Add `generateQuickStartConfig` to geminiService.ts
- [ ] **2.3** Add "Quick Start" button to ProjectSelector

### Template Clone Path (Medium Priority)

- [ ] **3.1** Create `CloneTemplate.tsx` component
- [ ] **3.2** Add template selection to ProjectSelector
- [ ] **3.3** Create "Minimal Template" option

### External AI Agent (Documentation Only)

- [ ] **4.1** Create Claude Project instructions markdown (updated for new theme model)
- [ ] **4.2** Test instructions produce valid JSON
- [ ] **4.3** Document in README

### Post-Creation Enrichment (Future)

- [ ] **5.1** Character detail editor in ProjectManager
- [ ] **5.2** Rewrite passes editor (renamed from "goals")
- [ ] **5.3** Notes import (CSV/Markdown parser)
- [ ] **5.4** Theme statement editor (core + counter-argument)
- [ ] **5.5** Scene status workflow editor

---

## Part 5: Technical Dependencies

### Already Available
- React 19.2.0
- TypeScript 5.8.2
- Claude API integration (geminiService.ts)
- Gemini API integration (ingestion/aiProcessor.ts)
- Storage service (localStorage)
- Project loading/saving infrastructure
- **NEW:** Character analysis service (`src/services/characterAnalysis.ts`)
- **NEW:** Theme model types (`ThemeStatement` in types.ts)
- **NEW:** Scene status type (`SceneStatus` in types.ts)

### NOT Available (Do Not Use)
- ❌ Zod (not installed - use manual validation)
- ❌ Direct `callClaude` export (internal function)

### Services to Modify
- `src/services/geminiService.ts` - Add `generateQuickStartConfig` export
- `src/index.tsx` - Add new creation paths

### Recent Changes to Account For
- `src/config/types.ts` - Now has `ThemeStatement`, `SceneStatus`, `motifs[]`
- `src/components/ContextPanel.tsx` - "Goals" renamed to "Passes"
- `src/components/CharacterDashboard.tsx` - Uses new `characterAnalysis.ts` service
- `src/components/Navigation.tsx` - Has badges, filters, stats bar

---

## Part 6: Sample Test Data

### Minimal Valid ProjectData (NEW FORMAT)

```json
{
  "config": {
    "id": "test-project",
    "title": "Test Project",
    "logline": "A test screenplay for validation.",
    "genres": ["Drama"],
    "characters": [
      {
        "name": "Protagonist",
        "role": "main",
        "arc": "SKEPTIC → BELIEVER: Learns to trust"
      }
    ],
    "theme": {
      "core": "Trust requires vulnerability",
      "counterArgument": "Vulnerability invites exploitation"
    },
    "motifs": ["Locked doors", "Handshakes"]
  },
  "sequences": [
    {
      "id": "SEQ_1",
      "title": "Act One",
      "dramaticQuestion": "Will they succeed?",
      "climax": "The reveal",
      "resolution": "Understanding dawns",
      "scenes": [
        {
          "id": "SC-001",
          "sequenceId": "SEQ_1",
          "title": "Opening Scene",
          "pageNumber": 1,
          "scriptContent": "INT. ROOM - DAY\n\nPROTAGONIST enters.",
          "beats": [],
          "notes": [],
          "tracking": [],
          "summary": "Introduction",
          "status": "draft"
        }
      ]
    }
  ]
}
```

### Legacy Format (Still Accepted)

```json
{
  "config": {
    "id": "legacy-project",
    "title": "Legacy Project",
    "logline": "A project using old format.",
    "genres": ["Comedy"],
    "characters": [
      { "name": "Hero", "role": "main" }
    ],
    "themes": ["Identity", "Growth"]
  },
  "sequences": []
}
```

---

## Part 7: Success Metrics

After implementation:

1. **Time to First Project**: < 30 seconds (Idea Start)
2. **Richness Ceiling**: 100% of 8BG capability (AI JSON Import)
3. **User Choice**: 4 distinct paths matching different starting points
4. **Zero Data Loss**: All imported data preserved and usable
5. **Theme Quality**: Projects created with structured theme model (core + counter)
6. **Character Analysis**: Imported characters work with new analysis dashboard

---

## Appendix A: File Structure After Implementation

```
src/
├── components/
│   ├── ImportWizard.tsx      (existing - enhanced)
│   ├── ImportFromAI.tsx      (NEW - Phase 1)
│   ├── QuickStart.tsx        (NEW - Phase 2)
│   ├── CloneTemplate.tsx     (NEW - Phase 3)
│   ├── ContextPanel.tsx      (MODIFIED - "Passes" tab)
│   ├── CharacterDashboard.tsx (MODIFIED - new analysis)
│   ├── Navigation.tsx        (MODIFIED - badges, filters)
│   └── ProjectOverview.tsx   (MODIFIED - theme display)
├── services/
│   ├── geminiService.ts      (modify - add generateQuickStartConfig)
│   ├── characterAnalysis.ts  (NEW - writer-focused metrics)
│   └── ingestion/
│       └── aiProcessor.ts    (existing)
├── index.tsx                 (modify - add new modes)
└── config/
    └── types.ts              (MODIFIED - ThemeStatement, SceneStatus, motifs)

docs/
├── EXECUTION_PLAN_PROJECT_CREATION.md (this file)
└── claude-project-template.md (NEW - Phase 4)
```

---

## Appendix B: Codebase Reference

Key files for context during implementation:

| File | Lines | Purpose |
|------|-------|---------|
| `src/config/types.ts` | ~275 | All type definitions (UPDATED: ThemeStatement, SceneStatus) |
| `src/index.tsx` | 345 | App entry, ProjectSelector |
| `src/components/ImportWizard.tsx` | 634 | Existing import flow |
| `src/services/geminiService.ts` | ~400 | Claude API integration |
| `src/services/characterAnalysis.ts` | ~280 | NEW: Writer-focused character metrics |
| `src/components/ContextPanel.tsx` | ~900 | UPDATED: "Passes" tab, merged Studio feedback |
| `src/components/CharacterDashboard.tsx` | ~455 | UPDATED: Speaking partners, verbal tics, arc markers |
| `src/components/Navigation.tsx` | ~280 | UPDATED: Badges, filters, stats |
| `src/projects/8-billion-genies/config.ts` | 1,474 | Reference implementation |
| `src/projects/8-billion-genies/sequences.ts` | 2,615 | Sequence/scene structure |

---

## Appendix C: Migration Notes

### For Existing Projects Using Legacy `themes[]`

When importing or loading projects with the old `themes: string[]` format:
1. Display them in ProjectOverview with "(legacy format)" indicator
2. Encourage users to update to structured theme model
3. Both formats work - no forced migration

### Tab Name Changes

If any code references old tab names:
- "Goals" → "Passes"
- "Feedback" → Merged into "Notes"

### Character Metrics

Old `analyzeCharacterVoice` metrics are deprecated:
- ❌ complexity% - removed
- ❌ aggression% - removed
- ❌ questions% - removed

New metrics from `characterAnalysis.ts`:
- ✓ totalLines
- ✓ avgWordsPerLine
- ✓ verbalTics[]
- ✓ speakingPartners[]
- ✓ emotionalBeats[]
- ✓ firstAppearance, lastAppearance, peakActivity

---

*This document serves as the complete planning record for the ScriptSync Project Creation Enhancement initiative. Implementation can proceed phase by phase, with Phase 1 (AI JSON Import) providing immediate value.*

*Last updated to reflect December 18, 2025 UX overhaul: theme model restructuring, character analysis overhaul, navigation enhancements, tab restructuring.*
