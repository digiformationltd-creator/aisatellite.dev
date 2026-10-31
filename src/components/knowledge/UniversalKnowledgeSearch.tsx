import React, { useState } from 'react';
import { Search, Filter, Globe, ExternalLink, ShieldCheck, Tag, Terminal } from 'lucide-react';
import { universalKnowledgeEngine, type UniversalSearchResult } from '../../lib/knowledge/universal-knowledge-engine';
import type { KnowledgeCategory } from '../../lib/knowledge/types';

export default function UniversalKnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');

  const categories: Array<{ id: KnowledgeCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Knowledge' },
    { id: 'free_alternatives', label: 'Free Alternatives' },
    { id: 'open_source', label: 'Open Source' },
    { id: 'ai_prompts', label: 'AI Prompts' },
    { id: 'developer_tutorials', label: 'Tutorials' },
    { id: 'css_components', label: 'CSS Components' },
    { id: 'free_apis', label: 'Free APIs' },
    { id: 'mcp_servers', label: 'MCP Servers' },
    { id: 'developer_troubleshooting', label: 'Troubleshooting' },
  ];

  const results = universalKnowledgeEngine.search({
    query,
    category: selectedCategory,
    technology: selectedTech !== 'all' ? selectedTech : undefined,
    limit: 25,
  });

  return (
    <div className="space-y-6">
      {/* Search Bar & Filters */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 14 categories: APIs, alternatives, prompts, tutorials, MCP servers, troubleshooting..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 placeholder-slate-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Found {results.length} verified knowledge resources</span>
          <span>Index: Real-Time Verified Knowledge Graph</span>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-white">No exact resources found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No verified free alternative or guide currently matches your query. Try broadening category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(({ resource }) => (
              <div
                key={resource.id}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 uppercase tracking-wider">
                      {resource.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {resource.verificationStatus.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                    <a href={`/${resource.category === 'developer_tutorials' ? 'tutorials' : resource.category === 'free_alternatives' ? 'alternatives' : resource.category === 'css_components' ? 'components' : resource.category === 'ai_prompts' ? 'prompts' : resource.category === 'developer_troubleshooting' ? 'troubleshooting' : 'tools'}/${resource.slug}`}>
                      {resource.title}
                    </a>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {resource.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono">Verified {resource.lastVerifiedDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
