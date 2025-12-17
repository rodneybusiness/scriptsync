/**
 * ScriptSync - Entry Point
 *
 * Loads the active project and bootstraps the application.
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProjectProvider, loadProject } from './config/ProjectContext';
import { ProjectData } from './config/types';

// Get active project from env or default to bell-bottoms
const ACTIVE_PROJECT = import.meta.env.VITE_ACTIVE_PROJECT || 'bell-bottoms';

const Root: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject(ACTIVE_PROJECT)
      .then(data => setProjectData(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="bg-zinc-950 h-screen w-screen text-zinc-200 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">:(</div>
          <div className="text-xl font-bold text-red-400 mb-2">Project Load Error</div>
          <div className="text-zinc-400 mb-4">{error}</div>
          <div className="text-sm text-zinc-600">
            Make sure the project exists in <code className="bg-zinc-800 px-2 py-1 rounded">src/projects/{ACTIVE_PROJECT}/</code>
          </div>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="bg-zinc-950 h-screen w-screen text-zinc-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-zinc-300 mb-2">ScriptSync</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
            Loading project...
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProjectProvider projectData={projectData}>
      <App />
    </ProjectProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
