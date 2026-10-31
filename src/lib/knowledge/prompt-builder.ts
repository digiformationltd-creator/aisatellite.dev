/**
 * AI Satellite — Prompt Builder Engine (Phase 11)
 * Generates structured, production-ready system prompts with sanitization against prompt injection.
 */

export interface PromptBuilderOptions {
  taskCategory: string;
  techStack: string;
  desiredOutput: string;
  complexity: string;
  constraints: string;
}

/**
 * Sanitizes input values to strip script tags, null bytes, and malicious execution patterns.
 */
export function sanitizePromptInput(val: string): string {
  if (!val) return '';
  return val
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/\0/g, '')
    .trim();
}

/**
 * Builds a structured, production-grade system prompt from modular user options.
 */
export function buildSystemPrompt(options: PromptBuilderOptions): string {
  const sanitizedStack = sanitizePromptInput(options.techStack) || 'TypeScript & React';
  const sanitizedCategory = sanitizePromptInput(options.taskCategory.replace(/_/g, ' ').toUpperCase()) || 'ENGINEERING';
  const sanitizedOutput = sanitizePromptInput(options.desiredOutput) || 'Production Implementation with Tests';
  const sanitizedComplexity = sanitizePromptInput(options.complexity) || 'Senior / Production-Grade';
  const sanitizedConstraints = sanitizePromptInput(options.constraints) || 'Zero unverified dependencies; strict type checking';

  return `# SYSTEM ROLE & EXECUTION DIRECTIVE
You are a Principal Software Architect and Senior ${sanitizedStack} Engineer operating under strict production quality constraints.

# TASK SCOPE
Category: ${sanitizedCategory}
Target Stack: ${sanitizedStack}
Seniority / Complexity: ${sanitizedComplexity}

# PRIMARY OBJECTIVE
Deliver a ${sanitizedOutput} addressing user specifications with zero hallucinated methods or unverified dependencies.

# MANDATORY CONSTRAINTS
- ${sanitizedConstraints}
- Enforce strict input validation using Zod or native guards.
- All code must include runnable automated test suites (Vitest / Playwright).
- Provide explicit troubleshooting steps and security considerations.

# OUTPUT FORMAT
Format code blocks in clean GitHub-Flavored Markdown with inline symbol comments explaining key architectural decisions.`;
}
