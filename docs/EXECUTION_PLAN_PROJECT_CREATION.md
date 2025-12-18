# ScriptSync Project Creation Enhancement - Execution Plan

> Generated: December 18, 2025
> **Revised: December 18, 2025** - Bootstrapping rigor applied, priorities restructured
> **Completed: December 18, 2025** - Phase 1 fully implemented
> **Phase 3 Completed: December 18, 2025** - Documentation and AI enhancements
> Status: ALL PHASES COMPLETE
> Branch: `claude/align-project-creation-ui-0US27`

## Executive Summary

ScriptSync needs to let writers **edit their projects after creation** before adding new creation paths. The original plan over-engineered project creation with four separate components when simpler solutions exist.

**Key insight from revision:** ProjectSettings is more valuable than Quick Start. Every user who imports a script immediately needs to add characters, theme, and motifs. Build the editing capability first.

**What was cut:** CloneTemplate (solution looking for a problem). Template cloning is confusing for new writers and unnecessary—Quick Start with presets achieves the same goal.

---

## Recent Codebase Changes (December 18, 2025)

> **IMPORTANT:** The following UX polish was implemented and is now production-ready:

### Theme Model Restructured
- **NEW:** `theme: ThemeStatement` - Structured argument model
  ```typescript
  interface ThemeStatement {
    core: string;           // "Control destroys what makes life worth living"
    counterArgument: string; // "Without control, chaos destroys everything"
  }
  ```
- **Added:** `motifs: string[]` - Recurring visual/symbolic elements
- Both old `themes[]` and new `theme` formats accepted for backwards compatibility

### Scene Status Added
```typescript
type SceneStatus = 'draft' | 'review' | 'polished' | 'locked';
```

### ContextPanel Tab Consolidation
**Old (6 tabs):** Beats | Notes | Passes | Track | Cuts | AI
**New (4 tabs):** Beats | Notes | AI | More

- **Notes tab** now integrates: Scene notes, Studio feedback, Active Passes (priority-sorted)
- **More tab** has pill-style sub-navigation: Track, Cuts, Dialogue, Ideas

### Character Analysis Overhauled
New `src/services/characterAnalysis.ts`:
- Verbal tics detection
- Speaking partners analysis
- Emotional register tracking
- Arc markers (first/last appearance, peak activity)

### Navigation & ProjectOverview
- Project title in status bar now clickable → opens ProjectOverview
- Removed duplicate title from sidebar
- Stats moved to ProjectOverview header

### Timeline Redesign + Hover Highlighting
- Act Structure Bar with proportional visualization
- Sequence Blocks showing density
- Character Presence Swimlanes
- **NEW:** Hover over scene → connected scenes light up, unrelated scenes fade

---

## Part 1: Revised Design Philosophy

### Why ProjectSettings First

```
ORIGINAL PLAN:                    REVISED PLAN:
┌────────────────────┐            ┌────────────────────┐
│ 1A. Quick Start    │            │ 1A. ProjectSettings│ ← EDIT FIRST
│ 1B. AI Import      │            │ 1B. Quick Start    │ ← Inline, not new component
│ 1C. ProjectSettings│            │ 1C. JSON Import    │ ← Tab in ImportWizard
│ 2.  Enhanced Import│            │ 2.  Empty States   │
│ 3.  Clone Template │ ← CUT      │ 3.  Polish         │
└────────────────────┘            └────────────────────┘
```

**Rationale:**
1. Every user who imports a script needs to add characters/theme immediately
2. ProjectSettings unblocks 100% of users; Quick Start helps only new projects
3. Consolidating creation paths reduces code and cognitive load

### Core Principles (Unchanged)
1. **Speed over completeness** - Get writers into scenes within 30 seconds
2. **Progressive disclosure** - Advanced features appear when relevant
3. **Enrichment is ongoing** - Projects grow richer through use, not setup
4. **Edit everything later** - Nothing is locked at creation time

### Guidance Philosophy: Empty States, Not Tutorials
- **No step-by-step tours** - The UI should be self-explanatory
- **Contextual empty states** - Help text appears where relevant
- **Hover tooltips** - Non-obvious controls get `title` attributes
- **Build tutorials when users ask** - Not before

---

## Part 2: Implementation Phases

### Phase 1A: ProjectSettings (PRIORITY: CRITICAL) ✅ COMPLETE

**Why first:** Unblocks every user who imports a script and needs to edit config.

