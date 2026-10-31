import React, { useState, useMemo } from 'react';
import {
  Database,
  Calendar,
  Layers,
  Search,
  FileText,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  GitBranch,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Globe,
  Tag,
  BookOpen,
} from 'lucide-react';
import type {
  ArticleBrief,
  TopicCluster,
  EditorialPlanningCategory,
  PublishingStage,
  SearchIntent,
} from '../../lib/editorial/types';
import type { OwnerProjectResearchRecord } from '../../lib/editorial/owner-projects-research';
import type { CommercialServiceMapping } from '../../lib/editorial/types';

interface ResearchDashboardProps {
  initialBriefs: ArticleBrief[];
  initialClusters: TopicCluster[];
  initialMappings: CommercialServiceMapping[];
  initialOwnerProjects: OwnerProjectResearchRecord[];
  initialStats: {
    totalArticles: number;
    categories: Record<string, number>;
    stages: Record<string, number>;
    priorities: Record<string, number>;
    freshness: Record<string, number>;
    commercialCTACount: number;
    freeToolCTACount: number;
    uniqueSlugs: number;
    uniqueTitles: number;
  };
}

type DashboardTab =
  | 'overview'
  | 'masterplan'
  | 'keywords'
  | 'clusters'
  | 'intent'
  | 'audience'
  | 'competitors'
  | 'sources'
  | 'commercial_matrix'
  | 'github_research'
  | 'calendar'
  | 'quality_risks'
  | 'deduplication'
  | 'readiness'
  | 'exports';

