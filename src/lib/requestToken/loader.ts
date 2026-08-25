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
import { CONFIG } from "lib/config";

/** Matches the wasm-token module's exports. */
export type TokenModule = {
  initSession(sessionCode: string): void;
  clearSession(): void;
  hasSession(): boolean;
  /** Returns `"{timestamp}:{token}"`. */
  signRequest(method: string, path: string, body: string): string;
};

const baseUrl = (CONFIG.WASM_TOKEN_URL ?? "").replace(/\/$/, "");

let loaded: Promise<TokenModule> | undefined;

export function loadTokenModule(): Promise<TokenModule> {
  loaded ??= (async () => {
    if (!baseUrl) {
      throw new Error("WASM_TOKEN_URL is not configured");
    }

    const dir = `${baseUrl}/wasm`;

    // The glue is an ES module served from the token host; the vite build
    // must not try to resolve it at build time, hence the variable URL.
    const module = await import(/* @vite-ignore */ `${dir}/request_token.js`);

    await module.default({
      module_or_path: `${dir}/request_token_bg.wasm`,
    });

    return module as TokenModule;
  })();

  return loaded;
}
