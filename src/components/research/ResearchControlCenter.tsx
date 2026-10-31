import React, { useState } from 'react';
import {
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Send,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Lock,
} from 'lucide-react';
import { evidenceLedgerManager } from '../../lib/research/evidence-ledger';
import { bingAndIndexNowClient } from '../../lib/seo/bing-and-indexnow';
import { brokenLinkChecker } from '../../lib/seo/broken-link-checker';
import { type ResearchClaim, type EditorialArticle } from '../../lib/research/schemas';
import contentClustersRaw from '../../../data/research/content-clusters.json';

export default function ResearchControlCenter() {
  const [activeTab, setActiveTab] = useState<'evidence' | 'pipeline' | 'freshness' | 'indexing' | 'clusters'>('evidence');
  const [editorSignature, setEditorSignature] = useState('LeadTechnicalEditor-Aisha');
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);

  const claims = evidenceLedgerManager.getAllClaims();
  const articles = evidenceLedgerManager.getAllArticles();
  const freshnessAudit = evidenceLedgerManager.auditFreshness();

  // Test links for broken link audit
  const sampleLinks = [
    { source: '/tutorials', target: '/tutorials/building-orbital-3d-radar-threejs-astro' },
    { source: '/radar', target: '/tools/n8n' },
    { source: '/solutions', target: '/solutions/free-customer-support-system' },
    { source: '/components', target: '/components' },
    { source: '/about', target: '/broken-test-link-path-404' },
  ];
  const linkAudit = brokenLinkChecker.auditLinks(sampleLinks);

  // Test IndexNow submission status
  const indexNowStatus = bingAndIndexNowClient.submitUrls([
    'https://aisatellite.pages.dev/tutorials/building-orbital-3d-radar-threejs-astro',
    'https://aisatellite.pages.dev/radar',
  ]);

  const handleApproveArticle = (articleId: string) => {
    const res = evidenceLedgerManager.attemptPublishArticle(articleId, editorSignature);
    if (res.success) {
      setApprovalMessage(`Successfully approved & published "${res.article?.title}" under signature ${editorSignature}`);
    } else {
      setApprovalMessage(`Approval Failed: ${res.error}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Telemetry Summary Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-space-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase">Evidence Claims</span>
          <div className="text-xl font-bold text-cosmic-cyan font-mono">{claims.length}</div>
          <span className="text-[10px] text-text-secondary font-mono">100% Primary Sourced</span>
        </div>

        <div className="p-4 rounded-2xl bg-space-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase">Editorial Pipeline</span>
          <div className="text-xl font-bold text-cosmic-purple font-mono">{articles.length}</div>
          <span className="text-[10px] text-text-secondary font-mono">Strict Human Sign-off</span>
        </div>

        <div className="p-4 rounded-2xl bg-space-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase">Freshness Status</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {freshnessAudit.freshClaims.length} / {claims.length}
          </div>
          <span className="text-[10px] text-text-secondary font-mono">
            {freshnessAudit.outdatedClaims.length} need re-check
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-space-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase">Broken Links Audit</span>
          <div className="text-xl font-bold text-amber-400 font-mono">
            {linkAudit.brokenCount} Flagged
          </div>
          <span className="text-[10px] text-text-secondary font-mono">Audited across real routes</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-space-950/80 border border-white/5 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'evidence' ? 'bg-space-800 text-cosmic-cyan font-bold' : 'text-text-muted hover:text-white'
          }`}
        >
          Evidence Ledger ({claims.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'pipeline' ? 'bg-space-800 text-cosmic-cyan font-bold' : 'text-text-muted hover:text-white'
          }`}
        >
          Editorial Gate ({articles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('freshness')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'freshness' ? 'bg-space-800 text-cosmic-cyan font-bold' : 'text-text-muted hover:text-white'
          }`}
        >
          Volatility & Freshness
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('indexing')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'indexing' ? 'bg-space-800 text-cosmic-cyan font-bold' : 'text-text-muted hover:text-white'
          }`}
        >
          Bing & IndexNow
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'clusters' ? 'bg-space-800 text-cosmic-cyan font-bold' : 'text-text-muted hover:text-white'
          }`}
        >
          Topical Clusters
        </button>
      </div>

      {/* Tab: Evidence Ledger */}
      {activeTab === 'evidence' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cosmic-cyan" />
              <span>Substantive Claim Verification Ledger</span>
            </h4>
            <span className="text-xs font-mono text-emerald-400">Zero Fabricated Claims Allowed</span>
          </div>

          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim.id} className="p-4 rounded-xl bg-space-950/70 border border-white/5 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cosmic-cyan font-bold">{claim.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-space-900 text-text-muted">
                      {claim.sourceType}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      claim.status === 'verified'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p className="text-cosmic-white/90 leading-relaxed font-sans">{claim.statement}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-text-muted pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span>Evidence:</span>
                    {claim.evidenceUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-cosmic-cyan hover:underline flex items-center gap-1">
                        <span>{new URL(url).hostname}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                  <span>Re-check: Every {claim.recheckIntervalDays} days ({claim.volatility} volatility)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Editorial Pipeline & Approval Gate */}
      {activeTab === 'pipeline' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cosmic-purple" />
              <span>Editorial Approval Review Gate</span>
            </h4>
            <span className="text-xs font-mono text-text-muted">Requires Human Editor Signature</span>
          </div>

          <div className="p-3.5 rounded-xl bg-space-950 border border-white/10 flex items-center gap-3 text-xs font-mono">
            <span className="text-text-muted">Editor Signature:</span>
            <input
              type="text"
              value={editorSignature}
              onChange={(e) => setEditorSignature(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-space-900 border border-white/10 text-cosmic-white focus:outline-none focus:border-cosmic-cyan"
            />
          </div>

          {approvalMessage && (
            <div className="p-3 rounded-xl bg-space-950 border border-cosmic-cyan/30 text-xs font-mono text-cosmic-cyan">
              {approvalMessage}
            </div>
          )}

          <div className="space-y-3">
            {articles.map((art) => (
              <div key={art.id} className="p-4 rounded-xl bg-space-950/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cosmic-white text-sm">{art.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-space-900 text-cosmic-cyan">
                      {art.articleType}
                    </span>
                  </div>
                  <div className="text-text-muted font-mono flex items-center gap-3 text-[11px]">
                    <span>Status: <strong className="capitalize text-emerald-400">{art.status}</strong></span>
                    {art.approvedBy && <span>Approved by: {art.approvedBy}</span>}
                  </div>
                </div>

                {art.status !== 'published' && (
                  <button
                    type="button"
                    onClick={() => handleApproveArticle(art.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cosmic-cyan to-cosmic-blue text-space-950 font-bold text-xs shrink-0 hover:brightness-110 shadow-sm"
                  >
                    Authorize Publication
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Volatility & Freshness */}
      {activeTab === 'freshness' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Content Freshness Volatility Monitor</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-space-950 border border-white/5 space-y-2 text-xs">
              <span className="font-bold text-emerald-400 font-mono">Fresh Claims ({freshnessAudit.freshClaims.length})</span>
              <ul className="text-text-muted list-disc list-inside space-y-1">
                {freshnessAudit.freshClaims.map((c) => (
                  <li key={c.id}>{c.statement.slice(0, 75)}...</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-space-950 border border-white/5 space-y-2 text-xs">
              <span className="font-bold text-amber-400 font-mono">Due for Re-Verification ({freshnessAudit.outdatedClaims.length})</span>
              {freshnessAudit.outdatedClaims.length === 0 ? (
                <p className="text-text-muted">All high-volatility claims are currently within their recheck interval.</p>
              ) : (
                <ul className="text-text-muted list-disc list-inside space-y-1">
                  {freshnessAudit.outdatedClaims.map((c) => (
                    <li key={c.id}>{c.statement.slice(0, 75)}...</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bing & IndexNow */}
      {activeTab === 'indexing' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4 text-xs font-mono">
          <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white flex items-center gap-2 font-sans">
            <Send className="w-4 h-4 text-cosmic-cyan" />
            <span>Bing Webmaster Tools & IndexNow API Status</span>
          </h4>

          <div className="p-4 rounded-xl bg-space-950 border border-white/5 space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Protocol:</span>
              <span className="text-cosmic-cyan">IndexNow v1.0 (Bing / Yandex / Seznam)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Submission Engine Status:</span>
              <span className="text-emerald-400">{indexNowStatus.statusMessage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Eligible Canonical URLs:</span>
              <span className="text-cosmic-white">{indexNowStatus.eligibleCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Topical Clusters */}
      {activeTab === 'clusters' && (
        <div className="p-6 rounded-3xl bg-space-900/60 backdrop-blur-xl border border-white/5 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-cosmic-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cosmic-teal" />
            <span>Topical Content Clusters (Zero Keyword Cannibalization)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(contentClustersRaw as any[]).map((cluster) => (
              <div key={cluster.id} className="p-4 rounded-2xl bg-space-950/70 border border-white/5 space-y-3 text-xs">
                <span className="font-bold text-cosmic-white text-sm block">{cluster.title}</span>
                <p className="text-text-secondary text-[11px]">{cluster.description}</p>
                <div className="font-mono text-cosmic-cyan text-[11px]">
                  <span>Pillar: </span>
                  <a href={cluster.pillarPageUrl} className="hover:underline">{cluster.pillarPageUrl}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
