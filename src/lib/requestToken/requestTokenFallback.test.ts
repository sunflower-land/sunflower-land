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

const SESSION_CODE = nodeCrypto.randomBytes(32).toString("hex");
const EXPIRES_AT = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
const session = {
  sessionCode: SESSION_CODE,
  sessionCodeExpiresAt: EXPIRES_AT,
};

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
    await initRequestTokens(session);

    expect(requestTokensActive()).toBe(true);
  });

  it("produces the same token the server (and WASM module) would compute", async () => {
    await initRequestTokens(session);

    await secureFetch("https://api.test/autosave/1", { method: "POST" });

    const headers = sentHeaders();
    expect(headers["X-Expires"]).toBe(String(EXPIRES_AT));

    const expected = nodeCrypto
      .createHmac("sha256", SESSION_CODE)
      .update(`${headers["X-Timestamp"]}`)
      .digest("hex");

    expect(headers["X-Token"]).toBe(expected);
  });

  it("stays inactive when even WebCrypto is unavailable", async () => {
    Object.defineProperty(globalThis, "crypto", {
      value: {},
      configurable: true,
    });

    clearRequestTokens();
    await initRequestTokens(session);

    expect(requestTokensActive()).toBe(false);

    await secureFetch("https://api.test/autosave/1", { method: "POST" });
    expect(sentHeaders()["X-Token"]).toBeUndefined();

    Object.defineProperty(globalThis, "crypto", {
      value: nodeCrypto.webcrypto,
      configurable: true,
    });
  });
});
