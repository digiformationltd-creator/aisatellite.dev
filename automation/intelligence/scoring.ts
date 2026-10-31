import type { DiscoveredResource, QualityScoreBreakdown } from '../shared/types.js';

export class ResourceScorer {
  /**
   * Deterministically calculates resource quality score (0-100)
   */
  static score(resource: DiscoveredResource): QualityScoreBreakdown {
    // 1. Practical Developer Usefulness (25% weight)
    let usefulness = 50;
    if (resource.description.length > 30) usefulness += 20;
    if (resource.tags.length >= 2) usefulness += 15;
    if (resource.officialUrl && resource.repositoryUrl) usefulness += 15;
    usefulness = Math.min(100, usefulness);

    // 2. Documentation Quality (20% weight)
    let docs = 40;
    if (resource.documentationUrl) docs += 35;
    if (resource.evidenceUrls.length >= 2) docs += 25;
    docs = Math.min(100, docs);

    // 3. Free / Open Source Accessibility (20% weight)
    let accessibility = 30;
    if (resource.freeClassification === 'open_source') {
      accessibility = 100;
    } else if (resource.freeClassification === 'free_forever') {
      accessibility = 90;
    } else if (resource.freeClassification === 'freemium') {
      accessibility = 70;
    } else if (resource.freeClassification === 'free_trial') {
      accessibility = 20;
    }

    // 4. Maintenance Confidence (15% weight)
    let maintenance = 40;
    if (resource.lastRepositoryUpdate) {
      const days = Math.floor(
        (Date.now() - new Date(resource.lastRepositoryUpdate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days <= 60) maintenance = 100;
      else if (days <= 180) maintenance = 85;
      else if (days <= 365) maintenance = 65;
      else maintenance = 40;
    }

    // 5. Installation Usability (10% weight)
    let installation = 50;
    if (resource.repositoryUrl) installation += 30;
    if (resource.freeTierLimitations.length === 0) installation += 20;
    installation = Math.min(100, installation);

    // 6. Community Signals (10% weight) - capped to avoid star worship
    let community = 40;
    const stars = resource.githubStars || 0;
    if (stars > 10000) community = 100;
    else if (stars > 1000) community = 85;
    else if (stars > 100) community = 70;
    else if (stars > 10) community = 55;

    // Weighted Calculation
    const totalScore = Math.round(
      usefulness * 0.25 +
        docs * 0.2 +
        accessibility * 0.2 +
        maintenance * 0.15 +
        installation * 0.1 +
        community * 0.1
    );

    const summary = `Score ${totalScore}/100 [Usefulness=${usefulness}, Docs=${docs}, FOSS=${accessibility}, Maint=${maintenance}, Install=${installation}, Community=${community}]`;

    return {
      developerUsefulness: usefulness,
      documentationQuality: docs,
      freeAccessibility: accessibility,
      maintenanceConfidence: maintenance,
      installationUsability: installation,
      communitySignals: community,
      totalScore,
      summary,
    };
  }
}
