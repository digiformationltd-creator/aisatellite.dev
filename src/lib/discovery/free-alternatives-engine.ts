/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine E: Free Alternatives Research Engine & Capability Taxonomy
 * 
 * Maps paid proprietary software to verified free and open-source equivalents across
 * a 16-group capability taxonomy, calculating overlap, deployment options, and hosting costs.
 */

import { uuidv4 } from './id-generator';
import type { FreeAlternativeFinding, AlternativeClassification, CapabilityGroup } from './types';
import { CAPABILITY_TAXONOMY } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export class FreeAlternativesEngine {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultFindings();
  }

  public getTaxonomy(): readonly CapabilityGroup[] {
    return CAPABILITY_TAXONOMY;
  }

  public registerAlternative(input: {
    paidToolName: string;
    alternativeName: string;
    alternativeUrl: string;
    license: string;
    classification: AlternativeClassification;
    capabilityOverlap: string[];
    deploymentOptions: ('cloud' | 'docker' | 'bare_metal' | 'kubernetes')[];
    limitations: string[];
    infrastructureCostEstimated: string;
    evidenceUrls: string[];
    editorialProposalId?: string;
  }): FreeAlternativeFinding {
    const existing = this.db.getFreeAlternativeFindings().find(
      (f) =>
        f.paidToolName.toLowerCase() === input.paidToolName.toLowerCase() &&
        f.alternativeName.toLowerCase() === input.alternativeName.toLowerCase()
    );

    const now = new Date().toISOString();
    const finding: FreeAlternativeFinding = {
      id: existing ? existing.id : `alt-${uuidv4().slice(0, 8)}`,
      paidToolName: input.paidToolName,
      alternativeName: input.alternativeName,
      alternativeUrl: input.alternativeUrl,
      license: input.license,
      classification: input.classification,
      capabilityOverlap: input.capabilityOverlap,
      deploymentOptions: input.deploymentOptions,
      limitations: input.limitations,
      infrastructureCostEstimated: input.infrastructureCostEstimated,
      evidenceUrls: input.evidenceUrls,
      verifiedAt: now,
      editorialProposalId: input.editorialProposalId,
    };

    this.db.saveFreeAlternativeFinding(finding);
    return finding;
  }

  public getFindings(): FreeAlternativeFinding[] {
    return this.db.getFreeAlternativeFindings();
  }

  public findAlternativesFor(paidToolName: string): FreeAlternativeFinding[] {
    const term = paidToolName.trim().toLowerCase();
    return this.db.getFreeAlternativeFindings().filter((f) => f.paidToolName.toLowerCase() === term);
  }

  public getFindingsByClassification(classification: AlternativeClassification): FreeAlternativeFinding[] {
    return this.db.getFreeAlternativeFindings().filter((f) => f.classification === classification);
  }

  /**
   * Calculates capability match percentage against target capabilities
   */
  public calculateCapabilityMatchScore(requiredCapabilities: string[], offeredCapabilities: string[]): number {
    if (requiredCapabilities.length === 0) return 100;
    const reqSet = new Set(requiredCapabilities.map((c) => c.toLowerCase()));
    const matched = offeredCapabilities.filter((c) => reqSet.has(c.toLowerCase()));
    return Math.round((matched.length / requiredCapabilities.length) * 100);
  }

  public seedDefaultFindings(): void {
    const existing = this.db.getFreeAlternativeFindings();
    if (existing.length > 0) return;

    const defaults: Array<{
      paidToolName: string;
      alternativeName: string;
      alternativeUrl: string;
      license: string;
      classification: AlternativeClassification;
      capabilityOverlap: string[];
      deploymentOptions: ('cloud' | 'docker' | 'bare_metal' | 'kubernetes')[];
      limitations: string[];
      infrastructureCostEstimated: string;
      evidenceUrls: string[];
    }> = [
      {
        paidToolName: 'Zapier',
        alternativeName: 'n8n',
        alternativeUrl: 'https://n8n.io',
        license: 'Sustainable-Use-License',
        classification: 'self_hosted_infra_cost',
        capabilityOverlap: ['workflow_automation', 'api_development'],
        deploymentOptions: ['docker', 'cloud', 'kubernetes'],
        limitations: [
          'Self-hosted requires technical knowledge of Docker and server maintenance.',
          'Fair-code license limits enterprise multi-tenant commercial resale without license.',
        ],
        infrastructureCostEstimated: '$5-$10/month on a 1GB-2GB RAM VPS or free local Docker',
        evidenceUrls: ['https://n8n.io/pricing', 'https://docs.n8n.io/hosting/'],
      },
      {
        paidToolName: 'Firebase',
        alternativeName: 'Supabase',
        alternativeUrl: 'https://supabase.com',
        license: 'Apache-2.0',
        classification: 'free_and_open_source',
        capabilityOverlap: ['databases', 'cloud_hosting', 'api_development'],
        deploymentOptions: ['docker', 'cloud', 'kubernetes'],
        limitations: [
          'Relational Postgres paradigm differs from Firebase NoSQL document model.',
          'Cloud free tier has project pause after 1 week of inactivity (unpauses instantly).',
        ],
        infrastructureCostEstimated: 'Free tier on Supabase Cloud, or $10-$20/mo self-hosted VPS',
        evidenceUrls: ['https://supabase.com/pricing', 'https://github.com/supabase/supabase/blob/master/LICENSE'],
      },
      {
        paidToolName: 'Pinecone',
        alternativeName: 'Qdrant',
        alternativeUrl: 'https://qdrant.tech',
        license: 'Apache-2.0',
        classification: 'free_and_open_source',
        capabilityOverlap: ['vector_embeddings', 'databases', 'analytics'],
        deploymentOptions: ['docker', 'kubernetes', 'cloud', 'bare_metal'],
        limitations: [
          'Requires server memory management for high-dimensional vector indexes at scale.',
        ],
        infrastructureCostEstimated: 'Free 1GB cluster on Qdrant Cloud or $5/mo VPS self-hosted',
        evidenceUrls: ['https://qdrant.tech/pricing/', 'https://github.com/qdrant/qdrant/blob/master/LICENSE'],
      },
      {
        paidToolName: 'Postman',
        alternativeName: 'Bruno',
        alternativeUrl: 'https://www.usebruno.com',
        license: 'MIT',
        classification: 'free_and_open_source',
        capabilityOverlap: ['api_development', 'developer_testing'],
        deploymentOptions: ['bare_metal', 'cloud'],
        limitations: [
          'Desktop client offline-first; team sync relies on Git repositories rather than Postman proprietary cloud workspaces.',
        ],
        infrastructureCostEstimated: '$0 (local execution on developer machine)',
        evidenceUrls: ['https://www.usebruno.com/pricing', 'https://github.com/usebruno/bruno/blob/main/license.md'],
      },
      {
        paidToolName: 'Airtable',
        alternativeName: 'Baserow',
        alternativeUrl: 'https://baserow.io',
        license: 'MIT',
        classification: 'free_and_open_source',
        capabilityOverlap: ['databases', 'office_productivity', 'project_management'],
        deploymentOptions: ['docker', 'cloud', 'kubernetes'],
        limitations: [
          'Advanced enterprise SSO/audit logs require premium license in self-hosted edition.',
        ],
        infrastructureCostEstimated: 'Free on Baserow Cloud (up to 3k rows) or $5-$10/mo VPS Docker',
        evidenceUrls: ['https://baserow.io/pricing', 'https://gitlab.com/baserow/baserow/-/blob/develop/LICENSE'],
      },
    ];

    for (const d of defaults) {
      this.registerAlternative(d);
    }
  }
}

export const freeAlternativesEngine = new FreeAlternativesEngine();
