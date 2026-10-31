import fs from 'node:fs';
import path from 'node:path';

export interface LicenseInfo {
  spdxId: string;
  name: string;
  category: 'permissive' | 'weak_copyleft' | 'strong_copyleft' | 'public_domain' | 'proprietary';
  osiApproved: boolean;
  fsfApproved: boolean;
}

export const KNOWN_LICENSES: Record<string, LicenseInfo> = {
  'MIT': {
    spdxId: 'MIT',
    name: 'MIT License',
    category: 'permissive',
    osiApproved: true,
    fsfApproved: true,
  },
  'Apache-2.0': {
    spdxId: 'Apache-2.0',
    name: 'Apache License 2.0',
    category: 'permissive',
    osiApproved: true,
    fsfApproved: true,
  },
  'BSD-2-Clause': {
    spdxId: 'BSD-2-Clause',
    name: 'BSD 2-Clause Simplified License',
    category: 'permissive',
    osiApproved: true,
    fsfApproved: true,
  },
  'BSD-3-Clause': {
    spdxId: 'BSD-3-Clause',
    name: 'BSD 3-Clause Revised License',
    category: 'permissive',
    osiApproved: true,
    fsfApproved: true,
  },
  'ISC': {
    spdxId: 'ISC',
    name: 'ISC License',
    category: 'permissive',
    osiApproved: true,
    fsfApproved: true,
  },
  'MPL-2.0': {
    spdxId: 'MPL-2.0',
    name: 'Mozilla Public License 2.0',
    category: 'weak_copyleft',
    osiApproved: true,
    fsfApproved: true,
  },
  'LGPL-3.0-only': {
    spdxId: 'LGPL-3.0-only',
    name: 'GNU Lesser General Public License v3.0',
    category: 'weak_copyleft',
    osiApproved: true,
    fsfApproved: true,
  },
  'GPL-3.0-only': {
    spdxId: 'GPL-3.0-only',
    name: 'GNU General Public License v3.0',
    category: 'strong_copyleft',
    osiApproved: true,
    fsfApproved: true,
  },
  'GPL-3.0': {
    spdxId: 'GPL-3.0-only',
    name: 'GNU General Public License v3.0',
    category: 'strong_copyleft',
    osiApproved: true,
    fsfApproved: true,
  },
  'AGPL-3.0-only': {
    spdxId: 'AGPL-3.0-only',
    name: 'GNU Affero General Public License v3.0',
    category: 'strong_copyleft',
    osiApproved: true,
    fsfApproved: true,
  },
  'Unlicense': {
    spdxId: 'Unlicense',
    name: 'The Unlicense',
    category: 'public_domain',
    osiApproved: true,
    fsfApproved: true,
  },
};

export interface DependencyLicenseCheck {
  package: string;
  license: string;
  compatible: boolean;
  reason?: string;
}

export interface LicenseEvaluationResult {
  valid: boolean;
  projectLicense: string;
  category: string;
  osiApproved: boolean;
  compatible: boolean;
  issues: string[];
  dependencyChecks: DependencyLicenseCheck[];
}

export class LicenseEngine {
  /**
   * Normalize license identifier to known SPDX key
   */
  public normalizeLicense(licenseStr: string): string {
    const trimmed = (licenseStr || '').trim();
    if (!trimmed) return 'UNKNOWN';

    // Direct lookup
    if (KNOWN_LICENSES[trimmed]) return trimmed;

    // Normalization aliases
    const upper = trimmed.toUpperCase();
    if (upper === 'MIT') return 'MIT';
    if (upper === 'APACHE 2.0' || upper === 'APACHE-2.0' || upper === 'APACHE2') return 'Apache-2.0';
    if (upper === 'BSD' || upper === 'BSD-3' || upper === 'BSD-3-CLAUSE') return 'BSD-3-Clause';
    if (upper === 'BSD-2' || upper === 'BSD-2-CLAUSE') return 'BSD-2-Clause';
    if (upper === 'ISC') return 'ISC';
    if (upper === 'MPL-2.0' || upper === 'MPL2') return 'MPL-2.0';
    if (upper === 'GPL-3.0' || upper === 'GPL-3.0-ONLY' || upper === 'GPLV3') return 'GPL-3.0-only';
    if (upper === 'AGPL-3.0' || upper === 'AGPLV3') return 'AGPL-3.0-only';
    if (upper === 'UNLICENSE') return 'Unlicense';

    return trimmed;
  }

