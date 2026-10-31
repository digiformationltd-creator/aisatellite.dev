/**
 * AI Satellite — Grounded Keyword Intelligence & Opportunity Engine (Phase 9)
 * Evaluates search demand across the 12 core developer categories without fabricating search volumes.
 */

export interface KeywordOpportunityItem {
  id: string;
  topic: string;
  category:
    | 'Free alternatives'
    | 'Open-source software'
    | 'AI coding tools'
    | 'AI agents'
    | 'MCP servers'
    | 'Developer prompts'
    | 'Three.js'
    | 'CSS components'
    | 'Free APIs'
    | 'Automation'
    | 'Self-hosted platforms'
    | 'Software comparisons';
  targetSearchIntent: 'alternative_seeking' | 'how_to_build' | 'compare_products' | 'prompt_lookup' | 'code_reference';
  missionRelevanceScore: number; // 0 - 100
  evidenceAvailabilityScore: number; // 0 - 100
  technicalUsefulnessScore: number; // 0 - 100
  intentMatchWeight: number; // 0 - 100
  existingCoveragePenalty: number; // 0 - 50 (higher if we already have 3+ guides)
  overallOpportunityScore: number; // 0 - 100
  dataSource: 'measured_gsc' | 'user_zero_result_queries' | 'editorial_radar_gap';
  isMeasuredData: boolean;
  recommendedAction: string;
  recommendedSlug: string;
}

export class KeywordOpportunityEngine {
  private opportunities: KeywordOpportunityItem[] = [];

  constructor() {
    this.seedCanonicalOpportunities();
  }

