import crypto from 'node:crypto';

export function generateUuid(): string {
  return crypto.randomUUID();
}
