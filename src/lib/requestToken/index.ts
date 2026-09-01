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
 *
 * A reason code follows the colon (see failureCode), and the raw engine
 * error travels separately in `X-Token-Detail` (see failureDetail) so the
 * API's rejection log can say exactly what happened, not just which bucket.
 */
export const UNSUPPORTED_SIGNER_TOKEN = "incompatible_wasm";

/**
 * Sent as `X-Token` when this client had no code to sign with — the layer
 * had not initialised yet, the API issued no code, or the player logged
 * out. Paired with the state so the API can tell those apart.
 *
 * The point of always sending something is that a request with **no
 * X-Token header at all** then means one of two things only: a caller that
 * is not our client, or a proxy that stripped it. That is a signal worth
 * rejecting on; "the header is absent" previously also covered several
 * ordinary states of our own client.
 */
export const UNSIGNED_TOKEN = "unsigned";

/**
 * Splits a loader error into the stage that threw (when the loader tagged
 * it — see SignerLoadError) and the underlying engine error. Duck-typed
 * rather than instanceof so tests can mock the loader with plain objects.
 */
function unwrap(e: unknown): { stage?: string; cause: unknown } {
  const wrapped = e as { stage?: unknown; cause?: unknown } | undefined;

  return typeof wrapped?.stage === "string" && "cause" in wrapped
    ? { stage: wrapped.stage, cause: wrapped.cause }
    : { cause: e };
}

/**
 * Boils an unknown failure down to a short, header-safe code appended to
 * the sentinel (`incompatible_wasm:csp-blocked`). Without it every one of
 * these looks identical server-side, and "the module would not load" has
 * very different answers depending on whether the fetch never arrived, the
 * bytes would not compile, or the engine refused outright.
 *
 * Ordering matters: Chrome's CSP rejection mentions "WebAssembly" too, so
 * the CSP match must come before the WebAssembly one; likewise a bad MIME
 * type on the .wasm response. The engine's error `name` is folded in
 * because CompileError/LinkError carry the type there, not in the message.
 */
function failureCode(e: unknown): string {
  // Checked before anything else and regardless of what was thrown: the
  // engine has no WebAssembly global at all (iOS Lockdown Mode, hardened
  // Firefox, stripped webviews). A stock desktop browser can never hit
  // this, so any volume of it from modern desktop UAs is a spoofed header.
  if (typeof WebAssembly === "undefined") return "no-wasm-global";

  const { stage, cause } = unwrap(e);
  const error = cause as Error | undefined;
  const text =
    `${error?.name ?? ""} ${error?.message ?? String(cause)}`.toLowerCase();

  if (
    text.includes("content security policy") ||
    text.includes("wasm-eval") ||
    text.includes("unsafe-eval") ||
    text.includes("csp")
  )
    return "csp-blocked";
  // The glue import failing, in each engine's words: Chrome/Firefox say
  // "dynamically imported module", WebKit "Importing a module script
  // failed." — which previously fell through to "unknown".
  if (
    text.includes("dynamically imported module") ||
    text.includes("importing a module script")
  )
    return "import-failed";
  // The .wasm URL answered with something that isn't wasm — a block page,
  // a rewritten 404, a data-saver proxy. The bytes arrived; wrong bytes.
  if (text.includes("mime")) return "bad-mime";
  if (text.includes("compileerror") || text.includes("magic"))
    return "compile-failed";
  if (text.includes("linkerror")) return "link-failed";
  if (
    text.includes("failed to fetch") ||
    text.includes("networkerror") ||
    text.includes("load failed") // WebKit's fetch-failure TypeError
  )
    // Same message, different meaning per stage: the glue script never
    // arrived, or the glue ran and then the .wasm fetch failed.
    return stage === "import" ? "import-failed" : "fetch-failed";
  if (text.includes("webassembly")) return "wasm-unavailable";

  // Unmatched: keep the stage and the error type rather than flattening
  // everything into one "unknown" bucket — those two alone answer most of
  // the mysteries the flat bucket used to hide.
  const name = (error?.name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const code = name && name !== "error" ? `unknown-${name}` : "unknown";

  return stage ? `${stage}-${code}` : code;
}

/**
 * The raw failure flattened for the `X-Token-Detail` header: stage, error
 * name and message, printable ASCII only, capped. The code above is for
 * counting; this is for reading — the rejection log line then shows
 * exactly what the engine said, so a new failure shape never has to be
 * reverse-engineered from an "unknown" tally.
 */
function failureDetail(e: unknown): string {
  const { stage, cause } = unwrap(e);
  const error = cause as Error | undefined;
  const text = `${stage ? `[${stage}] ` : ""}${
    error?.name ? `${error.name}: ` : ""
  }${error?.message ?? String(cause)}`;

  return text
    .replace(/[^\x20-\x7e]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 256);
}

let signer: TokenModule | undefined;
let expiresAt: number | undefined;
/**
 * Why the layer is not signing, when it isn't. Every one of these states
 * still sends an X-Token, so an absent header is never our own client.
 */
type LayerState =
  | "ready"
  | "not-initialised" // /session has not completed yet
  | "no-session-code" // the API issued none
  | "logged-out"
  | "signer-failed";

let state: LayerState = "not-initialised";
/** Short reason code sent alongside the signer-failed sentinel. */
let signerFailure = "";
/** Human-readable failure detail, sent as `X-Token-Detail` when failed. */
let signerFailureDetail = "";
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
    state = "no-session-code";
    signerFailure = "";
    signerFailureDetail = "";
    return;
  }

  try {
    signer ??= await loadTokenModule();

    signer.initSession(params.sessionCode);
    expiresAt = params.sessionCodeExpiresAt;
    state = "ready";
    signerFailure = "";
    signerFailureDetail = "";
  } catch (e) {
    // Never let token setup take the game down — the request still goes,
    // flagged so the API can count who this is happening to, and why.
    expiresAt = undefined;
    state = "signer-failed";
    signerFailure = failureCode(e);
    signerFailureDetail = failureDetail(e);
  }
}

