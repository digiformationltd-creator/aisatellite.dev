import React, { useState, useEffect } from 'react';
import {
  Orbit,
  Bookmark,
  Terminal,
  FolderGit2,
  GraduationCap,
  Sparkles,
  Bell,
  Settings,
  Layers,
  Code2,
  FileText,
  Trash2,
  Plus,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldAlert,
  Search,
  Sliders,
  CheckCircle2,
  ArrowRight,
  LogOut,
  User,
  AlertTriangle,
} from 'lucide-react';

import { authService } from '../../lib/workspace/auth-service';
import { workspaceDatabase } from '../../lib/workspace/database';
import { promptVault } from '../../lib/workspace/prompt-vault';
import { snippetVault } from '../../lib/workspace/snippet-vault';
import { projectManager } from '../../lib/workspace/project-manager';
import { savedResourcesManager } from '../../lib/workspace/saved-resources';
import { learningEngine } from '../../lib/workspace/learning-engine';
import { workflowTemplateLibrary } from '../../lib/workspace/workflow-templates';
import { recommendationsEngine } from '../../lib/workspace/recommendations-engine';
import { notificationService } from '../../lib/workspace/notification-service';
import { exportService } from '../../lib/workspace/export-service';
import { workspaceSearchEngine } from '../../lib/workspace/workspace-search';
import type {
  User as UserType,
  PersonalPrompt,
  CodeSnippet,
  DeveloperProject,
  SavedResource,
  WorkspaceNotification,
  UserPreferences,
} from '../../lib/workspace/types';

type WorkspaceTab =
  | 'overview'
  | 'saved'
  | 'prompts'
  | 'snippets'
  | 'projects'
  | 'learning'
  | 'collections'
  | 'workflows'
  | 'recommendations'
  | 'notifications'
  | 'settings';

