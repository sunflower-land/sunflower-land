/**
 * Request tokens — the client half of the anti-bot / anti-scraping layer.
 *
 * `/session` hands us a `sessionCode` and its expiry. The code goes into
 * the WASM signer (fetched at runtime from its own host — see loader.ts)
 * and is not kept in JS. Every protected request then carries:
 *
 *   X-Token     HMAC chain over method, path, body and timestamp
 *   X-Timestamp unix seconds, stamped inside the signer
 *   X-Expires   the session code's expiry
 *
 * The signer holds a client key baked in at build time that is never
 * transmitted, so reading the session code out of the `/session` response
 * is not enough to produce a valid token. It also takes the timestamp
 * itself rather than accepting one, and binds the request into the token,
 * so a captured token cannot be reused for a different call or replayed
 * beyond the server's 30s window.
 *
 * There is no request counter and no queueing: requests may fire
 * concurrently, out of order, or be retried, and each stands alone.
 *
 * If the signer can't be loaded, calls fall through as plain fetch. In log
 * mode the server accepts them; in enforce mode they are rejected — see
 * the compatibility note in wasm-token/README.md.
 *
 * To watch this work step by step, see ./debug.ts (enable with
 * `localStorage.setItem("requestTokenDebug", "true")`).
 */

import { codePrefix, requestTokenDebug } from "./debug";
import { loadTokenModule, type TokenModule } from "./loader";

let signer: TokenModule | undefined;
let expiresAt: number | undefined;

/**
 * Initialise the token layer from the `/session` response. Safe to call on
 * every session start — a fresh session replaces the code.
 */
export async function initRequestTokens(params: {
  sessionCode?: string;
  sessionCodeExpiresAt?: number;
}): Promise<void> {
  requestTokenDebug("1. /session response received", {
    sessionCode: codePrefix(params.sessionCode),
    sessionCodeExpiresAt: params.sessionCodeExpiresAt,
    expiresIn: params.sessionCodeExpiresAt
      ? `${Math.round(params.sessionCodeExpiresAt - Date.now() / 1000)}s`
      : undefined,
  });

  if (!params.sessionCode || !params.sessionCodeExpiresAt) {
    signer?.clearSession();
    expiresAt = undefined;
    requestTokenDebug("2. no code issued → layer stays OFF", {
      reason: "server returned no sessionCode (older API)",
    });
    return;
  }

  try {
    if (!signer) {
      signer = await loadTokenModule();
      requestTokenDebug("2. signer loaded");
    }

    signer.initSession(params.sessionCode);
    expiresAt = params.sessionCodeExpiresAt;

    requestTokenDebug("3. session code stored in signer → layer is ON", {
      sessionCode: codePrefix(params.sessionCode),
      note: "the code is held inside the module; JS keeps only the expiry",
    });
  } catch (e) {
    // Never let token setup take the game down — degrade to plain fetch.
    requestTokenDebug("3. signer unavailable → layer stays OFF", {
      error: (e as Error)?.message,
      note: "requests will be sent without token headers",
    });
    // eslint-disable-next-line no-console
    console.error("Request token signer unavailable", e);
    expiresAt = undefined;
  }
}

/** Forget the session code (logout). */
export function clearRequestTokens() {
  requestTokenDebug("session cleared (logout)");
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
  if (!requestTokensActive()) {
    requestTokenDebug("request sent WITHOUT token headers (layer off)", {
      url,
    });
    return undefined;
  }

  const method = (init?.method ?? "GET").toUpperCase();
  // Path only — the server ignores the query string too, so that a proxy
  // re-encoding parameters can never cause a false rejection.
  const path = new URL(url, window.location.origin).pathname;
  const body = typeof init?.body === "string" ? init.body : "";

  // The signer stamps the time itself; we only get to say what request it
  // is signing.
  const signed = (signer as TokenModule).signRequest(method, path, body);
  const [timestamp, token] = signed.split(":");

  requestTokenDebug("signing request", {
    url,
    method,
    path,
    bodyBytes: body.length,
    timestamp,
    token,
    note: "server rebuilds this from the request it actually receives",
  });

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

  const headers = {
    ...init?.headers,
    ...tokenHeaders(url, init),
  };

  const response = await window.fetch(input, { ...init, headers });

  if (response.status === 403) {
    requestTokenDebug("response 403 — could be a rejected token (RT-001)", {
      url,
      hint: "check the API logs for requestToken.rejected with this address",
    });
  } else {
    requestTokenDebug("response received", { url, status: response.status });
  }

  return response;
}
