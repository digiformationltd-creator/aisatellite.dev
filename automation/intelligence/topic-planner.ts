import type { DiscoveredResource, TopicProposal } from '../shared/types.js';
import { Logger } from '../shared/logger.js';

export class EditorialTopicPlanner {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('EditorialTopicPlanner');
  }

  /**
   * Plans article opportunities based on verified resources and existing inventory
   */
  planTopics(
    verifiedResources: DiscoveredResource[],
    existingSlugs: string[] = []
  ): TopicProposal[] {
    const proposals: TopicProposal[] = [];
    const existingSet = new Set(existingSlugs.map((s) => s.toLowerCase()));
    const plannedIntents = new Set<string>();

    this.logger.info(`Analyzing ${verifiedResources.length} verified resources for editorial opportunities`);

    for (const res of verifiedResources) {
      // 1. Tool Deep-Dive Guide
      const toolSlug = `how-to-deploy-${res.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-production`;
      const toolIntent = `deploy ${res.name.toLowerCase()}`;

      if (!existingSet.has(toolSlug) && !plannedIntents.has(toolIntent)) {
        plannedIntents.add(toolIntent);

        // Check contextual partner relevance
        let partner: 'digiformation' | 'digibizos' | 'none' = 'none';
        const lowerCat = res.category.toLowerCase();
        if (lowerCat.includes('crm') || lowerCat.includes('erp') || lowerCat.includes('workflow')) {
          partner = 'digibizos';
        }

        proposals.push({
          topicId: `topic-${res.id}-guide`,
          title: `How to Deploy ${res.name} in Production: Self-Hosting & Configuration Playbook`,
          slug: toolSlug,
          category: res.category,
          searchIntent: `Comprehensive production self-hosting and architecture guide for ${res.name}.`,
          targetKeywords: [res.name, 'self-hosted', 'production architecture', 'open-source'],
          evidenceReferences: res.evidenceUrls,
          priorityScore: Math.min(95, (res.qualityScore || 60) + 10),
          contentGapRationale: `High developer demand for self-hosting ${res.name} with verified license details.`,
          recommendedPartner: partner,
          approvedForDrafting: false,
          proposedAt: new Date().toISOString(),
        });
      }

      // 2. Open-Source Alternatives Comparison
      if (res.freeClassification === 'open_source') {
        const altSlug = `top-open-source-alternatives-to-proprietary-${res.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const altIntent = `alternatives ${res.category.toLowerCase()}`;

        if (!existingSet.has(altSlug) && !plannedIntents.has(altIntent)) {
          plannedIntents.add(altIntent);
          proposals.push({
            topicId: `topic-${res.category.toLowerCase()}-alternatives`,
            title: `Best Open-Source Alternatives in ${res.category}: Evaluated Feature Parity & Security`,
            slug: altSlug,
            category: res.category,
            searchIntent: `Comparison of top open-source alternatives in ${res.category} with verified licensing.`,
            targetKeywords: ['open source alternatives', res.category, 'self-hosted software', 'FOSS'],
            evidenceReferences: res.evidenceUrls,
            priorityScore: 85,
            contentGapRationale: `Provides verified migration paths from proprietary SaaS to open-source software in ${res.category}.`,
            recommendedPartner: 'none',
            approvedForDrafting: false,
            proposedAt: new Date().toISOString(),
          });
        }
      }
    }

    // Sort by priorityScore descending
    proposals.sort((a, b) => b.priorityScore - a.priorityScore);

    this.logger.info(`Generated ${proposals.length} deduplicated topic proposals`);
    return proposals;
  }
}
