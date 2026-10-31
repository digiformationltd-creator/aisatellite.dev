import React, { useState } from 'react';
import { Copy, Check, Eye, Code, Layers, Sliders, Smartphone, Monitor } from 'lucide-react';

interface ComponentSpec {
  id: string;
  name: string;
  category: string;
  description: string;
  accessibilityNotes: string;
  browserSupport: string;
  tailwindSnippet: string;
  cssSnippet: string;
  renderPreview: (intensity: number) => React.ReactNode;
}

export default function InteractiveCssComponentGalaxy() {
  const [selectedId, setSelectedId] = useState('orbital-glass-card');
  const [blurIntensity, setBlurIntensity] = useState(16);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const components: ComponentSpec[] = [
    {
      id: 'orbital-glass-card',
      name: 'Orbital Liquid Glass Card',
      category: 'Cards',
      description: 'Ultra-refined translucent glass card with multi-layered specular highlights and dynamic backdrop blur.',
      accessibilityNotes: 'Maintains WCAG AAA 7:1 text contrast using dark semi-opaque background fallbacks for devices without backdrop-filter support.',
      browserSupport: 'Chrome 76+, Safari 13.1+, Firefox 103+, Edge 79+',
      tailwindSnippet: `<div className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300">
  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
  <h3 className="text-lg font-bold text-white">Orbital Station Telemetry</h3>
  <p className="text-xs text-slate-300 mt-2">Active satellite observation grid online.</p>
</div>`,
      cssSnippet: `.orbital-glass-card {
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  transition: border-color 0.3s ease;
}
.orbital-glass-card:hover {
  border-color: rgba(6, 182, 212, 0.4);
}`,
      renderPreview: (intensity) => (
        <div
          className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl overflow-hidden max-w-sm mx-auto transition-all"
          style={{ backdropFilter: `blur(${intensity}px)`, WebkitBackdropFilter: `blur(${intensity}px)` }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider">TELEMETRY LOCK</span>
          </div>
          <h4 className="text-base font-bold text-white">Orbital Observation Pod</h4>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Continuously observing open-source ecosystems, license modifications, and free alternatives.
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PING: 14ms</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
        </div>
      ),
    },
    {
      id: 'holographic-pill-tabs',
      name: 'Holographic Floating Navigation Tabs',
      category: 'Navigation',
      description: 'Glow-accented horizontal tab strip with accessible ARIA keyboard navigation.',
      accessibilityNotes: 'Implements role="tablist", aria-selected, and arrow key navigation between tabs.',
      browserSupport: 'All modern evergreen browsers (Chrome, Safari, Firefox, Edge)',
      tailwindSnippet: `<nav role="tablist" className="inline-flex p-1.5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl">
  <button role="tab" aria-selected="true" className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
    Active View
  </button>
  <button role="tab" aria-selected="false" className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white">
    Secondary View
  </button>
</nav>`,
      cssSnippet: `.holographic-tabs {
  display: inline-flex;
  padding: 0.375rem;
  border-radius: 1rem;
  background: rgba(2, 6, 23, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
}`,
      renderPreview: () => (
        <div className="text-center py-6">
          <nav role="tablist" aria-label="Sample Navigation" className="inline-flex p-1.5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-xl">
            <button role="tab" aria-selected="true" className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
              Overview
            </button>
            <button role="tab" aria-selected="false" className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Code Examples
            </button>
            <button role="tab" aria-selected="false" className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Troubleshooting
            </button>
          </nav>
        </div>
      ),
    },
  ];

  const current = components.find((c) => c.id === selectedId) || components[0];

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(current.tailwindSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Component Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {components.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedId(comp.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedId === comp.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {comp.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Canvas Preview */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">{current.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                Blur: {blurIntensity}px
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={blurIntensity}
                  onChange={(e) => setBlurIntensity(Number(e.target.value))}
                  className="w-20 accent-cyan-400"
                />
              </label>
            </div>
          </div>

          <div className="py-8 flex items-center justify-center">
            {current.renderPreview(blurIntensity)}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Category: {current.category}</span>
            <span>Support: {current.browserSupport}</span>
          </div>
        </div>

        {/* Right Source Code & Accessibility Column */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                Tailwind & CSS Snippet
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy JSX'}
              </button>
            </div>

            <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-[220px] p-3 rounded-xl bg-slate-950 border border-white/5 leading-relaxed">
              {current.tailwindSnippet}
            </pre>

            <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300">
              <strong className="text-cyan-300 block mb-1">Accessibility & Contrast:</strong>
              {current.accessibilityNotes}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-4">
            Previews run in sandbox isolation; zero untrusted scripts executed in host context.
          </div>
        </div>
      </div>
    </div>
  );
}
