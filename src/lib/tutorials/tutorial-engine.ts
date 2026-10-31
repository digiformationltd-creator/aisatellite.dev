import tutorialsRaw from '../../../data/tutorials/tutorials.json';

export interface CodingTutorial {
  id: string;
  slug: string;
  title: string;
  category: string;
  language: string;
  problemStatement: string;
  whatWillBeBuilt: string;
  prerequisites: string[];
  architectureOverview: string;
  completeImplementation: string;
  explanation: string;
  testing: string;
  troubleshooting: Array<{ issue: string; fix: string }>;
  securityConsiderations: string;
  performanceOptimization: string;
  deployment: string;
  codeTested: boolean;
  lastVerified: string;
}

export class TutorialEngine {
  private tutorials: CodingTutorial[] = [];

  constructor() {
    this.tutorials = tutorialsRaw as CodingTutorial[];
  }

  public getAllTutorials(): CodingTutorial[] {
    return [...this.tutorials];
  }

  public getTutorialBySlug(slug: string): CodingTutorial | undefined {
    return this.tutorials.find((t) => t.slug === slug);
  }

  public getTutorialsByCategory(category: string): CodingTutorial[] {
    return this.tutorials.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Validates code snippets for syntax and structure.
   */
  public validateSnippet(code: string, language: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!code || code.trim().length === 0) {
      errors.push('Empty code snippet.');
    }

    if (language === 'TypeScript' || language === 'JavaScript') {
      // Basic bracket parity check
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push(`Mismatched curly braces: ${openBraces} open, ${closeBraces} close.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const tutorialEngine = new TutorialEngine();
