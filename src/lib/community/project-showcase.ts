/**
 * AI Satellite — Open-Source Project Showcase Service (Phase 13)
 * Manages open-source repository submissions, OSI license verification,
 * duplicate detection, and moderation approval.
 */

import crypto from 'node:crypto';
import { communityDatabase } from './database';
import {
  SubmitProjectSchema,
  RECOGNIZED_OPEN_SOURCE_LICENSES,
  type ProjectShowcase,
} from './types';
import { spamPreventionService } from './spam-prevention';

export class ProjectShowcaseService {
  /**
   * Submits an open-source project to the review queue.
   * Enforces license verification and duplicate repository checks.
   */
  public submitProject(
    submitterId: string,
    submitterUsername: string,
    input: {
      name: string;
      description: string;
      repoUrl: string;
      maintainerAttribution: string;
      license: string;
      supportedPlatforms?: string[];
      docUrl: string;
      installInstructions: string;
      verifiedReleaseVersion?: string;
    }
  ): {
    success: boolean;
    project?: ProjectShowcase;
    licenseWarning?: string;
    error?: string;
  } {
    // Rate limit submission attempts
    const rateCheck = spamPreventionService.checkRateLimit(submitterId, 'submit_project', 5, 300000);
    if (!rateCheck.allowed) {
      return { success: false, error: 'Submission rate limit reached. Please wait before submitting another project.' };
    }

    const validated = SubmitProjectSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid project submission details' };
    }

    // 1. Check duplicate repository URL
    const existing = communityDatabase.findProjectByRepoUrl(input.repoUrl);
    if (existing) {
      return { success: false, error: 'A project with this repository URL is already in the database or review queue.' };
    }

    // 2. Validate repository URL safety
    const repoSafety = spamPreventionService.isSafeExternalUrl(input.repoUrl);
    if (!repoSafety.safe) {
      return { success: false, error: repoSafety.reason || 'Invalid or unsafe repository URL' };
    }

    // 3. License verification against recognized OSI open source licenses
    const trimmedLicense = input.license.trim();
    const isLicenseVerified = RECOGNIZED_OPEN_SOURCE_LICENSES.some(
      (lic) => lic.toLowerCase() === trimmedLicense.toLowerCase()
    );

    let licenseWarning: string | undefined;
    if (!isLicenseVerified) {
      licenseWarning = `License "${trimmedLicense}" is not in the recognized OSI/FSF open-source registry. Public repositories without a verified open-source license cannot be represented as freely reusable open-source software.`;
    }

    const now = new Date().toISOString();
    const id = `prj-${crypto.randomBytes(6).toString('hex')}`;

    const project: ProjectShowcase = {
      id,
      submitterId,
      submitterUsername,
      name: spamPreventionService.sanitizeContent(input.name.trim()),
      description: spamPreventionService.sanitizeContent(input.description.trim()),
      repoUrl: input.repoUrl.trim(),
      maintainerAttribution: spamPreventionService.sanitizeContent(input.maintainerAttribution.trim()),
      license: trimmedLicense,
      isLicenseVerified,
      supportedPlatforms: input.supportedPlatforms || ['Linux', 'macOS', 'Windows'],
      docUrl: input.docUrl.trim(),
      installInstructions: spamPreventionService.sanitizeContent(input.installInstructions.trim()),
      verifiedReleaseVersion: input.verifiedReleaseVersion?.trim() || 'v1.0.0',
      status: 'pending', // Enters moderation review queue
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveProject(project);

    return {
      success: true,
      project,
      licenseWarning,
    };
  }

  /**
   * Approves a project submission (Moderator action).
   * Publishes project to public showcase, awards contribution record & reputation points.
   */
  public approveProject(
    projectId: string,
    moderatorId: string,
    moderatorUsername: string,
    editorialNotes?: string
  ): { success: boolean; project?: ProjectShowcase; error?: string } {
    const project = communityDatabase.findProjectById(projectId);
    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    project.status = 'approved';
    project.editorialNotes = editorialNotes ? spamPreventionService.sanitizeContent(editorialNotes) : undefined;
    project.updatedAt = new Date().toISOString();
    communityDatabase.saveProject(project);

    // Record verified contribution
    communityDatabase.recordContribution({
      id: `cnt-${crypto.randomBytes(6).toString('hex')}`,
      userId: project.submitterId,
      username: project.submitterUsername,
      type: 'submission',
      resourceId: project.id,
      resourceTitle: project.name,
      pointsAwarded: 20,
      verifiedAt: project.updatedAt,
      evidenceUrl: project.repoUrl,
    });

    // Record reputation event
    communityDatabase.recordReputationEvent({
      id: `rep-${crypto.randomBytes(6).toString('hex')}`,
      userId: project.submitterId,
      eventType: 'approved_resource',
      pointsDelta: 20,
      sourceEntityId: project.id,
      description: `Approved open-source project showcase: ${project.name}`,
      isReversed: false,
      createdAt: project.updatedAt,
    });

    // Log moderation action
    communityDatabase.logModerationAction({
      id: `act-${crypto.randomBytes(6).toString('hex')}`,
      moderatorId,
      moderatorUsername,
      action: 'approve_submission',
      targetType: 'project',
      targetId: project.id,
      reason: editorialNotes || 'Verified open-source repository and license compliance.',
      timestamp: project.updatedAt,
    });

    return { success: true, project };
  }

  /**
   * Rejects a project submission with reason.
   */
  public rejectProject(
    projectId: string,
    moderatorId: string,
    moderatorUsername: string,
    reason: string
  ): { success: boolean; error?: string } {
    const project = communityDatabase.findProjectById(projectId);
    if (!project) return { success: false, error: 'Project not found' };

    project.status = 'rejected';
    project.editorialNotes = spamPreventionService.sanitizeContent(reason);
    project.updatedAt = new Date().toISOString();
    communityDatabase.saveProject(project);

    communityDatabase.logModerationAction({
      id: `act-${crypto.randomBytes(6).toString('hex')}`,
      moderatorId,
      moderatorUsername,
      action: 'reject_submission',
      targetType: 'project',
      targetId: project.id,
      reason,
      timestamp: project.updatedAt,
    });

    return { success: true };
  }

  /**
   * Returns only approved projects for public display.
   */
  public getApprovedProjects(): ProjectShowcase[] {
    return communityDatabase.getProjects().filter((p) => p.status === 'approved');
  }

  /**
   * Returns pending projects for moderation queue.
   */
  public getPendingProjects(): ProjectShowcase[] {
    return communityDatabase.getProjects().filter((p) => p.status === 'pending');
  }
}

export const projectShowcaseService = new ProjectShowcaseService();
