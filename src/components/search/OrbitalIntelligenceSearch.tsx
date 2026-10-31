import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  ExternalLink,
  Shield,
  Server,
  Zap,
  BookOpen,
  Terminal,
  Tag,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { hybridSearchEngine, type ScoredSearchResult, type HybridSearchResponse } from '../../lib/search/hybrid-search';
import { groundedAnswerEngine } from '../../lib/search/grounded-answer-engine';
import { type GroundedAnswer } from '../../lib/radar/schemas';

const SUGGESTED_QUERIES = [
  'Find a free alternative to Zapier that I can self-host.',
  'Find a free alternative to Photoshop.',
  'Build an AI chatbot without paid APIs.',
  'Create a 3D website with Three.js.',
  'Find free AI coding assistants.',
  'Compare open-source databases.',
];

export default function OrbitalIntelligenceSearch() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'alternatives' | 'self_hosted' | 'ai'>('all');
  const [searchResponse, setSearchResponse] = useState<HybridSearchResponse | null>(null);
  const [groundedAnswer, setGroundedAnswer] = useState<GroundedAnswer | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (q: string) => {
    if (!q.trim()) {
      setSearchResponse(null);
      setGroundedAnswer(null);
      return;
    }

    setIsSearching(true);
    // Execute hybrid retrieval
    const filters: any = {};
    if (activeFilter === 'self_hosted') filters.selfHostedOnly = true;
    if (activeFilter === 'ai') filters.category = 'ai-models';

    const resp = hybridSearchEngine.search(q, filters);
    setSearchResponse(resp);

    // Generate grounded answer
    const answer = groundedAnswerEngine.generateAnswer(resp);
    setGroundedAnswer(answer);
    setIsSearching(false);
  };

  const onQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSelectSuggested = (sq: string) => {
    setQuery(sq);
    handleSearch(sq);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Floating Orbital Search Console */}
      <form onSubmit={onQuerySubmit} className="relative z-20">
        <div className="relative flex items-center p-2 rounded-2xl bg-space-950/80 backdrop-blur-2xl border border-cosmic-cyan/20 shadow-orbital-glass focus-within:border-cosmic-cyan/60 focus-within:shadow-orbital-glow transition-all duration-300">
          <div className="pl-4 pr-3 text-cosmic-cyan/80">
            <Search className="w-6 h-6 animate-pulse" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="What do you want to build, replace, automate or solve?"
            className="w-full py-3.5 bg-transparent text-cosmic-white placeholder:text-text-muted/70 text-base sm:text-lg focus:outline-none"
            aria-label="Intelligence Search Input"
          />

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cosmic-cyan to-cosmic-blue text-space-950 font-semibold text-sm hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <span>Scan Radar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggested Quick Queries */}
      {!searchResponse && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cosmic-cyan/70">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested Satellite Scans:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleSelectSuggested(sq)}
                className="px-3.5 py-1.5 text-xs rounded-full bg-space-900/60 hover:bg-cosmic-cyan/10 border border-white/5 hover:border-cosmic-cyan/30 text-text-secondary hover:text-cosmic-cyan transition-all text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Search & Grounded Response */}
      {searchResponse && (
        <div className="space-y-6 pt-2 animate-fade-in">
          {/* Query Telemetry Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-xl bg-space-900/40 border border-white/5 text-xs font-mono text-text-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>INTENT: <strong className="text-cosmic-cyan uppercase">{searchResponse.intentResult.intent.replace(/_/g, ' ')}</strong></span>
              <span>({Math.round(searchResponse.intentResult.confidence * 100)}% confidence)</span>
            </div>
            <div className="flex items-center gap-3">
              <span>SCAN LATENCY: {searchResponse.latencyMs}ms</span>
              <span>VERIFIED MATCHES: {searchResponse.totalMatches}</span>
            </div>
          </div>

          {/* Section: Grounded AI Answer */}
          {groundedAnswer && (
            <div className="p-6 rounded-2xl bg-space-900/70 backdrop-blur-xl border border-cosmic-cyan/30 shadow-orbital-glass space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cosmic-cyan" />
                  <h3 className="text-base font-bold text-cosmic-white tracking-wide">
                    Satellite Intelligence Synthesis
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cosmic-cyan/10 text-cosmic-cyan border border-cosmic-cyan/20">
                  Verified as of {groundedAnswer.lastVerifiedDate}
                </span>
              </div>

              <p className="text-sm sm:text-base text-cosmic-white/90 leading-relaxed">
                {groundedAnswer.directAnswer}
              </p>

              {/* Limitations & Hosting Cost Notice */}
              {groundedAnswer.freeAndPaidLimitations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-space-950/60 border border-amber-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Prerequisites & Infrastructure Transparency</span>
                  </div>
                  <ul className="list-disc list-inside text-text-muted space-y-0.5">
                    {groundedAnswer.freeAndPaidLimitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence References */}
              {groundedAnswer.evidenceReferences.length > 0 && (
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-text-muted font-mono">Evidence Sources:</span>
                  {groundedAnswer.evidenceReferences.map((ev, idx) => (
                    <a
                      key={idx}
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-space-950/80 hover:bg-cosmic-cyan/10 border border-white/10 hover:border-cosmic-cyan/30 text-cosmic-cyan transition-colors"
                    >
                      <span>{ev.domain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Best Verified Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <Shield className="w-4 h-4 text-cosmic-teal" />
                <span>Verified Radar Discoveries</span>
              </h4>
              <span className="text-xs text-text-muted font-mono">{searchResponse.results.length} results</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResponse.results.map(({ resource, score, isAlternativeMatch }) => (
                <div
                  key={resource.id}
                  className="p-5 rounded-2xl bg-space-900/60 backdrop-blur-lg border border-white/5 hover:border-cosmic-cyan/30 hover:shadow-orbital-glass transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-cosmic-white text-base hover:text-cosmic-cyan transition-colors">
                            {resource.title}
                          </h5>
                          {resource.selfHosted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cosmic-purple/15 text-cosmic-purple border border-cosmic-purple/20 flex items-center gap-1">
                              <Server className="w-2.5 h-2.5" />
                              Self-Hosted
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted font-mono mt-0.5">
                          License: {resource.license || 'Permissive'}
                        </p>
                      </div>

                      {resource.verificationStatus === 'verified' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-text-secondary line-clamp-2">
                      {resource.description}
                    </p>

                    {resource.replaces && resource.replaces.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-cosmic-cyan">
                        <Tag className="w-3 h-3" />
                        <span>Replaces: {resource.replaces.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {resource.categories.map((c) => (
                        <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-950 text-text-muted">
                          #{c}
                        </span>
                      ))}
                    </div>

                    {resource.officialUrl && (
                      <a
                        href={resource.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cosmic-cyan hover:underline font-mono"
                      >
                        <span>Official site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
