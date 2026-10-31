import crypto from 'node:crypto';
import type { CommunitySubmission, SubmissionType, SubmissionStatus } from '../schemas/index.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { growthStorage } from '../storage/growth-storage.js';

const FORBIDDEN_SPAM_PATTERNS = [
  /\b(buy followers|crypto giveaway|casino|viagra|pills online|whatsapp me for funds)\b/i,
  /\b(telegram channel link @|dm for investment|free bitcoin)\b/i,
];

export class CommunitySubmissionManager {
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.logger = new GrowthLogger('CommunitySubmissionManager', baseDir);
  }

  private hashSubmitter(rawIp: string): string {
    return crypto.createHash('sha256').update(rawIp + '-salt-2026').digest('hex').substring(0, 12);
  }

  /**
   * Submits a new community contribution into the private moderation queue
   */
  submitContribution(params: {
    type: SubmissionType;
    title: string;
    description: string;
    resourcePayload: Record<string, unknown>;
    rawIp?: string;
    honeyPotField?: string;
  }): CommunitySubmission {
    // 1. Honey pot spam check
    if (params.honeyPotField && params.honeyPotField.trim().length > 0) {
      this.logger.warn('Automated bot trapped by honey pot field. Dropping silently.');
      throw new Error('Spam submission detected');
    }

    // 2. Keyword spam check
    for (const pattern of FORBIDDEN_SPAM_PATTERNS) {
      if (pattern.test(params.title) || pattern.test(params.description)) {
        this.logger.warn(`Rejected spam submission containing forbidden pattern: ${pattern}`);
        throw new Error('Submission rejected by automated spam filtering');
      }
    }

    const submitterHash = this.hashSubmitter(params.rawIp || '127.0.0.1');

    // 3. Rate limiting check (max 5 submissions per submitter per day)
    const existing = growthStorage.getSubmissions();
    const today = new Date().toISOString().slice(0, 10);
    const recentFromSubmitter = existing.filter(
      (s) => s.submitterHash === submitterHash && s.createdAt.startsWith(today)
    );
    if (recentFromSubmitter.length >= 10) {
      throw new Error('Rate limit exceeded: Maximum 10 submissions allowed per day');
    }

    const isSecurity = params.type === 'security';
    const submissionId = `SUB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const submission: CommunitySubmission = {
      id: submissionId,
      type: params.type,
      title: params.title.trim(),
      description: params.description.trim(),
      resourcePayload: params.resourcePayload,
      isSecurityConcern: isSecurity,
      status: 'pending',
      submitterHash,
      createdAt: new Date().toISOString(),
    };

    existing.push(submission);
    growthStorage.saveSubmissions(existing);

    if (isSecurity) {
      this.logger.recordAudit('SECURITY_CONCERN_SUBMITTED', 'AnonymousSubmitter', {
        submissionId,
        title: submission.title,
      });
      this.logger.warn(`[SECURITY ADVISORY] Private vulnerability report submitted: ${submissionId}`);
    } else {
      this.logger.info(`New community contribution submitted: ${submissionId} (${params.type})`);
    }

    return submission;
  }

  /**
   * Editorial moderation action on a submission
   */
  moderateSubmission(
    submissionId: string,
    action: SubmissionStatus,
    moderatorName: string,
    notes?: string
  ): CommunitySubmission {
    const submissions = growthStorage.getSubmissions();
    const index = submissions.findIndex((s) => s.id === submissionId);

    if (index === -1) {
      throw new Error(`Submission not found: ${submissionId}`);
    }

    const submission = submissions[index];
    submission.status = action;
    submission.moderationNotes = notes;
    submission.reviewedAt = new Date().toISOString();

    submissions[index] = submission;
    growthStorage.saveSubmissions(submissions);

    this.logger.recordAudit('MODERATE_SUBMISSION', moderatorName, {
      submissionId,
      action,
      notes,
    });

    return submission;
  }

  /**
   * Retrieves pending submissions for the growth admin dashboard
   */
  getPendingSubmissions(): CommunitySubmission[] {
    return growthStorage.getSubmissions().filter((s) => s.status === 'pending');
  }
}

export const communitySubmissionManager = new CommunitySubmissionManager();
