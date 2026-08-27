/**
 * Request tokens — the client half of the anti-bot / anti-scraping layer.
 *
 * `/session` hands us a `sessionCode` and its expiry. The code goes into
 * the WASM signer (fetched at runtime from sunflower-land.com/wasm — see
 * loader.ts) and is not kept in JS. Every protected request then carries:
 *
 *   X-Token     HMAC chain over method, path, body and timestamp
 *   X-Timestamp unix seconds, stamped inside the signer
 *   X-Expires   the session code's expiry
 *
 * The signer holds a client key baked in at build time that is never
 * transmitted, so reading the session code out of the `/session` response
 * is not enough to produce a valid token. It also takes the timestamp
 * itself rather than accepting one, and binds the request into the token,
 * so a captured token cannot be reused for a different call.
 *
 * There is no request counter and no queueing: requests may fire
 * concurrently, out of order, or be retried, and each stands alone.
 *
 * If the signer cannot be loaded, the game carries on regardless — but the
 * request goes out carrying `X-Token: incompatible_wasm` instead of nothing
 * at all. That distinction matters server-side: a bare request is a caller
 * that never signed (a script, or a client older than this layer), whereas
 * the sentinel is one of our own players whose browser could not run the
 * module. The API logs the two separately so the second group can be sized
 * before enforcement is turned on.
 */

import { fetchWithRetry, type FetchWithRetryOptions } from "lib/fetchWithRetry";
import { loadTokenModule, type TokenModule } from "./loader";

/**
 * Sent as `X-Token` when a session code was issued but the signer could not
 * be loaded or run. The API matches this exact string — keep the two in
 * step (`UNSUPPORTED_SIGNER_TOKEN` in the API's requestToken.ts).
 */
export const UNSUPPORTED_SIGNER_TOKEN = "incompatible_wasm";

let signer: TokenModule | undefined;
let expiresAt: number | undefined;
/**
 * True when we were given a session code but could not produce a signer —
 * an old engine, a webview that refuses WebAssembly, a blocked fetch. Kept
 * apart from "no code was issued", which is not this browser's fault.
 */
let signerUnavailable = false;
/**
 * The in-flight `initRequestTokens` call, if any. Fetching and
 * instantiating the signer takes a couple of seconds on a cold load, and
 * protected requests fire during that window — `secureFetch` awaits this
 * so they are signed rather than going out bare (which under enforcement
 * would be a rejection).
 */
let initInFlight: Promise<void> | undefined;

/**
 * Initialise the token layer from the `/session` response. Safe to call on
 * every session start — a fresh session replaces the code.
 */
export async function initRequestTokens(params: {
  sessionCode?: string;
  sessionCodeExpiresAt?: number;
}): Promise<void> {
  initInFlight = init(params);
  return initInFlight;
}

async function init(params: {
  sessionCode?: string;
  sessionCodeExpiresAt?: number;
}): Promise<void> {
  if (!params.sessionCode || !params.sessionCodeExpiresAt) {
    signer?.clearSession();
    expiresAt = undefined;
    signerUnavailable = false;
    return;
  }

  try {
    signer ??= await loadTokenModule();

    signer.initSession(params.sessionCode);
    expiresAt = params.sessionCodeExpiresAt;
    signerUnavailable = false;
  } catch {
    // Never let token setup take the game down — the request still goes,
    // flagged so the API can count who this is happening to.
    expiresAt = undefined;
    signerUnavailable = true;
  }
}

/** Forget the session code (logout). */
export function clearRequestTokens() {
  signer?.clearSession();
  expiresAt = undefined;
  signerUnavailable = false;
}

export function requestTokensActive(): boolean {
  return !!expiresAt && !!signer?.hasSession();
}

function tokenHeaders(
  url: string,
  init?: RequestInit,
): Record<string, string> | undefined {
  if (!requestTokensActive()) {
    // Tell the API this is a real player who could not run the signer,
    // rather than leaving it indistinguishable from an unsigned script.
    return signerUnavailable
      ? { "X-Token": UNSUPPORTED_SIGNER_TOKEN }
      : undefined;
  }

  const method = (init?.method ?? "GET").toUpperCase();
  // Path only — the server ignores the query string too, so that a proxy
  // re-encoding parameters can never cause a false rejection.
  const path = new URL(url, window.location.origin).pathname;
  const body = typeof init?.body === "string" ? init.body : "";

  // The signer stamps the time itself; we only say what request it signs.
  const [timestamp, token] = (signer as TokenModule)
    .signRequest(method, path, body)
    .split(":");

  return {
    "X-Token": token,
    "X-Timestamp": timestamp,
    "X-Expires": String(expiresAt),
  };
}

/**
 * Drop-in replacement for `fetchWithRetry` on protected endpoints — both
 * the state-mutating ones and the read-only ones we don't want scraped.
 *
 * Signs the request, then hands it to `fetchWithRetry`, so protected calls
 * keep the same throttling/backoff behaviour as every other endpoint. A
 * retry replays the identical signed request, which the token allows: it
 * is bound to this method, path and body, and the server's five minute
 * window comfortably outlasts the retry budget.
 */
export async function secureFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: FetchWithRetryOptions,
): Promise<Response> {
  const url = typeof input === "string" ? input : String(input);

  // If the signer is still loading, wait for it rather than racing it.
  // `initRequestTokens` always settles (it swallows its own failures), so
  // this cannot hang. Nothing in flight means nothing to wait for.
  if (initInFlight && !requestTokensActive()) {
    await initInFlight;
  }

  return fetchWithRetry(
    input,
    {
      ...init,
      headers: {
        ...init?.headers,
        ...tokenHeaders(url, init),
      },
    },
    options,
  );
}
