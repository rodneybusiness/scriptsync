/**
 * Project Manager Component
 *
 * Handles project-level operations: duplicate, delete, backup, settings.
 */

import React, { useState, useCallback } from 'react';
import {
  getProjectsIndex,
  deleteProject,
  exportProjectJSON,
  importProjectJSON,
  getStorageStats,
  ProjectIndexEntry,
} from '../services/storage';
import { ProjectData } from '../config/types';
import { Spinner } from './LoadingStates';

// =============================================================================
// PROJECT MANAGER MODAL
// =============================================================================

interface ProjectManagerProps {
  currentProject: ProjectData | null;
  onProjectChange: (project: ProjectData | null) => void;
  onClose: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  currentProject,
  onProjectChange,
  onClose,
}) => {
  const [projects, setProjects] = useState<ProjectIndexEntry[]>(getProjectsIndex());
  const [activeTab, setActiveTab] = useState<'projects' | 'import' | 'settings'>('projects');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const stats = getStorageStats();

  // Refresh project list
  const refreshProjects = useCallback(() => {
    setProjects(getProjectsIndex());
  }, []);

  // Handle project deletion
  const handleDelete = useCallback(async (projectId: string) => {
    setIsDeleting(projectId);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    deleteProject(projectId);
    refreshProjects();

    // If deleting current project, notify parent
    if (currentProject?.config.id === projectId) {
      onProjectChange(null);
    }

    setIsDeleting(null);
  }, [currentProject, onProjectChange, refreshProjects]);

  // Handle export
  const handleExport = useCallback(() => {
    if (!currentProject) return;

    setIsExporting(true);
    try {
      exportProjectJSON(currentProject);
    } finally {
      setIsExporting(false);
    }
  }, [currentProject]);

  // Handle import
  const handleImport = useCallback(async (file: File) => {
    setImportError(null);
    setImportSuccess(false);

    try {
      const project = await importProjectJSON(file);
      refreshProjects();
      onProjectChange(project);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed');
    }
  }, [onProjectChange, refreshProjects]);

  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Project Manager</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {(['projects', 'import', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  No projects yet. Import a screenplay to get started.
                </div>
              ) : (
                projects.map(project => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border transition ${
                      currentProject?.config.id === project.id
                        ? 'bg-blue-900/20 border-blue-500/50'
                        : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{project.title}</h3>
                          {currentProject?.config.id === project.id && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-zinc-500 mt-1">
                          {project.sceneCount} scenes • {project.characterCount} characters
                        </div>
                        <div className="text-xs text-zinc-600 mt-1">
                          Updated: {new Date(project.updatedAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDeleting === project.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-zinc-500 hover:text-red-400 transition"
                            title="Delete project"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* Export current project */}
              {currentProject && (
                <div className="p-4 bg-zinc-800/50 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Export Current Project</h3>
                  <p className="text-sm text-zinc-400 mb-3">
                    Download "{currentProject.config.title}" as a JSON backup file.
                  </p>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <Spinner size="sm" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export JSON Backup
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Import project */}
              <div className="p-4 bg-zinc-800/50 rounded-lg">
                <h3 className="font-medium text-white mb-2">Import Project Backup</h3>
                <p className="text-sm text-zinc-400 mb-3">
                  Restore a project from a JSON backup file.
                </p>

                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImport(file);
                    }}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition cursor-pointer inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Choose JSON File
                  </span>
                </label>

                {importError && (
                  <div className="mt-3 p-3 bg-red-900/30 border border-red-800 rounded text-sm text-red-400">
                    {importError}
                  </div>
                )}

                {importSuccess && (
                  <div className="mt-3 p-3 bg-green-900/30 border border-green-800 rounded text-sm text-green-400">
                    Project imported successfully!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Storage stats */}
              <div className="p-4 bg-zinc-800/50 rounded-lg">
                <h3 className="font-medium text-white mb-3">Storage Usage</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Used</span>
                      <span className="text-white">{formatBytes(stats.used)}</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(stats.used / (stats.used + stats.available)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Available</span>
                    <span className="text-zinc-300">{formatBytes(stats.available)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Projects</span>
                    <span className="text-zinc-300">{stats.projects}</span>
                  </div>
                </div>
              </div>

              {/* Clear all data */}
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
                <h3 className="font-medium text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-zinc-400 mb-3">
                  Clear all ScriptSync data from this browser. This cannot be undone.
                </p>
                <ClearDataButton onClear={() => {
                  refreshProjects();
                  onProjectChange(null);
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// CLEAR DATA BUTTON
// =============================================================================

interface ClearDataButtonProps {
  onClear: () => void;
}

const ClearDataButton: React.FC<ClearDataButtonProps> = ({ onClear }) => {
  const [stage, setStage] = useState<'idle' | 'confirm' | 'clearing'>('idle');

  const handleClear = async () => {
    setStage('clearing');

    // Clear all scriptsync data
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('scriptsync_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    await new Promise(resolve => setTimeout(resolve, 500));
    setStage('idle');
    onClear();
  };

  if (stage === 'clearing') {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <Spinner size="sm" />
        Clearing data...
      </div>
    );
  }

  if (stage === 'confirm') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium"
        >
          Yes, delete everything
        </button>
        <button
          onClick={() => setStage('idle')}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setStage('confirm')}
      className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition"
    >
      Clear All Data
    </button>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ProjectManager;
