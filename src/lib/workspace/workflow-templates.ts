/**
 * AI Satellite — Reusable Engineering Workflow Templates (Phase 12)
 * Structured checklists and engineering procedures for software development tasks.
 */

import type { WorkflowTemplate } from './types';

export class WorkflowTemplateLibrary {
  private templates: WorkflowTemplate[] = [
    {
      id: 'wf-research-tech',
      title: 'Research a New Technology',
      category: 'Research & Evaluation',
      purpose: 'Conduct rigorous, evidence-grounded research on a new framework, library, or platform before adoption.',
      requiredInputs: ['Technology Name', 'Official Website / Repository URL', 'Primary Use Case', 'Key Constraints'],
      steps: [
        { stepNumber: 1, title: 'Verify Licensing & Maintenance', action: 'Inspect license file, commit activity over last 90 days, open issues, and funding posture.', toolRecommendation: 'GitHub API / Repository Explorer' },
        { stepNumber: 2, title: 'Assess Vendor Lock-in & Portability', action: 'Determine data export capabilities, proprietary dependencies, and exit strategy feasibility.' },
        { stepNumber: 3, title: 'Analyze Community & Documentation', action: 'Review documentation clarity, API stability, and real-world adoption case studies.' },
        { stepNumber: 4, title: 'Prototype Proof-of-Concept', action: 'Build an isolated sandbox prototype validating critical constraints (e.g. bundle size, cold start latency).' },
      ],
      expectedOutputs: ['Evaluation Matrix Scorecard', 'Go / No-Go Recommendation Report'],
      limitations: ['Does not guarantee zero future breaking changes or license pivots.'],
      isCustom: false,
    },
    {
      id: 'wf-compare-software',
      title: 'Compare Paid vs Free Alternatives',
      category: 'Cost Optimization',
      purpose: 'Objectively compare commercial proprietary software with verified free open-source or self-hosted alternatives.',
      requiredInputs: ['Proprietary Tool Name', 'Monthly SaaS Cost', 'Candidate Free Alternative', 'Hosting Infrastructure'],
      steps: [
        { stepNumber: 1, title: 'Feature Parity Audit', action: 'Map proprietary features against open-source capabilities. Identify non-negotiable gaps.' },
        { stepNumber: 2, title: 'Total Cost of Ownership (TCO) Calculation', action: 'Calculate infrastructure costs (VPS, storage, backup) + maintenance hours vs SaaS subscription.' },
        { stepNumber: 3, title: 'Security & Compliance Review', action: 'Verify data residency, encryption at rest, SSO support, and vulnerability patching cadence.' },
        { stepNumber: 4, title: 'Pilot Migration Run', action: 'Test exporting representative dataset into the free alternative in a staging environment.' },
      ],
      expectedOutputs: ['Side-by-Side Trade-off Table', 'Annual TCO Savings Calculation'],
      limitations: ['Self-hosted solutions require ongoing DevOps maintenance and backups.'],
      isCustom: false,
    },
    {
      id: 'wf-prepare-ai-agent',
      title: 'Prepare Autonomous AI Agent & MCP Server',
      category: 'AI Engineering',
      purpose: 'Scaffold, sandbox, and verify an autonomous coding agent with Model Context Protocol tools.',
      requiredInputs: ['Target Task Objective', 'Required Tools / Capabilities', 'Allowed Directory Boundaries', 'Model Architecture'],
      steps: [
        { stepNumber: 1, title: 'Define Tool Schemas & JSON-RPC', action: 'Write strict Zod/JSON schemas for each tool input. Minimize parameters to prevent prompt confusion.' },
        { stepNumber: 2, title: 'Enforce Sandboxing & Least Privilege', action: 'Restrict filesystem access using path.resolve; enforce read-only database connections.' },
        { stepNumber: 3, title: 'Craft System Execution Directive', action: 'Compose an unambiguous prompt with negative constraints, error recovery rules, and output formatting.', toolRecommendation: 'PromptBuilderGalaxy' },
        { stepNumber: 4, title: 'Simulate Prompt Injection & Edge Cases', action: 'Test tool behavior against adversarial inputs (path traversal, recursive commands).' },
      ],
      expectedOutputs: ['Verified MCP Server Config', 'Automated Test Suite for Tool Execution'],
      limitations: ['Agents must be operated under approval control in production environments.'],
      isCustom: false,
    },
  ];

  public getAllTemplates(): WorkflowTemplate[] {
    return [...this.templates];
  }

  public getTemplate(id: string): WorkflowTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }
}

export const workflowTemplateLibrary = new WorkflowTemplateLibrary();
