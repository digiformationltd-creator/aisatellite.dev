import React, { useState } from 'react';
import { Sparkles, Copy, Check, Sliders, Shield, Terminal, ArrowRight, Code, Download } from 'lucide-react';
import { buildSystemPrompt } from '../../lib/knowledge/prompt-builder';

export default function PromptBuilderGalaxy() {
  const [taskCategory, setTaskCategory] = useState('coding_agent');
  const [techStack, setTechStack] = useState('TypeScript & React');
  const [desiredOutput, setDesiredOutput] = useState('Production Implementation with Tests');
  const [complexity, setComplexity] = useState('Senior / Production-Grade');
  const [constraints, setConstraints] = useState('Zero external runtime dependencies; strict TypeScript 5.x; accessible contrast');
  const [copied, setCopied] = useState(false);

  const generatedPrompt = buildSystemPrompt({
    taskCategory,
    techStack,
    desiredOutput,
    complexity,
    constraints,
  });

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    if (typeof document !== 'undefined') {
      const blob = new Blob([generatedPrompt], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-${taskCategory}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls Column */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <Sliders className="w-4 h-4" />
            Prompt Composition Controls
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-medium">Task Category</label>
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="coding_agent">Autonomous Coding Agent</option>
              <option value="software_architecture">Software Architecture & System Design</option>
              <option value="security_review">Application Security & Threat Model</option>
              <option value="database_design">Database Schema & Query Optimization</option>
              <option value="ui_ux_engineering">UI/UX & WebGL Component Engineering</option>
              <option value="seo_aeo_auditing">SEO & Answer Engine Optimization</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-medium">Target Tech Stack</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. Astro, React 19, Tailwind CSS"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-medium">Desired Output</label>
            <select
              value={desiredOutput}
              onChange={(e) => setDesiredOutput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="Production Implementation with Tests">Production Implementation with Tests</option>
              <option value="Technical Specification & Architecture RFC">Technical Specification & Architecture RFC</option>
              <option value="Security Audit & Remediation Matrix">Security Audit & Remediation Matrix</option>
              <option value="Troubleshooting Matrix with Code Fixes">Troubleshooting Matrix with Code Fixes</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-medium">Complexity Tier</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="Senior / Production-Grade">Senior / Production-Grade</option>
              <option value="Staff Architect / Enterprise">Staff Architect / Enterprise</option>
              <option value="Intermediate / Step-by-Step Guided">Intermediate / Step-by-Step Guided</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-medium">Constraints & Guidelines</label>
            <textarea
              rows={3}
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="Enforce zero external libraries, strict typing..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-cyan-500/10"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Prompt' : 'Copy System Prompt'}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-medium transition-colors"
              title="Download as Markdown file"
            >
              <Download className="w-4 h-4" />
              Export .md
            </button>
          </div>
        </div>

        {/* Right Generated Preview */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-300">Generated Master System Prompt</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SANDBOX ISOLATED
              </span>
            </div>

            <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[420px] p-4 rounded-xl bg-slate-900/60 border border-white/5 selection:bg-cyan-500/30">
              {generatedPrompt}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Tokens: ~{Math.round(generatedPrompt.length / 4)}</span>
            <span>Security: Input Sanitized (No Privilege Escalation)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
