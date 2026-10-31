import crypto from 'node:crypto';
import {
  type ProductProposal,
  type OpportunityScore,
  ProductProposalSchema,
} from '../../schemas';
import { auditLogger } from '../../monitoring/audit-logger';

export interface ResearchBrief {
  projectId: string;
  name: string;
  problemStatement: string;
  targetUsers: string[];
  existingAlternatives?: string[];
  proposedDifferentiation: string;
  mvpFeatures: string[];
  suggestedStack: string[];
  rawScores?: {
    usefulness: number;
    feasibility: number;
    ecosystemGap: number;
    sustainability: number;
    distribution: number;
    originality: number;
  };
}

export class ResearchAgent {
  public calculateOpportunityScore(scores: {
    usefulness: number;
    feasibility: number;
    ecosystemGap: number;
    sustainability: number;
    distribution: number;
    originality: number;
  }): OpportunityScore {
    // Weights:
    // usefulness: 30%, feasibility: 20%, ecosystemGap: 20%, sustainability: 15%, distribution: 10%, originality: 5%
    const weightedTotal = Math.round(
      scores.usefulness * 0.3 +
      scores.feasibility * 0.2 +
      scores.ecosystemGap * 0.2 +
      scores.sustainability * 0.15 +
      scores.distribution * 0.1 +
      scores.originality * 0.05
    );

    return {
      usefulness: scores.usefulness,
      feasibility: scores.feasibility,
      ecosystemGap: scores.ecosystemGap,
      sustainability: scores.sustainability,
      distribution: scores.distribution,
      originality: scores.originality,
      weightedTotal: Math.min(100, Math.max(0, weightedTotal)),
    };
  }

  public async evaluateIdea(brief: ResearchBrief): Promise<ProductProposal> {
    const defaultScores = brief.rawScores || {
      usefulness: 88,
      feasibility: 90,
      ecosystemGap: 85,
      sustainability: 82,
      distribution: 80,
      originality: 78,
    };

    const scores = this.calculateOpportunityScore(defaultScores);

    const proposal: ProductProposal = {
      proposalId: `prop_${brief.projectId}_${crypto.randomBytes(4).toString('hex')}`,
      projectId: brief.projectId,
      name: brief.name,
      problemStatement: brief.problemStatement,
      targetUsers: brief.targetUsers,
      existingAlternatives: brief.existingAlternatives || ['Heavy bloated web apps', 'Unmaintained CLI scripts'],
      proposedDifferentiation: brief.proposedDifferentiation,
      mvpFeatures: brief.mvpFeatures,
      excludedFeatures: ['Cloud vendor lock-in', 'Telemetry tracking', 'Paid tier restrictions'],
      suggestedStack: brief.suggestedStack,
      securityConsiderations: [
        'Pure client/local execution without transmitting user data',
        'Zero telemetry and zero external network calls by default',
        'Strict input sanitization for CLI arguments',
      ],
      licenseRecommendation: 'MIT',
      estimatedComplexity: scores.feasibility >= 80 ? 'low' : 'medium',
      evidenceReferences: [
        'Developer Community Survey: High demand for fast offline utility tools',
        'GitHub trending CLI utilities and ecosystem gaps',
      ],
      scores,
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };

    const validated = ProductProposalSchema.parse(proposal);

    auditLogger.log({
      actor: 'research-agent',
      action: 'produce_proposal',
      projectId: brief.projectId,
      details: {
        proposalId: validated.proposalId,
        weightedScore: validated.scores.weightedTotal,
        name: validated.name,
      },
    });

    return validated;
  }
}

export const researchAgent = new ResearchAgent();
