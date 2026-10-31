import { type TechnologyResource, type ResourceKind, TechnologyResourceSchema } from './schemas';

export interface RawCandidateResource {
  name: string;
  sourceType: 'github' | 'npm' | 'crates' | 'docs' | 'submission';
  url: string;
  repoUrl?: string;
  license?: string;
  description: string;
  stars?: number;
  tags?: string[];
  evidenceUrls: string[];
}

export class DiscoveryAdapterPipeline {
  private rateLimitRemaining: number = 60;
  private rateLimitReset: number = Date.now() + 3600000;

  /**
   * Discovers candidate resources from GitHub with rate limit safety.
   */
  public async discoverFromGitHub(query: string, category: string): Promise<RawCandidateResource[]> {
    if (this.rateLimitRemaining <= 0) {
      console.warn('[DiscoveryAdapter] GitHub rate limit reached. Halting discovery queries.');
      return [];
    }

    this.rateLimitRemaining--;

    // Simulated verified discovery adapter logic
    return [
      {
        name: query,
        sourceType: 'github',
        url: `https://github.com/sample/${query}`,
        repoUrl: `https://github.com/sample/${query}`,
        license: 'MIT',
        description: `Discovered open-source repository for ${query}`,
        stars: 1250,
        tags: [category, 'open-source'],
        evidenceUrls: [`https://github.com/sample/${query}/blob/main/LICENSE`],
      },
    ];
  }

  /**
   * Normalizes a raw candidate into an internal TechnologyResource model.
   */
  public normalizeResource(raw: RawCandidateResource, category: string): TechnologyResource {
    const slug = raw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const kind: ResourceKind = raw.name.toLowerCase().includes('agent') ? 'ai_tool' : 'software';

    return {
      id: `tech-${slug}`,
      slug,
      title: raw.name,
      kind,
      description: raw.description,
      categories: [category],
      tags: raw.tags || ['developer-tool'],
      officialUrl: raw.url,
      repositoryUrl: raw.repoUrl,
      evidenceUrls: raw.evidenceUrls,
      verificationStatus: 'pending',
      lastVerified: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      license: raw.license || 'Unknown',
      pricingClassification: ['verification_pending'],
      selfHosted: false,
      freeHostedTier: false,
      paidInfrastructureRequired: false,
      setupComplexity: 'Medium',
      stars: raw.stars,
    };
  }

  /**
   * Deduplicates candidate list against existing known resources.
   */
  public deduplicate(candidates: TechnologyResource[], existing: TechnologyResource[]): TechnologyResource[] {
    const existingSlugs = new Set(existing.map((e) => e.slug));
    const existingUrls = new Set(existing.map((e) => e.officialUrl?.toLowerCase()).filter(Boolean));
    const existingRepos = new Set(existing.map((e) => e.repositoryUrl?.toLowerCase()).filter(Boolean));

    return candidates.filter((c) => {
      if (existingSlugs.has(c.slug)) return false;
      if (c.officialUrl && existingUrls.has(c.officialUrl.toLowerCase())) return false;
      if (c.repositoryUrl && existingRepos.has(c.repositoryUrl.toLowerCase())) return false;
      return true;
    });
  }
}

export const discoveryAdapterPipeline = new DiscoveryAdapterPipeline();
