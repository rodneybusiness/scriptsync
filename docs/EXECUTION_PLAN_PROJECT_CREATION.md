# ScriptSync Project Creation Enhancement - Execution Plan

> Generated: December 18, 2025
> **Updated: December 18, 2025** - Complete overhaul + UX polish + Timeline redesign
> Status: Planning Complete - Ready for Implementation
> Branch: `claude/align-project-creation-ui-0US27`

## Executive Summary

ScriptSync needs to meet screenwriters where they are. Most writers don't have JSON—they have ideas, scripts, or vague notions. This plan creates **four entry points** that collapse into a unified experience, with the most common path (Quick Start) promoted to equal priority with the power-user path (JSON Import).

**Key insight:** The 15% gap analysis is technically accurate but strategically wrong. Writers don't need 100% richness at creation time—they need to *start fast* and *enrich progressively*. The gap closes through use, not through onboarding forms.

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

### Navigation Streamlined
- **Removed from sidebar:** Stats bar, style references (moved to ProjectOverview)
- **Kept:** Quick filters, scene badges, genre tags (moved to bottom)
- **Philosophy:** Sidebar is for navigation only, not project metadata

### ProjectOverview Enhanced
- **Added:** Project stats in header (pages, sequences, scenes, notes)
- Stats now shown in the right place: the Project Info modal

### Timeline Completely Redesigned
The old dual-timeline view (for Bell Bottoms-style stories) replaced with **Story Structure** view:
- **Act Structure Bar:** Visual proportions of Act 1/2/3 with page counts
- **Sequence Blocks:** Density visualization showing scene count and pages per sequence
- **Character Presence Swimlanes:** When do main characters appear/disappear across the script?
- **Scene Flow Grid:** Horizontal card layout with connection indicators
- **Color Coding:** Blue (Act 1), Amber (Act 2), Red (Act 3)

This is the standard template for 90% of screenplays. Multi-timeline view can be added as a toggle for projects like Bell Bottoms.

### SuggestionsPanel Cleanup
- **Removed:** "Voice OK" indicator (unnecessary noise)

### ProjectOverview Accessibility Improved
- **Problem:** ProjectOverview was hidden behind 2 clicks (menu → "Project Info")
- **Solution:** Project title in Navigation sidebar is now clickable
- **Result:** One-click access to theme, characters, stats, AI settings
- **UX Pattern:** "Click on what you want to know about" - natural discovery

---

## Part 1: Design Philosophy

### The Writer's Journey (Not the System's Requirements)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      WHERE WRITERS ACTUALLY START                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  70% │ "I have an idea"      │ → QUICK START (30 seconds to first scene)│
│      │ - Title and logline   │                                          │
│      │ - Genre intuition     │                                          │
│                                                                          │
│  20% │ "I have a script"     │ → IMPORT (existing flow)                 │
│      │ - PDF/FDX/Fountain    │                                          │
│      │ - Want to organize it │                                          │
│                                                                          │
│   8% │ "I have structure"    │ → CLONE TEMPLATE (learn by example)      │
│      │ - Studied craft       │                                          │
│      │ - Want sequences/beats│                                          │
│                                                                          │
│   2% │ "I have JSON"         │ → AI IMPORT (power users)                │
│      │ - Used Claude/ChatGPT │                                          │
│      │ - Have rich data      │                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Speed over completeness** - Get writers into scenes within 30 seconds
2. **Progressive disclosure** - Advanced features appear when relevant
3. **Enrichment is ongoing** - Projects grow richer through use, not setup
4. **Edit everything later** - Nothing is locked at creation time
5. **Meet them where they are** - Four paths, one destination

---

## Part 2: Unified Project Hub

### The Missing Piece: Project Settings

**Current gap:** Once a project is created, there's no way to edit `config.title`, add characters, update themes, etc.

**Solution:** A unified Project Hub that handles both creation and ongoing management.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PROJECT HUB                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   CREATE    │  │   MANAGE    │  │   EXPORT    │  │   ARCHIVE   │    │
│  │  ─────────  │  │  ─────────  │  │  ─────────  │  │  ─────────  │    │
│  │ Quick Start │  │ Edit Config │  │ JSON Export │  │ Project     │    │
│  │ Script Imp  │  │ Characters  │  │ PDF Export  │  │ Versioning  │    │
│  │ Clone Temp  │  │ Theme/Motifs│  │ FDX Export  │  │ Backup      │    │
│  │ AI Import   │  │ AI Settings │  │ Share       │  │ Delete      │    │
│  │             │  │ Status/Wkfl │  │             │  │             │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    RECENT PROJECTS                               │    │
│  │  8 Billion Genies • Bell Bottoms • [New Project...]             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Project Settings Panel (New Component)

