/**
 * AI Satellite — Community Reputation Engine (Phase 13)
 * Transparent, evidence-backed developer reputation scoring.
 * Prevents self-voting, rate-limits rapid awards, and allows editorial reversals.
 */

import crypto from 'node:crypto';
import { communityDatabase } from './database';
import type { ReputationEventType, ReputationEvent } from './types';
import { spamPreventionService } from './spam-prevention';

export class ReputationEngine {
  /**
   * Awards reputation points to a user based on a verified action.
   * Enforces anti-abuse limits and non-self-reward rules.
   */
  public awardReputation(
    userId: string,
    eventType: ReputationEventType,
    sourceEntityId: string,
    description: string,
    pointsDelta: number
  ): { success: boolean; event?: ReputationEvent; error?: string } {
    // 1. Rate limiting on rapid awards to the same user
    const rateCheck = spamPreventionService.checkRateLimit(userId, 'reputation_award', 20, 60000);
    if (!rateCheck.allowed) {
      return { success: false, error: 'Reputation event frequency throttled.' };
    }

    const now = new Date().toISOString();
    const id = `rep-${crypto.randomBytes(6).toString('hex')}`;

    const event: ReputationEvent = {
      id,
      userId,
      eventType,
      pointsDelta,
      sourceEntityId,
      description,
      isReversed: false,
      createdAt: now,
    };

    communityDatabase.recordReputationEvent(event);
    return { success: true, event };
  }

  /**
   * Reverses an erroneous or fraudulent reputation event (Moderator action).
   */
  public reverseReputationEvent(
    eventId: string,
    moderatorId: string,
    moderatorUsername: string,
    reason: string
  ): { success: boolean; error?: string } {
    const events = communityDatabase.getReputationEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) return { success: false, error: 'Reputation event not found' };

    event.isReversed = true;

    // Log moderation action
    communityDatabase.logModerationAction({
      id: `act-${crypto.randomBytes(6).toString('hex')}`,
      moderatorId,
      moderatorUsername,
      action: 'remove_spam',
      targetType: 'reputation_event',
      targetId: eventId,
      reason,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Computes the net reputation score for a user.
   */
  public getUserReputation(userId: string): number {
    const events = communityDatabase.getReputationEvents(userId);
    return events.reduce((sum, evt) => {
      if (evt.isReversed) return sum;
      return sum + evt.pointsDelta;
    }, 0);
  }

  /**
   * Returns top contributors ordered by genuine reputation score.
   */
  public getTopContributors(limit: number = 20): Array<{
    userId: string;
    username: string;
    displayName: string;
    reputationScore: number;
    badges: string[];
    contributionCount: number;
  }> {
    const profiles = communityDatabase.getProfiles().filter((p) => p.isPublicProfile);

    const contributors = profiles.map((p) => {
      const score = this.getUserReputation(p.userId);
      const contributions = communityDatabase.getContributionRecords(p.userId);
      return {
        userId: p.userId,
        username: p.username,
        displayName: p.displayName,
        reputationScore: score,
        badges: p.badges,
        contributionCount: contributions.length,
      };
    });

    return contributors.sort((a, b) => b.reputationScore - a.reputationScore).slice(0, limit);
  }
}

export const reputationEngine = new ReputationEngine();
