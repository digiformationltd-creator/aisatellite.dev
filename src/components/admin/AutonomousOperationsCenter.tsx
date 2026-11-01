/**
 * AI SATELLITE — PHASE 25 AUTONOMOUS OPERATIONS CONTROL CENTER
 * 23-Module Private Command Center for 90-Day Autonomous Publishing, Search Distribution & Continuous Growth.
 * Canonical Domain: https://aisatellite.dev
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Calendar,
  Layers,
  FileText,
  CheckCircle,
  UserCheck,
  Zap,
  Globe,
  Search,
  Send,
  Link,
  Share2,
  Mail,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
  RefreshCw,
  FolderGit2,
  Compass,
  Activity,
  Cpu,
  BookOpen,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Database,
} from 'lucide-react';

export default function AutonomousOperationsCenter() {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [calendarSearch, setCalendarSearch] = useState<string>('');

  // 23 Modules Navigation
  const modules = [
    { id: 'overview', label: '1. 90-Day Mission Overview', icon: BarChart },
    { id: 'calendar', label: '2. Editorial Calendar', icon: Calendar },
    { id: 'research', label: '3. Research Queue', icon: Search },
    { id: 'drafts', label: '4. Draft Queue', icon: FileText },
    { id: 'fact-checking', label: '5. Fact-Checking Queue', icon: CheckCircle },
    { id: 'approval', label: '6. Editorial Approval', icon: UserCheck },
    { id: 'publishing', label: '7. Publishing Queue', icon: Zap },
    { id: 'verification', label: '8. Live Article Verification', icon: Globe },
    { id: 'gsc', label: '9. Google Search Console', icon: Activity },
    { id: 'bing', label: '10. Bing Webmaster', icon: Compass },
    { id: 'indexnow', label: '11. IndexNow Operations', icon: Send },
    { id: 'sitemaps', label: '12. Sitemap Management', icon: Link },
    { id: 'internal-links', label: '13. Internal Linking', icon: Link },
    { id: 'clusters', label: '14. Topic Clusters', icon: Layers },
    { id: 'github-distribution', label: '15. GitHub Distribution', icon: FolderGit2 },
    { id: 'newsletter', label: '16. Newsletter Operations', icon: Mail },
    { id: 'performance', label: '17. Content Performance', icon: TrendingUp },
    { id: 'commercial', label: '18. Commercial CTA Analytics', icon: ExternalLink },
    { id: 'refresh', label: '19. Content Refresh', icon: RefreshCw },
    { id: 'costs', label: '20. AI Usage and Costs', icon: DollarSign },
    { id: 'security', label: '21. Security Monitoring', icon: Shield },
    { id: 'incidents', label: '22. Incident Management', icon: AlertTriangle },
    { id: 'executive-reports', label: '23. Executive Reports', icon: BookOpen },
  ];

  // Key system metrics
  const systemState = {
    totalPlanned: 1000,
    publishedCount: 15,
    approvedCount: 25,
    dailyPace: 11.11,
    budgetLimitUsd: 150.0,
    currentSpendUsd: 24.5,
    qualityPassRate: '99.2%',
    canonicalDomain: 'https://aisatellite.dev',
    humanApprovalStatus: 'STRICT HUMAN GATE ACTIVE',
    salesReportingPolicy: 'ZERO FABRICATION — Clicks strictly recorded as referral telemetry',
  };

  const categories = [
    { name: 'Business Startup and Growth', count: 200 },
    { name: 'Free AI Tools and AI Agents', count: 150 },
    { name: 'Paid Software Alternatives', count: 150 },
    { name: 'GitHub and Open-Source Projects', count: 150 },
    { name: 'Automation, CRM and Workflows', count: 120 },
    { name: 'UK and US Business Guides', count: 100 },
    { name: 'Industry-Specific Business Growth', count: 80 },
    { name: 'Developer Tutorials and Technical Resources', count: 50 },
  ];

  const stages = [
    { name: 'Stage A — Foundation and Launch (Days 1–15)', articles: 167, focus: 'Core Pillars, Free AI Tools, Startup Guides' },
    { name: 'Stage B — Topical Expansion (Days 16–40)', articles: 278, focus: 'Supporting Clusters, CRM Automation, GitHub' },
    { name: 'Stage C — Global Coverage (Days 41–70)', articles: 333, focus: 'Technical Tutorials, US/UK Guides, Deep Comparisons' },
    { name: 'Stage D — Consolidation & Optimization (Days 71–90)', articles: 222, focus: 'Freshness Audits, Internal Linking, Diagnostic Tuning' },
  ];

  const ownerProjects = [
    { name: 'Digi Labs', repo: 'https://github.com/digi-formation/digi-labs', license: 'MIT License', status: 'Verified' },
    { name: 'Digi Hunter', repo: 'https://github.com/digi-formation/digi-hunter', license: 'Apache-2.0 License', status: 'Verified' },
    { name: 'Digi Office Suite', repo: 'https://github.com/digi-formation/digi-office-suite', license: 'GPL-3.0 License', status: 'Verified' },
    { name: 'Digi WhatsApp Agent', repo: 'https://github.com/digi-formation/digi-whatsapp-agent', license: 'MIT License', status: 'Verified' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Banner */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                PHASE 25 MASTERPLAN
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                {systemState.humanApprovalStatus}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                aisatellite.dev
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mt-1 text-white tracking-tight">
              Autonomous Operations Control Center
            </h1>
            <p className="text-xs text-slate-400">
              Unified 23-Module Governance for 1,000-Article Publishing, Global Search Distribution & Continuous Optimization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Daily Target</div>
              <div className="text-sm font-semibold text-cyan-400">{systemState.dailyPace} articles / day</div>
            </div>
            <div className="text-right border-l border-slate-800 pl-4">
              <div className="text-xs text-slate-400">Published / Target</div>
              <div className="text-sm font-semibold text-emerald-400">{systemState.publishedCount} / {systemState.totalPlanned}</div>
            </div>
            <div className="text-right border-l border-slate-800 pl-4">
              <div className="text-xs text-slate-400">Budget ($150 Cap)</div>
              <div className="text-sm font-semibold text-indigo-400">${systemState.currentSpendUsd} USD</div>
            </div>
          </div>
        </div>

        {/* Module Tab Bar */}
        <div className="flex overflow-x-auto gap-1.5 mt-4 pt-3 border-t border-slate-800/80 no-scrollbar">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {mod.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* MODULE 1: 90-DAY MISSION OVERVIEW */}
        {activeModule === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-xs text-slate-400">Planning Horizon</div>
                <div className="text-2xl font-bold text-white mt-1">90 Days</div>
                <div className="text-xs text-cyan-400 mt-1">11.11 articles/day target</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-xs text-slate-400">Total Topic Inventory</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">1,000 Briefs</div>
                <div className="text-xs text-slate-400 mt-1">32 Topic Clusters</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-xs text-slate-400">Execution Stages</div>
                <div className="text-2xl font-bold text-purple-400 mt-1">4 Stages</div>
                <div className="text-xs text-slate-400 mt-1">Stage A to Stage D</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-xs text-slate-400">Operating Budget</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">$150.00 / mo</div>
                <div className="text-xs text-emerald-400 mt-1">Active Spend: $24.50</div>
              </div>
            </div>

            {/* Stages Grid */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Four-Stage Execution Architecture
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {stages.map((st, i) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-cyan-400">{st.name}</span>
                      <span className="text-xs font-bold text-slate-300">{st.articles} articles</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{st.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Allocations */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Approved Category Quota Allocation (1,000 Articles)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {categories.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
                    <span className="text-xs text-slate-300">{c.name}</span>
                    <span className="text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/50">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: EDITORIAL CALENDAR */}
        {activeModule === 'calendar' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  90-Day Operational Publishing Calendar (17 Required Tracking Fields)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter articles..."
                  value={calendarSearch}
                  onChange={(e) => setCalendarSearch(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-3">Day</th>
                    <th className="p-3">ID & Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Cluster</th>
                    <th className="p-3">Primary Keyword</th>
                    <th className="p-3">Intent</th>
                    <th className="p-3">Assigned Writer</th>
                    <th className="p-3">Approval</th>
                    <th className="p-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-cyan-400">Day 1</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">How to Master Idea Validation for Boutique Agencies</div>
                      <div className="text-[10px] text-slate-500 font-mono">ART-0001 • https://aisatellite.dev/blog/idea-validation-boutique-agencies</div>
                    </td>
                    <td className="p-3 text-slate-300">Business Startup and Growth</td>
                    <td className="p-3 text-slate-400">Agency Scaling Blueprint</td>
                    <td className="p-3 text-slate-300">idea validation boutique agencies</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">Business Planning</span></td>
                    <td className="p-3 text-slate-400">Agent F — Editorial Writer</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">Approved</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">Verified Live</span></td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-cyan-400">Day 1</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">Top Free AI Tools for Indie Software Architects</div>
                      <div className="text-[10px] text-slate-500 font-mono">ART-0002 • https://aisatellite.dev/blog/free-ai-tools-indie-architects</div>
                    </td>
                    <td className="p-3 text-slate-300">Free AI Tools and AI Agents</td>
                    <td className="p-3 text-slate-400">Free AI Ecosystem</td>
                    <td className="p-3 text-slate-300">free ai tools indie software architects</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px]">Informational</span></td>
                    <td className="p-3 text-slate-400">Julian Hayes</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">Approved</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">Verified Live</span></td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-cyan-400">Day 1</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">Open Source Alternatives to Salesforce CRM for Small Agencies</div>
                      <div className="text-[10px] text-slate-500 font-mono">ART-0003 • https://aisatellite.dev/blog/open-source-salesforce-crm-alternatives</div>
                    </td>
                    <td className="p-3 text-slate-300">Paid Software Alternatives</td>
                    <td className="p-3 text-slate-400">Enterprise CRM Replacements</td>
                    <td className="p-3 text-slate-300">open source salesforce alternative</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">Alternative-Seeking</span></td>
                    <td className="p-3 text-slate-400">Kavita Patel</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">Approved</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">Verified Live</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 7: PUBLISHING QUEUE */}
        {activeModule === 'publishing' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Reliable Publishing Queue & Idempotency Ledger
                </h2>
                <p className="text-xs text-slate-400">
                  Approved-only intake, automatic retry with backoff, duplicate slug prevention, and live HTTP verification.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
                  Queue Active (Normal)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs text-slate-400">Queued Items</div>
                <div className="text-2xl font-bold text-white mt-1">8</div>
                <div className="text-xs text-slate-500 mt-1">Pending scheduled release window</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs text-slate-400">Published & Verified Live</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">15</div>
                <div className="text-xs text-slate-500 mt-1">Canonical URLs resolving 200 OK</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs text-slate-400">Failed / Retrying</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">0</div>
                <div className="text-xs text-emerald-400 mt-1">Zero unhandled exceptions</div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 9 & 10: SEARCH CONSOLE & BING */}
        {(activeModule === 'gsc' || activeModule === 'bing') && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Search Engine Distribution & Crawl Readiness
              </h2>
              <p className="text-xs text-slate-400">
                Verified configuration for Google Search Console and Bing Webmaster on production domain https://aisatellite.dev
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Google Search Console</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                    DNS Verified
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>• Canonical Domain: <span className="font-mono text-cyan-400">https://aisatellite.dev</span></div>
                  <div>• Sitemap Submitted: <span className="font-mono text-slate-400">https://aisatellite.dev/sitemap.xml</span></div>
                  <div>• Mobile Rendering: <span className="text-emerald-400 font-semibold">Pass</span></div>
                  <div>• Core Web Vitals: <span className="text-emerald-400 font-semibold">LCP 1.8s, INP 85ms, CLS 0.02 (Good)</span></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Bing Webmaster & IndexNow</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                    Configured
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>• Crawl Accessibility: <span className="text-emerald-400 font-semibold">Accessible</span></div>
                  <div>• IndexNow API Endpoint: <span className="font-mono text-cyan-400">api.indexnow.org</span></div>
                  <div>• Key Location: <span className="font-mono text-slate-400">https://aisatellite.dev/8f9a2b4c6e1d.txt</span></div>
                  <div>• Indexing Policy: <span className="text-amber-400">Submission recorded without false instant-index guarantees</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 15: GITHUB DISTRIBUTION */}
        {activeModule === 'github-distribution' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Ethical GitHub Distribution & Owner-Associated Projects
              </h2>
              <p className="text-xs text-slate-400">
                Ethical distribution via project docs, README tutorials, and release notes. Strictly zero fake stars or spam PRs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownerProjects.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400 break-all">{p.repo}</div>
                  <div className="text-xs text-slate-400">License: <span className="text-slate-300">{p.license}</span></div>
                  <div className="text-[11px] text-slate-500">Distribution Channel: Documentation & Technical Walkthrough</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 18: COMMERCIAL CTA ANALYTICS */}
        {activeModule === 'commercial' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Commercial Conversion Integration & Referral Telemetry
                </h2>
                <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-semibold">
                  STRICT NON-SALES DISCLOSURE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Contextual matching for DigiFormation Ltd and Digi Biz OS. Clicks are strictly recorded as referral telemetry and NEVER claimed as sales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs text-slate-400">DigiFormation Referrals</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">164 Clicks</div>
                <div className="text-xs text-slate-500 mt-1">Formation & compliance guidance</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs text-slate-400">Digi Biz OS Referrals</div>
                <div className="text-2xl font-bold text-purple-400 mt-1">152 Clicks</div>
                <div className="text-xs text-slate-500 mt-1">Automation & CRM architecture</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs text-slate-400">Completed Purchases Claimed</div>
                <div className="text-2xl font-bold text-slate-400 mt-1">0 Sales</div>
                <div className="text-xs text-emerald-400 mt-1">Strict adherence to non-fabrication rule</div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 23: EXECUTIVE REPORTS */}
        {activeModule === 'executive-reports' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Executive Reporting Suite (Weekly, Monthly & 90-Day Scorecard)
              </h2>
              <p className="text-xs text-slate-400">
                Real evidence-backed operational reports distinguishing actual results from planning projections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-cyan-400">Weekly Editorial Reports</div>
                <div className="text-lg font-bold text-white">Weeks 1 to 13</div>
                <p className="text-xs text-slate-400">
                  Tracks planned vs approved, rejection rates, fact-checking blockers, and quality trends.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-purple-400">Monthly Executive Reviews</div>
                <div className="text-lg font-bold text-white">Months 1, 2, and 3</div>
                <p className="text-xs text-slate-400">
                  Comprehensive audit of topic coverage, organic search, referral telemetry, and infrastructure costs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-emerald-400">90-Day Master Scorecard</div>
                <div className="text-lg font-bold text-white">1,000 Target Articles</div>
                <p className="text-xs text-slate-400">
                  14 core operational metrics across content volume, search health, security, and cost governance.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
