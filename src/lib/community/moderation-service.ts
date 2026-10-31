/**
 * AI Satellite — Community Moderation Center Service (Phase 13)
 * Enforces community guidelines, processes abuse reports, manages content takedowns,
 * logs moderator audit events, and handles user appeals.
 */

import crypto from 'node:crypto';
import { communityDatabase } from './database';
import {
  CreateReportSchema,
  SubmitAppealSchema,
  type CommunityReport,
  type ModerationAction,
  type ModerationAppeal,
} from './types';
import { spamPreventionService } from './spam-prevention';

export class ModerationService {
  /**
   * Reports an abusive or rule-violating community entity.
   */
  public reportContent(
    reporterId: string,
    input: {
      targetType: 'discussion' | 'reply' | 'question' | 'answer' | 'project' | 'profile';
      targetId: string;
      reason: 'spam' | 'abuse' | 'misinformation' | 'license_violation' | 'duplicate' | 'other';
      details: string;
    }
  ): { success: boolean; report?: CommunityReport; error?: string } {
    const rate = spamPreventionService.checkRateLimit(reporterId, 'report_content', 10, 60000);
    if (!rate.allowed) {
      return { success: false, error: 'Reporting rate limit reached. Please wait.' };
    }

    const validated = CreateReportSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid report details' };
    }

    const now = new Date().toISOString();
    const id = `rep-${crypto.randomBytes(6).toString('hex')}`;

    const report: CommunityReport = {
      id,
      reporterId,
      targetType: input.targetType,
      targetId: input.targetId,
      reason: input.reason,
      details: spamPreventionService.sanitizeContent(input.details.trim()),
      status: 'open',
      createdAt: now,
    };

    communityDatabase.saveReport(report);
    return { success: true, report };
  }

  /**
   * Hides abusive content (Moderator action).
   */
  public hideContent(
    moderatorId: string,
    moderatorUsername: string,
    targetType: 'discussion' | 'reply',
    targetId: string,
    reason: string
  ): { success: boolean; error?: string } {
    const cleanReason = spamPreventionService.sanitizeContent(reason);

    if (targetType === 'discussion') {
      const disc = communityDatabase.findDiscussionById(targetId);
      if (!disc) return { success: false, error: 'Discussion not found' };
      disc.isHidden = true;
      communityDatabase.saveDiscussion(disc);
    } else if (targetType === 'reply') {
      const reply = communityDatabase.findReplyById(targetId);
      if (!reply) return { success: false, error: 'Reply not found' };
      reply.isHidden = true;
      communityDatabase.saveReply(reply);
    }

    communityDatabase.logModerationAction({
      id: `act-${crypto.randomBytes(6).toString('hex')}`,
      moderatorId,
      moderatorUsername,
      action: 'hide',
      targetType,
      targetId,
      reason: cleanReason,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Restores previously hidden content.
   */
  public restoreContent(
    moderatorId: string,
    moderatorUsername: string,
    targetType: 'discussion' | 'reply',
    targetId: string,
    reason: string
  ): { success: boolean; error?: string } {
    if (targetType === 'discussion') {
      const disc = communityDatabase.findDiscussionById(targetId);
      if (!disc) return { success: false, error: 'Discussion not found' };
      disc.isHidden = false;
      communityDatabase.saveDiscussion(disc);
    } else if (targetType === 'reply') {
      const reply = communityDatabase.findReplyById(targetId);
      if (!reply) return { success: false, error: 'Reply not found' };
      reply.isHidden = false;
      communityDatabase.saveReply(reply);
    }

    communityDatabase.logModerationAction({
      id: `act-${crypto.randomBytes(6).toString('hex')}`,
      moderatorId,
      moderatorUsername,
      action: 'restore',
      targetType,
      targetId,
      reason: spamPreventionService.sanitizeContent(reason),
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Submits a formal appeal against a moderation decision.
   */
  public submitAppeal(
    userId: string,
    input: { moderationActionId: string; statement: string }
  ): { success: boolean; appeal?: ModerationAppeal; error?: string } {
    const validated = SubmitAppealSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid appeal' };
    }

    const action = communityDatabase.getModerationActions().find((a) => a.id === input.moderationActionId);
    if (!action) {
      return { success: false, error: 'Associated moderation action not found.' };
    }

    const now = new Date().toISOString();
    const appeal: ModerationAppeal = {
      id: `apl-${crypto.randomBytes(6).toString('hex')}`,
      userId,
      moderationActionId: input.moderationActionId,
      statement: spamPreventionService.sanitizeContent(input.statement.trim()),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveAppeal(appeal);
    return { success: true, appeal };
  }

  /**
   * Reviews an appeal (Moderator action).
   */
  public reviewAppeal(
    appealId: string,
    moderatorUsername: string,
    decision: 'accepted' | 'rejected',
    reviewNotes: string
  ): { success: boolean; error?: string } {
    const appeal = communityDatabase.findAppealById(appealId);
    if (!appeal) return { success: false, error: 'Appeal not found' };

    appeal.status = decision;
    appeal.reviewedBy = moderatorUsername;
    appeal.reviewNotes = spamPreventionService.sanitizeContent(reviewNotes);
    appeal.updatedAt = new Date().toISOString();
    communityDatabase.saveAppeal(appeal);

    return { success: true };
  }

  public getOpenReports(): CommunityReport[] {
    return communityDatabase.getReports().filter((r) => r.status === 'open');
  }

  public getModerationLog(): ModerationAction[] {
    return communityDatabase.getModerationActions();
  }

  public getPendingAppeals(): ModerationAppeal[] {
    return communityDatabase.getAppeals().filter((a) => a.status === 'pending');
  }
}

export const moderationService = new ModerationService();
