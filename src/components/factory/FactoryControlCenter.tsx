import React, { useState } from 'react';
import {
  Shield,
  Cpu,
  Terminal,
  Activity,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  FileCode,
  Box,
  Key,
} from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  type: string;
  status: 'planning' | 'developing' | 'testing' | 'security_review' | 'release_approval' | 'published';
  version: string;
  score: number;
  approvedBy?: string;
  license: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'developer-toolbox',
    name: 'AI Satellite Developer Toolbox CLI',
    type: 'CLI',
    status: 'published',
    version: '1.0.0',
    score: 92,
    approvedBy: 'Lead Human Maintainer',
    license: 'MIT',
  },
  {
    id: 'edge-prompt-cache',
    name: 'Edge Prompt Cache Engine',
    type: 'Automation',
    status: 'release_approval',
    version: '0.9.0',
    score: 87,
    license: 'Apache-2.0',
  },
  {
    id: 'threejs-pipeline-helper',
    name: 'WebGL Shader Asset Optimizer',
    type: 'Library',
    status: 'testing',
    version: '0.5.0',
    score: 84,
    license: 'MIT',
  },
];

const AGENTS = [
  { name: 'ResearchAgent', role: 'Niche Analysis & Scoring', status: 'idle', count: '14 proposals' },
  { name: 'ProductAgent', role: '15-Section PRD Generation', status: 'idle', count: '12 PRDs' },
  { name: 'ArchitectureAgent', role: 'System Blueprint & Tasks', status: 'idle', count: '8 architectures' },
  { name: 'CodingAgent', role: 'Bounded Sandbox Implementation', status: 'idle', count: '34 modules' },
  { name: 'TestingAgent', role: 'Automated Vitest Execution', status: 'idle', count: '100% pass rate' },
  { name: 'SecurityAgent', role: 'Secret & CVE Auditing', status: 'idle', count: '0 vulnerabilities' },
  { name: 'DocumentationAgent', role: 'Docs, Licenses & Guides', status: 'idle', count: '18 docs' },
  { name: 'ReleaseAgent', role: 'SemVer & SHA-256 Packaging', status: 'idle', count: '6 releases' },
  { name: 'MaintenanceAgent', role: 'Dependency & CVE Monitor', status: 'active', count: 'All green' },
  { name: 'PublishingAgent', role: 'Astro Content Distributor', status: 'idle', count: 'Published' },
];

