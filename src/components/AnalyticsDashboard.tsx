/**
 * Analytics Dashboard Component
 *
 * Provides comprehensive analytics and insights for screenplays:
 * - Word count and page estimates
 * - Character screen time analysis
 * - Scene distribution by location/time
 * - Dialogue vs action ratio
 * - Pacing analysis
 * - Beat completion tracking
 */

import React, { useMemo } from 'react';
import { ProjectData, Scene } from '../config/types';

// =============================================================================
// TYPES
// =============================================================================

interface AnalyticsData {
  overview: OverviewStats;
  characters: CharacterStats[];
  scenes: SceneStats;
  pacing: PacingStats;
  progress: ProgressStats;
}

interface OverviewStats {
  totalWords: number;
  estimatedPages: number;
  estimatedRuntime: number; // in minutes
  totalScenes: number;
  totalSequences: number;
  totalCharacters: number;
  dialogueWords: number;
  actionWords: number;
  dialogueRatio: number; // 0-1
}

interface CharacterStats {
  name: string;
  role: string;
  sceneCount: number;
  dialogueWords: number;
  dialoguePercentage: number;
  firstAppearance: { page: number; scene: string };
  lastAppearance: { page: number; scene: string };
}

interface SceneStats {
  byLocation: { location: string; count: number; percentage: number }[];
  byTimeOfDay: { time: string; count: number; percentage: number }[];
  averageLength: number; // words
  longestScene: { title: string; words: number };
  shortestScene: { title: string; words: number };
}

interface PacingStats {
  actBreakdown: { act: number; scenes: number; words: number; percentage: number }[];
  scenesByPage: { page: number; count: number }[];
  dialogueDensity: { sequence: string; ratio: number }[];
}

interface ProgressStats {
  totalBeats: number;
  completedBeats: number;
  completionPercentage: number;
  noteCount: number;
  connectionCount: number;
}

interface AnalyticsDashboardProps {
  project: ProjectData;
  onClose?: () => void;
}

// =============================================================================
// ANALYTICS CALCULATION
// =============================================================================

const WORDS_PER_PAGE = 250; // Industry standard
const MINUTES_PER_PAGE = 1; // 1 page ≈ 1 minute of screen time

