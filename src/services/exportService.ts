/**
 * Export Service
 *
 * Handles exporting screenplay data to various formats:
 * - Fountain (.fountain)
 * - PDF (via browser print)
 * - Plain text
 * - Final Draft XML (.fdx)
 */

import { ProjectData, Scene } from '../config/types';

// =============================================================================
// FOUNTAIN EXPORT
// =============================================================================

/**
 * Export project to Fountain format
 * https://fountain.io/syntax
 */
export const exportToFountain = (project: ProjectData): string => {
  const { config, sequences } = project;
  const lines: string[] = [];

  // Title page
  lines.push(`Title: ${config.title}`);
  lines.push(`Credit: Written by`);
  lines.push(`Author: ${config.meta?.author || 'Unknown'}`);
  lines.push(`Draft date: ${new Date().toLocaleDateString()}`);
  lines.push(`Contact: `);
  lines.push('');
  lines.push('==='); // Page break after title
  lines.push('');

  // Process each sequence
  sequences.forEach((sequence, seqIndex) => {
    // Add sequence header as a section
    lines.push(`# ${sequence.title}`);
    lines.push('');

    sequence.scenes.forEach((scene) => {
      // Scene heading (slug line)
      const heading = formatSceneHeading(scene);
      lines.push(heading);
      lines.push('');

      // Scene content
      if (scene.scriptContent) {
        lines.push(scene.scriptContent.trim());
        lines.push('');
      }
    });

    // Add page break between sequences (except last)
    if (seqIndex < sequences.length - 1) {
      lines.push('===');
      lines.push('');
    }
  });

  return lines.join('\n');
};

/**
 * Format scene heading from scene data
 */
const formatSceneHeading = (scene: Scene): string => {
  const location = scene.location || 'INT. LOCATION';
  const timeOfDay = scene.timeOfDay || 'DAY';
  return `${location} - ${timeOfDay}`;
};

// =============================================================================
// PLAIN TEXT EXPORT
// =============================================================================

/**
 * Export to plain text (for reading/editing)
 */
export const exportToText = (project: ProjectData, options?: {
  includeNotes?: boolean;
  includeBeats?: boolean;
  includeConnections?: boolean;
}): string => {
  const { config, sequences } = project;
  const opts = {
    includeNotes: false,
    includeBeats: false,
    includeConnections: false,
    ...options,
  };

  const lines: string[] = [];

  // Header
  lines.push('='.repeat(60));
  lines.push(config.title.toUpperCase());
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`Logline: ${config.logline}`);
  lines.push(`Genres: ${config.genres.join(', ')}`);
  lines.push(`Themes: ${config.themes.join(', ')}`);
  lines.push('');

  // Process sequences
  sequences.forEach((sequence, seqIndex) => {
    lines.push('-'.repeat(60));
    lines.push(`SEQUENCE ${seqIndex + 1}: ${sequence.title.toUpperCase()}`);
    lines.push(`Dramatic Question: ${sequence.dramaticQuestion}`);
    lines.push('-'.repeat(60));
    lines.push('');

    sequence.scenes.forEach((scene, sceneIndex) => {
      lines.push(`[Scene ${seqIndex + 1}.${sceneIndex + 1}] ${scene.title}`);
      lines.push(`Page ${scene.pageNumber} | ${formatSceneHeading(scene)}`);
      lines.push('');

      // Summary
      if (scene.summary) {
        lines.push(`SUMMARY: ${scene.summary}`);
        lines.push('');
      }

      // Beats
      if (opts.includeBeats && scene.beats.length > 0) {
        lines.push('BEATS:');
        scene.beats.forEach((beat, i) => {
          const status = beat.completed ? '✓' : '○';
          lines.push(`  ${status} ${i + 1}. ${beat.description}`);
        });
        lines.push('');
      }

      // Script content
      if (scene.scriptContent) {
        lines.push('SCRIPT:');
        lines.push(scene.scriptContent);
        lines.push('');
      }

      // Notes
      if (opts.includeNotes && scene.notes.length > 0) {
        lines.push('NOTES:');
        scene.notes.forEach(note => {
          lines.push(`  [${note.type}] ${note.author}: ${note.content}`);
        });
        lines.push('');
      }

      // Connections
      if (opts.includeConnections && scene.connections && scene.connections.length > 0) {
        lines.push('CONNECTIONS:');
        scene.connections.forEach(conn => {
          lines.push(`  → ${conn.type}: ${conn.description} (→ ${conn.targetSceneId})`);
        });
        lines.push('');
      }

      lines.push('');
    });
  });

  // Footer
  lines.push('='.repeat(60));
  lines.push(`Exported: ${new Date().toLocaleString()}`);
  lines.push(`Total Scenes: ${sequences.reduce((sum, seq) => sum + seq.scenes.length, 0)}`);
  lines.push('='.repeat(60));

  return lines.join('\n');
};

