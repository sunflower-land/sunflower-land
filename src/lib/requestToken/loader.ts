/**
 * Loads the request-token signer at runtime.
 *
 * The module is NOT part of this bundle. It is built and deployed from a
 * private repo (workspace/wasm-token) with a client key compiled into it,
 * and fetched from its own host — which is the point: the key is not in
 * this public repo, and it is not in anything we publish here.
 *
 * Two stages, each retried on its own when the failure is one of delivery
 * rather than of the engine:
 *
 *   import  the JS glue, as an ES module. A failed module fetch is
 *           recorded in the browser's module map, and importing the same
 *           URL again rejects at once without touching the network
 *           (verified in Chrome 152; it is what the HTML spec says). So a
 *           retry imports with a cache-busting query — only a retry, so
 *           the first load keeps its HTTP cache.
 *   init    the .wasm bytes, fetched here rather than by the glue, then
 *           handed to it as a buffer. That puts status handling and retry
 *           in our hands (the glue only checks `response.ok`, and its
 *           streaming path surfaces a dropped connection as an engine
 *           error), and it bypasses the glue's `Response` detection, which
 *           on some Android WebViews with a wrapped `fetch` fell through to
 *           `WebAssembly.instantiate(<not a buffer>)`. The module is ~38KB,
 *           so losing streaming compilation costs nothing worth having.
 *
 * Retries here are quick and few — the first protected request is often
 * an autosave, and the lazy retry in index.ts is 30s away. Engine failures
 * (compile, link, CSP, no wasm at all) are not retried at either level.
 *
 * Kept separate from index.ts so tests can mock it; `import()` of a remote
 * URL and WebAssembly instantiation don't work under jest. The network and
 * timer dependencies are injectable for the loader's own tests.
 */
import { failureCode, isTransientFailure } from "./classify";

/** Matches the wasm-token module's exports. */
export type TokenModule = {
  initSession(sessionCode: string): void;
  clearSession(): void;
  hasSession(): boolean;
  /** Returns `"{timestamp}:{token}"`. */
  signRequest(method: string, path: string, body: string): string;
};

/** The glue's default export: wasm-bindgen's `__wbg_init`. */
type TokenGlue = TokenModule & {
  default(options: { module_or_path: ArrayBuffer }): Promise<unknown>;
};

/**
 * Always the deployed module — including in local development, so there is
 * only ever one artifact in play and it is the one production runs.
 *
 * In production this is same-origin with the game (/play, /testnet, /pwa),
 * so nothing extra is needed. From localhost it is cross-origin: the fetch
 * only succeeds if the bucket allows that origin, and if it doesn't the
 * layer simply stays off (see initRequestTokens) — which is harmless while
 * REQUEST_TOKENS_MODE is "log".
 */
export const SIGNER_URL = "https://sunflower-land.com/wasm";

/** Which step of the load threw — the JS glue import, or WASM start-up. */
export type SignerLoadStage = "import" | "init";

/**
 * A load failure tagged with the step that produced it and the attempt it
 * finally failed on. The same error — "Failed to fetch" — means two
 * different things depending on whether it was the glue script that never
 * arrived (blocker, filter, captive portal) or the `.wasm` binary the glue
 * then requests, and the classifier in classify.ts cannot tell them apart
 * from the message alone. The attempt number goes to the API in
 * `X-Token-Detail` (`[init#3] …`) so the logs show whether retrying helps.
 */
export class SignerLoadError extends Error {
  stage: SignerLoadStage;
  /** Attempts made this page session, counting every stage. */
  attempt: number;
  cause: unknown;

  constructor(stage: SignerLoadStage, attempt: number, cause: unknown) {
    super(
      `signer ${stage} failed: ${(cause as Error)?.message ?? String(cause)}`,
    );
    this.name = "SignerLoadError";
    this.stage = stage;
    this.attempt = attempt;
    this.cause = cause;
  }
}

/** What the loader needs from the outside world; swapped out in tests. */
export type LoaderDeps = {
  importModule: (url: string) => Promise<unknown>;
  fetch: (url: string) => Promise<Response>;
  sleep: (ms: number) => Promise<void>;
};

