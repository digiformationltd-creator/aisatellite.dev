import { type SearchIntent } from '../radar/schemas';

export interface IntentClassificationResult {
  intent: SearchIntent;
  confidence: number;
  extractedEntities: string[];
  isTargetingAlternative: boolean;
  targetSubject?: string;
}

export class IntentClassifier {
  private alternativeKeywords = [
    'alternative', 'alternatives', 'replace', 'replacement', 'instead of',
    'free version of', 'substitute for', 'switch from', 'open-source equivalent',
  ];

  private compareKeywords = [
    'compare', 'comparison', 'vs', 'versus', 'difference between', 'better than',
  ];

  private problemKeywords = [
    'how to build', 'how do i', 'how to solve', 'fix', 'error', 'solution for',
    'i need to build', 'i want to build', 'i need a', 'how to setup', 'how to create',
  ];

  private promptKeywords = [
    'prompt', 'prompts', 'system prompt', 'claude code prompt', 'cursor rules',
    'master prompt', 'prompt template',
  ];

  private aiToolKeywords = [
    'ai model', 'llm', 'local ai', 'chatbot', 'copilot', 'coding assistant',
    'speech to text', 'diffusion', 'ollama', 'mcp', 'agent',
  ];

  private workflowKeywords = [
    'workflow', 'pipeline', 'automation', 'n8n', 'cron', 'orchestrator', 'webhook',
  ];

  private openSourceKeywords = [
    'open source', 'open-source', 'oss', 'self-host', 'self hosted', 'self-hosting',
    'github repo',
  ];

  private tutorialKeywords = [
    'tutorial', 'guide', 'playbook', 'handbook', 'learn', 'step by step', 'docs',
  ];

  /**
   * Deterministically classifies the user query intent without requiring expensive LLM calls.
   */
  public classify(query: string): IntentClassificationResult {
    const q = query.toLowerCase().trim();
    const extractedEntities: string[] = [];

    // Common known software targets
    const knownSoftware = [
      'zapier', 'photoshop', 'figma', 'notion', 'firebase', 'heroku', 'vercel',
      'airtable', 'chatgpt', 'github copilot', 'salesforce', 'aws s3', 'stripe',
      'auth0', 'okta', 'docker', 'postgresql', 'sqlite', 'supabase', 'ollama', 'n8n',
      'gimp', 'penpot', 'appflowy', 'coolify', 'authentik', 'minio', 'three.js'
    ];

    let targetSubject: string | undefined = undefined;
    for (const name of knownSoftware) {
      if (q.includes(name)) {
        extractedEntities.push(name);
        if (!targetSubject) targetSubject = name;
      }
    }

    // 1. Check for alternative intent
    const hasAlternativeKeyword = this.alternativeKeywords.some((kw) => q.includes(kw));
    if (hasAlternativeKeyword || (q.includes('free') && extractedEntities.length > 0 && !q.includes('prompt'))) {
      return {
        intent: 'find_alternative',
        confidence: 0.95,
        extractedEntities,
        isTargetingAlternative: true,
        targetSubject,
      };
    }

    // 2. Check for comparison intent
    if (this.compareKeywords.some((kw) => q.includes(kw))) {
      return {
        intent: 'compare_tools',
        confidence: 0.9,
        extractedEntities,
        isTargetingAlternative: false,
        targetSubject,
      };
    }

    // 3. Check for prompt intent
    if (this.promptKeywords.some((kw) => q.includes(kw))) {
      return {
        intent: 'find_prompt',
        confidence: 0.92,
        extractedEntities,
        isTargetingAlternative: false,
        targetSubject,
      };
    }

    // 4. Check for workflow intent
    if (this.workflowKeywords.some((kw) => q.includes(kw))) {
      return {
        intent: 'find_workflow',
        confidence: 0.88,
        extractedEntities,
        isTargetingAlternative: false,
        targetSubject,
      };
    }

    // 5. Check for problem solving
    if (this.problemKeywords.some((kw) => q.includes(kw))) {
      return {
        intent: 'solve_problem',
        confidence: 0.89,
        extractedEntities,
        isTargetingAlternative: false,
        targetSubject,
      };
    }

    // 6. Check for AI tool
    if (this.aiToolKeywords.some((kw) => q.includes(kw))) {
      return {
        intent: 'find_ai_tool',
        confidence: 0.85,
        extractedEntities,
        isTargetingAlternative: false,
        targetSubject,
      };
    }

    // 7. Check for open-source search
    if (this.openSourceKeywords.some((kw) => q.includes(kw))) {
      return {
        intent: 'find_open_source',
        confidence: 0.86,
        extractedEntities,
        isTargetingAlternative: false,
        targetSubject,
      };
    }

    // 8. Check for tutorial
    if (this.tutorialKeywords.some((kw) => q.includes(kw))) {
      return {
        intent: 'find_tutorial',
        confidence: 0.85,
        extractedEntities,
        isTargetingAlternative: false,
        targetSubject,
      };
    }

    // Default to general topic exploration
    return {
      intent: 'explore_topic',
      confidence: 0.75,
      extractedEntities,
      isTargetingAlternative: false,
      targetSubject,
    };
  }
}

export const intentClassifier = new IntentClassifier();
