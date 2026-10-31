import React, { useState } from 'react';
import {
  Radio,
  Cpu,
  Layers,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  GitBranch,
  Search,
  FileText,
  DollarSign,
  Lock,
  Compass,
} from 'lucide-react';
import {
  sourceRegistry,
  discoveryScheduler,
  gitHubIntelligenceEngine,
  aiToolsDiscoveryEngine,
  freeAlternativesEngine,
  changeDetectionEngine,
  evidenceLedgerEngine,
  technologyKnowledgeGraph,
  editorialPipeline,
  costAndSecurityManager,
  radarEngine,
} from '../../lib/discovery';

export default function DiscoveryCommandCenter() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'jobs' | 'alternatives' | 'changes' | 'evidence' | 'editorial'>('overview');
  const [proposals, setProposals] = useState(editorialPipeline.getProposals());
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const sources = sourceRegistry.getAllSources();
  const jobs = discoveryScheduler.getJobs();
  const ghRecords = gitHubIntelligenceEngine.getRecords();
  const aiTools = aiToolsDiscoveryEngine.getAiTools();
  const alternatives = freeAlternativesEngine.getFindings();
  const changes = changeDetectionEngine.getChanges();
  const evidence = evidenceLedgerEngine.getAllEvidence();
  const graphNodes = technologyKnowledgeGraph.getNodes();
  const graphEdges = technologyKnowledgeGraph.getEdges();
  const costStatus = costAndSecurityManager.getCostStatus();
  const radarEntries = radarEngine.getTelemetryEntries();

  const handleReview = (id: string, decision: 'approved' | 'rejected') => {
    editorialPipeline.reviewProposal(id, 'Console Administrator', decision, 'Reviewed via Discovery Command Center');
    setProposals([...editorialPipeline.getProposals()]);
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Top Banner / Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-cosmic-cyan text-xs font-mono">
            <Radio className="w-4 h-4" />
            <span>SOURCES</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{sources.length}</div>
          <div className="text-[11px] text-text-muted">Active & Approved</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono">
            <Activity className="w-4 h-4" />
            <span>JOBS</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{jobs.length}</div>
          <div className="text-[11px] text-text-muted">10 Categories Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
            <Cpu className="w-4 h-4" />
            <span>AI TOOLS</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{aiTools.length}</div>
          <div className="text-[11px] text-text-muted">Profiled & Verified</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
            <Compass className="w-4 h-4" />
            <span>ALTERNATIVES</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{alternatives.length}</div>
          <div className="text-[11px] text-text-muted">Free & Open Mapped</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono">
            <GitBranch className="w-4 h-4" />
            <span>KNOWLEDGE GRAPH</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">{graphNodes.length} / {graphEdges.length}</div>
          <div className="text-[11px] text-text-muted">Nodes / Directed Edges</div>
        </div>

        <div className="p-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
            <DollarSign className="w-4 h-4" />
            <span>BUDGET</span>
          </div>
          <div className="text-2xl font-bold text-cosmic-white">${costStatus.remainingUsd}</div>
          <div className="text-[11px] text-text-muted">Daily Limit: ${costStatus.limitUsd}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'overview', label: 'System Overview' },
          { id: 'sources', label: `Sources (${sources.length})` },
          { id: 'jobs', label: `Jobs (${jobs.length})` },
          { id: 'alternatives', label: `Alternatives (${alternatives.length})` },
          { id: 'changes', label: `Changes (${changes.length})` },
          { id: 'evidence', label: `Evidence Ledger (${evidence.length})` },
          { id: 'editorial', label: `Editorial Proposals (${proposals.length})` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === t.id
                ? 'bg-cosmic-cyan text-space-950 font-bold shadow-sm'
                : 'bg-space-900/60 text-text-muted hover:text-cosmic-white hover:bg-space-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security & SSRF Defense Status */}
          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-cosmic-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Security & Cost Defense Controls</span>
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">SSRF Private Network Protection:</span>
                <span className="text-emerald-400 font-bold">Active (RFC1918 Blocked)</span>
              </div>
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">Cloud Metadata Shield (169.254.169.254):</span>
                <span className="text-emerald-400 font-bold">Enforced</span>
              </div>
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">Prompt Injection Filter:</span>
                <span className="text-emerald-400 font-bold">Boundary Stripping Active</span>
              </div>
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">Evidence Excerpt Bounds:</span>
                <span className="text-cosmic-cyan font-bold">&le; 500 Chars (Copyright Protected)</span>
              </div>
            </div>
          </div>

          {/* Radar Telemetry Live Summary */}
          <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-cosmic-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cosmic-cyan" />
              <span>Active Radar Telemetry Beacons</span>
            </h3>
            <div className="space-y-2">
              {radarEntries.map((re) => (
                <div key={re.id} className="p-3 rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-cosmic-white font-bold">{re.name}</span>
                    <span className="text-text-muted ml-2">({re.license})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/20 uppercase">
                    {re.coordinates.quadrant}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-text-muted uppercase">
              <tr>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Source URL</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-space-800/40">
                  <td className="py-3 px-4 font-bold text-cosmic-white">{s.organization}</td>
                  <td className="py-3 px-4 text-text-muted max-w-xs truncate">{s.sourceUrl}</td>
                  <td className="py-3 px-4 text-cosmic-cyan">{s.sourceType}</td>
                  <td className="py-3 px-4 text-emerald-400 capitalize">{s.verificationLevel}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-text-muted uppercase">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Timeout</th>
                <th className="py-3 px-4">Retries</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-space-800/40">
                  <td className="py-3 px-4 font-bold text-cosmic-white">{j.category}</td>
                  <td className="py-3 px-4 text-text-muted">{j.scheduleCron}</td>
                  <td className="py-3 px-4 text-text-secondary">{j.timeoutMs}ms</td>
                  <td className="py-3 px-4 text-text-secondary">{j.currentRetries} / {j.retryLimit}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 capitalize">
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'alternatives' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-text-muted uppercase">
              <tr>
                <th className="py-3 px-4">Target Paid Tool</th>
                <th className="py-3 px-4">Verified Alternative</th>
                <th className="py-3 px-4">License</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Infrastructure Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alternatives.map((a) => (
                <tr key={a.id} className="hover:bg-space-800/40">
                  <td className="py-3 px-4 font-bold text-amber-300">{a.paidToolName}</td>
                  <td className="py-3 px-4 text-cosmic-white font-bold">{a.alternativeName}</td>
                  <td className="py-3 px-4 text-text-muted">{a.license}</td>
                  <td className="py-3 px-4 text-cosmic-cyan">{a.classification.replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4 text-text-secondary">{a.infrastructureCostEstimated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'changes' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          {changes.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-space-950/60 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cosmic-white text-sm">{c.resourceName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 capitalize">
                  {c.changeType.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-text-muted">
                <div>Previous: <span className="text-red-400">{c.previousValue}</span></div>
                <div>New: <span className="text-emerald-400">{c.newValue}</span></div>
              </div>
              <div className="text-text-secondary">Proposed Action: {c.proposedAction}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          {evidence.map((ev) => (
            <div key={ev.id} className="p-4 rounded-2xl bg-space-950/60 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cosmic-cyan">{ev.sourceTitle}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">
                  {ev.confidence} confidence
                </span>
              </div>
              <div className="text-text-muted">Claim Supported: {ev.claimSupported}</div>
              <blockquote className="p-3 rounded-xl bg-space-900/80 border-l-2 border-cosmic-cyan text-text-secondary italic">
                "{ev.relevantExcerpt}"
              </blockquote>
              <div className="text-[11px] text-text-muted">Source URL: {ev.sourceUrl}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'editorial' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          {proposals.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-space-950/60 border border-white/5 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cosmic-white text-sm">{p.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] capitalize ${
                  p.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {p.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-text-secondary">{p.uniqueValue}</div>
              <div className="text-text-muted">Target Audience: {p.targetAudience} | Search Intent: {p.searchIntent}</div>

              {p.status === 'pending_review' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleReview(p.id, 'approved')}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 text-space-950 font-bold hover:brightness-110 transition-all"
                  >
                    Approve for Publication
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview(p.id, 'rejected')}
                    className="px-4 py-1.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
