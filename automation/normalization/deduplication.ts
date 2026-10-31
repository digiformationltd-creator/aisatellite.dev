import crypto from 'node:crypto';
import type { DiscoveredResource } from '../shared/types.js';

export class DeduplicationEngine {
  /**
   * Normalizes a URL to a stable canonical form
   */
  static normalizeUrl(rawUrl: string): string {
    try {
      const parsed = new URL(rawUrl.trim());
      // Lowercase hostname
      let host = parsed.hostname.toLowerCase();
      // Remove trailing www. if desired, but keep consistent
      let pathname = parsed.pathname;
      if (pathname.endsWith('.git')) {
        pathname = pathname.slice(0, -4);
      }
      if (pathname.endsWith('/') && pathname.length > 1) {
        pathname = pathname.slice(0, -1);
      }
      return `${parsed.protocol}//${host}${pathname}`;
    } catch {
      return rawUrl.trim().toLowerCase().replace(/\/+$/, '');
    }
  }

  /**
   * Generates a deterministic ID from canonical URL or repository URL
   */
  static generateResourceId(canonicalUrl: string, name: string): string {
    const normalized = this.normalizeUrl(canonicalUrl);
    const hash = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 12);
    const slugSafeName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${slugSafeName}-${hash}`;
  }

  /**
   * Generates content fingerprint for tamper/change detection
   */
  static generateContentHash(data: Partial<DiscoveredResource>): string {
    const payload = [
      data.name || '',
      data.canonicalUrl || '',
      data.licenseSpdx || '',
      data.freeClassification || '',
      (data.freeTierLimitations || []).join(';'),
    ].join('::');
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Deduplicates a collection of resources, retaining the most complete metadata
   */
  static deduplicate(resources: DiscoveredResource[]): DiscoveredResource[] {
    const map = new Map<string, DiscoveredResource>();

    for (const res of resources) {
      const canonicalKey = this.normalizeUrl(res.canonicalUrl || res.repositoryUrl || res.officialUrl || res.name);
      if (!map.has(canonicalKey)) {
        map.set(canonicalKey, res);
      } else {
        // Merge records favoring the one with more evidence or verified fields
        const existing = map.get(canonicalKey)!;
        const merged: DiscoveredResource = {
          ...existing,
          ...res,
          canonicalUrl: canonicalKey,
          tags: Array.from(new Set([...(existing.tags || []), ...(res.tags || [])])),
          evidenceUrls: Array.from(new Set([...(existing.evidenceUrls || []), ...(res.evidenceUrls || [])])),
          freeTierLimitations: Array.from(
            new Set([...(existing.freeTierLimitations || []), ...(res.freeTierLimitations || [])])
          ),
          githubStars: Math.max(existing.githubStars || 0, res.githubStars || 0),
          updatedAt: new Date().toISOString(),
        };
        map.set(canonicalKey, merged);
      }
    }

    return Array.from(map.values());
  }
}