// =============================================================================
// FINAL DRAFT XML EXPORT
// =============================================================================

/**
 * Export to Final Draft XML format (.fdx)
 */
export const exportToFDX = (project: ProjectData): string => {
  const { config, sequences } = project;

  const paragraphs: string[] = [];

  // Process all scenes
  sequences.forEach(sequence => {
    sequence.scenes.forEach(scene => {
      // Scene heading
      paragraphs.push(`<Paragraph Type="Scene Heading">
        <Text>${escapeXml(formatSceneHeading(scene))}</Text>
      </Paragraph>`);

      // Parse script content into paragraphs
      if (scene.scriptContent) {
        const parsed = parseScriptContent(scene.scriptContent);
        parsed.forEach(p => {
          paragraphs.push(`<Paragraph Type="${p.type}">
            <Text>${escapeXml(p.text)}</Text>
          </Paragraph>`);
        });
      }
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script" Template="No" Version="3">
  <Content>
    ${paragraphs.join('\n    ')}
  </Content>
  <TitlePage>
    <Content>
      <Paragraph Type="Title Page">
        <Text>${escapeXml(config.title)}</Text>
      </Paragraph>
      <Paragraph Type="Title Page">
        <Text>Written by</Text>
      </Paragraph>
      <Paragraph Type="Title Page">
        <Text>${escapeXml(config.meta?.author || '')}</Text>
      </Paragraph>
    </Content>
  </TitlePage>
</FinalDraft>`;
};

/**
 * Parse script content into typed paragraphs
 */
const parseScriptContent = (content: string): { type: string; text: string }[] => {
  const lines = content.split('\n');
  const paragraphs: { type: string; text: string }[] = [];
  let currentType = 'Action';
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (buffer.length > 0) {
      paragraphs.push({ type: currentType, text: buffer.join('\n').trim() });
      buffer = [];
    }
  };

  lines.forEach(line => {
    const trimmed = line.trim();

    // Scene heading
    if (/^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)/.test(trimmed)) {
      flushBuffer();
      paragraphs.push({ type: 'Scene Heading', text: trimmed });
      currentType = 'Action';
    }
    // Character name (all caps, optionally with parenthetical)
    else if (/^[A-Z][A-Z\s\-']+(\s*\(.*\))?$/.test(trimmed) && trimmed.length < 40) {
      flushBuffer();
      paragraphs.push({ type: 'Character', text: trimmed });
      currentType = 'Dialogue';
    }
    // Parenthetical
    else if (/^\(.*\)$/.test(trimmed)) {
      flushBuffer();
      paragraphs.push({ type: 'Parenthetical', text: trimmed });
      currentType = 'Dialogue';
    }
    // Transition
    else if (/^(FADE IN:|FADE OUT\.|CUT TO:|DISSOLVE TO:|SMASH CUT:|MATCH CUT:)/.test(trimmed)) {
      flushBuffer();
      paragraphs.push({ type: 'Transition', text: trimmed });
      currentType = 'Action';
    }
    // Empty line - flush buffer
    else if (!trimmed) {
      flushBuffer();
      currentType = 'Action';
    }
    // Regular content
    else {
      buffer.push(trimmed);
    }
  });

  flushBuffer();
  return paragraphs;
};

/**
 * Escape special XML characters
 */
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// =============================================================================
// CSV EXPORT (Beat Sheet)
// =============================================================================

/**
 * Export beat sheet to CSV
 */
export const exportBeatSheetToCSV = (project: ProjectData): string => {
  const { sequences } = project;
  const rows: string[][] = [];

  // Header
  rows.push(['Sequence', 'Scene', 'Page', 'Title', 'Summary', 'Beats', 'Beat Status']);

  sequences.forEach(sequence => {
    sequence.scenes.forEach(scene => {
      const beatsText = scene.beats.map(b => b.description).join('; ');
      const beatStatus = scene.beats.length > 0
        ? `${scene.beats.filter(b => b.completed).length}/${scene.beats.length} complete`
        : 'No beats';

      rows.push([
        sequence.title,
        scene.title,
        scene.pageNumber.toString(),
        scene.title,
        scene.summary,
        beatsText,
        beatStatus,
      ]);
    });
  });

  // Convert to CSV
  return rows.map(row =>
    row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
  ).join('\n');
};

/**
 * Export character appearances to CSV
 */
export const exportCharactersToCSV = (project: ProjectData): string => {
  const { config, sequences } = project;
  const rows: string[][] = [];

  // Header
  rows.push(['Character', 'Role', 'Scene Count', 'Sequences', 'First Appearance']);

  // Count appearances
  const characterScenes: Record<string, Set<string>> = {};
  const characterFirstAppearance: Record<string, string> = {};

  sequences.forEach(sequence => {
    sequence.scenes.forEach(scene => {
      // Extract character names from script content
      const characterMatches = scene.scriptContent.match(/^[A-Z][A-Z\s\-']+$/gm) || [];
      characterMatches.forEach(char => {
        const name = char.trim();
        if (!characterScenes[name]) {
          characterScenes[name] = new Set();
          characterFirstAppearance[name] = scene.title;
        }
        characterScenes[name].add(scene.id);
      });
    });
  });

  // Build rows from config characters
  config.characters.forEach(char => {
    const scenes = characterScenes[char.name] || new Set();
    const firstAppearance = characterFirstAppearance[char.name] || 'N/A';

    rows.push([
      char.name,
      char.role,
      scenes.size.toString(),
      Array.from(scenes).length > 3 ? `${Array.from(scenes).slice(0, 3).join(', ')}...` : Array.from(scenes).join(', '),
      firstAppearance,
    ]);
  });

  return rows.map(row =>
    row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
  ).join('\n');
};

// =============================================================================
// DOWNLOAD HELPERS
// =============================================================================

/**
 * Download content as a file
 */
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Generate print-ready HTML for PDF export (via browser print)
 */
export const generatePrintHTML = (project: ProjectData): string => {
  const { config, sequences } = project;

  const scenesHTML = sequences.map(sequence =>
    sequence.scenes.map(scene => `
      <div class="scene">
        <div class="scene-heading">${formatSceneHeading(scene)}</div>
        <div class="scene-content">${scene.scriptContent.replace(/\n/g, '<br>')}</div>
      </div>
    `).join('')
  ).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${config.title}</title>
  <style>
    @page {
      size: letter;
      margin: 1in;
    }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12pt;
      line-height: 1.5;
      max-width: 6in;
      margin: 0 auto;
    }
    .title-page {
      text-align: center;
      padding-top: 3in;
      page-break-after: always;
    }
    .title {
      font-size: 24pt;
      text-transform: uppercase;
    }
    .author {
      margin-top: 2em;
    }
    .scene {
      margin-bottom: 2em;
    }
    .scene-heading {
      text-transform: uppercase;
      margin-bottom: 1em;
    }
    .scene-content {
      white-space: pre-wrap;
    }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="title-page">
    <div class="title">${config.title}</div>
    <div class="author">Written by<br>${config.meta?.author || 'Unknown'}</div>
  </div>
  ${scenesHTML}
  <script class="no-print">
    window.onload = () => window.print();
  </script>
</body>
</html>`;
};

/**
 * Open print dialog for PDF export
 */
export const printToPDF = (project: ProjectData): void => {
  const html = generatePrintHTML(project);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================

export type ExportFormat = 'fountain' | 'fdx' | 'txt' | 'pdf' | 'csv-beats' | 'csv-characters' | 'json';

/**
 * Export project to specified format
 */
export const exportProject = (
  project: ProjectData,
  format: ExportFormat,
  options?: {
    includeNotes?: boolean;
    includeBeats?: boolean;
    includeConnections?: boolean;
  }
): void => {
  const filename = project.config.id;

  switch (format) {
    case 'fountain':
      downloadFile(exportToFountain(project), `${filename}.fountain`, 'text/plain');
      break;

    case 'fdx':
      downloadFile(exportToFDX(project), `${filename}.fdx`, 'application/xml');
      break;

    case 'txt':
      downloadFile(exportToText(project, options), `${filename}.txt`, 'text/plain');
      break;

    case 'pdf':
      printToPDF(project);
      break;

    case 'csv-beats':
      downloadFile(exportBeatSheetToCSV(project), `${filename}-beats.csv`, 'text/csv');
      break;

    case 'csv-characters':
      downloadFile(exportCharactersToCSV(project), `${filename}-characters.csv`, 'text/csv');
      break;

    case 'json':
      downloadFile(JSON.stringify(project, null, 2), `${filename}.json`, 'application/json');
      break;
  }
};
