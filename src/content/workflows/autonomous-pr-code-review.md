---
title: "Autonomous GitHub Pull Request Code Review Agent"
objective: "Automatically inspect incoming GitHub PR diffs, check for security regressions, enforce code guidelines, and post structured markdown review comments."
difficulty: "Intermediate"
requiredTools:
  - "GitHub Actions"
  - "Claude 3.7 or Local DeepSeek-R1 via Ollama"
  - "Git CLI"
agentRoles:
  - "Security Auditor"
  - "Style Enforcer"
  - "Summary Synthesizer"
inputs:
  - "git diff origin/main...HEAD"
  - "PR description and issue metadata"
outputs:
  - "GitHub PR Review Comment with categorized findings"
securityWarnings:
  - "Never pass repository secrets or unvetted external contributor code directly into LLM prompts without prompt-injection sanitization."
configurationSnippet: |
  name: AI Code Review
  on: [pull_request]
  jobs:
    review:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Run Review Agent
          run: npx @anthropic-ai/claude-code review --pr
freeClassification: "Open-Source Script + Free GitHub Actions Tier (Requires LLM API or Self-Hosted Runner)"
published: true
---

### Workflow Overview
This workflow triggers automatically whenever a pull request is opened. It runs a multi-stage review pipeline that catches common security flaws, memory leaks, and breaking API changes before human engineers review the code.
