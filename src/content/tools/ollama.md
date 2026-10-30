---
name: Ollama
description: Get up and running with large language models locally on macOS, Linux, and Windows with simple CLI commands and OpenAI-compatible API.
category: AI Development
tags:
  - ai
  - llm
  - local-ai
  - inference
  - open-source
officialUrl: https://ollama.com/
repositoryUrl: https://github.com/ollama/ollama
documentationUrl: https://github.com/ollama/ollama/tree/main/docs
license: MIT
pricingModel: open-source
selfHosted: true
requiresCreditCard: false
freeTierLimitations:
  - 100% Free and open-source. Runs entirely on your hardware with no token fees.
alternativesTo:
  - OpenAI API
  - Anthropic API
verificationStatus: verified
lastVerified: "2026-10-31"
featured: true
published: true
securityNotes:
  - By default binds to 127.0.0.1:11434. Do not bind to 0.0.0.0 without authentication proxy.
installationInstructions: curl -fsSL https://ollama.com/install.sh | sh && ollama run llama3.3
---

Ollama allows developers to run deep open-weight models (Llama 3, DeepSeek-R1, Mistral, Qwen 2.5) locally on their own machines without sending sensitive code to third-party cloud APIs.
