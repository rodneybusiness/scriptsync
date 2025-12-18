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
- **Testing**: Vitest + Testing Library + Playwright (E2E)
- **AI**: Google Gemini via `@google/genai`
- **PDF**: pdfjs-dist for screenplay parsing
- **Deployment**: Vercel / Netlify

## Repo Map

```
src/
├── components/         # 33 React components
│   ├── ScriptView.tsx       # Main script editor
│   ├── BeatBoard.tsx        # Sequence/beat visualization
│   ├── CharacterDashboard   # Character tracking
│   ├── Navigation.tsx       # Scene browser sidebar
│   └── ...
├── services/           # Business logic
│   ├── geminiService.ts     # AI integration (42KB)
│   ├── pdfParser.ts         # PDF screenplay parsing
│   ├── exportService.ts     # Fountain/FDX/CSV export
│   ├── versionHistory.ts    # Scene snapshots + diff
│   ├── memoryPalace.ts      # Persistent AI context
│   └── ingestion/           # PDF/Fountain pipeline
├── hooks/              # Custom React hooks
│   ├── useColumnLayout.ts   # Resizable columns
│   ├── useKeyboardShortcuts.ts
│   └── useScriptMembrane.ts # AI script analysis
├── contexts/           # React contexts
│   ├── ProjectContext.tsx
│   └── AIAgentsContext.tsx
├── projects/           # Sample screenplays
│   ├── 8-billion-genies/
│   └── bell-bottoms/
└── test/               # Test utilities
```

## Path Aliases

Use these in imports:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@services/*` → `src/services/*`
- `@config/*` → `src/config/*`
- `@projects/*` → `src/projects/*`

## Sharp Edges

1. **No linter configured** - No `npm run lint` command exists. Be careful with code style.

2. **Large service files** - `geminiService.ts` is 42KB. Work in sections, use line ranges.

3. **AI service naming mismatch** - Service is named `geminiService.ts` but README says "Claude AI". The code actually uses Google Gemini (`@google/genai`).

4. **Environment variables** - AI features need `ANTHROPIC_API_KEY` in `.env.local` (copy from `.env.local.example`).

5. **Test coverage is sparse** - Only 6 test files exist:
   - `Navigation.test.tsx`
   - `RewriteTracker.test.tsx`
   - `ScriptView.test.tsx`
   - `exportService.test.ts`
   - `versionHistory.test.ts`
   - `scriptUtils.test.ts`

6. **Two config directories** - `src/config/` contains project-specific screenplay configs (8-billion-genies, bell-bottoms). `src/projects/` has duplicates. Prefer `src/config/`.

## Key Patterns

### Component Structure
Components use functional React with hooks. Most have corresponding test files using Testing Library.

### State Management
Uses React Context (`ProjectContext`, `AIAgentsContext`) rather than Redux.

### AI Integration
AI calls go through `services/geminiService.ts`. Memory persistence via `services/memoryPalace.ts`.

### PDF Parsing Pipeline
`services/ingestion/pipeline.ts` → `parsers.ts` → `aiProcessor.ts`
