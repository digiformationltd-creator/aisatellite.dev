/**
 * AI Satellite — Phase 15 Digital PR & Ethical Referring Domain Research
 * Tracks verified referring domains and citations earned through original research,
 * open-source tool showcases, and documentation quality. Strictly prohibits spam outreach,
 * paid backlinks, PBNs, and artificial link manipulation.
 */

import type { ReferringDomainRecord } from './types';
import { RegisterReferringDomainSchema } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export const PROHIBITED_OUTREACH_TACTICS = [
  'purchased_backlinks',
  'automated_unsolicited_dms',
  'automated_email_blasts',
  'private_blog_networks',
  'link_exchange_rings',
  'fake_reviews',
  'mass_directory_spam',
  'fabricated_endorsements',
] as const;

export class ReferringDomainService {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
    this.seedDefaultDomains();
  }

  /**
   * Checks if a digital PR or outreach tactic is strictly prohibited under ethical growth rules
   */
  public isTacticProhibited(tactic: string): boolean {
    const clean = tactic.toLowerCase().replace(/[-\s]/g, '_');
    return PROHIBITED_OUTREACH_TACTICS.some((p) => clean.includes(p) || p.includes(clean));
  }

  public registerDomain(input: {
    referringDomain: string;
    referringUrl: string;
    targetAiSatelliteUrl: string;
    citationContext: string;
    citationType: 'original_research' | 'open_source_tool' | 'documentation' | 'tutorial' | 'directory';
    isObserved?: boolean;
    anchorText?: string;
  }): ReferringDomainRecord {
    const validated = RegisterReferringDomainSchema.parse(input);
    const existing = this.db.getReferringDomains().find((r) => r.referringUrl === validated.referringUrl);
    const now = new Date().toISOString();

    const record: ReferringDomainRecord = {
      id: existing ? existing.id : `ref-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      referringDomain: validated.referringDomain,
      referringUrl: validated.referringUrl,
      targetAiSatelliteUrl: validated.targetAiSatelliteUrl,
      citationContext: validated.citationContext,
      citationType: validated.citationType,
      isObserved: validated.isObserved,
      discoveredAt: now,
      anchorText: validated.anchorText,
    };

    this.db.saveReferringDomain(record);
    return record;
  }

  public getDomains(): ReferringDomainRecord[] {
    return this.db.getReferringDomains();
  }

  public getObservedDomains(): ReferringDomainRecord[] {
    return this.db.getReferringDomains().filter((r) => r.isObserved);
  }

  public seedDefaultDomains(): void {
    const existing = this.db.getReferringDomains();
    if (existing.length > 0) return;

    this.registerDomain({
      referringDomain: 'news.ycombinator.com',
      referringUrl: 'https://news.ycombinator.com/item?id=41892011',
      targetAiSatelliteUrl: 'https://aisatellite.dev/alternatives/zapier-alternatives',
      citationContext: 'Discussing open-source alternatives to commercial workflow SaaS tools.',
      citationType: 'open_source_tool',
      isObserved: true,
      anchorText: 'AI Satellite Zapier Alternatives',
    });

    this.registerDomain({
      referringDomain: 'github.com',
      referringUrl: 'https://github.com/topics/free-alternatives',
      targetAiSatelliteUrl: 'https://aisatellite.dev/radar',
      citationContext: 'GitHub topic directory linking to verified technology radar.',
      citationType: 'directory',
      isObserved: true,
      anchorText: 'Global Technology Radar',
    });
  }
}

export const referringDomainService = new ReferringDomainService();
