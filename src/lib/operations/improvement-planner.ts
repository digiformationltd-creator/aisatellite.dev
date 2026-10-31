/**
 * AI Satellite — Module H: Autonomous Improvement Planner (Phase 10)
 * Consolidates inputs across all monitoring subsystems into prioritized, evidence-backed
 * improvement tickets enforcing the 9-tier priority hierarchy and human approval gates.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { ImprovementTicket, IssueSeverity, ImprovementStatus } from './types';
import { ImprovementTicketSchema } from './types';

export class AutonomousImprovementPlanner {
  private dataDir: string;
  private ticketsFile: string;
  private tickets: Map<string, ImprovementTicket> = new Map();

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'operations');
    this.ticketsFile = path.join(this.dataDir, 'improvement-tickets.json');
    this.loadState();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.ticketsFile)) {
        const raw = fs.readFileSync(this.ticketsFile, 'utf8');
        const list: ImprovementTicket[] = JSON.parse(raw);
        list.forEach((t) => this.tickets.set(t.id, t));
      } else {
        this.seedInitialTickets();
      }
    } catch {
      this.seedInitialTickets();
    }
  }

  private seedInitialTickets(): void {
    const initial: ImprovementTicket[] = [
      {
        id: 'TKT-SEC-001',
        title: 'Harden Content Security Policy Script Nonce Directives',
        description: 'Review inline script hashes in public/_headers to minimize unsafe-inline attack surface.',
        severity: 'high',
        status: 'proposed',
        priorityTier: 1, // Critical security
        evidenceUrls: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP'],
        affectedResources: ['public/_headers'],
        proposedSolution: 'Migrate Cloudflare Turnstile scripts to explicit domain hashes and enforce strict-dynamic.',
        estimatedComplexity: 'medium',
        riskLevel: 'high',
        requiredApproval: 'security_officer',
        validationPlan: 'Execute playwright end-to-end suite across all interactive forms.',
        rollbackPlan: 'Restore previous public/_headers snapshot from data/operations/snapshots/.',
        executionLogs: ['[Planner] Synthesized ticket from security audit scan.'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'TKT-FRESH-002',
        title: 'Update Activepieces Self-Hosting Docker Guide',
        description: 'Activepieces released v0.30 with updated PostgreSQL migration syntax. Update tutorial.',
        severity: 'medium',
        status: 'awaiting_approval',
        priorityTier: 8, // Content improvement
        evidenceUrls: ['https://github.com/activepieces/activepieces/releases'],
        affectedResources: ['src/pages/solutions/free-customer-support-system.astro'],
        proposedSolution: 'Update Docker Compose yaml block and environment variable explanations.',
        estimatedComplexity: 'low',
        riskLevel: 'low',
        requiredApproval: 'editorial_lead',
        validationPlan: 'Verify syntax highlighting and code block validity with astro check.',
        rollbackPlan: 'Git checkout target file.',
        executionLogs: ['[Planner] Upstream release notification triggered content review.'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    initial.forEach((t) => this.tickets.set(t.id, t));
    this.persistState();
  }

  private persistState(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.ticketsFile, JSON.stringify(Array.from(this.tickets.values()), null, 2), 'utf8');
    } catch {
      // Safe no-op
    }
  }

  /**
   * Creates an improvement ticket and validates its schema with Zod.
   */
  public createTicket(payload: {
    title: string;
    description: string;
    severity: IssueSeverity;
    priorityTier: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    evidenceUrls: string[];
    affectedResources: string[];
    proposedSolution: string;
    estimatedComplexity: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
    requiredApproval: 'lead_architect' | 'editorial_lead' | 'security_officer' | 'none';
    validationPlan: string;
    rollbackPlan: string;
  }): ImprovementTicket {
    const id = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const candidate: ImprovementTicket = {
      id,
      title: payload.title,
      description: payload.description,
      severity: payload.severity,
      status: 'proposed',
      priorityTier: payload.priorityTier,
      evidenceUrls: payload.evidenceUrls,
      affectedResources: payload.affectedResources,
      proposedSolution: payload.proposedSolution,
      estimatedComplexity: payload.estimatedComplexity,
      riskLevel: payload.riskLevel,
      requiredApproval: payload.requiredApproval,
      validationPlan: payload.validationPlan,
      rollbackPlan: payload.rollbackPlan,
      executionLogs: [`[${new Date().toISOString()}] Ticket created via AutonomousImprovementPlanner`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Strict Zod validation
    const parsed = ImprovementTicketSchema.parse(candidate);
    this.tickets.set(id, parsed);
    this.persistState();
    return parsed;
  }

  /**
   * Approves a ticket. Strictly requires an authorized human signature.
   */
  public approveTicket(id: string, signature: string): { success: boolean; error?: string } {
    const ticket = this.tickets.get(id);
    if (!ticket) {
      return { success: false, error: 'Ticket not found' };
    }

    if (!signature || signature.includes('AI-Agent') || signature.includes('autonomous')) {
      return { success: false, error: 'Unauthorized: Autonomous agents cannot approve improvement tickets.' };
    }

    const validPrefixes = ['LeadArchitect-', 'LeadTechnicalEditor-', 'SecurityOfficer-', 'Admin-'];
    const hasValidSigner = validPrefixes.some((p) => signature.startsWith(p));
    if (!hasValidSigner) {
      return {
        success: false,
        error: `Approval rejected: Signature must start with an authorized role (${validPrefixes.join(', ')})`,
      };
    }

    ticket.status = 'approved';
    ticket.approvalSignature = signature;
    ticket.approvedAt = new Date().toISOString();
    ticket.updatedAt = new Date().toISOString();
    ticket.executionLogs.push(`[${new Date().toISOString()}] Approved by ${signature}`);

    this.persistState();
    return { success: true };
  }

  public getTicketsByPriority(): ImprovementTicket[] {
    return Array.from(this.tickets.values()).sort((a, b) => {
      if (a.priorityTier !== b.priorityTier) {
        return a.priorityTier - b.priorityTier;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  public getTicketById(id: string): ImprovementTicket | undefined {
    return this.tickets.get(id);
  }
}

export const autonomousImprovementPlanner = new AutonomousImprovementPlanner();
