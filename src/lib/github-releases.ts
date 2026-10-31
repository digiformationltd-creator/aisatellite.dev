export interface DownloadAsset {
  platform: string;
  version: string;
  filename: string;
  url: string;
  size?: string;
  sha256?: string;
}

export interface ReleaseChangelog {
  version: string;
  date: string;
  changes: string[];
}

export interface VerifiedProjectRelease {
  slug: string;
  title: string;
  version: string;
  releaseDate: string;
  githubRepo?: string;
  repositoryUrl?: string;
  downloads: DownloadAsset[];
  changelogItems: ReleaseChangelog[];
  installationSteps: string[];
}

/**
 * Normalizes and formats release package size for display
 */
export function formatPackageSize(bytesOrSize?: string | number): string {
  if (!bytesOrSize) return 'N/A';
  if (typeof bytesOrSize === 'string') return bytesOrSize;
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytesOrSize;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Determines operating system badge variant and human-readable label
 */
export function getPlatformBadge(platform: string): { label: string; icon: 'windows' | 'apple' | 'linux' | 'docker' | 'npm' } {
  const p = platform.toLowerCase();
  if (p.includes('win')) return { label: 'Windows (x64/ARM)', icon: 'windows' };
  if (p.includes('mac') || p.includes('darwin') || p.includes('apple')) return { label: 'macOS (Universal)', icon: 'apple' };
  if (p.includes('linux') || p.includes('deb') || p.includes('appimage')) return { label: 'Linux (x86_64)', icon: 'linux' };
  if (p.includes('docker') || p.includes('container')) return { label: 'Docker Container', icon: 'docker' };
  return { label: platform, icon: 'npm' };
}

/**
 * Validates a simulated or real SHA-256 hash string (64 hexadecimal characters)
 */
export function isValidSha256(hash?: string): boolean {
  if (!hash) return false;
  return /^[a-fA-F0-9]{64}$/.test(hash.trim());
}
