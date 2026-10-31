import React, { useState } from 'react';
import {
  Award,
  Search,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ContributorItem {
  userId: string;
  username: string;
  displayName: string;
  reputationScore: number;
  badges: string[];
  contributionCount: number;
}

interface ContributorsHubProps {
  contributors?: ContributorItem[];
}

export default function ContributorsHub({ contributors = [] }: ContributorsHubProps) {
  const [search, setSearch] = useState('');

  const filtered = contributors.filter(
    (c) =>
      search === '' ||
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-space-900/80 border border-cosmic-amber/30 shadow-orbital-glass backdrop-blur-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-amber/10 border border-cosmic-amber/30 text-cosmic-amber text-xs font-mono">
          <Award className="w-3.5 h-3.5" />
          <span>Verified Community Recognition</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Contributor Leaderboard
        </h1>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Recognition awarded strictly for verified contributions: accepted technical solutions, validated open-source software,
          and curated free alternatives. Zero synthetic points.
        </p>

        <div className="pt-2 flex items-center gap-4 text-xs font-mono text-text-muted">
          <span>+25 Free Alternative</span>
          <span>&bull;</span>
          <span>+20 Open-Source Project</span>
          <span>&bull;</span>
          <span>+15 Accepted Answer</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contributors by name or username..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-space-900/80 border border-border-subtle focus:border-cosmic-amber focus:outline-none text-text-primary placeholder:text-text-muted"
        />
      </div>

      {/* Contributors List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900/40 border border-dashed border-border-subtle space-y-3">
          <Award className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-base font-bold text-text-primary">No contributors yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Be the very first verified contributor! Submit software or answer a developer question to earn reputation.
          </p>
          <a
            href="/community/submit-resource"
            className="inline-block px-4 py-2 rounded-xl bg-cosmic-amber/20 text-cosmic-amber text-xs font-semibold hover:bg-cosmic-amber/30 transition-colors"
          >
            Submit Software &rarr;
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, index) => (
            <div
              key={c.userId}
              className="p-4 sm:p-5 rounded-2xl bg-space-900/70 border border-border-subtle hover:border-cosmic-amber/40 transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`text-sm sm:text-base font-mono font-bold w-6 text-center ${
                    index === 0
                      ? 'text-cosmic-amber'
                      : index === 1
                      ? 'text-cosmic-cyan'
                      : index === 2
                      ? 'text-cosmic-emerald'
                      : 'text-text-muted'
                  }`}
                >
                  #{index + 1}
                </span>

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-space-950 border border-border-subtle flex items-center justify-center font-mono font-bold text-cosmic-cyan">
                  {c.displayName.slice(0, 2).toUpperCase()}
                </div>

                <div className="space-y-0.5">
                  <a
                    href={`/u/${c.username}`}
                    className="text-sm sm:text-base font-bold text-text-primary hover:text-cosmic-amber transition-colors flex items-center gap-1.5"
                  >
                    <span>{c.displayName}</span>
                    <ShieldCheck className="w-4 h-4 text-cosmic-cyan" />
                  </a>
                  <div className="text-xs font-mono text-text-muted">@{c.username}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div className="hidden sm:block">
                  <div className="text-xs font-mono text-text-muted uppercase">Contributions</div>
                  <div className="text-sm font-mono font-semibold text-text-primary">{c.contributionCount} verified</div>
                </div>

                <div>
                  <div className="text-xs font-mono text-text-muted uppercase">Reputation</div>
                  <div className="text-base sm:text-lg font-mono font-black text-cosmic-amber">{c.reputationScore}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
