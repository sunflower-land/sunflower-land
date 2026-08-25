/**
 * Per-session request tokens — the client half of the bot-friction layer.
 *
 * The `/session` response hands us a one-time `sessionSecret`. It is passed
 * straight into the WASM module (`initSession`) and not kept in JS. Every
 * protected request then goes through `secureFetch`, which attaches:
 *
 *   X-Token     HMAC-SHA256(secret, `${sessionId}:${timestamp}:${counter}`)
 *   X-Timestamp unix seconds, rounded to the nearest 5s window
 *   X-Counter   monotonic per-session counter, incremented per request
 *
 * Protected requests are serialised: each one waits for the previous
 * response before dispatch, so counters arrive at the server in order.
 * (The server rejects counters that are not strictly increasing.)
 *
 * If no secret has been issued (old API version, or init failed) requests
 * are sent without headers — the server's log-only mode tolerates that, and
 * the layer degrades to plain fetch rather than breaking the game.
 */

import { createSubtleFallback } from "./fallback";
import { loadWasm, type TokenModule } from "./loader";

const TIMESTAMP_WINDOW_SECONDS = 5;

let tokenModule: TokenModule | undefined;
let sessionId: string | undefined;
let counter = 0;

// Tail of the protected-request queue. Each secureFetch chains onto this so
// requests dispatch strictly one at a time, in counter order.
let queueTail: Promise<void> = Promise.resolve();

function decodeHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0 || /[^0-9a-fA-F]/.test(hex)) {
    throw new Error("Invalid session secret encoding");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Initialise the token layer from the `/session` response. Safe to call on
 * every session start — a fresh session replaces the secret and resets the
 * counter. A missing secret (API not yet rolled out) leaves the layer off.
 */
export async function initRequestTokens(params: {
  sessionId: string;
  sessionSecret?: string;
}): Promise<void> {
  if (!params.sessionSecret) {
    tokenModule?.clearSession();
    sessionId = undefined;
    return;
  }

  try {
    if (!tokenModule) {
      try {
        tokenModule = await loadWasm();
      } catch (e) {
        // Older engines (pre reference-types, ~2021) and some embedded
        // webviews can't instantiate the WASM module. Compute identical
        // tokens via WebCrypto instead — the game already requires
        // crypto.subtle, so this runs anywhere the game runs.
        // eslint-disable-next-line no-console
        console.error("Request token WASM unavailable, using fallback", e);
        tokenModule = createSubtleFallback();
      }
    }

    await tokenModule.initSession(decodeHex(params.sessionSecret));
    sessionId = params.sessionId;
    counter = 0;
  } catch (e) {
    // Never let token setup take the game down — degrade to plain fetch.
    // eslint-disable-next-line no-console
    console.error("Request token init failed", e);
    sessionId = undefined;
  }
}

/** Forget the session secret (logout). */
export function clearRequestTokens() {
  tokenModule?.clearSession();
  sessionId = undefined;
  counter = 0;
}

export function requestTokensActive(): boolean {
  return !!sessionId && !!tokenModule?.hasSession();
}

async function tokenHeaders(): Promise<Record<string, string>> {
  if (!requestTokensActive()) return {};

  const timestamp =
    Math.round(Date.now() / 1000 / TIMESTAMP_WINDOW_SECONDS) *
    TIMESTAMP_WINDOW_SECONDS;

  counter += 1;

  const token = await (tokenModule as TokenModule).computeToken(
    sessionId as string,
    timestamp,
    counter,
  );

  return {
    "X-Token": token,
    "X-Timestamp": String(timestamp),
    "X-Counter": String(counter),
  };
}

/**
 * Drop-in replacement for `window.fetch` on protected (state-mutating)
 * endpoints. Serialises dispatch and attaches the token headers.
 */
export async function secureFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const previous = queueTail;

  let release!: () => void;
  queueTail = new Promise((res) => (release = res));

  // Wait for the previous protected request to settle so counters arrive
  // in order. The previous slot always releases (finally below), so this
  // cannot deadlock.
  await previous;

  try {
    // Headers are computed at dispatch time, not enqueue time, so the
    // timestamp window is fresh even after queueing behind a slow save.
    const headers = {
      ...init?.headers,
      ...(await tokenHeaders()),
    };

    return await window.fetch(input, { ...init, headers });
  } finally {
    release();
  }
}
