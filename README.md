# ScriptSync

A professional screenwriting environment for tracking rewrites, continuity, character arcs, and story beats across complex narratives. Built with AI-powered analysis to help writers identify gaps, generate dialogue alternatives, and maintain story consistency.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Setup Guide](#project-setup-guide)
- [Import & Export](#import--export)
- [AI Features](#ai-features)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Configuration Reference](#configuration-reference)
- [API Reference](#api-reference)

---

## Features

### Core Views

| View | Description |
|------|-------------|
| **Script View** | Read and annotate screenplay content with inline notes and version history |
| **Beat Board** | Drag-and-drop beat cards organized by sequence for story structure visualization |
| **Character Dashboard** | Track appearances, dialogue counts, and arc progression across scenes |
| **Timeline View** | Visualize scene connections, parallel storylines, and causal relationships |
| **Analytics Dashboard** | Word counts, pacing analysis, character dialogue distribution |
| **Welcome Page** | Quick actions, recent projects, and feature overview |

### Advanced Capabilities

- **Real PDF Parsing**: Import PDF screenplays with automatic scene/character detection
- **Fountain Support**: Import/export industry-standard Fountain format
- **Version History**: Automatic snapshots with diff comparison and restore
- **AI Analysis**: Scene gap analysis, dialogue generation, beat alternatives
- **Mobile Responsive**: Touch-friendly interface with swipe gestures
- **Accessibility**: Screen reader support, keyboard navigation, high contrast mode
- **Export Options**: Fountain, Final Draft XML, PDF, plain text, CSV beat sheets

---

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd scriptsync
npm install

# Configure AI (optional)
cp .env.local.example .env.local
# Edit .env.local and add your VITE_GEMINI_API_KEY

# Start development
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project Setup Guide

ScriptSync can import existing screenplays or help you build from scratch. Here's how to populate a project for optimal results:

### Method 1: Import Existing Screenplay

**From PDF:**
1. Click "Import Project" on the welcome page
2. Drag your PDF file or click to browse
3. ScriptSync auto-detects:
   - Scene headings (INT./EXT.)
   - Character names (from dialogue cues)
   - Scene locations and times
4. Review detected data and adjust as needed
5. Add metadata (title, genres, themes, characters)

**From Fountain:**
1. Import .fountain file directly
2. All screenplay elements are preserved
3. Add project metadata for AI features

### Method 2: Manual Project Creation

For the best AI analysis and tracking, provide complete project information:

#### 1. Project Metadata (Essential)

```typescript
// config.ts
export const config: ProjectConfig = {
  id: 'project-slug',           // URL-friendly identifier
  title: 'Your Screenplay',     // Display title
  logline: 'A [protagonist] must [goal] before [stakes]', // One sentence
  genres: ['Drama', 'Thriller'], // Primary genres
  themes: ['Redemption', 'Family'], // Core thematic elements
};
```

**Tips for optimal AI analysis:**
- **Logline**: Include protagonist, goal, and stakes
- **Genres**: Be specific (e.g., "Psychological Thriller" not just "Thriller")
- **Themes**: List 3-5 central themes for continuity tracking

#### 2. Character Roster (Critical for Tracking)

```typescript
characters: [
  {
    name: 'JOHN',              // Name as it appears in script (ALL CAPS)
    role: 'main',              // main | supporting | minor
    description: 'A burned-out detective seeking redemption',
    arc: 'From cynicism to hope', // Character journey
    aliases: ['DETECTIVE', 'DAD'], // Alternative names/titles
  },
  // Add all speaking characters...
]
```

**Character data helps with:**
- Dialogue attribution tracking
- Arc progression visualization
- Scene appearance analytics
- AI dialogue generation (maintains voice consistency)

#### 3. AI Configuration (Enhances Analysis)

```typescript
ai: {
  styleReferences: ['David Fincher', 'Aaron Sorkin'],
  toneDescriptor: 'Dark character study with sharp dialogue',
  uniqueConstraints: [
    'All scenes take place in a single building',
    'No flashbacks',
    'Protagonist never lies',
  ],
  customInstructions: 'Focus on subtext in dialogue analysis',
}
```

**Style references**: List writers/directors whose work matches your tone
**Unique constraints**: Rules the AI should respect when analyzing
**Custom instructions**: Additional context for better suggestions

#### 4. Scene Structure (For Full Functionality)

```typescript
sequences: [
  {
    id: 'SEQ-1',
    title: 'ACT ONE - SETUP',
    dramaticQuestion: 'Will John accept the case?',
    climax: 'John commits to the investigation',
    resolution: 'First clue discovered',
    scenes: [
      {
        id: 'scene-1-1',
        sequenceId: 'SEQ-1',
        title: 'Opening Image',
        pageNumber: 1,
        location: 'INT. POLICE STATION',
        timeOfDay: 'NIGHT',
        summary: 'John receives news that changes everything',
        scriptContent: `INT. POLICE STATION - NIGHT

John sits at his desk...`,
        beats: [
          { id: 'b1', description: 'Establish ordinary world', completed: true },
          { id: 'b2', description: 'Inciting incident', completed: false },
        ],
        notes: [],
        tracking: [
          { category: 'Theme', description: 'First mention of redemption motif' },
        ],
        connections: [
          { targetSceneId: 'scene-2-3', type: 'foreshadow', description: 'Gun in drawer' },
        ],
      },
    ],
  },
],
```

### Project Data Quality Checklist

For best results, ensure your project has:

- [ ] Complete logline with protagonist/goal/stakes
- [ ] All speaking characters defined with roles
- [ ] Character arcs described for main characters
- [ ] Genre tags (at least 2-3)
- [ ] Theme tags (at least 3-5)
- [ ] Scene summaries for each scene
- [ ] Beat breakdowns for key scenes
- [ ] Tracking points for plot/theme continuity
- [ ] Scene connections for callbacks/foreshadowing

---

## Import & Export

### Supported Import Formats

| Format | Extension | Auto-Detection |
|--------|-----------|----------------|
| PDF Screenplay | .pdf | Scene headings, characters, locations |
| Fountain | .fountain | Full formatting preserved |
| Plain Text | .txt | Basic scene detection |
| JSON | .json | ScriptSync project format |

### Export Options

| Format | Use Case |
|--------|----------|
| **Fountain** | Industry standard, works with any screenplay software |
| **Final Draft XML** | Import into Final Draft |
| **PDF** | Print-ready via browser print dialog |
| **Plain Text** | Readable format with metadata |
| **CSV (Beat Sheet)** | Spreadsheet view of scenes and beats |
| **CSV (Characters)** | Character appearance tracking |
| **JSON** | Full project backup |

---

## AI Features

### Scene Gap Analysis

Analyzes your scene against:
- Intended beats vs. actual execution
- "On-the-nose" dialogue detection
- Pacing relative to sequence position
- Continuity with surrounding scenes

### Dialogue Generation

Generates in-character dialogue based on:
- Character voice (from description/arc)
- Style references (configured writers/directors)
- Story context (themes, constraints)
- Scene intent (what you specify)

### Beat Alternatives

When a beat isn't working, get alternatives that:
- Maintain story logic
- Preserve character consistency
- Explore different emotional tones
- Suggest structural variations

### Chat Assistant

Context-aware chat that knows:
- Your entire project structure
- Character relationships
- Story themes and constraints
- Current scene context

---

## Keyboard Shortcuts

### Global

| Shortcut | Action |
|----------|--------|
| `?` | Show keyboard shortcuts |
| `Escape` | Close modal/panel |
| `Ctrl/Cmd + S` | Save current changes |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |

### Navigation

| Shortcut | Action |
|----------|--------|
| `1-5` | Switch views (Script, Beat Board, etc.) |
| `J` / `K` | Previous/Next scene |
| `[` / `]` | Previous/Next sequence |
| `G` then `S` | Go to Script View |
| `G` then `B` | Go to Beat Board |

### Editing

| Shortcut | Action |
|----------|--------|
| `E` | Edit selected item |
| `N` | New scene/beat |
| `D` | Delete selected (with confirmation) |
| `Enter` | Save edit |
| `Escape` | Cancel edit |

---

## Accessibility

ScriptSync is designed with accessibility in mind:

### Screen Reader Support
- ARIA labels on all interactive elements
- Live regions for dynamic content updates
- Semantic HTML structure

### Keyboard Navigation
- Full keyboard operability
- Visible focus indicators
- Skip links for main content

### Visual Adjustments
- Respects `prefers-reduced-motion`
- High contrast mode support via `prefers-contrast`
- Scalable text (rem units throughout)

### Motion Preferences

```css
/* Automatically detected */
@media (prefers-reduced-motion: reduce) {
  /* Animations disabled */
}
```

---

## Deployment

### Vercel (Recommended)

```bash
# Using Vercel CLI
vercel

# Or connect GitHub repo at vercel.com
```

Configuration in `vercel.json` includes:
- SPA routing
- Asset caching (1 year for hashed files)
- Security headers

### Netlify

```bash
# Using Netlify CLI
netlify deploy --prod

# Or connect GitHub repo at netlify.com
```

Configuration in `netlify.toml` includes:
- Build command and publish directory
- SPA redirects
- Security headers

### Environment Variables

Set in deployment platform:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | For AI | Google Gemini API key |
| `VITE_ACTIVE_PROJECT` | Optional | Default project to load |

---

## Configuration Reference

### ProjectConfig

```typescript
interface ProjectConfig {
  id: string;                    // URL-friendly identifier
  title: string;                 // Display title
  description?: string;          // Project summary
  logline: string;               // One-sentence pitch
  genres: string[];              // Genre tags
  themes: string[];              // Thematic elements
  characters: CharacterConfig[]; // Character roster
  ai?: AIConfig;                 // AI configuration
  trackingCategories?: string[]; // Custom tracking types
  noteAuthors?: string[];        // Author initials
  settings?: string[];           // Location presets
  meta?: {
    createdAt?: Date;
    updatedAt?: Date;
    version?: string;
    author?: string;
  };
}
```

### CharacterConfig

```typescript
interface CharacterConfig {
  name: string;                  // Character name (as in script)
  role: 'main' | 'supporting' | 'minor';
  description?: string;          // Character bio
  arc?: string;                  // Character journey
  aliases?: string[];            // Alternative names
}
```

### AIConfig

```typescript
interface AIConfig {
  styleReferences: string[];     // Writers/directors for tone
  toneDescriptor: string;        // Genre/style description
  uniqueConstraints: string[];   // Story rules
  customInstructions?: string;   // Additional AI context
}
```

### Scene

```typescript
interface Scene {
  id: string;
  sequenceId: string;
  title: string;
  pageNumber: number;
  scriptContent: string;
  summary: string;
  location?: string;             // INT./EXT. LOCATION
  timeOfDay?: 'DAY' | 'NIGHT' | 'DAWN' | 'DUSK' | 'CONTINUOUS';
  beats: Beat[];
  notes: SceneNote[];
  tracking: TrackingPoint[];
  connections?: SceneConnection[];
  variants?: Record<string, string>;  // Alternative versions
  activeVariant?: string;
}
```

### Beat

```typescript
interface Beat {
  id: string;
  description: string;
  completed: boolean;
}
```

### SceneConnection

```typescript
interface SceneConnection {
  targetSceneId: string;
  type: 'causal' | 'thematic' | 'echo' | 'foreshadow' | 'callback';
  description: string;
}
```

---

## API Reference

### Storage Service

```typescript
import { storageService } from './services/storageService';

// Save project
storageService.saveProject(projectData);

// Load project
const project = storageService.loadProject();

// Auto-save with debounce
storageService.autoSave(projectData);
```

### Export Service

```typescript
import { exportProject, ExportFormat } from './services/exportService';

// Export to format
exportProject(project, 'fountain');  // Downloads .fountain file
exportProject(project, 'fdx');       // Downloads .fdx file
exportProject(project, 'txt', { includeNotes: true });
```

### Version History

```typescript
import { getVersionHistoryManager } from './services/versionHistory';

const versionManager = getVersionHistoryManager();

// Record version
versionManager.recordVersion(scene, 'content_edit', 'Optional label');

// Get history
const history = versionManager.getHistory(sceneId);

// Restore version
versionManager.restoreVersion(scene, versionId, (updates) => {
  updateScene(updates);
});
```

### PDF Parser

```typescript
import { parsePDF, validatePDFFile } from './services/pdfParser';

// Validate file
const { valid, error } = await validatePDFFile(file);

// Parse with progress
const result = await parsePDF(file, (progress) => {
  console.log(`${progress.stage}: ${progress.progress}%`);
});

// Result includes: title, author, scenes, characters, rawText
```

### AI Services

```typescript
import { analyzeSceneGap, generateDialogue, chatWithAI } from './services/geminiService';

// Analyze scene
const analysis = await analyzeSceneGap(scene, allScenes, config);

// Generate dialogue
const dialogue = await generateDialogue(scene, 'CHARACTER', 'intent', allScenes, config);

// Chat
const response = await chatWithAI(messages, scene, allScenes, config);
```

---

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run test     # Run tests
npm run lint     # Lint code
```

### Project Structure

```
scriptsync/
├── src/
│   ├── components/          # React components
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── BeatBoard.tsx
│   │   ├── CharacterDashboard.tsx
│   │   ├── ScriptView.tsx
│   │   ├── TimelineView.tsx
│   │   ├── WelcomePage.tsx
│   │   └── ...
│   ├── config/              # Types and context
│   │   ├── types.ts
│   │   └── ProjectContext.tsx
│   ├── services/            # Business logic
│   │   ├── exportService.ts
│   │   ├── geminiService.ts
│   │   ├── pdfParser.ts
│   │   ├── storageService.ts
│   │   └── versionHistory.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useMobileLayout.ts
│   └── test/                # Test setup
├── dist/                    # Production build
├── vercel.json              # Vercel config
├── netlify.toml             # Netlify config
└── vitest.config.ts         # Test config
```

---

## License

MIT

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/scriptsync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/scriptsync/discussions)

Built with React, TypeScript, Vite, and Google Gemini AI.
