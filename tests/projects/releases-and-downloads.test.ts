import { describe, it, expect } from 'vitest';
import {
  formatPackageSize,
  getPlatformBadge,
  isValidSha256,
} from '../../src/lib/github-releases';

describe('Product C — Software Hub, Releases & Cryptographic Verification', () => {
  it('Acceptance 14: accurately formats package file sizes from numeric bytes and string units', () => {
    expect(formatPackageSize('62.8 MB')).toBe('62.8 MB');
    expect(formatPackageSize(1024)).toBe('1.0 KB');
    expect(formatPackageSize(1024 * 1024 * 48)).toBe('48.0 MB');
    expect(formatPackageSize()).toBe('N/A');
  });

  it('Acceptance 15: accurately identifies operating systems and maps badge labels', () => {
    const win = getPlatformBadge('Windows (x64 Installer)');
    expect(win.icon).toBe('windows');
    expect(win.label).toContain('Windows');

    const mac = getPlatformBadge('macOS (Universal)');
    expect(mac.icon).toBe('apple');
    expect(mac.label).toContain('macOS');

    const linux = getPlatformBadge('Linux (x86_64 AppImage)');
    expect(linux.icon).toBe('linux');
    expect(linux.label).toContain('Linux');

    const docker = getPlatformBadge('Docker Container');
    expect(docker.icon).toBe('docker');
    expect(docker.label).toContain('Docker');
  });

  it('Acceptance 16: verifies authoritative SHA-256 cryptographic hashes and rejects malformed strings', () => {
    const validHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    expect(isValidSha256(validHash)).toBe(true);

    // Uppercase valid hash
    const upperHash = 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855';
    expect(isValidSha256(upperHash)).toBe(true);

    // Invalid lengths or characters
    expect(isValidSha256('short-hash')).toBe(false);
    expect(isValidSha256('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85z')).toBe(false);
    expect(isValidSha256('')).toBe(false);
    expect(isValidSha256(undefined)).toBe(false);
  });

  it('Acceptance 17: validates mock download assets across all 5 original Digi projects', () => {
    const HASH_A = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const HASH_B = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

    const mockProjects = [
      {
        slug: 'digi-labs',
        title: 'Digi Labs',
        downloads: [
          { platform: 'Windows (x64)', sha256: HASH_A },
          { platform: 'Linux (x86_64)', sha256: HASH_B },
        ],
      },
      {
        slug: 'digioffice-suite',
        title: 'DigiOffice Suite',
        downloads: [
          { platform: 'Windows', sha256: HASH_A },
          { platform: 'macOS', sha256: HASH_B },
        ],
      },
      {
        slug: 'digi-whatsapp-agent',
        title: 'Digi WhatsApp Agent',
        downloads: [
          { platform: 'Docker', sha256: HASH_A },
        ],
      },
      {
        slug: 'digi-create',
        title: 'Digi Create',
        downloads: [
          { platform: 'Windows', sha256: HASH_B },
        ],
      },
      {
        slug: 'digi-lead-hunter',
        title: 'Digi Lead Hunter',
        downloads: [
          { platform: 'Linux', sha256: HASH_A },
        ],
      },
    ];

    expect(mockProjects.length).toBe(5);
    mockProjects.forEach((proj) => {
      expect(proj.downloads.length).toBeGreaterThan(0);
      proj.downloads.forEach((dl) => {
        expect(isValidSha256(dl.sha256)).toBe(true);
      });
    });
  });
});
