import { privacyAnalytics } from '../growth/analytics/privacy-analytics.js';
import { technicalSEOAuditor } from '../growth/seo/technical-seo-auditor.js';
import { growthStorage } from '../growth/storage/growth-storage.js';

async function main() {
  console.log('📡 AI Satellite — Generating Growth & Attribution Report');

  const seoReport = technicalSEOAuditor.runAudit();
  const analytics = privacyAnalytics.generateSummaryReport();
  const subscribers = growthStorage.getSubscribers();
  const queue = growthStorage.getDistributionQueue();

  const report = {
    generatedAt: new Date().toISOString(),
    reportingPeriod: 'last_30_days',
    technicalSEO: {
      routesAudited: seoReport.routesAudited,
      findings: seoReport.summary,
    },
    communityGrowth: {
      totalSubscribers: subscribers.length,
      activeSubscribers: subscribers.filter((s) => s.status === 'active').length,
      suppressionListCount: growthStorage.getSuppressionList().length,
    },
    distribution: {
      totalJobs: queue.length,
      published: queue.filter((j) => j.status === 'published').length,
      awaitingApproval: queue.filter((j) => j.status === 'draft' || j.status === 'awaiting_review').length,
    },
    privacyAnalytics: {
      isEstimated: analytics.isEstimated,
      totalEvents: analytics.totalEvents,
      pageViews: analytics.pageViews,
      searches: analytics.searches,
      githubReferrals: analytics.githubReferrals,
      topQueries: analytics.topQueries,
    },
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error('Growth report generation failed:', err);
  process.exit(1);
});
