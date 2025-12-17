# ScriptSync

A context-aware screenwriting environment for tracking screenplay rewrites, continuity, character arcs, and story beats across complex narratives.

## Features

- **Script View**: Read and annotate screenplay content with inline notes
- **Beat Board**: Drag-and-drop beat cards organized by sequence
- **Character Dashboard**: Track character appearances, dialogue counts, and arc progression
- **Timeline View**: Visualize scene connections and parallel storylines
- **Context Panel**: AI-powered scene analysis with continuity tracking
- **Export**: Generate industry-standard Fountain or plain text exports

## Quick Start

```bash
# Install dependencies
npm install

# Set up your Gemini API key
cp .env.local.example .env.local
# Edit .env.local and add your VITE_GEMINI_API_KEY

# Run development server
npm run dev
```

## Creating a New Project

ScriptSync is designed to be project-agnostic. Each screenplay project lives in its own folder under `src/projects/`.

### Option 1: Manual Setup

1. Create a new folder: `src/projects/your-project-name/`

2. Create `config.ts` with your project configuration:

```typescript
import { ProjectConfig } from '../../config/types';

export const config: ProjectConfig = {
  id: 'your-project-name',
  title: 'Your Project Title',
  description: 'Brief description of your screenplay',
  genres: ['Drama', 'Thriller'],
  logline: 'One-sentence summary of your story',

  characters: [
    { name: 'Protagonist', role: 'main', description: 'Main character description' },
    { name: 'Antagonist', role: 'supporting', description: 'Villain description' },
    // Add more characters...
  ],

  themes: [
    'Redemption',
    'Identity',
    // Add your themes...
  ],

  ai: {
    styleReferences: ['Director Name', 'Writer Name'],
    toneDescriptor: 'Genre specialist description for AI context',
    uniqueConstraints: [
      'Any special rules for your story (e.g., time travel logic)',
      'Period-specific accuracy requirements',
    ],
    customInstructions: 'Additional context for AI analysis',
  },

  trackingCategories: ['Plot', 'Character Arc', 'Theme', 'Setup', 'Payoff'],
  noteAuthors: ['YourInitials'],

  meta: {
    version: '1.0.0',
    author: 'Your Name',
  },
};

export default config;
```

3. Create `sequences.ts` with your screenplay data:

```typescript
import { Sequence } from '../../config/types';

export const sequences: Sequence[] = [
  {
    id: 'SEQ-1',
    name: 'Opening',
    description: 'Act 1 setup',
    scenes: [
      {
        id: '1',
        sequenceId: 'SEQ-1',
        title: 'Scene Title',
        summary: 'Brief scene summary',
        content: `INT. LOCATION - TIME

Character enters.

CHARACTER
Dialogue here.

Action description.`,
        beats: [
          {
            id: 'b1',
            type: 'action',
            content: 'Beat description',
            position: 0,
          },
        ],
        notes: [],
        tracking: [],
      },
      // Add more scenes...
    ],
  },
  // Add more sequences...
];

export default sequences;
```

4. Create `index.ts` to export your project:

```typescript
import { ProjectData } from '../../config/types';
import { config } from './config';
import { sequences } from './sequences';

const projectData: ProjectData = { config, sequences };
export default projectData;
export { config, sequences };
```

5. Update `.env.local` to load your project:

```
VITE_ACTIVE_PROJECT=your-project-name
```

### Option 2: CLI Scaffolding

```bash
npm run new-project -- --name="your-project-name" --title="Your Project Title"
```

This creates the folder structure with template files you can fill in.

## Project Structure

```
scriptsync/
├── src/
│   ├── components/          # React UI components
│   │   ├── Navigation.tsx
│   │   ├── ScriptView.tsx
│   │   ├── ContextPanel.tsx
│   │   ├── CharacterDashboard.tsx
│   │   ├── BeatBoard.tsx
│   │   ├── TimelineView.tsx
│   │   └── ExportModal.tsx
│   │
│   ├── config/              # Core configuration system
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── ProjectContext.tsx
│   │   └── index.ts
│   │
│   ├── services/            # Business logic
│   │   ├── geminiService.ts # AI analysis
│   │   ├── scriptUtils.ts   # Parsing utilities
│   │   └── ttsService.ts    # Text-to-speech
│   │
│   ├── projects/            # Individual screenplay projects
│   │   └── bell-bottoms/    # Sample project
│   │       ├── config.ts
│   │       ├── sequences.ts
│   │       └── index.ts
│   │
│   ├── App.tsx
│   └── index.tsx
│
├── .env.local               # Environment config (VITE_ACTIVE_PROJECT)
├── package.json
└── vite.config.ts
```

## Configuration Reference

### ProjectConfig

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | URL-friendly project identifier |
| `title` | string | Display title |
| `description` | string | Project summary |
| `genres` | string[] | Genre tags |
| `logline` | string | One-sentence pitch |
| `characters` | CharacterConfig[] | Character definitions |
| `themes` | string[] | Thematic elements |
| `ai` | AIConfig | AI analysis configuration |
| `trackingCategories` | string[] | Scene tracking categories |
| `noteAuthors` | string[] | Author initials for notes |

### CharacterConfig

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Character name |
| `role` | 'main' \| 'supporting' \| 'minor' | Story importance |
| `description` | string | Brief character bio |
| `aliases` | string[] | Optional alternate names |
| `color` | string | Optional UI color |

### AIConfig

| Field | Type | Description |
|-------|------|-------------|
| `styleReferences` | string[] | Writers/directors for tone reference |
| `toneDescriptor` | string | Genre/style description |
| `uniqueConstraints` | string[] | Story rules and requirements |
| `customInstructions` | string | Additional AI context |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_ACTIVE_PROJECT` | Project folder name to load (e.g., `bell-bottoms`) |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run new-project  # Scaffold new project
```

## Sample Project: Bell Bottoms

The included `bell-bottoms` project demonstrates all ScriptSync features with a complete screenplay treatment:

- **Genre**: Action/Comedy Time Travel
- **Premise**: Charlie's Angels sent back to 1974
- **Features demonstrated**:
  - Dual timeline tracking (1974 vs 2026)
  - Character arc progression
  - Scene connections and callbacks
  - Thematic tracking
  - AI analysis integration

## License

MIT
