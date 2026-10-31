import crypto from 'node:crypto';

export function calculateHash(input: string, algorithm: 'sha256' | 'md5' = 'sha256'): string {
  return crypto.createHash(algorithm).update(input, 'utf8').digest('hex');
}
