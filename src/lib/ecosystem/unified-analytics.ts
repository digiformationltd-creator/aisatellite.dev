/**
 * AI Satellite — Phase 19 Unified Analytics Engine
 * Standardized privacy-first event taxonomy, deduplication guard, and zero-PII tracking.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { randomBytes, createHash } from 'node:crypto';
import type {
  UnifiedAnalyticsEvent,
  UnifiedAnalyticsEventType,
} from './types';
import { ecosystemDatabase, EcosystemDatabase } from './database';

export class UnifiedAnalyticsEngine {
  private db: EcosystemDatabase;
  private recentEventHashes: Map<string, number> = new Map();

  constructor(db?: EcosystemDatabase) {
    this.db = db || ecosystemDatabase;
  }

  public recordEvent(input: {
    eventType: UnifiedAnalyticsEventType;
    resourceId?: string;
    properties?: Record<string, any>;
    anonymizedSessionId?: string;
  }): { recorded: boolean; event?: UnifiedAnalyticsEvent; reason?: string } {
    const sessionId = input.anonymizedSessionId || `anon_${randomBytes(6).toString('hex')}`;
    const now = Date.now();

    // Deduplication key: hash(eventType + resourceId + sessionId)
    const rawKey = `${input.eventType}:${input.resourceId || ''}:${sessionId}`;
    const eventHash = createHash('sha256').update(rawKey).digest('hex');

    const lastSeen = this.recentEventHashes.get(eventHash);
    if (lastSeen && now - lastSeen < 5000) {
      // Deduplicate: Event received within 5 seconds window
      return { recorded: false, reason: 'DEDUPLICATED_RAPID_FIRE' };
    }

    this.recentEventHashes.set(eventHash, now);

    // Clean up old hashes (> 60s)
    if (this.recentEventHashes.size > 1000) {
      for (const [key, timestamp] of this.recentEventHashes.entries()) {
        if (now - timestamp > 60000) {
          this.recentEventHashes.delete(key);
        }
      }
    }

    // Zero-PII sanitize properties: remove email, ip, password, token
    const sanitizedProps: Record<string, any> = {};
    if (input.properties) {
      for (const [k, v] of Object.entries(input.properties)) {
        const lowerK = k.toLowerCase();
        if (
          !lowerK.includes('email') &&
          !lowerK.includes('pass') &&
          !lowerK.includes('token') &&
          !lowerK.includes('ip') &&
          !lowerK.includes('secret')
        ) {
          sanitizedProps[k] = v;
        }
      }
    }

    const event: UnifiedAnalyticsEvent = {
      id: `ana_${randomBytes(6).toString('hex')}`,
      eventType: input.eventType,
      resourceId: input.resourceId,
      properties: sanitizedProps,
      timestamp: new Date().toISOString(),
      anonymizedSessionId: sessionId,
    };

    this.db.addAnalyticsEvent(event);
    return { recorded: true, event };
  }

  public getEvents(): UnifiedAnalyticsEvent[] {
    return this.db.getAnalyticsEvents();
  }

  public getAggregates(): Record<UnifiedAnalyticsEventType, number> {
    const events = this.db.getAnalyticsEvents();
    const counts: Record<string, number> = {
      ResourceViewed: 0,
      AlternativeCompared: 0,
      RepositoryOpened: 0,
      PromptSaved: 0,
      TutorialCompleted: 0,
      SearchPerformed: 0,
      WorkspaceCreated: 0,
      CommunityContributionApproved: 0,
      NewsletterSubscribed: 0,
    };

    for (const e of events) {
      if (counts[e.eventType] !== undefined) {
        counts[e.eventType]++;
      }
    }

    return counts as Record<UnifiedAnalyticsEventType, number>;
  }
}

export const unifiedAnalyticsEngine = new UnifiedAnalyticsEngine();