  /**
   * Check if a license is OSI-approved
   */
  public isOsiApproved(license: string): boolean {
    const norm = this.normalizeLicense(license);
    return Boolean(KNOWN_LICENSES[norm]?.osiApproved);
  }

  /**
   * Evaluates compatibility between project license and dependency licenses
   */
  public evaluateCompatibility(
    projectLicense: string,
    dependencies: Array<{ package: string; license: string }>
  ): LicenseEvaluationResult {
    const normProject = this.normalizeLicense(projectLicense);
    const projInfo = KNOWN_LICENSES[normProject];
    const issues: string[] = [];
    const dependencyChecks: DependencyLicenseCheck[] = [];

    if (!projInfo) {
      issues.push(`Unknown or non-standard project license: ${projectLicense}`);
    } else if (!projInfo.osiApproved) {
      issues.push(`Project license '${projectLicense}' is not an OSI-approved open source license.`);
    }

    const projCategory = projInfo ? projInfo.category : 'proprietary';

    for (const dep of dependencies) {
      const normDep = this.normalizeLicense(dep.license);
      const depInfo = KNOWN_LICENSES[normDep];

      if (!depInfo) {
        issues.push(`Dependency '${dep.package}' has unrecognized license: '${dep.license}'`);
        dependencyChecks.push({
          package: dep.package,
          license: dep.license,
          compatible: false,
          reason: `Unrecognized license '${dep.license}' cannot be verified for compatibility.`,
        });
        continue;
      }

      // Incompatibility rules:
      // If project is permissive (MIT, Apache-2.0, BSD), cannot include strong copyleft dependencies (GPL, AGPL)
      if (projCategory === 'permissive' && depInfo.category === 'strong_copyleft') {
        const reason = `Permissive project (${normProject}) cannot depend on copyleft package '${dep.package}' (${normDep}) without license infection.`;
        issues.push(reason);
        dependencyChecks.push({
          package: dep.package,
          license: normDep,
          compatible: false,
          reason,
        });
      } else {
        dependencyChecks.push({
          package: dep.package,
          license: normDep,
          compatible: true,
        });
      }
    }

    return {
      valid: issues.length === 0,
      projectLicense: normProject,
      category: projCategory,
      osiApproved: Boolean(projInfo?.osiApproved),
      compatible: issues.length === 0,
      issues,
      dependencyChecks,
    };
  }

  /**
   * Verify workspace directory has a valid LICENSE file that aligns with declared license
   */
  public verifyWorkspaceLicense(workspacePath: string, expectedLicense: string): { valid: boolean; error?: string } {
    const candidates = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'license.md'];
    let foundFile: string | null = null;

    for (const c of candidates) {
      const fullPath = path.join(workspacePath, c);
      if (fs.existsSync(fullPath)) {
        foundFile = fullPath;
        break;
      }
    }

    if (!foundFile) {
      return {
        valid: false,
        error: `No LICENSE file found in workspace root (${workspacePath}).`,
      };
    }

    const content = fs.readFileSync(foundFile, 'utf8');
    const norm = this.normalizeLicense(expectedLicense);

    if (norm === 'MIT') {
      if (!content.includes('MIT License') && !content.toLowerCase().includes('permission is hereby granted')) {
        return {
          valid: false,
          error: `LICENSE file does not contain expected MIT license terms.`,
        };
      }
    } else if (norm === 'Apache-2.0') {
      if (!content.includes('Apache License') && !content.includes('Version 2.0')) {
        return {
          valid: false,
          error: `LICENSE file does not contain expected Apache 2.0 license terms.`,
        };
      }
    }

    // Verify presence of copyright/year notice
    if (!content.includes('Copyright') && !content.includes('(c)') && !content.includes('©')) {
      return {
        valid: false,
        error: `LICENSE file is missing standard copyright / year statement.`,
      };
    }

    return { valid: true };
  }

  /**
   * Generates license text template
   */
  public generateLicense(spdxId: string, author: string, year?: number): string {
    const y = year || new Date().getFullYear();
    const norm = this.normalizeLicense(spdxId);

    if (norm === 'MIT') {
      return `MIT License

Copyright (c) ${y} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
    }

    if (norm === 'Apache-2.0') {
      return `                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   Copyright ${y} ${author}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
`;
    }

    // Fallback simple notice
    return `Copyright (c) ${y} ${author}
Released under the ${spdxId} License.
`;
  }
}

export const licenseEngine = new LicenseEngine();
