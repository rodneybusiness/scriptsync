/**
 * ImportWizard - Beautiful multi-step import interface
 *
 * Handles document upload, AI processing, QC review, and project creation.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  runIngestionPipeline,
  createUploadedDocument,
  UploadedDocument,
  ProcessingProgress,
  QCReport,
  QCIssue,
  DEFAULT_AI_CONFIG,
  AIProcessingConfig,
  PipelineCallbacks,
} from '../services/ingestion';
import { ProjectData } from '../config/types';

// =============================================================================
// TYPES
// =============================================================================

type WizardStep = 'upload' | 'configure' | 'processing' | 'review' | 'complete';
type UploadTab = 'files' | 'json';

interface ImportWizardProps {
  onComplete: (projectData: ProjectData) => void;
  onCancel: () => void;
}

// =============================================================================
// FILE TYPE CONFIG
// =============================================================================

const FILE_TYPES = [
  { ext: '.fountain', label: 'Fountain', icon: '📜', desc: 'Fountain screenplay format' },
  { ext: '.fdx', label: 'Final Draft', icon: '🎬', desc: 'Final Draft XML' },
  { ext: '.txt', label: 'Plain Text', icon: '📄', desc: 'Text files with screenplay content' },
  { ext: '.pdf', label: 'PDF', icon: '📕', desc: 'PDF scripts (requires review)' },
  { ext: '.csv', label: 'CSV', icon: '📊', desc: 'Beat sheets, rewrite plans' },
  { ext: '.md', label: 'Markdown', icon: '📝', desc: 'Notes, outlines, arc tracking' },
  { ext: '.json', label: 'JSON', icon: '🔧', desc: 'Structured data exports' },
  { ext: '.scap', label: 'Scapple', icon: '🕸️', desc: 'Scapple mind maps' },
];

const ACCEPT_TYPES = FILE_TYPES.map(f => f.ext).join(',');

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ImportWizard: React.FC<ImportWizardProps> = ({ onComplete, onCancel }) => {
  // State
  const [step, setStep] = useState<WizardStep>('upload');
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [projectName, setProjectName] = useState('');
  const [aiConfig, setAiConfig] = useState<AIProcessingConfig>(DEFAULT_AI_CONFIG);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [qcReport, setQcReport] = useState<QCReport | null>(null);
  const [result, setResult] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadTab, setUploadTab] = useState<UploadTab>('files');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===================
  // FILE HANDLING
  // ===================

  const handleFiles = useCallback(async (files: FileList) => {
    const newDocs: UploadedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const doc = await createUploadedDocument(files[i]);
        newDocs.push(doc);
      } catch (err) {
        console.error('Failed to process file:', files[i].name, err);
      }
    }

    setDocuments(prev => [...prev, ...newDocs]);

    // Auto-suggest project name from first script file
    if (!projectName && newDocs.length > 0) {
      const scriptDoc = newDocs.find(d => ['fountain', 'fdx', 'txt'].includes(d.type));
      if (scriptDoc) {
        const name = scriptDoc.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        setProjectName(name);
      }
    }
  }, [projectName]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // ===================
  // JSON IMPORT
  // ===================

  const validateJsonProject = (data: unknown): data is ProjectData => {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;

    // Check required top-level structure
    if (!obj.config || typeof obj.config !== 'object') return false;
    if (!obj.sequences || !Array.isArray(obj.sequences)) return false;

    // Check config has required fields
    const config = obj.config as Record<string, unknown>;
    if (!config.id || typeof config.id !== 'string') return false;
    if (!config.title || typeof config.title !== 'string') return false;

    return true;
  };

  const handleJsonImport = () => {
    setJsonError(null);

    if (!jsonInput.trim()) {
      setJsonError('Please paste a ScriptSync project JSON');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      if (!validateJsonProject(parsed)) {
        setJsonError('Invalid project format. Expected ScriptSync project structure with config and sequences.');
        return;
      }

      // Generate new ID to avoid collisions
      const importedProject: ProjectData = {
        ...parsed,
        config: {
          ...parsed.config,
          id: `imported-${Date.now()}`,
          title: parsed.config.title + ' (imported)',
        },
      };

      // Skip AI processing - go directly to complete
      setResult(importedProject);
      setStep('complete');
    } catch {
      setJsonError('Invalid JSON. Please check the format and try again.');
    }
  };

  // ===================
  // PROCESSING
  // ===================

  const startProcessing = async () => {
    if (documents.length === 0 || !projectName.trim()) return;

    setStep('processing');
    setError(null);

    const callbacks: PipelineCallbacks = {
      onProgress: (p) => setProgress(p),
      onStageComplete: (stage, data) => {
        console.log(`Stage ${stage} complete:`, data);
      },
      onError: (err) => {
        setError(err);
        setStep('upload');
      },
      onComplete: (data) => {
        setResult(data);
        setStep('complete');
      },
      onQCRequired: (report) => {
        setQcReport(report);
        setStep('review');
      },
    };

    await runIngestionPipeline(projectName, documents, aiConfig, callbacks);
  };

  const approveQC = () => {
    if (result) {
      setStep('complete');
    }
  };

  const finalize = () => {
    if (result) {
      onComplete(result);
    }
  };

  // ===================
  // RENDER HELPERS
  // ===================

  const getStepIndicator = () => {
    const steps: { key: WizardStep; label: string; icon: string }[] = [
      { key: 'upload', label: 'Upload', icon: '1' },
      { key: 'configure', label: 'Configure', icon: '2' },
      { key: 'processing', label: 'Process', icon: '3' },
      { key: 'review', label: 'Review', icon: '4' },
      { key: 'complete', label: 'Done', icon: '✓' },
    ];

    const currentIdx = steps.findIndex(s => s.key === step);

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, idx) => (
          <React.Fragment key={s.key}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                idx < currentIdx
                  ? 'bg-green-600 text-white'
                  : idx === currentIdx
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600/30'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {idx < currentIdx ? '✓' : s.icon}
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-12 h-1 rounded ${idx < currentIdx ? 'bg-green-600' : 'bg-zinc-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // ===================
  // STEP RENDERS
  // ===================

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Import Your Screenplay</h2>
        <p className="text-zinc-400">
          Upload your script, notes, beat sheets, and other documents.
          AI will intelligently process everything.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700">
        <button
          onClick={() => setUploadTab('files')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
            uploadTab === 'files'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Upload Files
        </button>
        <button
          onClick={() => setUploadTab('json')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
            uploadTab === 'json'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Paste JSON Export
        </button>
      </div>

      {uploadTab === 'files' ? (
        <>
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPT_TYPES}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />

            <div className="text-5xl mb-4">{isDragging ? '📥' : '📁'}</div>
            <p className="text-lg font-medium text-zinc-200 mb-2">
              {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
            </p>
            <p className="text-sm text-zinc-500">
              Supports: Fountain, Final Draft, PDF, CSV, Markdown, Scapple, and more
            </p>
          </div>

          {/* Supported Formats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {FILE_TYPES.filter(ft => ft.ext !== '.json').map(ft => (
              <div key={ft.ext} className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center">
                <div className="text-2xl mb-1">{ft.icon}</div>
                <div className="text-xs font-medium text-zinc-300">{ft.label}</div>
                <div className="text-[10px] text-zinc-600">{ft.ext}</div>
              </div>
            ))}
          </div>

          {/* Uploaded Files */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-400 uppercase">Uploaded Documents</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {FILE_TYPES.find(f => f.ext === `.${doc.type}`)?.icon || '📄'}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{doc.name}</div>
                        <div className="text-xs text-zinc-500">
                          {doc.type.toUpperCase()} • {(doc.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 hover:bg-zinc-700 rounded-lg transition"
                    >
                      <span className="text-zinc-500 hover:text-red-400">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-between pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep('configure')}
              disabled={documents.length === 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold rounded-lg transition"
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          {/* JSON Import */}
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💾</span>
                <div>
                  <div className="text-sm font-medium text-zinc-200">Import a ScriptSync Project</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Paste a previously exported project JSON to restore it. This bypasses AI processing
                    and imports the project exactly as exported.
                  </div>
                </div>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => { setJsonInput(e.target.value); setJsonError(null); }}
              placeholder='{"config": {"id": "...", "title": "...", ...}, "sequences": [...]}'
              className="w-full h-64 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none font-mono text-sm resize-none"
            />

            {jsonError && (
              <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                {jsonError}
              </div>
            )}

            <div className="text-xs text-zinc-500">
              To export a project, open it in ScriptSync and use the Export menu.
            </div>
          </div>

          {/* Import Button */}
          <div className="flex justify-between pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleJsonImport}
              disabled={!jsonInput.trim()}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold rounded-lg transition"
            >
              Import Project
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderConfigureStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Configure Import</h2>
        <p className="text-zinc-400">Set your project name and AI processing options.</p>
      </div>

      {/* Project Name */}
      <div>
        <label className="block text-sm font-bold text-zinc-300 mb-2">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g., Bell Bottoms"
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* AI Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase">AI Processing Options</h3>

        {[
          { key: 'aiSceneDetection', label: 'AI Scene Detection', desc: 'Use AI to refine scene boundaries' },
          { key: 'aiCharacterClassification', label: 'Character Classification', desc: 'Automatically classify character roles' },
          { key: 'aiBeatGeneration', label: 'Beat Generation', desc: 'Generate story beats from content' },
          { key: 'aiConnectionMapping', label: 'Connection Mapping', desc: 'Find thematic connections between scenes' },
        ].map(opt => (
          <div key={opt.key} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div>
              <div className="text-sm font-medium text-zinc-200">{opt.label}</div>
              <div className="text-xs text-zinc-500">{opt.desc}</div>
            </div>
            <button
              onClick={() => setAiConfig(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof AIProcessingConfig] }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                aiConfig[opt.key as keyof AIProcessingConfig] ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  aiConfig[opt.key as keyof AIProcessingConfig] ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        ))}

        {/* Confidence Threshold */}
        <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-zinc-200">Auto-Accept Threshold</div>
            <div className="text-sm font-mono text-blue-400">{aiConfig.autoAcceptThreshold}%</div>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            value={aiConfig.autoAcceptThreshold}
            onChange={(e) => setAiConfig(prev => ({ ...prev, autoAcceptThreshold: Number(e.target.value) }))}
            className="w-full"
          />
          <div className="text-xs text-zinc-500 mt-1">
            Results below this confidence will require manual review
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep('upload')}
          className="px-6 py-3 text-zinc-400 hover:text-white transition"
        >
          Back
        </button>
        <button
          onClick={startProcessing}
          disabled={!projectName.trim()}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold rounded-lg transition shadow-lg"
        >
          Start Processing
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Processing Your Documents</h2>
        <p className="text-zinc-400">AI is analyzing and structuring your screenplay data.</p>
      </div>

      {/* Progress Circle */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="#27272a"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={`${(progress?.progress || 0) * 3.52} 352`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{progress?.progress || 0}%</span>
        </div>
      </div>

      {/* Current Stage */}
      <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className="text-lg font-medium text-white mb-1">
          {progress?.stage.replace(/_/g, ' ').toUpperCase()}
        </div>
        <div className="text-sm text-zinc-400">{progress?.message}</div>
      </div>

      {/* Stage Progress */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {['parsing', 'scene_detection', 'beat_analysis', 'qc_validation'].map(stage => {
          const stageOrder = ['parsing', 'scene_detection', 'character_extraction', 'beat_analysis', 'note_extraction', 'connection_mapping', 'qc_validation', 'finalization'];
          const currentIdx = stageOrder.indexOf(progress?.stage || 'parsing');
          const stageIdx = stageOrder.indexOf(stage);

          return (
            <div
              key={stage}
              className={`p-2 rounded ${
                stageIdx < currentIdx
                  ? 'bg-green-900/30 text-green-400'
                  : stageIdx === currentIdx
                  ? 'bg-blue-900/30 text-blue-400'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {stage.replace(/_/g, ' ')}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Quality Review Required</h2>
        <p className="text-zinc-400">Please review the following issues before finalizing.</p>
      </div>

      {qcReport && (
        <>
          {/* Confidence Score */}
          <div className="flex items-center justify-center gap-4 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div
              className={`text-5xl font-bold ${
                qcReport.confidence >= 80
                  ? 'text-green-400'
                  : qcReport.confidence >= 60
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {qcReport.confidence}%
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-zinc-300">Confidence Score</div>
              <div className="text-xs text-zinc-500">
                {qcReport.stats.totalScenes} scenes • {qcReport.stats.totalCharacters} characters • {qcReport.stats.totalBeats} beats
              </div>
            </div>
          </div>

          {/* Issues */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {qcReport.issues.map(issue => (
              <QCIssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep('configure')}
          className="px-6 py-3 text-zinc-400 hover:text-white transition"
        >
          Re-configure
        </button>
        <button
          onClick={approveQC}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition"
        >
          Approve & Continue
        </button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">🎬</div>
      <h2 className="text-2xl font-bold text-white mb-2">Import Complete!</h2>
      <p className="text-zinc-400">
        Your screenplay has been processed and is ready to use.
      </p>

      {result && (
        <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 text-left">
          <div className="text-lg font-bold text-white mb-4">{result.config.title}</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-500">Sequences:</span>
              <span className="text-zinc-200 ml-2">{result.sequences.length}</span>
            </div>
            <div>
              <span className="text-zinc-500">Scenes:</span>
              <span className="text-zinc-200 ml-2">
                {result.sequences.reduce((sum, s) => sum + s.scenes.length, 0)}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Characters:</span>
              <span className="text-zinc-200 ml-2">{result.config.characters.length}</span>
            </div>
            <div>
              <span className="text-zinc-500">Themes:</span>
              <span className="text-zinc-200 ml-2">{result.config.themes.length}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={finalize}
        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition shadow-lg"
      >
        Open Project
      </button>
    </div>
  );

  // ===================
  // MAIN RENDER
  // ===================

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        {getStepIndicator()}

        {step === 'upload' && renderUploadStep()}
        {step === 'configure' && renderConfigureStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'review' && renderReviewStep()}
        {step === 'complete' && renderCompleteStep()}
      </div>
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const QCIssueCard: React.FC<{ issue: QCIssue }> = ({ issue }) => {
  const severityStyles = {
    error: 'border-red-500/50 bg-red-500/10 text-red-400',
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  };

  const severityIcons = {
    error: '⛔',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`p-3 rounded-lg border ${severityStyles[issue.severity]}`}>
      <div className="flex items-start gap-2">
        <span>{severityIcons[issue.severity]}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{issue.message}</div>
          {issue.suggestion && (
            <div className="text-xs opacity-70 mt-1">💡 {issue.suggestion}</div>
          )}
          {issue.location && (
            <div className="text-xs opacity-50 mt-1">📍 {issue.location}</div>
          )}
        </div>
        {issue.autoFixable && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
            Auto-fixable
          </span>
        )}
      </div>
    </div>
  );
};

export default ImportWizard;
