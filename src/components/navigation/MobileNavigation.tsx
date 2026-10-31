import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Sparkles, Database, Cpu, Terminal, BookOpen, Layers, Orbit } from 'lucide-react';

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-text-secondary hover:text-cosmic-cyan transition-colors"
        aria-label="Open mobile navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-space-950/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-xs bg-space-900 border-l border-border-subtle p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
                <span className="font-heading font-bold text-lg text-text-primary flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cosmic-cyan animate-pulse"></span>
                  AI Satellite
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-text-muted hover:text-text-primary rounded-lg"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-3">
                <a
                  href="/open-source"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-cyan font-medium transition-colors"
                >
                  <Database className="w-4 h-4 text-cosmic-cyan" />
                  <span>Free Tools & Vault</span>
                </a>

                <a
                  href="/ai-agents"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-violet font-medium transition-colors"
                >
                  <Cpu className="w-4 h-4 text-cosmic-violet" />
                  <span>AI Agents & Workflows</span>
                </a>

                <a
                  href="/3d-lab"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-emerald font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-cosmic-emerald" />
                  <span>3D Web Lab</span>
                </a>

                <a
                  href="/prompts"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-amber font-medium transition-colors"
                >
                  <Terminal className="w-4 h-4 text-cosmic-amber" />
                  <span>Prompt Vault</span>
                </a>

                <a
                  href="/alternatives"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-rose font-medium transition-colors"
                >
                  <Layers className="w-4 h-4 text-cosmic-rose" />
                  <span>Free Alternatives</span>
                </a>

                <a
                  href="/knowledge"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-cyan font-medium transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-cosmic-cyan" />
                  <span>Knowledge Universe</span>
                </a>

                <a
                  href="/troubleshooting"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-amber font-medium transition-colors"
                >
                  <Terminal className="w-4 h-4 text-cosmic-amber" />
                  <span>Troubleshooting</span>
                </a>

                <a
                  href="/solutions"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-cyan font-medium transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-cosmic-cyan" />
                  <span>Solutions Center</span>
                </a>

                <a
                  href="/tutorials"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-cyan font-medium transition-colors"
                >
                  <Terminal className="w-4 h-4 text-cosmic-cyan" />
                  <span>Tutorials</span>
                </a>

                <a
                  href="/components"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-emerald font-medium transition-colors"
                >
                  <Layers className="w-4 h-4 text-cosmic-emerald" />
                  <span>CSS Components</span>
                </a>

                <a
                  href="/radar"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-cyan font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-cosmic-cyan" />
                  <span>3D Tech Radar</span>
                </a>

                <a
                  href="/workspace"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-cosmic-cyan hover:bg-space-850 font-medium transition-colors"
                >
                  <Orbit className="w-4 h-4 text-cosmic-cyan" />
                  <span>My Orbit Workspace</span>
                </a>

                <a
                  href="/playbooks"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary hover:bg-space-850 hover:text-cosmic-cyan font-medium transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-text-primary" />
                  <span>Founder Playbooks</span>
                </a>
              </nav>
            </div>

            <div className="pt-6 border-t border-border-subtle space-y-3">
              <a
                href="/contribute"
                className="block text-center w-full py-2.5 px-4 rounded-button bg-space-850 hover:bg-space-800 text-sm font-semibold text-text-primary border border-border-subtle"
              >
                Submit Tool / Contribute
              </a>
              <div className="text-center text-xs font-mono text-text-muted">
                v1.0.0 &bull; Cloudflare Edge Ready
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
