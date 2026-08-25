/**
 * The WebCrypto fallback path: when the WASM module can't load (old engine,
 * webview, CSP), tokens must still be computed — and be byte-identical to
 * what the WASM module and the server produce.
 */
import nodeCrypto from "crypto";
import { TextEncoder } from "util";

// jsdom provides neither crypto.subtle nor TextEncoder — install Node's
// implementations (browsers have had both since 2017).
Object.defineProperty(globalThis, "crypto", {
  value: nodeCrypto.webcrypto,
  configurable: true,
});
Object.assign(globalThis, { TextEncoder });

// The WASM loader fails in this environment — exactly the scenario the
// fallback exists for. (esbuild-runner does not hoist jest.mock, so
// register explicitly before requiring the module under test.)
jest.doMock("./loader", () => ({
  loadWasm: () => Promise.reject(new Error("WebAssembly not supported")),
}));

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
const {
  clearRequestTokens,
  initRequestTokens,
  requestTokensActive,
  secureFetch,
} = require("./index") as typeof import("./index");
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

const SECRET_HEX = nodeCrypto.randomBytes(32).toString("hex");

describe("requestToken WebCrypto fallback", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    clearRequestTokens();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  const sentHeaders = () =>
    (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<string, string>;

  it("activates via WebCrypto when the WASM module fails to load", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    expect(requestTokensActive()).toBe(true);
  });

  it("produces the same token the server (and WASM module) would compute", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    await secureFetch("https://api.test/autosave/1", { method: "POST" });

    const headers = sentHeaders();
    expect(headers["X-Counter"]).toBe("1");

    const expected = nodeCrypto
      .createHmac("sha256", Buffer.from(SECRET_HEX, "hex"))
      .update(`s1:${headers["X-Timestamp"]}:1`)
      .digest("hex");

    expect(headers["X-Token"]).toBe(expected);
  });

  it("stays inactive when even WebCrypto is unavailable", async () => {
    Object.defineProperty(globalThis, "crypto", {
      value: {},
      configurable: true,
    });

    clearRequestTokens();
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    expect(requestTokensActive()).toBe(false);

    await secureFetch("https://api.test/autosave/1", { method: "POST" });
    expect(sentHeaders()["X-Token"]).toBeUndefined();

    Object.defineProperty(globalThis, "crypto", {
      value: nodeCrypto.webcrypto,
      configurable: true,
    });
  });
});
