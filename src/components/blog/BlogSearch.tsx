import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, Calendar, ArrowRight, Tag } from 'lucide-react';
import type { ArticleModel } from '../../lib/blog/types';

interface BlogSearchProps {
  articles: ArticleModel[];
  categories: { name: string; slug: string; articleCount: number }[];
  initialQuery?: string;
  initialCategory?: string;
}

export default function BlogSearch({
  articles,
  categories,
  initialQuery = '',
  initialCategory = '',
}: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (selectedCategory) {
      result = result.filter(
        (a) =>
          a.primaryCategory.toLowerCase() === selectedCategory.toLowerCase() ||
          a.primaryCategory
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') === selectedCategory.toLowerCase()
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.primaryCategory.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          (a.quickAnswer && a.quickAnswer.toLowerCase().includes(q))
      );
    }

    return result;
  }, [articles, query, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search Input and Filters */}
      <div className="p-6 rounded-card bg-space-900 border border-border-subtle shadow-orbital-glass">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-cosmic-cyan pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, tools, tutorials, categories, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-space-950 border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-cyan"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-space-950 border border-border-subtle text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-cyan"
              aria-label="Filter by category"
            >
              <option value="">All Categories ({articles.length})</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.name}>
                  {cat.name} ({cat.articleCount})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count & Reset */}
        <div className="flex items-center justify-between text-xs font-mono text-text-muted mt-4 pt-3 border-t border-border-subtle/50">
          <span>
            Found {filteredArticles.length} matching {filteredArticles.length === 1 ? 'article' : 'articles'}
          </span>
          {(query || selectedCategory) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
              }}
              className="text-cosmic-cyan hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-card bg-space-900/50 border border-border-subtle">
          <Search className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-heading font-bold text-text-primary mb-1">
            No matching articles found
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-card bg-space-900/80 border border-border-subtle hover:border-cosmic-cyan/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-space-800 text-cosmic-cyan border border-cosmic-cyan/20">
                    {art.primaryCategory}
                  </span>
                  <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cosmic-cyan" />
                    {art.readingTime}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-base sm:text-lg text-text-primary group-hover:text-cosmic-cyan transition-colors mb-2 leading-snug">
                  <a href={`/blog/${art.slug}`}>{art.title}</a>
                </h4>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
                  {art.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border-subtle/50 flex items-center justify-between mt-auto">
                <span className="text-xs text-text-muted">
                  {typeof art.author === 'string' ? art.author : art.author.name}
                </span>
                <a
                  href={`/blog/${art.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cosmic-cyan hover:underline"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
