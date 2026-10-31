/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine I: Relevance Scoring & Editorial Intelligence Pipeline (Part 2: Editorial Workflow)
 * 
 * Converts verified intelligence and research evidence into structured editorial proposals
 * for human review before publishing to public directories or radar feeds.
 */

import { uuidv4 } from './id-generator';
import type { EditorialProposal } from './types';
import { CreateEditorialProposalSchema } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export class EditorialPipeline {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultProposals();
  }

  public createProposal(input: {
    title: string;
    proposalType: 'tool_profile' | 'alternative_comparison' | 'project_review' | 'change_report' | 'tutorial_guide';
    researchEvidenceIds: string[];
    targetAudience: string;
    searchIntent: string;
    uniqueValue: string;
    proposedByAgent?: string;
  }): EditorialProposal {
    const validated = CreateEditorialProposalSchema.parse(input);
    const now = new Date().toISOString();

    const proposal: EditorialProposal = {
      id: `prop-${uuidv4().slice(0, 8)}`,
      title: validated.title,
      proposalType: validated.proposalType,
      researchEvidenceIds: validated.researchEvidenceIds,
      targetAudience: validated.targetAudience,
      searchIntent: validated.searchIntent,
      uniqueValue: validated.uniqueValue,
      status: 'pending_review',
      proposedByAgent: validated.proposedByAgent,
      createdAt: now,
      updatedAt: now,
    };

    this.db.saveEditorialProposal(proposal);
    return proposal;
  }

  public getProposals(status?: 'draft' | 'pending_review' | 'approved' | 'rejected'): EditorialProposal[] {
    const all = this.db.getEditorialProposals();
    if (!status) return all;
    return all.filter((p) => p.status === status);
  }

  public getProposalById(id: string): EditorialProposal | undefined {
    return this.db.findProposalById(id);
  }

  public reviewProposal(
    id: string,
    reviewer: string,
    decision: 'approved' | 'rejected',
    notes?: string
  ): EditorialProposal {
    const proposal = this.db.findProposalById(id);
    if (!proposal) {
      throw new Error(`Editorial proposal not found: ${id}`);
    }

    const now = new Date().toISOString();
    const updated: EditorialProposal = {
      ...proposal,
      status: decision,
      reviewedBy: reviewer,
      reviewNotes: notes,
      updatedAt: now,
    };

    this.db.saveEditorialProposal(updated);
    return updated;
  }

  public seedDefaultProposals(): void {
    const existing = this.db.getEditorialProposals();
    if (existing.length > 0) return;

    const defaults: Array<{
      title: string;
      proposalType: 'tool_profile' | 'alternative_comparison' | 'project_review' | 'change_report' | 'tutorial_guide';
      researchEvidenceIds: string[];
      targetAudience: string;
      searchIntent: string;
      uniqueValue: string;
      proposedByAgent: string;
      status: 'approved' | 'pending_review';
    }> = [
      {
        title: 'Supabase vs Firebase: The Definitive Self-Hosting & Cost Comparison',
        proposalType: 'alternative_comparison',
        researchEvidenceIds: ['ev-supabase-apache'],
        targetAudience: 'Full-stack engineers and startup architects',
        searchIntent: 'Free Firebase alternatives for relational data',
        uniqueValue: 'Direct SQL capabilities, row-level security without vendor lock-in, and self-hosted Docker compose templates.',
        proposedByAgent: 'Autonomous Alternatives Agent',
        status: 'approved',
      },
      {
        title: 'Deploying Ollama Locally: Zero-Cost LLM Inference on Consumer Hardware',
        proposalType: 'tutorial_guide',
        researchEvidenceIds: ['ev-ollama-mit'],
        targetAudience: 'AI developers and privacy-conscious teams',
        searchIntent: 'How to run local models without OpenAI API costs',
        uniqueValue: 'Step-by-step benchmark and memory sizing guide across macOS Apple Silicon and Linux NVIDIA rigs.',
        proposedByAgent: 'AI Discovery Agent',
        status: 'approved',
      },
      {
        title: 'Redis Licensing Transition: Valkey Migration Analysis',
        proposalType: 'change_report',
        researchEvidenceIds: ['ev-redis-bsd'],
        targetAudience: 'DevOps and infrastructure architects',
        searchIntent: 'Open source alternatives to Redis after license change',
        uniqueValue: 'In-depth analysis of Linux Foundation Valkey governance, wire protocol compatibility, and operational drop-in stability.',
        proposedByAgent: 'Change Detection Agent',
        status: 'pending_review',
      },
    ];

    for (const d of defaults) {
      const now = new Date().toISOString();
      const proposal: EditorialProposal = {
        id: `prop-${uuidv4().slice(0, 8)}`,
        title: d.title,
        proposalType: d.proposalType,
        researchEvidenceIds: d.researchEvidenceIds,
        targetAudience: d.targetAudience,
        searchIntent: d.searchIntent,
        uniqueValue: d.uniqueValue,
        status: d.status,
        proposedByAgent: d.proposedByAgent,
        reviewedBy: d.status === 'approved' ? 'Lead Technical Editor' : undefined,
        createdAt: now,
        updatedAt: now,
      };
      this.db.saveEditorialProposal(proposal);
    }
  }
}

export const editorialPipeline = new EditorialPipeline();
