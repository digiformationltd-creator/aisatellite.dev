#!/usr/bin/env node
import { StorageEngine } from '../automation/shared/storage.js';
import { VerificationPipeline } from '../automation/verification/pipeline.js';
import { ResourceScorer } from '../automation/intelligence/scoring.js';
import { Logger } from '../automation/shared/logger.js';

async function main() {
  const logger = new Logger('Script:Verify');
  logger.info('Starting Resource Verification Pipeline...');

  const storage = new StorageEngine();
  const pipeline = new VerificationPipeline();

  const candidates = storage.getCandidates();
  logger.info(`Found ${candidates.length} candidate resources in data/candidates/`);

  let verifiedCount = 0;
  let rejectedCount = 0;

  for (const candidate of candidates) {
    const result = await pipeline.verifyResource(candidate, false);

    if (result.passed) {
      candidate.status = 'verified';
      candidate.freeClassification = result.finalClassification;
      candidate.lastVerified = result.verifiedAt;

      // Calculate quality score
      const score = ResourceScorer.score(candidate);
      candidate.qualityScore = score.totalScore;

      storage.saveVerified(candidate);
      storage.saveCandidate(candidate); // update state in candidate list
      verifiedCount++;
      logger.info(`[VERIFIED] ${candidate.name} (Score: ${score.totalScore})`);
    } else {
      candidate.status = 'rejected';
      candidate.rejectionReason = result.reasons.join('; ');
      storage.saveCandidate(candidate);
      rejectedCount++;
      logger.warn(`[REJECTED] ${candidate.name}: ${candidate.rejectionReason}`);
    }
  }

  logger.info(`Verification finished. Verified: ${verifiedCount}, Rejected: ${rejectedCount}`);
}

main().catch((err) => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
