/**
 * CLI health check that reuses the shared API client to hit `/health`.
 * Useful for smoke-testing the backend before wiring UI features.
 */

import { apiClient } from '../src/api/core/client';
import { ApiError } from '../src/api/types/errors';
import { apiConfig } from '../src/config/api.config';

interface HealthResponse {
  status?: string;
  version?: string;
  uptimeSeconds?: number;
}

async function runHealthCheck(): Promise<void> {
  console.log(`[health-check] Using base URL: ${apiConfig.baseUrl}`);

  try {
    const response = await apiClient.get<HealthResponse>('/health', {
      timeout: 5_000,
      retry: false,
    });

    console.log('[health-check] ✅ Healthy response:', response);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('[health-check] ❌ API error:', error.toString());
    } else {
      console.error('[health-check] ❌ Unexpected error:', error);
    }
    process.exitCode = 1;
  }
}

runHealthCheck();
