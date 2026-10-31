import { newsletterDigestGenerator } from '../growth/newsletter/digest-generator.js';

async function main() {
  console.log('📡 AI Satellite — Generating Weekly Orbit Newsletter Digest');

  const editionNumber = Math.floor((Date.now() - 1730000000000) / (7 * 86400000)) + 1;

  const sampleItems = [
    {
      title: 'Free Alternatives to Airtable & Zapier',
      url: 'https://aisatellite.pages.dev/alternatives',
      summary: 'Explore self-hosted open-source tools that replace expensive monthly SaaS subscriptions.',
      category: 'alternatives',
      isVerifiedFree: true,
    },
    {
      title: 'Interactive 3D Web Lab: Cyber Grid Shader',
      url: 'https://aisatellite.pages.dev/3d-lab/shaders',
      summary: 'Production-ready Three.js GLSL shader component with responsive canvas controls.',
      category: '3d-web-lab',
      isVerifiedFree: true,
    },
    {
      title: 'Developer Toolbox CLI (v1.0.0 Released)',
      url: 'https://aisatellite.pages.dev/projects',
      summary: 'High-speed offline utility for base64 encoding, sha256 hashing, and json formatting.',
      category: 'software',
      isVerifiedFree: true,
    },
  ];

  const campaign = newsletterDigestGenerator.generateDigest(editionNumber, sampleItems);
  console.log(`✅ Generated Campaign Draft: ${campaign.id}`);
  console.log(`Title: ${campaign.title}`);
  console.log(`Items count: ${campaign.items.length}`);
  console.log(`Status: ${campaign.status} (Human approval required before dispatch)`);
}

main().catch((err) => {
  console.error('Newsletter generation failed:', err);
  process.exit(1);
});
