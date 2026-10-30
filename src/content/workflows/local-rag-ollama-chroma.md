---
title: "100% Offline Local RAG Pipeline using Ollama & ChromaDB"
objective: "Index private technical documentation into a local vector database and query it with an offline LLM without sending proprietary data to third-party clouds."
difficulty: "Beginner"
requiredTools:
  - "Ollama"
  - "ChromaDB"
  - "Python 3.11+"
agentRoles:
  - "Document Chunking Agent"
  - "Embedding Generator (nomic-embed-text)"
  - "Contextual Synthesizer (Llama 3.3 / DeepSeek-R1)"
inputs:
  - "Local Markdown / PDF files"
  - "Natural language user queries"
outputs:
  - "Synthesized answer with exact document citations"
securityWarnings:
  - "Ensure the ChromaDB local directory is added to .gitignore."
configurationSnippet: |
  import chromadb
  from chromadb.utils import embedding_functions

  client = chromadb.PersistentClient(path="./chroma_db")
  emb_fn = embedding_functions.OllamaEmbeddingFunction(
      model_name="nomic-embed-text",
      url="http://localhost:11434/api/embeddings"
  )
  collection = client.get_or_create_collection(name="tech_docs", embedding_function=emb_fn)
freeClassification: "100% Free & Open-Source (Runs entirely on local CPU/GPU)"
published: true
---

### Workflow Overview
Build an air-gapped, privacy-first technical knowledge assistant that indexes local codebases and architectural specs without any cloud subscriptions or API keys.
