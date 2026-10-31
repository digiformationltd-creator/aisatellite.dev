import { DeduplicationEngine } from '../normalization/deduplication.js';
import type { DiscoveredResource } from '../shared/types.js';
import { Logger } from '../shared/logger.js';

export interface GitHubSearchOptions {
  query: string;
  category: string;
  perPage?: number;
  maxResults?: number;
}

export class GitHubDiscoveryConnector {
  private token?: string;
  private logger: Logger;
  private apiBaseUrl: string;

  constructor(token = process.env.GITHUB_TOKEN, apiBaseUrl = 'https://api.github.com') {
    this.token = token;
    this.apiBaseUrl = apiBaseUrl;
    this.logger = new Logger('GitHubDiscovery');
  }

  /**
   * Sanitizes untrusted text from third-party repositories to neutralize prompt injection
   */
  private sanitizeText(raw: string): string {
    if (!raw) return '';
    return raw
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // strip control chars
      .replace(/<!--[\s\S]*?-->/g, '') // strip HTML comments
      .slice(0, 1000)
      .trim();
  }

  /**
   * Executes GitHub REST search with rate-limit tracking and retries
   */
  async searchRepositories(options: GitHubSearchOptions): Promise<DiscoveredResource[]> {
    const { query, category, perPage = 10, maxResults = 30 } = options;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'AI-Satellite-Discovery-Bot/2.0',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `${this.apiBaseUrl}/search/repositories?q=${encodedQuery}&sort=updated&order=desc&per_page=${perPage}`;

    this.logger.info(`Searching GitHub: query="${query}" category="${category}"`);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await fetch(url, { headers });

        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
          const resetTime = response.headers.get('x-ratelimit-reset');
          this.logger.warn(`GitHub API rate limited (remaining=${rateLimitRemaining}). Reset at ${resetTime}.`);

          if (attempts < maxAttempts) {
            const backoffMs = attempts * 1000;
            await new Promise((resolve) => setTimeout(resolve, backoffMs));
            continue;
          }
          return [];
        }

        if (!response.ok) {
          this.logger.error(`GitHub API responded with status ${response.status} for query ${query}`);
          return [];
        }

        const data = await response.json();
        const items = data.items || [];

        const results: DiscoveredResource[] = items.slice(0, maxResults).map((item: any) => {
          const canonicalUrl = DeduplicationEngine.normalizeUrl(item.html_url);
          const sanitizedName = this.sanitizeText(item.name);
          const sanitizedDesc = this.sanitizeText(item.description || `${item.name} open source project`);
          const spdxLicense = item.license?.spdx_id && item.license.spdx_id !== 'NOASSERTION' ? item.license.spdx_id : undefined;

          const resource: DiscoveredResource = {
            id: DeduplicationEngine.generateResourceId(canonicalUrl, sanitizedName),
            canonicalUrl,
            name: sanitizedName,
            description: sanitizedDesc,
            category,
            tags: Array.isArray(item.topics) ? item.topics.map((t: string) => t.toLowerCase()) : [],
            repositoryUrl: item.html_url,
            officialUrl: item.homepage && item.homepage.startsWith('http') ? item.homepage : undefined,
            documentationUrl: item.homepage && item.homepage.startsWith('http') ? item.homepage : undefined,
            licenseSpdx: spdxLicense,
            licenseEvidenceUrl: spdxLicense ? `${item.html_url}/blob/main/LICENSE` : undefined,
            freeClassification: spdxLicense ? 'open_source' : 'unknown',
            freeTierLimitations: [],
            githubStars: item.stargazers_count,
            githubForks: item.forks_count,
            lastRepositoryUpdate: item.pushed_at || item.updated_at,
            evidenceUrls: [item.html_url],
            status: 'discovered',
            discoveredAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return resource;
        });

        this.logger.info(`Discovered ${results.length} candidate resources from GitHub for ${category}`);
        return results;
      } catch (err: any) {
        this.logger.error(`Failed to fetch from GitHub: ${err.message}`);
        if (attempts >= maxAttempts) return [];
        await new Promise((resolve) => setTimeout(resolve, attempts * 1000));
      }
    }

    return [];
  }
}
