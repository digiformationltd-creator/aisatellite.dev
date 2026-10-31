import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  Download,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Code,
  Check,
} from 'lucide-react';

interface SavedPrompt {
  id: string;
  title: string;
  promptText: string;
  savedAt: string;
}

export default function DeveloperWorkspace() {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [preferredFramework, setPreferredFramework] = useState('React / Astro');
  const [preferredLanguage, setPreferredLanguage] = useState('TypeScript');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const prompts = JSON.parse(localStorage.getItem('ai_satellite_saved_prompts') || '[]');
      setSavedPrompts(prompts);
      const framework = localStorage.getItem('ai_satellite_pref_framework');
      if (framework) setPreferredFramework(framework);
      const lang = localStorage.getItem('ai_satellite_pref_lang');
      if (lang) setPreferredLanguage(lang);
    } catch {
      // Local storage disabled
    }
  }, []);

  const handleFrameworkChange = (fw: string) => {
    setPreferredFramework(fw);
    try {
      localStorage.setItem('ai_satellite_pref_framework', fw);
    } catch {}
  };

  const handleLanguageChange = (lang: string) => {
    setPreferredLanguage(lang);
    try {
      localStorage.setItem('ai_satellite_pref_lang', lang);
    } catch {}
  };

  const handleDeletePrompt = (id: string) => {
    const updated = savedPrompts.filter((p) => p.id !== id);
    setSavedPrompts(updated);
    try {
      localStorage.setItem('ai_satellite_saved_prompts', JSON.stringify(updated));
    } catch {}
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved items from local storage?')) {
      setSavedPrompts([]);
      try {
        localStorage.removeItem('ai_satellite_saved_prompts');
        localStorage.removeItem('ai_satellite_pref_framework');
        localStorage.removeItem('ai_satellite_pref_lang');
      } catch {}
    }
  };

  const handleExportJson = () => {
    const data = {
      exportDate: new Date().toISOString(),
      savedPrompts,
      preferences: {
        preferredFramework,
        preferredLanguage,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-satellite-workspace-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <Shield className="w-4 h-4" />
          <span>ZERO-TELEMETRY LOCAL WORKSPACE — Stored strictly inside your browser sandbox.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-space-900 hover:bg-space-800 text-text-secondary hover:text-cosmic-white flex items-center gap-1.5 transition-colors border border-white/5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center gap-1.5 transition-colors border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Local Data</span>
          </button>
        </div>
      </div>

      {/* Workspace Preferences Bar */}
      <div className="p-6 rounded-2xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white flex items-center gap-2">
          <Code className="w-4 h-4 text-cosmic-cyan" />
          <span>Developer Preferences</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-text-muted font-mono mb-1">Preferred Framework</label>
            <input
              type="text"
              value={preferredFramework}
              onChange={(e) => handleFrameworkChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-white/10 text-cosmic-white font-mono focus:border-cosmic-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-text-muted font-mono mb-1">Preferred Language</label>
            <input
              type="text"
              value={preferredLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-white/10 text-cosmic-white font-mono focus:border-cosmic-cyan focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Saved Prompts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cosmic-purple" />
            <span>Bookmarked Master Prompts ({savedPrompts.length})</span>
          </h4>
        </div>

        {savedPrompts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-space-950/40 border border-dashed border-white/10 text-center text-text-muted space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-cosmic-cyan/40" />
            <p className="text-sm">No prompts saved yet.</p>
            <p className="text-xs text-text-secondary">
              Use the <a href="/prompts/builder" className="text-cosmic-cyan hover:underline">Interactive Prompt Builder</a> to generate and save blueprints locally.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {savedPrompts.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cosmic-white text-sm">{p.title}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(p.id, p.promptText)}
                      className="px-3 py-1 rounded bg-space-800 text-xs font-mono text-cosmic-cyan hover:bg-space-700 flex items-center gap-1"
                    >
                      {copiedId === p.id ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                      <span>{copiedId === p.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePrompt(p.id)}
                      className="p-1 rounded text-text-muted hover:text-rose-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <pre className="p-3.5 rounded-xl bg-space-950 border border-white/5 text-xs font-mono text-text-secondary whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {p.promptText}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
