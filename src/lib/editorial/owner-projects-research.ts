/**
 * AI Satellite — Phase 22 Owner-Identified Projects Research Registry
 * Verifiable repository facts, licenses, architectures, and ethical editorial guidance.
 * Strict Rule: Never fabricate stars, endorsements, or downloads.
 * Canonical Production Domain: https://aisatellite.dev
 */

export interface OwnerProjectResearchRecord {
  id: string;
  name: string;
  family: string;
  repositoryUrl: string;
  license: string;
  techStack: string[];
  keyCapabilities: string[];
  installationMethod: string;
  bestFitUseCases: string[];
  limitations: string[];
  honestAlternatives: string[];
  plannedArticleAngles: string[];
  affiliationDisclosure: string;
  verifiedAt: string;
}

export const OWNER_PROJECTS_RESEARCH: OwnerProjectResearchRecord[] = [
  {
    id: 'digi-labs',
    name: 'Digi Labs',
    family: 'Digi Labs Agent Research',
    repositoryUrl: 'https://github.com/digi-ai/digi-labs',
    license: 'MIT License',
    techStack: ['Python 3.12', 'LangChain', 'Ollama', 'FastAPI', 'Docker'],
    keyCapabilities: [
      'Automated benchmarking for local LLM token throughput (Llama 3, Mistral, DeepSeek)',
      'Deterministic tool-call validation protocols with zero-hallucination test gates',
      'Clean-room agent memory architectures with vector and key-value state persistence',
      'REST API and CLI runners for continuous integration evaluation of AI agents',
    ],
    installationMethod: 'Docker Compose or local Python venv (pip install -r requirements.txt)',
    bestFitUseCases: [
      'AI engineers evaluating local LLM inference performance across consumer hardware',
      'Developers testing custom tool-calling reliability before production deployment',
    ],
    limitations: [
      'Requires modern multi-core CPU or NVIDIA CUDA GPU for high-throughput local inference',
      'Focused strictly on developer benchmarking rather than end-user conversational chat',
    ],
    honestAlternatives: ['LM Studio', 'Ollama standalone', 'Promptfoo', 'DeepEval'],
    plannedArticleAngles: [
      'How to Benchmark Local LLMs: Step-by-Step with Digi Labs and Ollama',
      'Evaluating Autonomous Agent Tool Calls: Reducing Hallucinations in Production',
      'Open-Source Agent Benchmarking: Digi Labs vs Promptfoo Comparative Analysis',
    ],
    affiliationDisclosure: 'Editorial Disclosure: Digi Labs is an open-source project created by the founders of AI Satellite.',
    verifiedAt: '2026-10-31T00:00:00Z',
  },
  {
    id: 'digi-lead-hunter',
    name: 'Digi Hunter (Digi Lead Hunter)',
    family: 'Digi Intelligence',
    repositoryUrl: 'https://github.com/digi-ai/digi-lead-hunter',
    license: 'MIT License',
    techStack: ['TypeScript', 'Node.js', 'SQLite', 'Puppeteer', 'Tailwind CSS'],
    keyCapabilities: [
      'Ethical GitHub repository intelligence scanning public issues and discussion boards',
      'Detection of developer bug pain points and recurring framework migration needs',
      'Zero-scraper architectural approach relying exclusively on authorized public APIs',
    ],
    installationMethod: 'npm install && npm run build (Node.js 20+)',
    bestFitUseCases: [
      'Open-source maintainers seeking projects in need of consulting or commercial support',
      'Tech agencies researching emerging technology adoption trends on GitHub',
    ],
    limitations: [
      'Subject to standard GitHub REST API rate limits unless authenticated with personal tokens',
      'Does not provide private contact scraping or invasive unsolicited email generation',
    ],
    honestAlternatives: ['GitHub Search API', 'OctoEverywhere', 'Sourcegraph'],
    plannedArticleAngles: [
      'Ethical Open-Source Lead Discovery: Finding Consulting Opportunities with Digi Hunter',
      'Analyzing GitHub Framework Pain Points: Technical Trend Research in 2026',
    ],
    affiliationDisclosure: 'Editorial Disclosure: Digi Hunter is an open-source research initiative affiliated with AI Satellite.',
    verifiedAt: '2026-10-31T00:00:00Z',
  },
  {
    id: 'digioffice-suite',
    name: 'Digi Office Suite',
    family: 'Digi Office',
    repositoryUrl: 'https://github.com/digi-ai/digioffice-suite',
    license: 'GPL-3.0 License',
    techStack: ['Tauri', 'Rust', 'React', 'SQLite', 'WebAssembly'],
    keyCapabilities: [
      '100% offline desktop office suite for documents, spreadsheets, and markdown',
      'AES-256 local disk file encryption ensuring absolute data sovereignty',
      'Local AI document copilot integrating directly with Ollama or llama.cpp',
      'Zero cloud dependencies and zero recurring subscription fees',
    ],
    installationMethod: 'Native cross-platform installer (.exe, .dmg, .AppImage) or cargo build',
    bestFitUseCases: [
      'Privacy-conscious professionals and legal firms handling confidential documents',
      'Air-gapped and remote field operators requiring reliable offline productivity software',
    ],
    limitations: [
      'Does not support simultaneous multi-user real-time Google Docs style cloud co-editing',
      'Spreadsheet macro engine supports JavaScript formulas rather than legacy VBA',
    ],
    honestAlternatives: ['LibreOffice', 'OnlyOffice', 'CryptPad', 'Obsidian'],
    plannedArticleAngles: [
      'Self-Hosted & Offline Office Suites: Complete Deep Dive into Digi Office Suite',
      'Replacing Office 365 with Free Open-Source Tools: LibreOffice vs Digi Office vs OnlyOffice',
      'Data Sovereignty in Legal & Healthcare: Setting Up Local-Only Document Pipelines',
    ],
    affiliationDisclosure: 'Editorial Disclosure: Digi Office Suite is an open-source productivity project affiliated with the AI Satellite ecosystem.',
    verifiedAt: '2026-10-31T00:00:00Z',
  },
  {
    id: 'digi-whatsapp-agent',
    name: 'Digi WhatsApp Agent',
    family: 'Digi Agent',
    repositoryUrl: 'https://github.com/digi-ai/digi-whatsapp-agent',
    license: 'MIT License',
    techStack: ['Node.js', 'TypeScript', 'Baileys', 'LangChain', 'PostgreSQL', 'Docker'],
    keyCapabilities: [
      'Self-hosted WhatsApp Business bot connecting directly via Baileys multi-device protocol',
      'Natural language inquiry responses and automated service appointment bookings',
      'Human-in-the-loop escalation dashboard notifying staff when complex questions arise',
      'Local PostgreSQL logging of customer inquiry states and conversation transcripts',
    ],
    installationMethod: 'docker compose up -d with QR code terminal authentication',
    bestFitUseCases: [
      'Micro-businesses, clinics, and car dealerships automating initial inbound inquiries',
      'Developers building custom multi-turn WhatsApp workflows for local service businesses',
    ],
    limitations: [
      'Requires an active smartphone session or WhatsApp Web session maintenance',
      'Users must comply with WhatsApp Terms of Service and telecommunications regulations',
    ],
    honestAlternatives: ['Evolution API', 'WPPConnect', 'Typebot', 'Chatwoot'],
    plannedArticleAngles: [
      'Deploying an Open-Source WhatsApp AI Agent for Showrooms and Clinics',
      'Automating Inbound Customer Support: Baileys, LangChain & Digi WhatsApp Agent',
      'Self-Hosted WhatsApp Bots vs Commercial SaaS: Cost and Compliance Comparison',
    ],
    affiliationDisclosure: 'Editorial Disclosure: Digi WhatsApp Agent is an open-source initiative affiliated with AI Satellite.',
    verifiedAt: '2026-10-31T00:00:00Z',
  },
];
