/**
 * AI SATELLITE — AI AGENT SECURITY BOUNDARY & SANDBOX CONTROLS
 * Enforces least-privilege tool access, prompt injection sanitization, bounded execution, and human approval gates.
 */

import type { AIAgentSecurityRule } from './types';

export class AiAgentSecurityBoundary {
  private agentRules: Map<string, AIAgentSecurityRule> = new Map([
    [
      'technology-discovery-agent',
      {
        agentName: 'Technology Discovery Agent',
        allowedTools: ['searchGitHub', 'readPackageJson', 'inspectLicense', 'verifyPricingPage'],
        blockedTools: ['executeShellCommand', 'publishToolDirectly', 'deleteDatabaseRecord', 'writeRootFile'],
        maxExecutionDurationSeconds: 120,
        maxTokensPerExecution: 8000,
        promptInjectionDefenseActive: true,
        requiresHumanApprovalForProductionMutation: true,
      },
    ],
    [
      'content-freshness-agent',
      {
        agentName: 'Content Freshness Agent',
        allowedTools: ['checkUrlStatus', 'readLatestRelease', 'verifyDocumentationLink'],
        blockedTools: ['executeShellCommand', 'modifyAuthoritativeDatabase', 'sendEmailBroadcast'],
        maxExecutionDurationSeconds: 60,
        maxTokensPerExecution: 4000,
        promptInjectionDefenseActive: true,
        requiresHumanApprovalForProductionMutation: true,
      },
    ],
    [
      'code-generation-sandbox-agent',
      {
        agentName: 'Code Generation Sandbox Agent',
        allowedTools: ['compileTypeScript', 'runIsolatedSandboxTests', 'generateAst'],
        blockedTools: ['accessHostFilesystem', 'networkEgressToPrivateIps', 'executeRawProcess'],
        maxExecutionDurationSeconds: 180,
        maxTokensPerExecution: 12000,
        promptInjectionDefenseActive: true,
        requiresHumanApprovalForProductionMutation: true,
      },
    ],
  ]);

  /**
   * Validates whether an autonomous agent is authorized to invoke a specific tool.
   */
  public authorizeAgentToolCall(
    agentId: string,
    toolName: string
  ): { authorized: boolean; reason?: string } {
    const rule = this.agentRules.get(agentId);

    if (!rule) {
      return {
        authorized: false,
        reason: `Agent "${agentId}" is not registered in the security boundary catalog.`,
      };
    }

    if (rule.blockedTools.includes(toolName)) {
      return {
        authorized: false,
        reason: `Security violation: Tool "${toolName}" is explicitly blocked for agent "${agentId}".`,
      };
    }

    if (!rule.allowedTools.includes(toolName)) {
      return {
        authorized: false,
        reason: `Principle of least privilege: Tool "${toolName}" is not in the allowlist for agent "${agentId}".`,
      };
    }

    return { authorized: true };
  }

  /**
   * Scans incoming untrusted prompt or webpage text for prompt injection patterns.
   */
  public detectPromptInjection(input: string): { isSuspicious: boolean; detectedPatterns: string[] } {
    const patterns = [
      /ignore\s+(all\s+)?(previous|above)\s+instructions/i,
      /you\s+are\s+now\s+in\s+developer\s+mode/i,
      /disregard\s+system\s+prompt/i,
      /system:\s*override/i,
      /do\s+anything\s+now\s+jailbreak/i,
      /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    ];

    const detected: string[] = [];

    for (const pattern of patterns) {
      if (pattern.test(input)) {
        detected.push(pattern.source);
      }
    }

    return {
      isSuspicious: detected.length > 0,
      detectedPatterns: detected,
    };
  }

  /**
   * Asserts whether an action requires human review and sign-off before committing to production.
   */
  public requiresHumanApproval(agentId: string, actionType: string): boolean {
    const destructiveActions = ['publish', 'delete', 'modify-database', 'deploy', 'send-email'];
    if (destructiveActions.some((a) => actionType.toLowerCase().includes(a))) {
      return true;
    }

    const rule = this.agentRules.get(agentId);
    return rule ? rule.requiresHumanApprovalForProductionMutation : true;
  }
}

export const aiAgentSecurityBoundary = new AiAgentSecurityBoundary();
