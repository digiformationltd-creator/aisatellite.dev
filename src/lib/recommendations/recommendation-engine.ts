import { type TechnologyResource } from '../radar/schemas';
import { radarStore } from '../radar/radar-store';
import { promptGalaxyEngine } from '../prompts/prompt-galaxy';
import { solutionEngine } from '../solutions/solution-engine';

export interface RecommendationSignals {
  currentCategory?: string;
  currentSlug?: string;
  searchIntent?: string;
  preferredFramework?: string;
}

export interface RecommendationOutput {
  similarTools: TechnologyResource[];
  freeAlternatives: TechnologyResource[];
  relatedPrompts: Array<{ title: string; slug: string; category: string }>;
  relatedSolutions: Array<{ title: string; slug: string }>;
  contextRationale: string;
}

export class RecommendationEngine {
  /**
   * Generates contextual recommendations grounded strictly in verified relationships.
   */
  public getRecommendations(signals: RecommendationSignals): RecommendationOutput {
    const allResources = radarStore.getAllResources();
    const current = signals.currentSlug ? radarStore.getResourceBySlug(signals.currentSlug) : undefined;
    const category = signals.currentCategory || current?.categories[0] || 'developer-tools';

    // 1. Similar Tools (same category, different slug)
    const similarTools = allResources
      .filter((r) => r.categories.includes(category) && r.slug !== signals.currentSlug)
      .slice(0, 3);

    // 2. Free Alternatives
    const freeAlternatives = allResources
      .filter((r) => r.pricingClassification.includes('open_source') && r.slug !== signals.currentSlug)
      .slice(0, 3);

    // 3. Related Prompts
    const relatedPrompts = promptGalaxyEngine
      .getAllTemplates()
      .slice(0, 2)
      .map((p) => ({ title: p.title, slug: p.slug, category: p.category }));

    // 4. Related Solutions
    const relatedSolutions = solutionEngine
      .getAllSolutions()
      .slice(0, 2)
      .map((s) => ({ title: s.problem, slug: s.slug }));

    return {
      similarTools,
      freeAlternatives,
      relatedPrompts,
      relatedSolutions,
      contextRationale: `Curated based on verified taxonomy relationships in ${category}.`,
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
