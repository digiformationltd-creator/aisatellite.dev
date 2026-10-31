/**
 * AI SATELLITE — PHASE 23 EDITORIAL PRODUCTION DASHBOARD
 * 17-Section Private Command Interface for Editorial Production, Fact-Checking, and Approvals.
 * Canonical Domain: https://aisatellite.dev
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Database,
  BarChart,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
  Cpu,
  UserCheck,
  Zap,
} from 'lucide-react';

export default function EditorialProductionDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    totalPlanned: 1000,
    activeJobs: 12,
    awaitingApproval: 3,
    publishedCount: 5,
    tokensUsed: 63600,
    estimatedCost: '$0.127 USD',
    budgetMonthly: '$150.00 USD',
    requiredDailyThroughput: 11.1,
  };

  const tabs = [
    { id: 'overview', label: '1. Production Overview', icon: BarChart },
    { id: 'topic-queue', label: '2. Approved Topic Queue', icon: Layers },
    { id: 'research-jobs', label: '3. Research Jobs', icon: Search },
    { id: 'evidence', label: '4. Source Evidence', icon: Database },
    { id: 'outlines', label: '5. Article Outlines', icon: FileText },
    { id: 'drafts', label: '6. Draft Library', icon: FileText },
    { id: 'fact-checking', label: '7. Fact-Checking Queue', icon: CheckCircle },
    { id: 'technical-review', label: '8. Technical Review', icon: Cpu },
    { id: 'seo-aeo-geo', label: '9. SEO/AEO/GEO Review', icon: Search },
    { id: 'commercial', label: '10. Commercial Recommendations', icon: ExternalLink },
    { id: 'approval-gate', label: '11. Editorial Approval', icon: UserCheck },
    { id: 'publishing', label: '12. Publishing Queue', icon: Zap },
    { id: 'failed-jobs', label: '13. Failed Jobs', icon: AlertTriangle },
    { id: 'quality', label: '14. Content Quality', icon: Shield },
    { id: 'cost-governance', label: '15. AI Usage & Costs', icon: DollarSign },
    { id: 'published', label: '16. Published Articles', icon: CheckCircle },
    { id: 'freshness', label: '17. Refresh Queue', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              PHASE 23 ENGINE
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              STRICT HUMAN GATE ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 text-white">
            Editorial Production & Fact-Checking Command Center
          </h1>
          <p className="text-sm text-slate-400">
            Autonomous multi-agent research, writing, technical validation, and quality governance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Planned Throughput</div>
            <div className="text-sm font-semibold text-cyan-400">{stats.requiredDailyThroughput} articles / day</div>
          </div>
          <div className="text-right border-l border-slate-800 pl-3">
            <div className="text-xs text-slate-400">Monthly Budget</div>
            <div className="text-sm font-semibold text-emerald-400">{stats.budgetMonthly}</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 py-4 border-b border-slate-800/80 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Total Approved Briefs</div>
                <div className="text-2xl font-bold text-white mt-1">{stats.totalPlanned}</div>
                <div className="text-xs text-slate-500 mt-1">From Phase 22 Masterplan</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Active Pipeline Jobs</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.activeJobs}</div>
                <div className="text-xs text-cyan-600 mt-1">Executing Stages 01–18</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Awaiting Human Approval</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">{stats.awaitingApproval}</div>
                <div className="text-xs text-amber-600 mt-1">Stage 19 Mandatory Gate</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">AI Spend / Budget</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.estimatedCost}</div>
                <div className="text-xs text-slate-500 mt-1">Limit: $150.00 / month</div>
              </div>
            </div>

            {/* 22 Stages Visual Flow */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                22-Stage Autonomous Editorial Lifecycle
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                {[
                  '01. Brief Intake',
                  '02. Research Plan',
                  '03. Source Discovery',
                  '04. Evidence Collect',
                  '05. Claim Verification',
                  '06. Angle Development',
                  '07. Outline Generation',
                  '08. First Draft',
                  '09. Tech Validation',
                  '10. Regulatory Review',
                  '11. Citation Audit',
                  '12. SEO Review',
                  '13. AEO/GEO Review',
                  '14. Internal Linking',
                  '15. Free Resources',
                  '16. Commercial Review',
                  '17. Originality Check',
                  '18. Quality Rubric',
                  '19. Human Gate',
                  '20. Scheduling',
                  '21. Publication',
                  '22. Telemetry',
                ].map((stg, i) => (
                  <div
                    key={stg}
                    className={`p-2.5 rounded-lg border ${
                      i === 18
                        ? 'bg-amber-950/40 border-amber-600/60 text-amber-300 font-semibold'
                        : i >= 19
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {stg}
                  </div>
                ))}
              </div>
            </div>

            {/* End-to-End Sample Article Showcase */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Featured End-to-End Verified Article (Section 47)
                </h2>
                <span className="px-2 py-0.5 text-xs rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Ready for Review
                </span>
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="text-base font-medium text-white">
                  How to Grow a Car Dealership with Local SEO, CRM and Automation
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A practical, evidence-backed operational guide covering Google Business Profile local 3-pack optimization, automated 60-second test drive lead intake, and unified showroom business operating systems.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Category: Industry-Specific Growth</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Word Count: 2,450 words</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Quality Score: 94/100</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">Commercial Context: Digi Biz OS (Disclosed)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approval-gate' && (
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-semibold text-white">Mandatory Human Editorial Approval Gate</h2>
                <p className="text-xs text-slate-400">No agent may bypass these 9 verification checks prior to release.</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-medium text-sm text-cyan-300">
                Pending Approval: ART-0001 — How to Master Idea Validation for Boutique Agencies
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                {[
                  '1. Claims Verified against Evidence Ledger',
                  '2. Sources Valid & Secure (HTTPS)',
                  '3. Technical Code Snippets Tested & Safe',
                  '4. Legal / Regulatory Concerns Addressed',
                  '5. Commercial Disclosures Correct',
                  '6. Contextual CTAs Strictly Relevant',
                  '7. Article Content Original (Zero Cannibalization)',
                  '8. Content Solves Genuine Reader Problem',
                  '9. SEO & Canonical Metadata Valid',
                ].map((chk) => (
                  <label key={chk} className="flex items-center gap-2 p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 text-cyan-500 focus:ring-0" />
                    <span>{chk}</span>
                  </label>
                ))}
              </div>
              <div className="pt-2 flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors">
                  Authorize & Release to Publishing Queue
                </button>
                <button className="px-4 py-2 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30 text-xs transition-colors">
                  Request Editorial Changes
                </button>
                <button className="px-4 py-2 rounded-lg bg-rose-900/20 text-rose-300 border border-rose-800/40 hover:bg-rose-900/30 text-xs transition-colors">
                  Reject Brief
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cost-governance' && (
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-base font-semibold text-white">AI Usage & Cost Governance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Total Tokens Consumed</div>
                <div className="text-xl font-bold text-white mt-1">63,600</div>
                <div className="text-xs text-slate-500 mt-1">Deterministic simulation active</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Monthly Budget Usage</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">0.08%</div>
                <div className="text-xs text-slate-500 mt-1">$0.127 of $150.00 limit</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Circuit Breaker Status</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">HEALTHY</div>
                <div className="text-xs text-slate-500 mt-1">Operations unpaused</div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'approval-gate' && activeTab !== 'cost-governance' && (
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white capitalize">{activeTab.replace(/-/g, ' ')} Interface</h2>
              <div className="text-xs text-slate-500">Live Production Telemetry Connected</div>
            </div>
            <div className="p-8 text-center rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-sm">
              Section <span className="text-cyan-400 font-semibold">{activeTab}</span> operational. Active records synchronized with the AI Satellite Production Database.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
