/**
 * Request tokens — the client half of the anti-bot / anti-scraping layer.
 *
 * The `/session` response hands us a `sessionCode` and its expiry. The code
 * goes straight into the WASM module and is not kept in JS. Every protected
 * request then carries:
 *
 *   X-Token     HMAC-SHA256(sessionCode, `${timestamp}`) as hex
 *   X-Timestamp unix seconds, when the request was made
 *   X-Expires   the code's expiry, so the server can re-derive the code
 *
 * There is no request counter and no queueing: requests may fire
 * concurrently, out of order, or be retried, and each one stands alone.
 * (An earlier design used a monotonic counter, which meant serialising
 * every request and still produced false rejections whenever effects and
 * autosaves overlapped.)
 *
 * The code is bound server-side to this account, so lifting it into
 * another session is useless. It expires on its own; the client picks up a
 * fresh one on its next `/session`.
 *
 * If no code was issued (older API) or the token layer can't start, calls
 * fall through as plain fetch — the game never breaks because of this.
 *
 * To watch this work step by step, see ./debug.ts (enable with
 * `localStorage.setItem("requestTokenDebug", "true")`).
 */

import { codePrefix, requestTokenDebug } from "./debug";
import { createSubtleFallback } from "./fallback";
import { loadWasm, type TokenModule } from "./loader";

let tokenModule: TokenModule | undefined;
let expiresAt: number | undefined;
/** Which implementation is live — traced, never used for logic. */
let implementation: "wasm" | "webcrypto" | undefined;

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
    requestTokenDebug(
      "2. no code issued → layer stays OFF (requests send no headers)",
      { reason: "server returned no sessionCode (old API, or no server key)" },
    );
    tokenModule?.clearSession();
    expiresAt = undefined;
    implementation = undefined;
    return;
  }

  try {
    if (!tokenModule) {
      try {
        tokenModule = await loadWasm();
        implementation = "wasm";
        requestTokenDebug("2. WASM module loaded", {
          implementation,
        });
      } catch (e) {
        // Older engines (pre reference-types, ~2021) and some embedded
        // webviews can't instantiate the WASM module. Compute identical
        // tokens via WebCrypto instead — the game already requires
        // crypto.subtle, so this runs anywhere the game runs.
        tokenModule = createSubtleFallback();
        implementation = "webcrypto";
        requestTokenDebug("2. WASM unavailable → WebCrypto fallback", {
          implementation,
          error: (e as Error)?.message,
        });
        // eslint-disable-next-line no-console
        console.error("Request token WASM unavailable, using fallback", e);
      }
    }

    await tokenModule.initSession(params.sessionCode);
    expiresAt = params.sessionCodeExpiresAt;

    requestTokenDebug("3. session code stored in module → layer is ON", {
      implementation,
      sessionCode: codePrefix(params.sessionCode),
      note: "the code is held inside the module; JS keeps only the expiry",
    });
  } catch (e) {
    // Never let token setup take the game down — degrade to plain fetch.
    requestTokenDebug("3. init FAILED → layer stays OFF", {
      error: (e as Error)?.message,
    });
    // eslint-disable-next-line no-console
    console.error("Request token init failed", e);
    expiresAt = undefined;
  }
}

/** Forget the session code (logout). */
export function clearRequestTokens() {
  requestTokenDebug("session cleared (logout)");
  tokenModule?.clearSession();
  expiresAt = undefined;
  implementation = undefined;
}

export function requestTokensActive(): boolean {
  return !!expiresAt && !!tokenModule?.hasSession();
}

async function tokenHeaders(
  url: string,
): Promise<Record<string, string> | undefined> {
  if (!requestTokensActive()) {
    requestTokenDebug("request sent WITHOUT token headers (layer off)", {
      url,
    });
    return undefined;
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const token = await (tokenModule as TokenModule).computeToken(timestamp);

  const headers = {
    "X-Token": token,
    "X-Timestamp": String(timestamp),
    "X-Expires": String(expiresAt),
  };

  requestTokenDebug("signing request", {
    url,
    implementation,
    // Exactly what gets HMAC'd — the server rebuilds this same string.
    message: `${timestamp}`,
    "X-Token": token,
    "X-Timestamp": headers["X-Timestamp"],
    "X-Expires": headers["X-Expires"],
    codeExpiresIn: `${Math.round((expiresAt as number) - timestamp)}s`,
  });

  return headers;
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
    ...(await tokenHeaders(url)),
  };

  const response = await window.fetch(input, { ...init, headers });

  if (response.status === 403) {
    // Not necessarily us — but this is the shape a rejection takes, and
    // it is the first thing to check when a protected call starts failing.
    requestTokenDebug("response 403 — could be a rejected token (RT-001)", {
      url,
      hint: "check the API logs for requestToken.rejected with this address",
    });
  } else {
    requestTokenDebug("response received", { url, status: response.status });
  }

  return response;
}