**File:** `src/components/ProjectSettings.tsx` (NEW)

This component allows editing all `config` fields after project creation:

```typescript
/**
 * ProjectSettings - Edit project configuration
 *
 * Accessible from:
 * - Navigation header (gear icon)
 * - Project Hub
 * - Cmd/Ctrl + , shortcut
 */

interface ProjectSettingsProps {
  project: ProjectData;
  onUpdate: (updates: Partial<ProjectConfig>) => void;
  onClose: () => void;
}

// Sections:
// 1. Basic Info (title, id, description, logline)
// 2. Genres (multi-select with custom option)
// 3. Theme (core + counter-argument editor)
// 4. Motifs (tag input)
// 5. Characters (table with add/edit/delete)
// 6. AI Settings (style refs, tone, constraints)
// 7. Tracking Categories (for continuity panel)
// 8. Note Authors (for source labels)
```

---

## Part 3: Revised Implementation Phases

### Phase 1A: Quick Start (PRIORITY: CRITICAL)

**Why first:** 70% of users will use this path. It removes all friction.

**File:** `src/components/QuickStart.tsx` (NEW)

```typescript
/**
 * QuickStart - Minimal friction project creation
 *
 * Three fields → AI expansion → Into scene editor in 30 seconds
 */

interface QuickStartProps {
  onComplete: (project: ProjectData) => void;
  onCancel: () => void;
}

// The form:
// ┌────────────────────────────────────────────────────┐
// │ What's your screenplay called?                     │
// │ ┌──────────────────────────────────────────────┐  │
// │ │ Untitled Project                             │  │
// │ └──────────────────────────────────────────────┘  │
// │                                                    │
// │ Describe it in one sentence:                      │
// │ ┌──────────────────────────────────────────────┐  │
// │ │ A [character] must [goal] before [stakes]...│  │
// │ └──────────────────────────────────────────────┘  │
// │                                                    │
// │ What kind of story is this?                       │
// │ ┌──────────────────────────────────────────────┐  │
// │ │ Drama ▾  │ Action ▾  │ + Add genre          │  │
// │ └──────────────────────────────────────────────┘  │
// │                                                    │
// │                           [ Cancel ] [ Create → ] │
// └────────────────────────────────────────────────────┘

// On submit:
// 1. Generate kebab-case ID from title
// 2. Create minimal ProjectConfig
// 3. Create single "Act One" sequence with one empty scene
// 4. Set scene.status = 'draft'
// 5. Navigate directly to scene editor

// NO AI expansion during creation - keep it instant
// AI enrichment happens later via "Suggest Characters" etc.
```

**What gets created:**

```json
{
  "config": {
    "id": "my-screenplay",
    "title": "My Screenplay",
    "logline": "A burned-out teacher discovers...",
    "genres": ["Drama"],
    "characters": [],
    "theme": null,
    "motifs": []
  },
  "sequences": [{
    "id": "SEQ_1",
    "title": "Act One",
    "scenes": [{
      "id": "SC-001",
      "title": "Scene 1",
      "scriptContent": "",
      "status": "draft",
      "beats": [],
      "notes": []
    }]
  }]
}
```

### Phase 1B: AI JSON Import (PRIORITY: CRITICAL)

**Why parallel:** Power users need this. It's the "escape hatch" for rich data.

**File:** `src/components/ImportFromAI.tsx` (NEW)

Same as previously specified, but with improved UX:

```
┌────────────────────────────────────────────────────────────┐
│ Import from AI                                              │
│                                                             │
│ Paste JSON from Claude, ChatGPT, or any AI tool:           │
│ ┌─────────────────────────────────────────────────────┐    │
│ │                                                     │    │
│ │  {                                                  │    │
│ │    "config": { ... }                               │    │
│ │  }                                                  │    │
│ │                                                     │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 💡 Don't have JSON yet?                            │    │
│ │                                                     │    │
│ │ Use our Claude Project template to develop your    │    │
│ │ screenplay through conversation, then export JSON. │    │
│ │                                                     │    │
│ │ [Copy Claude Template]  [View Guide]               │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│                             [ Cancel ]  [ Validate & Import ]│
└────────────────────────────────────────────────────────────┘
```

