import React from 'react';
import {
  User,
  Globe,
  Award,
  ShieldCheck,
  FolderGit2,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowLeft,
  Terminal,
} from 'lucide-react';
import type { PublicProfile, ContributionRecord, CollaborativeCollection } from '../../lib/community/types';

interface PublicProfileViewProps {
  profile?: PublicProfile;
  contributions?: ContributionRecord[];
  publicCollections?: CollaborativeCollection[];
  isOwner?: boolean;
}

export default function PublicProfileView({
  profile,
  contributions = [],
  publicCollections = [],
  isOwner = false,
}: PublicProfileViewProps) {
  if (!profile || (!profile.isPublicProfile && !isOwner)) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 px-6 text-center rounded-3xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
        <Lock className="w-12 h-12 text-cosmic-cyan/50 mx-auto" />
        <h2 className="text-xl font-bold text-text-primary">Profile is Private or Unavailable</h2>
        <p className="text-sm text-text-secondary">
          This developer profile is either private or has not yet opted into public community discovery.
        </p>
        <div className="pt-2">
          <a
            href="/community"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-space-850 hover:bg-space-800 text-xs font-semibold text-cosmic-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Community</span>
          </a>
        </div>
      </div>
    );
  }

  const badgeLabels: Record<string, { label: string; color: string }> = {
    early_contributor: { label: 'Early Contributor', color: 'text-cosmic-cyan border-cosmic-cyan/40 bg-cosmic-cyan/10' },
    open_source_champion: { label: 'Open-Source Champion', color: 'text-cosmic-emerald border-cosmic-emerald/40 bg-cosmic-emerald/10' },
    troubleshooter: { label: 'Troubleshooter', color: 'text-cosmic-violet border-cosmic-violet/40 bg-cosmic-violet/10' },
    verified_curator: { label: 'Verified Curator', color: 'text-cosmic-amber border-cosmic-amber/40 bg-cosmic-amber/10' },
    prompt_architect: { label: 'Prompt Architect', color: 'text-cosmic-rose border-cosmic-rose/40 bg-cosmic-rose/10' },
    code_steward: { label: 'Code Steward', color: 'text-text-primary border-border-subtle bg-space-950' },
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Profile Header Glass Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-space-900/80 border border-cosmic-cyan/25 shadow-orbital-glass backdrop-blur-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-space-950 border border-cosmic-cyan/30 flex items-center justify-center text-cosmic-cyan font-bold text-2xl font-mono shadow-glow-cyan/20">
              {profile.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary flex items-center gap-2">
                <span>{profile.displayName}</span>
                <span title="Verified Community Member">
                  <ShieldCheck className="w-5 h-5 text-cosmic-cyan" />
                </span>
              </h1>
              <div className="text-xs font-mono text-cosmic-cyan">@{profile.username}</div>
              <div className="flex items-center gap-2 text-xs text-text-muted font-mono pt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2 text-right">
            <div className="px-4 py-2 rounded-2xl bg-space-950/80 border border-border-subtle text-right">
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider">Reputation</div>
              <div className="text-2xl font-mono font-black text-cosmic-cyan">{profile.reputationScore}</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-text-secondary leading-relaxed border-t border-border-subtle pt-4">
            {profile.bio}
          </p>
        )}

        {/* Technical Interests */}
        {profile.technicalInterests.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-text-muted uppercase tracking-wider">Technical Focus</div>
            <div className="flex items-center gap-2 flex-wrap">
              {profile.technicalInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-space-950 text-cosmic-cyan border border-cosmic-cyan/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        <div className="flex items-center gap-4 text-xs font-mono pt-3 border-t border-border-subtle flex-wrap">
          {profile.githubUsername && (
            <a
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors"
            >
              <FolderGit2 className="w-4 h-4 text-cosmic-cyan" />
              <span>github.com/{profile.githubUsername}</span>
            </a>
          )}

          {profile.publicWebsite && (
            <a
              href={profile.publicWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Globe className="w-4 h-4 text-cosmic-emerald" />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>

      {/* Earned Badges */}
      {profile.badges.length > 0 && (
        <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cosmic-amber" />
            <h2 className="text-base font-bold text-text-primary">Earned Recognition & Badges</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.badges.map((badgeKey) => {
              const meta = badgeLabels[badgeKey] || { label: badgeKey, color: 'text-text-primary border-border-subtle' };
              return (
                <div
                  key={badgeKey}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 ${meta.color}`}
                >
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-mono font-bold">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Verified Public Contributions */}
      <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cosmic-emerald" />
            <h2 className="text-base font-bold text-text-primary">Verified Community Contributions</h2>
          </div>
          <span className="text-xs font-mono text-text-muted">{contributions.length} recorded</span>
        </div>

        {contributions.length === 0 ? (
          <div className="py-6 text-center text-xs text-text-muted">
            No verified public contributions recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {contributions.map((c) => (
              <div key={c.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-text-primary">{c.resourceTitle}</div>
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-0.5">
                    {c.type} &bull; {new Date(c.verifiedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-cosmic-emerald">+{c.pointsAwarded} pts</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public Curated Collections */}
      {publicCollections.length > 0 && (
        <div className="p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-cosmic-cyan" />
            <h2 className="text-base font-bold text-text-primary">Public Collections Curated</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publicCollections.map((col) => (
              <div key={col.id} className="p-4 rounded-xl bg-space-950/70 border border-border-subtle space-y-2">
                <h3 className="text-sm font-bold text-text-primary">{col.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2">{col.description}</p>
                <div className="text-[10px] font-mono text-text-muted pt-1">
                  {col.resourceIds.length} resources &bull; v{col.version}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
