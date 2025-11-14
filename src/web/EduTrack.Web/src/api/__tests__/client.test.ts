import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '../core/client'
import { ApiError } from '../types/errors'
import { apiConfig } from '@/config'
import * as retryModule from '../core/retry'

const originalBaseUrl = apiConfig.baseUrl

describe('apiClient', () => {
  beforeEach(() => {
    apiConfig.baseUrl = 'http://test.local'
  })

  afterEach(() => {
    apiConfig.baseUrl = originalBaseUrl
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('performs GET requests and parses JSON responses', async () => {
    const responsePayload = { status: 'healthy' }
    const fetchSpy = vi.spyOn(retryModule, 'fetchWithRetry').mockResolvedValue(
      new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const data = await apiClient.get<typeof responsePayload>('/health')

    expect(data).toEqual(responsePayload)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy.mock.calls[0][0]).toBe('http://test.local/health')
  })

  it('throws ApiError when the server responds with non-2xx status', async () => {
    vi.spyOn(retryModule, 'fetchWithRetry').mockResolvedValue(
      new Response('boom', { status: 500, statusText: 'Internal Server Error' }),
    )

    await expect(apiClient.get('/oops')).rejects.toBeInstanceOf(ApiError)
  })

  it('aborts requests that exceed the configured timeout', async () => {
    vi.useFakeTimers()

    vi.spyOn(retryModule, 'fetchWithRetry').mockImplementation((_url, options) => {
      return new Promise((_resolve, reject) => {
        options?.signal?.addEventListener('abort', () => {
          const abortError = new Error('Aborted by test')
          abortError.name = 'AbortError'
          reject(abortError)
        })
      })
    })

    const requestPromise = apiClient.get('/slow', { timeout: 5 })
    const assertion = expect(requestPromise).rejects.toThrow('Request timeout after 5ms')

    await vi.advanceTimersByTimeAsync(5)

    await assertion
  })
})
