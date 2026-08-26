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
 * Failures here are deliberately silent — if the signer cannot be loaded,
 * requests go out unsigned and the game carries on. The API is where that
 * surfaces, as `requestToken.rejected` with reason `missing-headers`.
 */

import { loadTokenModule, type TokenModule } from "./loader";

let signer: TokenModule | undefined;
let expiresAt: number | undefined;
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
    return;
  }

  try {
    signer ??= await loadTokenModule();

    signer.initSession(params.sessionCode);
    expiresAt = params.sessionCodeExpiresAt;
  } catch {
    // Never let token setup take the game down — degrade to plain fetch.
    expiresAt = undefined;
  }
}

/** Forget the session code (logout). */
export function clearRequestTokens() {
  signer?.clearSession();
  expiresAt = undefined;
}

export function requestTokensActive(): boolean {
  return !!expiresAt && !!signer?.hasSession();
}

function tokenHeaders(
  url: string,
  init?: RequestInit,
): Record<string, string> | undefined {
  if (!requestTokensActive()) return undefined;

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
 * Drop-in replacement for `window.fetch` on protected endpoints — both the
 * state-mutating ones and the read-only ones we don't want scraped.
 */
export async function secureFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url = typeof input === "string" ? input : String(input);

  // If the signer is still loading, wait for it rather than racing it.
  // `initRequestTokens` always settles (it swallows its own failures), so
  // this cannot hang. Nothing in flight means nothing to wait for.
  if (initInFlight && !requestTokensActive()) {
    await initInFlight;
  }

  return window.fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...tokenHeaders(url, init),
    },
  });
}
