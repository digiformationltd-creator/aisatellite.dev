/**
 * AI SATELLITE — AGENT D: TECHNICAL SPECIALIST
 * Reviews code syntax, software APIs, Docker configurations, and verifies GitHub projects.
 * Canonical Domain: https://aisatellite.dev
 */

import type { CodeSnippet, TechnicalValidationResult } from '../types';
import { technicalValidator } from '../technical-validator';
import { gitHubVerifier, type VerifiedRepositoryRecord } from '../github-verifier';

export class TechnicalSpecialistAgent {
  public readonly name = 'Agent D — Technical Specialist';

  public auditTechnicalContent(
    snippets: CodeSnippet[],
    githubRepos: string[]
  ): {
    validation: TechnicalValidationResult;
    verifiedRepos: VerifiedRepositoryRecord[];
  } {
    const validation = technicalValidator.validateSnippets(snippets);
    const verifiedRepos = githubRepos.map((repo) => gitHubVerifier.verifyRepository(repo));

    return {
      validation,
      verifiedRepos,
    };
  }
}

export const technicalSpecialistAgent = new TechnicalSpecialistAgent();
