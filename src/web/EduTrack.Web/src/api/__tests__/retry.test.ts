import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWithRetry } from '../core/retry'
import { apiConfig } from '@/config'
import { ApiError } from '../types/errors'

const originalFetch = globalThis.fetch
const originalRetryConfig = { ...apiConfig.retry }

describe('fetchWithRetry', () => {
  beforeEach(() => {
    apiConfig.retry.maxRetries = 2
    apiConfig.retry.initialDelayMs = 1
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    Object.assign(apiConfig.retry, originalRetryConfig)
    vi.restoreAllMocks()
  })

  it('retries network errors and eventually succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Network down'))
      .mockResolvedValueOnce(new Response('ok', { status: 200 }))

    globalThis.fetch = fetchMock as typeof globalThis.fetch

    const response = await fetchWithRetry('https://example.test/retry', { retry: true })

    expect(response.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry 4xx client responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('bad', { status: 400, statusText: 'Bad Request' }))
    globalThis.fetch = fetchMock as typeof globalThis.fetch

    const response = await fetchWithRetry('https://example.test/client-error', { retry: true, retryCount: 3 })

    expect(response.status).toBe(400)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws ApiError after exhausting retries on 5xx responses', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(new Response('boom', { status: 503, statusText: 'Service Unavailable' })),
    )
    globalThis.fetch = fetchMock as typeof globalThis.fetch

    await expect(fetchWithRetry('https://example.test/server-error', { retryCount: 1 })).rejects.toBeInstanceOf(ApiError)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
