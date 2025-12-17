/**
 * ExportModal - Export script to various formats
 */

import React, { useState } from 'react';
import { useProject } from '../config/ProjectContext';
import { Sequence } from '../config/types';
import { generateScriptExport } from '../services/scriptUtils';

interface ExportModalProps {
  sequences: Sequence[];
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ sequences, onClose }) => {
  const { config } = useProject();

  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeTracking, setIncludeTracking] = useState(false);
  const [format, setFormat] = useState<'txt' | 'fountain'>('txt');

  const handleDownload = () => {
    const content = generateScriptExport(sequences, { includeNotes, includeTracking, format });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Use project ID for filename (kebab-case)
    const filename = `${config.id}-export.${format}`;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Export Script</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Export <span className="text-blue-400">{config.title}</span> to industry-standard formats.
        </p>

        <div className="space-y-4 mb-8">
          {/* Include Notes Toggle */}
          <div className="flex items-center justify-between p-4 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-sm font-bold text-zinc-300">Include Rewrite Notes</span>
            <button
              onClick={() => setIncludeNotes(!includeNotes)}
              className={`w-12 h-6 rounded-full transition-colors relative ${includeNotes ? 'bg-blue-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${includeNotes ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Include Tracking Toggle */}
          <div className="flex items-center justify-between p-4 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-sm font-bold text-zinc-300">Include Tracking Data</span>
            <button
              onClick={() => setIncludeTracking(!includeTracking)}
              className={`w-12 h-6 rounded-full transition-colors relative ${includeTracking ? 'bg-blue-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${includeTracking ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Format Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormat('txt')}
              className={`p-4 rounded border text-center transition ${format === 'txt' ? 'bg-blue-900/20 border-blue-500 text-blue-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
            >
              <span className="block text-lg font-bold mb-1">.TXT</span>
              <span className="text-xs uppercase">Plain Text</span>
            </button>
            <button
              onClick={() => setFormat('fountain')}
              className={`p-4 rounded border text-center transition ${format === 'fountain' ? 'bg-blue-900/20 border-blue-500 text-blue-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
            >
              <span className="block text-lg font-bold mb-1">.FOUNTAIN</span>
              <span className="text-xs uppercase">Screenplay</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-white hover:bg-gray-100 text-black font-bold rounded transition shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
