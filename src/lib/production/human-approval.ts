/**
 * AI SATELLITE — PHASE 23 HUMAN EDITORIAL APPROVAL & REVISION WORKFLOW
 * Strictly enforces human-in-the-loop governance. No agent may bypass approval.
 * Canonical Domain: https://aisatellite.dev
 */

import type { HumanApprovalRecord, EditorialRevision, ArticleDraft } from './types';

export class HumanEditorialApprovalManager {
  private static instance: HumanEditorialApprovalManager;

  private approvals: Map<string, HumanApprovalRecord> = new Map();
  private revisions: Map<string, EditorialRevision[]> = new Map();

  public static getInstance(): HumanEditorialApprovalManager {
    if (!HumanEditorialApprovalManager.instance) {
      HumanEditorialApprovalManager.instance = new HumanEditorialApprovalManager();
    }
    return HumanEditorialApprovalManager.instance;
  }

  /**
   * Evaluates if an article has an authorized human approval on record.
   */
  public isApprovedForPublication(articleId: string): boolean {
    const record = this.approvals.get(articleId);
    return Boolean(record && record.decision === 'APPROVED');
  }

  /**
   * Records a human editorial approval decision with verified checks.
   */
  public submitApproval(params: {
    articleId: string;
    draftId: string;
    approverName: string;
    decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
    approvalNotes: string;
    rejectionReason?: string;
    approvedPublicationDate?: string;
    verifiedChecks: {
      claimsVerified: boolean;
      sourcesValid: boolean;
      technicalExamplesChecked: boolean;
      legalOrRegulatoryReviewed: boolean;
      commercialDisclosuresCorrect: boolean;
      ctasRelevant: boolean;
      articleOriginal: boolean;
      contentUseful: boolean;
      metadataValid: boolean;
    };
  }): HumanApprovalRecord {
    // If approved, all 9 checks must be verified true
    if (params.decision === 'APPROVED') {
      const allChecksTrue = Object.values(params.verifiedChecks).every((c) => c === true);
      if (!allChecksTrue) {
        throw new Error('Approval blocked: All 9 mandatory editorial verification checks must be verified true before approving publication.');
      }
    }

    const record: HumanApprovalRecord = {
      approvalId: `APP-${params.articleId}-${Date.now()}`,
      articleId: params.articleId,
      draftId: params.draftId,
      approverName: params.approverName,
      decision: params.decision,
      rejectionReason: params.rejectionReason,
      approvalNotes: params.approvalNotes,
      approvedPublicationDate: params.approvedPublicationDate,
      timestamp: new Date().toISOString(),
      verifiedChecks: params.verifiedChecks,
    };

    this.approvals.set(params.articleId, record);
    return record;
  }

  /**
   * Records an editorial revision and editor change requests.
   */
  public recordRevision(params: {
    draftId: string;
    editorName: string;
    comments: string[];
    requestedChanges: string[];
    sectionsModified: string[];
    previousContentSnapshot?: string;
  }): EditorialRevision {
    const revision: EditorialRevision = {
      revisionId: `REV-${params.draftId}-${Date.now()}`,
      draftId: params.draftId,
      editorName: params.editorName,
      comments: params.comments,
      requestedChanges: params.requestedChanges,
      sectionsModified: params.sectionsModified,
      timestamp: new Date().toISOString(),
      previousContentSnapshot: params.previousContentSnapshot,
    };

    const existing = this.revisions.get(params.draftId) || [];
    existing.push(revision);
    this.revisions.set(params.draftId, existing);

    return revision;
  }

  public getRevisions(draftId: string): EditorialRevision[] {
    return this.revisions.get(draftId) || [];
  }

  public getApproval(articleId: string): HumanApprovalRecord | undefined {
    return this.approvals.get(articleId);
  }

  public clearAll(): void {
    this.approvals.clear();
    this.revisions.clear();
  }
}

export const humanApprovalManager = HumanEditorialApprovalManager.getInstance();
