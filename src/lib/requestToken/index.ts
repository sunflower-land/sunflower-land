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
 *
 * A load that failed because the module never arrived — a blocker, a
 * captive portal, a mobile connection that dropped — is retried lazily on
 * a later request rather than written off for the whole page session (see
 * ensureSigner). A load that failed because the engine will not run wasm
 * is not: that answer does not change before the next reload.
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

/**
 * Failure codes worth trying again inside the same page session.
 *
 * Only the ones where nothing about the engine is wrong and the module
 * simply never arrived: an ad-blocker or DNS filter, a captive portal, a
 * mobile connection that dropped mid-fetch. Every one of those can be true
 * when `/session` completes and false a minute later.
 *
 * `compile-failed`, `link-failed`, `wasm-unavailable`, `no-wasm-global`,
 * `bad-mime` and `csp-blocked` are deliberately excluded: the bytes
 * arrived and this engine will not run them, so refetching is pure waste
 * on exactly the devices least able to afford it. So is `sign-*` — there
 * the module loaded and traps when used, which reloading does not fix.
 */
function isTransientFailure(code: string): boolean {
  if (code === "fetch-failed" || code === "import-failed") return true;

  // Unmatched failures keep their stage and error type
  // (`init-unknown-typeerror`). A fetch failing in wording the classifier
  // has not seen still surfaces as a TypeError or a NetworkError, so treat
  // those as network-ish; any other unknown is left alone.
  return /^(?:(?:import|init)-)?unknown(?:-(?:typeerror|networkerror))?$/.test(
    code,
  );
}

/**
 * How hard the layer tries to recover a transient load failure without a
 * reload: a handful of attempts, the first no sooner than the interval
 * below and each subsequent one twice as far out. The bound is the point —
 * a player behind a captive portal must not refetch the module on every
 * autosave.
 */
const MAX_SIGNER_RETRIES = 3;
const SIGNER_RETRY_INTERVAL_MS = 30_000;
/**
 * How long a request will wait on a retry before going out with the
 * sentinel anyway. The attempt carries on in the background and a later
 * request picks up its result; this one is not held behind a module fetch
 * on the sort of connection that failed it in the first place.
 */
const SIGNER_RETRY_WAIT_MS = 2_000;

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
 * The session the layer was last given a code for. Kept because the code
 * itself goes into the signer and is not stored anywhere else — on the
 * failure path there is no signer, so without this there would be nothing
 * to re-initialise with.
 */
let lastSession:
  | { sessionCode: string; sessionCodeExpiresAt: number }
  | undefined;
/** Retries spent since the last `/session`, and when the next may run. */
let retries = 0;
let retryAfter = 0;
/** The in-flight retry, shared by every request that arrives during it. */
let retryInFlight: Promise<void> | undefined;

/**
 * Initialise the token layer from the `/session` response. Safe to call on
 * every session start — a fresh session replaces the code.
 */
export async function initRequestTokens(params: {
  sessionCode?: string;
  sessionCodeExpiresAt?: number;
}): Promise<void> {
  // A fresh session is a fresh start: whatever the last one spent on
  // retries, this one gets the full budget.
  retries = 0;
  retryAfter = 0;
  initInFlight = init(params);
  return initInFlight;
}

async function init(params: {
  sessionCode?: string;
  sessionCodeExpiresAt?: number;
}): Promise<void> {
  if (!params.sessionCode || !params.sessionCodeExpiresAt) {
    signer?.clearSession();
    lastSession = undefined;
    expiresAt = undefined;
    state = "no-session-code";
    signerFailure = "";
    signerFailureDetail = "";
    return;
  }

  lastSession = {
    sessionCode: params.sessionCode,
    sessionCodeExpiresAt: params.sessionCodeExpiresAt,
  };

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
    // Arm the next lazy retry (see ensureSigner), but not immediately: the
    // failure has only just happened and the next protected request is
    // often milliseconds away.
    retryAfter = Date.now() + SIGNER_RETRY_INTERVAL_MS * 2 ** retries;
  }
}

/** Forget the session code (logout). */
export function clearRequestTokens() {
  signer?.clearSession();
  lastSession = undefined;
  expiresAt = undefined;
  state = "logged-out";
  signerFailure = "";
  signerFailureDetail = "";
  retries = 0;
  retryAfter = 0;
}

export function requestTokensActive(): boolean {
  return !!expiresAt && !!signer?.hasSession();
}

/**
 * What this client would put in `X-Token` right now — "ready",
 * "unsigned:not-initialised", "incompatible_wasm:csp-blocked", …
 *
 * Attached to API failure reports. Without it a protected endpoint
 * rejecting a player whose signer never loaded is indistinguishable from a
 * server fault, and the browsers where the signer fails (third-party
 * mobile WebViews especially) are exactly the ones we hear about second-hand.
 */
export function requestTokenDiagnostics(): string {
  return requestTokensActive() ? "ready" : sentinelHeaders()["X-Token"];
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
 * Starts a signer retry if one is due, and returns it. Everything up to
 * storing the attempt is synchronous, so concurrent requests share one
 * attempt rather than each starting their own.
 */
function beginSignerRetry(): Promise<void> | undefined {
  if (
    state !== "signer-failed" ||
    !lastSession ||
    !isTransientFailure(signerFailure) ||
    retries >= MAX_SIGNER_RETRIES ||
    Date.now() < retryAfter
  ) {
    return undefined;
  }

  retries += 1;

  // `init` never rejects and rearms `retryAfter` itself if this fails.
  const attempt = init(lastSession).finally(() => {
    if (retryInFlight === attempt) retryInFlight = undefined;
  });
  retryInFlight = attempt;

  return attempt;
}

/** Races `promise` against a timer, cleaning the timer up if it wins. */
function withTimeout(promise: Promise<void>, ms: number): Promise<void> {
  let timer!: ReturnType<typeof setTimeout>;

  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, ms);
    }),
  ]);
}

/**
 * Give the signer its chance before a request goes out.
 *
 * Two cases. The cold load is still running — wait for it rather than
 * racing it. Or a previous load failed for a reason that may no longer be
 * true: those get a bounded number of lazy retries, so a page session that
 * began behind a blocker or on a dropped connection can start signing
 * without the player reloading the game.
 *
 * Either way this settles, and quickly: a request is never failed, and
 * never held for long, because the token layer could not sort itself out.
 */
async function ensureSigner(): Promise<void> {
  if (requestTokensActive()) return;

  // `initRequestTokens` always settles (it swallows its own failures), so
  // this cannot hang. Nothing in flight means nothing to wait for.
  if (initInFlight) await initInFlight;

  // Coordinated with the cold load above, and shared between callers: a
  // burst of autosaves triggers one module fetch between them, not one
  // each.
  const attempt = retryInFlight ?? beginSignerRetry();
  if (attempt) await withTimeout(attempt, SIGNER_RETRY_WAIT_MS);
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

  // Wait on a signer that is still loading, and retry one that failed for
  // a reason that might have passed. Never blocks for long, and never
  // throws: a request that cannot be signed still goes, with the sentinel.
  await ensureSigner();

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
