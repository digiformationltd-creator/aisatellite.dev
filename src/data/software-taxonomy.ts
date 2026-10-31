export interface SoftwareTaxonomyItem {
  paidProduct: string;
  slug: string;
  vendor: string;
  category: string;
  typicalMonthlyCost: number;
  estimatedCostMonthly: string;
  synonyms: string[];
  bestAlternatives: string[];
  recommendedAlternatives: string[];
  tradeoffs: string[];
  keyTradeoffs: string;
}

export const SOFTWARE_TAXONOMY: SoftwareTaxonomyItem[] = [
  {
    paidProduct: 'Photoshop',
    slug: 'photoshop',
    vendor: 'Adobe',
    category: 'Creative & Design',
    typicalMonthlyCost: 22.99,
    estimatedCostMonthly: '$22.99/mo',
    synonyms: ['adobe photoshop', 'photo editor', 'raster graphics', 'image retouching'],
    bestAlternatives: ['GIMP', 'Krita', 'Photopea'],
    recommendedAlternatives: ['GIMP', 'Krita', 'Photopea'],
    tradeoffs: ['Steeper initial learning curve', 'CMYK print color setup requires separate ICC profiles'],
    keyTradeoffs: 'GIMP has a steeper learning curve for CMYK print workflows, but offers zero subscription fees and complete local privacy.',
  },
  {
    paidProduct: 'Cursor',
    slug: 'cursor',
    vendor: 'Anysphere',
    category: 'AI & Coding',
    typicalMonthlyCost: 20,
    estimatedCostMonthly: '$20/mo',
    synonyms: ['cursor ai', 'ai code editor', 'copilot ide', 'ai pair programmer'],
    bestAlternatives: ['VS Code + Continue.dev', 'Cline / Roo-Code', 'Ollama (Local LLM)'],
    recommendedAlternatives: ['VS Code + Continue.dev', 'Cline / Roo-Code', 'Ollama (Local LLM)'],
    tradeoffs: ['Requires bringing your own API keys or local GPU compute', 'Multi-file agent automation requires configuration'],
    keyTradeoffs: 'Requires bringing your own API key or local Ollama model, but provides 100% data confidentiality and zero monthly seat taxes.',
  },
  {
    paidProduct: 'GitHub Copilot',
    slug: 'github-copilot',
    vendor: 'GitHub / Microsoft',
    category: 'AI & Coding',
    typicalMonthlyCost: 19,
    estimatedCostMonthly: '$10-$19/mo',
    synonyms: ['copilot', 'ai autocomplete', 'code completion', 'inline ai'],
    bestAlternatives: ['Continue.dev', 'Tabby', 'Ollama + Qwen2.5-Coder'],
    recommendedAlternatives: ['Continue.dev', 'Tabby', 'Ollama + Qwen2.5-Coder'],
    tradeoffs: ['Local code completion models require 8GB+ VRAM for low latency', 'Tabby requires self-hosted server setup'],
    keyTradeoffs: 'Self-hosted models require a modern GPU (8GB+ VRAM) for low-latency completions, but prevent enterprise code leakage.',
  },
  {
    paidProduct: 'ChatGPT Plus',
    slug: 'chatgpt',
    vendor: 'OpenAI',
    category: 'AI & Coding',
    typicalMonthlyCost: 20,
    estimatedCostMonthly: '$20/mo',
    synonyms: ['chatgpt', 'chat gpt pro', 'gpt-4o', 'ai assistant'],
    bestAlternatives: ['Ollama + Open WebUI', 'LibreChat', 'HuggingChat'],
    recommendedAlternatives: ['Ollama + Open WebUI', 'LibreChat', 'HuggingChat'],
    tradeoffs: ['Requires self-hosting Ollama or configuring model endpoints', 'Local reasoning speeds depend on hardware specs'],
    keyTradeoffs: 'Open WebUI with local models runs fully offline with zero token costs and private chat logs stored on SQLite.',
  },
  {
    paidProduct: 'Zapier',
    slug: 'zapier',
    vendor: 'Zapier Inc.',
    category: 'Automation',
    typicalMonthlyCost: 49,
    estimatedCostMonthly: '$29.99-$79/mo',
    synonyms: ['zapier', 'workflow automation', 'integration platform', 'no-code automation'],
    bestAlternatives: ['n8n (Self-Hosted)', 'Activepieces', 'Windmill'],
    recommendedAlternatives: ['n8n (Self-Hosted)', 'Activepieces', 'Windmill'],
    tradeoffs: ['Self-hosted n8n requires basic Docker and webhook SSL setup', 'Community nodes must be vetted before production deployment'],
    keyTradeoffs: 'n8n self-hosted provides unlimited executions on a $5/mo VPS, but requires Docker maintenance and webhook SSL setup.',
  },
  {
    paidProduct: 'Notion',
    slug: 'notion',
    vendor: 'Notion Labs',
    category: 'Productivity & Knowledge',
    typicalMonthlyCost: 10,
    estimatedCostMonthly: '$10-$18/mo',
    synonyms: ['notion', 'wiki', 'workspace', 'digital notebook', 'doc database'],
    bestAlternatives: ['AppFlowy', 'Obsidian', 'Logseq'],
    recommendedAlternatives: ['AppFlowy', 'Obsidian', 'Logseq'],
    tradeoffs: ['Obsidian multi-device sync requires Git, iCloud, or self-hosted CouchDB', 'AppFlowy web sharing requires Docker container'],
    keyTradeoffs: 'AppFlowy is local-first with full offline support and encryption, while Obsidian stores human-readable local Markdown.',
  },
  {
    paidProduct: 'Microsoft 365 / Office',
    slug: 'microsoft-office',
    vendor: 'Microsoft',
    category: 'Productivity & Office',
    typicalMonthlyCost: 15,
    estimatedCostMonthly: '$6.99-$22/mo',
    synonyms: ['office 365', 'microsoft office', 'word', 'excel', 'powerpoint', 'microsoft suite'],
    bestAlternatives: ['LibreOffice', 'OnlyOffice', 'DigiOffice Suite'],
    recommendedAlternatives: ['LibreOffice', 'OnlyOffice', 'DigiOffice Suite'],
    tradeoffs: ['Real-time cloud co-editing requires self-hosting OnlyOffice Document Server', 'LibreOffice UI differs from MS Office ribbon'],
    keyTradeoffs: 'OnlyOffice matches MS Office docx/xlsx formatting with 99% fidelity, available as desktop apps or self-hosted document servers.',
  },
  {
    paidProduct: 'Salesforce',
    slug: 'salesforce',
    vendor: 'Salesforce',
    category: 'CRM, ERP & Business Operations',
    typicalMonthlyCost: 150,
    estimatedCostMonthly: '$25-$300/user/mo',
    synonyms: ['salesforce crm', 'enterprise crm', 'lead management', 'sales pipeline'],
    bestAlternatives: ['Twenty (Open Source)', 'ERPNext', 'SuiteCRM'],
    recommendedAlternatives: ['Twenty (Open Source)', 'ERPNext', 'SuiteCRM'],
    tradeoffs: ['ERPNext self-hosting requires Linux sysadmin familiarity', 'Twenty is rapidly evolving with newer API releases'],
    keyTradeoffs: 'Twenty is a modern GraphQL/TypeScript open-source CRM with zero per-seat fees; remote agencies can also leverage Digi Biz OS.',
  },
  {
    paidProduct: 'Figma',
    slug: 'figma',
    vendor: 'Figma / Adobe',
    category: 'Creative & Design',
    typicalMonthlyCost: 20,
    estimatedCostMonthly: '$12-$75/user/mo',
    synonyms: ['figma', 'ui design', 'vector prototype', 'figjam'],
    bestAlternatives: ['Penpot (Open Source)'],
    recommendedAlternatives: ['Penpot (Open Source)'],
    tradeoffs: ['Figma plugin ecosystem is larger than Penpot community library', 'Direct .fig importing may require font alignment'],
    keyTradeoffs: 'Penpot is natively SVG-based with flexbox and CSS grid support, deployable on Docker with zero cloud lock-in.',
  },
  {
    paidProduct: 'Airtable',
    slug: 'airtable',
    vendor: 'Airtable',
    category: 'Databases & Storage',
    typicalMonthlyCost: 24,
    estimatedCostMonthly: '$20-$45/user/mo',
    synonyms: ['airtable', 'low-code database', 'spreadsheet database', 'relational grid'],
    bestAlternatives: ['NocoDB', 'Baserow'],
    recommendedAlternatives: ['NocoDB', 'Baserow'],
    tradeoffs: ['Self-hosted databases require automated snapshot backup scripts', 'Baserow enterprise formula features require license key'],
    keyTradeoffs: 'NocoDB turns any existing PostgreSQL or MySQL database into a smart spreadsheet UI without vendor row limits.',
  },
  {
    paidProduct: 'AWS S3',
    slug: 'aws-s3',
    vendor: 'Amazon Web Services',
    category: 'Cloud Infrastructure & Object Storage',
    typicalMonthlyCost: 120,
    estimatedCostMonthly: 'Pay-per-GB + egress fees',
    synonyms: ['aws s3', 's3 storage', 'blob storage', 'object storage', 'amazon s3'],
    bestAlternatives: ['MinIO (Self-Hosted)', 'Garage', 'SeaweedFS'],
    recommendedAlternatives: ['MinIO (Self-Hosted)', 'Garage', 'SeaweedFS'],
    tradeoffs: ['Self-hosted MinIO requires redundant storage drive arrays (RAID / ZFS)', 'Disaster recovery must be managed across nodes'],
    keyTradeoffs: 'MinIO offers drop-in S3 API compatibility on your own disks with zero data egress penalties.',
  },
  {
    paidProduct: 'Firebase',
    slug: 'firebase',
    vendor: 'Google',
    category: 'Cloud Infrastructure & Object Storage',
    typicalMonthlyCost: 80,
    estimatedCostMonthly: 'Usage-based spikes',
    synonyms: ['firebase', 'firestore', 'backend as a service', 'baas'],
    bestAlternatives: ['Supabase', 'PocketBase', 'Appwrite'],
    recommendedAlternatives: ['Supabase', 'PocketBase', 'Appwrite'],
    tradeoffs: ['Supabase self-hosted Docker requires 2GB RAM minimum', 'PocketBase is single-binary SQLite suited for < 10k concurrent users'],
    keyTradeoffs: 'Supabase provides standard PostgreSQL with row-level security and real-time websockets, eliminating proprietary NoSQL constraints.',
  },
  {
    paidProduct: 'Heroku',
    slug: 'heroku',
    vendor: 'Salesforce',
    category: 'Cloud Infrastructure & Object Storage',
    typicalMonthlyCost: 50,
    estimatedCostMonthly: '$7-$500/mo',
    synonyms: ['heroku', 'paas', 'dyno hosting', 'git push deploy'],
    bestAlternatives: ['Coolify', 'Dokku', 'CapRover'],
    recommendedAlternatives: ['Coolify', 'Dokku', 'CapRover'],
    tradeoffs: ['You must manage your underlying VPS host security updates', 'No automatic multi-region server autoscaling without cluster tools'],
    keyTradeoffs: 'Coolify gives you your own self-hosted Heroku on any Hetzner or DigitalOcean VPS with automatic SSL and GitHub push-to-deploy.',
  },
];

export function getTaxonomyForProduct(name: string): SoftwareTaxonomyItem | undefined {
  const clean = name.trim().toLowerCase();
  return SOFTWARE_TAXONOMY.find(
    (item) =>
      item.paidProduct.toLowerCase() === clean ||
      item.slug.toLowerCase() === clean ||
      item.synonyms.some((s) => s.toLowerCase() === clean) ||
      item.paidProduct.toLowerCase().includes(clean)
  );
}

export function calculateAnnualSavings(productName: string): number {
  const item = getTaxonomyForProduct(productName);
  if (!item) return 0;
  return item.typicalMonthlyCost * 12;
}
