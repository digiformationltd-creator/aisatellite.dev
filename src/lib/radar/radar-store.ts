import { type TechnologyResource, type RadarCategory, TechnologyResourceSchema } from './schemas';
import verifiedTechsRaw from '../../../data/radar/verified-technologies.json';
import categoriesRaw from '../../../data/radar/radar-categories.json';

export class RadarStore {
  private resources: TechnologyResource[] = [];
  private categories: RadarCategory[] = [];

  constructor() {
    this.categories = categoriesRaw as RadarCategory[];
    this.resources = (verifiedTechsRaw as any[]).map((r) => {
      const validated = TechnologyResourceSchema.safeParse(r);
      if (!validated.success) {
        console.warn(`[RadarStore] Invalid resource schema for ${r.id}:`, validated.error);
        return r as TechnologyResource;
      }
      return validated.data as TechnologyResource;
    });
  }

  public getAllResources(): TechnologyResource[] {
    return [...this.resources];
  }

  public getVerifiedResources(): TechnologyResource[] {
    return this.resources.filter((r) => r.verificationStatus === 'verified');
  }

  public getResourceBySlug(slug: string): TechnologyResource | undefined {
    return this.resources.find((r) => r.slug === slug);
  }

  public getResourcesByCategory(categorySlug: string): TechnologyResource[] {
    return this.resources.filter((r) => r.categories.includes(categorySlug));
  }

  public getAllCategories(): RadarCategory[] {
    // Dynamically calculate actual resource counts to avoid fabricated stats
    return this.categories.map((cat) => ({
      ...cat,
      resourceCount: this.resources.filter((r) => r.categories.includes(cat.slug)).length,
    }));
  }

  public getCategoryBySlug(slug: string): RadarCategory | undefined {
    const cat = this.categories.find((c) => c.slug === slug);
    if (!cat) return undefined;
    return {
      ...cat,
      resourceCount: this.resources.filter((r) => r.categories.includes(cat.slug)).length,
    };
  }

  public findAlternativesFor(toolName: string): TechnologyResource[] {
    const normalized = toolName.trim().toLowerCase();
    return this.resources.filter((r) =>
      r.replaces?.some((replaced) => replaced.toLowerCase().includes(normalized) || normalized.includes(replaced.toLowerCase()))
    );
  }

  public getStats() {
    const total = this.resources.length;
    const verified = this.resources.filter((r) => r.verificationStatus === 'verified').length;
    const openSource = this.resources.filter((r) => r.pricingClassification.includes('open_source')).length;
    const selfHosted = this.resources.filter((r) => r.selfHosted).length;
    return {
      totalResources: total,
      verifiedResources: verified,
      openSourceCount: openSource,
      selfHostedCount: selfHosted,
      categoriesCount: this.categories.length,
    };
  }
}

export const radarStore = new RadarStore();
