/**
 * AI Satellite — Community Resource Submissions Service (Phase 13)
 * Manages community submissions for free alternatives, AI tools, MCP servers,
 * prompts, tutorials, and workflows with strict editorial verification.
 */

import crypto from 'node:crypto';
import { communityDatabase } from './database';
import {
  SubmitResourceSchema,
  type SubmissionCategory,
  type ResourceSubmission,
} from './types';
import { spamPreventionService } from './spam-prevention';

export class ResourceSubmissionService {
  /**
   * Submits a resource for community review.
   */
  public submitResource(
    submitterId: string,
    submitterUsername: string,
    input: {
      category: SubmissionCategory;
      title: string;
      url: string;
      description: string;
      license?: string;
      replacesPaidTool?: string;
      tags?: string[];
    }
  ): { success: boolean; submission?: ResourceSubmission; error?: string } {
    const rate = spamPreventionService.checkRateLimit(submitterId, 'submit_resource', 5, 300000);
    if (!rate.allowed) {
      return { success: false, error: 'Submission limit reached. Please wait before submitting another resource.' };
    }

    const validated = SubmitResourceSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid resource details' };
    }

    // 1. Check duplicate URL
    const existing = communityDatabase.findSubmissionByUrl(input.url);
    if (existing) {
      return { success: false, error: 'A resource with this URL is already submitted or indexed.' };
    }

    // 2. Security screening on URL
    const urlCheck = spamPreventionService.isSafeExternalUrl(input.url);
    if (!urlCheck.safe) {
      return { success: false, error: urlCheck.reason || 'Unsafe destination URL' };
    }

    const now = new Date().toISOString();
    const id = `sub-${crypto.randomBytes(6).toString('hex')}`;

    const submission: ResourceSubmission = {
      id,
      submitterId,
      submitterUsername,
      category: input.category,
      title: spamPreventionService.sanitizeContent(input.title.trim()),
      url: input.url.trim(),
      description: spamPreventionService.sanitizeContent(input.description.trim()),
      license: input.license ? spamPreventionService.sanitizeContent(input.license.trim()) : undefined,
      replacesPaidTool: input.replacesPaidTool ? spamPreventionService.sanitizeContent(input.replacesPaidTool.trim()) : undefined,
      tags: (input.tags || []).map((t) => t.trim().toLowerCase()),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveSubmission(submission);
    return { success: true, submission };
  }

  /**
   * Editorial approval for a submitted resource.
   */
  public approveSubmission(
    submissionId: string,
    moderatorId: string,
    moderatorUsername: string,
    notes?: string
  ): { success: boolean; submission?: ResourceSubmission; error?: string } {
    const sub = communityDatabase.findSubmissionById(submissionId);
    if (!sub) return { success: false, error: 'Submission not found' };

    sub.status = 'approved';
    sub.editorialNotes = notes ? spamPreventionService.sanitizeContent(notes) : 'Verified and approved by editorial team.';
    sub.updatedAt = new Date().toISOString();
    communityDatabase.saveSubmission(sub);

    const points = sub.category === 'free_alternative' ? 25 : 20;

    // Record verified contribution
    communityDatabase.recordContribution({
      id: `cnt-${crypto.randomBytes(6).toString('hex')}`,
      userId: sub.submitterId,
      username: sub.submitterUsername,
      type: sub.category === 'free_alternative' ? 'alternative' : 'submission',
      resourceId: sub.id,
      resourceTitle: sub.title,
      pointsAwarded: points,
      verifiedAt: sub.updatedAt,
      evidenceUrl: sub.url,
    });

    // Record reputation event
    communityDatabase.recordReputationEvent({
      id: `rep-${crypto.randomBytes(6).toString('hex')}`,
      userId: sub.submitterId,
      eventType: sub.category === 'free_alternative' ? 'verified_alternative' : 'approved_resource',
      pointsDelta: points,
      sourceEntityId: sub.id,
      description: `Approved ${sub.category.replace('_', ' ')}: ${sub.title}`,
      isReversed: false,
      createdAt: sub.updatedAt,
    });

    // Log moderation action
    communityDatabase.logModerationAction({
      id: `act-${crypto.randomBytes(6).toString('hex')}`,
      moderatorId,
      moderatorUsername,
      action: 'approve_submission',
      targetType: 'resource_submission',
      targetId: sub.id,
      reason: notes || 'Editorial review passed.',
      timestamp: sub.updatedAt,
    });

    return { success: true, submission: sub };
  }

  /**
   * Requests changes on a submission.
   */
  public requestChanges(
    submissionId: string,
    moderatorId: string,
    moderatorUsername: string,
    reasons: string
  ): { success: boolean; error?: string } {
    const sub = communityDatabase.findSubmissionById(submissionId);
    if (!sub) return { success: false, error: 'Submission not found' };

    sub.status = 'changes_requested';
    sub.editorialNotes = spamPreventionService.sanitizeContent(reasons);
    sub.updatedAt = new Date().toISOString();
    communityDatabase.saveSubmission(sub);

    communityDatabase.logModerationAction({
      id: `act-${crypto.randomBytes(6).toString('hex')}`,
      moderatorId,
      moderatorUsername,
      action: 'request_changes',
      targetType: 'resource_submission',
      targetId: sub.id,
      reason: reasons,
      timestamp: sub.updatedAt,
    });

    return { success: true };
  }

  public getApprovedSubmissions(): ResourceSubmission[] {
    return communityDatabase.getSubmissions().filter((s) => s.status === 'approved');
  }

  public getPendingSubmissions(): ResourceSubmission[] {
    return communityDatabase.getSubmissions().filter((s) => s.status === 'pending');
  }
}

export const resourceSubmissionService = new ResourceSubmissionService();
