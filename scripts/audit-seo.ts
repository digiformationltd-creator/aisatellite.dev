import { technicalSEOAuditor } from '../growth/seo/technical-seo-auditor.js';

async function main() {
  console.log('📡 AI Satellite — Running Technical SEO Audit');
  const report = technicalSEOAuditor.runAudit();

  console.log('==================================================');
  console.log(`Audited Routes: ${report.routesAudited}`);
  console.log(`Findings Summary:`, JSON.stringify(report.summary, null, 2));
  console.log('==================================================');

  if (report.summary.critical > 0) {
    console.warn(`⚠️ Detected ${report.summary.critical} critical SEO findings requiring investigation.`);
  } else {
    console.log('✅ Technical SEO integrity checks passed with 0 critical issues.');
  }
}

main().catch((err) => {
  console.error('SEO Audit failed:', err);
  process.exit(1);
});
