/**
 * AI Satellite — Phase 19 Standardized API Architecture
 * Uniform response creation, input validation, and cryptographic request tracing.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import type { ApiResponse } from './types';

export function generateTraceId(): string {
  return `trc_${randomBytes(8).toString('hex')}`;
}

export function createApiResponse<T>(
  data: T,
  meta?: { traceId?: string; page?: number; total?: number }
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      traceId: meta?.traceId || generateTraceId(),
      page: meta?.page,
      total: meta?.total,
    },
  };
}

export function createApiError(
  code: string,
  message: string,
  details?: any,
  traceId?: string
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      traceId: traceId || generateTraceId(),
    },
  };
}

export function validateApiInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  traceId?: string
): { success: true; data: T } | { success: false; error: ApiResponse<never> } {
  const result = schema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: createApiError(
        'VALIDATION_FAILED',
        'Input failed schema validation',
        result.error.flatten(),
        traceId
      ),
    };
  }
  return {
    success: true,
    data: result.data,
  };
}
