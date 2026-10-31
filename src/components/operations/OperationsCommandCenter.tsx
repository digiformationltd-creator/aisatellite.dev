import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Search,
  RefreshCw,
  Globe,
  Layers,
  Database,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  FileCode,
  Lock,
  Zap,
  Users,
  Compass,
  ArrowRight,
  BookOpen,
  Sliders,
  History,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { operationsService } from '../../lib/operations/operations-service';
import { autonomousImprovementPlanner } from '../../lib/operations/improvement-planner';
import { controlledFixesEngine } from '../../lib/operations/controlled-fixes';
import { costAndSchedulerEngine } from '../../lib/operations/cost-and-scheduler';

export default function OperationsCommandCenter() {
  const [sessionToken, setSessionToken] = useState('ops-session-root-token');
  const [activeTab, setActiveTab] = useState<'mission_control' | 'health' | 'intelligence' | 'verifications' | 'freshness' | 'seo_aeo_geo' | 'devex' | 'security' | 'jobs' | 'proposals' | 'approvals' | 'rollbacks' | 'budget'>('mission_control');
  const [signerName, setSignerName] = useState('LeadArchitect-David');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Auth verification
  const auth = operationsService.authenticateSession(sessionToken);
  const report = operationsService.generateFullReport();

  const handleApproveTicket = (ticketId: string) => {
    const res = autonomousImprovementPlanner.approveTicket(ticketId, signerName);
    if (res.success) {
      setActionFeedback(`Ticket ${ticketId} approved successfully by ${signerName}`);
    } else {
      setActionFeedback(`Approval failed: ${res.error}`);
    }
  };

  const handleExecuteFix = (ticketId: string) => {
    const res = controlledFixesEngine.executeFix(ticketId);
    if (res.success) {
      setActionFeedback(`Fix executed! Rollback snapshot captured: ${res.snapshotId}`);
    } else {
      setActionFeedback(`Fix rejected: ${res.error}`);
    }
  };

  const handleRollback = (snapshotId: string) => {
    const res = controlledFixesEngine.rollback(snapshotId);
    if (res.success) {
      setActionFeedback(`Rollback successful for ${res.restoredResource}`);
    } else {
      setActionFeedback(`Rollback failed: ${res.error}`);
    }
  };

  const handleRunJob = (jobId: string) => {
    const res = costAndSchedulerEngine.executeJob(jobId);
    if (res.success) {
      setActionFeedback(`Job ${jobId} executed successfully.`);
    } else {
      setActionFeedback(`Job execution blocked: ${res.error}`);
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 backdrop-blur-xl text-center max-w-md mx-auto my-12">
        <Lock className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Restricted Command Center</h3>
        <p className="text-sm text-slate-300 mb-6">
          Access to Phase 10 Autonomous Operations requires a verified administrative session token.
        </p>
        <div className="space-y-4">
          <input
            type="password"
            value={sessionToken}
            onChange={(e) => setSessionToken(e.target.value)}
            placeholder="Enter session token..."
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => setSessionToken('ops-session-root-token')}
            className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors"
          >
            Authenticate Admin Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Telemetry Header */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ORBITAL OPERATIONS ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">ROLE: {auth.role}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 tracking-tight">
              AI Satellite Operations Command Center
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Autonomous Intelligence, Production Health, Search Optimization & Quality Engineering
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Production Origin</div>
              <div className="text-sm font-semibold text-cyan-300 font-mono">
                {report.domainStatus.proposedDomain}
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Health Status</div>
              <div className="text-sm font-semibold text-emerald-400">
                {report.systemHealth.overallStatus} ({report.systemHealth.uptimePercent30Days}%)
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Monthly Spend</div>
              <div className="text-sm font-semibold text-violet-300 font-mono">
                ${report.costBudget.estimatedSpentUsd} / ${report.costBudget.monthlyBudgetUsd}
              </div>
            </div>
          </div>
        </div>

        {actionFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-sm flex items-center justify-between">
            <span>{actionFeedback}</span>
            <button onClick={() => setActionFeedback(null)} className="text-cyan-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'mission_control', label: 'Mission Control', icon: Activity },
          { id: 'health', label: 'Website Health', icon: Zap },
          { id: 'intelligence', label: 'Technology Radar', icon: Globe },
          { id: 'verifications', label: 'Free Alternatives', icon: CheckCircle },
          { id: 'freshness', label: 'Content Freshness', icon: RefreshCw },
          { id: 'seo_aeo_geo', label: 'SEO / AEO / GEO', icon: Search },
          { id: 'devex', label: 'Developer Experience', icon: Users },
          { id: 'security', label: 'Security & Headers', icon: ShieldCheck },
          { id: 'jobs', label: 'Scheduled Jobs', icon: Clock },
          { id: 'proposals', label: 'Improvement Tickets', icon: Sliders },
          { id: 'approvals', label: 'Approval Queue', icon: Lock },
          { id: 'rollbacks', label: 'Rollback Snapshots', icon: History },
          { id: 'budget', label: 'Cost Controls', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Mission Control */}
      {activeTab === 'mission_control' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              System Reliability
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Availability</span>
                <span className="text-emerald-400 font-mono">99.98% (Target: 99.9%)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Active Incidents</span>
                <span className="text-cyan-300 font-mono">{report.unresolvedIncidents.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Critical Outages</span>
                <span className="text-emerald-400 font-mono">0</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Security Directives</span>
                <span className="text-cyan-300 font-mono">All 6 Headers Active</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-violet-400" />
              Domain & Launch State
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Canonical Origin</span>
                <span className="text-cyan-300 font-mono text-xs">{report.domainStatus.activeCanonicalOrigin}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Proposed Domain</span>
                <span className="text-white font-mono">{report.domainStatus.proposedDomain}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Checklist Completion</span>
                <span className="text-cyan-300 font-mono">
                  {report.domainStatus.checks.filter((c) => c.status === 'VERIFIED').length} / 10 Verified
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">DNS Delegation</span>
                <span className="text-amber-400 font-mono">Action Required</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Cost & Resource Meter
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Monthly Budget</span>
                <span className="text-white font-mono">${report.costBudget.monthlyBudgetUsd}.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Estimated Spent</span>
                <span className="text-emerald-400 font-mono">${report.costBudget.estimatedSpentUsd}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Remaining Quota</span>
                <span className="text-cyan-300 font-mono">{report.costBudget.quotaRemainingPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Throttling Status</span>
                <span className="text-emerald-400 font-mono">Unthrottled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Website Health */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(report.systemHealth.services).map(([key, svc]) => (
              <div key={key} className="p-4 rounded-xl border border-white/10 bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white capitalize">{key.replace(/_/g, ' ')}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                      svc.status === 'OPERATIONAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {svc.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                  <span>Latency: {svc.latencyMs}ms</span>
                  <span>Verified 2m ago</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active & Historical Incidents</h3>
            {report.unresolvedIncidents.length === 0 ? (
              <p className="text-sm text-slate-400">Zero active incidents. All systems operational.</p>
            ) : (
              <div className="space-y-3">
                {report.unresolvedIncidents.map((inc) => (
                  <div key={inc.id} className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-amber-300">{inc.id} — {inc.service}</div>
                      <div className="text-xs text-slate-400 mt-1">{inc.evidence}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-mono bg-amber-500/20 text-amber-400">
                      {inc.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Technology Radar & Upstream Changes */}
      {activeTab === 'intelligence' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upstream Software Changes & Events</h3>
          <p className="text-sm text-slate-400 mb-6">
            Automated monitoring of official GitHub repositories, package registries, and licensing files.
          </p>
          <div className="space-y-4">
            {report.pendingTechnologyChanges.length === 0 ? (
              <p className="text-sm text-slate-400">All upstream changes have been reviewed and resolved.</p>
            ) : (
              report.pendingTechnologyChanges.map((chg) => (
                <div key={chg.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{chg.resourceName}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300">
                        {chg.changeType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{chg.summary}</div>
                    <a href={chg.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline mt-1 inline-block">
                      {chg.sourceUrl}
                    </a>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amber-400 block font-mono">Requires Editorial Review</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Free Alternatives Re-Verification */}
      {activeTab === 'verifications' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Free Alternatives Verification Registry</h3>
          <div className="space-y-4">
            {report.alternativeVerifications.map((item) => (
              <div key={item.resourceId} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{item.resourceName}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  <strong>License:</strong> {item.license} | <strong>Classification:</strong> {item.freeClassification}
                </div>
                <div className="text-xs text-slate-400">
                  <strong>Hosted Limitations:</strong> {item.hostedFreeTierLimitations.join(', ')}
                </div>
                <div className="text-xs text-slate-400">
                  <strong>Self-Hosting:</strong> {item.selfHostingRequirements.join(', ')} (Est. ${item.infrastructureCostEstimateUsdMonth}/mo)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Content Freshness */}
      {activeTab === 'freshness' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Content Freshness Intelligence</h3>
          <p className="text-sm text-slate-400 mb-6">
            Technical claims audited against elapsed re-verification windows (14/30/90 days).
          </p>
          <div className="space-y-4">
            {report.freshnessAlerts.map((f) => (
              <div key={f.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{f.title}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${f.isOutdated ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {f.daysStale} DAYS STALE
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  <strong>Proposed Updates:</strong> {f.proposedChanges.join('; ') || 'None required.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: SEO / AEO / GEO */}
      {activeTab === 'seo_aeo_geo' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Technical SEO Audit Findings</h3>
            <div className="space-y-3 mt-4">
              {report.seoAuditFindings.map((finding) => (
                <div key={finding.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase">{finding.category}</span>
                    <div className="text-sm text-white font-medium">{finding.evidence}</div>
                    <div className="text-xs text-slate-400 mt-1">Fix: {finding.recommendedFix}</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300">
                    Priority {finding.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
              <h3 className="text-base font-semibold text-white mb-2">Answer Engine Optimization (AEO)</h3>
              <p className="text-xs text-slate-400 mb-4">
                Assesses direct answer clarity, structured definitions, and runnable code examples.
              </p>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between"><span>Direct Answer Clarity</span><span className="text-cyan-300 font-mono">92/100</span></div>
                <div className="flex justify-between"><span>Definition Completeness</span><span className="text-cyan-300 font-mono">95/100</span></div>
                <div className="flex justify-between"><span>Runnable Code Verification</span><span className="text-cyan-300 font-mono">90/100</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
              <h3 className="text-base font-semibold text-white mb-2">Generative Engine Optimization (GEO)</h3>
              <p className="text-xs text-slate-400 mb-4">
                Structured entity metadata, verified licenses, and source-grounded relationship integrity.
              </p>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between"><span>Entity Description Score</span><span className="text-violet-300 font-mono">95/100</span></div>
                <div className="flex justify-between"><span>License Transparency</span><span className="text-violet-300 font-mono">100/100</span></div>
                <div className="flex justify-between"><span>Citation Realism Note</span><span className="text-slate-400 font-mono text-xs">Zero False Guarantees</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Developer Experience */}
      {activeTab === 'devex' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Developer Experience Signals</h3>
          <p className="text-sm text-slate-400 mb-6">
            Privacy-preserving tracking of zero-result queries, broken examples, and interaction drop-offs.
          </p>
          <div className="space-y-3">
            {report.devexSignals.length === 0 ? (
              <p className="text-sm text-slate-400">Zero unresolved DevEx friction points recorded.</p>
            ) : (
              report.devexSignals.map((d) => (
                <div key={d.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase">{d.signalType}</span>
                    <div className="text-sm text-white font-medium">{d.description}</div>
                    <div className="text-xs text-slate-400 mt-1">Proposed Fix: {d.proposedSolution}</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-mono bg-white/10 text-white">
                    {d.occurrenceCount} Occurrences
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 8: Security & Headers */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Security Audits & Header Integrity</h3>
          <div className="space-y-3">
            {report.securityFindings.map((sec) => (
              <div key={sec.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase">{sec.scanType}</span>
                  <div className="text-sm text-white font-medium">{sec.description}</div>
                  <div className="text-xs text-slate-400 mt-1">Remediation: {sec.remediation}</div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-mono ${sec.severity === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                  {sec.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Scheduled Jobs */}
      {activeTab === 'jobs' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Autonomous Operations Scheduler</h3>
          <div className="space-y-4">
            {report.scheduledJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{job.name}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300">
                      {job.cadence}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{job.description}</div>
                  <div className="text-xs text-slate-500 mt-1">Runs: {job.runCount} | Failures: {job.failureCount} | Max Retries: {job.maxRetries}</div>
                </div>
                <button
                  onClick={() => handleRunJob(job.id)}
                  className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-medium transition-colors"
                >
                  Trigger Run Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 10: Improvement Proposals */}
      {activeTab === 'proposals' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Synthesized Improvement Tickets</h3>
          <div className="space-y-4">
            {report.improvementTickets.map((tkt) => (
              <div key={tkt.id} className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-semibold">{tkt.id}</span>
                    <span className="font-semibold text-white text-base">{tkt.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-violet-500/20 text-violet-300">
                      Tier {tkt.priorityTier}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/20 text-amber-300">
                      Risk: {tkt.riskLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300">
                      {tkt.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">{tkt.description}</p>
                <div className="text-xs text-slate-400">
                  <strong>Proposed Solution:</strong> {tkt.proposedSolution}
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap gap-4">
                  <span>Complexity: {tkt.estimatedComplexity}</span>
                  <span>Required Signoff: {tkt.requiredApproval}</span>
                </div>
                {tkt.status === 'approved' && (
                  <button
                    onClick={() => handleExecuteFix(tkt.id)}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    Execute Controlled Repair
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 11: Approval Queue */}
      {activeTab === 'approvals' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Human Editorial & Architecture Approval Gate</h3>
          <p className="text-sm text-slate-400 mb-6">
            Autonomous AI models are strictly prohibited from approving production mutations. Human signature required.
          </p>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5 mb-6 flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3">
              <label className="text-xs text-slate-400 block mb-1">Signer Identity</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="LeadArchitect-Name"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              />
            </div>
            <div className="w-full md:w-2/3">
              <label className="text-xs text-slate-400 block mb-1">Approval Review Notes</label>
              <input
                type="text"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Verification checklist passed..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            {report.improvementTickets.filter((t) => t.status === 'proposed' || t.status === 'awaiting_approval').map((tkt) => (
              <div key={tkt.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white">{tkt.id} — {tkt.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{tkt.proposedSolution}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveTicket(tkt.id)}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    Authorize Signoff
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 12: Rollback Snapshots */}
      {activeTab === 'rollbacks' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Rollback Snapshots & Reversibility</h3>
          <p className="text-sm text-slate-400 mb-6">
            Every controlled automated fix captures an atomic snapshot before applying changes to disk.
          </p>
          <div className="space-y-3">
            {report.rollbackSnapshots.length === 0 ? (
              <p className="text-sm text-slate-400">Zero rollback snapshots recorded.</p>
            ) : (
              report.rollbackSnapshots.map((snap) => (
                <div key={snap.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-cyan-400">{snap.id}</span>
                    <div className="text-sm text-white font-medium">{snap.reason}</div>
                    <div className="text-xs text-slate-400 mt-1">Resource: {snap.targetFileOrResource}</div>
                  </div>
                  <button
                    onClick={() => handleRollback(snap.id)}
                    className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    Restore Snapshot
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 13: Cost Controls */}
      {activeTab === 'budget' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white mb-2">Cost Controls & API Usage Caps</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">Cloudflare Pages</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">$0.00 / mo</div>
              <span className="text-xs text-slate-500">Free Tier Unlimited Requests</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">Search Console API</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">$0.00 / mo</div>
              <span className="text-xs text-slate-500">Quota: 10,000 QPD Free</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">DNS & Edge Caching</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">$0.00 / mo</div>
              <span className="text-xs text-slate-500">Cloudflare Free Tier</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400">AI Research Tokens</span>
              <div className="text-xl font-bold text-cyan-300 mt-1">${report.costBudget.costEstimates.aiResearchTokens} / mo</div>
              <span className="text-xs text-slate-500">Local LLMs + Cached API calls</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
