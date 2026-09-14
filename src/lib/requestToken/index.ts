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
 *
 * The code itself lives 24h. A tab left open longer than that used to sign
 * with a dead code until the player reloaded — one lost autosave each, for
 * a few hundred accounts a day. Now the layer refreshes it through
 * `POST /session-code` (JWT-gated, no farm load) shortly before it runs
 * out, and if the API still answers RT-001 for a code that has aged out,
 * refreshes once and replays the request once. Expiry is judged in server
 * time — the `/session` response carries it — because some players' clocks
 * are hours out and a code that is fresh by the device clock can be long
 * dead by ours.
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

/**
 * How close to expiry (server time) a code may get before a protected
 * request refreshes it. An hour is far more than the refresh takes and far
 * less than the code's life, and it also absorbs whatever is left of a
 * clock offset the `/session` timing did not measure exactly.
 */
const SESSION_CODE_REFRESH_MARGIN_S = 60 * 60;
/**
 * How long to leave a refresh alone after one completes, or fails. After a
 * success this is the loop guard: a device whose clock says the brand-new
 * code is already stale must not refresh on every request. After a failure
 * it is plain backoff — the old code is usually still good, and the
 * request has gone out with it regardless.
 */
const SESSION_CODE_REFRESH_INTERVAL_MS = 60_000;

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
 * What a refresh needs: where the API is, and a JWT to present. The JWT on
 * the request being signed is preferred (it is the caller's current one);
 * this is the fallback from `/session`.
 */
let apiUrl: string | undefined;
let authToken: string | undefined;
/**
 * Server clock minus device clock, measured from the `/session` response
 * time. Codes expire in server time, and enough players' clocks are hours
 * out that judging expiry by the device alone refreshes far too early for
 * some and far too late for others.
 */
let clockOffsetMs = 0;
/**
 * The code's lifetime as observed at `/session` (expiry minus issue time).
 * Lets a refresh re-measure the clock offset from its own response — the
 * refresh endpoint returns only the code and its expiry, and the issue time
 * is the expiry minus this.
 */
let codeTtlSeconds: number | undefined;
/** The in-flight refresh, shared by every request that arrives during it. */
let refreshInFlight: Promise<boolean> | undefined;
/** When the next refresh may start. */
let refreshAfter = 0;
/** Set when the API answered 404: an older deployment without the route. */
let refreshUnsupported = false;
/**
 * Bumped on every `/session` and logout. A refresh that started under one
 * session must not install its code over the next one's.
 */
let sessionGeneration = 0;

/**
 * Whether a `/session` handshake is on its way. Set by the game as soon as
 * it boots (see expectRequestTokens); until the handshake lands, a
 * protected request waits for it rather than racing it. Without the flag
 * — a surface that never loads a game session — nothing is waited for.
 */
let sessionExpected = false;
/** True once `initRequestTokens` has completed for the first time. */
let initialised = false;
let resolveFirstInit!: () => void;
/** Settles on the first completed `initRequestTokens`, signed or not. */
const firstInit = new Promise<void>((resolve) => {
  resolveFirstInit = resolve;
});
const initListeners = new Set<() => void>();
/**
 * How long a request will wait for the first handshake before going out
 * unsigned anyway. A cold load is `/session` plus the signer, a few
 * seconds on a decent connection and a good deal more on a poor one; the
 * wait ends the moment the handshake does, so the cap only ever bites
 * when the session never comes.
 */
const FIRST_SESSION_WAIT_MS = 30_000;

/**
 * Tell the layer a game session is about to be loaded, so protected
 * requests that fire before `/session` completes wait for it instead of
 * going out as `unsigned:not-initialised` and being rejected.
 *
 * Called from `startGame` — at render time, before any child of the game
 * provider can run an effect. The marketplace under `/world` mounts in the
 * same commit as the game and fetches from a layout effect, which runs
 * before the effect that starts the game machine: the request is already
 * on its way before `loadSession` has even been called. Hence a flag set
 * at construction, not one set by the session load itself.
 */
export function expectRequestTokens(): void {
  sessionExpected = true;
}

/**
 * Whether the layer has been handed the outcome of a session load —
 * signed, unsigned because the API issued no code, or a signer that
 * failed. "Not yet" is the one state a protected request should not be
 * made in, and the one this answers.
 */
export function requestTokensInitialised(): boolean {
  return initialised;
}

/**
 * Subscribe to the first initialisation; returns the unsubscribe. Shaped
 * for `useSyncExternalStore`, alongside requestTokensInitialised.
 */
export function subscribeRequestTokens(listener: () => void): () => void {
  initListeners.add(listener);

  return () => {
    initListeners.delete(listener);
  };
}

/**
 * Initialise the token layer from the `/session` response. Safe to call on
 * every session start — a fresh session replaces the code.
 */
export async function initRequestTokens(params: {
  sessionCode?: string;
  sessionCodeExpiresAt?: number;
  /** Base URL of the API, for refreshing the code via `POST /session-code`. */
  apiUrl?: string;
  /** The JWT the session was loaded with, as the refresh fallback. */
  token?: string;
  /**
   * When the API produced this response, in ms (the `/session` `startedAt`).
   * Anchors expiry checks to the server clock rather than the device's.
   */
  serverTime?: number;
}): Promise<void> {
  // A fresh session is a fresh start: whatever the last one spent on
  // retries, this one gets the full budget.
  retries = 0;
  retryAfter = 0;
  refreshAfter = 0;
  sessionGeneration += 1;
  apiUrl = params.apiUrl ?? apiUrl;
  authToken = params.token ?? authToken;
  initInFlight = init(params);
  await initInFlight;

  if (!initialised) {
    initialised = true;
    resolveFirstInit();
    initListeners.forEach((listener) => listener());
  }
}

async function init(params: {
  sessionCode?: string;
  sessionCodeExpiresAt?: number;
  serverTime?: number;
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

  if (params.serverTime !== undefined && Number.isFinite(params.serverTime)) {
    clockOffsetMs = params.serverTime - Date.now();
    codeTtlSeconds =
      params.sessionCodeExpiresAt - Math.floor(params.serverTime / 1000);
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
  authToken = undefined;
  refreshAfter = 0;
  sessionGeneration += 1;
}

/** Now, on the server's clock, in unix seconds. */
function serverNowSeconds(): number {
  return Math.floor((Date.now() + clockOffsetMs) / 1000);
}

/**
 * Whether the current code is close enough to expiry to refresh, or past
 * it. Judged in server time; see clockOffsetMs.
 */
function codeNearExpiry(): boolean {
  return (
    expiresAt !== undefined &&
    expiresAt - serverNowSeconds() <= SESSION_CODE_REFRESH_MARGIN_S
  );
}

/** The `Authorization` header off a request, whatever shape it came in. */
function bearerOf(headers: HeadersInit | undefined): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers)
    return headers.get("Authorization") ?? undefined;

  const entries = Array.isArray(headers) ? headers : Object.entries(headers);
  const match = entries.find(([key]) => key.toLowerCase() === "authorization");

  return match?.[1];
}

/**
 * Starts a session-code refresh if one is possible and due, and returns it.
 * Everything up to storing the attempt is synchronous, so concurrent
 * requests share one refresh rather than each starting their own.
 *
 * Nothing to refresh without a signer holding a code, an API to ask, or a
 * JWT to ask with; and not again within the interval, nor ever against an
 * API that answered 404.
 */
function beginSessionCodeRefresh(
  init?: RequestInit,
): Promise<boolean> | undefined {
  if (refreshInFlight) return refreshInFlight;

  const token = bearerOf(init?.headers) ?? authToken;
  if (
    !signer ||
    !lastSession ||
    !apiUrl ||
    !token ||
    refreshUnsupported ||
    Date.now() < refreshAfter
  ) {
    return undefined;
  }

  refreshAfter = Date.now() + SESSION_CODE_REFRESH_INTERVAL_MS;

  const attempt = refreshSessionCode(
    `${apiUrl}/session-code`,
    token,
    sessionGeneration,
  ).finally(() => {
    if (refreshInFlight === attempt) refreshInFlight = undefined;
  });
  refreshInFlight = attempt;

  return attempt;
}

/**
 * Asks the API for a fresh code and installs it. Resolves true when the
 * signer now holds the new code, false for any failure — and it never
 * rejects: a refresh that could not happen (offline, an expired JWT, an
 * older API) leaves the request to go out as it would have anyway.
 *
 * Plain `fetch`, not `fetchWithRetry`: a request is waiting on this, and
 * the interval above is all the backoff a once-a-day call needs.
 */
async function refreshSessionCode(
  url: string,
  token: string,
  generation: number,
): Promise<boolean> {
  try {
    const response = await globalThis.fetch(url, {
      method: "POST",
      headers: {
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        accept: "application/json",
      },
    });

    if (response.status === 404) {
      // Feature detection: the API predates the route. Stop asking.
      refreshUnsupported = true;
      return false;
    }
    if (!response.ok) return false;

    const body = (await response.json()) as {
      sessionCode?: unknown;
      sessionCodeExpiresAt?: unknown;
    };
    const { sessionCode, sessionCodeExpiresAt } = body ?? {};
    if (
      typeof sessionCode !== "string" ||
      !sessionCode ||
      typeof sessionCodeExpiresAt !== "number" ||
      !Number.isInteger(sessionCodeExpiresAt)
    ) {
      return false;
    }

    // A new /session (or a logout) happened while this was in flight; its
    // code wins, and this one must not be installed over it.
    if (generation !== sessionGeneration || !signer) return false;

    signer.initSession(sessionCode);
    lastSession = { sessionCode, sessionCodeExpiresAt };
    expiresAt = sessionCodeExpiresAt;
    state = "ready";

    // The response carries no timestamp, but the code's lifetime is known
    // from /session, so its issue time — server now — is expiry minus that.
    if (codeTtlSeconds !== undefined) {
      clockOffsetMs =
        (sessionCodeExpiresAt - codeTtlSeconds) * 1000 - Date.now();
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Whether a response is the API rejecting the request token. The body is
 * read from a clone so the caller can still consume the original.
 */
async function isRequestTokenRejection(response: Response): Promise<boolean> {
  if (response.status !== 403 || typeof response.clone !== "function") {
    return false;
  }

  try {
    const body = (await response.clone().json()) as { errorCode?: unknown };

    return body?.errorCode === "RT-001";
  } catch {
    return false;
  }
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
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T | undefined> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<undefined>((resolve) => {
      timer = setTimeout(() => resolve(undefined), ms);
    }),
  ]);
}

/**
 * Give the signer its chance before a request goes out.
 *
 * Three cases. The game has booted but `/session` has not landed yet —
 * wait for it, bounded: the marketplace under `/world` mounts before the
 * game has loaded, and its reads used to go out `unsigned:not-initialised`
 * and be rejected, six or more per visit. The cold load of the signer is
 * still running — wait for it rather than racing it. Or a previous load
 * failed for a reason that may no longer be true: those get a bounded
 * number of lazy retries, so a page session that began behind a blocker
 * or on a dropped connection can start signing without the player
 * reloading the game.
 *
 * Either way this settles: a request is never failed, and never held
 * beyond its bound, because the token layer could not sort itself out.
 */
async function ensureSigner(init?: RequestInit): Promise<void> {
  if (requestTokensActive()) {
    // Signing, but the code is running out. Refresh it — once, shared —
    // and wait briefly so this request can carry the new code if the
    // refresh is quick. If not, the old code is still good for a while
    // and the request goes with that.
    if (codeNearExpiry()) {
      const refresh = beginSessionCodeRefresh(init);
      if (refresh) await withTimeout(refresh, SIGNER_RETRY_WAIT_MS);
    }
    return;
  }

  // The handshake is coming but has not been called yet. Wait for it to
  // complete — signer and all — rather than racing it. Only when a game is
  // booting: a surface that never loads a session has nothing to wait for.
  if (!initInFlight && state === "not-initialised" && sessionExpected) {
    await withTimeout(firstInit, FIRST_SESSION_WAIT_MS);
  }

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

  // Wait on a signer that is still loading, retry one that failed for a
  // reason that might have passed, and refresh a code that is about to
  // expire. Never blocks for long, and never throws: a request that cannot
  // be signed still goes, with the sentinel.
  await ensureSigner(init);

  const send = () =>
    fetchWithRetry(
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

  const response = await send();

  // The API turned the token away and our code has aged out: the refresh
  // above was too late (a tab asleep for a day, a clock we mis-measured),
  // or it never happened. Refresh once and replay once with fresh headers.
  // Never more: a second RT-001 is something other than expiry, and it is
  // the caller's to handle.
  if (codeNearExpiry() && (await isRequestTokenRejection(response))) {
    const refreshed = await (refreshInFlight ?? beginSessionCodeRefresh(init));
    if (refreshed) return send();
  }

  return response;
}
