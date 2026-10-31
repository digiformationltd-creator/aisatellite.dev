export interface LicenseVerificationResult {
  isIdentified: boolean;
  isOpenSource: boolean;
  spdxId?: string;
  isPermissive: boolean;
  isCopyleft: boolean;
  notes: string;
}

export class LicenseVerifier {
  private static readonly OSI_APPROVED_SPDX = new Set([
    'MIT',
    'Apache-2.0',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'ISC',
    'GPL-2.0',
    'GPL-3.0',
    'AGPL-3.0',
    'LGPL-2.1',
    'LGPL-3.0',
    'MPL-2.0',
    'Unlicense',
    'CC0-1.0',
    'PostgreSQL',
    'Artistic-2.0',
  ]);

  private static readonly PERMISSIVE = new Set([
    'MIT',
    'Apache-2.0',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'ISC',
    'Unlicense',
    'CC0-1.0',
    'PostgreSQL',
  ]);

  private static readonly COPYLEFT = new Set([
    'GPL-2.0',
    'GPL-3.0',
    'AGPL-3.0',
    'LGPL-2.1',
    'LGPL-3.0',
    'MPL-2.0',
  ]);

  /**
   * Evaluates SPDX string or raw license text
   */
  static verify(spdxId?: string, rawLicenseText?: string): LicenseVerificationResult {
    if (!spdxId && !rawLicenseText) {
      return {
        isIdentified: false,
        isOpenSource: false,
        isPermissive: false,
        isCopyleft: false,
        notes: 'No license information provided. Public availability does not imply open source.',
      };
    }

    const cleanSpdx = spdxId ? spdxId.trim() : this.detectFromText(rawLicenseText || '');

    if (!cleanSpdx || cleanSpdx === 'NOASSERTION') {
      return {
        isIdentified: false,
        isOpenSource: false,
        isPermissive: false,
        isCopyleft: false,
        notes: 'License could not be conclusively identified against SPDX database.',
      };
    }

    const isOpenSource = this.OSI_APPROVED_SPDX.has(cleanSpdx);
    const isPermissive = this.PERMISSIVE.has(cleanSpdx);
    const isCopyleft = this.COPYLEFT.has(cleanSpdx);

    return {
      isIdentified: true,
      isOpenSource,
      spdxId: cleanSpdx,
      isPermissive,
      isCopyleft,
      notes: isOpenSource
        ? `Verified OSI-compliant open-source license (${cleanSpdx}).`
        : `Identified license (${cleanSpdx}) is not standard OSI-approved. Check commercial constraints.`,
    };
  }

  private static detectFromText(text: string): string | undefined {
    const lower = text.toLowerCase();
    if (lower.includes('mit license') || lower.includes('permission is hereby granted, free of charge')) {
      return 'MIT';
    }
    if (lower.includes('apache license') && lower.includes('version 2.0')) {
      return 'Apache-2.0';
    }
    if (lower.includes('gnu general public license') || lower.includes('gpl v3')) {
      return 'GPL-3.0';
    }
    if (lower.includes('gnu affero general public license') || lower.includes('agpl')) {
      return 'AGPL-3.0';
    }
    if (lower.includes('bsd 3-clause') || lower.includes('neither the name of the copyright holder')) {
      return 'BSD-3-Clause';
    }
    return undefined;
  }
}
