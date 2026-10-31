import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Layers,
  Shield,
  Server,
  ExternalLink,
  Info,
  CheckCircle2,
  Table,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { radarStore } from '../../lib/radar/radar-store';
import { type TechnologyResource, type RadarCategory } from '../../lib/radar/schemas';
import { TechnologyRadar3D } from './TechnologyRadar3D.client';

export default function TechnologyRadarView() {
  const allCategories = radarStore.getAllCategories();
  const allResources = radarStore.getAllResources();

  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<TechnologyResource | null>(allResources[0] || null);
  const [viewMode, setViewMode] = useState<'3d' | 'accessible_2d'>('3d');
  const canvasRef = useRef<HTMLDivElement>(null);
  const radarInstanceRef = useRef<TechnologyRadar3D | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setViewMode('accessible_2d');
    }
  }, []);

  // Filtered list
  const filteredResources = selectedCluster === 'all'
    ? allResources
    : allResources.filter((r) => r.categories.includes(selectedCluster));

  // Initialize 3D Scene when in 3D mode
  useEffect(() => {
    if (viewMode === '3d' && canvasRef.current) {
      if (radarInstanceRef.current) {
        radarInstanceRef.current.dispose();
      }

      radarInstanceRef.current = new TechnologyRadar3D({
        container: canvasRef.current,
        resources: filteredResources,
        onSelectResource: (res) => setSelectedResource(res),
      });
    }

    return () => {
      if (radarInstanceRef.current) {
        radarInstanceRef.current.dispose();
        radarInstanceRef.current = null;
      }
    };
  }, [viewMode, selectedCluster]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Controls: Cluster Filters & View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-space-950/70 backdrop-blur-xl border border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCluster('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
              selectedCluster === 'all'
                ? 'bg-cosmic-cyan text-space-950 font-bold shadow-sm'
                : 'bg-space-900 text-text-muted hover:text-cosmic-white'
            }`}
          >
            All Clusters ({allResources.length})
          </button>
          {allCategories.slice(0, 6).map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCluster(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedCluster === cat.slug
                  ? 'bg-cosmic-cyan text-space-950 font-bold shadow-sm'
                  : 'bg-space-900 text-text-muted hover:text-cosmic-white'
              }`}
            >
              {cat.title} ({cat.resourceCount})
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-space-900 border border-white/5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === '3d'
                ? 'bg-space-800 text-cosmic-cyan font-semibold'
                : 'text-text-muted hover:text-cosmic-white'
            }`}
            aria-label="Switch to 3D Orbital Radar View"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>3D Radar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('accessible_2d')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'accessible_2d'
                ? 'bg-space-800 text-cosmic-cyan font-semibold'
                : 'text-text-muted hover:text-cosmic-white'
            }`}
            aria-label="Switch to Accessible 2D Table View"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Accessible 2D</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === '3d' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Radar Viewport */}
          <div className="lg:col-span-8 relative h-[520px] rounded-3xl bg-space-950/90 backdrop-blur-2xl border border-cosmic-cyan/25 shadow-orbital-glass overflow-hidden flex flex-col justify-between">
            <div
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
              role="img"
              aria-label="Interactive 3D Technology Radar"
            />

            {/* Overlaid HUD Badge */}
            <div className="relative z-10 m-4 p-3 max-w-xs rounded-xl bg-space-950/70 backdrop-blur-md border border-white/10 text-xs font-mono text-text-muted pointer-events-none">
              <div className="flex items-center gap-2 text-cosmic-cyan font-bold">
                <Radio className="w-3.5 h-3.5 animate-spin" />
                <span>ACTIVE ORBITAL SWEEP</span>
              </div>
              <p className="mt-1 text-[11px] leading-tight">
                Click any 3D technology beacon to inspect verification details.
              </p>
            </div>
          </div>

          {/* Side Inspector Panel */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
            {selectedResource ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/20 uppercase">
                    Beacon Telemetry
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    Updated {selectedResource.lastVerified}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-cosmic-white tracking-wide">
                    {selectedResource.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {selectedResource.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-950/60 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-text-muted">License:</span>
                    <span className="text-cosmic-white">{selectedResource.license || 'Permissive'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Self-Hosted:</span>
                    <span className="text-cosmic-cyan">{selectedResource.selfHosted ? 'Supported' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status:</span>
                    <span className="text-emerald-400 capitalize">{selectedResource.verificationStatus}</span>
                  </div>
                  {selectedResource.setupComplexity && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Setup Complexity:</span>
                      <span className="text-text-secondary">{selectedResource.setupComplexity}</span>
                    </div>
                  )}
                </div>

                {selectedResource.officialUrl && (
                  <a
                    href={selectedResource.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-sm"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted space-y-2">
                <Info className="w-8 h-8 mx-auto text-cosmic-cyan/60" />
                <p className="text-xs">Click any orbital node in the 3D space radar to inspect telemetry.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Accessible 2D Table Fallback */
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono" aria-label="Technology Radar Verified Resources">
            <thead className="border-b border-white/10 text-text-muted uppercase">
              <tr>
                <th className="py-3 px-4">Technology</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">License</th>
                <th className="py-3 px-4">Hosting</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Official Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-space-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-cosmic-white">{res.title}</td>
                  <td className="py-3 px-4 text-text-secondary">{res.categories.join(', ')}</td>
                  <td className="py-3 px-4 text-text-muted">{res.license || 'Permissive'}</td>
                  <td className="py-3 px-4 text-cosmic-cyan">{res.selfHosted ? 'Self-Hosted' : 'Cloud / Local'}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {res.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {res.officialUrl ? (
                      <a
                        href={res.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cosmic-cyan hover:underline"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
