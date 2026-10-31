/**
 * AI Satellite — ID Generator Helper for Discovery Engine
 * Built using Node standard crypto.randomBytes / crypto.randomUUID
 */

import crypto from 'node:crypto';

export function generateDiscoveryId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomBytes) {
    return `${prefix}-${crypto.randomBytes(4).toString('hex')}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function uuidv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