### Phase 1C: Project Settings (PRIORITY: CRITICAL)

**Why critical:** Without this, users are stuck with whatever they set at creation.

**File:** `src/components/ProjectSettings.tsx` (NEW)

Tabbed interface for all project configuration:

```
┌─────────────────────────────────────────────────────────────┐
│ Project Settings                                       [×]  │
├─────────────────────────────────────────────────────────────┤
│  [Basic] [Characters] [Theme] [AI] [Tracking] [Advanced]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Title                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 8 Billion Genies                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Logline                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ When everyone on Earth gets one wish...             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Genres                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Sci-Fi ×] [Comedy ×] [+ Add]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Description                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Based on the Image Comics series...                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                                        [ Save Changes ]     │
└─────────────────────────────────────────────────────────────┘
```

**Tabs:**

1. **Basic** - title, logline, genres, description
2. **Characters** - Full character table with add/edit/delete, arc editing
3. **Theme** - Core statement + counter-argument editor with examples
4. **AI** - Style references, tone, constraints, custom instructions
5. **Tracking** - Categories for continuity panel
6. **Advanced** - Note authors, settings, export/import config

### Phase 2: Enhanced Script Import

**File:** `src/components/ImportWizard.tsx` (MODIFY)

Improve existing flow:

1. **Preserve:** PDF/FDX/Fountain upload
2. **Add:** Post-import prompt to enhance
   - "Would you like AI to suggest characters?"
   - "Would you like to add theme notes?"
3. **Add:** Direct path to Project Settings after import

### Phase 3: Template Clone

**File:** `src/components/CloneTemplate.tsx` (NEW)

Two template options:

1. **8 Billion Genies Structure** (Full)
   - 8 sequences, 32 scenes, all metadata
   - Content cleared, structure preserved
   - Best for: Writers who want to learn sequence structure

2. **Minimal Template** (Simple)
   - 3 acts, 1 scene each
   - Basic config only
   - Best for: Writers who want structure without complexity

```
┌────────────────────────────────────────────────────────────┐
│ Start from a Template                                       │
│                                                             │
│ ┌─────────────────────────┐  ┌─────────────────────────┐   │
│ │     📘 FULL             │  │     📄 MINIMAL          │   │
│ │                         │  │                         │   │
│ │  8 Billion Genies       │  │  Three-Act Skeleton     │   │
│ │  Structure              │  │                         │   │
│ │                         │  │  • 3 sequences          │   │
│ │  • 8 sequences          │  │  • 3 placeholder scenes │   │
│ │  • 32 scene placeholders│  │  • Basic config only    │   │
│ │  • Dramatic questions   │  │                         │   │
│ │  • Character archetypes │  │  Perfect for starting   │   │
│ │                         │  │  fresh with structure   │   │
│ │  Perfect for learning   │  │                         │   │
│ │  screenplay structure   │  │                         │   │
│ │                         │  │                         │   │
│ │     [ Clone This ]      │  │     [ Clone This ]      │   │
│ └─────────────────────────┘  └─────────────────────────┘   │
│                                                             │
│                                            [ Cancel ]       │
└────────────────────────────────────────────────────────────┘
```

### Phase 4: External AI Integration

**Documentation only - no code changes**

Create `docs/claude-project-template.md`:

```markdown
# ScriptSync Development Partner

Paste this into a Claude Project or ChatGPT GPT.

## Instructions for AI

You are a screenplay development partner. Help the writer develop their project through conversation, then export ScriptSync-compatible JSON.

### Your Role

1. **Discuss** - Ask questions about their story, characters, world
2. **Develop** - Help craft character arcs, theme arguments, scene structure
3. **Challenge** - Push back on weak motivations, plot holes, clichés
4. **Export** - Generate valid JSON when requested

### Theme Development

A theme is NOT a topic word like "love" or "identity."

A theme is an ARGUMENT with a counter-argument:

✅ GOOD:
- core: "Control destroys what makes life worth living"
- counterArgument: "Without control, chaos destroys everything"

❌ BAD:
- themes: ["Control", "Freedom"]

### JSON Schema

[Full schema with examples...]

### Conversation Flow

1. "Tell me about your story"
2. "Who's the protagonist? What do they want?"
3. "What's standing in their way?"
4. "What's the theme arguing?"
5. "Ready to export? Say 'generate JSON'"
```

---

