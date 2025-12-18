import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, createMockProjectData, createMockRewriteData } from '../test/utils';
import RewriteTracker from './RewriteTracker';

describe('RewriteTracker', () => {
  const rewriteData = createMockRewriteData();
  const projectData = createMockProjectData();

  it('renders the rewrite tracker header', () => {
    render(<RewriteTracker />, { projectData, rewriteData });

    expect(screen.getByText('Rewrite Tracker')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('displays summary statistics', () => {
    render(<RewriteTracker />, { projectData, rewriteData });

    // Should show stat cards
    expect(screen.getByText('Total Goals')).toBeInTheDocument();
  });

  it('shows the goals tab by default', () => {
    render(<RewriteTracker />, { projectData, rewriteData });

    const goalsTab = screen.getByRole('button', { name: /Goals \(/i });
    expect(goalsTab).toHaveClass('bg-emerald-600/20');
  });

  it('switches to questions tab when clicked', () => {
    render(<RewriteTracker />, { projectData, rewriteData });

    const questionsTab = screen.getByRole('button', { name: /Open Questions/i });
    fireEvent.click(questionsTab);

    expect(questionsTab).toHaveClass('bg-blue-600/20');
    expect(screen.getByText('Test question?')).toBeInTheDocument();
  });


  it('displays rewrite goals', () => {
    render(<RewriteTracker />, { projectData, rewriteData });

    expect(screen.getByText('Test goal')).toBeInTheDocument();
  });

  it('filters goals by clicking stat card', () => {
    const dataWithMultipleGoals = {
      ...rewriteData,
      goals: [
        { ...rewriteData.goals[0], id: 'goal-1', status: '🟡 POLISH' as const, goal: 'Polish goal' },
        { ...rewriteData.goals[0], id: 'goal-2', status: '🔴 REBREAK' as const, goal: 'Rebreak goal' },
      ],
      summary: {
        total: 2,
        byStatus: { rebreak: 1, polish: 1, rework: 0 },
        byPriority: { critical: 0, high: 2, medium: 0, low: 0 },
      },
    };

    render(<RewriteTracker />, { projectData, rewriteData: dataWithMultipleGoals });

    // Both visible initially
    expect(screen.getByText('Polish goal')).toBeInTheDocument();
    expect(screen.getByText('Rebreak goal')).toBeInTheDocument();

    // Filter by clicking the Polish stat card
    const polishStatCard = screen.getByText('Polish').closest('button');
    fireEvent.click(polishStatCard!);

    // Only Polish goal visible
    expect(screen.getByText('Polish goal')).toBeInTheDocument();
    expect(screen.queryByText('Rebreak goal')).not.toBeInTheDocument();
  });

  it('shows empty state when no rewrite data', () => {
    render(<RewriteTracker />, { projectData, rewriteData: undefined });

    expect(screen.getByText('No Rewrite Data')).toBeInTheDocument();
  });


  it('displays open questions organized by priority', () => {
    render(<RewriteTracker />, { projectData, rewriteData });

    // Navigate to questions tab
    const questionsTab = screen.getByRole('button', { name: /Open Questions/i });
    fireEvent.click(questionsTab);

    expect(screen.getByText(/High Priority/i)).toBeInTheDocument();
    expect(screen.getByText('Test question?')).toBeInTheDocument();
  });

  it('expands goal details when clicked', () => {
    render(<RewriteTracker />, { projectData, rewriteData });

    const goalCard = screen.getByText('Test goal').closest('div');
    expect(goalCard).toBeInTheDocument();

    // Click to expand
    fireEvent.click(goalCard!);

    // Should show implementation notes
    expect(screen.getByText(/Test notes/)).toBeInTheDocument();
  });
});
