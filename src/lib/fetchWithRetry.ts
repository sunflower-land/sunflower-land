/**
 * A drop-in replacement for `fetch` that retries transient failures with
 * exponential backoff and jitter.
 *
 * Every call to the Sunflower Land API should go through this helper so
 * that throttling (429), gateway hiccups (502/504), overloaded lambdas
 * (503) and dropped connections are absorbed before they surface to the
 * player as an error.
 *
 * What is retried:
 *  - 429 / 502 / 503 / 504 responses. A 503 whose body is the
 *    `Temporary maintenance` marker is returned straight away so the
 *    caller can route the player to the maintenance screen.
 *  - Network failures (the promise rejects, e.g. "Failed to fetch") but
 *    ONLY when the request is safe to replay. A request is considered safe
 *    when it is a GET/HEAD/OPTIONS, when it carries an `X-Transaction-ID`
 *    header (the backend de-duplicates on it) or when the caller passes
 *    `idempotent: true`. A plain POST that fails mid-flight could already
 *    have been processed, so it is not replayed.
 *
 * What is never retried:
 *  - Requests cancelled through an `AbortSignal`. Aborting also cancels a
 *    pending backoff sleep.
 *  - Any other response status (4xx, 500). Those are deliberate backend
 *    answers that the caller is expected to map to an error.
 */

export const DEFAULT_RETRIES = 3;
const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 10_000;
const MAX_RETRY_AFTER_MS = 30_000;

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export type FetchWithRetryOptions = {
  /** Number of retries after the first attempt. Defaults to 3. */
  retries?: number;
  /**
   * Force the request to be treated as safe to replay after a network
   * failure. Defaults to true for GET/HEAD/OPTIONS and for requests that
   * carry an `X-Transaction-ID` header.
   */
  idempotent?: boolean;
};

export const isRetryableStatus = (status: number): boolean =>
  RETRYABLE_STATUSES.has(status);

const isAbortError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { name?: string }).name === "AbortError";

const getHeader = (
  headers: HeadersInit | undefined,
  name: string,
): string | undefined => {
  if (!headers) return undefined;

  if (headers instanceof Headers) {
    return headers.get(name) ?? undefined;
  }

  const target = name.toLowerCase();
  const entries = Array.isArray(headers) ? headers : Object.entries(headers);
  const match = entries.find(([key]) => key.toLowerCase() === target);

  return match?.[1];
};

const isIdempotentRequest = (init: RequestInit | undefined): boolean => {
  const method = (init?.method ?? "GET").toUpperCase();
  if (SAFE_METHODS.has(method)) return true;

  return !!getHeader(init?.headers, "X-Transaction-ID");
};

/**
 * Exponential backoff with "equal" jitter: the delay is drawn from
 * [exp / 2, exp] where exp = min(cap, base * 2^attempt). Jitter spreads a
 * thundering herd of clients that were all throttled at the same moment
 * while the lower bound guarantees we always back off at least a little.
 */
const backoffDelay = (attempt: number): number => {
  const exponential = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
  const half = exponential / 2;

  return half + Math.floor(Math.random() * half);
};

/**
 * Returns the delay the server asked for via `Retry-After`, if any.
 * Supports the delay-seconds form only; an HTTP date is ignored.
 */
const retryAfterDelay = (response: Response): number | undefined => {
  const header = response.headers?.get?.("Retry-After");
  if (!header) return undefined;

  const seconds = Number(header);
  if (!Number.isFinite(seconds) || seconds < 0) return undefined;

  return Math.min(seconds * 1000, MAX_RETRY_AFTER_MS);
};

const isMaintenanceResponse = async (response: Response): Promise<boolean> => {
  if (response.status !== 503) return false;

  try {
    const data = await response.clone().json();

    return data?.message === "Temporary maintenance";
  } catch {
    return false;
  }
};

const sleep = (ms: number, signal?: AbortSignal | null): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason ?? new DOMException("Aborted", "AbortError"));
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    signal?.addEventListener("abort", onAbort, { once: true });
  });

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const idempotent = options.idempotent ?? isIdempotentRequest(init);
  const signal = init?.signal;

  for (let attempt = 0; ; attempt++) {
    const isLastAttempt = attempt >= retries;
    let delay: number;

    try {
      // Resolve `fetch` at call time so test doubles installed on
      // globalThis are honoured.
      const response = await globalThis.fetch(input, init);

      if (!isRetryableStatus(response.status) || isLastAttempt) {
        return response;
      }

      if (await isMaintenanceResponse(response)) {
        return response;
      }

      delay = retryAfterDelay(response) ?? backoffDelay(attempt);
    } catch (error) {
      if (isAbortError(error) || !idempotent || isLastAttempt) {
        throw error;
      }

      delay = backoffDelay(attempt);
    }

    await sleep(delay, signal);
  }
}
