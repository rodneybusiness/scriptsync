# ScriptSync

A context-aware screenwriting environment with AI-powered script analysis. Track beats, characters, themes, and continuity across screenplays.

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report |
| `npm run preview` | Preview production build |

## Tech Stack

- **Framework**: React 19.2 + TypeScript 5.8
- **Build**: Vite 6.2
- **Testing**: Vitest + Testing Library
- **AI**: Claude (Anthropic) via direct API - Opus 4, Sonnet 4, Sonnet 4.5 models
- **PDF**: pdfjs-dist for screenplay parsing
- **Deployment**: Vercel / Netlify

## Repo Map

```
src/
├── components/           # React components
│   ├── ScriptView.tsx         # Main script editor
│   ├── BeatBoard.tsx          # Sequence/beat visualization
│   ├── CharacterDashboard.tsx # Character tracking with arc analysis
│   ├── Navigation.tsx         # Scene browser sidebar
│   ├── ContextPanel.tsx       # Side panel (4 tabs: Beats, Notes, AI, More)
│   ├── ProjectSettings.tsx    # Edit all project config
│   ├── ProjectOverview.tsx    # View project metadata (click title to open)
│   ├── ImportWizard.tsx       # PDF/Fountain/JSON import
│   ├── TimelineView.tsx       # Story structure visualization
│   ├── AppStatusBar.tsx       # Top nav with view switcher
│   └── ...
├── services/             # Business logic
│   ├── aiService.ts           # AI integration (Claude/Anthropic)
│   ├── characterAnalysis.ts   # Writer-focused character metrics
│   ├── pdfParser.ts           # PDF screenplay parsing
│   ├── exportService.ts       # Fountain/FDX/CSV export
│   ├── versionHistory.ts      # Scene snapshots + diff
│   ├── memoryPalace.ts        # Persistent AI context
│   └── ingestion/             # PDF/Fountain pipeline
├── hooks/                # Custom React hooks
│   ├── useColumnLayout.ts     # Resizable columns
│   ├── useKeyboardShortcuts.ts
│   └── useScriptMembrane.ts   # AI script analysis
├── contexts/             # React contexts
│   ├── ProjectContext.tsx     # Project state + undo/redo
│   └── AIAgentsContext.tsx    # AI coordination + suggestions
├── config/               # Type definitions
│   └── types.ts               # ThemeStatement, SceneStatus, etc.
├── projects/             # Sample screenplays
│   ├── 8-billion-genies/
│   └── bell-bottoms/
├── test/                 # Test utilities
└── docs/                 # Planning docs
    ├── EXECUTION_PLAN_PROJECT_CREATION.md
    └── claude-prompt-template.md
```

## Key Features (Current State)

### Project Creation
- **Quick Start**: Title + genre → into editor in 30 seconds
- **Import**: PDF, Fountain, or JSON
- **Project Settings**: Edit all config anytime (Cmd/Ctrl + ,)

### AI Integration (Claude)
- **Quick Actions**: One-click Analyze Scene, Check Continuity, Alt Versions, Write Dialogue
- **Suggestion Chips**: Pre-built prompts for common questions
- **Script Doctor Chat**: Context-aware conversation about your screenplay
- **Session Memory**: AI learns corrections within session

### ContextPanel Structure (4 tabs)
- **Beats**: Scene beats with completion tracking
- **Notes**: Scene notes + Studio feedback + Active Passes (integrated)
- **AI**: Quick Actions + Script Doctor chat
- **More**: Track, Cuts, Dialogue, Ideas (overflow tools)

## Sharp Edges

1. **No linter configured** - No `npm run lint` command. Be careful with code style.

2. **Large service files** - `aiService.ts` is 42KB. Work in sections.

3. **Environment variables** - AI features need `VITE_ANTHROPIC_API_KEY` in `.env.local`.

4. **Test coverage is sparse** - 6 test files, 101 tests total. Core flows covered, not exhaustive.

## Key Patterns

### State Management
React Context (`ProjectContext`, `AIAgentsContext`) - no Redux.

### AI Integration
All AI calls go through `services/aiService.ts` (Claude/Anthropic).
Memory persistence via `services/memoryPalace.ts`.

### Theme Model
```typescript
// New structured format (preferred)
theme: {
  core: "Control destroys what makes life worth living",
  counterArgument: "Without control, chaos destroys everything"
}

// Legacy format (still supported)
themes: ["Control", "Freedom"]
```

### Scene Status
```typescript
type SceneStatus = 'draft' | 'review' | 'polished' | 'locked';
```

## Path Aliases

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@services/*` → `src/services/*`
- `@config/*` → `src/config/*`

## Development Status

**Execution Plan**: Complete (see `docs/EXECUTION_PLAN_PROJECT_CREATION.md`)
- Phase 1: ProjectSettings, Quick Start, JSON Import ✓
- Phase 2: Empty States, Tooltips ✓
- Phase 3: Documentation, AI Quick Actions ✓

**Ready for**: Deployment and real-world testing