## Part 4: Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] **1.1** Create `QuickStart.tsx` - 30-second project creation
- [ ] **1.2** Create `ImportFromAI.tsx` - JSON import with validation
- [ ] **1.3** Create `ProjectSettings.tsx` - Edit all config fields
- [ ] **1.4** Update `index.tsx` - Add new modes and navigation
- [ ] **1.5** Add gear icon to Navigation for Project Settings access
- [ ] **1.6** Test all three paths end-to-end

### Phase 2: Refinement (Week 2)

- [ ] **2.1** Enhance ImportWizard with post-import enrichment prompts
- [ ] **2.2** Add keyboard shortcuts (Cmd+, for settings)
- [ ] **2.3** Create CloneTemplate with both Full and Minimal options
- [ ] **2.4** Add "Suggest Characters" AI feature to Project Settings

### Phase 3: Documentation (Week 2)

- [ ] **3.1** Create `claude-project-template.md`
- [ ] **3.2** Create `chatgpt-gpt-template.md`
- [ ] **3.3** Update README with new creation paths
- [ ] **3.4** Add in-app help tooltips

### Phase 4: Polish (Week 3)

- [ ] **4.1** Onboarding tour for new users
- [ ] **4.2** Empty state improvements ("No characters yet - add some?")
- [ ] **4.3** AI-powered enrichment suggestions in Project Settings
- [ ] **4.4** Export project config for sharing

---

## Part 5: Technical Dependencies

### Already Available
- React 19.2.0
- TypeScript 5.8.2
- Claude API integration (geminiService.ts)
- Gemini API integration (ingestion/aiProcessor.ts)
- Storage service (localStorage)
- Project loading/saving infrastructure
- Character analysis service (`src/services/characterAnalysis.ts`)
- Theme model types (`ThemeStatement` in types.ts)
- Scene status type (`SceneStatus` in types.ts)

### NOT Available (Do Not Use)
- ❌ Zod (not installed - use manual validation)
- ❌ Direct `callClaude` export (internal function)

### New Services Needed
- `src/services/projectDefaults.ts` - Default project generation
- `src/services/validation.ts` - JSON validation extracted from ImportFromAI

### Files to Modify
- `src/index.tsx` - Add new modes, update ProjectSelector
- `src/components/Navigation.tsx` - Add settings gear icon
- `src/services/geminiService.ts` - Add enrichment endpoints

---

## Part 6: Sample Test Data

### Minimal Valid ProjectData (Quick Start Output)

```json
{
  "config": {
    "id": "test-project",
    "title": "Test Project",
    "logline": "A test screenplay for validation.",
    "genres": ["Drama"],
    "characters": []
  },
  "sequences": [
    {
      "id": "SEQ_1",
      "title": "Act One",
      "scenes": [
        {
          "id": "SC-001",
          "sequenceId": "SEQ_1",
          "title": "Scene 1",
          "pageNumber": 1,
          "scriptContent": "",
          "beats": [],
          "notes": [],
          "tracking": [],
          "summary": "",
          "status": "draft"
        }
      ]
    }
  ]
}
```

### Rich Valid ProjectData (AI Import Output)

```json
{
  "config": {
    "id": "rich-project",
    "title": "Rich Project",
    "logline": "A complex screenplay with all metadata.",
    "genres": ["Drama", "Thriller"],
    "characters": [
      {
        "name": "Protagonist",
        "role": "main",
        "arc": "SKEPTIC → BELIEVER: Learns to trust",
        "description": "A burned-out detective..."
      }
    ],
    "theme": {
      "core": "Trust requires vulnerability",
      "counterArgument": "Vulnerability invites exploitation"
    },
    "motifs": ["Locked doors", "Handshakes", "Rain"],
    "ai": {
      "styleReferences": ["David Fincher", "Aaron Sorkin"],
      "toneDescriptor": "Noir thriller with mordant wit"
    }
  },
  "sequences": [...],
  "rewriteData": {
    "goals": [...],
    "pageNotes": {},
    "openQuestions": {}
  }
}
```

---

## Part 7: Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first scene | < 30 seconds | Quick Start path |
| Richness ceiling | 100% of 8BG | AI Import path |
| Project modification | Any field editable | Project Settings |
| Template clarity | No confusion | Minimal + Full options |
| User satisfaction | > 4/5 | Post-creation survey |

---

## Part 8: Open Questions

### Resolved

