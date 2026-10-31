import type { TopicProposal, EvidenceRecord, ArticleDraft } from '../shared/types.js';
import { ModelProviderFactory } from './model-provider.js';
import { ConfigManager } from '../shared/config.js';
import { Logger } from '../shared/logger.js';

export class ArticleDraftingEngine {
  private logger: Logger;
  private configManager: ConfigManager;

  constructor() {
    this.logger = new Logger('ArticleDraftingEngine');
    this.configManager = new ConfigManager();
  }

  /**
   * Generates a grounded, structured technical draft
   */
  async generateDraft(
    topic: TopicProposal,
    evidence: EvidenceRecord[]
  ): Promise<ArticleDraft> {
    this.logger.info(`Drafting article for topic: "${topic.title}" (${topic.slug})`);

    const provider = ModelProviderFactory.getProvider();
    const partners = this.configManager.getPartners();

    const systemPrompt = `You are a Principal Software Architect writing for AI Satellite (aisatellite.pages.dev).
Strict rules:
1. Provide actionable, verified technical explanations and code.
2. Ground all claims in the provided evidence records. Never invent statistics or reviews.
3. Include realistic limitations, operational trade-offs, and security best practices.
4. Tone must be authoritative, objective, and developer-focused.`;

    const userPrompt = `
Title: ${topic.title}
Category: ${topic.category}
Search Intent: ${topic.searchIntent}
Target Keywords: ${topic.targetKeywords.join(', ')}

Grounded Evidence Records:
${evidence.map((e, idx) => `[${idx + 1}] Claim: ${e.claim} (Source: ${e.sourceUrl})`).join('\n')}

Generate the comprehensive technical playbook body in Markdown.
`;

    const response = await provider.generate({
      systemPrompt,
      userPrompt,
      temperature: 0.2,
    });

    let body = response.content;

    // Contextual Partner Injection & Mandatory Disclosures
    if (topic.recommendedPartner && topic.recommendedPartner !== 'none') {
      const partnerData = partners[topic.recommendedPartner];
      if (partnerData) {
        body += `\n\n---\n\n### Partner Recommendation & Operational Disclosures\n\n> [!NOTE]\n> **${partnerData.disclosureBadge}**\n>\n> ${partnerData.mandatoryDisclaimer}\n>\n> For teams scaling operations, explore [${partnerData.name}](${partnerData.officialUrl}).`;
      }
    }

    const draftId = `draft-${Date.now()}-${topic.slug.slice(0, 20)}`;

    const draft: ArticleDraft = {
      draftId,
      topicId: topic.topicId,
      title: topic.title,
      slug: topic.slug,
      description: topic.searchIntent,
      category: topic.category,
      tags: [...topic.targetKeywords, 'open-source', 'playbook'],
      author: 'AI Satellite Research Lab',
      readingTime: '7 min read',
      partnerContext: topic.recommendedPartner,
      evidenceLedger: evidence,
      mdxContent: body,
      status: 'drafted',
      validationErrors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.logger.info(`Draft created successfully: ${draft.draftId}`);
    return draft;
  }
}
