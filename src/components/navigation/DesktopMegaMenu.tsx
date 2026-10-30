import React, { useState } from 'react';
import { ChevronDown, Database, Cloud, Cpu, Sparkles, BookOpen, Layers, Terminal } from 'lucide-react';

export default function DesktopMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-cosmic-cyan transition-colors py-2 focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>Explore Vault</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cosmic-cyan' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full -left-20 w-[580px] p-4 bg-space-900/95 backdrop-blur-xl border border-border-hover rounded-card shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/open-source"
              className="p-3 rounded-lg hover:bg-space-850 transition-colors flex items-start gap-3 group"
            >
              <Database className="w-5 h-5 text-cosmic-cyan flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-semibold text-text-primary group-hover:text-cosmic-cyan">Open-Source Vault</div>
                <div className="text-xs text-text-muted mt-0.5">Free databases, storage, and self-hosted tools.</div>
              </div>
            </a>

            <a
              href="/ai-agents"
              className="p-3 rounded-lg hover:bg-space-850 transition-colors flex items-start gap-3 group"
            >
              <Cpu className="w-5 h-5 text-cosmic-violet flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-semibold text-text-primary group-hover:text-cosmic-violet">AI Agents & Workflows</div>
                <div className="text-xs text-text-muted mt-0.5">Multi-agent pipelines, MCP servers, and blueprints.</div>
              </div>
            </a>

            <a
              href="/3d-lab"
              className="p-3 rounded-lg hover:bg-space-850 transition-colors flex items-start gap-3 group"
            >
              <Sparkles className="w-5 h-5 text-cosmic-emerald flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-semibold text-text-primary group-hover:text-cosmic-emerald">3D Web Lab</div>
                <div className="text-xs text-text-muted mt-0.5">Interactive Three.js shaders and particle demos.</div>
              </div>
            </a>

            <a
              href="/prompts"
              className="p-3 rounded-lg hover:bg-space-850 transition-colors flex items-start gap-3 group"
            >
              <Terminal className="w-5 h-5 text-cosmic-amber flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-semibold text-text-primary group-hover:text-cosmic-amber">Prompt Vault</div>
                <div className="text-xs text-text-muted mt-0.5">Vetted system prompts for Claude, Cursor, and GPT.</div>
              </div>
            </a>

            <a
              href="/alternatives"
              className="p-3 rounded-lg hover:bg-space-850 transition-colors flex items-start gap-3 group"
            >
              <Layers className="w-5 h-5 text-cosmic-rose flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-semibold text-text-primary group-hover:text-cosmic-rose">Free Alternatives</div>
                <div className="text-xs text-text-muted mt-0.5">Replace expensive SaaS tools with open-source code.</div>
              </div>
            </a>

            <a
              href="/playbooks"
              className="p-3 rounded-lg hover:bg-space-850 transition-colors flex items-start gap-3 group"
            >
              <BookOpen className="w-5 h-5 text-text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-semibold text-text-primary group-hover:text-cosmic-cyan">Founder Playbooks</div>
                <div className="text-xs text-text-muted mt-0.5">Global company incorporation and architecture guides.</div>
              </div>
            </a>
          </div>

          <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted px-2">
            <span>Free Knowledge Network</span>
            <a href="/projects" className="text-cosmic-cyan hover:underline">
              View Original Projects &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
