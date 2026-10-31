/**
 * AI Satellite — Phase 19 Central Resource Identity System (CRIS)
 * Assigns stable identifiers, enforces canonical slugs, deduplicates resources,
 * and maintains authoritative cross-module technology records.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { randomBytes } from 'node:crypto';
import type {
  CentralResource,
  CentralResourceType,
  VerificationStatus,
  EditorialStatus,
} from './types';
import { RegisterCentralResourceSchema } from './types';
import { ecosystemDatabase, EcosystemDatabase } from './database';
import { platformEventBus } from './event-bus';

export class CentralResourceRegistry {
  private db: EcosystemDatabase;

  constructor(db?: EcosystemDatabase) {
    this.db = db || ecosystemDatabase;
  }

  public generateResourceId(slug: string): string {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return `res_${cleanSlug}`;
  }

  public registerResource(input: {
    slug: string;
    name: string;
    type: CentralResourceType;
    officialUrl: string;
    repositoryUrl?: string;
    license?: string;
    pricing?: string;
    capabilities?: string[];
    categories?: string[];
    verificationStatus?: VerificationStatus;
    editorialStatus?: EditorialStatus;
    metadata?: Record<string, any>;
  }): CentralResource {
    const validated = RegisterCentralResourceSchema.parse({
      ...input,
      capabilities: input.capabilities || [],
      categories: input.categories || [],
      verificationStatus: input.verificationStatus || 'in_review',
      editorialStatus: input.editorialStatus || 'draft',
      metadata: input.metadata || {},
    });

    // Deduplication check by slug or officialUrl
    const existingBySlug = this.db.getResourceBySlug(validated.slug);
    if (existingBySlug) {
      // Update existing record safely
      const updated: CentralResource = {
        ...existingBySlug,
        name: validated.name,
        type: validated.type,
        officialUrl: validated.officialUrl,
        repositoryUrl: validated.repositoryUrl || existingBySlug.repositoryUrl,
        license: validated.license || existingBySlug.license,
        pricing: validated.pricing || existingBySlug.pricing,
        capabilities: Array.from(new Set([...existingBySlug.capabilities, ...validated.capabilities])),
        categories: Array.from(new Set([...existingBySlug.categories, ...validated.categories])),
        verificationStatus: validated.verificationStatus,
        editorialStatus: validated.editorialStatus,
        lastReviewedAt: new Date().toISOString(),
        metadata: { ...existingBySlug.metadata, ...validated.metadata },
      };
      this.db.saveResource(updated);
      platformEventBus.publish('ResourceUpdated', { resourceId: updated.id, slug: updated.slug }, 'CRIS');
      return updated;
    }

    const id = this.generateResourceId(validated.slug);
    const now = new Date().toISOString();

    const newResource: CentralResource = {
      id,
      slug: validated.slug,
      name: validated.name,
      type: validated.type,
      officialUrl: validated.officialUrl,
      repositoryUrl: validated.repositoryUrl,
      license: validated.license,
      pricing: validated.pricing,
      capabilities: validated.capabilities,
      categories: validated.categories,
      verificationStatus: validated.verificationStatus,
      editorialStatus: validated.editorialStatus,
      verifiedAt: validated.verificationStatus === 'verified' ? now : '',
      lastReviewedAt: now,
      metadata: validated.metadata,
    };

    this.db.saveResource(newResource);

    if (newResource.verificationStatus === 'verified') {
      platformEventBus.publish('ResourceVerified', { resourceId: newResource.id, slug: newResource.slug }, 'CRIS');
    }

    return newResource;
  }

  public getResourceById(id: string): CentralResource | undefined {
    return this.db.getResourceById(id);
  }

  public getResourceBySlug(slug: string): CentralResource | undefined {
    return this.db.getResourceBySlug(slug);
  }

  public getAllResources(): CentralResource[] {
    return this.db.getResources();
  }

  public findResources(filter: {
    type?: CentralResourceType;
    verificationStatus?: VerificationStatus;
    category?: string;
    capability?: string;
    searchQuery?: string;
  }): CentralResource[] {
    let resources = this.db.getResources();

    if (filter.type) {
      resources = resources.filter((r) => r.type === filter.type);
    }
    if (filter.verificationStatus) {
      resources = resources.filter((r) => r.verificationStatus === filter.verificationStatus);
    }
    if (filter.category) {
      const cat = filter.category.toLowerCase();
      resources = resources.filter((r) => r.categories.some((c) => c.toLowerCase() === cat));
    }
    if (filter.capability) {
      const cap = filter.capability.toLowerCase();
      resources = resources.filter((r) => r.capabilities.some((c) => c.toLowerCase() === cap));
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      resources = resources.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          r.capabilities.some((c) => c.toLowerCase().includes(q)) ||
          r.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    return resources;
  }

  public updateEditorialStatus(id: string, status: EditorialStatus): boolean {
    const resource = this.db.getResourceById(id);
    if (!resource) return false;

    resource.editorialStatus = status;
    resource.lastReviewedAt = new Date().toISOString();
    if (status === 'published' && resource.verificationStatus !== 'verified') {
      resource.verificationStatus = 'verified';
      resource.verifiedAt = new Date().toISOString();
      platformEventBus.publish('ResourceVerified', { resourceId: resource.id, slug: resource.slug }, 'Editorial');
    }
    this.db.saveResource(resource);
    platformEventBus.publish('ResourceUpdated', { resourceId: resource.id, status }, 'Editorial');
    return true;
  }
}

export const centralResourceRegistry = new CentralResourceRegistry();
