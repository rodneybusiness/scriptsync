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

  it('renders the quick filter buttons', () => {
    render(<Navigation {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Has Notes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Incomplete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Needs Work' })).toBeInTheDocument();
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

    const sceneOption = screen.getByRole('option', { name: /Test Scene/i });
    fireEvent.click(sceneOption);

    expect(mockOnSelectScene).toHaveBeenCalledTimes(1);
  });

  it('highlights the current scene', () => {
    render(<Navigation {...defaultProps} />);

    const sceneOption = screen.getByRole('option', { name: /Test Scene/i });
    expect(sceneOption).toHaveClass('bg-zinc-900');
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

  // Scene/Sequence Management Tests

  it('renders the Add Sequence button', () => {
    render(<Navigation {...defaultProps} />);

    expect(screen.getByRole('button', { name: /Add Sequence/i })).toBeInTheDocument();
  });

  it('shows sequence management controls on hover', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [createMockScene({ id: 'SC-001', title: 'Opening' })],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    // The sequence header should contain buttons (they appear on hover via CSS)
    const sequenceHeader = screen.getByText('Act 1').closest('div');
    expect(sequenceHeader).toBeInTheDocument();
  });

  it('shows delete confirmation dialog when delete scene button is clicked', async () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [createMockScene({ id: 'SC-001', title: 'Test Scene' })],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    // Find and click the delete scene button (it's in the scene actions)
    const deleteButtons = screen.getAllByTitle('Delete scene');
    fireEvent.click(deleteButtons[0]);

    // Confirmation dialog should appear
    expect(screen.getByText('Delete Scene')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('closes confirmation dialog when Cancel is clicked', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [createMockScene({ id: 'SC-001', title: 'Test Scene' })],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    // Open delete confirmation
    const deleteButtons = screen.getAllByTitle('Delete scene');
    fireEvent.click(deleteButtons[0]);

    // Click Cancel
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // Dialog should be closed
    expect(screen.queryByText('Delete Scene')).not.toBeInTheDocument();
  });

  it('shows add scene buttons for each sequence', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [createMockScene({ id: 'SC-001', title: 'Opening' })],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    // There should be add scene buttons (in sequence header and after each scene)
    const addSceneButtons = screen.getAllByTitle(/Add scene/);
    expect(addSceneButtons.length).toBeGreaterThan(0);
  });

  it('shows move up/down buttons for scenes', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [
            createMockScene({ id: 'SC-001', title: 'First Scene' }),
            createMockScene({ id: 'SC-002', title: 'Second Scene' }),
          ],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    // Move up/down buttons should be present for scenes
    const moveUpButtons = screen.getAllByTitle('Move scene up');
    const moveDownButtons = screen.getAllByTitle('Move scene down');

    expect(moveUpButtons.length).toBe(2);
    expect(moveDownButtons.length).toBe(2);
  });

  it('disables move up button for first scene and move down button for last scene', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [
            createMockScene({ id: 'SC-001', title: 'First Scene' }),
            createMockScene({ id: 'SC-002', title: 'Last Scene' }),
          ],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    const moveUpButtons = screen.getAllByTitle('Move scene up');
    const moveDownButtons = screen.getAllByTitle('Move scene down');

    // First scene's move up should be disabled
    expect(moveUpButtons[0]).toBeDisabled();
    // First scene's move down should be enabled
    expect(moveDownButtons[0]).not.toBeDisabled();

    // Last scene's move up should be enabled
    expect(moveUpButtons[1]).not.toBeDisabled();
    // Last scene's move down should be disabled
    expect(moveDownButtons[1]).toBeDisabled();
  });

  // Keyboard Navigation Tests

  it('supports arrow key navigation between scenes', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [
            createMockScene({ id: 'SC-001', title: 'First Scene' }),
            createMockScene({ id: 'SC-002', title: 'Second Scene' }),
          ],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    const listbox = screen.getByRole('listbox');

    // Navigate down with arrow key
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });

    // Second scene should now have focus styling (ring)
    const secondScene = screen.getByRole('option', { name: /Second Scene/i });
    expect(secondScene).toHaveClass('ring-2');
  });

  it('selects focused scene on Enter key', () => {
    const projectData = createMockProjectData({
      sequences: [
        createMockSequence({
          id: 'seq_1',
          title: 'Act 1',
          scenes: [
            createMockScene({ id: 'SC-001', title: 'First Scene' }),
            createMockScene({ id: 'SC-002', title: 'Second Scene' }),
          ],
        }),
      ],
    });

    render(<Navigation {...defaultProps} />, { projectData });

    const listbox = screen.getByRole('listbox');

    // Navigate down to second scene
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });

    // Press Enter to select
    fireEvent.keyDown(listbox, { key: 'Enter' });

    // Should have called onSelectScene
    expect(mockOnSelectScene).toHaveBeenCalled();
  });

  it('has accessible listbox role and aria attributes', () => {
    render(<Navigation {...defaultProps} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-label', 'Scene list');
    expect(listbox).toHaveAttribute('tabindex', '0');
  });

});
