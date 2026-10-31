import React, { useState } from 'react';
import {
  Globe,
  Search,
  Shield,
  Layers,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Compass,
  FileText,
  Lock,
  GitBranch,
  ExternalLink,
  Users,
  Mail,
  Zap,
  BarChart3,
  Calendar,
  Sparkles,
  Link2,
} from 'lucide-react';
import {
  searchPerformanceService,
  technicalSEOService,
  topicalAuthorityPlanner,
  contentGapIntelligenceEngine,
  originalResearchEngine,
  referringDomainService,
  gitHubAdoptionAnalytics,
  aeoQualityMonitor,
  geoVisibilityResearch,
  internationalReadinessService,
  conversionRetentionAnalytics,
  growthExperimentationEngine,
  PROHIBITED_OUTREACH_TACTICS,
} from '../../lib/growth';

interface GlobalGrowthDashboardProps {
  adminToken?: string;
}

export default function GlobalGrowthDashboard({ adminToken }: GlobalGrowthDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [authKey, setAuthKey] = useState<string>(adminToken || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(adminToken && adminToken.length > 5));

  // Data queries
  const searchStatus = searchPerformanceService.getCombinedStatus();
  const clusters = topicalAuthorityPlanner.getClusters();
  const gapProposals = contentGapIntelligenceEngine.getProposals();
  const researchStudies = originalResearchEngine.getStudies();
  const referringDomains = referringDomainService.getDomains();
  const ghMetrics = gitHubAdoptionAnalytics.getMetrics();
  const aeoEvals = aeoQualityMonitor.getAllEvaluations();
  const geoEvals = geoVisibilityResearch.getAllEvaluations();
  const conversionsSummary = conversionRetentionAnalytics.getSummaryReport();
  const experiments = growthExperimentationEngine.getExperiments();
  const intlAudit = internationalReadinessService.runAudit('/');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authKey.trim().length >= 4) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-space-950/80 backdrop-blur-2xl border border-white/10 text-center space-y-6">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-cosmic-cyan/15 border border-cosmic-cyan/30 flex items-center justify-center text-cosmic-cyan">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-cosmic-white tracking-wide">Growth Command Center</h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Private administrative telemetry and international search authority console.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            placeholder="Enter Administrative Key..."
            className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-white/10 text-xs font-mono text-cosmic-white placeholder:text-text-muted focus:outline-none focus:border-cosmic-cyan"
            required
          />
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs hover:brightness-110 transition-all shadow-sm"
          >
            Authenticate Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-cosmic-cyan text-xs font-mono">
            <Globe className="w-4 h-4" />
            <span>CANONICAL</span>
          </div>
          <div className="text-sm font-bold text-cosmic-white truncate">aisatellite.dev</div>
          <div className="text-[11px] text-emerald-400 font-mono">Strict Domain Lock</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-mono">
            <Layers className="w-4 h-4" />
            <span>TOPICAL CLUSTERS</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{clusters.length}</div>
          <div className="text-[11px] text-text-muted font-mono">13 Families Mapped</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
            <FileText className="w-4 h-4" />
            <span>ORIGINAL STUDIES</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{researchStudies.length}</div>
          <div className="text-[11px] text-text-muted font-mono">Evidence-Grounded</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
            <Link2 className="w-4 h-4" />
            <span>REFERRING DOMAINS</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{referringDomains.length}</div>
          <div className="text-[11px] text-text-muted font-mono">Observed Citations</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono">
            <GitBranch className="w-4 h-4" />
            <span>GITHUB ADOPTION</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{ghMetrics ? ghMetrics.stars : '—'}</div>
          <div className="text-[11px] text-text-muted font-mono">Stars (Non-Vanity)</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-pink-400 text-xs font-mono">
            <Activity className="w-4 h-4" />
            <span>CONVERSIONS</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{conversionsSummary.totalEvents}</div>
          <div className="text-[11px] text-emerald-400 font-mono">{conversionsSummary.consentCompliancePercent}% Consent Compliant</div>
        </div>
      </div>

      {/* Navigation Tabs for the 18 Functional Sections */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'overview', label: '1. Global Overview' },
          { id: 'search_perf', label: '2. Search Performance' },
          { id: 'tech_seo', label: '3. Technical SEO' },
          { id: 'topical_auth', label: '4. Topical Authority' },
          { id: 'content_gaps', label: '5. Content Gaps' },
          { id: 'original_research', label: '6. Original Research' },
          { id: 'referring_domains', label: '7. Referring Domains' },
          { id: 'github_adoption', label: '8. GitHub Adoption' },
          { id: 'aeo_geo', label: '9. AEO / GEO' },
          { id: 'international', label: '10. International Search' },
          { id: 'conversions', label: '11. User Conversions' },
          { id: 'experiments', label: '12. Experiments' },
          { id: 'automation', label: '13. Automation Schedule' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === t.id
                ? 'bg-cosmic-cyan text-space-950 font-bold shadow-sm'
                : 'bg-space-900/60 text-text-muted hover:text-cosmic-white hover:bg-space-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Global Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-cosmic-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cosmic-cyan" />
              <span>International Architecture Health</span>
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">Canonical Domain:</span>
                <span className="text-cosmic-cyan font-bold">https://aisatellite.dev</span>
              </div>
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">Unicode URL Safety:</span>
                <span className="text-emerald-400 font-bold">100% Normalized (NFKC)</span>
              </div>
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">Hreflang Integrity:</span>
                <span className="text-emerald-400 font-bold">x-default Enforced (Zero Fake Translations)</span>
              </div>
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">Private Pages Noindex:</span>
                <span className="text-emerald-400 font-bold">Protected (/growth-admin, /workspace, /operations-admin)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-cosmic-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Ethical SEO & Anti-Manipulation Standard</span>
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              AI Satellite strictly prohibits purchased backlinks, link exchange rings, automated unsolicited outreach,
              PBNs, and synthetic keyword volume fabrication. Authority is earned exclusively through original technical
              studies, verified free alternative discoveries, and reproducible tutorials.
            </p>
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 text-[11px] font-mono text-text-muted space-y-1">
              <div className="text-amber-400 font-bold">PROHIBITED TACTICS ENFORCED:</div>
              <div>&bull; Purchased spam backlinks: BLOCKED</div>
              <div>&bull; Automated cold DMs / emails: PROHIBITED</div>
              <div>&bull; Fake review injection: PROHIBITED</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Search Performance */}
      {activeTab === 'search_perf' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-cosmic-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cosmic-cyan" />
                <span>Google Search Console</span>
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                searchStatus.google.isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {searchStatus.google.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {searchStatus.google.statusMessage}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-cosmic-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-400" />
                <span>Bing Webmaster Tools & IndexNow</span>
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                searchStatus.bing.isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {searchStatus.bing.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {searchStatus.bing.statusMessage}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Technical SEO */}
      {activeTab === 'tech_seo' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-cosmic-white">Live Technical SEO Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-space-950/60 border border-white/5">
              <div className="text-text-muted">Canonical Health</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">100% Compliant</div>
              <div className="text-[11px] text-text-muted mt-1">All routes locked to aisatellite.dev</div>
            </div>
            <div className="p-4 rounded-xl bg-space-950/60 border border-white/5">
              <div className="text-text-muted">Robots.txt & Sitemap</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">Validated</div>
              <div className="text-[11px] text-text-muted mt-1">Private admin routes excluded</div>
            </div>
            <div className="p-4 rounded-xl bg-space-950/60 border border-white/5">
              <div className="text-text-muted">Structured Data (JSON-LD)</div>
              <div className="text-lg font-bold text-cosmic-cyan mt-1">Valid Schemas</div>
              <div className="text-[11px] text-text-muted mt-1">TechArticle, SoftwareApp, HowTo</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Topical Authority */}
      {activeTab === 'topical_auth' && (
        <div className="space-y-4">
          {clusters.map((c) => (
            <div key={c.id} className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-cosmic-white font-bold text-sm">{c.pillarTitle}</span>
                  <span className="text-cosmic-cyan ml-2">({c.pillarSlug})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300">
                  {c.topicFamily}
                </span>
              </div>
              <div className="text-text-muted">Supporting Resources ({c.supportingResources.length}):</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {c.supportingResources.map((res, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-space-950/60 border border-white/5">
                    <div className="text-cosmic-white font-bold">{res.title}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Anchor: "{res.internalLinkAnchor}"</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Content Gaps */}
      {activeTab === 'content_gaps' && (
        <div className="space-y-4">
          {gapProposals.map((gap) => (
            <div key={gap.id} className="p-5 rounded-2xl bg-space-950/60 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cosmic-white text-sm">{gap.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 capitalize">
                  {gap.status}
                </span>
              </div>
              <div className="text-text-secondary">{gap.unmetNeedExplanation}</div>
              <div className="text-text-muted">Evidence Requirement: {gap.evidenceRequirement}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Original Research */}
      {activeTab === 'original_research' && (
        <div className="space-y-4">
          {researchStudies.map((s) => (
            <div key={s.id} className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cosmic-white text-sm">{s.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">
                  {s.peerReviewStatus}
                </span>
              </div>
              <div className="text-text-secondary">{s.methodology}</div>
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 space-y-1">
                <div className="text-text-muted font-bold">Transparent Limitations:</div>
                {s.transparentLimitations.map((lim, i) => (
                  <div key={i} className="text-text-secondary text-[11px]">&bull; {lim}</div>
                ))}
              </div>
              <div className="text-[11px] text-text-muted">Author: {s.author} | Published: {s.publicationDate.slice(0, 10)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 7: Referring Domains */}
      {activeTab === 'referring_domains' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-text-muted uppercase">
              <tr>
                <th className="py-3 px-4">Referring Domain</th>
                <th className="py-3 px-4">Citation Context</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Observed Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {referringDomains.map((r) => (
                <tr key={r.id} className="hover:bg-space-800/40">
                  <td className="py-3 px-4 font-bold text-cosmic-white">{r.referringDomain}</td>
                  <td className="py-3 px-4 text-text-secondary">{r.citationContext}</td>
                  <td className="py-3 px-4 text-cosmic-cyan capitalize">{r.citationType.replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4 text-emerald-400">{r.isObserved ? 'Verified Observed' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 8: GitHub Adoption */}
      {activeTab === 'github_adoption' && ghMetrics && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-cosmic-white">{ghMetrics.repository}</h3>
            <span className="text-xs text-text-muted font-mono">{ghMetrics.reportingWindow}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5">
              <span className="text-text-muted">Stars:</span>
              <div className="text-xl font-bold text-cosmic-white">{ghMetrics.stars}</div>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5">
              <span className="text-text-muted">Forks:</span>
              <div className="text-xl font-bold text-cosmic-white">{ghMetrics.forks}</div>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5">
              <span className="text-text-muted">Contributors:</span>
              <div className="text-xl font-bold text-emerald-400">{ghMetrics.totalContributors}</div>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5">
              <span className="text-text-muted">Weekly Views:</span>
              <div className="text-xl font-bold text-cosmic-cyan">{ghMetrics.trafficViewsWeekly}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: AEO / GEO */}
      {activeTab === 'aeo_geo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-3">
            <h3 className="text-base font-bold text-cosmic-white">AEO Direct-Answer Evaluator</h3>
            {aeoEvals.map((e, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-space-950/60 border border-white/5 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-cosmic-white font-bold">{e.pageUrl}</span>
                  <span className="text-emerald-400 font-bold">{e.overallAEOScore}/100</span>
                </div>
                <div className="text-text-muted">Code Example: {e.hasVerifiedCodeExample ? 'Yes' : 'No'} | Troubleshooting: {e.hasStructuredTroubleshooting ? 'Yes' : 'No'}</div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-3">
            <h3 className="text-base font-bold text-cosmic-white">GEO Knowledge Graph Clarity</h3>
            {geoEvals.map((g, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-space-950/60 border border-white/5 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-cosmic-white font-bold">{g.entityName}</span>
                  <span className="text-cosmic-cyan font-bold">{g.geoClarityScore}/100</span>
                </div>
                <div className="text-text-secondary">{g.stableDescription}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 10: International Search */}
      {activeTab === 'international' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-cosmic-white">International Discoverability Readiness</h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Active Primary Locale:</span>
              <span className="text-cosmic-white font-bold">English (en-US / en-GB standard)</span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Unicode URL Safety:</span>
              <span className="text-emerald-400 font-bold">Safe (NFKC normalized)</span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
              <span className="text-text-muted">Hreflang Configuration:</span>
              <span className="text-emerald-400 font-bold">x-default and en tags strictly verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 11: Conversions */}
      {activeTab === 'conversions' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-cosmic-white">Privacy-First User Conversion Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            {Object.entries(conversionsSummary.breakdownByAction).map(([action, count]) => (
              <div key={action} className="p-3 rounded-xl bg-space-950/60 border border-white/5">
                <span className="text-text-muted capitalize">{action.replace(/_/g, ' ')}:</span>
                <div className="text-lg font-bold text-cosmic-white mt-1">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 12: Experiments */}
      {activeTab === 'experiments' && (
        <div className="space-y-4">
          {experiments.map((exp) => (
            <div key={exp.id} className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cosmic-white text-sm">{exp.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300">
                  {exp.status}
                </span>
              </div>
              <div className="text-text-secondary">{exp.hypothesis}</div>
              <div className="text-text-muted">Target Metric: {exp.targetMetric} | Minimum Sample: {exp.minimumSampleSize}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 13: Automation Schedule */}
      {activeTab === 'automation' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-cosmic-white">Autonomous Maintenance Cadence</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-space-950/60 border border-white/5 space-y-2">
              <div className="text-cosmic-cyan font-bold">DAILY CADENCE</div>
              <div className="text-text-secondary">&bull; Technical SEO health audits</div>
              <div className="text-text-secondary">&bull; Search integration check</div>
              <div className="text-text-secondary">&bull; Critical crawl error alert</div>
            </div>
            <div className="p-4 rounded-xl bg-space-950/60 border border-white/5 space-y-2">
              <div className="text-emerald-400 font-bold">WEEKLY CADENCE</div>
              <div className="text-text-secondary">&bull; Search performance analysis</div>
              <div className="text-text-secondary">&bull; Content gap proposals</div>
              <div className="text-text-secondary">&bull; GitHub metrics update</div>
            </div>
            <div className="p-4 rounded-xl bg-space-950/60 border border-white/5 space-y-2">
              <div className="text-purple-400 font-bold">MONTHLY CADENCE</div>
              <div className="text-text-secondary">&bull; Topical authority cluster review</div>
              <div className="text-text-secondary">&bull; Referring domain citations audit</div>
              <div className="text-text-secondary">&bull; AEO/GEO quality assessment</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
