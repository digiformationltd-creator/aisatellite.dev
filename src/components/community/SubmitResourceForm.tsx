import React, { useState } from 'react';
import {
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { SubmissionCategory } from '../../lib/community/types';

export default function SubmitResourceForm() {
  const [category, setCategory] = useState<SubmissionCategory>('free_alternative');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [license, setLicense] = useState('MIT');
  const [replacesPaidTool, setReplacesPaidTool] = useState('');
  const [tags, setTags] = useState('');
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !description.trim()) {
      setFeedback({ success: false, message: 'Please complete all required fields.' });
      return;
    }

    setFeedback({
      success: true,
      message:
        'Thank you! Your resource submission has been queued for editorial verification. Approved submissions earn reputation points and appear across AI Satellite knowledge indexes.',
    });

    setTitle('');
    setUrl('');
    setDescription('');
    setReplacesPaidTool('');
    setTags('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-space-900/80 border border-cosmic-cyan/30 shadow-orbital-glass backdrop-blur-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/30 text-cosmic-cyan text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Community Contribution Queue</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Submit a Technology Resource
        </h1>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Help developers worldwide discover verified free alternatives, legitimate open-source software, AI tools, and
          practical engineering workflows.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono leading-relaxed ${
            feedback.success
              ? 'bg-cosmic-emerald/15 border-cosmic-emerald/40 text-cosmic-emerald'
              : 'bg-cosmic-rose/15 border-cosmic-rose/40 text-cosmic-rose'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Submission Form Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">Resource Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SubmissionCategory)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
          >
            <option value="free_alternative">Free Alternative (Replaces Paid SaaS)</option>
            <option value="open_source_tool">Open-Source Tool / Framework</option>
            <option value="ai_tool">AI Developer Tool</option>
            <option value="mcp_server">MCP Server (Model Context Protocol)</option>
            <option value="free_api">Free Developer API</option>
            <option value="ai_prompt">Vetted System Prompt</option>
            <option value="coding_tutorial">Technical Tutorial</option>
            <option value="css_component">CSS / UI Component</option>
            <option value="threejs_example">Three.js / WebGL Example</option>
            <option value="automation_workflow">Automation Blueprint</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">Resource Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. MinIO High Performance Object Storage"
            className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">Official URL (HTTPS) *</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://min.io"
            className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none font-mono"
          />
        </div>

        {category === 'free_alternative' && (
          <div>
            <label className="block text-xs font-mono text-text-muted mb-1">Replaces Which Paid SaaS / Tool?</label>
            <input
              type="text"
              value={replacesPaidTool}
              onChange={(e) => setReplacesPaidTool(e.target.value)}
              placeholder="e.g. AWS S3, Google Cloud Storage"
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">Description & Key Capabilities *</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain why this tool is useful, self-hosting requirements, or key benchmarks..."
            className="w-full p-3.5 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-text-muted mb-1">License (if applicable)</label>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="e.g. AGPL-3.0, MIT, Apache-2.0"
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-text-muted mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="storage, s3, docker, self-hosted"
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs sm:text-sm hover:shadow-glow-cyan transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit for Editorial Review</span>
          </button>
        </div>
      </form>
    </div>
  );
}
