/**
 * API runtime configuration derived from environment variables.
 */
const FALLBACK_BASE_URL = 'http://localhost:5000';
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_UPLOAD_TIMEOUT_MS = 120_000;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 1_000;

/**
 * Reads the base URL from either `import.meta.env` (Vite/Vitest) or `globalThis.process.env`
 * (Node scripts) so the API client works in both browser and CLI contexts.
 */
const resolveEnvBaseUrl = (): string | undefined => {
  const viteEnv =
    typeof import.meta !== 'undefined' &&
    typeof (import.meta as ImportMeta & { env?: Record<string, unknown> }).env !== 'undefined'
      ? (import.meta as ImportMeta & { env?: Record<string, unknown> }).env
      : undefined;

  const viteValue = typeof viteEnv?.VITE_API_BASE_URL === 'string' ? viteEnv.VITE_API_BASE_URL : undefined;
  if (viteValue?.trim()) {
    return viteValue.trim();
  }

  const globalProcess =
    typeof globalThis !== 'undefined' && 'process' in globalThis
      ? (globalThis as { process?: { env?: Record<string, unknown> } }).process
      : undefined;

  const nodeValue =
    typeof globalProcess?.env?.VITE_API_BASE_URL === 'string'
      ? (globalProcess.env.VITE_API_BASE_URL as string)
      : undefined;

  if (nodeValue?.trim()) {
    return nodeValue.trim();
  }

  return undefined;
};

/**
 * Resolve the API base URL from environment variables with a safe fallback.
 */
const getBaseUrl = (): string => resolveEnvBaseUrl() ?? FALLBACK_BASE_URL;

export interface TimeoutConfig {
  standard: number;
  upload: number;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
}

export type FeatureFlags = Record<string, boolean>;

export interface ApiConfig {
  baseUrl: string;
  timeouts: TimeoutConfig;
  retry: RetryConfig;
  features: FeatureFlags;
}

/**
 * Runtime configuration shared by the HTTP client and supporting utilities.
 */
export const apiConfig: ApiConfig = {
  baseUrl: getBaseUrl(),
  timeouts: {
    standard: DEFAULT_TIMEOUT_MS,
    upload: DEFAULT_UPLOAD_TIMEOUT_MS,
  },
  retry: {
    maxRetries: DEFAULT_RETRY_ATTEMPTS,
    initialDelayMs: DEFAULT_RETRY_DELAY_MS,
  },
  features: {
    // Add feature flag toggles here, e.g., 'enableNewDashboard': false
  },
};
