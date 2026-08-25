/**
 * Loads and instantiates the request-token WASM module. Kept separate from
 * index.ts so tests can mock the loader — `import.meta.url` and .wasm
 * instantiation don't work under jest.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type WasmModule = typeof import("./wasm/request_token");

/**
 * What the token layer needs from an implementation. Satisfied by the WASM
 * module (sync) and by the WebCrypto fallback (async) — callers must await
 * both initSession and computeToken.
 */
export type TokenModule = {
  initSession(secret: Uint8Array): void | Promise<void>;
  clearSession(): void;
  hasSession(): boolean;
  computeToken(
    sessionId: string,
    timestamp: number,
    counter: number,
  ): string | Promise<string>;
};

let loaded: Promise<WasmModule> | undefined;

export function loadWasm(): Promise<WasmModule> {
  loaded ??= (async () => {
    const module = await import("./wasm/request_token");
    await module.default({
      module_or_path: new URL("./wasm/request_token_bg.wasm", import.meta.url),
    });
    return module;
  })();

  return loaded;
}
