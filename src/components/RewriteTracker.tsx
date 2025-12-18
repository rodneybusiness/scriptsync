/**
 * RewriteTracker - Rewrite goals and notes tracking dashboard
 *
 * A comprehensive dashboard for tracking rewrite goals, feedback notes,
 * and open questions during the screenplay development process.
 */

import React, { useState, useMemo } from 'react';
import { useProject } from '../config/ProjectContext';
import {
  RewriteGoal,
  RewriteStatus,
  RewritePriority,
} from '../config/types';

// =============================================================================
// TYPES
// =============================================================================

type FilterStatus = 'all' | RewriteStatus;
type FilterPriority = 'all' | RewritePriority;
type ViewTab = 'goals' | 'questions';

// =============================================================================
// STATUS & PRIORITY HELPERS
// =============================================================================

const STATUS_LABELS: Record<RewriteStatus, { label: string; color: string; bg: string }> = {
  '🔴 REBREAK': { label: 'Rebreak', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
  '🟡 POLISH': { label: 'Polish', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' },
  '🟠 REWORK': { label: 'Rework', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30' },
};

const PRIORITY_LABELS: Record<RewritePriority, { label: string; color: string; bg: string }> = {
  'CRITICAL': { label: 'Critical', color: 'text-red-500', bg: 'bg-red-600/20 border-red-600/40' },
  'HIGH': { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30' },
  'MEDIUM': { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
  'LOW': { label: 'Low', color: 'text-zinc-400', bg: 'bg-zinc-700/30 border-zinc-600/30' },
};

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'text-white', onClick, isActive }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`p-4 rounded-xl border transition-all ${
      isActive
        ? 'bg-zinc-800 border-zinc-600 ring-2 ring-blue-500/50'
        : onClick
          ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 cursor-pointer'
          : 'bg-zinc-900/50 border-zinc-800 cursor-default'
    }`}
  >
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-zinc-500 uppercase tracking-wide mt-1">{label}</div>
  </button>
);

// =============================================================================
// GOAL CARD COMPONENT
// =============================================================================

interface GoalCardProps {
  goal: RewriteGoal;
  isExpanded: boolean;
  onToggle: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, isExpanded, onToggle }) => {
  const status = STATUS_LABELS[goal.status];
  const priority = PRIORITY_LABELS[goal.priority];

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all ${
        isExpanded ? 'bg-zinc-900/80 border-zinc-600' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-start gap-4"
      >
        {/* Status Emoji */}
        <div className="text-2xl flex-shrink-0 mt-0.5">
          {goal.status.split(' ')[0]}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Priority Badge */}
            <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${priority.bg} ${priority.color}`}>
              {priority.label}
            </span>

            {/* Pass Type */}
            {goal.passType && (
              <span className="px-2 py-0.5 text-xs text-zinc-400 bg-zinc-800 rounded">
                {goal.passType}
              </span>
            )}

            {/* Acts Affected */}
            <span className="text-xs text-zinc-500">
              Acts: {goal.actsAffected.join(', ')}
            </span>
          </div>

          <h3 className="font-medium text-zinc-100 leading-snug">{goal.goal}</h3>

          {/* Source Tags */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {goal.sources.map((source, i) => (
              <span key={i} className="px-1.5 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded">
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Expand Icon */}
        <div className={`text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-4 ml-12 space-y-4">
          {/* Concrete Next Move */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-1">
              Next Move
            </h4>
            <p className="text-sm text-zinc-300">{goal.concreteNextMove}</p>
          </div>

          {/* Current Draft Handling */}
          {Object.keys(goal.currentDraftHandling).length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">
                Current Draft
              </h4>
              <div className="space-y-1">
                {Object.entries(goal.currentDraftHandling).map(([act, handling]) => (
                  <div key={act} className="text-sm">
                    <span className="text-zinc-500">{act}:</span>{' '}
                    <span className="text-zinc-300">{handling}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Implementation Notes */}
          {goal.implementationNotes && (
            <div>
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-1">
                Implementation Notes
              </h4>
              <p className="text-sm text-zinc-400 whitespace-pre-wrap">{goal.implementationNotes}</p>
            </div>
          )}

          {/* What's Still Off */}
          {goal.whatsStillOff && (
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">
                What's Still Off
              </h4>
              <p className="text-sm text-zinc-400">{goal.whatsStillOff}</p>
            </div>
          )}

          {/* Sub-items */}
          {goal.subItems && goal.subItems.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">
                Related Goals
              </h4>
              <div className="flex flex-wrap gap-1">
                {goal.subItems.map((item, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// QUESTIONS PANEL
// =============================================================================

interface QuestionsPanelProps {
  questions: {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
  };
}

const QuestionsPanel: React.FC<QuestionsPanelProps> = ({ questions }) => {
  const sections = [
    { key: 'critical', label: 'Critical', items: questions.critical, color: 'text-red-400', border: 'border-l-red-500' },
    { key: 'high', label: 'High Priority', items: questions.high, color: 'text-orange-400', border: 'border-l-orange-500' },
    { key: 'medium', label: 'Medium Priority', items: questions.medium, color: 'text-blue-400', border: 'border-l-blue-500' },
    { key: 'low', label: 'Low Priority', items: questions.low, color: 'text-zinc-400', border: 'border-l-zinc-500' },
  ];

  return (
    <div className="space-y-6">
      {sections.map(section => section.items.length > 0 && (
        <div key={section.key}>
          <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${section.color}`}>
            {section.label} ({section.items.length})
          </h3>
          <div className="space-y-2">
            {section.items.map((question, i) => (
              <div
                key={i}
                className={`p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg border-l-4 ${section.border}`}
              >
                <p className="text-sm text-zinc-300">{question}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const RewriteTracker: React.FC = () => {
  const { config, rewriteData, hasRewriteData } = useProject();

  const [activeTab, setActiveTab] = useState<ViewTab>('goals');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  // Filter goals
  const filteredGoals = useMemo(() => {
    if (!rewriteData) return [];

    return rewriteData.goals.filter(goal => {
      if (filterStatus !== 'all' && goal.status !== filterStatus) return false;
      if (filterPriority !== 'all' && goal.priority !== filterPriority) return false;
      return true;
    });
  }, [rewriteData, filterStatus, filterPriority]);

  // No rewrite data available
  if (!hasRewriteData || !rewriteData) {
    return (
      <div className="flex-1 bg-zinc-950 overflow-y-auto p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">No Rewrite Data</h2>
          <p className="text-zinc-400">
            This project doesn't have rewrite tracking data yet.
            Add rewrite goals, feedback notes, and open questions to your project's config to see them here.
          </p>
        </div>
      </div>
    );
  }

  const { summary, openQuestions } = rewriteData;

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-8 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Rewrite Tracker</h1>
          <p className="text-zinc-400 max-w-xl">
            Development progress for <span className="text-blue-400 font-bold">{config.title}</span> —
            tracking rewrite goals and open questions.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <StatCard
            label="Total Goals"
            value={summary.total}
            color="text-white"
            onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }}
            isActive={filterStatus === 'all' && filterPriority === 'all'}
          />

          {/* By Status */}
          <StatCard
            label="Rebreak"
            value={summary.byStatus.rebreak}
            color="text-red-400"
            onClick={() => { setFilterStatus('🔴 REBREAK'); setFilterPriority('all'); }}
            isActive={filterStatus === '🔴 REBREAK'}
          />
          <StatCard
            label="Rework"
            value={summary.byStatus.rework}
            color="text-orange-400"
            onClick={() => { setFilterStatus('🟠 REWORK'); setFilterPriority('all'); }}
            isActive={filterStatus === '🟠 REWORK'}
          />
          <StatCard
            label="Polish"
            value={summary.byStatus.polish}
            color="text-yellow-400"
            onClick={() => { setFilterStatus('🟡 POLISH'); setFilterPriority('all'); }}
            isActive={filterStatus === '🟡 POLISH'}
          />

          {/* By Priority */}
          <StatCard
            label="Critical"
            value={summary.byPriority.critical}
            color="text-red-500"
            onClick={() => { setFilterPriority('CRITICAL'); setFilterStatus('all'); }}
            isActive={filterPriority === 'CRITICAL'}
          />
          <StatCard
            label="High"
            value={summary.byPriority.high}
            color="text-orange-400"
            onClick={() => { setFilterPriority('HIGH'); setFilterStatus('all'); }}
            isActive={filterPriority === 'HIGH'}
          />
          <StatCard
            label="Medium"
            value={summary.byPriority.medium}
            color="text-blue-400"
            onClick={() => { setFilterPriority('MEDIUM'); setFilterStatus('all'); }}
            isActive={filterPriority === 'MEDIUM'}
          />
          <StatCard
            label="Low"
            value={summary.byPriority.low}
            color="text-zinc-400"
            onClick={() => { setFilterPriority('LOW'); setFilterStatus('all'); }}
            isActive={filterPriority === 'LOW'}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-4">
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-lg transition ${
              activeTab === 'goals'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            Goals ({filteredGoals.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-lg transition ${
              activeTab === 'questions'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            Open Questions ({
              openQuestions.critical.length +
              openQuestions.high.length +
              openQuestions.medium.length +
              openQuestions.low.length
            })
          </button>
        </div>

        {/* Active Filter Indicator */}
        {(filterStatus !== 'all' || filterPriority !== 'all') && activeTab === 'goals' && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-zinc-500">Filtering:</span>
            {filterStatus !== 'all' && (
              <span className={`px-2 py-1 text-xs rounded border ${STATUS_LABELS[filterStatus].bg} ${STATUS_LABELS[filterStatus].color}`}>
                {filterStatus}
              </span>
            )}
            {filterPriority !== 'all' && (
              <span className={`px-2 py-1 text-xs rounded border ${PRIORITY_LABELS[filterPriority].bg} ${PRIORITY_LABELS[filterPriority].color}`}>
                {filterPriority}
              </span>
            )}
            <button
              onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Content Panels */}
        {activeTab === 'goals' && (
          <div className="space-y-3">
            {filteredGoals.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                No goals match the current filters
              </div>
            ) : (
              filteredGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  isExpanded={expandedGoalId === goal.id}
                  onToggle={() => setExpandedGoalId(
                    expandedGoalId === goal.id ? null : goal.id
                  )}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <QuestionsPanel questions={openQuestions} />
        )}
      </div>
    </div>
  );
};

export default RewriteTracker;
