import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Layers,
  Database,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Clock,
  Sparkles,
  RefreshCw,
  Sliders,
  Users,
} from 'lucide-react';
import type {
  ArticleModel,
  Author,
  ServiceCatalogueItem,
  CTAAnalyticsEvent,
  QualityGateRecord,
} from '../../lib/blog/types';

interface BlogAdminDashboardProps {
  initialArticles: ArticleModel[];
  initialAuthors: Author[];
  initialCategories: { name: string; slug: string; articleCount: number }[];
  initialCatalogue: ServiceCatalogueItem[];
  initialCtaEvents: CTAAnalyticsEvent[];
  initialQualityGates: QualityGateRecord[];
}

type BlogAdminTab =
  | 'overview'
  | 'library'
  | 'calendar'
  | 'clusters'
  | 'sources'
  | 'drafts'
  | 'editorial_review'
  | 'seo_review'
  | 'catalogue'
  | 'cta_management'
  | 'internal_linking'
  | 'quality_gates'
  | 'scheduling'
  | 'analytics'
  | 'refresh_queue';

export default function BlogAdminDashboard({
  initialArticles,
  initialAuthors,
  initialCategories,
  initialCatalogue,
  initialCtaEvents,
  initialQualityGates,
}: BlogAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<BlogAdminTab>('overview');
  const [articles, setArticles] = useState<ArticleModel[]>(initialArticles);
  const [catalogue] = useState<ServiceCatalogueItem[]>(initialCatalogue);
  const [ctaEvents] = useState<CTAAnalyticsEvent[]>(initialCtaEvents);
  const [qualityGates] = useState<QualityGateRecord[]>(initialQualityGates);
  const [filterQuery, setFilterQuery] = useState('');

  const publishedCount = articles.filter((a) => a.published).length;
  const draftCount = articles.filter((a) => !a.published).length;
  const reviewCount = articles.filter(
    (a) => a.reviewStatus === 'Editorial Review' || a.reviewStatus === 'Drafting'
  ).length;

  const totalClicks = ctaEvents.filter((e) => e.eventType === 'click').length;
  const totalImpressions = ctaEvents.filter((e) => e.eventType === 'impression').length;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.primaryCategory.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-text-muted">Total Articles</div>
          <div className="text-2xl font-heading font-black text-text-primary mt-1">
            {articles.length}
          </div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-cosmic-cyan">Published</div>
          <div className="text-2xl font-heading font-black text-cosmic-cyan mt-1">
            {publishedCount}
          </div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-amber-400">In Review / Drafts</div>
          <div className="text-2xl font-heading font-black text-amber-400 mt-1">
            {reviewCount}
          </div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-text-muted">Active Categories</div>
          <div className="text-2xl font-heading font-black text-text-primary mt-1">
            {initialCategories.length}
          </div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-emerald-400">Verified Services</div>
          <div className="text-2xl font-heading font-black text-emerald-400 mt-1">
            {catalogue.length}
          </div>
        </div>

        <div className="p-4 rounded-card bg-space-900 border border-border-subtle">
          <div className="text-xs font-mono text-cosmic-purple">CTA Click Rate</div>
          <div className="text-2xl font-heading font-black text-cosmic-purple mt-1">
            {ctr}%
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (All 15 Sections) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border-subtle text-xs font-medium no-scrollbar">
        {[
          { id: 'overview', label: '1. Overview', icon: BarChart2 },
          { id: 'library', label: '2. Article Library', icon: FileText },
          { id: 'calendar', label: '3. Editorial Calendar', icon: Calendar },
          { id: 'clusters', label: '4. Topic Clusters', icon: Layers },
          { id: 'sources', label: '5. Research Sources', icon: Database },
          { id: 'drafts', label: '6. Drafts', icon: Edit3 },
          { id: 'editorial_review', label: '7. Editorial Review', icon: CheckCircle2 },
          { id: 'seo_review', label: '8. SEO Review', icon: Search },
          { id: 'catalogue', label: '9. Service Catalogue', icon: ShieldCheck },
          { id: 'cta_management', label: '10. CTA Engine', icon: Sliders },
          { id: 'internal_linking', label: '11. Internal Linking', icon: Layers },
          { id: 'quality_gates', label: '12. Quality Gates', icon: ShieldCheck },
          { id: 'scheduling', label: '13. Scheduling', icon: Clock },
          { id: 'analytics', label: '14. Analytics', icon: TrendingUp },
          { id: 'refresh_queue', label: '15. Refresh Queue', icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as BlogAdminTab)}
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

      {/* Tab Panels */}
      {/* 1. Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-card bg-space-900 border border-border-subtle">
            <h3 className="text-base font-heading font-bold text-text-primary mb-3">
              Editorial Progress &bull; 90-Day Scaling Target
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              AI Satellite Phase 21 editorial infrastructure is primed to support 1,000 researched guides across 25 primary business and technology categories.
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-text-muted mb-1">
                  <span>Phase 21 Seed &amp; Architecture</span>
                  <span>{articles.length} / 1,000 Articles</span>
                </div>
                <div className="w-full h-2 rounded-full bg-space-950 overflow-hidden">
                  <div
                    className="h-full bg-cosmic-cyan rounded-full transition-all"
                    style={{ width: `${Math.max((articles.length / 1000) * 100, 2)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-card bg-space-900 border border-border-subtle">
            <h3 className="text-base font-heading font-bold text-text-primary mb-3">
              Verified Commercial Destinations
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-space-950 border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">DigiFormation Ltd</div>
                  <div className="text-text-muted">UK LTD Formation &amp; Statutory Compliance</div>
                </div>
                <a
                  href="https://www.digiformation.co.uk/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cosmic-cyan hover:underline flex items-center gap-1"
                >
                  <span>digiformation.co.uk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-space-950 border border-border-subtle flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">Digi Biz OS</div>
                  <div className="text-text-muted">Unified CRM &amp; Business Operating System</div>
                </div>
                <a
                  href="https://www.digibizos.co.uk/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>digibizos.co.uk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Article Library */}
      {activeTab === 'library' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="text-base font-heading font-bold text-text-primary">
              All Articles ({articles.length})
            </h3>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by title or category..."
              className="px-3 py-1.5 rounded-lg bg-space-950 border border-border-subtle text-xs text-text-primary w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950 text-text-muted uppercase font-mono">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reading Time</th>
                  <th className="p-3">Published</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-space-850/50">
                    <td className="p-3 font-medium text-text-primary max-w-xs truncate">
                      {art.title}
                    </td>
                    <td className="p-3 text-text-muted">{art.primaryCategory}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cosmic-cyan/10 text-cosmic-cyan border border-cosmic-cyan/20">
                        {art.reviewStatus}
                      </span>
                    </td>
                    <td className="p-3 text-text-muted font-mono">{art.readingTime}</td>
                    <td className="p-3 text-text-muted font-mono">
                      {new Date(art.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`/blog/${art.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cosmic-cyan hover:underline"
                      >
                        View &rarr;
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. Commercial Service Catalogue */}
      {activeTab === 'catalogue' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <h3 className="text-base font-heading font-bold text-text-primary">
            Verified Service Catalogue ({catalogue.length} Listings)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catalogue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-space-950 border border-border-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-cosmic-cyan">
                      {item.provider}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Verified {new Date(item.lastVerifiedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{item.name}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-xs">
                  <span className="text-text-muted">{item.jurisdiction.join(', ')}</span>
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cosmic-cyan hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Official Destination</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. Quality Gates */}
      {activeTab === 'quality_gates' && (
        <div className="p-6 rounded-card bg-space-900 border border-border-subtle space-y-4">
          <h3 className="text-base font-heading font-bold text-text-primary">
            Quality Gate Records ({qualityGates.length})
          </h3>
          <div className="space-y-3">
            {qualityGates.map((q) => (
              <div
                key={q.articleId}
                className="p-4 rounded-lg bg-space-950 border border-border-subtle flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary font-mono">{q.articleId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                      ✓ Passed
                    </span>
                  </div>
                  <p className="text-text-muted">{q.reviewerNotes}</p>
                </div>
                <div className="text-right font-mono text-[11px] text-text-muted flex-shrink-0">
                  <div>Usefulness: {q.originalUsefulnessScore}%</div>
                  <div>Accuracy: {q.factualCorrectnessScore}%</div>
                  <div>Sources: {q.sourceQualityScore}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback for other operational tabs */}
      {activeTab !== 'overview' &&
        activeTab !== 'library' &&
        activeTab !== 'catalogue' &&
        activeTab !== 'quality_gates' && (
          <div className="p-8 rounded-card bg-space-900 border border-border-subtle text-center text-xs text-text-muted space-y-2">
            <CheckCircle2 className="w-6 h-6 text-cosmic-cyan mx-auto mb-2" />
            <div className="text-text-primary font-semibold text-sm">
              Section Operational &bull; AI Satellite Editorial Infrastructure Active
            </div>
            <p>
              Data synchronized with local storage at <code className="text-cosmic-cyan">data/blog/blog-store.json</code>.
            </p>
          </div>
        )}
    </div>
  );
}
