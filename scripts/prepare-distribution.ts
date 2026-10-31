import { distributionQueue } from '../growth/distribution/queue/distribution-queue.js';
import type { SupportedPlatform } from '../growth/schemas/index.js';

async function main() {
  console.log('📡 AI Satellite — Preparing Content Distribution Drafts');

  const candidates = [
    {
      sourceContentId: 'guide-self-hosted-postgres',
      title: 'Self-Hosting Postgres with pgvector for Local AI Workflows',
      summary: 'Complete architectural guide to deploying and tuning Postgres with vector embeddings on low-cost VPS instances.',
      targetUrl: 'https://aisatellite.pages.dev/blog/test-self-hosting-postgres-pgvector',
      platforms: ['github', 'linkedin', 'x', 'mastodon', 'bluesky'] as SupportedPlatform[],
      tags: ['PostgreSQL', 'AI', 'SelfHosted'],
    },
  ];

  let enqueuedCount = 0;

  for (const item of candidates) {
    for (const platform of item.platforms) {
      try {
        const job = distributionQueue.enqueueJob({
          sourceContentId: item.sourceContentId,
          platform,
          title: item.title,
          summary: item.summary,
          targetUrl: item.targetUrl,
          tags: item.tags,
        });
        console.log(`✅ Draft queued for ${platform}: ${job.id}`);
        enqueuedCount++;
      } catch (err) {
        console.warn(`Skipping job for ${platform}: ${String(err)}`);
      }
    }
  }

  console.log(`Distribution preparation complete. ${enqueuedCount} drafts ready for editorial review.`);
}

main().catch((err) => {
  console.error('Distribution preparation failed:', err);
  process.exit(1);
});
