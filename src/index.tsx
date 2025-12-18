/**
 * ScriptSync - Entry Point
 *
 * Supports multiple modes:
 * 1. Load existing project from localStorage
 * 2. Load sample project (bell-bottoms)
 * 3. Import new project via wizard
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProjectProvider, loadProject as loadBundledProject } from './config/ProjectContext';
import { ProjectData } from './config/types';
import {
  getProjectsIndex,
  loadProject as loadStoredProject,
  saveProject,
  getActiveProject,
  setActiveProject,
  ProjectIndexEntry,
} from './services/storage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FullPageLoading } from './components/LoadingStates';

// Lazy load the import wizard (heavy component with AI processing)
const ImportWizard = lazy(() => import('./components/ImportWizard'));

// =============================================================================
// APP MODES
// =============================================================================

type AppMode = 'loading' | 'selector' | 'import' | 'project';

// =============================================================================
// PROJECT SELECTOR
// =============================================================================

interface ProjectSelectorProps {
  projects: ProjectIndexEntry[];
  onSelectProject: (id: string) => void;
  onImportNew: () => void;
  onLoadSample: (projectId: string) => void;
  onQuickStart: (title: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  onSelectProject,
  onImportNew,
  onLoadSample,
  onQuickStart,
}) => {
  const [showQuickStart, setShowQuickStart] = React.useState(false);
  const [quickStartTitle, setQuickStartTitle] = React.useState('');

  const handleQuickStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = quickStartTitle.trim() || 'Untitled Project';
    onQuickStart(title);
  };

  return (
  <div className="bg-zinc-950 min-h-screen text-zinc-200 flex items-center justify-center p-8">
    <div className="max-w-2xl w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">ScriptSync</h1>
        <p className="text-zinc-400 text-lg">
          Context-aware screenwriting environment with AI-powered analysis
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Quick Start - inline form */}
        {!showQuickStart ? (
          <button
            onClick={() => setShowQuickStart(true)}
            className="p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl text-left hover:border-emerald-500/60 transition group"
          >
            <div className="text-3xl mb-3">✨</div>
            <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
              Quick Start
            </div>
            <div className="text-sm text-zinc-400">
              Create a blank project
            </div>
          </button>
        ) : (
          <form
            onSubmit={handleQuickStartSubmit}
            className="p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/60 rounded-xl"
          >
            <input
              type="text"
              value={quickStartTitle}
              onChange={(e) => setQuickStartTitle(e.target.value)}
              placeholder="Project title..."
              autoFocus
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 mb-3"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickStart(false); setQuickStartTitle(''); }}
                className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <button
          onClick={onImportNew}
          className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl text-left hover:border-blue-500/60 transition group"
        >
          <div className="text-3xl mb-3">📥</div>
          <div className="text-lg font-bold text-white group-hover:text-blue-400 transition">
            Import
          </div>
          <div className="text-sm text-zinc-400">
            PDF, Fountain, or notes
          </div>
        </button>

        <button
          onClick={() => onLoadSample('bell-bottoms')}
          className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-left hover:border-zinc-600 transition group"
        >
          <div className="text-3xl mb-3">🎬</div>
          <div className="text-lg font-bold text-white group-hover:text-zinc-300 transition">
            Demo
          </div>
          <div className="text-sm text-zinc-400">
            Try with sample project
          </div>
        </button>
      </div>

      {/* Sample Projects */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-zinc-500 uppercase mb-4">Sample Projects</h2>
        <button
          onClick={() => onLoadSample('8-billion-genies')}
          className="w-full p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg text-left hover:border-purple-500/60 transition group flex items-center gap-4"
        >
          <div className="text-3xl">🧞</div>
          <div className="flex-1">
            <div className="font-medium text-zinc-200 group-hover:text-white">
              8 Billion Genies
            </div>
            <div className="text-sm text-zinc-400">
              Fantasy ensemble comedy - When everyone gets a wish
            </div>
          </div>
        </button>
      </div>

      {/* Existing Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-zinc-500 uppercase mb-4">Your Projects</h2>
          <div className="space-y-2">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg text-left hover:border-zinc-600 hover:bg-zinc-800/50 transition group flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-zinc-200 group-hover:text-white">
                    {project.title}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {project.sceneCount} scenes • {project.characterCount} characters
                  </div>
                </div>
                <div className="text-xs text-zinc-600">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 text-xs text-zinc-600">
        Data stored locally in your browser
      </div>
    </div>
  </div>
  );
};

// =============================================================================
// LOADING SCREEN
// =============================================================================

const LoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
  <div className="bg-zinc-950 h-screen w-screen text-zinc-500 flex items-center justify-center">
    <div className="text-center">
      <div className="text-2xl font-bold text-zinc-300 mb-2">ScriptSync</div>
      <div className="flex items-center gap-2 justify-center">
        <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
        {message || 'Loading...'}
      </div>
    </div>
  </div>
);

// =============================================================================
// ROOT COMPONENT
// =============================================================================

const Root: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('loading');
  const [projects, setProjects] = useState<ProjectIndexEntry[]>([]);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const init = async () => {
      // Check for existing projects
      const storedProjects = getProjectsIndex();
      setProjects(storedProjects);

      // Check for active project
      const activeId = getActiveProject();
      if (activeId) {
        const data = loadStoredProject(activeId);
        if (data) {
          // Try to merge bundled rewriteData if the stored project doesn't have it
          if (!data.rewriteData) {
            try {
              const bundled = await loadBundledProject(activeId);
              if (bundled.rewriteData) {
                data.rewriteData = bundled.rewriteData;
              }
            } catch {
              // Bundled project not found, continue without rewriteData
            }
          }
          setProjectData(data);
          setMode('project');
          return;
        }
      }

      // Check for env-specified project (for development)
      const envProject = import.meta.env.VITE_ACTIVE_PROJECT;
      if (envProject && storedProjects.length === 0) {
        try {
          const bundledData = await loadBundledProject(envProject);
          setProjectData(bundledData);
          saveProject(bundledData);
          setActiveProject(bundledData.config.id);
          setMode('project');
          return;
        } catch {
          // Bundled project not found, show selector
        }
      }

      // Show selector
      setMode('selector');
    };

    init();
  }, []);

  // Handle project selection
  const handleSelectProject = async (id: string) => {
    const data = loadStoredProject(id);
    if (data) {
      // Try to merge bundled rewriteData if the stored project doesn't have it
      if (!data.rewriteData) {
        try {
          const bundled = await loadBundledProject(id);
          if (bundled.rewriteData) {
            data.rewriteData = bundled.rewriteData;
          }
        } catch {
          // Bundled project not found, continue without rewriteData
        }
      }
      setProjectData(data);
      setActiveProject(id);
      setMode('project');
    } else {
      setError(`Failed to load project: ${id}`);
    }
  };

  // Handle sample project load
  const handleLoadSample = async (projectId: string) => {
    setMode('loading');
    try {
      const data = await loadBundledProject(projectId);
      saveProject(data);
      setActiveProject(data.config.id);
      setProjectData(data);
      setProjects(getProjectsIndex());
      setMode('project');
    } catch (err) {
      setError(`Failed to load project: ${projectId}`);
      setMode('selector');
    }
  };

  // Handle import complete
  const handleImportComplete = (data: ProjectData) => {
    saveProject(data);
    setActiveProject(data.config.id);
    setProjectData(data);
    setProjects(getProjectsIndex());
    setMode('project');
  };

  // Handle return to selector
  const handleBackToSelector = () => {
    setProjectData(null);
    setProjects(getProjectsIndex());
    setMode('selector');
  };

  // Handle quick start (create blank project with just a title)
  const handleQuickStart = (title: string) => {
    const id = `project-${Date.now()}`;
    const blankProject: ProjectData = {
      config: {
        id,
        title,
        logline: '',
        description: '',
        genres: [],
        characters: [],
        theme: { core: '', counterArgument: '' },
        ai: {
          styleReferences: [],
          toneDescriptor: '',
          uniqueConstraints: [],
        },
        trackingCategories: [],
      },
      sequences: [
        {
          id: 'seq_1',
          title: 'Act One',
          dramaticQuestion: '',
          climax: '',
          resolution: '',
          scenes: [
            {
              id: 'scene_001',
              sequenceId: 'seq_1',
              title: 'Opening Scene',
              pageNumber: 1,
              timeOfDay: 'DAY',
              location: 'LOCATION',
              summary: 'Opening scene',
              scriptContent: 'INT. LOCATION - DAY\n\n',
              beats: [],
              notes: [],
              tracking: [],
              status: 'draft',
            },
          ],
        },
      ],
    };
    saveProject(blankProject);
    setActiveProject(id);
    setProjectData(blankProject);
    setProjects(getProjectsIndex());
    setMode('project');
  };

  // Error display
  if (error) {
    return (
      <div className="bg-zinc-950 h-screen w-screen text-zinc-200 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">:(</div>
          <div className="text-xl font-bold text-red-400 mb-2">Error</div>
          <div className="text-zinc-400 mb-4">{error}</div>
          <button
            onClick={() => { setError(null); setMode('selector'); }}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Render based on mode
  switch (mode) {
    case 'loading':
      return <LoadingScreen />;

    case 'selector':
      return (
        <ProjectSelector
          projects={projects}
          onSelectProject={handleSelectProject}
          onImportNew={() => setMode('import')}
          onLoadSample={handleLoadSample}
          onQuickStart={handleQuickStart}
        />
      );

    case 'import':
      return (
        <Suspense fallback={<FullPageLoading message="Loading Import Wizard..." />}>
          <ImportWizard
            onComplete={handleImportComplete}
            onCancel={() => setMode('selector')}
          />
        </Suspense>
      );

    case 'project':
      if (!projectData) return <LoadingScreen message="Loading project..." />;
      return (
        <ProjectProvider projectData={projectData} rewriteData={projectData.rewriteData}>
          <App onBackToProjects={handleBackToSelector} />
        </ProjectProvider>
      );

    default:
      return <LoadingScreen />;
  }
};

// =============================================================================
// MOUNT
// =============================================================================

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary level="app">
      <Root />
    </ErrorBoundary>
  </React.StrictMode>
);
