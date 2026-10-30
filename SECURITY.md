# Security Policy

## Supported Versions

The following versions of **AI Satellite** are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

Security and integrity are paramount for AI Satellite.

If you discover a security vulnerability, prompt injection vector, or insecure default configuration in any published blueprint:
1. **Do NOT open a public GitHub issue.**
2. Send an email to **security@aisatellite.pages.dev** with:
   - Clear description of the vulnerability
   - Proof of Concept (PoC) or reproduction steps
   - Potential impact
3. We will acknowledge receipt within 48 hours and coordinate remediation before public disclosure.

---

## Content Integrity & Supply Chain Security

- All third-party dependencies are locked with `package-lock.json`.
- Strict Content-Security-Policy (CSP) headers are enforced via `public/_headers`.
- External links are sanitized with `rel="noopener noreferrer"`.
