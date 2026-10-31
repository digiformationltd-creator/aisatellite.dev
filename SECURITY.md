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
2. Submit a private vulnerability advisory via GitHub Security Advisories (`/security/advisories/new`).
3. Maintainers will acknowledge receipt within 48 hours and coordinate remediation before public disclosure.

---

## Content Integrity & Supply Chain Security

- All third-party dependencies are locked with `package-lock.json`.
- Strict Content-Security-Policy (CSP) headers are enforced via `public/_headers`.
- External links are sanitized with `rel="noopener noreferrer"`.
