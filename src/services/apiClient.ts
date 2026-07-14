import { getApiBaseUrl } from '@/config/api';

type FetchJsonOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
};

export async function fetchJson<T>(
  path: string,
  options: FetchJsonOptions = {}
): Promise<T> {
  const controller = new globalThis.AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method ?? 'GET',
      headers: options.body
        ? { 'Content-Type': 'application/json' }
        : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `API request failed: ${response.status} ${response.statusText} ${errorText}`
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
