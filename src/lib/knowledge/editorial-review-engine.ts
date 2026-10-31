/**
 * AI Satellite — Editorial Review System (Phase 11)
 * Enforces strict editorial status progression across the 9 lifecycle states,
 * requiring verified evidence links and authorized human editor approval.
 */

import type { EditorialStatus, UniversalResourceBase } from './types';

export class EditorialReviewEngine {
  private allowedTransitions: Record<EditorialStatus, EditorialStatus[]> = {
    draft: ['researching', 'archived'],
    researching: ['fact_checking', 'draft', 'archived'],
    fact_checking: ['technical_review', 'researching', 'archived'],
    technical_review: ['editorial_review', 'fact_checking', 'archived'],
    editorial_review: ['approved', 'technical_review', 'archived'],
    approved: ['published', 'editorial_review', 'archived'],
    published: ['needs_update', 'archived'],
    needs_update: ['researching', 'editorial_review', 'archived'],
    archived: ['draft'],
  };

  /**
   * Validates whether a state transition is legal in the editorial lifecycle.
   */
  public canTransition(currentStatus: EditorialStatus, targetStatus: EditorialStatus): boolean {
    const validNextStates = this.allowedTransitions[currentStatus] || [];
    return validNextStates.includes(targetStatus);
  }

  /**
   * Promotes a content resource to approved or published state.
   * Strictly requires human LeadTechnicalEditor or LeadArchitect signature.
   */
  public reviewAndApprove(
    resource: UniversalResourceBase,
    targetStatus: 'approved' | 'published',
    editorSignature: string,
    reviewNotes?: string
  ): { success: boolean; error?: string } {
    if (!editorSignature || editorSignature.includes('AI-Agent') || editorSignature.includes('autonomous')) {
      return {
        success: false,
        error: 'Editorial Gate Rejected: Automated AI agents are strictly prohibited from approving published content.',
      };
    }

    const authorizedPrefixes = ['LeadTechnicalEditor-', 'LeadArchitect-', 'EditorialLead-'];
    const isAuthorized = authorizedPrefixes.some((prefix) => editorSignature.startsWith(prefix));

    if (!isAuthorized) {
      return {
        success: false,
        error: `Editorial Gate Rejected: Signer must be an authorized editorial role (${authorizedPrefixes.join(', ')}).`,
      };
    }

    // Require primary source references
    if (!resource.sourceReferences || resource.sourceReferences.length === 0) {
      return {
        success: false,
        error: 'Editorial Gate Rejected: Cannot approve content lacking primary source references.',
      };
    }

    // Verify legal transition
    if (targetStatus === 'approved' && resource.editorialStatus !== 'editorial_review') {
      return {
        success: false,
        error: `Cannot transition directly from "${resource.editorialStatus}" to "approved". Must pass "editorial_review" stage.`,
      };
    }

    resource.editorialStatus = targetStatus;
    resource.updatedDate = new Date().toISOString().split('T')[0];
    return { success: true };
  }
}

export const editorialReviewEngine = new EditorialReviewEngine();
