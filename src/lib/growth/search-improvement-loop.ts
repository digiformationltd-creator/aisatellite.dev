/**
 * AI Satellite — Search Performance Improvement Loop (Phase 9)
 * SEARCH DATA -> OPPORTUNITY DETECTION -> PROPOSAL -> EDITORIAL REVIEW -> APPROVED CHANGE -> DEPLOYMENT -> MEASUREMENT -> NEXT IMPROVEMENT
 */

export type LoopStage =
  | 'search_data_collected'
  | 'opportunity_detected'
  | 'proposal_generated'
  | 'editorial_review_pending'
  | 'change_approved'
  | 'deployed'
  | 'measurement_active'
  | 'improvement_completed';

export interface ImprovementProposal {
  id: string;
  targetCategory: string;
  targetUrl: string;
  targetQuery?: string;
  currentStage: LoopStage;
  hypothesis: string;
  actionType: 'title_description_opt' | 'new_tutorial' | 'comparison_expansion' | 'internal_linking' | 'schema_enhancement';
  proposedChange: string;
  approvedBy?: string;
  approvalDate?: string;
  baselineMetrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    averagePosition: number;
    measuredPeriod: string;
    isMeasured: boolean;
  };
  postDeployMetrics?: {
    impressions: number;
    clicks: number;
    ctr: number;
    averagePosition: number;
    measuredPeriod: string;
    isMeasured: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimeframeComparisonResult {
  baselinePeriod: string;
  currentPeriod: string;
  clicksChange: number;
  impressionsChange: number;
  ctrChangePercent: number;
  averagePositionDelta: number;
  isMeaningfulSample: boolean;
  interpretation: string;
}

export class SearchPerformanceImprovementLoop {
  private proposals: ImprovementProposal[] = [];

  constructor() {
    this.seedInitialProposals();
  }

  private seedInitialProposals() {
    this.proposals = [
      {
        id: 'prop-zapier-alt-ctr',
        targetCategory: 'Free alternatives',
        targetUrl: '/alternatives/zapier-alternatives',
        targetQuery: 'free zapier alternatives self hosted',
        currentStage: 'editorial_review_pending',
        hypothesis: 'Adding explicit pricing limitation disclaimer and self-hosting prerequisites directly into meta description and hero answer will increase click-through rate from developers seeking zero-cost automation.',
        actionType: 'title_description_opt',
        proposedChange: 'Update title to: "7 Best Free Zapier Alternatives (100% Self-Hosted & Open-Source 2026)" and refine direct answer block.',
        baselineMetrics: {
          impressions: 1250,
          clicks: 22,
          ctr: 0.0176,
          averagePosition: 6.2,
          measuredPeriod: 'last_28_days',
          isMeasured: false,
        },
        createdAt: '2026-10-25T10:00:00Z',
        updatedAt: '2026-10-31T09:00:00Z',
      },
      {
        id: 'prop-ollama-tutorial',
        targetCategory: 'AI coding tools',
        targetUrl: '/tools/ollama',
        targetQuery: 'self host ollama deepseek v3 guide',
        currentStage: 'deployed',
        hypothesis: 'Providing a 12-section technical tutorial on self-hosting Ollama with verification test markers will improve organic ranking and inbound developer bookmarks.',
        actionType: 'new_tutorial',
        proposedChange: 'Publish full tutorial: /tutorials/self-hosting-ollama-local-llm-guide',
        approvedBy: 'LeadTechnicalEditor-Aisha',
        approvalDate: '2026-10-28T14:30:00Z',
        baselineMetrics: {
          impressions: 890,
          clicks: 72,
          ctr: 0.0808,
          averagePosition: 3.8,
          measuredPeriod: 'last_28_days',
          isMeasured: false,
        },
        postDeployMetrics: {
          impressions: 1140,
          clicks: 98,
          ctr: 0.0859,
          averagePosition: 3.1,
          measuredPeriod: 'current_14_days',
          isMeasured: false,
        },
        createdAt: '2026-10-20T08:00:00Z',
        updatedAt: '2026-10-31T08:00:00Z',
      },
    ];
  }

  public getAllProposals(): ImprovementProposal[] {
    return [...this.proposals];
  }

  public getProposalById(id: string): ImprovementProposal | undefined {
    return this.proposals.find((p) => p.id === id);
  }

  /**
   * Advances proposal to the next stage of the improvement loop.
   * Strictly enforces human editorial authorization signature for approval.
   */
  public advanceStage(
    proposalId: string,
    targetStage: LoopStage,
    signature?: string
  ): { success: boolean; proposal?: ImprovementProposal; error?: string } {
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (!proposal) {
      return { success: false, error: `Proposal ${proposalId} not found.` };
    }

    if (targetStage === 'change_approved') {
      if (!signature || !signature.startsWith('LeadTechnicalEditor-')) {
        return {
          success: false,
          error: 'Editorial Gate: Approval requires an authorized human signature starting with "LeadTechnicalEditor-". Autonomous AI models are prohibited from approving production content changes.',
        };
      }
      proposal.approvedBy = signature;
      proposal.approvalDate = new Date().toISOString();
    }

    proposal.currentStage = targetStage;
    proposal.updatedAt = new Date().toISOString();

    return { success: true, proposal };
  }

  /**
   * Compares two periods over meaningful timeframes (e.g. 28 days vs prior 28 days)
   * avoiding 1-day noise.
   */
  public compareTimeframes(
    baseline: { impressions: number; clicks: number; ctr: number; averagePosition: number; periodDays: number },
    current: { impressions: number; clicks: number; ctr: number; averagePosition: number; periodDays: number }
  ): TimeframeComparisonResult {
    const isMeaningfulSample = baseline.periodDays >= 14 && current.periodDays >= 14;
    const clicksChange = current.clicks - baseline.clicks;
    const impressionsChange = current.impressions - baseline.impressions;
    const ctrChangePercent = baseline.ctr > 0 ? ((current.ctr - baseline.ctr) / baseline.ctr) * 100 : 0;
    const averagePositionDelta = baseline.averagePosition - current.averagePosition; // Positive is improvement

    let interpretation = 'Insufficient observation window to establish statistical significance.';
    if (isMeaningfulSample) {
      if (clicksChange > 0 && averagePositionDelta >= 0) {
        interpretation = `Positive momentum: Organic clicks increased by +${clicksChange} across ${current.periodDays} days with ranking improvement of +${averagePositionDelta.toFixed(1)} positions.`;
      } else if (clicksChange < 0) {
        interpretation = `Attention required: Organic clicks declined by ${clicksChange} across ${current.periodDays} days. Recommend reviewing search intent changes.`;
      } else {
        interpretation = `Stable trajectory across ${current.periodDays} days.`;
      }
    }

    return {
      baselinePeriod: `${baseline.periodDays} days baseline`,
      currentPeriod: `${current.periodDays} days observation`,
      clicksChange,
      impressionsChange,
      ctrChangePercent: Number(ctrChangePercent.toFixed(2)),
      averagePositionDelta: Number(averagePositionDelta.toFixed(2)),
      isMeaningfulSample,
      interpretation,
    };
  }
}

export const searchPerformanceImprovementLoop = new SearchPerformanceImprovementLoop();
