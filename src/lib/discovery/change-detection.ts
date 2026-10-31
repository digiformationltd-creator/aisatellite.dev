/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine F: Technology Change Detection
 * 
 * Monitors and logs technology changes (pricing, free tiers, licensing modifications,
 * repository archival, deprecation notices, and major releases) with verifiable evidence.
 */

import { uuidv4 } from './id-generator';
import type { TechnologyChangeEvent, TechnologyChangeType } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export class ChangeDetectionEngine {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultChanges();
  }

  public recordChange(input: {
    resourceId: string;
    resourceName: string;
    changeType: TechnologyChangeType;
    previousValue: string;
    newValue: string;
    evidenceUrl: string;
    verificationStatus?: 'verified' | 'unconfirmed' | 'rejected';
    affectedResourceUrls?: string[];
    proposedAction: string;
  }): TechnologyChangeEvent {
    const now = new Date().toISOString();
    const event: TechnologyChangeEvent = {
      id: `chg-${uuidv4().slice(0, 8)}`,
      resourceId: input.resourceId,
      resourceName: input.resourceName,
      changeType: input.changeType,
      previousValue: input.previousValue,
      newValue: input.newValue,
      evidenceUrl: input.evidenceUrl,
      detectionTimestamp: now,
      verificationStatus: input.verificationStatus || 'verified',
      affectedResourceUrls: input.affectedResourceUrls || [input.evidenceUrl],
      proposedAction: input.proposedAction,
    };

    this.db.recordChangeEvent(event);
    return event;
  }

  public getChanges(filters?: {
    changeType?: TechnologyChangeType;
    verificationStatus?: 'verified' | 'unconfirmed' | 'rejected';
    resourceName?: string;
  }): TechnologyChangeEvent[] {
    let list = this.db.getChangeEvents();

    if (filters?.changeType) {
      list = list.filter((c) => c.changeType === filters.changeType);
    }
    if (filters?.verificationStatus) {
      list = list.filter((c) => c.verificationStatus === filters.verificationStatus);
    }
    if (filters?.resourceName) {
      const term = filters.resourceName.toLowerCase();
      list = list.filter((c) => c.resourceName.toLowerCase().includes(term));
    }

    return list.sort((a, b) => new Date(b.detectionTimestamp).getTime() - new Date(a.detectionTimestamp).getTime());
  }

  public verifyChange(id: string, status: 'verified' | 'rejected'): TechnologyChangeEvent {
    const list = this.db.getChangeEvents();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error(`Change event not found: ${id}`);

    found.verificationStatus = status;
    return found;
  }

  public seedDefaultChanges(): void {
    const existing = this.db.getChangeEvents();
    if (existing.length > 0) return;

    const defaults: Array<{
      resourceId: string;
      resourceName: string;
      changeType: TechnologyChangeType;
      previousValue: string;
      newValue: string;
      evidenceUrl: string;
      proposedAction: string;
    }> = [
      {
        resourceId: 'res-terraform',
        resourceName: 'Terraform',
        changeType: 'licensing_change',
        previousValue: 'Mozilla Public License 2.0 (MPL-2.0)',
        newValue: 'Business Source License 1.1 (BSL-1.1)',
        evidenceUrl: 'https://www.hashicorp.com/blog/defaulting-to-business-source-license',
        proposedAction: 'Highlight OpenTofu as the verified open-source MPL-2.0 fork in alternatives radar.',
      },
      {
        resourceId: 'res-redis',
        resourceName: 'Redis',
        changeType: 'licensing_change',
        previousValue: 'BSD 3-Clause',
        newValue: 'RSALv2 and SSPLv1 dual license',
        evidenceUrl: 'https://redis.io/blog/redis-adopts-dual-source-available-licensing/',
        proposedAction: 'Recommend Valkey (Linux Foundation fork) for open-source BSD-3 workloads.',
      },
      {
        resourceId: 'res-docker-desktop',
        resourceName: 'Docker Desktop',
        changeType: 'pricing_change',
        previousValue: 'Free for all commercial environments',
        newValue: 'Paid subscription required for enterprises >250 employees or >$10M revenue',
        evidenceUrl: 'https://www.docker.com/pricing/faq/',
        proposedAction: 'Surface Rancher Desktop, Colima, and OrbStack in developer container alternatives.',
      },
    ];

    for (const d of defaults) {
      this.recordChange({
        ...d,
        verificationStatus: 'verified',
      });
    }
  }
}

export const changeDetectionEngine = new ChangeDetectionEngine();