**File:** `src/components/ProjectSettings.tsx` (CREATED)

```typescript
/**
 * ProjectSettings - Edit all project configuration
 *
 * Accessible from:
 * - Status bar gear icon (new)
 * - ProjectOverview "Edit Settings" button
 * - Cmd/Ctrl + , shortcut
 */

interface ProjectSettingsProps {
  onClose: () => void;
}

// Tabs:
// 1. Basic - title, logline, genres, description
// 2. Characters - table with add/edit/delete, arc editing
// 3. Theme - core statement + counter-argument with examples
// 4. AI - style references, tone, constraints
// 5. Tracking - categories for continuity panel
```

**UI Mockup:**
```
┌─────────────────────────────────────────────────────────────┐
│ Project Settings                                       [×]  │
├─────────────────────────────────────────────────────────────┤
│  [Basic] [Characters] [Theme] [AI] [Tracking]               │
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
│                                        [ Save Changes ]     │
└─────────────────────────────────────────────────────────────┘
```

**Empty States (Contextual Guidance):**
- Characters tab: "No characters defined yet. Add them as you write, or describe your protagonist below."
- Theme tab: "Theme develops through revision. What argument is your story making?"
- AI tab: "Optional. Add style references to help AI understand your voice."

**Keyboard Shortcut:** Cmd/Ctrl + , (standard settings shortcut)

### Phase 1B: Quick Start (Inline in ProjectSelector) ✅ COMPLETE

**Why inline:** Simpler than new component, same UX.

**File:** `src/index.tsx` (MODIFIED - ProjectSelector)

Add a "Start Fresh" card that expands to inline form:

```
┌────────────────────────────────────────────────────────────┐
│                        ScriptSync                           │
│   Context-aware screenwriting with AI-powered analysis      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │    ✨ START FRESH   │  │     📥 IMPORT SCREENPLAY    │  │
│  │                     │  │                             │  │
│  │  Title:             │  │  Upload scripts, notes,     │  │
│  │  ┌───────────────┐  │  │  beat sheets, or paste JSON │  │
│  │  │ My Screenplay │  │  │                             │  │
│  │  └───────────────┘  │  │                             │  │
│  │                     │  │                             │  │
│  │  Genre:             │  │                             │  │
│  │  [Drama ▾] [+ Add]  │  │                             │  │
│  │                     │  │                             │  │
│  │    [ Create → ]     │  │      [ Import → ]           │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│                                                             │
│  ─────────────────── Sample Projects ───────────────────   │
│                                                             │
│  🧞 8 Billion Genies    🎬 Bell Bottoms                    │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**What gets created (minimal valid project):**
```json
{
  "config": {
    "id": "my-screenplay",
    "title": "My Screenplay",
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

**Post-creation:** Navigate to scene editor, show toast: "Project created. Edit settings anytime with ⌘,"

### Phase 1C: JSON Import (Tab in ImportWizard) ✅ COMPLETE

**Why tab:** Consolidates import paths, consistent UX.

**File:** `src/components/ImportWizard.tsx` (MODIFIED)

Add fourth tab to existing wizard:

```
┌─────────────────────────────────────────────────────────────┐
│ Import Screenplay                                      [×]  │
├─────────────────────────────────────────────────────────────┤
│  [PDF/FDX] [Fountain] [Beat Sheet] [JSON]  ← NEW TAB        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Paste JSON from Claude, ChatGPT, or any AI tool:          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  {                                                  │   │
│  │    "config": { ... }                               │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ℹ️  Don't have JSON yet?                            │   │
│  │                                                     │   │
│  │ Use Claude or ChatGPT to develop your screenplay   │   │
│  │ through conversation, then ask it to export JSON.  │   │
│  │                                                     │   │
│  │ [Copy Prompt Template]                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Validation: ✓ Valid JSON  ✓ Has config  ✓ Has sequences   │
│                                                             │
│                              [ Cancel ]  [ Import Project ] │
└─────────────────────────────────────────────────────────────┘
```

**Validation:**
- Is it valid JSON?
- Does it have `config.id` and `config.title`?
- Does it have at least one sequence with one scene?
- Accept both `theme: ThemeStatement` and legacy `themes: string[]`

### Phase 2: Empty States & Tooltips ✅ COMPLETE

**File:** Multiple components (MODIFIED)

Add contextual empty states throughout:

**ProjectSettings - Characters Tab:**
```tsx
{characters.length === 0 && (
  <div className="text-center py-8 text-zinc-500">
    <div className="text-lg mb-2">No characters defined yet</div>
    <div className="text-sm mb-4">
      Add them as you write, or describe your protagonist to get started.
    </div>
    <button className="text-blue-400 hover:text-blue-300">
      + Add Character
    </button>
  </div>
)}
```

**ProjectSettings - Theme Tab:**
```tsx
{!theme && (
  <div className="text-center py-8 text-zinc-500">
    <div className="text-lg mb-2">Theme develops through revision</div>
    <div className="text-sm mb-4">
      What argument is your story making? What's the counter-argument?
    </div>
    <div className="text-xs text-zinc-600 mb-4">
      Example: "Trust requires vulnerability" vs "Vulnerability invites exploitation"
    </div>
    <button className="text-blue-400 hover:text-blue-300">
      + Define Theme
    </button>
  </div>
)}
```

**Tooltips on key controls:**
- Gear icon: `title="Project Settings (⌘,)"`
- More tab: `title="Additional tools: Track, Cuts, Dialogue, Ideas"`
- Connection dots on Timeline: `title="This scene connects to other scenes"`

### Phase 3: Polish

- Post-import prompt: "Would you like to add characters now?" → Opens ProjectSettings Characters tab
- Keyboard shortcuts help updated with ⌘, shortcut
- Settings gear icon added to status bar

---

## Part 3: What Was Cut (and Why)

### CloneTemplate.tsx - REMOVED

**Original justification:** "8% of users want structure"

**Why cut:**
1. Writers who study craft build their own structures—they don't clone others'
2. The "Full Template" (8BG's 32 scenes) is confusing for beginners
3. "Minimal Template" is just Quick Start with 3 acts—not a separate feature
4. Maintenance burden for marginal value

**Alternative:** If users want to see how 8BG is structured, they can open it as a sample project. No need to "clone" it.

### Separate QuickStart.tsx - MERGED

**Original:** New component with its own modal

**Revised:** Inline form in ProjectSelector

**Why:** Same UX, less code, no modal-within-modal confusion

### Separate ImportFromAI.tsx - MERGED

**Original:** New component for JSON import

**Revised:** Tab in existing ImportWizard

**Why:** Consistent import experience, users already know the wizard

---

## Part 4: Implementation Checklist

### Phase 1: Core Functionality ✅ COMPLETE

- [x] **1.1** Create `ProjectSettings.tsx` with 5 tabs
- [x] **1.2** Add gear icon to AppStatusBar → opens ProjectSettings
- [x] **1.3** Add ⌘, keyboard shortcut for ProjectSettings
- [x] **1.4** Add "Edit Settings" button to ProjectOverview
- [x] **1.5** Add Quick Start inline form to ProjectSelector
- [x] **1.6** Add JSON tab to ImportWizard with validation
- [x] **1.7** Test all paths end-to-end

### Phase 2: Guidance & Polish ✅ COMPLETE

- [x] **2.1** Add empty states to ProjectSettings tabs
- [x] **2.2** Add tooltips to non-obvious controls
- [x] **2.3** Add post-import "add characters?" prompt
- [x] **2.4** Update keyboard shortcuts help modal
- [x] **2.5** Add toast notifications for project creation

### Phase 3: Documentation ✅ COMPLETE

- [x] **3.1** Create `claude-prompt-template.md` for AI-assisted development
- [x] **3.2** Update README with new features (Quick AI Actions, Suggestion Chips, Project Settings)
- [x] **3.3** Add in-app help links where relevant

**Additional AI Enhancements (December 18, 2025):**
- [x] Quick AI Actions panel in AI tab (Analyze Scene, Check Continuity, Alt Versions, Write Dialogue)
- [x] Suggestion chips above chat input for common questions
- [x] Inline results display with dismiss/save actions
- [x] Help link to documentation in AI welcome state

---

## Part 5: Technical Dependencies

### Already Available
- React 19.2.0, TypeScript 5.8.2
- Storage service (localStorage)
- Project loading/saving infrastructure
- Theme model types (`ThemeStatement`)
- Scene status type (`SceneStatus`)
- Character analysis service

### New Services Needed
- `src/services/projectDefaults.ts` - Default project generation
- `src/services/validation.ts` - JSON validation (extracted from ImportWizard)

### Files to Modify
- `src/App.tsx` - Add ProjectSettings modal state
- `src/index.tsx` - Add Quick Start to ProjectSelector
- `src/components/ImportWizard.tsx` - Add JSON tab
- `src/components/AppStatusBar.tsx` - Add gear icon

### Files to Create
- `src/components/ProjectSettings.tsx` (NEW)
- `src/services/projectDefaults.ts` (NEW)
- `src/services/validation.ts` (NEW)

---

## Part 6: Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first scene (new project) | < 15 seconds | Quick Start path |
| Time to edit config (existing project) | < 2 seconds | Gear icon → Settings |
| JSON import success rate | > 95% | Validation catches errors |
| Empty state helpfulness | Users don't ask "where do I add X?" | Support questions |

---

## Part 7: Migration Notes

### For Existing Projects Using Legacy `themes[]`

When loading projects with old `themes: string[]` format:
1. Display in ProjectSettings with "(legacy format)" indicator
2. Offer "Convert to Theme Statement" button
3. Both formats work—no forced migration

### Tab Structure Reference

```typescript
// ContextPanel tabs (already implemented)
enum Tab {
  BEATS = 'Beats',
  NOTES = 'Notes',
  DOCTOR = 'AI',
  MORE = 'More'
}

// ProjectSettings tabs (to implement)
enum SettingsTab {
  BASIC = 'Basic',
  CHARACTERS = 'Characters',
  THEME = 'Theme',
  AI = 'AI',
  TRACKING = 'Tracking'
}
```

---

## Part 8: UX Copywriting Guidelines

### Tone
- **Confident but not cocky** - "Create your screenplay" not "Let's get started!"
- **Professional** - No emojis in primary UI (icons are fine)
- **Clear** - One action per button, obvious labels

### Empty State Pattern
```
[Friendly headline - what's missing]
[Brief explanation - why it matters]
[Example if helpful]
[Action button]
```

### Error Messages
- "Couldn't parse JSON. Check for missing commas or brackets."
- "Project needs a title. Add one to continue."
- NOT: "Error: Invalid input" or "Something went wrong"

---

## Appendix A: File Structure After Implementation

```
src/
├── components/
│   ├── ProjectSettings.tsx    (NEW - Phase 1)
│   ├── ImportWizard.tsx       (MODIFY - add JSON tab)
│   ├── AppStatusBar.tsx       (MODIFY - add gear icon)
│   ├── ContextPanel.tsx       (DONE - 4 tabs)
│   ├── TimelineView.tsx       (DONE - hover highlighting)
│   ├── Navigation.tsx         (DONE - streamlined)
│   └── ProjectOverview.tsx    (MODIFY - add Edit Settings button)
├── services/
│   ├── projectDefaults.ts     (NEW)
│   ├── validation.ts          (NEW)
│   ├── characterAnalysis.ts   (DONE)
│   └── geminiService.ts       (existing)
├── index.tsx                  (MODIFY - Quick Start in selector)
└── config/
    └── types.ts               (DONE - ThemeStatement, SceneStatus)

docs/
├── EXECUTION_PLAN_PROJECT_CREATION.md (this file)
└── claude-prompt-template.md  (NEW - Phase 3)
```

---

## Appendix B: Why No Tutorial System (Yet)

### Arguments Considered

**For tutorials:**
- ProjectSettings is new
- Theme model is sophisticated
- Tab consolidation changed mental models

**Against tutorials:**
- UI is still evolving—tutorials would need rewriting
- Good UX shouldn't need tutorials
- Tutorial systems add complexity
- Writers are smart; they can explore

### Decision: Empty States Are The Tutorial

Contextual empty states provide guidance exactly when needed:
- "No characters yet" → appears in Characters tab when empty
- "Theme develops through revision" → appears in Theme tab when empty

This is better than a tour because:
1. No dismissal state to track
2. Appears in context, not upfront
3. Disappears naturally when populated
4. No "skip tutorial" fatigue

### When to Revisit

Add proper onboarding when:
- User research shows confusion
- Feature count exceeds discoverability threshold
- Enterprise customers request it

---

*This document is the complete planning record for ScriptSync Project Creation Enhancement.*

*Key changes from v1: ProjectSettings prioritized over Quick Start, creation paths consolidated into existing components, CloneTemplate removed, empty states defined as primary guidance mechanism.*

*Last revised: December 18, 2025*
