/**
 * PlantPayoffTracker - Tracks story setups (plants) and their resolutions (payoffs)
 *
 * Every good screenplay has setups that pay off later. This component:
 * - Shows all plants (foreshadowing) and their connected payoffs (callbacks)
 * - Highlights unresolved plants (setups without payoffs)
 * - Allows navigation to related scenes
 */

import React, { useMemo, useState } from 'react';
import { useProject } from '../config/ProjectContext';
import { Scene, SceneConnection } from '../config/types';

interface PlantPayoffTrackerProps {
  onSelectScene: (scene: Scene) => void;
}

interface PlantPayoff {
  id: string;
  plantSceneId: string;
  plantSceneTitle: string;
  plantDescription: string;
  payoffs: {
    sceneId: string;
    sceneTitle: string;
    description: string;
  }[];
  category: 'resolved' | 'unresolved' | 'orphan-payoff';
}

const PlantPayoffTracker: React.FC<PlantPayoffTrackerProps> = ({ onSelectScene }) => {
  const { sequences, config } = useProject();
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Build a map of all scenes for quick lookup
  const sceneMap = useMemo(() => {
    const map = new Map<string, Scene>();
    sequences.forEach(seq => {
      seq.scenes.forEach(scene => {
        map.set(scene.id, scene);
      });
    });
    return map;
  }, [sequences]);

  // Analyze all connections to build plant/payoff relationships
  const plantPayoffs = useMemo(() => {
    const plants = new Map<string, PlantPayoff>();
    const payoffTargets = new Set<string>(); // Track which scenes are payoff targets

    // First pass: find all foreshadow connections (plants)
    sequences.forEach(seq => {
      seq.scenes.forEach(scene => {
        if (!scene.connections) return;

        scene.connections.forEach((conn, idx) => {
          if (conn.type === 'foreshadow') {
            const plantId = `${scene.id}-plant-${idx}`;
            plants.set(plantId, {
              id: plantId,
              plantSceneId: scene.id,
              plantSceneTitle: scene.title,
              plantDescription: conn.description,
              payoffs: [],
              category: 'unresolved'
            });
          }
        });
      });
    });

    // Second pass: find all callback connections (payoffs) and link them
    sequences.forEach(seq => {
      seq.scenes.forEach(scene => {
        if (!scene.connections) return;

        scene.connections.forEach(conn => {
          if (conn.type === 'callback') {
            payoffTargets.add(conn.targetSceneId);

            // Find matching plant(s) for this payoff
            let matched = false;
            plants.forEach((plant, plantId) => {
              // Match if the callback references the plant scene
              if (conn.targetSceneId === plant.plantSceneId) {
                plant.payoffs.push({
                  sceneId: scene.id,
                  sceneTitle: scene.title,
                  description: conn.description
                });
                plant.category = 'resolved';
                matched = true;
              }
            });

            // If no plant found, this is an orphan payoff (callback to non-foreshadowed scene)
            if (!matched) {
              const targetScene = sceneMap.get(conn.targetSceneId);
              const orphanId = `orphan-${scene.id}-${conn.targetSceneId}`;
              if (!plants.has(orphanId)) {
                plants.set(orphanId, {
                  id: orphanId,
                  plantSceneId: conn.targetSceneId,
                  plantSceneTitle: targetScene?.title || conn.targetSceneId,
                  plantDescription: '(Implicit setup - no explicit foreshadow connection)',
                  payoffs: [{
                    sceneId: scene.id,
                    sceneTitle: scene.title,
                    description: conn.description
                  }],
                  category: 'orphan-payoff'
                });
              }
            }
          }
        });
      });
    });

    // Also extract from tracking categories
    sequences.forEach(seq => {
      seq.scenes.forEach(scene => {
        scene.tracking.forEach((track, idx) => {
          if (track.category.toLowerCase().includes('setup') || track.category.toLowerCase().includes('plant')) {
            const plantId = `${scene.id}-tracking-${idx}`;
            if (!plants.has(plantId)) {
              // Check if there's a payoff in tracking
              let hasPayoff = false;
              sequences.forEach(seq2 => {
                seq2.scenes.forEach(scene2 => {
                  scene2.tracking.forEach(track2 => {
                    if ((track2.category.toLowerCase().includes('payoff') || track2.category.toLowerCase().includes('callback')) &&
                        track2.description.toLowerCase().includes(track.description.toLowerCase().split(' ')[0])) {
                      hasPayoff = true;
                    }
                  });
                });
              });

              plants.set(plantId, {
                id: plantId,
                plantSceneId: scene.id,
                plantSceneTitle: scene.title,
                plantDescription: track.description,
                payoffs: [],
                category: hasPayoff ? 'resolved' : 'unresolved'
              });
            }
          }
        });
      });
    });

    return Array.from(plants.values()).sort((a, b) => {
      // Sort: unresolved first, then resolved, then orphans
      const order = { 'unresolved': 0, 'resolved': 1, 'orphan-payoff': 2 };
      return order[a.category] - order[b.category];
    });
  }, [sequences, sceneMap]);

  // Filter plants based on selection
  const filteredPlants = useMemo(() => {
    if (filter === 'all') return plantPayoffs;
    if (filter === 'unresolved') return plantPayoffs.filter(p => p.category === 'unresolved');
    return plantPayoffs.filter(p => p.category === 'resolved');
  }, [plantPayoffs, filter]);

  // Stats
  const stats = useMemo(() => ({
    total: plantPayoffs.length,
    unresolved: plantPayoffs.filter(p => p.category === 'unresolved').length,
    resolved: plantPayoffs.filter(p => p.category === 'resolved').length,
    orphans: plantPayoffs.filter(p => p.category === 'orphan-payoff').length
  }), [plantPayoffs]);

  const handleSceneClick = (sceneId: string) => {
    const scene = sceneMap.get(sceneId);
    if (scene) {
      onSelectScene(scene);
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-zinc-100 mb-1">Plant & Payoff Tracker</h1>
          <p className="text-sm text-zinc-500">
            <span className="text-zinc-300">{config.title}</span> • Every setup needs a callback
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-zinc-200">{stats.total}</div>
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">Total Plants</div>
          </div>
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.unresolved}</div>
            <div className="text-[10px] uppercase tracking-wide text-red-400/70">Unresolved</div>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.resolved}</div>
            <div className="text-[10px] uppercase tracking-wide text-emerald-400/70">Resolved</div>
          </div>
          <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.orphans}</div>
            <div className="text-[10px] uppercase tracking-wide text-amber-400/70">Implicit</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6">
          {(['all', 'unresolved', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'unresolved' ? '🚨 Unresolved' : '✓ Resolved'}
            </button>
          ))}
        </div>

        {/* Plant/Payoff List */}
        <div className="space-y-3">
          {filteredPlants.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <div className="text-4xl mb-3">🌱</div>
              <p>No {filter === 'all' ? 'plants' : filter} plants found.</p>
              <p className="text-xs mt-2">Add "foreshadow" connections to scenes to track setups.</p>
            </div>
          ) : (
            filteredPlants.map(plant => (
              <div
                key={plant.id}
                className={`border rounded-lg overflow-hidden transition ${
                  plant.category === 'unresolved'
                    ? 'bg-red-900/10 border-red-900/50'
                    : plant.category === 'resolved'
                      ? 'bg-emerald-900/10 border-emerald-900/50'
                      : 'bg-amber-900/10 border-amber-900/50'
                }`}
              >
                {/* Plant Header */}
                <button
                  onClick={() => setExpandedId(expandedId === plant.id ? null : plant.id)}
                  className="w-full p-4 text-left flex items-start gap-3 hover:bg-white/5 transition"
                >
                  <div className={`mt-0.5 text-lg ${
                    plant.category === 'unresolved' ? 'text-red-400' :
                    plant.category === 'resolved' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {plant.category === 'unresolved' ? '🌱' : plant.category === 'resolved' ? '🌳' : '🔗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-mono text-blue-400 hover:underline cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); handleSceneClick(plant.plantSceneId); }}
                      >
                        {plant.plantSceneId}
                      </span>
                      <span className="text-xs text-zinc-500">→</span>
                      <span className="text-sm text-zinc-300 truncate">{plant.plantSceneTitle}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{plant.plantDescription}</p>
                    {plant.payoffs.length > 0 && (
                      <div className="mt-2 text-[10px] text-zinc-500">
                        {plant.payoffs.length} payoff{plant.payoffs.length !== 1 ? 's' : ''} →{' '}
                        {plant.payoffs.map(p => p.sceneId).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    plant.category === 'unresolved' ? 'bg-red-900/50 text-red-300' :
                    plant.category === 'resolved' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-amber-900/50 text-amber-300'
                  }`}>
                    {plant.category === 'unresolved' ? 'NEEDS PAYOFF' :
                     plant.category === 'resolved' ? 'RESOLVED' : 'IMPLICIT'}
                  </div>
                </button>

                {/* Expanded Payoffs */}
                {expandedId === plant.id && plant.payoffs.length > 0 && (
                  <div className="border-t border-zinc-800 bg-zinc-900/30 p-4">
                    <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-3">Payoffs</div>
                    <div className="space-y-2">
                      {plant.payoffs.map((payoff, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSceneClick(payoff.sceneId)}
                          className="flex items-start gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition"
                        >
                          <div className="text-emerald-400">↳</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-mono text-emerald-400">{payoff.sceneId}</span>
                              <span className="text-sm text-zinc-300 truncate">{payoff.sceneTitle}</span>
                            </div>
                            <p className="text-xs text-zinc-500">{payoff.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Writing Tips */}
        <div className="mt-8 p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">Plant & Payoff Best Practices</h3>
          <ul className="text-xs text-zinc-500 space-y-1">
            <li>• <span className="text-zinc-400">Rule of Three:</span> Plant once subtly, reinforce once, pay off definitively</li>
            <li>• <span className="text-zinc-400">Chekhov's Gun:</span> Every plant should pay off; cut setups that don't</li>
            <li>• <span className="text-zinc-400">Audience Memory:</span> Plants in Act 1 can payoff in Act 3; plants in Act 3 need faster payoff</li>
            <li>• <span className="text-zinc-400">Subvert Expectations:</span> The best payoffs surprise while feeling inevitable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlantPayoffTracker;
