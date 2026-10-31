import {
  type ResearchClaim,
  type EditorialArticle,
  type EvidenceStatus,
  type EditorialStatus,
  ResearchClaimSchema,
  EditorialArticleSchema,
} from './schemas';
import evidenceRaw from '../../../data/research/evidence-ledger.json';
import pipelineRaw from '../../../data/research/editorial-pipeline.json';

export class EvidenceLedgerManager {
  private claims: ResearchClaim[] = [];
  private articles: EditorialArticle[] = [];

  constructor() {
    this.claims = (evidenceRaw as any[]).map((c) => {
      const validated = ResearchClaimSchema.safeParse(c);
      if (!validated.success) {
        console.warn(`[EvidenceLedger] Invalid claim schema for ${c.id}:`, validated.error);
        return c as ResearchClaim;
      }
      return validated.data as ResearchClaim;
    });

    this.articles = (pipelineRaw as any[]).map((a) => {
      const validated = EditorialArticleSchema.safeParse(a);
      if (!validated.success) {
        console.warn(`[EvidenceLedger] Invalid article schema for ${a.id}:`, validated.error);
        return a as EditorialArticle;
      }
      return validated.data as EditorialArticle;
    });
  }

  public getAllClaims(): ResearchClaim[] {
    return [...this.claims];
  }

  public getClaimById(id: string): ResearchClaim | undefined {
    return this.claims.find((c) => c.id === id);
  }

  public getClaimsByStatus(status: EvidenceStatus): ResearchClaim[] {
    return this.claims.filter((c) => c.status === status);
  }

  /**
   * Evaluates freshness based on volatility recheck intervals.
   */
  public auditFreshness(): {
    freshClaims: ResearchClaim[];
    outdatedClaims: ResearchClaim[];
    flaggedCount: number;
  } {
    const now = Date.now();
    const fresh: ResearchClaim[] = [];
    const outdated: ResearchClaim[] = [];

    for (const claim of this.claims) {
      const checkDate = claim.verifiedAt ? new Date(claim.verifiedAt).getTime() : 0;
      const daysSinceCheck = (now - checkDate) / (1000 * 60 * 60 * 24);

      if (daysSinceCheck > claim.recheckIntervalDays || claim.status === 'outdated') {
        outdated.push({
          ...claim,
          status: 'outdated',
        });
      } else {
        fresh.push(claim);
      }
    }

    return {
      freshClaims: fresh,
      outdatedClaims: outdated,
      flaggedCount: outdated.length,
    };
  }

  /**
   * Enforces editorial review gate.
   * "Never automatically change an article to approved solely because an AI model reviewed it. Require an authorized human approval event."
   */
  public attemptPublishArticle(
    articleId: string,
    authorizedEditorId?: string
  ): { success: boolean; error?: string; article?: EditorialArticle } {
    const article = this.articles.find((a) => a.id === articleId);
    if (!article) {
      return { success: false, error: `Article ${articleId} not found in pipeline.` };
    }

    // Check evidence claims backing this article
    const associatedClaims = this.claims.filter((c) => article.claimIds.includes(c.id));
    const hasUnverifiedClaims = associatedClaims.some(
      (c) => c.status === 'unverified' || c.status === 'conflicting'
    );

    if (hasUnverifiedClaims) {
      return {
        success: false,
        error: `Publication rejected: Article contains unverified or conflicting evidence claims.`,
      };
    }

    // Review gate: Must have authorized human editor sign-off
    if (!authorizedEditorId || !authorizedEditorId.startsWith('LeadTechnicalEditor-')) {
      return {
        success: false,
        error: `Publication rejected: Requires human LeadTechnicalEditor authorization signature. AI models cannot approve publication.`,
      };
    }

    article.status = 'published';
    article.approvedBy = authorizedEditorId;
    article.approvedAt = new Date().toISOString();
    article.publishedAt = new Date().toISOString();

    return { success: true, article };
  }

  public getAllArticles(): EditorialArticle[] {
    return [...this.articles];
  }
}

export const evidenceLedgerManager = new EvidenceLedgerManager();
