import { type DeveloperSolution } from '../radar/schemas';
import solutionsRaw from '../../../data/solutions/developer-solutions.json';

export class SolutionEngine {
  private solutions: DeveloperSolution[] = [];

  constructor() {
    this.solutions = solutionsRaw as DeveloperSolution[];
  }

  public getAllSolutions(): DeveloperSolution[] {
    return [...this.solutions];
  }

  public getSolutionBySlug(slug: string): DeveloperSolution | undefined {
    return this.solutions.find((s) => s.slug === slug);
  }

  public findSolutionsForQuery(query: string): DeveloperSolution[] {
    const q = query.toLowerCase();
    return this.solutions.filter(
      (s) =>
        s.problem.toLowerCase().includes(q) ||
        s.recommendedApproach.toLowerCase().includes(q) ||
        s.requiredTools.some((t) => t.name.toLowerCase().includes(q))
    );
  }
}

export const solutionEngine = new SolutionEngine();
