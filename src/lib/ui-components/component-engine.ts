import componentsRaw from '../../../data/components/ui-components.json';

export interface UIComponentItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  cssCode: string;
  htmlSnippet: string;
  dependencies: string[];
  browserCompatibility: string;
  accessibilityNotes: string;
  responsiveBehavior: string;
  performanceConsiderations: string;
  verified: boolean;
  lastVerified: string;
}

export class UIComponentEngine {
  private components: UIComponentItem[] = [];

  constructor() {
    this.components = componentsRaw as UIComponentItem[];
  }

  public getAllComponents(): UIComponentItem[] {
    return [...this.components];
  }

  public getComponentBySlug(slug: string): UIComponentItem | undefined {
    return this.components.find((c) => c.slug === slug);
  }

  public getComponentsByCategory(category: string): UIComponentItem[] {
    return this.components.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }
}

export const uiComponentEngine = new UIComponentEngine();
