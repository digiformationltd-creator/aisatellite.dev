/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine D: Emerging AI Tools Discovery
 * 
 * Discovers and profiles AI software across 12 capability categories with transparent
 * pricing models, verifiable free-tier conditions, API availability, and platform support.
 */

import { uuidv4 } from './id-generator';
import type { AiToolProfile, ConfidenceLevel } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export const AI_TOOL_CATEGORIES = [
  'code_assistants',
  'agent_frameworks',
  'local_llm_runners',
  'vector_embeddings',
  'synthetic_data_testing',
  'prompt_engineering_eval',
  'multimodal_image_video',
  'speech_voice_ai',
  'rag_search_retrieval',
  'model_optimization',
  'autonomous_workflows',
  'developer_productivity',
] as const;

export type AiToolCategory = (typeof AI_TOOL_CATEGORIES)[number];

export class AiToolsDiscoveryEngine {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultAiTools();
  }

  public registerAiTool(input: {
    name: string;
    slug: string;
    websiteUrl: string;
    developerOrg: string;
    primaryPurpose: string;
    capabilities: string[];
    pricingModel: 'free' | 'freemium' | 'paid' | 'open_source';
    freeTierConditions: string;
    apiAvailable: boolean;
    supportedPlatforms: string[];
    documentationUrl: string;
    confidence?: ConfidenceLevel;
  }): AiToolProfile {
    const existing = this.db.findAiToolProfileBySlug(input.slug);
    const now = new Date().toISOString();

    const profile: AiToolProfile = {
      id: existing ? existing.id : `ai-${uuidv4().slice(0, 8)}`,
      name: input.name,
      slug: input.slug,
      websiteUrl: input.websiteUrl,
      developerOrg: input.developerOrg,
      primaryPurpose: input.primaryPurpose,
      capabilities: input.capabilities,
      pricingModel: input.pricingModel,
      freeTierConditions: input.freeTierConditions,
      apiAvailable: input.apiAvailable,
      supportedPlatforms: input.supportedPlatforms,
      documentationUrl: input.documentationUrl,
      confidence: input.confidence || 'high',
      lastVerifiedAt: now,
    };

    this.db.saveAiToolProfile(profile);
    return profile;
  }

  public getAiTools(): AiToolProfile[] {
    return this.db.getAiToolProfiles();
  }

  public getAiToolBySlug(slug: string): AiToolProfile | undefined {
    return this.db.findAiToolProfileBySlug(slug);
  }

  public getOpenSourceTools(): AiToolProfile[] {
    return this.db.getAiToolProfiles().filter((t) => t.pricingModel === 'open_source');
  }

  public getToolsWithApi(): AiToolProfile[] {
    return this.db.getAiToolProfiles().filter((t) => t.apiAvailable);
  }

  public seedDefaultAiTools(): void {
    const existing = this.db.getAiToolProfiles();
    if (existing.length > 0) return;

    const defaults: Array<{
      name: string;
      slug: string;
      websiteUrl: string;
      developerOrg: string;
      primaryPurpose: string;
      capabilities: string[];
      pricingModel: 'free' | 'freemium' | 'paid' | 'open_source';
      freeTierConditions: string;
      apiAvailable: boolean;
      supportedPlatforms: string[];
      documentationUrl: string;
    }> = [
      {
        name: 'Ollama',
        slug: 'ollama',
        websiteUrl: 'https://ollama.com',
        developerOrg: 'Ollama',
        primaryPurpose: 'Run powerful open-weight LLMs locally on macOS, Linux, and Windows.',
        capabilities: ['local_llm_runners', 'model_optimization', 'code_assistants'],
        pricingModel: 'open_source',
        freeTierConditions: '100% Free and open source (MIT license). Requires local CPU/GPU RAM.',
        apiAvailable: true,
        supportedPlatforms: ['macOS', 'Linux', 'Windows', 'Docker'],
        documentationUrl: 'https://github.com/ollama/ollama',
      },
      {
        name: 'vLLM',
        slug: 'vllm',
        websiteUrl: 'https://vllm.ai',
        developerOrg: 'vLLM Project',
        primaryPurpose: 'High-throughput and memory-efficient inference serving engine for LLMs.',
        capabilities: ['local_llm_runners', 'model_optimization', 'rag_search_retrieval'],
        pricingModel: 'open_source',
        freeTierConditions: '100% Free under Apache-2.0. Requires GPU/TPU infrastructure.',
        apiAvailable: true,
        supportedPlatforms: ['Linux', 'Docker'],
        documentationUrl: 'https://docs.vllm.ai',
      },
      {
        name: 'Qdrant',
        slug: 'qdrant',
        websiteUrl: 'https://qdrant.tech',
        developerOrg: 'Qdrant Solutions GmbH',
        primaryPurpose: 'Vector similarity search engine and vector database for production RAG and AI applications.',
        capabilities: ['vector_embeddings', 'rag_search_retrieval'],
        pricingModel: 'open_source',
        freeTierConditions: 'Open-source Apache-2.0 core free self-hosted; Managed cloud has 1GB free cluster forever.',
        apiAvailable: true,
        supportedPlatforms: ['Linux', 'macOS', 'Windows', 'Docker', 'Kubernetes'],
        documentationUrl: 'https://qdrant.tech/documentation',
      },
      {
        name: 'LangGraph',
        slug: 'langgraph',
        websiteUrl: 'https://langchain-ai.github.io/langgraph',
        developerOrg: 'LangChain Inc.',
        primaryPurpose: 'Framework for building resilient, stateful, multi-actor agentic workflows with LLMs.',
        capabilities: ['agent_frameworks', 'autonomous_workflows'],
        pricingModel: 'open_source',
        freeTierConditions: 'Free library under MIT license; LangGraph Cloud deployment has free development tier.',
        apiAvailable: true,
        supportedPlatforms: ['Linux', 'macOS', 'Windows', 'Docker'],
        documentationUrl: 'https://langchain-ai.github.io/langgraph',
      },
      {
        name: 'Whisper.cpp',
        slug: 'whisper-cpp',
        websiteUrl: 'https://github.com/ggerganov/whisper.cpp',
        developerOrg: 'Georgi Gerganov',
        primaryPurpose: 'High-performance C/C++ port of OpenAI Speech-to-Text Whisper model.',
        capabilities: ['speech_voice_ai', 'developer_productivity'],
        pricingModel: 'open_source',
        freeTierConditions: '100% Free under MIT license. Runs on Apple Silicon, AVX, CUDA.',
        apiAvailable: true,
        supportedPlatforms: ['macOS', 'Linux', 'Windows', 'iOS', 'Android', 'WebAssembly'],
        documentationUrl: 'https://github.com/ggerganov/whisper.cpp',
      },
    ];

    for (const d of defaults) {
      this.registerAiTool(d);
    }
  }
}

export const aiToolsDiscoveryEngine = new AiToolsDiscoveryEngine();
