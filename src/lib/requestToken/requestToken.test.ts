const initSession = jest.fn();
const clearSession = jest.fn();
const signRequest = jest.fn(
  (method: string, path: string, body: string) =>
    // Stands in for the real signer: "{timestamp}:{token}".
    `1787695409:tok(${method}|${path}|${body.length})`,
);
let codeSet = false;

// esbuild-runner does not hoist jest.mock, so register the mock explicitly
// before requiring the module under test.
jest.doMock("./loader", () => ({
  SIGNER_URL: "https://sunflower-land.com/wasm",
  loadTokenModule: () =>
    Promise.resolve({
      initSession: (code: string) => {
        codeSet = true;
        initSession(code);
      },
      clearSession: () => {
        codeSet = false;
        clearSession();
      },
      hasSession: () => codeSet,
      signRequest,
    }),
}));

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
const {
  clearRequestTokens,
  initRequestTokens,
  requestTokensActive,
  secureFetch,
} = require("./index") as typeof import("./index");
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

const SESSION_CODE = "a".repeat(64);
const EXPIRES_AT = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

const session = { sessionCode: SESSION_CODE, sessionCodeExpiresAt: EXPIRES_AT };

describe("requestToken", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    clearRequestTokens();
    // jsdom doesn't provide window.fetch; install a mock directly.
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  const sentHeaders = (call: number) =>
    (fetchMock.mock.calls[call][1]?.headers ?? {}) as Record<string, string>;

  it("sends no token headers when no code was issued", async () => {
    await initRequestTokens({});
    await secureFetch("https://api.test/marketplace");

    expect(requestTokensActive()).toBe(false);
    expect(sentHeaders(0)["X-Token"]).toBeUndefined();
  });

  it("passes the session code into the signer", async () => {
    await initRequestTokens(session);

    expect(initSession).toHaveBeenCalledWith(SESSION_CODE);
    expect(requestTokensActive()).toBe(true);
  });

  it("attaches token, timestamp and expiry headers", async () => {
    await initRequestTokens(session);

    await secureFetch("https://api.test/autosave/1", {
      method: "POST",
      body: '{"a":1}',
    });

    const headers = sentHeaders(0);
    expect(headers["X-Token"]).toBe("tok(POST|/autosave/1|7)");
    expect(headers["X-Timestamp"]).toBe("1787695409");
    expect(headers["X-Expires"]).toBe(String(EXPIRES_AT));
  });

  it("signs the method, path and body of the actual request", async () => {
    await initRequestTokens(session);

    await secureFetch("https://api.test/marketplace?filters=a,b");

    // GET with no body, and the query string is deliberately not signed.
    expect(signRequest).toHaveBeenLastCalledWith("GET", "/marketplace", "");
  });

  it("keeps existing headers when attaching token headers", async () => {
    await initRequestTokens(session);

    await secureFetch("https://api.test/marketplace", {
      headers: { Authorization: "Bearer jwt" },
    });

    expect(sentHeaders(0)["Authorization"]).toBe("Bearer jwt");
    expect(sentHeaders(0)["X-Token"]).toBeDefined();
  });

  it("signs concurrent requests independently, in any order", async () => {
    await initRequestTokens(session);

    const resolvers: Array<() => void> = [];
    fetchMock.mockImplementation(
      () =>
        new Promise((res) => {
          resolvers.push(() => res({ ok: true }));
        }),
    );

    // No queueing: both dispatch immediately. This is the case a monotonic
    // counter used to reject.
    const first = secureFetch("https://api.test/autosave/1", {
      method: "POST",
    });
    const second = secureFetch("https://api.test/event/1", { method: "POST" });

    await new Promise((res) => setTimeout(res, 0));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentHeaders(0)["X-Token"]).toBeDefined();
    expect(sentHeaders(1)["X-Token"]).toBeDefined();

    // Resolve out of order; neither request depends on the other.
    resolvers[1]();
    resolvers[0]();
    await Promise.all([first, second]);
  });

  it("replaces the code on a new session", async () => {
    await initRequestTokens(session);

    const newCode = "b".repeat(64);
    await initRequestTokens({
      sessionCode: newCode,
      sessionCodeExpiresAt: EXPIRES_AT + 60,
    });

    await secureFetch("https://api.test/marketplace");

    expect(initSession).toHaveBeenLastCalledWith(newCode);
    expect(sentHeaders(0)["X-Expires"]).toBe(String(EXPIRES_AT + 60));
  });

  it("stops attaching headers after logout", async () => {
    await initRequestTokens(session);
    clearRequestTokens();

    await secureFetch("https://api.test/marketplace");

    expect(requestTokensActive()).toBe(false);
    expect(sentHeaders(0)["X-Token"]).toBeUndefined();
  });

  it("propagates a network failure once retries are exhausted", async () => {
    await initRequestTokens(session);

    fetchMock.mockRejectedValue(new Error("network down"));

    await expect(
      secureFetch("https://api.test/autosave/1", undefined, { retries: 0 }),
    ).rejects.toThrow("network down");
  });

  it("retries transient failures, because it wraps fetchWithRetry", async () => {
    await initRequestTokens(session);

    fetchMock.mockRejectedValueOnce(new Error("network down"));

    // The retry replays the same signed request — the token is bound to
    // this exact call and the server's window outlasts the backoff.
    const response = await secureFetch(
      "https://api.test/marketplace",
      undefined,
      {
        retries: 1,
      },
    );

    expect(response).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("requestToken when the signer cannot be loaded", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  it("degrades to plain fetch rather than breaking the game", async () => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () => Promise.reject(new Error("offline")),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    await tokens.initRequestTokens(session);
    await tokens.secureFetch("https://api.test/autosave/1", {
      method: "POST",
    });

    expect(tokens.requestTokensActive()).toBe(false);
    const headers = (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
    expect(headers["X-Token"]).toBeUndefined();
  });
});

describe("requestToken while the signer is still loading", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  it("waits for an in-flight signer load rather than racing it", async () => {
    let releaseLoad!: () => void;
    const slowLoad = new Promise<void>((res) => (releaseLoad = res));

    jest.doMock("./loader", () => ({
      SIGNER_URL: "https://sunflower-land.com/wasm",
      loadTokenModule: async () => {
        await slowLoad;
        return {
          initSession: () => undefined,
          clearSession: () => undefined,
          hasSession: () => true,
          signRequest,
        };
      },
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    // Session starts, signer is still downloading.
    const initing = tokens.initRequestTokens(session);

    // A protected request fires during that window — as marketplace calls
    // do on a cold load. It must wait, not go out unsigned.
    const inFlight = tokens.secureFetch("https://api.test/marketplace");

    await new Promise((res) => setTimeout(res, 0));
    expect(fetchMock).not.toHaveBeenCalled();

    releaseLoad();
    await initing;
    await inFlight;

    const headers = (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
    expect(headers["X-Token"]).toBeDefined();
  });
});
