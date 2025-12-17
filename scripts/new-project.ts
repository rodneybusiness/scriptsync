#!/usr/bin/env npx tsx
/**
 * ScriptSync - New Project Scaffolding Script
 *
 * Usage:
 *   npm run new-project -- --name="project-name" --title="Project Title"
 *
 * Or directly:
 *   npx tsx scripts/new-project.ts --name="project-name" --title="Project Title"
 */

import * as fs from 'fs';
import * as path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const params: Record<string, string> = {};

args.forEach((arg) => {
  const match = arg.match(/^--(\w+)=["']?(.+?)["']?$/);
  if (match) {
    params[match[1]] = match[2];
  }
});

const projectName = params.name;
const projectTitle = params.title || projectName;

if (!projectName) {
  console.error('Error: --name is required');
  console.log('Usage: npm run new-project -- --name="project-name" --title="Project Title"');
  process.exit(1);
}

// Validate project name (kebab-case)
if (!/^[a-z][a-z0-9-]*$/.test(projectName)) {
  console.error('Error: Project name must be lowercase kebab-case (e.g., "my-screenplay")');
  process.exit(1);
}

const projectDir = path.join(__dirname, '..', 'src', 'projects', projectName);

// Check if project already exists
if (fs.existsSync(projectDir)) {
  console.error(`Error: Project "${projectName}" already exists at ${projectDir}`);
  process.exit(1);
}

// Create project directory
fs.mkdirSync(projectDir, { recursive: true });
console.log(`Created project directory: ${projectDir}`);

// Generate config.ts
const configContent = `/**
 * ${projectTitle} - Project Configuration
 *
 * Customize this file with your screenplay's details.
 */

import { ProjectConfig } from '../../config/types';

export const config: ProjectConfig = {
  id: '${projectName}',
  title: '${projectTitle}',
  description: 'Add your screenplay description here.',
  genres: ['Drama'], // Add your genres
  logline: 'Add your logline here.',

  characters: [
    // Main Characters
    { name: 'Protagonist', role: 'main', description: 'Main character description' },

    // Supporting Characters
    { name: 'Supporting', role: 'supporting', description: 'Supporting character description' },
  ],

  themes: [
    'Add your themes',
  ],

  ai: {
    styleReferences: ['Add director/writer references'],
    toneDescriptor: 'Describe the tone and style for AI context',
    uniqueConstraints: [
      'Add any special rules or constraints for your story',
    ],
    customInstructions: 'Additional context for AI analysis.',
  },

  trackingCategories: [
    'Plot',
    'Character Arc',
    'Theme',
    'Setup',
    'Payoff',
  ],

  noteAuthors: ['YOU'], // Your initials

  meta: {
    version: '1.0.0',
    author: 'Your Name',
  },
};

export default config;
`;

fs.writeFileSync(path.join(projectDir, 'config.ts'), configContent);
console.log('Created config.ts');

// Generate sequences.ts
const sequencesContent = `/**
 * ${projectTitle} - Screenplay Data
 *
 * Add your screenplay content organized by sequences and scenes.
 */

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
        title: 'Opening Scene',
        summary: 'Brief scene summary.',
        content: \`INT. LOCATION - DAY

Description of the scene.

CHARACTER
Dialogue here.

Action continues.\`,
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
      // Add more scenes to this sequence...
    ],
  },
  // Add more sequences (SEQ-2, SEQ-3, etc.)...
];

export default sequences;
`;

fs.writeFileSync(path.join(projectDir, 'sequences.ts'), sequencesContent);
console.log('Created sequences.ts');

// Generate index.ts
const indexContent = `/**
 * ${projectTitle} - Project Export
 */

import { ProjectData } from '../../config/types';
import { config } from './config';
import { sequences } from './sequences';

const projectData: ProjectData = {
  config,
  sequences,
};

export default projectData;
export { config, sequences };
`;

fs.writeFileSync(path.join(projectDir, 'index.ts'), indexContent);
console.log('Created index.ts');

// Update .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('VITE_ACTIVE_PROJECT=')) {
    envContent = envContent.replace(
      /VITE_ACTIVE_PROJECT=.*/,
      `VITE_ACTIVE_PROJECT=${projectName}`
    );
  } else {
    envContent += `\nVITE_ACTIVE_PROJECT=${projectName}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log(`Updated .env.local to use project: ${projectName}`);
}

console.log(`
✓ Project "${projectTitle}" scaffolded successfully!

Next steps:
1. Edit src/projects/${projectName}/config.ts with your screenplay details
2. Add your scenes to src/projects/${projectName}/sequences.ts
3. Run 'npm run dev' to start developing

Your project is now the active project in .env.local
`);