export default function FactoryControlCenter() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'agents' | 'audit' | 'sandbox'>('pipeline');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [tokenInput, setTokenInput] = useState<string>('');
  const [emergencyStopped, setEmergencyStopped] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [auditVerified, setAuditVerified] = useState<boolean>(true);

  const handleApprove = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: p.status === 'release_approval' ? 'published' : 'developing',
            approvedBy: 'Lead Human Maintainer (Interactive)',
          };
        }
        return p;
      })
    );
  };

  const toggleEmergencyStop = () => {
    setEmergencyStopped((prev) => !prev);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Control Header */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              AUTONOMOUS SOFTWARE FACTORY — CONTROL CENTER
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Software Engineering Operations
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
              Multi-agent orchestration cockpit with isolated sandboxes, cryptographic SHA-256 verification, and strict human-in-the-loop approval gates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleEmergencyStop}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg ${
                emergencyStopped
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {emergencyStopped ? 'Resume All Operations' : 'Emergency Stop Engine'}
            </button>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono bg-slate-800/90 text-slate-300 border border-slate-700">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Sandbox Isolation: Active</span>
            </div>
          </div>
        </div>

        {emergencyStopped && (
          <div className="mt-6 p-4 rounded-xl border border-rose-500/50 bg-rose-950/60 text-rose-200 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <span className="font-bold">EMERGENCY STOP ACTIVE:</span> All background autonomous pipelines, coding loops, and release packaging are paused. No unapproved execution will take place.
            </div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Factory Projects</span>
            <Box className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">4</div>
          <div className="text-xs text-slate-400 mt-1">1 Published, 3 In Pipeline</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Security Pass Rate</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</div>
          <div className="text-xs text-slate-400 mt-1">0 Critical Secrets or CVEs</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Agents</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-400">10 / 10</div>
          <div className="text-xs text-slate-400 mt-1">All Roles Operational</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Audit Chain Status</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-400">Verified</div>
          <div className="text-xs text-slate-400 mt-1">SHA-256 Tamper-Evident</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-8 text-sm font-medium">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-4 transition-colors flex items-center gap-2 ${
            activeTab === 'pipeline'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Projects Pipeline
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`pb-4 transition-colors flex items-center gap-2 ${
            activeTab === 'agents'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Specialized Agents
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`pb-4 transition-colors flex items-center gap-2 ${
            activeTab === 'sandbox'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Sandbox & Security Gates
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-4 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          Audit Logs
        </button>
      </div>

      {/* Tab 1: Projects Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/40">
              <h2 className="text-base font-semibold text-white">Active Software Pipelines</h2>
              <span className="text-xs text-slate-400">Strict Human Sign-off Enforced</span>
            </div>
            <div className="divide-y divide-slate-800">
              {projects.map((proj) => (
                <div key={proj.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {proj.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-950 text-cyan-400 border border-cyan-800">
                        v{proj.version}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>Opportunity Score: <strong className="text-cyan-400">{proj.score}/100</strong></span>
                      <span>License: <strong className="text-slate-300">{proj.license}</strong></span>
                      {proj.approvedBy && (
                        <span>Approved By: <strong className="text-emerald-400">{proj.approvedBy}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proj.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : proj.status === 'release_approval'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {proj.status.replace('_', ' ').toUpperCase()}
                    </span>

                    {proj.status === 'release_approval' && (
                      <button
                        onClick={() => handleApprove(proj.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve Release
                      </button>
                    )}

                    {proj.status === 'published' && (
                      <a
                        href={`/projects/${proj.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 transition-all"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        View Live Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Specialized Agents */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">{agent.name}</span>
                </div>
                <div className="text-xs text-slate-400">{agent.role}</div>
                <div className="text-xs font-mono text-cyan-400">{agent.count}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                {agent.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Sandbox & Security */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Isolated Sandbox Execution Engine
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Autonomous agents execute tasks inside ephemeral directory trees under <code className="text-cyan-400 font-mono text-xs">factory/workspaces/&lt;projectId&gt;</code>. Untrusted workloads never execute in the Astro static site root.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <div className="text-xs text-slate-400">Process Timeout Guard</div>
                <div className="text-base font-bold text-white mt-1">120 Seconds Max</div>
                <div className="text-xs text-slate-400 mt-1">Force kills runaway tasks</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <div className="text-xs text-slate-400">Credential Stripping</div>
                <div className="text-base font-bold text-white mt-1">Automatic</div>
                <div className="text-xs text-slate-400 mt-1">Tokens filtered from child env</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <div className="text-xs text-slate-400">Buffer Max Size</div>
                <div className="text-base font-bold text-white mt-1">10 MB Buffer</div>
                <div className="text-xs text-slate-400 mt-1">Truncates excessive output</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/40">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Cryptographic Audit Trail</h2>
              {auditVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle className="w-3 h-3" />
                  Chain Valid
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-mono">SHA-256 Signatures</span>
          </div>
          <div className="p-6 font-mono text-xs space-y-3 bg-slate-950/70 overflow-x-auto">
            <div className="text-slate-400">
              <span className="text-cyan-400">[2026-10-31T11:00:00Z]</span> ACTOR: <span className="text-purple-300">research-agent</span> | ACTION: produce_proposal | PROJECT: developer-toolbox | SIG: <span className="text-slate-400">8f2c...4a1</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">[2026-10-31T11:02:15Z]</span> ACTOR: <span className="text-emerald-300">Lead Human Maintainer</span> | ACTION: approve_proposal_for_planning | PROJECT: developer-toolbox | SIG: <span className="text-slate-400">3b7e...99c</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">[2026-10-31T11:04:30Z]</span> ACTOR: <span className="text-purple-300">testing-agent</span> | ACTION: complete_test_run | PASSED: 11 | FAILED: 0 | SIG: <span className="text-slate-400">e12f...81d</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">[2026-10-31T11:06:10Z]</span> ACTOR: <span className="text-purple-300">security-agent</span> | ACTION: complete_security_audit | BLOCKED: false | RISK: 0 | SIG: <span className="text-slate-400">a94d...77e</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">[2026-10-31T11:08:45Z]</span> ACTOR: <span className="text-emerald-300">Lead Human Maintainer</span> | ACTION: approve_release_candidate | PROJECT: developer-toolbox | SIG: <span className="text-slate-400">5f6a...11b</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">[2026-10-31T11:09:20Z]</span> ACTOR: <span className="text-purple-300">publishing-agent</span> | ACTION: publish_to_astro | STATUS: SUCCESS | SIG: <span className="text-slate-400">2c88...0fa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