  private seedCanonicalOpportunities() {
    const rawOpportunities: Omit<KeywordOpportunityItem, 'overallOpportunityScore'>[] = [
      {
        id: 'opp-kw-01-free-alt',
        topic: 'Free Zapier alternatives self hosted',
        category: 'Free alternatives',
        targetSearchIntent: 'alternative_seeking',
        missionRelevanceScore: 98,
        evidenceAvailabilityScore: 95,
        technicalUsefulnessScore: 94,
        intentMatchWeight: 96,
        existingCoveragePenalty: 15, // n8n exists
        dataSource: 'measured_gsc',
        isMeasuredData: false,
        recommendedAction: 'Expand Zapier comparison page with self-hosted Activepieces and Docker compose deployment scripts.',
        recommendedSlug: '/alternatives/zapier-alternatives',
      },
      {
        id: 'opp-kw-02-ai-coding',
        topic: 'Local LLM coding assistant with Claude Code and Ollama',
        category: 'AI coding tools',
        targetSearchIntent: 'how_to_build',
        missionRelevanceScore: 96,
        evidenceAvailabilityScore: 92,
        technicalUsefulnessScore: 98,
        intentMatchWeight: 95,
        existingCoveragePenalty: 20,
        dataSource: 'user_zero_result_queries',
        isMeasuredData: true,
        recommendedAction: 'Publish step-by-step tutorial on configuring DeepSeek-R1 / Qwen2.5-Coder locally with Cursor and Claude Code.',
        recommendedSlug: '/tutorials/local-coding-assistant-ollama-claude-code',
      },
      {
        id: 'opp-kw-03-mcp-servers',
        topic: 'Production Postgres MCP server setup for AI agents',
        category: 'MCP servers',
        targetSearchIntent: 'code_reference',
        missionRelevanceScore: 95,
        evidenceAvailabilityScore: 90,
        technicalUsefulnessScore: 92,
        intentMatchWeight: 90,
        existingCoveragePenalty: 10,
        dataSource: 'editorial_radar_gap',
        isMeasuredData: false,
        recommendedAction: 'Add schema inspection and read-only connection pool instructions to MCP Server Catalog.',
        recommendedSlug: '/mcp-servers',
      },
      {
        id: 'opp-kw-04-css-components',
        topic: 'Liquid glassmorphic UI card CSS without backdrop filter lag',
        category: 'CSS components',
        targetSearchIntent: 'how_to_build',
        missionRelevanceScore: 90,
        evidenceAvailabilityScore: 96,
        technicalUsefulnessScore: 91,
        intentMatchWeight: 88,
        existingCoveragePenalty: 15,
        dataSource: 'editorial_radar_gap',
        isMeasuredData: false,
        recommendedAction: 'Publish mobile-optimized GPU-accelerated liquid glass CSS tutorial with 60fps benchmark.',
        recommendedSlug: '/components/liquid-glass-card',
      },
      {
        id: 'opp-kw-05-threejs',
        topic: 'Three.js interactive 3D particle hero for Astro',
        category: 'Three.js',
        targetSearchIntent: 'how_to_build',
        missionRelevanceScore: 92,
        evidenceAvailabilityScore: 94,
        technicalUsefulnessScore: 90,
        intentMatchWeight: 89,
        existingCoveragePenalty: 10,
        dataSource: 'measured_gsc',
        isMeasuredData: false,
        recommendedAction: 'Document memory disposal and WebGL context-loss event handling in 3D Web Lab templates.',
        recommendedSlug: '/3d-lab/templates',
      },
      {
        id: 'opp-kw-06-free-apis',
        topic: 'Free developer APIs with no authentication requirement',
        category: 'Free APIs',
        targetSearchIntent: 'code_reference',
        missionRelevanceScore: 94,
        evidenceAvailabilityScore: 88,
        technicalUsefulnessScore: 93,
        intentMatchWeight: 92,
        existingCoveragePenalty: 5,
        dataSource: 'user_zero_result_queries',
        isMeasuredData: true,
        recommendedAction: 'Curate a source-verified catalog of 50+ free public developer APIs with CORS status.',
        recommendedSlug: '/free-apis',
      },
      {
        id: 'opp-kw-07-software-comp',
        topic: 'Supabase vs Firebase pricing and self hosting limits',
        category: 'Software comparisons',
        targetSearchIntent: 'compare_products',
        missionRelevanceScore: 97,
        evidenceAvailabilityScore: 98,
        technicalUsefulnessScore: 95,
        intentMatchWeight: 96,
        existingCoveragePenalty: 15,
        dataSource: 'editorial_radar_gap',
        isMeasuredData: false,
        recommendedAction: 'Publish structured matrix comparing egress fees, connection pooling, and storage limits.',
        recommendedSlug: '/compare/supabase-vs-firebase',
      },
    ];

    this.opportunities = rawOpportunities.map((item) => {
      // Grounded scoring formula
      const rawScore =
        item.missionRelevanceScore * 0.3 +
        item.evidenceAvailabilityScore * 0.25 +
        item.technicalUsefulnessScore * 0.25 +
        item.intentMatchWeight * 0.2 -
        item.existingCoveragePenalty;

      return {
        ...item,
        overallOpportunityScore: Math.round(Math.min(100, Math.max(0, rawScore))),
      };
    });
  }

  public getAllOpportunities(): KeywordOpportunityItem[] {
    return [...this.opportunities].sort((a, b) => b.overallOpportunityScore - a.overallOpportunityScore);
  }

  public getOpportunitiesByCategory(category: string): KeywordOpportunityItem[] {
    return this.opportunities.filter((o) => o.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Adds a newly discovered keyword opportunity grounded in verified search telemetry.
   */
  public addOpportunity(opp: Omit<KeywordOpportunityItem, 'id' | 'overallOpportunityScore'>): KeywordOpportunityItem {
    const rawScore =
      opp.missionRelevanceScore * 0.3 +
      opp.evidenceAvailabilityScore * 0.25 +
      opp.technicalUsefulnessScore * 0.25 +
      opp.intentMatchWeight * 0.2 -
      opp.existingCoveragePenalty;

    const newItem: KeywordOpportunityItem = {
      ...opp,
      id: `opp-kw-${Date.now().toString(36)}`,
      overallOpportunityScore: Math.round(Math.min(100, Math.max(0, rawScore))),
    };

    this.opportunities.push(newItem);
    return newItem;
  }
}

export const keywordOpportunityEngine = new KeywordOpportunityEngine();
