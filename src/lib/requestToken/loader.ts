/**
 * Loads the request-token signer at runtime.
 *
 * The module is NOT part of this bundle. It is built and deployed from a
 * private repo (workspace/wasm-token) with a client key compiled into it,
 * and fetched from its own host — which is the point: the key is not in
 * this public repo, and it is not in anything we publish here.
 *
 * Kept separate from index.ts so tests can mock it; `import()` of a remote
 * URL and WebAssembly instantiation don't work under jest.
 */
/** Matches the wasm-token module's exports. */
export type TokenModule = {
  initSession(sessionCode: string): void;
  clearSession(): void;
  hasSession(): boolean;
  /** Returns `"{timestamp}:{token}"`. */
  signRequest(method: string, path: string, body: string): string;
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
 * A load failure tagged with the step that produced it. The same error —
 * "Failed to fetch" — means two different things depending on whether it
 * was the glue script that never arrived (blocker, filter, captive portal)
 * or the `.wasm` binary the glue then requests, and the classifier in
 * index.ts cannot tell them apart from the message alone.
 */
export class SignerLoadError extends Error {
  stage: SignerLoadStage;
  cause: unknown;

  constructor(stage: SignerLoadStage, cause: unknown) {
    super(
      `signer ${stage} failed: ${(cause as Error)?.message ?? String(cause)}`,
    );
    this.name = "SignerLoadError";
    this.stage = stage;
    this.cause = cause;
  }
}

let loaded: Promise<TokenModule> | undefined;

export function loadTokenModule(): Promise<TokenModule> {
  // A rejected promise must not be cached: a single flaky fetch on a
  // mobile connection would otherwise leave the signer unavailable for the
  // rest of the page's life, so every request that session goes unsigned.
  loaded ??= (async () => {
    let module;
    try {
      // The glue is an ES module served from the token host; the vite build
      // must not try to resolve it at build time, hence the variable URL.
      module = await import(
        /* @vite-ignore */ `${SIGNER_URL}/request_token.js`
      );
    } catch (e) {
      throw new SignerLoadError("import", e);
    }

    try {
      await module.default({
        module_or_path: `${SIGNER_URL}/request_token_bg.wasm`,
      });
    } catch (e) {
      throw new SignerLoadError("init", e);
    }

    return module as TokenModule;
  })().catch((e) => {
    loaded = undefined;
    throw e;
  });

  return loaded;
}
