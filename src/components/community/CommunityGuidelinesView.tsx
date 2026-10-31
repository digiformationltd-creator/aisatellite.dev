import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Scale,
  HeartHandshake,
  FileCode,
  Terminal,
} from 'lucide-react';

export default function CommunityGuidelinesView() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Guidelines Header */}
      <div className="p-8 rounded-3xl bg-space-900/80 border border-cosmic-cyan/30 shadow-orbital-glass backdrop-blur-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/30 text-cosmic-cyan text-xs font-mono">
          <Scale className="w-3.5 h-3.5" />
          <span>Community Standards & Moderation Charter</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          AI Satellite Community Guidelines
        </h1>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          AI Satellite is dedicated to expanding verified developer knowledge, discovering free software alternatives,
          and enabling authentic open-source collaboration. Our mission is built on usefulness, technical precision, and integrity.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-2 text-cosmic-cyan">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-text-primary">1. Evidence & Grounded Technical Solutions</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Prioritize technical accuracy over speculative answers. Include reproducible code snippets, runtime versions,
            and links to verified upstream documentation whenever answering questions or reporting technical defects.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-2 text-cosmic-emerald">
            <FileCode className="w-5 h-5" />
            <h2 className="text-base font-bold text-text-primary">2. Verified Open-Source Licensing</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Every repository submitted to the Open-Source Showcase must carry a recognized OSI or permissive open-source license
            (e.g., MIT, Apache-2.0, GPL, BSD). Public access alone does not make code freely reusable software.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-2 text-cosmic-amber">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base font-bold text-text-primary">3. Zero Synthetic Engagement</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Do not automate upvotes, stars, follows, or comments. Fabricated reviews, sock-puppet accounts, and artificial reputation farming
            are strictly prohibited and result in permanent suspension.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-2 text-cosmic-violet">
            <HeartHandshake className="w-5 h-5" />
            <h2 className="text-base font-bold text-text-primary">4. Respectful & Inclusive Collaboration</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Harassment, discriminatory remarks, spam, and demeaning behavior have zero tolerance. Maintain professional, constructive
            dialogue during technical debates, code reviews, and alternative evaluations.
          </p>
        </div>
      </div>

      {/* Enforcement & Appeals */}
      <div className="p-8 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cosmic-rose" />
          <span>Moderation Enforcement & Transparent Appeals</span>
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Moderators take action to safeguard community integrity through content hiding, correction requests, and account restrictions.
          All actions are recorded in an immutable staff audit log. Any affected developer has the right to file a written appeal
          via the Moderation Center, which is reviewed by a separate lead moderator.
        </p>

        <div className="pt-2">
          <a
            href="/community/moderation"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cosmic-cyan hover:underline"
          >
            <span>Open Moderation Center &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
