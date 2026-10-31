---
title: "DigiOffice Suite"
tagline: "Sovereign, Offline-First Alternative to Office 365 & Google Workspace"
family: "Digi Office"
description: "A secure, privacy-first desktop and local-network office productivity suite combining document processing, local spreadsheets, and AI-assisted drafting without cloud subscription locks."
techStack:
  - "Tauri"
  - "Rust"
  - "React"
  - "SQLite"
  - "WebAssembly"
openSourceLicense: "GPL-3.0 License"
repositoryUrl: "https://github.com/digi-ai/digioffice-suite"
documentationUrl: "https://aisatellite.pages.dev/projects/digioffice-suite/docs"
verificationStatus: "verified"
features:
  - "Full offline document, spreadsheet, and markdown editor"
  - "100% data sovereignty with AES-256 local file encryption"
  - "Local AI copilot powered by Ollama or llama.cpp bindings"
  - "Native docx, xlsx, and pdf bidirectional compatibility"
  - "Zero cloud telemetry, zero account requirement, free forever"
version: "1.8.2"
releaseDate: "2026-10-25"
githubRepo: "digi-ai/digioffice-suite"
downloads:
  - platform: "Windows (x64 Installer)"
    version: "1.8.2"
    filename: "DigiOffice-Setup-1.8.2-x64.exe"
    url: "https://github.com/digi-ai/digioffice-suite/releases/download/v1.8.2/DigiOffice-Setup-1.8.2-x64.exe"
    size: "62.8 MB"
    sha256: "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72"
  - platform: "macOS (Apple Silicon & Intel)"
    version: "1.8.2"
    filename: "DigiOffice-1.8.2-universal.dmg"
    url: "https://github.com/digi-ai/digioffice-suite/releases/download/v1.8.2/DigiOffice-1.8.2-universal.dmg"
    size: "68.4 MB"
    sha256: "5d41402abc4b2a76b9719d911017c5926c483a54b3824b2fe29da9f1a084c8a4"
  - platform: "Linux (.deb package)"
    version: "1.8.2"
    filename: "digioffice_1.8.2_amd64.deb"
    url: "https://github.com/digi-ai/digioffice-suite/releases/download/v1.8.2/digioffice_1.8.2_amd64.deb"
    size: "58.1 MB"
    sha256: "315eb115d98fbbda39291d11059432cb390209e5ee35d977168f8450702a60ce"
  - platform: "Linux (.AppImage)"
    version: "1.8.2"
    filename: "DigiOffice-1.8.2-x86_64.AppImage"
    url: "https://github.com/digi-ai/digioffice-suite/releases/download/v1.8.2/DigiOffice-1.8.2-x86_64.AppImage"
    size: "61.3 MB"
    sha256: "2c624232cdd221771294dfbb310aca000a0df6ac9b66b0d199bf41e340f9f3e1"
docsOverview: "DigiOffice Suite is built with Tauri v2 and Rust, offering sub-second startup times, microscopic 70MB RAM footprints, and absolute data isolation. Files remain entirely on your local filesystem."
changelogItems:
  - version: "1.8.2"
    date: "2026-10-25"
    changes:
      - "Resolved high-DPI scaling issue on dual-monitor Windows 11 setups."
      - "Added offline grammar and spelling dictionaries for 14 languages."
      - "Upgraded SQLite document cache to WAL mode for lightning-fast auto-saves."
  - version: "1.8.0"
    date: "2026-09-20"
    changes:
      - "Integrated local Ollama inference hook for on-device document summarization."
      - "Enabled native PDF export with embedded vector fonts."
installationSteps:
  - "Download the installer for your operating system from the links above."
  - "Run the installer (or chmod +x DigiOffice-1.8.2-x86_64.AppImage on Linux)."
  - "Launch DigiOffice. No internet connection or user account is required."
published: true
---

## DigiOffice Suite: The Sovereign Office Platform

DigiOffice Suite is an uncompromising open-source productivity environment designed for professionals, law firms, healthcare agencies, and developers who refuse to allow proprietary cloud providers to index or monetize their sensitive internal documents.

### Why DigiOffice Leads FOSS Office Suites:
- **Rust Core**: Ultra-fast performance without the heavy Java dependencies of older legacy office suites.
- **Local AI Integration**: Connects directly to local Ollama endpoints (e.g. `http://localhost:11434`) for text polishing, drafting, and tabular math without internet access.
- **Universal Export**: Flawlessly parses and exports `.docx`, `.xlsx`, `.pptx`, `.csv`, `.md`, and `.pdf`.
