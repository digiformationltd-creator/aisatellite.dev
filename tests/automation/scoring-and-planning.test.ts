import { describe, it, expect } from 'vitest';
import { ResourceScorer } from '../../automation/intelligence/scoring.js';
import { EditorialTopicPlanner } from '../../automation/intelligence/topic-planner.js';
import type { DiscoveredResource } from '../../automation/shared/types.js';

describe('Scenario 9: Deterministic Resource Scoring', () => {
  it('computes consistent, repeatable scores across multiple evaluations', () => {
    const resource: DiscoveredResource = {
      id: 'test-ollama',
      canonicalUrl: 'https://ollama.com',
      name: 'Ollama',
      description: 'Get up and running with large language models locally.',
      category: 'local-llm',
      tags: ['llm', 'inference', 'local-ai'],
      officialUrl: 'https://ollama.com',
      repositoryUrl: 'https://github.com/ollama/ollama',
      documentationUrl: 'https://github.com/ollama/ollama/blob/main/docs/README.md',
      licenseSpdx: 'MIT',
      freeClassification: 'open_source',
      freeTierLimitations: [],
      githubStars: 95000,
      lastRepositoryUpdate: new Date().toISOString(),
      evidenceUrls: ['https://ollama.com', 'https://github.com/ollama/ollama'],
      status: 'verified',
      discoveredAt: '2026-10-31T00:00:00Z',
      updatedAt: '2026-10-31T00:00:00Z',
    };

    const run1 = ResourceScorer.score(resource);
    const run2 = ResourceScorer.score(resource);
    const run3 = ResourceScorer.score(resource);

    expect(run1.totalScore).toBe(run2.totalScore);
    expect(run2.totalScore).toBe(run3.totalScore);
    expect(run1.totalScore).toBeGreaterThanOrEqual(75);
    expect(run1.freeAccessibility).toBe(100); // 100 for open source
  });
});

describe('Scenario 10: Topic Planning Intent Deduplication', () => {
  it('rejects duplicate search intent and prevents keyword cannibalization', () => {
    const planner = new EditorialTopicPlanner();

    const verifiedResources: DiscoveredResource[] = [
      {
        id: 'coolify-1',
        canonicalUrl: 'https://coolify.io',
        name: 'Coolify',
        description: 'An open-source & self-hostable Heroku / Netlify / Vercel alternative.',
        category: 'free-hosting',
        tags: ['paas', 'self-hosted'],
        repositoryUrl: 'https://github.com/coollabsio/coolify',
        licenseSpdx: 'Apache-2.0',
        freeClassification: 'open_source',
        freeTierLimitations: [],
        evidenceUrls: ['https://coolify.io'],
        status: 'verified',
        qualityScore: 88,
        discoveredAt: '2026-10-31T00:00:00Z',
        updatedAt: '2026-10-31T00:00:00Z',
      },
      {
        id: 'coolify-duplicate-alias',
        canonicalUrl: 'https://github.com/coollabsio/coolify',
        name: 'Coolify',
        description: 'Self-hosted PaaS platform',
        category: 'free-hosting',
        tags: ['paas', 'docker'],
        repositoryUrl: 'https://github.com/coollabsio/coolify',
        licenseSpdx: 'Apache-2.0',
        freeClassification: 'open_source',
        freeTierLimitations: [],
        evidenceUrls: ['https://github.com/coollabsio/coolify'],
        status: 'verified',
        qualityScore: 85,
        discoveredAt: '2026-10-31T00:00:00Z',
        updatedAt: '2026-10-31T00:00:00Z',
      },
    ];

    const topics = planner.planTopics(verifiedResources);

    // Should only have 1 deployment guide for Coolify, NOT two targeting the same intent
    const coolifyGuides = topics.filter((t) => t.slug.includes('coolify'));
    expect(coolifyGuides).toHaveLength(1);
  });
});
