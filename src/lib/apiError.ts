/**
 * Turns a failed API `Response` into an error that still says something
 * useful by the time it reaches /support/errors.
 *
 * Every read endpoint used to collapse `status >= 400` into
 * `new Error("FAILED_REQUEST")`. That message is all the support tool ever
 * received: a session that expired overnight, a signer the browser could
 * not run, and a 500 out of the marketplace lambda all arrived as the same
 * unactionable row — no status, no endpoint, nothing to join against the
 * API's own logs.
 *
 * The message stays the error code (a lot of call sites compare
 * `err.message === ERRORS.X`, and the modal renders it), and everything
 * worth knowing rides alongside it on the error object.
 */

import { CONFIG } from "./config";
import { ERRORS } from "./errors";
import { requestTokenDiagnostics } from "./requestToken";

export type ApiErrorDetail = {
  /** Client error code, e.g. FAILED_REQUEST — also the error's message. */
  code: string;
  /** HTTP status of the response that failed. */
  status?: number;
  /** Method + path, e.g. "GET /marketplace". Never the query string. */
  endpoint?: string;
  /** The X-Transaction-ID we sent, so the API can join this to its own row. */
  transactionId?: string;
  /** errorId returned in the response body, if any. */
  errorId?: string;
  meta?: Record<string, unknown>;
};

export type ApiError = Error & ApiErrorDetail;

/**
 * Statuses that mean something more specific than "the request failed".
 * Anything not listed keeps the caller's fallback code, with the status
 * carried separately — a 403 stays FAILED_REQUEST on purpose, because an
 * unexpected 403 on a protected read (a rejected request token, say) is a
 * regression we want reported, not a routine expired session.
 */
const STATUS_CODES: Record<number, string> = {
  401: ERRORS.UNAUTHORIZED,
  429: ERRORS.TOO_MANY_REQUESTS,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** True for an error carrying the fields below (duck-typed, so it survives
 * being rethrown through SWR and React's error boundary). */
export const getApiErrorDetail = (
  error: unknown,
): ApiErrorDetail | undefined => {
  if (!isRecord(error) || typeof error.code !== "string") return undefined;

  const { code, status, endpoint, transactionId, errorId, meta } =
    error as Partial<ApiErrorDetail>;

  return {
    code: code as string,
    status: typeof status === "number" ? status : undefined,
    endpoint: typeof endpoint === "string" ? endpoint : undefined,
    transactionId:
      typeof transactionId === "string" ? transactionId : undefined,
    errorId: typeof errorId === "string" ? errorId : undefined,
    meta: isRecord(meta) ? meta : undefined,
  };
};

export const createApiError = (detail: ApiErrorDetail): ApiError =>
  Object.assign(new Error(detail.code), detail);

/**
 * Client-side context that is invisible in a bare status code but explains
 * a good share of the failures we see: a tab that was backgrounded when
 * the request went out, a device that had already dropped off the network,
 * or a request-token signer that never loaded (common in third-party
 * mobile WebViews, where WASM is often unavailable).
 */
const clientContext = () => ({
  online: typeof navigator !== "undefined" ? navigator.onLine : undefined,
  visibility:
    typeof document !== "undefined" ? document.visibilityState : undefined,
  signer: requestTokenDiagnostics(),
  release: CONFIG.RELEASE_VERSION,
});

/**
 * Response headers worth keeping. The API echoes the transaction id, and
 * API Gateway stamps its own request id — either one turns a support row
 * into something that can be looked up server-side.
 */
const responseContext = (response: Response) => {
  const header = (name: string) => response.headers?.get?.(name) ?? undefined;

  return {
    transactionId: header("x-transaction-id"),
    requestId: header("x-amzn-requestid"),
    retryAfter: header("retry-after"),
  };
};

/**
 * Build the error for a failed response. The API returns
 * `{ errorCode, errorId }` on rejections it knows about; that code wins
 * over anything we can infer from the status.
 */
export async function apiError(
  response: Response,
  {
    endpoint,
    transactionId,
    fallbackCode = ERRORS.FAILED_REQUEST,
    meta,
  }: {
    endpoint: string;
    transactionId?: string;
    /** Code used when the status and body say nothing more specific. */
    fallbackCode?: string;
    meta?: Record<string, unknown>;
  },
): Promise<ApiError> {
  // Cloned so the caller can still read the response, and defensively:
  // an HTML error page from a proxy, or an empty 502, must not turn a
  // failed request into a parse crash on the way to the report.
  const body = await (async () => {
    try {
      const source =
        typeof response.clone === "function" ? response.clone() : response;

      return await source.json();
    } catch {
      return undefined;
    }
  })();

  const errorCode = isRecord(body) ? body.errorCode : undefined;
  const errorId = isRecord(body) ? body.errorId : undefined;
  const fromResponse = responseContext(response);

  return createApiError({
    // The backend's own code beats anything we can infer from the status.
    code:
      (typeof errorCode === "string" ? errorCode : undefined) ??
      STATUS_CODES[response.status] ??
      fallbackCode,
    status: response.status,
    endpoint,
    transactionId: transactionId ?? fromResponse.transactionId,
    errorId: typeof errorId === "string" ? errorId : undefined,
    meta: {
      ...clientContext(),
      requestId: fromResponse.requestId,
      retryAfter: fromResponse.retryAfter,
      ...meta,
    },
  });
}
