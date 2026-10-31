export interface MaintenanceAssessment {
  isActivelyMaintained: boolean;
  isArchived: boolean;
  daysSinceLastUpdate?: number;
  confidence: 'high' | 'medium' | 'low';
  notes: string;
}

export class MaintenanceVerifier {
  /**
   * Assesses maintenance activity
   */
  static assess(lastUpdateIso?: string, isArchived = false): MaintenanceAssessment {
    if (isArchived) {
      return {
        isActivelyMaintained: false,
        isArchived: true,
        confidence: 'high',
        notes: 'Repository is archived by owner. Read-only status.',
      };
    }

    if (!lastUpdateIso) {
      return {
        isActivelyMaintained: true,
        isArchived: false,
        confidence: 'low',
        notes: 'No repository update timestamp available; maintenance status unconfirmed.',
      };
    }

    const lastDate = new Date(lastUpdateIso);
    const now = new Date();
    const diffMs = now.getTime() - lastDate.getTime();
    const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (daysSince <= 90) {
      return {
        isActivelyMaintained: true,
        isArchived: false,
        daysSinceLastUpdate: daysSince,
        confidence: 'high',
        notes: `Active maintenance verified: updated ${daysSince} days ago.`,
      };
    }

    if (daysSince <= 365) {
      return {
        isActivelyMaintained: true,
        isArchived: false,
        daysSinceLastUpdate: daysSince,
        confidence: 'medium',
        notes: `Moderate maintenance cadence: updated ${daysSince} days ago.`,
      };
    }

    // Older than 1 year: Note that mature stable tools may have low commit frequencies
    return {
      isActivelyMaintained: false,
      isArchived: false,
      daysSinceLastUpdate: daysSince,
      confidence: 'medium',
      notes: `Low recent activity: last updated ${daysSince} days ago. Mature utilities may still be stable; verify compatibility before deployment.`,
    };
  }
}
