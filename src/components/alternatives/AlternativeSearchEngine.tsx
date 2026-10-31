import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Layers, CheckCircle2, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import {
  AlternativeMatchingEngine,
  type AlternativeItem,
  type AlternativeFilterType,
  type AlternativeSortOption,
} from '../../lib/alternative-matching.js';
import { SOFTWARE_TAXONOMY } from '../../data/software-taxonomy.js';

interface Props {
  initialItems: AlternativeItem[];
  defaultCategory?: string;
}

export default function AlternativeSearchEngine({ initialItems, defaultCategory = 'all' }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [filter, setFilter] = useState<AlternativeFilterType>('all');
  const [sort, setSort] = useState<AlternativeSortOption>('relevance');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync state with URL params on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    const catParam = params.get('category');
    const filterParam = params.get('filter') as AlternativeFilterType;
    const sortParam = params.get('sort') as AlternativeSortOption;

    if (qParam) setQuery(qParam);
    if (catParam) setCategory(catParam);
    if (filterParam) setFilter(filterParam);
    if (sortParam) setSort(sortParam);
  }, []);

  // Update URL params when search state changes
  const updateUrl = (newQuery: string, newCat: string, newFilter: string, newSort: string) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCat && newCat !== 'all') params.set('category', newCat);
    if (newFilter && newFilter !== 'all') params.set('filter', newFilter);
    if (newSort && newSort !== 'relevance') params.set('sort', newSort);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateUrl(val, category, filter, sort);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    updateUrl(query, val, filter, sort);
  };

  const handleFilterChange = (val: AlternativeFilterType) => {
    setFilter(val);
    updateUrl(query, category, val, sort);
  };

  const handleSortChange = (val: AlternativeSortOption) => {
    setSort(val);
    updateUrl(query, category, filter, val);
  };

  // Compute matched items
  const filteredItems = useMemo(() => {
    return AlternativeMatchingEngine.search(initialItems, query, filter, category, sort);
  }, [initialItems, query, filter, category, sort]);

  // Autocomplete suggestions based on taxonomy and titles
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const matches: string[] = [];

    // From taxonomy paid products
    for (const item of SOFTWARE_TAXONOMY) {
      if (item.paidProduct.toLowerCase().includes(q)) {
        matches.push(item.paidProduct);
      }
      for (const syn of item.synonyms) {
        if (syn.includes(q) && !matches.includes(item.paidProduct)) {
          matches.push(item.paidProduct);
        }
      }
    }

    // From alternative names
    for (const alt of initialItems) {
      for (const repl of alt.openSourceReplacements || []) {
        if (repl.toLowerCase().includes(q) && !matches.includes(repl)) {
          matches.push(repl);
        }
      }
    }

    return matches.slice(0, 6);
  }, [query, initialItems]);

  const filterTabs: Array<{ id: AlternativeFilterType; label: string }> = [
    { id: 'all', label: 'All Alternatives' },
    { id: 'open_source', label: 'Open Source' },
    { id: 'free_forever', label: 'Free Forever' },
    { id: 'self_hosted', label: 'Self-Hosted' },
    { id: 'free_hosted_tier', label: 'Free Cloud Tier' },
    { id: 'freemium', label: 'Freemium' },
  ];

  return (
    <div className="w-full">
      {/* Search Input Bar with Autocomplete */}
      <div className="relative max-w-3xl mx-auto mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-cosmic-cyan pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="What paid software do you want to replace? (e.g. Photoshop, Notion, Cursor, Zapier)"
            className="w-full pl-12 pr-10 py-4 rounded-xl bg-space-900 border border-border-hover focus:border-cosmic-cyan focus:ring-2 focus:ring-cosmic-cyan/30 text-text-primary text-base font-medium placeholder-text-muted transition-all shadow-glow-cyan/10"
            aria-label="Search software alternatives"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              className="absolute right-4 text-xs font-mono text-text-muted hover:text-text-primary px-1.5 py-0.5 rounded bg-space-850"
            >
              Clear
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-space-900 border border-cosmic-cyan/40 shadow-2xl z-30">
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-3 py-1">
              Popular Replacements:
            </div>
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onMouseDown={() => {
                  handleQueryChange(sug);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-space-850 hover:text-cosmic-cyan transition-colors flex items-center justify-between"
              >
                <span>{sug}</span>
                <span className="text-xs font-mono text-text-muted">Replace with free alternatives</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-border-subtle">
        {/* Classification Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === tab.id
                  ? 'bg-cosmic-cyan text-space-950 font-bold shadow-glow-cyan/30'
                  : 'bg-space-900 text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-hover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category & Sorting Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-space-900 border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-text-secondary">
            <Filter className="w-3.5 h-3.5 text-cosmic-cyan" />
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-transparent text-text-primary text-xs focus:outline-none cursor-pointer"
              aria-label="Filter by Category"
            >
              <option value="all" className="bg-space-900 text-text-primary">All Categories</option>
              <option value="AI & Coding" className="bg-space-900 text-text-primary">AI & Coding</option>
              <option value="Automation" className="bg-space-900 text-text-primary">Automation</option>
              <option value="Productivity & Office" className="bg-space-900 text-text-primary">Productivity</option>
              <option value="CRM & ERP" className="bg-space-900 text-text-primary">CRM & ERP</option>
              <option value="Creative & Design" className="bg-space-900 text-text-primary">Creative & Design</option>
              <option value="Cloud Infrastructure" className="bg-space-900 text-text-primary">Cloud Infrastructure</option>
              <option value="Databases & Storage" className="bg-space-900 text-text-primary">Databases</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-space-900 border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-text-secondary">
            <ArrowUpDown className="w-3.5 h-3.5 text-cosmic-cyan" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as AlternativeSortOption)}
              className="bg-transparent text-text-primary text-xs focus:outline-none cursor-pointer"
              aria-label="Sort Alternatives"
            >
              <option value="relevance" className="bg-space-900 text-text-primary">Most Relevant</option>
              <option value="open_source" className="bg-space-900 text-text-primary">Fully Open Source</option>
              <option value="easiest_setup" className="bg-space-900 text-text-primary">Easiest Setup</option>
              <option value="self_hosted" className="bg-space-900 text-text-primary">Self-Hosted</option>
              <option value="recently_verified" className="bg-space-900 text-text-primary">Recently Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6 text-xs font-mono text-text-muted">
        <span>
          Showing <strong className="text-cosmic-cyan">{filteredItems.length}</strong> verified software alternatives
        </span>
        {query && (
          <span>
            Query: "<span className="text-text-primary">{query}</span>"
          </span>
        )}
      </div>

      {/* Results Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="cosmic-glass p-6 flex flex-col justify-between group hover:border-cosmic-cyan/60 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-950 text-text-secondary border border-border-subtle">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-cosmic-rose line-through opacity-80 font-semibold">
                    {item.proprietaryTool}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-cosmic-cyan transition-colors mb-2">
                  <a href={`/alternatives/${item.id}`}>
                    {item.title}
                  </a>
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                  {item.summary}
                </p>

                {/* Open Source Replacements Pills */}
                <div className="mb-4">
                  <div className="text-[11px] font-mono text-text-muted mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cosmic-emerald" />
                    <span>Free & Open Replacements:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.openSourceReplacements || []).map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 text-xs font-mono rounded bg-space-950 text-cosmic-emerald border border-cosmic-emerald/20 font-semibold"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Classification Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.selfHosted && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-900 text-cosmic-cyan border border-cosmic-cyan/30">
                      Self-Hostable
                    </span>
                  )}
                  {item.freeHostedTier && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-900 text-cosmic-emerald border border-cosmic-emerald/30">
                      Free Cloud Tier
                    </span>
                  )}
                  {item.paidInfrastructureRequired && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-900 text-text-muted border border-border-subtle">
                      VPS Required
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border-subtle flex items-center justify-between mt-auto">
                <a
                  href={`/alternatives/${item.id}`}
                  className="text-xs font-mono text-cosmic-cyan hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Explore Alternatives</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href={`/compare/${item.id}`}
                  className="text-[11px] font-mono text-text-muted hover:text-text-primary px-2 py-1 rounded bg-space-850 hover:bg-space-800 transition-colors"
                >
                  Full Matrix &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="cosmic-glass p-12 text-center max-w-xl mx-auto my-12 border-dashed border-border-hover">
          <div className="w-12 h-12 rounded-full bg-space-900 border border-border-hover flex items-center justify-center mx-auto mb-4 text-cosmic-amber">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-primary mb-2">No Matching Alternatives Found</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            We couldn't find a verified open-source replacement matching "{query}". All alternatives are peer-reviewed before inclusion.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                handleQueryChange('');
                handleCategoryChange('all');
                handleFilterChange('all');
              }}
              className="px-4 py-2 rounded-lg bg-space-850 hover:bg-space-800 text-text-primary text-xs font-mono transition-colors"
            >
              Reset Filters
            </button>
            <a
              href="/submit-tool"
              className="px-4 py-2 rounded-lg bg-cosmic-cyan/10 hover:bg-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/30 text-xs font-mono font-semibold transition-colors"
            >
              Suggest a Replacement
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
