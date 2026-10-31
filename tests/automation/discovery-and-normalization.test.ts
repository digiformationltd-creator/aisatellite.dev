import { describe, it, expect, vi } from 'vitest';
import { DeduplicationEngine } from '../../automation/normalization/deduplication.js';
import { GitHubDiscoveryConnector } from '../../automation/discovery/github.js';
import type { DiscoveredResource } from '../../automation/shared/types.js';

describe('Scenario 1 & 2: GitHub Discovery & Rate Limit Handling', () => {
  it('returns normalized records from a mocked GitHub response', async () => {
    const mockApiResponse = {
      items: [
        {
          name: 'cool-db',
          html_url: 'https://github.com/org/cool-db.git',
          description: 'A lightning fast open-source database',
          topics: ['database', 'sqlite', 'rust'],
          stargazers_count: 1420,
          forks_count: 85,
          license: { spdx_id: 'MIT' },
          pushed_at: '2026-10-31T00:00:00Z',
          homepage: 'https://cooldb.dev',
        },
      ],
    };

    // Mock global fetch
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
      headers: new Headers(),
    });
    vi.stubGlobal('fetch', fetchMock);

    const connector = new GitHubDiscoveryConnector('fake-token', 'https://mock.api');
    const results = await connector.searchRepositories({
      query: 'cool-db',
      category: 'databases',
    });

    expect(results).toHaveLength(1);
    const item = results[0];
    expect(item.name).toBe('cool-db');
    // Normalization check: .git stripped, canonicalUrl clean
    expect(item.canonicalUrl).toBe('https://github.com/org/cool-db');
    expect(item.licenseSpdx).toBe('MIT');
    expect(item.freeClassification).toBe('open_source');
    expect(item.githubStars).toBe(1420);

    vi.unstubAllGlobals();
  });

  it('handles rate limits gracefully with retry backoff', async () => {
    let callCount = 0;
    const fetchMock = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          ok: false,
          status: 403,
          headers: new Headers({
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': '1730000000',
          }),
        };
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ items: [] }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const connector = new GitHubDiscoveryConnector(undefined, 'https://mock.api');
    const results = await connector.searchRepositories({
      query: 'local-llm',
      category: 'local-llm',
    });

    expect(callCount).toBe(2); // Retried after 403
    expect(results).toEqual([]);

    vi.unstubAllGlobals();
  });
});

describe('Scenario 3: Deduplication Engine', () => {
  it('collapses duplicate repositories into one canonical record with merged metadata', () => {
    const rawItems: DiscoveredResource[] = [
      {
        id: 'cool-db-1',
        canonicalUrl: 'https://github.com/org/cool-db.git',
        name: 'CoolDB',
        description: 'First entry description',
        category: 'databases',
        tags: ['db', 'sql'],
        repositoryUrl: 'https://github.com/org/cool-db',
        freeClassification: 'open_source',
        freeTierLimitations: [],
        githubStars: 100,
        evidenceUrls: ['https://github.com/org/cool-db'],
        status: 'discovered',
        discoveredAt: '2026-10-31T00:00:00Z',
        updatedAt: '2026-10-31T00:00:00Z',
      },
      {
        id: 'cool-db-2',
        canonicalUrl: 'https://github.com/org/cool-db/',
        name: 'CoolDB',
        description: 'Updated description from official list',
        category: 'databases',
        tags: ['rust', 'embedded'],
        repositoryUrl: 'https://github.com/org/cool-db',
        officialUrl: 'https://cooldb.dev',
        freeClassification: 'open_source',
        freeTierLimitations: ['10 GB local storage'],
        githubStars: 150,
        evidenceUrls: ['https://cooldb.dev'],
        status: 'discovered',
        discoveredAt: '2026-10-31T01:00:00Z',
        updatedAt: '2026-10-31T01:00:00Z',
      },
    ];

    const deduplicated = DeduplicationEngine.deduplicate(rawItems);
    expect(deduplicated).toHaveLength(1);

    const merged = deduplicated[0];
    expect(merged.canonicalUrl).toBe('https://github.com/org/cool-db');
    // Tags merged
    expect(merged.tags).toContain('db');
    expect(merged.tags).toContain('rust');
    // Stars merged to max
    expect(merged.githubStars).toBe(150);
    // Evidence merged
    expect(merged.evidenceUrls).toHaveLength(2);
    expect(merged.officialUrl).toBe('https://cooldb.dev');
  });
});
