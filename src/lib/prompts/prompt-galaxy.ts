import { type PromptTemplate, type PromptVariable } from '../radar/schemas';
import promptTemplatesRaw from '../../../data/prompts/prompt-templates.json';

export class PromptGalaxyEngine {
  private templates: PromptTemplate[] = [];

  constructor() {
    this.templates = promptTemplatesRaw as PromptTemplate[];
  }

  public getAllTemplates(): PromptTemplate[] {
    return [...this.templates];
  }

  public getTemplateBySlug(slug: string): PromptTemplate | undefined {
    return this.templates.find((t) => t.slug === slug);
  }

  public getTemplatesByCategory(category: string): PromptTemplate[] {
    return this.templates.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Replaces template placeholders with user-provided variable values.
   */
  public interpolate(template: PromptTemplate, variableValues: Record<string, string>): string {
    let result = template.templateText;
    for (const v of template.variables) {
      const val = variableValues[v.name] !== undefined ? variableValues[v.name] : v.defaultValue;
      result = result.split(v.name).join(val);
    }
    return result;
  }
}

export const promptGalaxyEngine = new PromptGalaxyEngine();
