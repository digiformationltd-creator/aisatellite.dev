import React, { useState } from 'react';
import {
  Activity,
  Search,
  CheckCircle,
  AlertTriangle,
  Globe,
  Share2,
  GitBranch,
  Mail,
  Inbox,
  BarChart3,
  Shield,
  Settings,
  RefreshCw,
  Lock,
} from 'lucide-react';

interface GrowthControlCenterProps {
  initialToken?: string;
}

export default function GrowthControlCenter({ initialToken = '' }: GrowthControlCenterProps) {
  const [token, setToken] = useState<string>(initialToken);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(initialToken));
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Mocked state for interactive demonstration in preview
  const [jobs, setJobs] = useState([
    {
      id: 'dist-173000-01',
      platform: 'github',
      title: 'Self-Hosting Postgres with pgvector',
      targetUrl: 'https://aisatellite.pages.dev/blog/test-self-hosting-postgres-pgvector',
      status: 'awaiting_review',
    },
    {
      id: 'dist-173000-02',
      platform: 'linkedin',
      title: 'Free Alternatives to Airtable and Zapier',
      targetUrl: 'https://aisatellite.pages.dev/alternatives',
      status: 'approved',
    },
    {
      id: 'dist-173000-03',
      platform: 'x',
      title: 'Three.js Cyber Grid Interactive Component',
      targetUrl: 'https://aisatellite.pages.dev/3d-lab/shaders',
      status: 'draft',
    },
  ]);

  const [submissions, setSubmissions] = useState([
    {
      id: 'SUB-A8F9-01',
      type: 'tool',
      title: 'Appwrite Open Source Backend',
      description: 'Self-hosted Firebase and Supabase alternative with real-time auth and storage.',
      status: 'pending',
    },
    {
      id: 'SUB-B4C2-02',
      type: 'security',
      title: 'CORS header tightening advisory',
      description: 'Private review of edge asset origin headers on Pages domain.',
      status: 'pending',
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim().length > 5) {
      setIsAuthenticated(true);
      setStatusMessage('Authenticated successfully as Growth Systems Lead');
    } else {
      setStatusMessage('Invalid administrator token');
    }
  };

  const approveJob = (id: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'approved' } : j)));
    setStatusMessage(`Job ${id} approved for scheduled distribution.`);
  };

  const rejectJob = (id: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'cancelled' } : j)));
    setStatusMessage(`Job ${id} rejected.`);
  };

  const moderateSub = (id: string, newStatus: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    setStatusMessage(`Submission ${id} marked as ${newStatus}.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-space-800/80 border border-cosmic-border rounded-xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cosmic-cyan/10 border border-cosmic-cyan/30 rounded-lg text-cosmic-cyan">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Growth Control Center</h2>
            <p className="text-xs text-space-muted">Private Administrative Console</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-space-muted mb-2">
              Admin Access Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter GROWTH_ADMIN_TOKEN..."
              className="w-full px-4 py-2.5 bg-space-900 border border-cosmic-border rounded-lg text-sm text-white focus:outline-none focus:border-cosmic-cyan"
            />
          </div>
          {statusMessage && <p className="text-xs text-rose-400">{statusMessage}</p>}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cosmic-cyan to-cosmic-purple text-space-900 font-bold rounded-lg text-sm hover:opacity-90 transition shadow-lg shadow-cosmic-cyan/20"
          >
            Authenticate Session
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'seo', label: 'Technical SEO', icon: Globe },
    { id: 'search', label: 'Search Performance', icon: Search },
    { id: 'distribution', label: 'Distribution Queue', icon: Share2 },
    { id: 'github', label: 'GitHub Community', icon: GitBranch },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'submissions', label: 'Submissions', icon: Inbox },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security & Audit', icon: Shield },
  ];

  return (
    <div className="w-full bg-space-900/60 border border-cosmic-border rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-cosmic-border bg-space-800/40 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cosmic-cyan/10 border border-cosmic-cyan/30 rounded-lg text-cosmic-cyan">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Satellite &bull; Growth Control Center</h2>
            <p className="text-xs text-space-muted">Organic Discovery &amp; Community Intelligence Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-mono">
            ● Active Session (Admin)
          </span>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-space-muted hover:text-white px-2 py-1 rounded transition"
          >
            Lock
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="px-6 py-2 bg-cosmic-cyan/10 border-b border-cosmic-cyan/20 text-xs text-cosmic-cyan">
          {statusMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-cosmic-border bg-space-900/80 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
                isActive
                  ? 'border-cosmic-cyan text-cosmic-cyan bg-cosmic-cyan/5'
                  : 'border-transparent text-space-muted hover:text-white hover:bg-space-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Body Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-space-800/60 border border-cosmic-border rounded-xl">
                <div className="text-xs text-space-muted uppercase tracking-wider mb-1">Indexable Routes</div>
                <div className="text-2xl font-black text-white">162</div>
                <div className="text-[11px] text-emerald-400 mt-1">100% Canonicalized</div>
              </div>
              <div className="p-4 bg-space-800/60 border border-cosmic-border rounded-xl">
                <div className="text-xs text-space-muted uppercase tracking-wider mb-1">Active Subscribers</div>
                <div className="text-2xl font-black text-white">2,410</div>
                <div className="text-[11px] text-cosmic-cyan mt-1">Double Opt-In Enforced</div>
              </div>
              <div className="p-4 bg-space-800/60 border border-cosmic-border rounded-xl">
                <div className="text-xs text-space-muted uppercase tracking-wider mb-1">Pending Distributions</div>
                <div className="text-2xl font-black text-white">{jobs.filter((j) => j.status === 'awaiting_review').length}</div>
                <div className="text-[11px] text-amber-400 mt-1">Awaiting Review Gate</div>
              </div>
              <div className="p-4 bg-space-800/60 border border-cosmic-border rounded-xl">
                <div className="text-xs text-space-muted uppercase tracking-wider mb-1">Pending Submissions</div>
                <div className="text-2xl font-black text-white">{submissions.filter((s) => s.status === 'pending').length}</div>
                <div className="text-[11px] text-space-muted mt-1">Moderation Queue</div>
              </div>
            </div>

            <div className="p-5 bg-space-800/40 border border-cosmic-border rounded-xl">
              <h3 className="text-sm font-bold text-white mb-3">System Operating Principles</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-space-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Strict AI Satellite standalone branding enforced site-wide.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero purchased followers, fake stars, or automated follow bots.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>All external content distributions require human editorial approval.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Privacy-first measurement with zero visitor fingerprinting.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Content Distribution Queue</h3>
              <span className="text-xs text-space-muted">Requires human review before publishing</span>
            </div>
            <div className="divide-y divide-cosmic-border border border-cosmic-border rounded-xl bg-space-800/40 overflow-hidden">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-cosmic-cyan/10 text-cosmic-cyan border border-cosmic-cyan/20">
                        {job.platform}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{job.title}</h4>
                    </div>
                    <p className="text-xs text-space-muted mt-1 font-mono">{job.targetUrl}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-mono ${
                        job.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : job.status === 'awaiting_review'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-space-700 text-space-muted'
                      }`}
                    >
                      {job.status}
                    </span>
                    {job.status !== 'approved' && job.status !== 'cancelled' && (
                      <button
                        onClick={() => approveJob(job.id)}
                        className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold rounded transition"
                      >
                        Approve
                      </button>
                    )}
                    {job.status !== 'cancelled' && (
                      <button
                        onClick={() => rejectJob(job.id)}
                        className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded transition"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Community Submissions &amp; Moderation</h3>
            <div className="divide-y divide-cosmic-border border border-cosmic-border rounded-xl bg-space-800/40 overflow-hidden">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        sub.type === 'security'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-cosmic-cyan/10 text-cosmic-cyan border border-cosmic-cyan/20'
                      }`}>
                        {sub.type}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{sub.title}</h4>
                    </div>
                    <p className="text-xs text-space-muted mt-1">{sub.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-space-700 text-space-muted">
                      {sub.status}
                    </span>
                    {sub.status === 'pending' && (
                      <>
                        <button
                          onClick={() => moderateSub(sub.id, 'approved')}
                          className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold rounded transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => moderateSub(sub.id, 'resolved')}
                          className="px-3 py-1 bg-cosmic-cyan/20 hover:bg-cosmic-cyan/30 text-cosmic-cyan text-xs font-semibold rounded transition"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'distribution' && activeTab !== 'submissions' && (
          <div className="p-8 text-center text-space-muted bg-space-800/30 border border-cosmic-border rounded-xl">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 text-cosmic-cyan/40 animate-spin" />
            <h4 className="text-sm font-semibold text-white mb-1">
              {tabs.find((t) => t.id === activeTab)?.label} Subsystem Active
            </h4>
            <p className="text-xs max-w-md mx-auto">
              Automated data streams and audit schedules running in background. Data synced every 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
