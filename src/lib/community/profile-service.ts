/**
 * AI Satellite — Public Developer Profile Service (Phase 13)
 * Manages developer profiles, username reservation, opt-in privacy,
 * and badge attribution.
 */

import { communityDatabase } from './database';
import {
  CreateProfileSchema,
  RESERVED_USERNAMES,
  type PublicProfile,
  type CommunityBadge,
} from './types';
import { spamPreventionService } from './spam-prevention';

export class ProfileService {
  /**
   * Creates or updates a developer profile with strict username reservation checks.
   */
  public createOrUpdateProfile(
    userId: string,
    input: {
      username: string;
      displayName: string;
      bio?: string;
      technicalInterests?: string[];
      publicWebsite?: string;
      isPublicProfile?: boolean;
    }
  ): { success: boolean; profile?: PublicProfile; error?: string } {
    const validated = CreateProfileSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid profile information' };
    }

    const cleanUsername = input.username.toLowerCase().trim();

    // 1. Check reserved usernames
    if (RESERVED_USERNAMES.has(cleanUsername)) {
      return { success: false, error: `The username "${cleanUsername}" is reserved by AI Satellite system.` };
    }

    // 2. Check uniqueness across other users
    const existing = communityDatabase.findProfileByUsername(cleanUsername);
    if (existing && existing.userId !== userId) {
      return { success: false, error: `The username "${cleanUsername}" is already taken.` };
    }

    const now = new Date().toISOString();
    const existingProfile = communityDatabase.findProfileByUserId(userId);

    const badges = this.calculateBadges(userId);
    const reputationScore = this.calculateReputationScore(userId);

    const profile: PublicProfile = {
      userId,
      username: cleanUsername,
      displayName: spamPreventionService.sanitizeContent(input.displayName.trim()),
      bio: input.bio ? spamPreventionService.sanitizeContent(input.bio.trim()) : '',
      technicalInterests: input.technicalInterests || existingProfile?.technicalInterests || [],
      publicWebsite: input.publicWebsite?.trim() || '',
      githubUsername: existingProfile?.githubUsername,
      isPublicProfile: input.isPublicProfile ?? existingProfile?.isPublicProfile ?? false,
      reputationScore,
      badges,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };

    communityDatabase.saveProfile(profile);
    return { success: true, profile };
  }

  /**
   * Retrieves a public profile by username ONLY IF isPublicProfile is true.
   * If the profile is private, returns undefined to protect privacy.
   */
  public getPublicProfile(username: string): PublicProfile | undefined {
    const profile = communityDatabase.findProfileByUsername(username);
    if (!profile || !profile.isPublicProfile) {
      return undefined;
    }

    // Recalculate dynamic reputation & badges
    profile.reputationScore = this.calculateReputationScore(profile.userId);
    profile.badges = this.calculateBadges(profile.userId);
    return profile;
  }

  /**
   * Retrieves a profile by user ID for the authenticated owner (regardless of public flag).
   */
  public getProfileByUserId(userId: string): PublicProfile | undefined {
    return communityDatabase.findProfileByUserId(userId);
  }

  /**
   * Toggles public profile visibility.
   */
  public setProfileVisibility(userId: string, isPublic: boolean): { success: boolean; profile?: PublicProfile; error?: string } {
    const profile = communityDatabase.findProfileByUserId(userId);
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    profile.isPublicProfile = isPublic;
    profile.updatedAt = new Date().toISOString();
    communityDatabase.saveProfile(profile);
    return { success: true, profile };
  }

  /**
   * Calculates real reputation score based on confirmed contribution events.
   */
  public calculateReputationScore(userId: string): number {
    const events = communityDatabase.getReputationEvents(userId);
    return events.reduce((sum, evt) => {
      if (evt.isReversed) return sum;
      return sum + evt.pointsDelta;
    }, 0);
  }

  /**
   * Evaluates badges earned through genuine technical activity.
   */
  public calculateBadges(userId: string): CommunityBadge[] {
    const badges = new Set<CommunityBadge>();
    const contributions = communityDatabase.getContributionRecords(userId);
    const showcases = communityDatabase.getProjects().filter((p) => p.submitterId === userId && p.status === 'approved');
    const answers = communityDatabase.getQuestions().flatMap((q) => communityDatabase.getAnswersForQuestion(q.id)).filter((a) => a.authorId === userId && a.isAccepted);

    if (contributions.length > 0) {
      badges.add('early_contributor');
    }

    if (showcases.length > 0) {
      badges.add('open_source_champion');
    }

    if (answers.length > 0) {
      badges.add('troubleshooter');
    }

    if (contributions.some((c) => c.type === 'alternative' || c.type === 'submission')) {
      badges.add('verified_curator');
    }

    if (contributions.some((c) => c.type === 'example')) {
      badges.add('code_steward');
    }

    return Array.from(badges);
  }

  /**
   * Deletes a user profile and cascades removal.
   */
  public deleteProfile(userId: string): void {
    communityDatabase.deleteProfile(userId);
  }
}

export const profileService = new ProfileService();