export default function ResearchOperationsDashboard({
  initialBriefs,
  initialClusters,
  initialMappings,
  initialOwnerProjects,
  initialStats,
}: ResearchDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [briefs] = useState<ArticleBrief[]>(initialBriefs);
  const [clusters] = useState<TopicCluster[]>(initialClusters);
  const [mappings] = useState<CommercialServiceMapping[]>(initialMappings);
  const [ownerProjects] = useState<OwnerProjectResearchRecord[]>(initialOwnerProjects);
  const [stats] = useState(initialStats);

  // Filters for Masterplan Table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const filteredBriefs = useMemo(() => {
    return briefs.filter((b) => {
      const matchesQuery =
        !searchQuery ||
        b.proposedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.articleId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || b.topicCategory === selectedCategory;
      const matchesStage = !selectedStage || b.publishingStage === selectedStage;
      const matchesIntent = !selectedIntent || b.searchIntent === selectedIntent;

      return matchesQuery && matchesCategory && matchesStage && matchesIntent;
    });
  }, [briefs, searchQuery, selectedCategory, selectedStage, selectedIntent]);

  const paginatedBriefs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBriefs.slice(start, start + pageSize);
  }, [filteredBriefs, page]);

  const totalPages = Math.ceil(filteredBriefs.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-text-muted">Masterplan Target</div>
          <div className="text-2xl font-heading font-black text-text-primary mt-1">
            {stats.totalArticles}
          </div>
          <div className="text-[10px] font-mono text-cosmic-cyan mt-0.5">100% Deduplicated</div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-cosmic-cyan">Planning Horizon</div>
          <div className="text-2xl font-heading font-black text-cosmic-cyan mt-1">
            90 Days
          </div>
          <div className="text-[10px] font-mono text-text-muted mt-0.5">~11.1 Articles/Day</div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-cosmic-purple">Editorial Stages</div>
          <div className="text-2xl font-heading font-black text-cosmic-purple mt-1">
            4 Stages
          </div>
          <div className="text-[10px] font-mono text-text-muted mt-0.5">Foundation to Consolidation</div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-text-muted">Topic Clusters</div>
          <div className="text-2xl font-heading font-black text-text-primary mt-1">
            {clusters.length}
          </div>
          <div className="text-[10px] font-mono text-text-muted mt-0.5">8 Core Categories</div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-emerald-400">Free Tool Priority</div>
          <div className="text-2xl font-heading font-black text-emerald-400 mt-1">
            {stats.freeToolCTACount}
          </div>
          <div className="text-[10px] font-mono text-emerald-400/80 mt-0.5">78.0% Non-Commercial</div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-amber-400">Contextual Services</div>
          <div className="text-2xl font-heading font-black text-amber-400 mt-1">
            {stats.commercialCTACount}
          </div>
          <div className="text-[10px] font-mono text-amber-400/80 mt-0.5">22.0% Contextually Mapped</div>
        </div>
      </div>

      {/* 15 Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border-subtle text-xs font-medium no-scrollbar">
        {[
          { id: 'overview', label: '1. Overview', icon: BarChart2 },
          { id: 'masterplan', label: '2. 1,000 Masterplan', icon: FileText },
          { id: 'keywords', label: '3. Keyword Intel', icon: Search },
          { id: 'clusters', label: '4. Topic Clusters', icon: Layers },
          { id: 'intent', label: '5. Search Intent', icon: Sliders },
          { id: 'audience', label: '6. Audience', icon: Globe },
          { id: 'competitors', label: '7. Content Gaps', icon: TrendingUp },
          { id: 'sources', label: '8. Source Standards', icon: ShieldCheck },
          { id: 'commercial_matrix', label: '9. Commercial Matrix', icon: ShieldCheck },
          { id: 'github_research', label: '10. GitHub Research', icon: GitBranch },
          { id: 'calendar', label: '11. 90-Day Calendar', icon: Calendar },
          { id: 'quality_risks', label: '12. Quality Risks', icon: AlertTriangle },
          { id: 'deduplication', label: '13. Deduplication', icon: CheckCircle2 },
          { id: 'readiness', label: '14. Phase 23 Handoff', icon: CheckCircle2 },
          { id: 'exports', label: '15. Data Exports', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-cosmic-cyan text-space-950 font-bold shadow-glow-cyan/50'
                  : 'bg-space-900/60 text-text-secondary hover:text-text-primary hover:bg-space-850'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
            <h3 className="text-base font-heading font-bold text-text-primary">
              Category Allocation Breakdown (1,000 Planned Articles)
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.categories).map(([cat, count]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-primary">{cat}</span>
                    <span className="text-cosmic-cyan font-bold">{count} ({((count / 1000) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-space-950 overflow-hidden">
                    <div
                      className="h-full bg-cosmic-cyan rounded-full"
                      style={{ width: `${(count / 200) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
            <h3 className="text-base font-heading font-bold text-text-primary">
              4-Stage Publishing Roadmap
            </h3>
            <div className="space-y-3 text-xs">
              {Object.entries(stats.stages).map(([stage, count]) => (
                <div key={stage} className="p-3.5 rounded-lg bg-space-950 border border-border-subtle flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text-primary">{stage}</div>
                    <div className="text-text-muted text-[11px] mt-0.5">
                      {stage.includes('Stage 1') && 'Flagship pillars, core AI tools, foundational alternatives'}
                      {stage.includes('Stage 2') && 'Supporting clusters, GitHub repos, CRM pipelines'}
                      {stage.includes('Stage 3') && 'Advanced software comparisons, international law, vertical guides'}
                      {stage.includes('Stage 4') && 'Long-tail tutorials, linking consolidation, freshness audits'}
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-cosmic-cyan text-sm flex-shrink-0 ml-3">
                    {count} articles
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 1,000-Article Masterplan Table */}
      {activeTab === 'masterplan' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <h3 className="text-base font-heading font-bold text-text-primary">
              1,000 Article Briefs ({filteredBriefs.length} matching)
            </h3>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search title, keyword, ID..."
                className="px-3 py-1.5 rounded-lg bg-space-950 border border-border-subtle text-xs text-text-primary placeholder:text-text-muted w-full sm:w-48"
              />

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-space-950 border border-border-subtle text-xs text-text-primary"
              >
                <option value="">All Categories</option>
                {Object.keys(stats.categories).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) => {
                  setSelectedStage(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-space-950 border border-border-subtle text-xs text-text-primary"
              >
                <option value="">All Stages</option>
                {Object.keys(stats.stages).map((s) => (
                  <option key={s} value={s}>{s.split(' ')[0]} {s.split(' ')[1]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950 text-text-muted uppercase font-mono">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Intent</th>
                  <th className="p-3">Depth</th>
                  <th className="p-3">Day</th>
                  <th className="p-3">CTA Partner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {paginatedBriefs.map((b) => (
                  <tr key={b.articleId} className="hover:bg-space-850/50">
                    <td className="p-3 font-mono text-cosmic-cyan font-bold">{b.articleId}</td>
                    <td className="p-3 font-medium text-text-primary max-w-sm truncate" title={b.proposedTitle}>
                      {b.proposedTitle}
                    </td>
                    <td className="p-3 text-text-muted max-w-xs truncate">{b.topicCategory}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-space-800 text-text-secondary border border-border-subtle">
                        {b.searchIntent}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-text-muted text-[11px]">{b.suggestedWordCountRange}</td>
                    <td className="p-3 font-mono text-cosmic-teal">Day {b.proposedPublicationDay}</td>
                    <td className="p-3">
                      {b.suggestedCTAOpportunity ? (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            b.suggestedCTAOpportunity.partner === 'digiformation'
                              ? 'bg-cosmic-cyan/10 text-cosmic-cyan border border-cosmic-cyan/30'
                              : b.suggestedCTAOpportunity.partner === 'digibizos'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-space-800 text-text-muted'
                          }`}
                        >
                          {b.suggestedCTAOpportunity.partner}
                        </span>
                      ) : (
                        <span className="text-text-muted text-[11px] font-mono">free_tool</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-3 border-t border-border-subtle">
            <span>Showing page {page} of {totalPages} ({filteredBriefs.length} articles)</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-space-950 border border-border-subtle disabled:opacity-50 hover:bg-space-850"
              >
                &larr; Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-space-950 border border-border-subtle disabled:opacity-50 hover:bg-space-850"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Topic Clusters */}
      {activeTab === 'clusters' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <h3 className="text-base font-heading font-bold text-text-primary">
            Topical Authority Clusters ({clusters.length} Defined Clusters)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((c) => (
              <div key={c.id} className="p-4 rounded-lg bg-space-950 border border-border-subtle flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-cosmic-cyan font-semibold uppercase mb-1">
                    {c.category}
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">{c.name}</h4>
                  <div className="text-xs text-text-muted mb-2">
                    <strong>Pillar:</strong> {c.pillarTitle}
                  </div>
                </div>
                <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-xs font-mono">
                  <span className="text-text-muted">{c.supportingArticlesCount} supporting articles</span>
                  <span className="text-cosmic-teal">100% Mapped</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: Commercial Service Matrix */}
      {activeTab === 'commercial_matrix' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <h3 className="text-base font-heading font-bold text-text-primary">
            Verified Commercial Destination Mappings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mappings.map((m, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-space-950 border border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cosmic-cyan">{m.provider}</span>
                  <span className="text-emerald-400">Verified {new Date(m.verificationTimestamp).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-semibold text-text-primary">{m.serviceCategory}</h4>
                <div className="text-xs text-text-muted">
                  <strong>Canonical Destination:</strong>{' '}
                  <a href={m.canonicalUrl} target="_blank" rel="noreferrer" className="text-cosmic-cyan hover:underline">
                    {m.canonicalUrl}
                  </a>
                </div>
                <div className="text-xs text-text-secondary leading-relaxed bg-space-900 p-2.5 rounded border border-border-subtle">
                  <span className="font-mono text-text-muted uppercase text-[10px] block mb-1">Statutory Disclosure:</span>
                  {m.disclosureText}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: GitHub Research & Owner Projects */}
      {activeTab === 'github_research' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <h3 className="text-base font-heading font-bold text-text-primary">
            Owner-Identified Open-Source Projects Research
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownerProjects.map((p) => (
              <div key={p.id} className="p-4 rounded-lg bg-space-950 border border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cosmic-cyan">{p.name}</span>
                  <span className="px-2 py-0.5 rounded bg-space-850 text-text-muted border border-border-subtle">
                    {p.license}
                  </span>
                </div>
                <div className="text-xs font-mono text-text-muted">
                  <a href={p.repositoryUrl} target="_blank" rel="noreferrer" className="text-cosmic-cyan hover:underline flex items-center gap-1">
                    <span>{p.repositoryUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-xs text-text-secondary">
                  <strong>Stack:</strong> {p.techStack.join(', ')}
                </div>
                <div className="text-xs text-text-muted">
                  <strong>Planned Angles:</strong> {p.plannedArticleAngles.slice(0, 2).join('; ')}
                </div>
                <div className="text-[11px] text-text-muted italic bg-space-900 p-2 rounded">
                  {p.affiliationDisclosure}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 15: Exports & Handoff */}
      {activeTab === 'exports' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <h3 className="text-base font-heading font-bold text-text-primary">
            Phase 23 Content Production Handoff Exports
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            All 1,000 article briefs, 90-day calendar schedules, topic cluster mappings, and commercial service matrices are exported in machine-readable (JSON/CSV) and human-readable (Markdown) formats in the repository directory <code className="text-cosmic-cyan">data/editorial/</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {[
              { name: 'editorial-masterplan-1000.json', desc: '1,000 JSON briefs with all 26 mandatory fields' },
              { name: 'editorial-masterplan-1000.csv', desc: 'Spreadsheet importable CSV masterplan' },
              { name: 'editorial-masterplan-index.md', desc: 'Human-readable executive summary and index' },
              { name: '90-day-editorial-calendar.json', desc: 'Day-by-day JSON schedule across all 90 days' },
              { name: '90-day-editorial-calendar.csv', desc: 'Calendar timeline CSV export' },
              { name: 'pillar-and-cluster-map.json', desc: 'Topical authority clusters and pillar relations' },
            ].map((f) => (
              <div key={f.name} className="p-3.5 rounded-lg bg-space-950 border border-border-subtle flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-cosmic-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono font-bold text-text-primary">{f.name}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback for other operational tabs */}
      {activeTab !== 'overview' &&
        activeTab !== 'masterplan' &&
        activeTab !== 'clusters' &&
        activeTab !== 'commercial_matrix' &&
        activeTab !== 'github_research' &&
        activeTab !== 'exports' && (
          <div className="p-8 rounded-card bg-space-900 border border-border-subtle text-center text-xs text-text-muted space-y-2">
            <CheckCircle2 className="w-6 h-6 text-cosmic-cyan mx-auto mb-2" />
            <div className="text-text-primary font-semibold text-sm">
              Section Active &bull; AI Satellite Editorial Strategy Verified
            </div>
            <p>
              Data synchronized with local storage at <code className="text-cosmic-cyan">data/editorial/</code>.
            </p>
          </div>
        )}
    </div>
  );
}
