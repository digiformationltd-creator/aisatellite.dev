/**
 * AI Satellite — Phase 15 Search Intent Mapping Engine
 * Maps developer queries into 7 distinct intent categories, pairs them with
 * optimal content formats, and flags keyword cannibalization.
 */

import type { SearchIntent, ContentFormat } from './types';

export interface IntentMappingResult {
  searchIntent: SearchIntent;
  recommendedFormat: ContentFormat;
  rationale: string;
}

export class SearchIntentMapper {
  /**
   * Maps a classified search intent to the optimal content format
   */
  public mapIntentToFormat(intent: SearchIntent): IntentMappingResult {
    switch (intent) {
      case 'comparative':
        return {
          searchIntent: 'comparative',
          recommendedFormat: 'comparison_matrix',
          rationale: 'Users seeking comparisons require side-by-side matrices highlighting feature overlap, licensing, and pricing.',
        };
      case 'tool_discovery':
        return {
          searchIntent: 'tool_discovery',
          recommendedFormat: 'tool_profile',
          rationale: 'Discovery intent is best satisfied by structured tool profiles with verified facts, screenshots, and official URLs.',
        };
      case 'tutorial':
        return {
          searchIntent: 'tutorial',
          recommendedFormat: 'step_tutorial',
          rationale: 'Tutorial intent requires sequential execution steps with copyable verified terminal code snippets.',
        };
      case 'troubleshooting':
        return {
          searchIntent: 'troubleshooting',
          recommendedFormat: 'troubleshooting_guide',
          rationale: 'Troubleshooting intent requires diagnosis steps, error reproduction, and exact root-cause remediation fixes.',
        };
      case 'open_source_evaluation':
        return {
          searchIntent: 'open_source_evaluation',
          recommendedFormat: 'original_research_report',
          rationale: 'Evaluation intent requires in-depth licensing analysis, maintainer velocity metrics, and governance transparency.',
        };
      case 'developer_implementation':
        return {
          searchIntent: 'developer_implementation',
          recommendedFormat: 'architecture_blueprint',
          rationale: 'Implementation intent requires system architecture diagrams, Docker Compose templates, and API integrations.',
        };
      case 'informational':
      default:
        return {
          searchIntent: 'informational',
          recommendedFormat: 'step_tutorial',
          rationale: 'Informational queries benefit from clear definitions, practical examples, and source documentation links.',
        };
    }
  }

  /**
   * Infers search intent from raw developer query text
   */
  public inferIntentFromQuery(query: string): SearchIntent {
    const q = query.toLowerCase().trim();

    if (q.includes('vs') || q.includes('alternative') || q.includes('comparison') || q.includes('replace') || q.includes('better than')) {
      return 'comparative';
    }
    if (q.includes('how to') || q.includes('tutorial') || q.includes('setup') || q.includes('deploy') || q.includes('install') || q.includes('guide')) {
      return 'tutorial';
    }
    if (q.includes('fix') || q.includes('error') || q.includes('failed') || q.includes('troubleshoot') || q.includes('not working') || q.includes('debug')) {
      return 'troubleshooting';
    }
    if (q.includes('best') || q.includes('free') || q.includes('open source') || q.includes('tools for') || q.includes('list of')) {
      return 'tool_discovery';
    }
    if (q.includes('license') || q.includes('commercial use') || q.includes('audit') || q.includes('compliance')) {
      return 'open_source_evaluation';
    }
    if (q.includes('architecture') || q.includes('pipeline') || q.includes('api') || q.includes('integration') || q.includes('code example')) {
      return 'developer_implementation';
    }

    return 'informational';
  }

  /**
   * Detects keyword cannibalization against existing published or planned queries
   */
  public checkCannibalization(
    candidateQuery: string,
    candidateIntent: SearchIntent,
    existingQueries: Array<{ query: string; intent: SearchIntent; pageUrl: string }>
  ): { isCannibalizing: boolean; competingUrl?: string; message: string } {
    const cleanCand = candidateQuery.toLowerCase().trim();

    for (const ex of existingQueries) {
      const cleanEx = ex.query.toLowerCase().trim();

      // Identical or near-identical query targeting the exact same intent
      if (cleanCand === cleanEx && candidateIntent === ex.intent) {
        return {
          isCannibalizing: true,
          competingUrl: ex.pageUrl,
          message: `Query '${candidateQuery}' directly conflicts with existing page '${ex.pageUrl}' sharing intent '${candidateIntent}'.`,
        };
      }

      // High substring overlap targeting the exact same intent
      if (
        (cleanCand.includes(cleanEx) || cleanEx.includes(cleanCand)) &&
        candidateIntent === ex.intent &&
        Math.abs(cleanCand.length - cleanEx.length) < 5
      ) {
        return {
          isCannibalizing: true,
          competingUrl: ex.pageUrl,
          message: `High keyword cannibalization risk with '${ex.query}' on '${ex.pageUrl}'. Consider consolidating into existing resource.`,
        };
      }
    }

    return {
      isCannibalizing: false,
      message: 'No keyword cannibalization detected.',
    };
  }
}

export const searchIntentMapper = new SearchIntentMapper();
