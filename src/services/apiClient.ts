import { getApiBaseUrl } from '@/config/api';

export async function fetchJson<T>(path: string): Promise<T> {
  const controller = new globalThis.AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Api request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
