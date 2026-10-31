import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Terminal,
  Cpu,
} from 'lucide-react';
import type { ProjectShowcase } from '../../lib/community/types';
import { RECOGNIZED_OPEN_SOURCE_LICENSES } from '../../lib/community/types';

interface ProjectShowcaseHubProps {
  initialProjects?: ProjectShowcase[];
}

export default function ProjectShowcaseHub({ initialProjects = [] }: ProjectShowcaseHubProps) {
  const [projects, setProjects] = useState<ProjectShowcase[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLicense, setFilterLicense] = useState('all');

  // Submit project modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [maintainer, setMaintainer] = useState('');
  const [license, setLicense] = useState('MIT');
  const [docUrl, setDocUrl] = useState('');
  const [installInstructions, setInstallInstructions] = useState('');
  const [submitFeedback, setSubmitFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (p.status !== 'approved') return false;
    const matchesLicense = filterLicense === 'all' || p.license.toLowerCase() === filterLicense.toLowerCase();
    const matchesQuery =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.maintainerAttribution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLicense && matchesQuery;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !repoUrl.trim() || !description.trim()) {
      setSubmitFeedback({ success: false, message: 'Please complete all required fields.' });
      return;
    }

    const isOsi = RECOGNIZED_OPEN_SOURCE_LICENSES.some((l) => l.toLowerCase() === license.toLowerCase());

    const newPrj: ProjectShowcase = {
      id: `prj-${Date.now()}`,
      submitterId: 'current-user',
      submitterUsername: 'developer',
      name: name.trim(),
      description: description.trim(),
      repoUrl: repoUrl.trim(),
      maintainerAttribution: maintainer.trim() || 'Community',
      license: license.trim(),
      isLicenseVerified: isOsi,
      supportedPlatforms: ['Linux', 'macOS', 'Windows'],
      docUrl: docUrl.trim() || repoUrl.trim(),
      installInstructions: installInstructions.trim() || 'npm install',
      verifiedReleaseVersion: 'v1.0.0',
      status: 'pending', // Enters moderation review queue
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubmitFeedback({
      success: true,
      message: isOsi
        ? 'Project submitted successfully! It has entered the editorial review queue.'
        : `Notice: License "${license}" is unverified. Submitted to moderation with license review flag.`,
    });

    setTimeout(() => {
      setShowModal(false);
      setName('');
      setDescription('');
      setRepoUrl('');
      setDocUrl('');
      setInstallInstructions('');
      setSubmitFeedback(null);
    }, 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Open-Source Project Showcase</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Discover verified open-source developer tooling, databases, libraries, and frameworks with compliant OSI licenses.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cosmic-emerald text-space-950 font-bold text-xs sm:text-sm transition-all hover:shadow-glow-emerald hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Showcase Project</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, description, maintainer..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-space-900/80 border border-border-subtle focus:border-cosmic-emerald focus:outline-none text-text-primary placeholder:text-text-muted"
          />
        </div>

        <select
          value={filterLicense}
          onChange={(e) => setFilterLicense(e.target.value)}
          className="px-3 py-2 text-xs font-mono rounded-xl bg-space-900/90 border border-border-subtle text-text-primary focus:border-cosmic-emerald focus:outline-none"
        >
          <option value="all">All Licenses</option>
          {RECOGNIZED_OPEN_SOURCE_LICENSES.slice(0, 8).map((lic) => (
            <option key={lic} value={lic}>
              {lic}
            </option>
          ))}
        </select>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900/40 border border-dashed border-border-subtle space-y-3">
          <FolderGit2 className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-base font-bold text-text-primary">No showcased projects found</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Submit legitimate open-source software with compliant licensing to showcase it to developers globally.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-cosmic-emerald/20 text-cosmic-emerald text-xs font-semibold hover:bg-cosmic-emerald/30 transition-colors"
          >
            Submit an open-source project &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((prj) => (
            <div
              key={prj.id}
              className="p-6 rounded-2xl bg-space-900/70 border border-border-subtle hover:border-cosmic-emerald/40 transition-all backdrop-blur-xl flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-text-primary group-hover:text-cosmic-emerald transition-colors">
                    {prj.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                      prj.isLicenseVerified
                        ? 'bg-cosmic-emerald/10 text-cosmic-emerald border border-cosmic-emerald/30'
                        : 'bg-cosmic-amber/10 text-cosmic-amber border border-cosmic-amber/30'
                    }`}
                  >
                    {prj.isLicenseVerified ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{prj.license}</span>
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{prj.description}</p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] font-mono text-text-muted">
                  <span>Maintainer: {prj.maintainerAttribution}</span>
                  <span>&bull;</span>
                  <span>{prj.verifiedReleaseVersion}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                <a
                  href={prj.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-cosmic-cyan transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Docs</span>
                </a>

                <a
                  href={prj.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-space-950 text-cosmic-emerald text-xs font-mono font-semibold border border-cosmic-emerald/30 hover:bg-cosmic-emerald/15 transition-all"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Repo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-space-900 border border-cosmic-emerald/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">Showcase Open-Source Project</h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                &times;
              </button>
            </div>

            {submitFeedback && (
              <div
                className={`p-3 rounded-lg text-xs font-mono ${
                  submitFeedback.success ? 'bg-cosmic-emerald/15 text-cosmic-emerald' : 'bg-cosmic-rose/15 text-cosmic-rose'
                }`}
              >
                {submitFeedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SQLiteStudio"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-emerald focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Official Repository URL (GitHub/GitLab/Codeberg) *</label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-emerald focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">License *</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-emerald focus:outline-none font-mono"
                  >
                    {RECOGNIZED_OPEN_SOURCE_LICENSES.map((lic) => (
                      <option key={lic} value={lic}>
                        {lic}
                      </option>
                    ))}
                    <option value="Other">Other / Unrecognized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Maintainer Attribution</label>
                  <input
                    type="text"
                    value={maintainer}
                    onChange={(e) => setMaintainer(e.target.value)}
                    placeholder="e.g. The SQLite Team"
                    className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-emerald focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive SQLite database desktop management tool with query execution and diagram designer."
                  className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-emerald focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Documentation URL</label>
                <input
                  type="url"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="https://sqlitestudio.pl/docs"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-emerald focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Install Command</label>
                <input
                  type="text"
                  value={installInstructions}
                  onChange={(e) => setInstallInstructions(e.target.value)}
                  placeholder="brew install --cask sqlitestudio"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-emerald focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-space-850 text-text-muted text-xs hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cosmic-emerald text-space-950 font-bold text-xs hover:shadow-glow-emerald"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