const calculateAnalytics = (project: ProjectData): AnalyticsData => {
  const { sequences, config } = project;

  // Flatten all scenes
  const allScenes: (Scene & { sequenceTitle: string })[] = sequences.flatMap(seq =>
    seq.scenes.map(scene => ({ ...scene, sequenceTitle: seq.title }))
  );

  // Calculate overview stats
  let totalWords = 0;
  let dialogueWords = 0;
  let actionWords = 0;

  const sceneWordCounts: { scene: Scene; words: number }[] = [];
  const characterDialogue: Map<string, number> = new Map();
  const characterScenes: Map<string, Set<string>> = new Map();
  const characterFirstAppearance: Map<string, { page: number; scene: string }> = new Map();
  const characterLastAppearance: Map<string, { page: number; scene: string }> = new Map();

  for (const scene of allScenes) {
    const content = scene.scriptContent || '';
    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    totalWords += words;
    sceneWordCounts.push({ scene, words });

    // Simple heuristic: lines starting with all-caps names are character cues
    const lines = content.split('\n');
    let inDialogue = false;
    let currentCharacter = '';

    for (const line of lines) {
      const trimmed = line.trim();

      // Character name detection (all caps, short line)
      if (/^[A-Z][A-Z\s\-'\.]+$/.test(trimmed) && trimmed.length < 40) {
        inDialogue = true;
        currentCharacter = trimmed
          .replace(/\s*\(V\.O\.\)/i, '')
          .replace(/\s*\(O\.S\.\)/i, '')
          .replace(/\s*\(O\.C\.\)/i, '')
          .replace(/\s*\(CONT'D\)/i, '')
          .trim();

        // Track character appearances
        if (!characterScenes.has(currentCharacter)) {
          characterScenes.set(currentCharacter, new Set());
        }
        characterScenes.get(currentCharacter)!.add(scene.id);

        // Track first/last appearance
        if (!characterFirstAppearance.has(currentCharacter)) {
          characterFirstAppearance.set(currentCharacter, {
            page: scene.pageNumber,
            scene: scene.title,
          });
        }
        characterLastAppearance.set(currentCharacter, {
          page: scene.pageNumber,
          scene: scene.title,
        });
      } else if (inDialogue && trimmed) {
        // This is dialogue
        const lineWords = trimmed.split(/\s+/).filter(w => w.length > 0).length;
        dialogueWords += lineWords;

        if (currentCharacter) {
          const current = characterDialogue.get(currentCharacter) || 0;
          characterDialogue.set(currentCharacter, current + lineWords);
        }

        // Parenthetical ends dialogue continuation expectation
        if (!/^\([^)]+\)$/.test(trimmed)) {
          inDialogue = false;
        }
      } else if (trimmed && !inDialogue) {
        // Action/description
        actionWords += trimmed.split(/\s+/).filter(w => w.length > 0).length;
      }
    }
  }

  // Overview stats
  const overview: OverviewStats = {
    totalWords,
    estimatedPages: Math.ceil(totalWords / WORDS_PER_PAGE),
    estimatedRuntime: Math.round(totalWords / WORDS_PER_PAGE * MINUTES_PER_PAGE),
    totalScenes: allScenes.length,
    totalSequences: sequences.length,
    totalCharacters: config.characters.length,
    dialogueWords,
    actionWords,
    dialogueRatio: totalWords > 0 ? dialogueWords / totalWords : 0,
  };

  // Character stats
  const characters: CharacterStats[] = config.characters.map(char => {
    const dialogue = characterDialogue.get(char.name) || 0;
    const scenes = characterScenes.get(char.name) || new Set();
    const first = characterFirstAppearance.get(char.name) || { page: 0, scene: 'N/A' };
    const last = characterLastAppearance.get(char.name) || { page: 0, scene: 'N/A' };

    return {
      name: char.name,
      role: char.role,
      sceneCount: scenes.size,
      dialogueWords: dialogue,
      dialoguePercentage: dialogueWords > 0 ? dialogue / dialogueWords : 0,
      firstAppearance: first,
      lastAppearance: last,
    };
  }).sort((a, b) => b.dialogueWords - a.dialogueWords);

  // Scene stats by location
  const locationCounts = new Map<string, number>();
  const timeCounts = new Map<string, number>();

  for (const scene of allScenes) {
    const loc = scene.location || 'Unknown';
    const time = scene.timeOfDay || 'Unknown';

    locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1);
    timeCounts.set(time, (timeCounts.get(time) || 0) + 1);
  }

  const byLocation = Array.from(locationCounts.entries())
    .map(([location, count]) => ({
      location,
      count,
      percentage: count / allScenes.length,
    }))
    .sort((a, b) => b.count - a.count);

  const byTimeOfDay = Array.from(timeCounts.entries())
    .map(([time, count]) => ({
      time,
      count,
      percentage: count / allScenes.length,
    }))
    .sort((a, b) => b.count - a.count);

  // Find longest/shortest scenes
  const sortedByWords = [...sceneWordCounts].sort((a, b) => b.words - a.words);
  const longestScene = sortedByWords[0] || { scene: { title: 'N/A' }, words: 0 };
  const shortestScene = sortedByWords.filter(s => s.words > 0).pop() || { scene: { title: 'N/A' }, words: 0 };

  const scenes: SceneStats = {
    byLocation,
    byTimeOfDay,
    averageLength: allScenes.length > 0 ? Math.round(totalWords / allScenes.length) : 0,
    longestScene: { title: longestScene.scene.title, words: longestScene.words },
    shortestScene: { title: shortestScene.scene.title, words: shortestScene.words },
  };

  // Pacing stats
  const actBreakdown: PacingStats['actBreakdown'] = sequences.map((seq, idx) => {
    const seqWords = seq.scenes.reduce((sum, scene) => {
      const content = scene.scriptContent || '';
      return sum + content.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);

    return {
      act: idx + 1,
      scenes: seq.scenes.length,
      words: seqWords,
      percentage: totalWords > 0 ? seqWords / totalWords : 0,
    };
  });

  // Scenes by page range
  const pageGroups = new Map<number, number>();
  for (const scene of allScenes) {
    const pageGroup = Math.floor(scene.pageNumber / 10) * 10; // Group by 10 pages
    pageGroups.set(pageGroup, (pageGroups.get(pageGroup) || 0) + 1);
  }

  const scenesByPage = Array.from(pageGroups.entries())
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => a.page - b.page);

  // Dialogue density by sequence
  const dialogueDensity = sequences.map(seq => {
    let seqDialogue = 0;
    let seqTotal = 0;

    for (const scene of seq.scenes) {
      const content = scene.scriptContent || '';
      const words = content.split(/\s+/).filter(w => w.length > 0).length;
      seqTotal += words;

      // Estimate dialogue (rough heuristic)
      const lines = content.split('\n');
      let inDialogue = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^[A-Z][A-Z\s\-'\.]+$/.test(trimmed) && trimmed.length < 40) {
          inDialogue = true;
        } else if (inDialogue && trimmed && !/^\([^)]+\)$/.test(trimmed)) {
          seqDialogue += trimmed.split(/\s+/).filter(w => w.length > 0).length;
          inDialogue = false;
        }
      }
    }

    return {
      sequence: seq.title,
      ratio: seqTotal > 0 ? seqDialogue / seqTotal : 0,
    };
  });

  const pacing: PacingStats = {
    actBreakdown,
    scenesByPage,
    dialogueDensity,
  };

  // Progress stats
  let totalBeats = 0;
  let completedBeats = 0;
  let noteCount = 0;
  let connectionCount = 0;

  for (const scene of allScenes) {
    totalBeats += scene.beats.length;
    completedBeats += scene.beats.filter(b => b.completed).length;
    noteCount += scene.notes.length;
    connectionCount += scene.connections?.length || 0;
  }

  const progress: ProgressStats = {
    totalBeats,
    completedBeats,
    completionPercentage: totalBeats > 0 ? completedBeats / totalBeats : 0,
    noteCount,
    connectionCount,
  };

  return { overview, characters, scenes, pacing, progress };
};