/** Forget the session code (logout). */
export function clearRequestTokens() {
  signer?.clearSession();
  expiresAt = undefined;
  state = "logged-out";
  signerFailure = "";
  signerFailureDetail = "";
}

export function requestTokensActive(): boolean {
  return !!expiresAt && !!signer?.hasSession();
}

function tokenHeaders(
  url: string,
  init?: RequestInit,
): Record<string, string> | undefined {
  if (!requestTokensActive()) {
    // Always say something. Which sentinel depends on whether the browser
    // could not run the signer, or we simply had nothing to sign with yet.
    return sentinelHeaders();
  }

  const method = (init?.method ?? "GET").toUpperCase();
  // Path only — the server ignores the query string too, so that a proxy
  // re-encoding parameters can never cause a false rejection.
  const path = new URL(url, window.location.origin).pathname;
  const body = typeof init?.body === "string" ? init.body : "";

  let signed: string;
  try {
    // The signer stamps the time itself; we only say what request it signs.
    signed = (signer as TokenModule).signRequest(method, path, body);
  } catch (e) {
    // A signer that loaded but traps at sign time (a wasm RuntimeError)
    // must not take the request down with it — same contract as a signer
    // that never loaded: flag it, send the request anyway, and let the
    // next session retry the module.
    expiresAt = undefined;
    state = "signer-failed";
    signerFailure = `sign-${failureCode(e)}`;
    signerFailureDetail = failureDetail(e);
    return sentinelHeaders();
  }

  const [timestamp, token] = signed.split(":");

  return {
    "X-Token": token,
    "X-Timestamp": timestamp,
    "X-Expires": String(expiresAt),
  };
}

/**
 * The not-signing headers. Alongside the sentinel, a signer failure also
 * carries the raw engine error in `X-Token-Detail` — the reason code is
 * for counting, the detail line is for diagnosing, and a scripted caller
 * spoofing the sentinel rarely bothers to fake a plausible engine message.
 */
function sentinelHeaders(): Record<string, string> {
  if (state !== "signer-failed") {
    return { "X-Token": `${UNSIGNED_TOKEN}:${state}` };
  }

  return {
    "X-Token": `${UNSUPPORTED_SIGNER_TOKEN}:${signerFailure || "unknown"}`,
    ...(signerFailureDetail ? { "X-Token-Detail": signerFailureDetail } : {}),
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
