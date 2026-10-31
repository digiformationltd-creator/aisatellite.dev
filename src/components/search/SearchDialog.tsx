import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Terminal, Database, Sparkles, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

interface SearchItem {
  title: string;
  category: string;
  url: string;
  type: 'tool' | 'prompt' | 'workflow' | 'article' | 'page';
  description?: string;
}

const PRELOADED_INDEX: SearchItem[] = [
  { title: 'PostgreSQL', category: 'Databases', url: '/tools/postgresql', type: 'tool', description: 'Advanced open-source relational database' },
  { title: 'SQLite', category: 'Databases', url: '/tools/sqlite', type: 'tool', description: 'Small, fast, self-contained embedded database engine' },
  { title: 'Supabase', category: 'Databases', url: '/tools/supabase', type: 'tool', description: 'Open-source Firebase alternative with Postgres' },
  { title: 'Cloudflare Pages', category: 'Free Hosting', url: '/tools/cloudflare-pages', type: 'tool', description: 'Global edge static and JAMstack hosting platform' },
  { title: 'GitHub Pages', category: 'Free Hosting', url: '/tools/github-pages', type: 'tool', description: 'Free website hosting directly from your repository' },
  { title: 'Coolify', category: 'DevOps', url: '/tools/coolify', type: 'tool', description: 'Open-source self-hostable Heroku/Vercel alternative' },
  { title: 'Keycloak', category: 'Authentication', url: '/tools/keycloak', type: 'tool', description: 'Open-source identity and access management' },
  { title: 'Authentik', category: 'Authentication', url: '/tools/authentik', type: 'tool', description: 'Versatile open-source identity provider' },
  { title: 'MinIO', category: 'Storage', url: '/tools/minio', type: 'tool', description: 'High-performance S3-compatible object storage' },
  { title: 'Nextcloud Hub', category: 'Productivity', url: '/tools/nextcloud', type: 'tool', description: 'Self-hosted content collaboration platform' },
  { title: 'Ollama', category: 'AI Development', url: '/tools/ollama', type: 'tool', description: 'Run large language models locally on CPU/GPU' },
  { title: 'Senior Full-Stack Architect Prompt', category: 'Prompts', url: '/prompts/claude-code-senior-architect', type: 'prompt', description: 'System prompt for Claude Code and Cursor' },
  { title: 'Autonomous PR Code Review Agent', category: 'Workflows', url: '/workflows#autonomous-pr-code-review', type: 'workflow', description: 'Automated GitHub pull request security auditor' },
  { title: 'Local RAG with Ollama & Chroma', category: 'Workflows', url: '/workflows#local-rag-ollama-chroma', type: 'workflow', description: '100% offline document search pipeline' },
  { title: 'UK LTD Incorporation & Global Payments', category: 'Playbooks', url: '/blog/how-global-developers-register-uk-ltd-stripe', type: 'article', description: 'Companies House compliance and international business banking' },
  { title: 'Open-Source CRM & ERP for Agencies', category: 'Playbooks', url: '/blog/best-open-source-crm-erp-for-remote-agencies', type: 'article', description: 'Evaluating self-hosted vs unified business OS stacks' },
  { title: 'Model Context Protocol (MCP) Guide', category: 'Playbooks', url: '/blog/how-to-build-autonomous-ai-agents-with-mcp', type: 'article', description: 'Standardized interfaces for autonomous AI agents' },
  { title: 'Global Technology Radar', category: 'Radar', url: '/radar', type: 'page', description: 'Interactive 3D radar of verified technologies and alternatives' },
  { title: 'Developer Solution Center', category: 'Solutions', url: '/solutions', type: 'page', description: 'Step-by-step verified problem-to-solution engineering blueprints' },
  { title: 'Interactive AI Prompt Builder', category: 'Prompts', url: '/prompts/builder', type: 'page', description: 'Customizable master prompts with dynamic project parameters' },
  { title: 'Personalized Developer Workspace', category: 'Workspace', url: '/workspace', type: 'page', description: 'Client-side private bookmarks and custom collections' },
  { title: 'Three.js Cosmic Particle Hero Canvas', category: '3D Web Lab', url: '/3d-lab/cosmic-particle-hero', type: 'page', description: 'Interactive GPU particle field' },
  { title: 'Amazon S3 Free Alternatives', category: 'Alternatives', url: '/alternatives/aws-s3-alternatives', type: 'page', description: 'Zero egress open-source storage' },
  { title: 'Firebase Free Alternatives', category: 'Alternatives', url: '/alternatives/firebase-alternatives', type: 'page', description: 'Relational open-source backends' },
  { title: 'Company Formation Guide', category: 'Founder Hub', url: '/company-formation', type: 'page', description: 'Global entity setup' },
  { title: 'Global Payments Guide', category: 'Founder Hub', url: '/global-payments', type: 'page', description: 'Stripe, Wise, and payment rails' },
];

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>(PRELOADED_INDEX.slice(0, 6));
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Global custom event listener so search buttons anywhere can trigger open
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-search', handleOpen);
    return () => window.removeEventListener('open-search', handleOpen);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(PRELOADED_INDEX.slice(0, 6));
    }
  }, [isOpen]);

  // Search filtering
  useEffect(() => {
    if (!query.trim()) {
      setResults(PRELOADED_INDEX.slice(0, 6));
      return;
    }
    const q = query.toLowerCase();
    const filtered = PRELOADED_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-space-950/85 backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Global search dialog"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl orbital-glass rounded-modal shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-cosmic-cyan/35"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-subtle bg-space-850/60">
          <Search className="w-5 h-5 text-cosmic-cyan mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, AI prompts, 3D demos, workflows & playbooks..."
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm sm:text-base focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-text-muted hover:text-text-primary mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-text-muted bg-space-950 rounded border border-border-subtle">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
          {results.length > 0 ? (
            results.map((item) => (
              <a
                key={item.url + item.title}
                href={item.url}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-card hover:bg-space-850 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-space-950 text-cosmic-cyan border border-border-subtle group-hover:border-cosmic-cyan/30">
                    {item.type === 'tool' && <Database className="w-4 h-4" />}
                    {item.type === 'prompt' && <Terminal className="w-4 h-4 text-cosmic-amber" />}
                    {item.type === 'workflow' && <Sparkles className="w-4 h-4 text-cosmic-violet" />}
                    {item.type === 'article' && <BookOpen className="w-4 h-4 text-text-primary" />}
                    {item.type === 'page' && <ExternalLink className="w-4 h-4 text-cosmic-emerald" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary group-hover:text-cosmic-cyan transition-colors">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-xs text-text-muted line-clamp-1">{item.description}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-space-950 text-text-muted border border-border-subtle">
                    {item.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-cosmic-cyan transition-all" />
                </div>
              </a>
            ))
          ) : (
            <div className="py-12 text-center text-text-muted">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30 text-cosmic-cyan" />
              <p className="text-sm font-medium text-text-secondary">No matching knowledge nodes found</p>
              <p className="text-xs mt-1">Try searching for "Postgres", "MCP", "Three.js", or "Stripe"</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-space-950 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted">
          <span>Navigation: <kbd className="text-[10px] bg-space-850 px-1.5 py-0.5 rounded">↑</kbd> <kbd className="text-[10px] bg-space-850 px-1.5 py-0.5 rounded">↓</kbd> to select</span>
          <span className="text-cosmic-cyan">AI Satellite v1.0 Index</span>
        </div>
      </div>
    </div>
  );
}