1. ✅ **Where does Quick Start fit?** → Phase 1A, equal priority with AI Import
2. ✅ **How do users edit config after creation?** → Project Settings panel
3. ✅ **What about template confusion?** → Two templates: Minimal and Full
4. ✅ **Is 15% gap important?** → No. Progressive enrichment matters more

### Still Open

1. **Should Quick Start call AI at all?**
   - Current plan: No, keep it instant
   - Alternative: Light AI call for character suggestions
   - Decision: Start with no AI, add later if users request

2. **How to handle project versioning?**
   - Not in scope for Phase 1-3
   - Future: Git-style branching for rewrites

3. **Multi-user collaboration?**
   - Not in scope
   - Future: Real-time collaboration like Figma

---

## Appendix A: File Structure After Implementation

```
src/
├── components/
│   ├── ImportWizard.tsx      (existing - enhanced)
│   ├── ImportFromAI.tsx      (NEW - Phase 1)
│   ├── QuickStart.tsx        (NEW - Phase 1)
│   ├── ProjectSettings.tsx   (NEW - Phase 1)
│   ├── CloneTemplate.tsx     (NEW - Phase 3)
│   ├── ContextPanel.tsx      (MODIFIED - "Passes" tab)
│   ├── CharacterDashboard.tsx (MODIFIED - new analysis)
│   ├── Navigation.tsx        (MODIFIED - badges, filters, settings icon)
│   └── ProjectOverview.tsx   (MODIFIED - theme display)
├── services/
│   ├── geminiService.ts      (modify - add enrichment endpoints)
│   ├── characterAnalysis.ts  (NEW - writer-focused metrics)
│   ├── projectDefaults.ts    (NEW - default project generation)
│   ├── validation.ts         (NEW - JSON validation)
│   └── ingestion/
│       └── aiProcessor.ts    (existing)
├── index.tsx                 (modify - add new modes)
└── config/
    └── types.ts              (MODIFIED - ThemeStatement, SceneStatus, motifs)

docs/
├── EXECUTION_PLAN_PROJECT_CREATION.md (this file)
├── claude-project-template.md (NEW - Phase 4)
└── chatgpt-gpt-template.md   (NEW - Phase 4)
```

---

## Appendix B: Codebase Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/config/types.ts` | ~275 | Type definitions (ThemeStatement, SceneStatus) |
| `src/index.tsx` | 345 | App entry, ProjectSelector, mode management |
| `src/components/ImportWizard.tsx` | 634 | Existing script import flow |
| `src/components/Navigation.tsx` | ~280 | Sidebar with badges, filters, stats |
| `src/components/ContextPanel.tsx` | ~900 | "Passes" tab, merged feedback |
| `src/components/CharacterDashboard.tsx` | ~455 | Writer-focused character metrics |
| `src/services/geminiService.ts` | ~400 | Claude API integration |
| `src/services/characterAnalysis.ts` | ~280 | Speaking partners, verbal tics, arcs |
| `src/projects/8-billion-genies/config.ts` | 1,474 | Reference implementation |

---

## Appendix C: Migration Notes

### For Existing Projects Using Legacy `themes[]`

When importing or loading projects with the old `themes: string[]` format:
1. Display them in ProjectOverview with "(legacy format)" indicator
2. In Project Settings, offer "Convert to Theme Statement" button
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

## Appendix D: UX Copywriting Guidelines

### Tone
- **Confident but not cocky** - "Create your screenplay" not "Let's get started!"
- **Professional** - No emojis in primary UI (except template icons)
- **Clear** - One action per button, obvious labels

### Labels
- "Quick Start" (not "New Project" or "Create")
- "Import Script" (not "Upload" - implies ownership transfer)
- "Import from AI" (not "Paste JSON" - explains the use case)
- "Clone Template" (not "Use Template" - clearer about what happens)
- "Project Settings" (not "Configuration" or "Options")

### Empty States
- Characters: "No characters defined yet. Add them as you write, or let AI suggest some."
- Theme: "Theme develops through revision. Come back here after your first draft."
- Motifs: "Notice any recurring images or symbols? Add them here."

---

*This document is the complete planning record for ScriptSync Project Creation Enhancement. Implementation should proceed Phase 1A → 1B → 1C in parallel where possible, with Phase 2-4 following.*

*Key improvement over v1: Promoted Quick Start to critical priority, added Project Settings for post-creation editing, simplified template options, removed academic metrics focus.*

*Last updated: December 18, 2025*
