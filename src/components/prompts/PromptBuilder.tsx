import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, Sliders, Bookmark, Terminal, Shield, RefreshCw } from 'lucide-react';
import { promptGalaxyEngine } from '../../lib/prompts/prompt-galaxy';
import { type PromptTemplate } from '../../lib/radar/schemas';

export default function PromptBuilder() {
  const templates = promptGalaxyEngine.getAllTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(templates[0]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // Initialize variables when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const initial: Record<string, string> = {};
      selectedTemplate.variables.forEach((v) => {
        initial[v.name] = v.defaultValue;
      });
      setVariableValues(initial);
    }
  }, [selectedTemplate]);

  // Load saved local count
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ai_satellite_saved_prompts') || '[]');
      setSavedCount(saved.length);
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const handleInputChange = (varName: string, value: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [varName]: value,
    }));
  };

  const generatedPrompt = selectedTemplate
    ? promptGalaxyEngine.interpolate(selectedTemplate, variableValues)
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt', err);
    }
  };

  const handleSaveLocal = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('ai_satellite_saved_prompts') || '[]');
      const newEntry = {
        id: `saved-${Date.now()}`,
        title: selectedTemplate.title,
        promptText: generatedPrompt,
        savedAt: new Date().toISOString(),
      };
      existing.unshift(newEntry);
      localStorage.setItem('ai_satellite_saved_prompts', JSON.stringify(existing));
      setSavedCount(existing.length);
    } catch (err) {
      console.error('Failed to save to local storage', err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Template Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-space-900/60 backdrop-blur-xl border border-white/5">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cosmic-cyan" />
          <span className="text-sm font-semibold text-cosmic-white">Select Master Blueprint:</span>
          <select
            value={selectedTemplate.slug}
            onChange={(e) => {
              const found = templates.find((t) => t.slug === e.target.value);
              if (found) setSelectedTemplate(found);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-space-950 border border-white/10 text-xs sm:text-sm text-cosmic-white focus:outline-none focus:border-cosmic-cyan font-mono"
          >
            {templates.map((tpl) => (
              <option key={tpl.slug} value={tpl.slug}>
                {tpl.title} ({tpl.category})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
          <span>Target: <strong className="text-cosmic-cyan">{selectedTemplate.targetModel}</strong></span>
          <span>v{selectedTemplate.version}</span>
        </div>
      </div>

      {/* Main 2-Column Interface: Variables & Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Variable Inputs */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-space-900/50 backdrop-blur-xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Sliders className="w-4 h-4 text-cosmic-teal" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white">
              Dynamic Parameters
            </h4>
          </div>

          <p className="text-xs text-text-secondary">
            Customize project parameters to instantiate tailored instructions with zero hallucinations.
          </p>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {selectedTemplate.variables.map((variable) => (
              <div key={variable.name} className="space-y-1">
                <label className="block text-xs font-mono text-text-muted">
                  {variable.label} <span className="text-[10px] text-cosmic-cyan">({variable.name})</span>
                </label>
                <input
                  type="text"
                  value={variableValues[variable.name] || ''}
                  onChange={(e) => handleInputChange(variable.name, e.target.value)}
                  placeholder={variable.defaultValue}
                  className="w-full px-3 py-2 rounded-lg bg-space-950/80 border border-white/10 text-xs text-cosmic-white placeholder:text-text-muted/40 focus:outline-none focus:border-cosmic-cyan"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Prompt Preview & Action Controls */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-space-950/80 backdrop-blur-2xl border border-cosmic-cyan/20 shadow-orbital-glass flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cosmic-cyan" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white">
                  Live Generated Prompt
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveLocal}
                  className="px-3 py-1.5 rounded-lg bg-space-900 hover:bg-space-800 border border-white/10 text-xs text-text-secondary hover:text-cosmic-white flex items-center gap-1.5 transition-colors"
                  title="Save locally in private browser storage"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save ({savedCount})</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cosmic-cyan to-cosmic-blue text-space-950 font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>
            </div>

            {/* Rendered Prompt Block */}
            <pre className="p-4 rounded-xl bg-space-900/90 border border-white/5 text-xs font-mono text-cosmic-white/90 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto selection:bg-cosmic-cyan selection:text-space-950">
              {generatedPrompt}
            </pre>
          </div>

          {/* Model Compatibility & Privacy Safeguard Note */}
          <div className="p-3 rounded-xl bg-space-900/40 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted font-mono">
            <span>Verified compatibility: {selectedTemplate.compatibleEnvironments.join(', ')}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3 h-3" />
              100% Client-Side Privacy Guaranteed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
