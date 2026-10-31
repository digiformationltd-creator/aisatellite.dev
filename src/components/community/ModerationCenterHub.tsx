import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Clock,
  User,
  History,
  Lock,
} from 'lucide-react';
import type {
  CommunityReport,
  ModerationAction,
  ModerationAppeal,
  ProjectShowcase,
  ResourceSubmission,
} from '../../lib/community/types';

interface ModerationCenterHubProps {
  initialReports?: CommunityReport[];
  initialActions?: ModerationAction[];
  initialAppeals?: ModerationAppeal[];
  pendingProjects?: ProjectShowcase[];
  pendingSubmissions?: ResourceSubmission[];
}

export default function ModerationCenterHub({
  initialReports = [],
  initialActions = [],
  initialAppeals = [],
  pendingProjects = [],
  pendingSubmissions = [],
}: ModerationCenterHubProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'submissions' | 'appeals' | 'log'>('reports');
  const [reports, setReports] = useState<CommunityReport[]>(initialReports);
  const [actions, setActions] = useState<ModerationAction[]>(initialActions);
  const [appeals, setAppeals] = useState<ModerationAppeal[]>(initialAppeals);
  const [projects, setProjects] = useState<ProjectShowcase[]>(pendingProjects);
  const [submissions, setSubmissions] = useState<ResourceSubmission[]>(pendingSubmissions);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleApproveProject = (id: string, name: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    const newAction: ModerationAction = {
      id: `act-${Date.now()}`,
      moderatorId: 'mod-current',
      moderatorUsername: 'moderator-lead',
      action: 'approve_submission',
      targetType: 'project',
      targetId: id,
      reason: `Verified open-source repository and license compliance for ${name}.`,
      timestamp: new Date().toISOString(),
    };
    setActions([newAction, ...actions]);
    setActionFeedback(`Approved project: ${name}`);
  };

  const handleRejectProject = (id: string, name: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    const newAction: ModerationAction = {
      id: `act-${Date.now()}`,
      moderatorId: 'mod-current',
      moderatorUsername: 'moderator-lead',
      action: 'reject_submission',
      targetType: 'project',
      targetId: id,
      reason: `Does not meet open-source software verification criteria.`,
      timestamp: new Date().toISOString(),
    };
    setActions([newAction, ...actions]);
    setActionFeedback(`Rejected project: ${name}`);
  };

  const handleResolveReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
    setActionFeedback('Report marked resolved.');
  };

  return (
    <div className="w-full space-y-6">
      {/* Moderation Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-space-900/60 border border-cosmic-rose/30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cosmic-rose/15 border border-cosmic-rose/30 flex items-center justify-center text-cosmic-rose">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Community Moderation Command</h1>
            <p className="text-xs text-text-secondary">
              Review reports, editorial submissions, user appeals, and complete transparency audit logs.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-space-950 text-text-muted border border-border-subtle">
          Staff Audit Active
        </span>
      </div>

      {actionFeedback && (
        <div className="p-3 rounded-xl bg-cosmic-cyan/15 border border-cosmic-cyan/30 text-xs font-mono text-cosmic-cyan">
          {actionFeedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-cosmic-rose/20 text-cosmic-rose border border-cosmic-rose/40'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Open Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-cosmic-rose/20 text-cosmic-rose border border-cosmic-rose/40'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Review Queue ({projects.length + submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('appeals')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'appeals'
              ? 'bg-cosmic-rose/20 text-cosmic-rose border border-cosmic-rose/40'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Appeals ({appeals.length})
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'log'
              ? 'bg-cosmic-rose/20 text-cosmic-rose border border-cosmic-rose/40'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Audit History ({actions.length})
        </button>
      </div>

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-space-900/40 border border-dashed border-border-subtle text-xs text-text-muted">
              No open reports. All community items are clean.
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="p-4 rounded-xl bg-space-900/60 border border-border-subtle flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cosmic-rose/15 text-cosmic-rose">
                      {r.reason}
                    </span>
                    <span className="text-xs text-text-muted font-mono">Target: {r.targetType} #{r.targetId}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{r.details}</p>
                </div>
                <button
                  onClick={() => handleResolveReport(r.id)}
                  className="px-3 py-1.5 rounded-lg bg-space-950 text-xs text-cosmic-cyan border border-border-subtle hover:bg-space-850"
                >
                  Resolve
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Submissions Queue */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Pending Open-Source Showcases</h2>
          {projects.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border-subtle rounded-xl">
              No pending open-source repository submissions.
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-space-900/60 border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-text-primary">{p.name}</span>
                  <span className="text-xs font-mono text-cosmic-emerald">{p.license}</span>
                </div>
                <p className="text-xs text-text-secondary">{p.description}</p>
                <div className="text-[11px] font-mono text-cosmic-cyan">{p.repoUrl}</div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                  <button
                    onClick={() => handleRejectProject(p.id, p.name)}
                    className="px-3 py-1.5 rounded-lg bg-cosmic-rose/15 text-cosmic-rose text-xs font-mono hover:bg-cosmic-rose/25"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveProject(p.id, p.name)}
                    className="px-3 py-1.5 rounded-lg bg-cosmic-emerald text-space-950 text-xs font-mono font-bold hover:shadow-glow-emerald"
                  >
                    Approve & Publish (+20 Rep)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Appeals */}
      {activeTab === 'appeals' && (
        <div className="space-y-3">
          {appeals.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-space-900/40 border border-dashed border-border-subtle text-xs text-text-muted">
              No pending user appeals.
            </div>
          ) : (
            appeals.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-space-900/60 border border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                  <span>Appeal for Action #{a.moderationActionId}</span>
                  <span className="text-cosmic-amber uppercase">{a.status}</span>
                </div>
                <p className="text-xs text-text-secondary">{a.statement}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'log' && (
        <div className="space-y-2">
          {actions.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border-subtle rounded-xl">
              Audit log is clear.
            </div>
          ) : (
            actions.map((act) => (
              <div key={act.id} className="p-3 rounded-xl bg-space-950/70 border border-border-subtle flex items-center justify-between text-xs font-mono">
                <div className="space-y-0.5">
                  <span className="text-cosmic-cyan font-bold">{act.action}</span>
                  <span className="text-text-muted"> on {act.targetType} #{act.targetId}</span>
                  <p className="text-[11px] text-text-secondary">{act.reason}</p>
                </div>
                <span className="text-text-muted text-[10px]">{new Date(act.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
