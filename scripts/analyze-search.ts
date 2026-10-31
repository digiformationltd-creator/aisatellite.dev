import { searchConsoleClient } from '../growth/search-console/search-console-client.js';

async function main() {
  console.log('📡 AI Satellite — Analyzing Search Demand & Opportunities');
  const status = searchConsoleClient.getConnectionStatus();
  console.log(`Connection Status: [${status.authMethod}] ${status.message}`);

  const records = await searchConsoleClient.fetchSearchPerformance();
  console.log(`Fetched ${records.length} search performance records (Measured: ${records.some((r) => r.isMeasured)})`);

  const opportunities = searchConsoleClient.detectOpportunities(records);
  console.log(`Identified ${opportunities.length} growth and content optimization opportunities:`);

  for (const opp of opportunities) {
    console.log(`- [${opp.type.toUpperCase()}] ${opp.targetUrl} (Score: ${opp.score}): ${opp.recommendation}`);
  }
}

main().catch((err) => {
  console.error('Search analysis failed:', err);
  process.exit(1);
});
