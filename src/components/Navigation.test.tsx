import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, createMockProjectData, createMockSequence, createMockScene } from '../test/utils';
import Navigation from './Navigation';

describe('Navigation', () => {
  const mockOnSelectScene = vi.fn();

  const defaultProps = {
    currentSceneId: 'SC-001',
    onSelectScene: mockOnSelectScene,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the project title', () => {
    render(<Navigation {...defaultProps} />);

    expect(screen.getByText('ScriptSync')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Navigation {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search scenes, dialogue...');
    expect(searchInput).toBeInTheDocument();
  });

  it('displays scenes from sequences', () => {
    render(<Navigation {...defaultProps} />);

    expect(screen.getByText(/Test Scene/)).toBeInTheDocument();
  });

  it('calls onSelectScene when a scene is clicked', () => {
    const projectData = createMockProjectData();
    render(<Navigation {...defaultProps} />, { projectData });

    const sceneButton = screen.getByRole('button', { name: /Test Scene/i });
    fireEvent.click(sceneButton);

    expect(mockOnSelectScene).toHaveBeenCalledTimes(1);
  });

  it('highlights the current scene', () => {
    render(<Navigation {...defaultProps} />);

    const sceneButton = screen.getByRole('button', { name: /Test Scene/i });
    expect(sceneButton).toHaveClass('bg-zinc-900');
  });

  it('filters scenes by search query', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          scenes: [
            createMockScene({ id: 'SC-001', title: 'First Scene' }),
            createMockScene({ id: 'SC-002', title: 'Second Scene' }),
          ],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    // Both scenes visible initially
    expect(screen.getByText(/First Scene/)).toBeInTheDocument();
    expect(screen.getByText(/Second Scene/)).toBeInTheDocument();

    // Search for "First"
    const searchInput = screen.getByPlaceholderText('Search scenes, dialogue...');
    fireEvent.change(searchInput, { target: { value: 'First' } });

    // Only First Scene visible
    expect(screen.getByText(/First Scene/)).toBeInTheDocument();
    expect(screen.queryByText(/Second Scene/)).not.toBeInTheDocument();
  });

  it('shows no results message when search yields no matches', () => {
    render(<Navigation {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search scenes, dialogue...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText(/No scenes found matching/)).toBeInTheDocument();
  });

});