export default function MyOrbitWorkspace() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Workspace Data State
  const [savedTools, setSavedTools] = useState<SavedResource[]>([]);
  const [prompts, setPrompts] = useState<PersonalPrompt[]>([]);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  // New Item Modals/Forms
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [newSnippetCode, setNewSnippetCode] = useState('');
  const [newSnippetLang, setNewSnippetLang] = useState('typescript');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Check existing session
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ai_satellite_session_token');
      if (storedToken) {
        const validated = authService.validateSession(storedToken);
        if (validated) {
          setCurrentUser(validated.user);
          setSessionToken(storedToken);
          loadWorkspaceData(validated.user.id);
        }
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const loadWorkspaceData = (userId: string) => {
    setSavedTools(savedResourcesManager.getSavedTools(userId).concat(savedResourcesManager.getSavedAlternatives(userId)));
    setPrompts(promptVault.getUserPrompts(userId));
    setSnippets(snippetVault.getUserSnippets(userId));
    setProjects(projectManager.getUserProjects(userId));
    setNotifications(notificationService.getUserNotifications(userId));
    const prefs = workspaceDatabase.getPreferences(userId);
    if (prefs) setPreferences(prefs);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    const res = authService.login({ email: authEmail, password: authPassword });
    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      setSessionToken(res.token);
      try {
        localStorage.setItem('ai_satellite_session_token', res.token);
      } catch {}
      loadWorkspaceData(res.user.id);
    } else {
      setAuthError(res.error || 'Authentication failed');
    }
  };

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    const reg = authService.register({ email: authEmail, password: authPassword, name: authName });
    if (reg.success && reg.user) {
      // Auto login
      const loginRes = authService.login({ email: authEmail, password: authPassword });
      if (loginRes.success && loginRes.user && loginRes.token) {
        setCurrentUser(loginRes.user);
        setSessionToken(loginRes.token);
        try {
          localStorage.setItem('ai_satellite_session_token', loginRes.token);
        } catch {}
        setShowOnboarding(true);
        loadWorkspaceData(loginRes.user.id);
      }
    } else {
      setAuthError(reg.error || 'Registration failed');
    }
  };

  const handleQuickDemo = () => {
    const demoEmail = 'developer@aisatellite.dev';
    const demoPass = 'SatelliteSecure2026!';
    // Try login or register
    let res = authService.login({ email: demoEmail, password: demoPass });
    if (!res.success) {
      authService.register({ email: demoEmail, password: demoPass, name: 'Lead Architect' });
      res = authService.login({ email: demoEmail, password: demoPass });
    }
    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      setSessionToken(res.token);
      try {
        localStorage.setItem('ai_satellite_session_token', res.token);
      } catch {}
      // Seed initial sample data if empty
      if (promptVault.getUserPrompts(res.user.id).length === 0) {
        promptVault.createPrompt(res.user.id, {
          title: 'Claude Code Production Architect',
          description: 'Autonomous systems architect prompt for TypeScript and Astro development.',
          templateText: 'You are a Principal Software Architect operating under zero-hallucination constraints.',
          category: 'AI Coding',
        });
        snippetVault.createSnippet(res.user.id, {
          title: 'Three.js Context Loss Guard',
          language: 'typescript',
          code: 'canvas.addEventListener("webglcontextlost", (event) => {\n  event.preventDefault();\n  console.warn("WebGL context lost.");\n});',
        });
        projectManager.createProject(res.user.id, {
          name: 'AI Satellite Edge Deployment',
          description: 'Deploy global developer technology radar to Cloudflare Pages.',
          techStack: ['Astro', 'TypeScript', 'Tailwind CSS', 'Cloudflare Pages'],
          status: 'active',
        });
        savedResourcesManager.saveResource(res.user.id, {
          resourceId: 'n8n',
          resourceCategory: 'free_alternatives',
          title: 'n8n (Zapier Alternative)',
          notes: 'Self-hosted Docker automation saves $200/mo SaaS bill.',
        });
      }
      loadWorkspaceData(res.user.id);
    }
  };

  const handleLogout = () => {
    if (sessionToken) authService.logout(sessionToken);
    setCurrentUser(null);
    setSessionToken('');
    try {
      localStorage.removeItem('ai_satellite_session_token');
    } catch {}
  };

  const handleExportAll = () => {
    if (!currentUser) return;
    const json = exportService.generateExportJson(currentUser.id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-orbit-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    if (window.confirm('WARNING: Are you sure you want to permanently delete your account and all private records? This action is irreversible.')) {
      authService.deleteAccount(currentUser.id, sessionToken);
      handleLogout();
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!currentUser || !q.trim()) {
      setSearchResults([]);
      return;
    }
    const res = workspaceSearchEngine.search(currentUser.id, q);
    setSearchResults(res);
  };

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  // -------------------------------------------------------------
  // Render: Unauthenticated View
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Orbit className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access My Orbit Workspace</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Your personal, encrypted developer workstation. Save tools, manage private prompts, organize projects, and follow learning tracks.
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Developer Name</label>
              <input
                type="text"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="developer@domain.com"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Password (Min 8 Characters)</label>
            <input
              type="password"
              required
              minLength={8}
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <span>{authMode === 'login' ? 'Sign In to Workspace' : 'Create My Orbit Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setAuthError(null);
            }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Login</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Authenticated Workspace View
  // -------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Orbit className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">My Orbit</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                AUTHENTICATED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{currentUser.email} • {currentUser.name}</p>
          </div>
        </div>

        {/* Global Workspace Search Input */}
        <div className="flex-1 max-w-md w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search saved tools, prompts, snippets, projects..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportAll}
            title="Export all personal data as JSON"
            className="p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Workspace Search Results Overlay (if query active) */}
      {searchQuery.trim().length > 0 && (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>Workspace Search Results ({searchResults.length})</span>
            <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
              Clear
            </button>
          </div>
          {searchResults.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No matching records found in your private orbit.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
              {searchResults.map((res) => (
                <div key={res.id} className="p-3 rounded-xl border border-white/10 bg-slate-900/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{res.title}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-slate-400 line-clamp-2 text-[11px]">{res.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: 'overview', label: 'Overview', icon: Orbit },
          { id: 'saved', label: `Saved (${savedTools.length})`, icon: Bookmark },
          { id: 'prompts', label: `Prompts (${prompts.length})`, icon: Terminal },
          { id: 'snippets', label: `Snippets (${snippets.length})`, icon: Code2 },
          { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
          { id: 'learning', label: 'Learning Paths', icon: GraduationCap },
          { id: 'workflows', label: 'Workflows', icon: Layers },
          { id: 'recommendations', label: 'Smart Recs', icon: Sparkles },
          { id: 'notifications', label: `Alerts (${notifications.filter((n) => !n.read).length})`, icon: Bell },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WorkspaceTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
              <span className="text-xs text-slate-400 block mb-1">Saved Tools</span>
              <span className="text-2xl font-bold text-white">{savedTools.length}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
              <span className="text-xs text-slate-400 block mb-1">Personal Prompts</span>
              <span className="text-2xl font-bold text-cyan-400">{prompts.length}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
              <span className="text-xs text-slate-400 block mb-1">Code Snippets</span>
              <span className="text-2xl font-bold text-blue-400">{snippets.length}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
              <span className="text-xs text-slate-400 block mb-1">Active Projects</span>
              <span className="text-2xl font-bold text-emerald-400">{projects.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Prompts Panel */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Recent Prompts
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('prompts')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View All
                </button>
              </div>
              {prompts.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No prompts saved yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {prompts.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-3 rounded-xl border border-white/5 bg-slate-950/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{p.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono">v{p.currentVersion} • {p.category}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(p.id, p.templateText)}
                        className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white"
                      >
                        {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Recommendations Panel */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Smart Recommendations
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('recommendations')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  See More
                </button>
              </div>
              <div className="space-y-2.5">
                {recommendationsEngine.getRecommendations(currentUser.id).slice(0, 3).map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{rec.title}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{rec.category}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Saved Tools */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Saved Tools & Verified Alternatives</h3>
            <span className="text-xs text-slate-400 font-mono">{savedTools.length} Total Bookmarks</span>
          </div>
          {savedTools.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center text-slate-400 text-xs">
              No tools saved yet. Explore the public Technology Radar to bookmark tools with zero telemetry.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTools.map((tool) => (
                <div key={tool.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{tool.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        savedResourcesManager.removeSavedResource(currentUser.id, tool.id);
                        setSavedTools(savedResourcesManager.getSavedTools(currentUser.id));
                      }}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {tool.notes && (
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-white/5">
                      {tool.notes}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono block">Saved: {tool.savedAt.split('T')[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 3. Prompt Library */}
      {activeTab === 'prompts' && (
        <div className="space-y-6">
          {/* Create Prompt Form */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Create Personal Master Prompt</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newPromptTitle}
                onChange={(e) => setNewPromptTitle(e.target.value)}
                placeholder="Prompt Title (e.g., Senior Full-Stack Reviewer)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <textarea
              rows={3}
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              placeholder="System prompt template text..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (newPromptTitle && newPromptText) {
                  promptVault.createPrompt(currentUser.id, {
                    title: newPromptTitle,
                    description: 'Custom developer prompt',
                    templateText: newPromptText,
                  });
                  setNewPromptTitle('');
                  setNewPromptText('');
                  setPrompts(promptVault.getUserPrompts(currentUser.id));
                }
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Prompt with Version 1</span>
            </button>
          </div>

          {/* List Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{p.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    v{p.currentVersion}
                  </span>
                </div>
                <pre className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-white/5 font-mono overflow-x-auto whitespace-pre-wrap max-h-36">
                  {p.templateText}
                </pre>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono">Updated: {p.updatedAt.split('T')[0]}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(p.id, p.templateText)}
                    className="px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. Code Snippets */}
      {activeTab === 'snippets' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Add Code Snippet</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newSnippetTitle}
                onChange={(e) => setNewSnippetTitle(e.target.value)}
                placeholder="Snippet Title"
                className="w-full sm:col-span-2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
              <select
                value={newSnippetLang}
                onChange={(e) => setNewSnippetLang(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                {['typescript', 'javascript', 'python', 'html', 'css', 'sql', 'bash', 'json'].map((l) => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <textarea
              rows={4}
              value={newSnippetCode}
              onChange={(e) => setNewSnippetCode(e.target.value)}
              placeholder="// Reusable snippet code..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (newSnippetTitle && newSnippetCode) {
                  snippetVault.createSnippet(currentUser.id, {
                    title: newSnippetTitle,
                    language: newSnippetLang,
                    code: newSnippetCode,
                  });
                  setNewSnippetTitle('');
                  setNewSnippetCode('');
                  setSnippets(snippetVault.getUserSnippets(currentUser.id));
                }
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Code Snippet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snippets.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{s.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono uppercase">
                    {s.language}
                  </span>
                </div>
                <pre className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-white/5 font-mono overflow-x-auto whitespace-pre-wrap max-h-36">
                  {s.code}
                </pre>
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      snippetVault.deleteSnippet(currentUser.id, s.id);
                      setSnippets(snippetVault.getUserSnippets(currentUser.id));
                    }}
                    className="text-slate-500 hover:text-red-400 text-xs"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(s.id, s.code)}
                    className="px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedId === s.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. Developer Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Create Development Project</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project Name (e.g. Edge LLM Gateway)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
              <input
                type="text"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="Project Description"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (newProjectName && newProjectDesc) {
                  projectManager.createProject(currentUser.id, {
                    name: newProjectName,
                    description: newProjectDesc,
                    status: 'active',
                  });
                  setNewProjectName('');
                  setNewProjectDesc('');
                  setProjects(projectManager.getUserProjects(currentUser.id));
                }
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project Workspace</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{proj.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                    {proj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-white/5 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. Learning Paths */}
      {activeTab === 'learning' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningEngine.getAllTracks().map((track) => {
            const progress = learningEngine.getUserProgress(currentUser.id, track.id);
            const percent = progress?.percentComplete || 0;
            return (
              <div key={track.id} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {track.category} • {track.difficulty}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{percent}% Complete</span>
                </div>
                <h4 className="text-base font-bold text-white">{track.title}</h4>
                <p className="text-xs text-slate-400">{track.description}</p>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {track.lessons.map((lesson) => {
                    const isDone = progress?.completedLessonIds.includes(lesson.id) || false;
                    return (
                      <div key={lesson.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5">
                        <span className={`text-slate-300 ${isDone ? 'line-through text-slate-500' : ''}`}>
                          {lesson.title} ({lesson.durationMinutes}m)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            learningEngine.updateLessonProgress(currentUser.id, track.id, lesson.id, !isDone);
                            loadWorkspaceData(currentUser.id);
                          }}
                          className={`p-1 rounded ${isDone ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: 7. Workflows */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Reusable Engineering Workflows</h3>
            <span className="text-xs text-slate-400 font-mono">Standard Operating Procedures</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflowTemplateLibrary.getAllTemplates().map((wf) => (
              <div key={wf.id} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {wf.category}
                </span>
                <h4 className="text-sm font-bold text-white">{wf.title}</h4>
                <p className="text-xs text-slate-300">{wf.purpose}</p>

                <div className="space-y-1.5 pt-2">
                  {wf.steps.map((s) => (
                    <div key={s.stepNumber} className="text-[11px] text-slate-400 flex items-start gap-2">
                      <span className="font-bold text-cyan-400 font-mono">{s.stepNumber}.</span>
                      <span><strong>{s.title}:</strong> {s.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. Smart Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Verified Resource Recommendations</h3>
            <span className="text-xs text-slate-400">Grounded in explicit interests & project stacks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendationsEngine.getRecommendations(currentUser.id).map((rec) => (
              <div key={rec.id} className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{rec.title}</span>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase">{rec.category}</span>
                </div>
                <p className="text-xs text-slate-300">{rec.reason}</p>
                <div className="pt-2 flex justify-end">
                  <a
                    href={rec.url}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect Resource</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 9. Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Event Notifications</h3>
            <span className="text-xs text-slate-400">Pricing updates, security alerts & availability</span>
          </div>
          {notifications.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-white/10 text-center text-slate-400 text-xs">
              Zero unread notifications.
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">{n.title}</span>
                    <p className="text-slate-400">{n.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{n.createdAt.split('T')[0]}</span>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => {
                        notificationService.markAsRead(currentUser.id, n.id);
                        loadWorkspaceData(currentUser.id);
                      }}
                      className="text-[10px] text-cyan-400 hover:underline shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 10. Account Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-xl space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Developer Preferences</h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between text-slate-300">
                <span>Personalized Smart Recommendations</span>
                <input
                  type="checkbox"
                  checked={preferences?.personalizationEnabled ?? true}
                  onChange={(e) => {
                    if (preferences) {
                      const updated = { ...preferences, personalizationEnabled: e.target.checked };
                      workspaceDatabase.savePreferences(updated);
                      setPreferences(updated);
                    }
                  }}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300">
                <span>Price & License Change Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences?.notificationPreferences.priceAlerts ?? true}
                  onChange={(e) => {
                    if (preferences) {
                      const updated = {
                        ...preferences,
                        notificationPreferences: {
                          ...preferences.notificationPreferences,
                          priceAlerts: e.target.checked,
                        },
                      };
                      workspaceDatabase.savePreferences(updated);
                      setPreferences(updated);
                    }
                  }}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/20 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Account & Data Management
            </h3>
            <p className="text-xs text-slate-400">
              Export a complete portable JSON archive of your personal prompts, code snippets, projects, and notes, or permanently erase your account.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportAll}
                className="px-3.5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export My Data</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-3.5 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30 text-xs font-bold transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
