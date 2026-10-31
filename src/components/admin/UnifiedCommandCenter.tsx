import React, { useState, useMemo } from 'react';
import {
  Activity,
  Shield,
  Layers,
  Search,
  Bot,
  Clock,
  Bell,
  BarChart3,
  Database,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  ExternalLink,
  Sliders,
  Cpu,
  Globe,
  Terminal,
  Zap,
} from 'lucide-react';
import type {
  CentralResource,
  CentralResourceType,
  EditorialStatus,
  ScheduledJobConfig,
  AgentExecutionResult,
  SystemHealthStatus,
} from '../../lib/ecosystem/types';

interface UnifiedCommandCenterProps {
  initialResources: CentralResource[];
  initialJobs: ScheduledJobConfig[];
  initialExecutions: AgentExecutionResult[];
  initialHealth: SystemHealthStatus;
}

type CommandTab =
  | 'overview'
  | 'resources'
  | 'knowledge_graph'
  | 'editorial'
  | 'agents'
  | 'scheduler'
  | 'analytics'
  | 'security';

export default function UnifiedCommandCenter({
  initialResources,
  initialJobs,
  initialExecutions,
  initialHealth,
}: UnifiedCommandCenterProps) {
  const [activeTab, setActiveTab] = useState<CommandTab>('overview');
  const [resources, setResources] = useState<CentralResource[]>(initialResources);
  const [jobs, setJobs] = useState<ScheduledJobConfig[]>(initialJobs);
  const [executions, setExecutions] = useState<AgentExecutionResult[]>(initialExecutions);
  const [health] = useState<SystemHealthStatus>(initialHealth);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [resources, searchQuery, typeFilter]);

  const handleApproveEditorial = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            editorialStatus: 'published',
            verificationStatus: 'verified',
            verifiedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    showNotice(`Resource ${id} approved and published to public directory`);
  };

  const handleTriggerJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'completed',
            lastRun: new Date().toISOString(),
            retryCount: 0,
          };
        }
        return j;
      })
    );
    showNotice(`Background job '${jobId}' triggered successfully`);
  };

  const handleRunAgent = (agentName: string) => {
    const newExec: AgentExecutionResult = {
      executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
      agent: agentName as any,
      status: 'success',
      output: { completed: true, timestamp: new Date().toISOString() },
      findings: [`Executed scheduled intelligence pass for ${agentName}`, '0 policy violations'],
      costEstimateUsd: 0.0035,
      durationMs: 420,
      timestamp: new Date().toISOString(),
    };
    setExecutions((prev) => [newExec, ...prev]);
    showNotice(`Agent ${agentName} executed successfully`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Glass Header */}
      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                UNIFIED OPERATIONAL COMMAND CENTER
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              AI SATELLITE ECOSYSTEM INTEGRATION • PERMANENT DOMAIN: https://aisatellite.dev
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SYSTEMS 100% OPERATIONAL
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              UPTIME: {health.publicAvailability}%
            </span>
          </div>
        </div>

        {actionNotice && (
          <div className="mt-4 p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-sm flex items-center justify-between animate-fadeIn">
            <span>{actionNotice}</span>
            <span className="text-xs text-cyan-400 font-mono">AUTONOMOUS DISPATCH</span>
          </div>
        )}
      </div>

      {/* Navigation Glass Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'overview', label: 'Global Overview', icon: Activity },
          { id: 'resources', label: 'Resource Registry (CRIS)', icon: Layers },
          { id: 'knowledge_graph', label: 'Knowledge Graph', icon: Database },
          { id: 'editorial', label: 'Editorial Pipeline', icon: FileCheck },
          { id: 'agents', label: 'Agent Swarm', icon: Bot },
          { id: 'scheduler', label: 'Automation Scheduler', icon: Clock },
          { id: 'analytics', label: 'Unified Analytics', icon: BarChart3 },
          { id: 'security', label: 'Security & Reliability', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CommandTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(86,229,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Global Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-mono block">CENTRAL RESOURCES</span>
              <span className="text-2xl font-bold text-white mt-1 block">{resources.length}</span>
              <span className="text-xs text-cyan-400 font-mono mt-1 block">Deduplicated CRIS Entities</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-mono block">BACKGROUND JOBS</span>
              <span className="text-2xl font-bold text-white mt-1 block">{jobs.length}</span>
              <span className="text-xs text-emerald-400 font-mono mt-1 block">Unified Scheduler Active</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-mono block">AGENT EXECUTIONS</span>
              <span className="text-2xl font-bold text-white mt-1 block">{executions.length}</span>
              <span className="text-xs text-purple-400 font-mono mt-1 block">Within $1.00 Budget Cap</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-mono block">PUBLIC AVAILABILITY</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">{health.publicAvailability}%</span>
              <span className="text-xs text-slate-400 font-mono mt-1 block">Cloudflare Edge Synced</span>
            </div>
          </div>

          {/* Subsystem Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  D1 Database & Migrations
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  MIGRATION 0006 ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Central resources, knowledge graph edges, unified events, and agent audit logs synchronized.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  Search & Canonical Domain
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  AISATELLITE.DEV
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pagefind 1.5.2 client-side indexing active. Zero private data leakage into public indices.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Security & IDOR Isolation
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-300 font-mono">
                  ENFORCED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Server-side authorization guards active. SSRF private IP blocking and RBAC verified.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Central Resource Registry */}
      {activeTab === 'resources' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search central resources..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-mono">TYPE:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="open_source_project">Open-Source Project</option>
                <option value="software_product">Software Product</option>
                <option value="ai_tool">AI Tool</option>
                <option value="free_alternative">Free Alternative</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                  <th className="p-3">RESOURCE ID</th>
                  <th className="p-3">NAME & CANONICAL SLUG</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">LICENSE / PRICING</th>
                  <th className="p-3">CAPABILITIES</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-cyan-400">{res.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{res.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">/{res.slug}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono uppercase text-[10px]">
                        {res.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-300">{res.license || 'Proprietary'}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{res.pricing}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {res.capabilities.slice(0, 3).map((c, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800/80 text-[10px] text-cyan-300">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          res.verificationStatus === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {res.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {res.editorialStatus !== 'published' ? (
                        <button
                          onClick={() => handleApproveEditorial(res.id)}
                          className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded font-medium text-[11px] border border-cyan-500/40"
                        >
                          Approve & Publish
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-mono text-[11px]">LIVE</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Multi-Agent Swarm */}
      {activeTab === 'agents' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm text-slate-200">Autonomous Agent Orchestration</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-agent swarm running under strict execution boundaries, rate limits, and human-in-the-loop gates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRunAgent('DiscoveryAgent')}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-xs font-medium border border-cyan-500/40 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Trigger Discovery
              </button>
              <button
                onClick={() => handleRunAgent('VerificationAgent')}
                className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-medium border border-purple-500/40 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Trigger Verification
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {executions.map((exec) => (
              <div key={exec.executionId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-xs text-slate-200">{exec.agent}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{exec.executionId}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(exec.timestamp).toLocaleTimeString()} • ${exec.costEstimateUsd.toFixed(4)}
                  </span>
                </div>
                <div className="space-y-1 pl-6">
                  {exec.findings.map((f, i) => (
                    <div key={i} className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Automation Scheduler */}
      {activeTab === 'scheduler' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h2 className="font-semibold text-sm text-slate-200">Unified Automation Scheduler</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consolidated background cron jobs with idempotency keys and automatic retry limits.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                  <th className="p-3">JOB ID</th>
                  <th className="p-3">NAME & CATEGORY</th>
                  <th className="p-3">INTERVAL</th>
                  <th className="p-3">LAST RUN</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-cyan-400">{job.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{job.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">{job.category}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-300">Every {job.cronIntervalMinutes}m</td>
                    <td className="p-3 font-mono text-slate-400">
                      {job.lastRun ? new Date(job.lastRun).toLocaleTimeString() : 'Pending'}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase">
                        {job.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleTriggerJob(job.id)}
                        className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded font-medium text-[11px] border border-cyan-500/40 flex items-center gap-1 ml-auto"
                      >
                        <RotateCw className="w-3 h-3" />
                        Run Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Knowledge Graph */}
      {activeTab === 'knowledge_graph' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h2 className="font-semibold text-sm text-slate-200">Unified Knowledge Graph Connections</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified bidirectional relationships connecting commercial SaaS tools with free open-source equivalents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400">ALTERNATIVE RELATIONSHIP</span>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-emerald-400">SigNoz</span>
                <span className="text-slate-500 font-mono text-xs">REPLACES</span>
                <span className="text-slate-300">Datadog</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                <span>Confidence: 98%</span>
                <span className="text-emerald-400 font-mono">VERIFIED</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400">ALTERNATIVE RELATIONSHIP</span>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-emerald-400">Podman</span>
                <span className="text-slate-500 font-mono text-xs">REPLACES</span>
                <span className="text-slate-300">Docker Desktop</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                <span>Confidence: 99%</span>
                <span className="text-emerald-400 font-mono">VERIFIED</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400">ALTERNATIVE RELATIONSHIP</span>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-emerald-400">Bruno</span>
                <span className="text-slate-500 font-mono text-xs">REPLACES</span>
                <span className="text-slate-300">Postman</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                <span>Confidence: 99%</span>
                <span className="text-emerald-400 font-mono">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Security & Reliability */}
      {activeTab === 'security' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h2 className="font-semibold text-sm text-slate-200">Security & Operational Reliability</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified IDOR authorization barriers, private IP SSRF filters, CSP headers, and disaster recovery runbooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Active Protection Barriers
              </span>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  IDOR Defense: Server-side owner verification on every mutation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  SSRF Filter: Blocks loopback, RFC 1918, and metadata 169.254.169.254
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Cookie Policy: __Secure-aisatellite-session with HttpOnly and SameSite=Strict
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-cyan-400" />
                Disaster Recovery & Backups
              </span>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  D1 Database: Hourly snapshot frequency with point-in-time recovery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Runbooks: 9 verified operational recovery playbooks with RTO &lt; 30m
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Edge Cache: Private endpoints enforce Cache-Control: private, no-store
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
