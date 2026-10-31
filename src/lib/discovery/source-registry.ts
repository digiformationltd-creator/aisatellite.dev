/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine A: Approved Technology Source Registry
 * 
 * Manages verified, authoritative technology sources for discovery operations.
 * Enforces URL safety, rate limits, verification levels, and crawl permissions.
 */

import { uuidv4 } from './id-generator';
import type { TechnologySource, SourceStatus, SourceType, VerificationLevel } from './types';
import { RegisterSourceSchema } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';
import { costAndSecurityManager } from './cost-and-security';

export class SourceRegistry {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultSources();
  }

  /**
   * Registers a new technology source with validation
   */
  public registerSource(input: {
    sourceUrl: string;
    sourceType: SourceType;
    organization: string;
    accessMethod?: 'rest_api' | 'rss_atom' | 'html_scrape' | 'git_clone';
    verificationLevel?: VerificationLevel;
    crawlPermissionsAllowed?: boolean;
    rateLimitPerMinute?: number;
  }): TechnologySource {
    const validated = RegisterSourceSchema.parse(input);

    // SSRF Safety Check
    const ssrfCheck = costAndSecurityManager.validateUrlForSsrf(validated.sourceUrl);
    if (!ssrfCheck.allowed) {
      throw new Error(`Invalid source URL: ${ssrfCheck.reason}`);
    }

    const existing = this.db.findSourceByUrl(validated.sourceUrl);
    const now = new Date().toISOString();

    if (existing) {
      const updated: TechnologySource = {
        ...existing,
        organization: validated.organization,
        sourceType: validated.sourceType,
        accessMethod: validated.accessMethod,
        verificationLevel: validated.verificationLevel,
        crawlPermissionsAllowed: validated.crawlPermissionsAllowed,
        rateLimitPerMinute: validated.rateLimitPerMinute,
        updatedAt: now,
      };
      this.db.saveSource(updated);
      return updated;
    }

    const newSource: TechnologySource = {
      id: `src-${uuidv4().slice(0, 8)}`,
      sourceUrl: validated.sourceUrl,
      sourceType: validated.sourceType,
      organization: validated.organization,
      accessMethod: validated.accessMethod,
      verificationLevel: validated.verificationLevel,
      crawlPermissionsAllowed: validated.crawlPermissionsAllowed,
      rateLimitPerMinute: validated.rateLimitPerMinute,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.db.saveSource(newSource);
    return newSource;
  }

  public getSource(id: string): TechnologySource | undefined {
    return this.db.findSourceById(id);
  }

  public getSourceByUrl(url: string): TechnologySource | undefined {
    return this.db.findSourceByUrl(url);
  }

  public getAllSources(): TechnologySource[] {
    return this.db.getSources();
  }

  public getSourcesByStatus(status: SourceStatus): TechnologySource[] {
    return this.db.getSources().filter((s) => s.status === status);
  }

  public getAuthoritativeSources(): TechnologySource[] {
    return this.db.getSources().filter((s) => s.verificationLevel === 'authoritative' && s.status === 'active');
  }

  public updateSourceStatus(id: string, status: SourceStatus): TechnologySource {
    const source = this.db.findSourceById(id);
    if (!source) {
      throw new Error(`Source not found: ${id}`);
    }

    const updated: TechnologySource = {
      ...source,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.db.saveSource(updated);
    return updated;
  }

  public recordRetrieval(id: string, success: boolean): void {
    const source = this.db.findSourceById(id);
    if (!source) return;

    const now = new Date().toISOString();
    const updated: TechnologySource = {
      ...source,
      lastSuccessfulRetrieval: success ? now : source.lastSuccessfulRetrieval,
      lastVerification: now,
      status: success ? (source.status === 'rate_limited' ? 'active' : source.status) : source.status,
      updatedAt: now,
    };

    this.db.saveSource(updated);
  }

  public checkCrawlAllowed(url: string): boolean {
    const source = this.db.findSourceByUrl(url);
    if (!source) return false;
    return source.crawlPermissionsAllowed && source.status === 'active';
  }

  /**
   * Seed core authoritative discovery sources
   */
  public seedDefaultSources(): void {
    const existing = this.db.getSources();
    if (existing.length > 0) return;

    const defaults: Array<{
      sourceUrl: string;
      sourceType: SourceType;
      organization: string;
      accessMethod: 'rest_api' | 'rss_atom' | 'html_scrape' | 'git_clone';
      verificationLevel: VerificationLevel;
      rateLimitPerMinute: number;
    }> = [
      {
        sourceUrl: 'https://api.github.com/repos/ollama/ollama',
        sourceType: 'github_repo',
        organization: 'Ollama',
        accessMethod: 'rest_api',
        verificationLevel: 'authoritative',
        rateLimitPerMinute: 60,
      },
      {
        sourceUrl: 'https://api.github.com/repos/supabase/supabase',
        sourceType: 'github_repo',
        organization: 'Supabase Inc.',
        accessMethod: 'rest_api',
        verificationLevel: 'authoritative',
        rateLimitPerMinute: 60,
      },
      {
        sourceUrl: 'https://docs.anthropic.com/en/docs',
        sourceType: 'official_docs',
        organization: 'Anthropic PBC',
        accessMethod: 'rest_api',
        verificationLevel: 'authoritative',
        rateLimitPerMinute: 30,
      },
      {
        sourceUrl: 'https://platform.openai.com/docs',
        sourceType: 'official_docs',
        organization: 'OpenAI',
        accessMethod: 'rest_api',
        verificationLevel: 'authoritative',
        rateLimitPerMinute: 30,
      },
      {
        sourceUrl: 'https://huggingface.co/api/models',
        sourceType: 'package_registry',
        organization: 'Hugging Face',
        accessMethod: 'rest_api',
        verificationLevel: 'authoritative',
        rateLimitPerMinute: 45,
      },
    ];

    for (const def of defaults) {
      try {
        this.registerSource({
          ...def,
          crawlPermissionsAllowed: true,
        });
      } catch (err) {
        console.error(`[SourceRegistry] Error seeding default source ${def.sourceUrl}:`, err);
      }
    }
  }
}

export const sourceRegistry = new SourceRegistry();
