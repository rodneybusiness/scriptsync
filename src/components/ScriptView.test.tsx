import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, createMockScene, createMockSequence, createMockProjectData } from '../test/utils';
import ScriptView from './ScriptView';

describe('ScriptView', () => {
  const mockOnUpdateScript = vi.fn();
  const mockOnSelectScene = vi.fn();

  const defaultScene = createMockScene({
    title: 'Test Scene Title',
    summary: 'This is the scene summary',
    scriptContent: `INT. COFFEE SHOP - DAY

ALICE enters, looking nervous.

ALICE
(hesitant)
Hello? Anyone here?`,
  });

  const defaultSequence = createMockSequence({
    id: 'SEQ-1',
    dramaticQuestion: 'Will Alice find what she seeks?',
    scenes: [defaultScene],
  });

  const projectData = createMockProjectData({
    sequences: [defaultSequence],
  });

  const defaultProps = {
    scene: defaultScene,
    allScenes: [defaultScene],
    onUpdateScript: mockOnUpdateScript,
    onSelectScene: mockOnSelectScene,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the scene title', () => {
    render(<ScriptView {...defaultProps} />, { projectData });

    expect(screen.getByText('Test Scene Title')).toBeInTheDocument();
  });

  it('displays the sequence dramatic question', () => {
    render(<ScriptView {...defaultProps} />, { projectData });

    expect(screen.getByText(/Will Alice find what she seeks\?/)).toBeInTheDocument();
  });

  it('renders the script content', () => {
    render(<ScriptView {...defaultProps} />, { projectData });

    expect(screen.getByText(/INT. COFFEE SHOP - DAY/)).toBeInTheDocument();
    // Check for content containing "ALICE" - may appear multiple times
    const aliceElements = screen.getAllByText(/ALICE/);
    expect(aliceElements.length).toBeGreaterThan(0);
  });

  it('shows edit button initially', () => {
    render(<ScriptView {...defaultProps} />, { projectData });

    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
  });

  it('enters edit mode when Edit button is clicked', () => {
    render(<ScriptView {...defaultProps} />, { projectData });

    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);

    // Should show Save button in edit mode
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    // Should show textarea
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onUpdateScript when saving edits', () => {
    render(<ScriptView {...defaultProps} />, { projectData });

    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    // Modify content
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    // Save
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(mockOnUpdateScript).toHaveBeenCalledWith('New content');
  });

  it('shows variant tabs when scene has variants', () => {
    const sceneWithVariants = createMockScene({
      ...defaultScene,
      variants: {
        A: 'Original version',
        B: 'Alternate version',
      },
    });

    render(
      <ScriptView {...defaultProps} scene={sceneWithVariants} />,
      { projectData }
    );

    expect(screen.getByRole('button', { name: /Version A/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Version B/i })).toBeInTheDocument();
  });

  it('switches between variants when tabs are clicked', () => {
    const sceneWithVariants = createMockScene({
      ...defaultScene,
      variants: {
        A: 'Original version content',
        B: 'Alternate version content',
      },
    });

    render(
      <ScriptView {...defaultProps} scene={sceneWithVariants} />,
      { projectData }
    );

    // Click Version B
    fireEvent.click(screen.getByRole('button', { name: /Version B/i }));

    // Content should now show variant B
    expect(screen.getByText(/Alternate version content/)).toBeInTheDocument();
  });

  it('renders connection links in left margin when scene has connections', () => {
    const sceneWithConnections = createMockScene({
      ...defaultScene,
      connections: [
        {
          targetSceneId: 'SC-002',
          type: 'causal',
          description: 'This causes that',
        },
      ],
    });

    const anotherScene = createMockScene({ id: 'SC-002', title: 'Another Scene' });

    render(
      <ScriptView
        {...defaultProps}
        scene={sceneWithConnections}
        allScenes={[sceneWithConnections, anotherScene]}
      />,
      { projectData }
    );

    // Should render connection button
    const connectionButton = screen.getByRole('button', { name: '1' });
    expect(connectionButton).toBeInTheDocument();
  });
});
