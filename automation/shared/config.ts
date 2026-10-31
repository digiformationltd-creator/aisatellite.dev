import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export interface CategoryConfig {
  id: string;
  name: string;
  queries: string[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  minEvidenceCount: number;
  allowedLicenses: string[];
  updateFrequencyDays: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface EditorialPolicyConfig {
  maxDailyPublishedArticles: number;
  requireHumanApproval: boolean;
  minEvidenceCountPerDraft: number;
  requireSpdxLicense: boolean;
  preventUnverifiedClaims: boolean;
  allowDraftStagingWithoutApiKeys: boolean;
}

export interface PartnerConfig {
  id: string;
  name: string;
  officialUrl: string;
  topics: string[];
  commercialRelationship: string;
  disclosureBadge: string;
  mandatoryDisclaimer: string;
  privacyEvents: {
    viewEvent: string;
    clickEvent: string;
  };
}

export class ConfigManager {
  private baseDir: string;

  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
  }

  private readYamlFile<T>(relativePath: string): T {
    const fullPath = path.join(this.baseDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Configuration file not found: ${fullPath}`);
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    return parse(content) as T;
  }

  getCategories(): CategoryConfig[] {
    const data = this.readYamlFile<{ categories: CategoryConfig[] }>('config/categories.yaml');
    return data.categories || [];
  }

  getDiscoverySources(): any {
    return this.readYamlFile<any>('config/discovery-sources.yaml');
  }

  getEditorialPolicy(): { editorialPolicy: EditorialPolicyConfig; scoringWeights: Record<string, number> } {
    return this.readYamlFile<any>('config/editorial-policy.yaml');
  }

  getPartners(): Record<string, PartnerConfig> {
    const data = this.readYamlFile<{ partners: Record<string, PartnerConfig> }>('config/partners.yaml');
    return data.partners || {};
  }
}
