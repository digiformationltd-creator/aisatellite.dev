/**
 * AI SATELLITE — PHASE 23 ARTICLE OUTLINE GENERATOR
 * Intent-aware, non-generic outline generation tailored to search intent, depth, and jurisdiction.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../editorial/types';
import type { ArticleOutline, OutlineSection } from './types';

export class ArticleOutlineGenerator {
  private static instance: ArticleOutlineGenerator;

  public static getInstance(): ArticleOutlineGenerator {
    if (!ArticleOutlineGenerator.instance) {
      ArticleOutlineGenerator.instance = new ArticleOutlineGenerator();
    }
    return ArticleOutlineGenerator.instance;
  }

  /**
   * Generates a tailored, intent-specific outline.
   */
  public generateOutline(brief: ArticleBrief): ArticleOutline {
    const targetWordCount = this.calculateTargetWordCount(brief.suggestedArticleDepth);
    const sections: OutlineSection[] = [];

    // 1. Intent-Driven Opening
    sections.push({
      heading: this.getOpeningHeading(brief.searchIntent, brief.proposedTitle),
      level: 2,
      targetWordCount: Math.round(targetWordCount * 0.15),
      coreConcepts: [
        `Core problem: ${brief.readerProblem}`,
        `Search query target: ${brief.primaryKeyword}`,
      ],
      keyTakeaways: [
        'Immediate direct explanation answering user search intent.',
        'Prerequisites, environment requirements, and audience scoping.',
      ],
      aeoDirectAnswerTarget: `Comprehensive definition and direct answer resolving ${brief.primaryKeyword}.`,
    });

    // 2. Deep Dive / Architecture / Regulatory Core
    sections.push({
      heading: this.getCoreHeading(brief.topicCategory, brief.searchIntent),
      level: 2,
      targetWordCount: Math.round(targetWordCount * 0.35),
      coreConcepts: [
        'Underlying data structures and mechanisms',
        'Empirical trade-offs and decision criteria',
        brief.geography !== 'Global' ? `Jurisdiction statutory rules for ${brief.geography}` : 'Systemic scaling considerations',
      ],
      keyTakeaways: [
        'Detailed architectural diagram or comparison matrix.',
        'Elimination of common misconceptions or hidden failure modes.',
      ],
      practicalExampleTarget: brief.suggestedExamples[0] || 'Standard production deployment',
    });

    // 3. Step-by-Step Practical Implementation / Comparison Protocol
    sections.push({
      heading: this.getImplementationHeading(brief.searchIntent),
      level: 2,
      targetWordCount: Math.round(targetWordCount * 0.3),
      coreConcepts: [
        'Deterministic configuration steps',
        'Code snippets and terminal execution commands',
        'Verification commands to ensure correct state',
      ],
      keyTakeaways: [
        'Reproducible commands tested on standard environments.',
        'Flagging untested or platform-specific variations.',
      ],
      practicalExampleTarget: brief.suggestedExamples[1] || 'Real-world business case study',
    });

    // 4. Common Failure Modes, Edge Cases & Troubleshooting
    sections.push({
      heading: 'Common Failure Modes & Troubleshooting',
      level: 2,
      targetWordCount: Math.round(targetWordCount * 0.12),
      coreConcepts: [
        'Diagnosing runtime errors and misconfigurations',
        'Security, GDPR, or compliance vulnerabilities',
        'Performance bottlenecks under load',
      ],
      keyTakeaways: [
        'Actionable checklist to recover from standard edge cases.',
        'When to transition from free software to enterprise infrastructure.',
      ],
    });

    // 5. Strategic Conclusion & Resource Directory
    sections.push({
      heading: 'Strategic Summary & Next Steps',
      level: 2,
      targetWordCount: Math.round(targetWordCount * 0.08),
      coreConcepts: [
        'Synthesis of key decision rules',
        'Curated internal and open-source resource links',
      ],
      keyTakeaways: [
        'Clear decision rulebook for founders and engineers.',
        'Cross-links to verified AI Satellite directory tools.',
      ],
    });

    return {
      outlineId: `OUT-${brief.articleId}`,
      articleId: brief.articleId,
      title: brief.proposedTitle,
      searchIntent: brief.searchIntent,
      targetAudience: brief.targetAudience,
      targetWordCountTotal: targetWordCount,
      sections,
      uniqueAngleDescription: brief.uniqueEditorialAngle,
      createdAt: new Date().toISOString(),
    };
  }

  private calculateTargetWordCount(depth: string): number {
    if (depth.includes('Focused Answer')) return 1200;
    if (depth.includes('Standard Guide')) return 2200;
    if (depth.includes('In-Depth Guide')) return 3200;
    if (depth.includes('Pillar Content')) return 4500;
    return 2200;
  }

  private getOpeningHeading(intent: string, title: string): string {
    switch (intent) {
      case 'Troubleshooting':
        return 'The Root Cause Behind the Issue';
      case 'Alternative-Seeking':
      case 'Comparative':
        return 'Why Teams Seek Alternatives: Core Tradeoffs';
      case 'Commercial Investigation':
        return 'Evaluation Framework & Industry Cost Analysis';
      case 'Business Planning':
        return 'Strategic Foundation & Economic Rationale';
      default:
        return 'Executive Overview & Problem Statement';
    }
  }

  private getCoreHeading(category: string, intent: string): string {
    if (category === 'UK and US Business Guides') {
      return 'Statutory Framework & Legal Requirements';
    }
    if (category === 'Paid Software Alternatives' || intent === 'Comparative') {
      return 'Feature-by-Feature Capability & Total Cost of Ownership Matrix';
    }
    if (category === 'GitHub and Open-Source Projects') {
      return 'Architecture & Repository Source Code Inspection';
    }
    return 'Technical Architecture & Foundational Principles';
  }

  private getImplementationHeading(intent: string): string {
    switch (intent) {
      case 'Tutorial':
        return 'Step-by-Step Installation & Deployment Protocol';
      case 'Alternative-Seeking':
        return 'Data Migration & Self-Hosting Deployment Guide';
      case 'Business Planning':
        return 'Operational Execution Playbook & Workflow Integration';
      default:
        return 'Actionable Implementation Protocol';
    }
  }
}

export const articleOutlineGenerator = ArticleOutlineGenerator.getInstance();
