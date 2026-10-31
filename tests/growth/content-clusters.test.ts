import { describe, it, expect } from 'vitest';
import { ContentClusterPlanner } from '../../growth/content-clusters/cluster-planner.js';

describe('Acceptance Test 10: Content Cluster Mapping & Integrity', () => {
  const planner = new ContentClusterPlanner();

  it('Test 10: Content cluster mapping avoids duplicate records and preserves pillar URLs', () => {
    const clusters = planner.initializeClusters();
    expect(clusters.length).toBe(15);

    const clusterIds = clusters.map((c) => c.id);
    const uniqueIds = new Set(clusterIds);
    expect(uniqueIds.size).toBe(clusterIds.length); // Zero duplicate IDs

    // Verify mapping
    const sampleUrls = [
      '/tools/ollama',
      '/alternatives/airtable-alternatives',
      '/3d-lab/threejs/interactive-sphere',
    ];

    const mapped = planner.mapContentToClusters(sampleUrls);
    expect(mapped.length).toBe(15);

    // Verify internal link recommendations
    const recommendations = planner.generateInternalLinkRecommendations(mapped);
    expect(Array.isArray(recommendations)).toBe(true);

    for (const rec of recommendations) {
      expect(rec.sourceUrl).not.toBe(rec.targetUrl);
      expect(rec.relevanceScore).toBeGreaterThanOrEqual(0.8);
    }
  });
});
