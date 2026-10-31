export interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
}

export const ALTERNATIVE_CATEGORIES: CategoryMeta[] = [
  {
    id: 'ai-coding',
    name: 'AI & Coding',
    slug: 'ai-coding',
    description: 'Free and open-source alternatives to Cursor, Copilot, ChatGPT Plus, and proprietary code generators.',
    icon: 'Cpu',
    count: 4,
  },
  {
    id: 'automation',
    name: 'Automation & Workflows',
    slug: 'automation',
    description: 'Self-hostable workflow engines to replace Zapier, Make, and expensive iPaaS platforms.',
    icon: 'Layers',
    count: 3,
  },
  {
    id: 'productivity',
    name: 'Productivity & Office',
    slug: 'productivity',
    description: 'Local-first note-taking, spreadsheets, and office suites replacing Microsoft 365, Notion, and Google Workspace.',
    icon: 'FileText',
    count: 4,
  },
  {
    id: 'crm-erp',
    name: 'CRM & ERP',
    slug: 'crm-erp',
    description: 'Open-source sales pipelines, invoicing, and enterprise resource tools replacing Salesforce and HubSpot.',
    icon: 'Building2',
    count: 3,
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    slug: 'creative',
    description: 'Professional vector graphics, raster editing, and UI prototyping replacing Adobe Photoshop and Figma.',
    icon: 'Sparkles',
    count: 2,
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud & Hosting',
    slug: 'cloud-infrastructure',
    description: 'Drop-in self-hosted PaaS, S3 storage, and BaaS alternatives to AWS, Heroku, and Firebase.',
    icon: 'Cloud',
    count: 4,
  },
  {
    id: 'databases',
    name: 'Databases & Storage',
    slug: 'databases',
    description: 'Open-source relational, document, and smart grid databases replacing Airtable and managed DBs.',
    icon: 'Database',
    count: 3,
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  const clean = slug.trim().toLowerCase();
  return ALTERNATIVE_CATEGORIES.find((cat) => cat.slug.toLowerCase() === clean || cat.id.toLowerCase() === clean);
}

export function getCategoryById(id: string): CategoryMeta | undefined {
  const clean = id.trim().toLowerCase();
  return ALTERNATIVE_CATEGORIES.find((cat) => cat.id.toLowerCase() === clean || cat.slug.toLowerCase() === clean);
}