const defaultDeps: LoaderDeps = {
  // The glue is an ES module served from the token host; the vite build
  // must not try to resolve it at build time, hence the variable URL.
  importModule: (url) => import(/* @vite-ignore */ url),
  fetch: (url) => globalThis.fetch(url),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

/**
 * How hard a stage tries before the load is declared failed: the first
 * attempt plus one retry a second later and one more three seconds after
 * that. Enough to ride out a dropped packet or a 5xx from the edge; short
 * enough that the request waiting on the cold load is not held for long.
 */
export const LOAD_ATTEMPTS = 3;
const LOAD_RETRY_DELAYS_MS = [1_000, 3_000];

/**
 * Every attempt at either stage, this page session. Drives the cache-bust
 * on re-imports (any value other than the first is a URL the module map
 * has not seen) and the `#n` in the failure detail.
 */
let attempts = 0;

/**
 * Whether a stage failure is worth trying again straight away. A `.wasm`
 * response with a status is judged on the status: the edge returning 5xx
 * (a 522 has been seen from our own origin) is transient, a 4xx is not.
 * Anything else is judged by the same classification the sentinel
 * carries, so a delivery failure retries and an engine failure does not.
 */
function isRetryable(stage: SignerLoadStage, cause: unknown): boolean {
  const status = (cause as { status?: unknown } | undefined)?.status;
  if (typeof status === "number") return status >= 500 || status === 429;

  return isTransientFailure(failureCode({ stage, cause }));
}

/** Runs one stage, retrying it on delivery failures. */
async function stage<T>(
  name: SignerLoadStage,
  deps: LoaderDeps,
  run: (attempt: number) => Promise<T>,
): Promise<T> {
  for (let i = 0; ; i++) {
    attempts += 1;
    const attempt = attempts;

    try {
      return await run(attempt);
    } catch (cause) {
      if (i >= LOAD_ATTEMPTS - 1 || !isRetryable(name, cause)) {
        throw new SignerLoadError(name, attempt, cause);
      }
      await deps.sleep(
        LOAD_RETRY_DELAYS_MS[Math.min(i, LOAD_RETRY_DELAYS_MS.length - 1)],
      );
    }
  }
}

/**
 * Fetches the wasm bytes. A non-2xx answer is an error carrying the status,
 * in the glue's own words so the log line reads as it always has.
 */
async function fetchWasm(deps: LoaderDeps): Promise<ArrayBuffer> {
  const url = `${SIGNER_URL}/request_token_bg.wasm`;
  const response = await deps.fetch(url);

  if (!response.ok) {
    throw Object.assign(
      new Error(
        `failed to fetch Wasm: ${response.status} ${response.statusText} fetching '${url}'`,
      ),
      { status: response.status },
    );
  }

  return response.arrayBuffer();
}

let loaded: Promise<TokenModule> | undefined;

export function loadTokenModule(
  deps: LoaderDeps = defaultDeps,
): Promise<TokenModule> {
  // A rejected promise must not be cached: a single flaky fetch on a
  // mobile connection would otherwise leave the signer unavailable for the
  // rest of the page's life, so every request that session goes unsigned.
  loaded ??= (async () => {
    const glue = (await stage("import", deps, (attempt) =>
      deps.importModule(
        // The very first attempt this page session keeps the plain URL, and
        // with it the HTTP cache. Any later one — a retry here, or a lazy
        // retry from index.ts after an earlier load failed — must not be a
        // URL the module map has already recorded as failed.
        attempt === 1
          ? `${SIGNER_URL}/request_token.js`
          : `${SIGNER_URL}/request_token.js?attempt=${attempt}`,
      ),
    )) as TokenGlue;

    await stage("init", deps, async () => {
      const bytes = await fetchWasm(deps);
      await glue.default({ module_or_path: bytes });
    });

    return glue;
  })().catch((e) => {
    loaded = undefined;
    throw e;
  });

  return loaded;
}
