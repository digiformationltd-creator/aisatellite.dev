/**
 * AI SATELLITE — PHASE 17: LAUNCH CERTIFICATION & GLOBAL AUDIT TYPE SYSTEM
 * Permanent Production Domain: https://aisatellite.dev
 */

import { z } from 'zod';

export type CertificationDecision =
  | 'READY'
  | 'READY_WITH_APPROVED_EXCEPTIONS'
  | 'NOT_READY'
  | 'BLOCKED';

export interface PhaseAuditReport {
  phaseNumber: number;
  phaseName: string;
  status: 'FULLY_IMPLEMENTED' | 'PARTIALLY_IMPLEMENTED' | 'BLOCKED';
  implementedRequirements: string[];
  missingOrPending: string[];
  verifiedEvidence: string;
  testCoverageFiles: string[];
}

export interface RouteAuditRecord {
  routePath: string;
  pageType: 'STATIC_CONTENT' | 'DYNAMIC_CATALOG' | 'INTERACTIVE_TOOL' | 'PRIVATE_WORKSPACE' | 'ADMIN_CONSOLE';
  httpStatus: number;
  canonicalUrl: string;
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
  isIndexable: boolean;
  isAccessible: boolean;
}

export interface ScorecardCategory {
  categoryName: string;
  scorePercent: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'BLOCKED';
  verifiedEvidence: string;
  openIssues: string[];
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  responsibleOwner: string;
}

export interface DefectRecord {
  id: string;
  priority: 'P0-LAUNCH_BLOCKING' | 'P1-HIGH' | 'P2-MEDIUM' | 'P3-LOW';
  title: string;
  category: string;
  status: 'RESOLVED' | 'EXCEPTION_APPROVED' | 'OPEN';
  rootCause?: string;
  fixApplied?: string;
  verifiedAt?: string;
}

export interface LaunchCertificationReport {
  targetDomain: string;
  canonicalOrigin: string;
  overallDecision: CertificationDecision;
  overallHealthScore: number;
  totalTestsRun: number;
  totalTestsPassed: number;
  totalTestFiles: number;
  phasesAudited: PhaseAuditReport[];
  scorecard: ScorecardCategory[];
  defects: DefectRecord[];
  certifiedBy: string;
  certifiedAt: string;
}

export const RegisterDefectSchema = z.object({
  id: z.string().min(3),
  priority: z.enum(['P0-LAUNCH_BLOCKING', 'P1-HIGH', 'P2-MEDIUM', 'P3-LOW']),
  title: z.string().min(5),
  category: z.string().min(3),
  status: z.enum(['RESOLVED', 'EXCEPTION_APPROVED', 'OPEN']).default('OPEN'),
  rootCause: z.string().optional(),
  fixApplied: z.string().optional(),
});
