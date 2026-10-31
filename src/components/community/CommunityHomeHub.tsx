import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  HelpCircle,
  FolderGit2,
  BookmarkCheck,
  Award,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type {
  CommunityDiscussion,
  CommunityQuestion,
  ProjectShowcase,
  PublicProfile,
} from '../../lib/community/types';
import { DISCUSSION_CATEGORIES } from '../../lib/community/types';

interface CommunityHomeProps {
  initialDiscussions?: CommunityDiscussion[];
  initialQuestions?: CommunityQuestion[];
  initialProjects?: ProjectShowcase[];
  topContributors?: Array<{
    userId: string;
    username: string;
    displayName: string;
    reputationScore: number;
    badges: string[];
    contributionCount: number;
  }>;
}

export default function CommunityHomeHub({
  initialDiscussions = [],
  initialQuestions = [],
  initialProjects = [],
  topContributors = [],
}: CommunityHomeProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'opportunities'>('overview');

  return (
    <div className="w-full space-y-12">
      {/* Cinematic Orbital Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-space-900/90 via-space-950/80 to-space-900/50 border border-cosmic-cyan/20 shadow-orbital-glass backdrop-blur-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cosmic-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cosmic-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-cyan/10 border border-cosmic-cyan/30 text-cosmic-cyan text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Global Developer Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            One Satellite. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-cyan via-text-primary to-cosmic-violet">
              The Entire World of Technology.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            A verified developer community built for authentic technical collaboration. Share free software alternatives,
            showcase open-source repositories, solve real-world engineering challenges, and build an evidence-backed
            contribution profile.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/community/discussions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-sm transition-all hover:shadow-glow-cyan hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Explore Discussions</span>
            </a>

            <a
              href="/community/submit-resource"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-space-900/90 hover:bg-space-850 text-text-primary border border-cosmic-cyan/30 text-sm font-semibold transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 text-cosmic-cyan" />
              <span>Submit Resource</span>
            </a>

            <a
              href="/community/guidelines"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent hover:bg-space-900/50 text-text-muted hover:text-cosmic-cyan text-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Guidelines</span>
            </a>
          </div>
        </div>

        {/* Community Pillars Quick Metric Badges */}
        <div className="mt-8 pt-6 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-space-950/60 border border-border-subtle">
            <div className="text-xl font-mono font-bold text-cosmic-cyan">0%</div>
            <div className="text-xs text-text-muted mt-0.5">Synthetic Stats</div>
          </div>
          <div className="p-3 rounded-xl bg-space-950/60 border border-border-subtle">
            <div className="text-xl font-mono font-bold text-cosmic-violet">100%</div>
            <div className="text-xs text-text-muted mt-0.5">Verified Evidence</div>
          </div>
          <div className="p-3 rounded-xl bg-space-950/60 border border-border-subtle">
            <div className="text-xl font-mono font-bold text-cosmic-emerald">OSI</div>
            <div className="text-xs text-text-muted mt-0.5">License Checked</div>
          </div>
          <div className="p-3 rounded-xl bg-space-950/60 border border-border-subtle">
            <div className="text-xl font-mono font-bold text-cosmic-amber">Opt-In</div>
            <div className="text-xs text-text-muted mt-0.5">Public Privacy</div>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary hover:bg-space-900/50'
            }`}
          >
            Community Pulse
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary hover:bg-space-900/50'
            }`}
          >
            Technical Categories (12)
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'opportunities'
                ? 'bg-cosmic-cyan/15 text-cosmic-cyan border border-cosmic-cyan/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary hover:bg-space-900/50'
            }`}
          >
            Contribution Opportunities
          </button>
        </div>

        <a
          href="/community/moderation"
          className="text-xs font-mono text-text-muted hover:text-cosmic-rose flex items-center gap-1 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Moderation Center</span>
        </a>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Main 2-column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Discussions & Questions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Technical Discussions Card */}
              <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cosmic-cyan" />
                    <h2 className="text-lg font-bold text-text-primary">Recent Technical Discussions</h2>
                  </div>
                  <a
                    href="/community/discussions"
                    className="text-xs text-cosmic-cyan hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {initialDiscussions.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-border-subtle rounded-xl space-y-2">
                    <p className="text-sm text-text-muted">No discussions posted yet.</p>
                    <a
                      href="/community/discussions"
                      className="text-xs text-cosmic-cyan hover:underline inline-block font-semibold"
                    >
                      Start the first discussion &rarr;
                    </a>
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle">
                    {initialDiscussions.slice(0, 4).map((disc) => (
                      <div key={disc.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-cosmic-cyan bg-cosmic-cyan/10 px-2 py-0.5 rounded">
                            {disc.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-text-muted font-mono">{disc.replyCount} replies</span>
                        </div>
                        <a
                          href={`/community/discussions#${disc.id}`}
                          className="block text-sm font-semibold text-text-primary hover:text-cosmic-cyan transition-colors"
                        >
                          {disc.title}
                        </a>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <span>By @{disc.authorUsername}</span>
                          <span>&bull;</span>
                          <span>{new Date(disc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Developer Q&A Card */}
              <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cosmic-violet" />
                    <h2 className="text-lg font-bold text-text-primary">Developer Questions & Answers</h2>
                  </div>
                  <a
                    href="/community/qa"
                    className="text-xs text-cosmic-violet hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Browse Q&A</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {initialQuestions.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-border-subtle rounded-xl space-y-2">
                    <p className="text-sm text-text-muted">No developer questions posted yet.</p>
                    <a
                      href="/community/qa"
                      className="text-xs text-cosmic-violet hover:underline inline-block font-semibold"
                    >
                      Ask a technical question &rarr;
                    </a>
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle">
                    {initialQuestions.slice(0, 4).map((q) => (
                      <div key={q.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {q.isAnswered && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cosmic-emerald bg-cosmic-emerald/10 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Accepted Answer</span>
                              </span>
                            )}
                            <span className="text-xs text-text-muted font-mono">{q.answerCount} answers</span>
                          </div>
                          <span className="text-xs text-text-muted font-mono">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <a
                          href={`/community/qa#${q.id}`}
                          className="block text-sm font-semibold text-text-primary hover:text-cosmic-violet transition-colors"
                        >
                          {q.title}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Open Source Showcase & Top Contributors */}
            <div className="space-y-8">
              {/* Open-Source Project Showcase */}
              <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-cosmic-emerald" />
                    <h2 className="text-base font-bold text-text-primary">Open-Source Showcase</h2>
                  </div>
                  <a
                    href="/community/projects"
                    className="text-xs text-cosmic-emerald hover:underline font-semibold"
                  >
                    View all &rarr;
                  </a>
                </div>

                {initialProjects.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-border-subtle rounded-xl space-y-2">
                    <p className="text-xs text-text-muted">No open-source repositories featured yet.</p>
                    <a
                      href="/community/projects"
                      className="text-xs text-cosmic-emerald hover:underline font-semibold"
                    >
                      Showcase a repository &rarr;
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {initialProjects.slice(0, 3).map((prj) => (
                      <div key={prj.id} className="p-3.5 rounded-xl bg-space-950/60 border border-border-subtle space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text-primary">{prj.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cosmic-emerald/10 text-cosmic-emerald">
                            {prj.license}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2">{prj.description}</p>
                        <a
                          href={prj.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-cosmic-cyan hover:underline"
                        >
                          <span>Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contributors Recognition Leaderboard */}
              <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-cosmic-amber" />
                    <h2 className="text-base font-bold text-text-primary">Verified Contributors</h2>
                  </div>
                  <a
                    href="/community/contributors"
                    className="text-xs text-cosmic-amber hover:underline font-semibold"
                  >
                    Leaderboard &rarr;
                  </a>
                </div>

                {topContributors.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-border-subtle rounded-xl space-y-1">
                    <p className="text-xs text-text-muted">Be the first verified contributor.</p>
                    <p className="text-[11px] text-text-secondary">Earn recognition by submitting software or answering questions.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {topContributors.slice(0, 5).map((c, i) => (
                      <a
                        key={c.userId}
                        href={`/u/${c.username}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-space-950/60 hover:bg-space-850 transition-colors border border-border-subtle group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-text-muted w-4">#{i + 1}</span>
                          <div>
                            <div className="text-xs font-semibold text-text-primary group-hover:text-cosmic-cyan">
                              {c.displayName}
                            </div>
                            <div className="text-[10px] text-text-muted font-mono">@{c.username}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-cosmic-amber">{c.reputationScore} pts</div>
                          <div className="text-[10px] text-text-muted">{c.contributionCount} verified</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISCUSSION_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/community/discussions?category=${cat.id}`}
              className="p-5 rounded-2xl bg-space-900/60 hover:bg-space-850/80 border border-border-subtle hover:border-cosmic-cyan/40 transition-all group backdrop-blur-xl space-y-2"
            >
              <div className="text-xs font-mono text-cosmic-cyan uppercase tracking-wider">
                {cat.id.replace('_', ' ')}
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-cosmic-cyan transition-colors">
                {cat.label}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">{cat.description}</p>
              <div className="pt-2 text-xs font-semibold text-cosmic-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Threads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Tab: Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="p-8 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl font-bold text-text-primary">How to Contribute to AI Satellite</h2>
            <p className="text-sm text-text-secondary">
              Every verified submission helps developers worldwide discover free tools, replace proprietary lock-in, and build smarter software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-space-950/60 border border-border-subtle space-y-2">
              <span className="text-xs font-mono text-cosmic-cyan font-bold">+25 REPUTATION</span>
              <h3 className="text-sm font-bold text-text-primary">Submit a Free Alternative</h3>
              <p className="text-xs text-text-secondary">Suggest verified open-source or free alternatives to paid enterprise tools.</p>
              <a href="/community/submit-resource" className="text-xs text-cosmic-cyan font-semibold block pt-1 hover:underline">
                Submit Alternative &rarr;
              </a>
            </div>

            <div className="p-4 rounded-xl bg-space-950/60 border border-border-subtle space-y-2">
              <span className="text-xs font-mono text-cosmic-emerald font-bold">+20 REPUTATION</span>
              <h3 className="text-sm font-bold text-text-primary">Showcase Open Source</h3>
              <p className="text-xs text-text-secondary">Add legitimate open-source repositories with compliant OSI licenses.</p>
              <a href="/community/projects" className="text-xs text-cosmic-emerald font-semibold block pt-1 hover:underline">
                Showcase Repository &rarr;
              </a>
            </div>

            <div className="p-4 rounded-xl bg-space-950/60 border border-border-subtle space-y-2">
              <span className="text-xs font-mono text-cosmic-violet font-bold">+15 REPUTATION</span>
              <h3 className="text-sm font-bold text-text-primary">Answer Developer Q&A</h3>
              <p className="text-xs text-text-secondary">Provide technically grounded solutions with code examples.</p>
              <a href="/community/qa" className="text-xs text-cosmic-violet font-semibold block pt-1 hover:underline">
                Browse Questions &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
