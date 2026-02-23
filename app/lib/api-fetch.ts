import { API_BASE } from "./constants";

interface FetchOptions {
  /** Timeout for each attempt in ms. Default: 10000 */
  timeout?: number;
  /** Delay before retry in ms. Default: 3000 */
  retryDelay?: number;
  /** Max retry attempts. Default: 1 */
  maxRetries?: number;
  /** Next.js revalidation in seconds. Default: 3600 */
  revalidate?: number;
}

/**
 * Fetch from the backend API with timeout and retry logic.
 * On first failure, waits retryDelay then retries — enough time
 * for a Render cold start to begin responding.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const {
    timeout = 10000,
    retryDelay = 3000,
    maxRetries = 1,
    revalidate = 3600,
  } = options;

  const url = `${API_BASE}${path}`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(url, {
        signal: controller.signal,
        next: { revalidate },
      });

      clearTimeout(timer);

      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }
      return null;
    }
  }

  return null;
}