// =============================================================================
// CHART COMPONENTS
// =============================================================================

interface SimpleBarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  showPercentage?: boolean;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  maxValue,
  showPercentage = false,
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="w-24 text-xs text-zinc-400 truncate">{item.label}</div>
          <div className="flex-1 h-4 bg-zinc-800 rounded overflow-hidden">
            <div
              className={`h-full ${item.color || 'bg-blue-500'} transition-all`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <div className="w-16 text-xs text-zinc-300 text-right">
            {showPercentage
              ? `${Math.round(item.value * 100)}%`
              : item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

interface DonutChartProps {
  value: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value * circumference);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3f3f46"
          strokeWidth={strokeWidth}
        />
        {/* Value circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-bold text-white">{Math.round(value * 100)}%</div>
        {label && <div className="text-xs text-zinc-500">{label}</div>}
      </div>
    </div>
  );
};

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => (
  <div className="bg-zinc-800/50 rounded-lg p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-zinc-400 mt-0.5">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </p>
        )}
      </div>
      {icon && (
        <div className="text-zinc-600">{icon}</div>
      )}
    </div>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  project,
  onClose,
}) => {
  const analytics = useMemo(() => calculateAnalytics(project), [project]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-zinc-900 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Analytics Dashboard</h2>
            <p className="text-sm text-zinc-500">{project.config.title}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Overview Stats */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard
                title="Words"
                value={analytics.overview.totalWords.toLocaleString()}
                subtitle={`~${analytics.overview.estimatedPages} pages`}
              />
              <StatCard
                title="Runtime"
                value={`${analytics.overview.estimatedRuntime}m`}
                subtitle="estimated"
              />
              <StatCard
                title="Scenes"
                value={analytics.overview.totalScenes}
                subtitle={`${analytics.overview.totalSequences} sequences`}
              />
              <StatCard
                title="Characters"
                value={analytics.overview.totalCharacters}
              />
              <StatCard
                title="Dialogue"
                value={`${Math.round(analytics.overview.dialogueRatio * 100)}%`}
                subtitle={`${analytics.overview.dialogueWords.toLocaleString()} words`}
              />
              <StatCard
                title="Action"
                value={`${Math.round((1 - analytics.overview.dialogueRatio) * 100)}%`}
                subtitle={`${analytics.overview.actionWords.toLocaleString()} words`}
              />
            </div>
          </section>

          {/* Progress & Completion */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 flex items-center gap-4">
                <DonutChart
                  value={analytics.progress.completionPercentage}
                  color="#22c55e"
                  label="Beats"
                />
                <div>
                  <p className="text-white font-medium">Beat Completion</p>
                  <p className="text-sm text-zinc-400">
                    {analytics.progress.completedBeats} of {analytics.progress.totalBeats} beats done
                  </p>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Notes</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {analytics.progress.noteCount}
                </p>
                <p className="text-sm text-zinc-400">across all scenes</p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Connections</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {analytics.progress.connectionCount}
                </p>
                <p className="text-sm text-zinc-400">scene links</p>
              </div>
            </div>
          </section>

          {/* Character Analysis */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Character Analysis
            </h3>
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="text-left p-3 text-zinc-400 font-medium">Character</th>
                      <th className="text-left p-3 text-zinc-400 font-medium">Role</th>
                      <th className="text-right p-3 text-zinc-400 font-medium">Scenes</th>
                      <th className="text-right p-3 text-zinc-400 font-medium">Dialogue</th>
                      <th className="text-right p-3 text-zinc-400 font-medium hidden sm:table-cell">First</th>
                      <th className="text-right p-3 text-zinc-400 font-medium hidden sm:table-cell">Last</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.characters.slice(0, 10).map((char, idx) => (
                      <tr key={char.name} className={idx % 2 === 0 ? 'bg-zinc-800/30' : ''}>
                        <td className="p-3 text-white font-medium">{char.name}</td>
                        <td className="p-3 text-zinc-400 capitalize">{char.role}</td>
                        <td className="p-3 text-right text-zinc-300">{char.sceneCount}</td>
                        <td className="p-3 text-right">
                          <span className="text-zinc-300">{char.dialogueWords}</span>
                          <span className="text-zinc-500 ml-1">
                            ({Math.round(char.dialoguePercentage * 100)}%)
                          </span>
                        </td>
                        <td className="p-3 text-right text-zinc-400 hidden sm:table-cell">
                          p.{char.firstAppearance.page}
                        </td>
                        <td className="p-3 text-right text-zinc-400 hidden sm:table-cell">
                          p.{char.lastAppearance.page}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Scene Distribution */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">Scenes by Location</h4>
              <SimpleBarChart
                data={analytics.scenes.byLocation.slice(0, 8).map(item => ({
                  label: item.location.length > 20 ? item.location.slice(0, 20) + '...' : item.location,
                  value: item.count,
                  color: 'bg-blue-500',
                }))}
              />
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">Scenes by Time of Day</h4>
              <SimpleBarChart
                data={analytics.scenes.byTimeOfDay.map(item => ({
                  label: item.time,
                  value: item.count,
                  color: item.time.includes('NIGHT') || item.time.includes('EVENING')
                    ? 'bg-indigo-500'
                    : 'bg-amber-500',
                }))}
              />
            </div>
          </section>

          {/* Pacing Analysis */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Pacing Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Act/Sequence Breakdown</h4>
                <SimpleBarChart
                  data={analytics.pacing.actBreakdown.map(act => ({
                    label: `Act ${act.act}`,
                    value: act.percentage,
                    color: act.act === 1 ? 'bg-green-500' : act.act === 2 ? 'bg-blue-500' : 'bg-purple-500',
                  }))}
                  maxValue={1}
                  showPercentage
                />
                <div className="mt-3 pt-3 border-t border-zinc-700 grid grid-cols-3 gap-2 text-center">
                  {analytics.pacing.actBreakdown.map(act => (
                    <div key={act.act}>
                      <p className="text-xs text-zinc-500">Act {act.act}</p>
                      <p className="text-sm text-white">{act.scenes} scenes</p>
                      <p className="text-xs text-zinc-400">{act.words.toLocaleString()} words</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Dialogue Density by Sequence</h4>
                <SimpleBarChart
                  data={analytics.pacing.dialogueDensity.map(item => ({
                    label: item.sequence.length > 15 ? item.sequence.slice(0, 15) + '...' : item.sequence,
                    value: item.ratio,
                    color: item.ratio > 0.5 ? 'bg-cyan-500' : 'bg-orange-500',
                  }))}
                  maxValue={1}
                  showPercentage
                />
              </div>
            </div>
          </section>

          {/* Scene Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Average Scene Length</p>
              <p className="text-2xl font-bold text-white mt-1">
                {analytics.scenes.averageLength} words
              </p>
              <p className="text-sm text-zinc-400">
                ~{Math.round(analytics.scenes.averageLength / WORDS_PER_PAGE * 10) / 10} pages
              </p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Longest Scene</p>
              <p className="text-lg font-medium text-white mt-1 truncate">
                {analytics.scenes.longestScene.title}
              </p>
              <p className="text-sm text-zinc-400">
                {analytics.scenes.longestScene.words} words
              </p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Shortest Scene</p>
              <p className="text-lg font-medium text-white mt-1 truncate">
                {analytics.scenes.shortestScene.title}
              </p>
              <p className="text-sm text-zinc-400">
                {analytics.scenes.shortestScene.words} words
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
