import type { EvidenceRecord } from '../shared/types.js';

export class EvidenceLedgerManager {
  private records: Map<string, EvidenceRecord> = new Map();

  addClaim(
    claim: string,
    sourceUrl: string,
    sourceType: EvidenceRecord['sourceType'],
    confidence: EvidenceRecord['confidence'] = 'high'
  ): EvidenceRecord {
    // Basic URL validation
    try {
      new URL(sourceUrl);
    } catch {
      throw new Error(`Invalid source URL for claim: "${claim}". URL: ${sourceUrl}`);
    }

    const claimId = `claim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const record: EvidenceRecord = {
      claimId,
      claim: claim.trim(),
      sourceUrl: sourceUrl.trim(),
      sourceType,
      verifiedAt: new Date().toISOString().split('T')[0],
      confidence,
    };

    this.records.set(claimId, record);
    return record;
  }

  getClaims(): EvidenceRecord[] {
    return Array.from(this.records.values());
  }

  validateLedger(minClaims = 1): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (this.records.size < minClaims) {
      errors.push(`Evidence ledger must contain at least ${minClaims} grounded factual claims. Found: ${this.records.size}`);
    }

    for (const record of this.records.values()) {
      if (!record.sourceUrl || !record.sourceUrl.startsWith('http')) {
        errors.push(`Claim "${record.claimId}" has invalid source URL: ${record.sourceUrl}`);
      }
      if (!record.claim || record.claim.length < 5) {
        errors.push(`Claim "${record.claimId}" is empty or too short.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
