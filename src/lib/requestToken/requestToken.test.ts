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

  it("still identifies itself when no code was issued", async () => {
    await initRequestTokens({});
    await secureFetch("https://api.test/marketplace");

    expect(requestTokensActive()).toBe(false);
    // Never silent: an absent X-Token must only ever mean "not our client".
    expect(sentHeaders(0)["X-Token"]).toBe("unsigned:no-session-code");
    expect(sentHeaders(0)["X-Timestamp"]).toBeUndefined();
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

  it("marks requests as logged out rather than sending nothing", async () => {
    await initRequestTokens(session);
    clearRequestTokens();

    await secureFetch("https://api.test/marketplace");

    expect(requestTokensActive()).toBe(false);
    expect(sentHeaders(0)["X-Token"]).toBe("unsigned:logged-out");
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

  it("still sends the request, flagged so the API can count these players", async () => {
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
    // Not silence: the API logs this as `incompatible-wasm` rather than
    // lumping it in with unsigned scripts, and the suffix says why so the
    // "never arrived" and "would not run" cases can be told apart.
    expect(headers["X-Token"]).toMatch(/^incompatible_wasm:/);
    expect(headers["X-Token"]).toContain(tokens.UNSUPPORTED_SIGNER_TOKEN);
    expect(headers["X-Timestamp"]).toBeUndefined();
  });

  it("distinguishes no-code-issued from a browser that failed", async () => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () => Promise.reject(new Error("offline")),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    // No code means the API never offered one — that is not this
    // browser failing, so it must not be reported as one.
    await tokens.initRequestTokens({});
    await tokens.secureFetch("https://api.test/marketplace");

    const headers = (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
    expect(headers["X-Token"]).toBe("unsigned:no-session-code");
    expect(headers["X-Token"]).not.toContain("incompatible_wasm");
  });
});

describe("requestToken signer load failures", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  /** Boots the layer against a loader that rejects with `rejection`, fires
   * one protected request, and returns the headers it went out with. */
  const headersAfterLoadFailure = async (rejection: unknown) => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () => Promise.reject(rejection),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    await tokens.initRequestTokens(session);
    await tokens.secureFetch("https://api.test/autosave/1", { method: "POST" });

    return (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
  };

  it("classifies a network failure so the API can see the cause", async () => {
    const headers = await headersAfterLoadFailure(
      new Error("Failed to fetch dynamically imported module"),
    );

    expect(headers["X-Token"]).toBe("incompatible_wasm:import-failed");
  });

  it("classifies a CSP rejection as csp-blocked, not wasm-unavailable", async () => {
    // Chrome's CSP error mentions "WebAssembly" too — the CSP match must
    // win, or every corporate proxy injecting CSP looks like a browser
    // that cannot run wasm.
    const headers = await headersAfterLoadFailure(
      new Error(
        "WebAssembly.instantiate(): Refused to compile or instantiate " +
          "WebAssembly module because 'unsafe-eval' is not an allowed " +
          "source of script in the following Content Security Policy " +
          "directive: \"script-src 'self'\"",
      ),
    );

    expect(headers["X-Token"]).toBe("incompatible_wasm:csp-blocked");
  });

  it("recognises WebKit's import failure message", async () => {
    // Safari/CriOS say this when the glue import is blocked; it used to
    // fall through to "unknown".
    const headers = await headersAfterLoadFailure(
      new TypeError("Importing a module script failed."),
    );

    expect(headers["X-Token"]).toBe("incompatible_wasm:import-failed");
  });

  it("tells a blocked glue import from a failed wasm fetch by stage", async () => {
    // Identical engine message, different loader stage (SignerLoadError
    // shape) — the classification must differ.
    const glue = await headersAfterLoadFailure({
      stage: "import",
      cause: new TypeError("Failed to fetch"),
    });
    expect(glue["X-Token"]).toBe("incompatible_wasm:import-failed");

    jest.resetModules();
    fetchMock.mockClear();

    const wasm = await headersAfterLoadFailure({
      stage: "init",
      cause: new TypeError("Failed to fetch"),
    });
    expect(wasm["X-Token"]).toBe("incompatible_wasm:fetch-failed");
  });

  it("classifies a wrong MIME type on the wasm response", async () => {
    // The .wasm URL answered with HTML — a block page or rewritten 404.
    const headers = await headersAfterLoadFailure({
      stage: "init",
      cause: new TypeError(
        "Failed to execute 'compile' on 'WebAssembly': Incorrect " +
          "response MIME type. Expected 'application/wasm'.",
      ),
    });

    expect(headers["X-Token"]).toBe("incompatible_wasm:bad-mime");
  });

  it("keeps the stage and error type when nothing else matches", async () => {
    const headers = await headersAfterLoadFailure({
      stage: "init",
      cause: new TypeError("something this classifier has never seen"),
    });

    // Not a flat "unknown": the stage and the error name go with it.
    expect(headers["X-Token"]).toBe("incompatible_wasm:init-unknown-typeerror");
  });

  it("sends the raw engine error as X-Token-Detail, sanitised", async () => {
    const headers = await headersAfterLoadFailure({
      stage: "init",
      cause: new TypeError("naïve\nfailure"),
    });

    // Printable ASCII only — the header must survive any proxy — with the
    // stage and error name preserved for the rejection log.
    expect(headers["X-Token-Detail"]).toBe("[init] TypeError: na ve failure");
  });

  it("never sends X-Token-Detail when the layer is merely unsigned", async () => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () => Promise.resolve({}),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    await tokens.initRequestTokens({});
    await tokens.secureFetch("https://api.test/marketplace");

    const headers = (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
    expect(headers["X-Token"]).toBe("unsigned:no-session-code");
    expect(headers["X-Token-Detail"]).toBeUndefined();
  });

  it("flags a signer that traps at sign time instead of failing the request", async () => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () =>
        Promise.resolve({
          initSession: () => undefined,
          clearSession: () => undefined,
          hasSession: () => true,
          signRequest: () => {
            const trap = new Error("unreachable");
            trap.name = "RuntimeError";
            throw trap;
          },
        }),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    await tokens.initRequestTokens(session);
    // The signer loaded fine and only fails when asked to sign — the
    // request must still go out, flagged, rather than throwing.
    await tokens.secureFetch("https://api.test/autosave/1", { method: "POST" });

    const headers = (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
    expect(headers["X-Token"]).toBe(
      "incompatible_wasm:sign-unknown-runtimeerror",
    );
    expect(headers["X-Token-Detail"]).toBe("RuntimeError: unreachable");
    expect(headers["X-Timestamp"]).toBeUndefined();
  });

  it("retries the load on the next session rather than staying broken", async () => {
    let attempts = 0;
    jest.doMock("./loader", () => ({
      loadTokenModule: () => {
        attempts += 1;
        return Promise.reject(new Error("offline"));
      },
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    await tokens.initRequestTokens(session);
    await tokens.initRequestTokens(session);

    // A transient failure must not permanently disable the layer.
    expect(attempts).toBe(2);
  });
});

describe("requestToken retrying a failed signer load", () => {
  let fetchMock: jest.Mock;
  let now: number;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
    // The retry is gated on a minimum interval, so the clock has to move.
    now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const sentHeaders = (call: number) =>
    (fetchMock.mock.calls[call][1]?.headers ?? {}) as Record<string, string>;

  /** Past the cooldown, whichever attempt we are on. */
  const waitOutBackoff = () => {
    now += 10 * 60 * 1000;
  };

  const bootWithLoader = (loadTokenModule: jest.Mock) => {
    jest.doMock("./loader", () => ({ loadTokenModule }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    return require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
  };

  const save = (tokens: ReturnType<typeof bootWithLoader>) =>
    tokens.secureFetch("https://api.test/autosave/1", { method: "POST" });

  it("recovers from a transient failure and signs from then on", async () => {
    // The 84 accounts this is for: the module never arrived — a blocker, a
    // captive portal, a dropped mobile connection — and the connection is
    // fine again a minute later.
    const loadTokenModule = jest
      .fn()
      .mockRejectedValueOnce({
        stage: "init",
        cause: new TypeError("Failed to fetch"),
      })
      .mockResolvedValue({
        initSession: () => undefined,
        clearSession: () => undefined,
        hasSession: () => true,
        signRequest,
      });

    const tokens = bootWithLoader(loadTokenModule);

    await tokens.initRequestTokens(session);
    await save(tokens);

    // Flagged, and no retry yet: the failure is seconds old, and an
    // autosave must not refetch the module the moment one fails.
    expect(sentHeaders(0)["X-Token"]).toBe("incompatible_wasm:fetch-failed");
    expect(loadTokenModule).toHaveBeenCalledTimes(1);

    waitOutBackoff();
    await save(tokens);

    // Previously every request for the rest of the page's life carried the
    // sentinel; now the session heals itself without a reload.
    expect(loadTokenModule).toHaveBeenCalledTimes(2);
    expect(tokens.requestTokensActive()).toBe(true);
    expect(sentHeaders(1)["X-Token"]).toBe("tok(POST|/autosave/1|0)");
    expect(sentHeaders(1)["X-Expires"]).toBe(String(EXPIRES_AT));
    expect(sentHeaders(1)["X-Token-Detail"]).toBeUndefined();
  });

  it("does not retry a failure this engine will never resolve", async () => {
    const loadTokenModule = jest
      .fn()
      .mockRejectedValue(
        new Error(
          "Refused to compile or instantiate WebAssembly module because " +
            "'unsafe-eval' is not an allowed source of script in the " +
            "following Content Security Policy directive: \"script-src 'self'\"",
        ),
      );

    const tokens = bootWithLoader(loadTokenModule);

    await tokens.initRequestTokens(session);
    for (let i = 0; i < 3; i++) {
      waitOutBackoff();
      await save(tokens);
    }

    // The bytes arrived and the engine refused them. Refetching costs a
    // request on every save and cannot change the answer.
    expect(loadTokenModule).toHaveBeenCalledTimes(1);
    expect(sentHeaders(2)["X-Token"]).toBe("incompatible_wasm:csp-blocked");
  });

  it("shares one attempt across concurrent requests, and stops at the cap", async () => {
    const loadTokenModule = jest
      .fn()
      .mockRejectedValue(new TypeError("Failed to fetch"));

    const tokens = bootWithLoader(loadTokenModule);

    await tokens.initRequestTokens(session);

    // Six rounds of five simultaneous saves, each round well past the
    // backoff. A burst must cost one module fetch between them, not one
    // each — a player on a captive portal is the worst place to spend
    // five.
    for (let round = 0; round < 6; round++) {
      waitOutBackoff();
      await Promise.all(Array.from({ length: 5 }, () => save(tokens)));

      expect(loadTokenModule.mock.calls.length).toBeLessThanOrEqual(round + 2);
    }

    // The cold load plus the retry budget, however long the page lives.
    expect(loadTokenModule).toHaveBeenCalledTimes(4);
    // And every one of those saves still went out, still flagged with the
    // real cause.
    expect(fetchMock).toHaveBeenCalledTimes(30);
    expect(sentHeaders(29)["X-Token"]).toBe("incompatible_wasm:fetch-failed");
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

describe("requestToken before /session has completed", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  it("labels a request that beat the session handshake", async () => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () => Promise.resolve({}),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    // Deep-linking to the marketplace fires a protected read before the
    // game machine has loaded a session. Previously this sent no headers
    // and was indistinguishable server-side from a script.
    await tokens.secureFetch("https://api.test/marketplace");

    const headers = (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
    expect(headers["X-Token"]).toBe("unsigned:not-initialised");
  });
});

describe("requestToken refreshing the session code", () => {
  let fetchMock: jest.Mock;
  let now: number;

  const API_URL = "https://api.test";
  const REFRESH_URL = `${API_URL}/session-code`;
  const JWT = "Bearer request-jwt";
  const NEW_CODE = "c".repeat(64);
  const DAY = 24 * 60 * 60;

  const serverNow = () => Math.floor(now / 1000);

  beforeEach(() => {
    jest.resetModules();
    now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);
    fetchMock = jest.fn();
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const boot = () => {
    jest.doMock("./loader", () => ({
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
    return require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
  };

  /** A session whose code expires `secondsLeft` from now, server time. */
  const startSession = (
    tokens: ReturnType<typeof boot>,
    {
      secondsLeft,
      serverTime = now,
    }: { secondsLeft: number; serverTime?: number },
  ) =>
    tokens.initRequestTokens({
      sessionCode: SESSION_CODE,
      sessionCodeExpiresAt: Math.floor(serverTime / 1000) + secondsLeft,
      apiUrl: API_URL,
      token: "session-jwt",
      serverTime,
    });

  const jsonResponse = (status: number, body: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    clone() {
      return this;
    },
  });

  /** Answers the refresh endpoint with `refresh` and everything else 200. */
  const answerWith = (refresh: () => unknown) =>
    fetchMock.mockImplementation((url: string) =>
      Promise.resolve(
        url === REFRESH_URL ? refresh() : jsonResponse(200, { ok: true }),
      ),
    );

  const freshCode = () =>
    jsonResponse(200, {
      sessionCode: NEW_CODE,
      sessionCodeExpiresAt: serverNow() + DAY,
    });

  const refreshCalls = () =>
    fetchMock.mock.calls.filter(([url]) => url === REFRESH_URL);
  const requestCalls = () =>
    fetchMock.mock.calls.filter(([url]) => url !== REFRESH_URL);
  const headersOf = (call: unknown[]) =>
    ((call[1] as RequestInit | undefined)?.headers ?? {}) as Record<
      string,
      string
    >;

  const save = (tokens: ReturnType<typeof boot>) =>
    tokens.secureFetch(`${API_URL}/autosave/1`, {
      method: "POST",
      headers: { Authorization: JWT },
      body: "{}",
    });

  it("refreshes a code that is about to expire, and signs with the new one", async () => {
    const tokens = boot();
    answerWith(freshCode);

    // Half an hour left: inside the refresh margin.
    await startSession(tokens, { secondsLeft: 30 * 60 });
    await save(tokens);

    // One refresh, presented with the JWT off the request being signed,
    // never request-token protected itself (the caller's code is expired
    // by definition on the API side).
    expect(refreshCalls()).toHaveLength(1);
    const [, refreshInit] = refreshCalls()[0] as [string, RequestInit];
    expect(refreshInit.method).toBe("POST");
    expect(headersOf(refreshCalls()[0])["Authorization"]).toBe(JWT);
    expect(headersOf(refreshCalls()[0])["X-Token"]).toBeUndefined();

    // The signer holds the new code, and the request that triggered the
    // refresh already went out with it.
    expect(initSession).toHaveBeenLastCalledWith(NEW_CODE);
    expect(requestCalls()).toHaveLength(1);
    expect(headersOf(requestCalls()[0])["X-Expires"]).toBe(
      String(serverNow() + DAY),
    );

    // And the next one, with no further refresh.
    await save(tokens);
    expect(refreshCalls()).toHaveLength(1);
    expect(headersOf(requestCalls()[1])["X-Expires"]).toBe(
      String(serverNow() + DAY),
    );
  });

  it("leaves a code with plenty of life alone", async () => {
    const tokens = boot();
    answerWith(freshCode);

    await startSession(tokens, { secondsLeft: DAY });
    await save(tokens);

    expect(refreshCalls()).toHaveLength(0);
  });

  it("shares one refresh across a burst of requests", async () => {
    const tokens = boot();
    let release!: () => void;
    const slow = new Promise<void>((res) => (release = res));
    answerWith(() => slow.then(freshCode));

    await startSession(tokens, { secondsLeft: 30 * 60 });

    const burst = Promise.all(Array.from({ length: 5 }, () => save(tokens)));
    await new Promise((res) => setTimeout(res, 0));
    release();
    await burst;

    expect(refreshCalls()).toHaveLength(1);
    expect(requestCalls()).toHaveLength(5);
    for (const call of requestCalls()) {
      expect(headersOf(call)["X-Expires"]).toBe(String(serverNow() + DAY));
    }
  });

  it("refreshes once and replays once when the API rejects an expired code", async () => {
    jest.useFakeTimers({ now });
    try {
      const tokens = boot();
      await startSession(tokens, { secondsLeft: DAY });

      // A tab asleep for a day: the code aged out without a request going
      // through, and the refresh is slow enough that the request gives up
      // waiting for it and goes out with the old code.
      now += (DAY + 60) * 1000;
      jest.setSystemTime(now);
      let releaseRefresh!: () => void;
      const slowRefresh = new Promise<void>((res) => (releaseRefresh = res));
      let rejections = 0;
      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url === REFRESH_URL) return slowRefresh.then(freshCode);

        const expires = Number(headersOf([url, init])["X-Expires"]);
        if (expires < serverNow()) {
          rejections += 1;
          return Promise.resolve(jsonResponse(403, { errorCode: "RT-001" }));
        }
        return Promise.resolve(jsonResponse(200, { ok: true }));
      });

      const saving = save(tokens);
      await jest.advanceTimersByTimeAsync(2_500);
      releaseRefresh();
      const response = await saving;

      // Rejected once with the dead code, refreshed once (the same refresh
      // the proactive path started — not a second one), replayed once with
      // the new code, and the caller sees the replay's answer.
      expect(response.status).toBe(200);
      expect(rejections).toBe(1);
      expect(refreshCalls()).toHaveLength(1);
      expect(requestCalls()).toHaveLength(2);
      expect(headersOf(requestCalls()[1])["X-Expires"]).toBe(
        String(serverNow() + DAY),
      );
      expect(initSession).toHaveBeenLastCalledWith(NEW_CODE);
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not refresh or replay on a rejection of a fresh code", async () => {
    const tokens = boot();
    answerWith(freshCode);
    fetchMock.mockImplementation((url: string) =>
      Promise.resolve(
        url === REFRESH_URL
          ? freshCode()
          : jsonResponse(403, { errorCode: "RT-001" }),
      ),
    );

    await startSession(tokens, { secondsLeft: DAY });
    const response = await save(tokens);

    // Something other than expiry — the caller's to handle. No refresh, no
    // replay, and the original response comes back untouched.
    expect(response.status).toBe(403);
    expect(refreshCalls()).toHaveLength(0);
    expect(requestCalls()).toHaveLength(1);
  });

  it("still sends the request when the refresh fails, and backs off", async () => {
    const tokens = boot();
    answerWith(() => jsonResponse(500, {}));

    await startSession(tokens, { secondsLeft: 30 * 60 });
    const response = await save(tokens);

    // The old code is still good; the request went out with it.
    expect(response.status).toBe(200);
    expect(requestCalls()).toHaveLength(1);
    expect(headersOf(requestCalls()[0])["X-Expires"]).toBe(
      String(serverNow() + 30 * 60),
    );
    expect(refreshCalls()).toHaveLength(1);

    // Not again straight away: a refresh that just failed is not retried
    // on the very next request.
    await save(tokens);
    expect(refreshCalls()).toHaveLength(1);

    now += 2 * 60 * 1000;
    await save(tokens);
    expect(refreshCalls()).toHaveLength(2);
  });

  it("still sends the request when the refresh throws", async () => {
    const tokens = boot();
    fetchMock.mockImplementation((url: string) =>
      url === REFRESH_URL
        ? Promise.reject(new TypeError("Failed to fetch"))
        : Promise.resolve(jsonResponse(200, { ok: true })),
    );

    await startSession(tokens, { secondsLeft: 30 * 60 });
    const response = await save(tokens);

    expect(response.status).toBe(200);
    expect(requestCalls()).toHaveLength(1);
  });

  it("stops asking an API that does not have the route", async () => {
    const tokens = boot();
    answerWith(() => jsonResponse(404, {}));

    await startSession(tokens, { secondsLeft: 30 * 60 });
    await save(tokens);
    now += 10 * 60 * 1000;
    await save(tokens);

    // Feature-detected once, then never again this page session.
    expect(refreshCalls()).toHaveLength(1);
    expect(requestCalls()).toHaveLength(2);
  });

  it("judges expiry by the server's clock, not the device's", async () => {
    const tokens = boot();
    answerWith(freshCode);

    // The device clock is five hours behind the server. The code has half
    // an hour left in server time — five and a half by this device.
    const serverTime = now + 5 * 60 * 60 * 1000;
    await startSession(tokens, { secondsLeft: 30 * 60, serverTime });
    await save(tokens);

    expect(refreshCalls()).toHaveLength(1);
    expect(initSession).toHaveBeenLastCalledWith(NEW_CODE);
  });

  it("does not install a refreshed code over a newer session's", async () => {
    const tokens = boot();
    let release!: () => void;
    const slow = new Promise<void>((res) => (release = res));
    answerWith(() => slow.then(freshCode));

    await startSession(tokens, { secondsLeft: 30 * 60 });
    const saving = save(tokens);
    await new Promise((res) => setTimeout(res, 0));

    // A new /session lands while the refresh is in flight.
    const newer = "d".repeat(64);
    await tokens.initRequestTokens({
      sessionCode: newer,
      sessionCodeExpiresAt: serverNow() + DAY,
      apiUrl: API_URL,
      token: "session-jwt",
      serverTime: now,
    });
    release();
    await saving;

    expect(initSession).toHaveBeenLastCalledWith(newer);
  });
});

describe("requestToken when a session is expected but has not started", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const boot = () => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () =>
        Promise.resolve({
          initSession: () => undefined,
          clearSession: () => undefined,
          hasSession: () => true,
          signRequest,
        }),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    return require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
  };

  const headers = (call: number) =>
    (fetchMock.mock.calls[call][1]?.headers ?? {}) as Record<string, string>;

  it("holds a request made before /session, and signs it once the handshake lands", async () => {
    const tokens = boot();

    // The game has booted (the marketplace under /world mounts in the same
    // commit) but loadSession has not even been called yet — the 377
    // accounts a day whose marketplace reads went out unsigned.
    tokens.expectRequestTokens();
    const inFlight = tokens.secureFetch("https://api.test/marketplace");

    await new Promise((res) => setTimeout(res, 20));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(tokens.requestTokensInitialised()).toBe(false);

    await tokens.initRequestTokens(session);
    await inFlight;

    expect(tokens.requestTokensInitialised()).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(headers(0)["X-Token"]).toBe("tok(GET|/marketplace|0)");
  });

  it("releases every waiting request on the one handshake", async () => {
    const tokens = boot();
    tokens.expectRequestTokens();

    const burst = Promise.all(
      Array.from({ length: 6 }, () =>
        tokens.secureFetch("https://api.test/marketplace"),
      ),
    );
    await new Promise((res) => setTimeout(res, 0));
    expect(fetchMock).not.toHaveBeenCalled();

    await tokens.initRequestTokens(session);
    await burst;

    expect(fetchMock).toHaveBeenCalledTimes(6);
    for (let i = 0; i < 6; i++) {
      expect(headers(i)["X-Token"]).toBe("tok(GET|/marketplace|0)");
    }
  });

  it("gives up waiting and sends unsigned if the session never comes", async () => {
    jest.useFakeTimers();
    const tokens = boot();
    tokens.expectRequestTokens();

    const inFlight = tokens.secureFetch("https://api.test/marketplace");
    await jest.advanceTimersByTimeAsync(29_000);
    expect(fetchMock).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(2_000);
    await inFlight;

    // Still labelled honestly, and still sent: the layer never fails a
    // request, and the API's answer is the caller's to handle.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(headers(0)["X-Token"]).toBe("unsigned:not-initialised");
  });

  it("does not wait when no session is expected", async () => {
    const tokens = boot();

    // A surface that never loads a game session has nothing to wait for.
    await tokens.secureFetch("https://api.test/marketplace");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(headers(0)["X-Token"]).toBe("unsigned:not-initialised");
  });

  it("notifies subscribers exactly once, on the first handshake", async () => {
    const tokens = boot();
    const listener = jest.fn();
    const unsubscribe = tokens.subscribeRequestTokens(listener);

    // Whatever the handshake produced — a code, or none — the layer now
    // has an answer, and that is what a gated fetch waits for.
    await tokens.initRequestTokens({});
    expect(listener).toHaveBeenCalledTimes(1);
    expect(tokens.requestTokensInitialised()).toBe(true);

    await tokens.initRequestTokens(session);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
  });
});

describe("requestToken classifying delivery failures", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
  });

  const headersAfterLoadFailure = async (rejection: unknown) => {
    jest.doMock("./loader", () => ({
      loadTokenModule: () => Promise.reject(rejection),
    }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    const tokens = require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

    await tokens.initRequestTokens(session);
    await tokens.secureFetch("https://api.test/autosave/1", { method: "POST" });

    return (fetchMock.mock.calls[0][1]?.headers ?? {}) as Record<
      string,
      string
    >;
  };

  // The exact strings from production, 24h to 2026-09-14. All of them are
  // the network dropping mid-download; all of them used to be classified
  // as wasm-unavailable and never retried.
  it.each([
    "WebAssembly compilation aborted: Network error: error",
    "WebAssembly compilation aborted: Network error: Response body loading was aborted",
  ])("treats %j as a fetch failure, not an engine one", async (message) => {
    const headers = await headersAfterLoadFailure({
      stage: "init",
      cause: new TypeError(message),
    });

    expect(headers["X-Token"]).toBe("incompatible_wasm:fetch-failed");
  });

  it("treats a 5xx from the wasm origin as a fetch failure", async () => {
    const headers = await headersAfterLoadFailure({
      stage: "init",
      cause: new Error(
        "failed to fetch Wasm: 522 fetching 'https://sunflower-land.com/wasm/request_token_bg.wasm'",
      ),
    });

    expect(headers["X-Token"]).toBe("incompatible_wasm:fetch-failed");
  });

  it("still keeps a CSP rejection that mentions WebAssembly out of the fetch bucket", async () => {
    const headers = await headersAfterLoadFailure({
      stage: "init",
      cause: new Error(
        "WebAssembly.instantiate(): Refused to compile or instantiate WebAssembly module because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive",
      ),
    });

    expect(headers["X-Token"]).toBe("incompatible_wasm:csp-blocked");
  });

  it("reports which attempt the load failed on", async () => {
    const headers = await headersAfterLoadFailure({
      stage: "init",
      attempt: 3,
      cause: new TypeError("Failed to fetch"),
    });

    // `[init#3]` against `[init#1]` in the API logs is how we will know
    // whether the in-load retries are buying anything.
    expect(headers["X-Token-Detail"]).toBe(
      "[init#3] TypeError: Failed to fetch",
    );
    expect(headers["X-Token-Detail"].length).toBeLessThanOrEqual(256);
  });
});

describe("requestToken retrying when the connection returns", () => {
  let fetchMock: jest.Mock;
  let now: number;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (window as unknown as { fetch: unknown }).fetch = fetchMock;
    now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const bootWithLoader = (loadTokenModule: jest.Mock) => {
    jest.doMock("./loader", () => ({ loadTokenModule }));

    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
    return require("./index") as typeof import("./index");
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
  };

  const headers = (call: number) =>
    (fetchMock.mock.calls[call][1]?.headers ?? {}) as Record<string, string>;

  const goOnline = async () => {
    window.dispatchEvent(new Event("online"));
    await new Promise((res) => setTimeout(res, 0));
  };

  it("retries a delivery failure as soon as the browser comes back online", async () => {
    const loadTokenModule = jest
      .fn()
      .mockRejectedValueOnce({
        stage: "import",
        attempt: 3,
        cause: new TypeError("Failed to fetch"),
      })
      .mockResolvedValue({
        initSession: () => undefined,
        clearSession: () => undefined,
        hasSession: () => true,
        signRequest,
      });

    const tokens = bootWithLoader(loadTokenModule);
    await tokens.initRequestTokens(session);
    expect(loadTokenModule).toHaveBeenCalledTimes(1);

    // Seconds later, not the half minute the backoff would wait: the event
    // is the signal the backoff was only guessing at.
    await goOnline();

    expect(loadTokenModule).toHaveBeenCalledTimes(2);
    expect(tokens.requestTokensActive()).toBe(true);

    await tokens.secureFetch("https://api.test/autosave/1", { method: "POST" });
    expect(headers(0)["X-Token"]).toBe("tok(POST|/autosave/1|0)");
  });

  it("retries on reconnect even after the lazy budget is spent", async () => {
    const loadTokenModule = jest.fn().mockRejectedValue({
      stage: "init",
      cause: new TypeError("Failed to fetch"),
    });

    const tokens = bootWithLoader(loadTokenModule);
    await tokens.initRequestTokens(session);
    for (let i = 0; i < 3; i++) {
      now += 10 * 60 * 1000;
      await tokens.secureFetch("https://api.test/autosave/1", {
        method: "POST",
      });
    }
    // Cold load plus three lazy retries, all while offline.
    expect(loadTokenModule).toHaveBeenCalledTimes(4);

    loadTokenModule.mockResolvedValue({
      initSession: () => undefined,
      clearSession: () => undefined,
      hasSession: () => true,
      signRequest,
    });
    await goOnline();

    // Retries spent offline were never going to succeed; the reconnect
    // is the one moment worth spending another.
    expect(loadTokenModule).toHaveBeenCalledTimes(5);
    expect(tokens.requestTokensActive()).toBe(true);
  });

  it("shares the reconnect attempt with a request that arrives during it", async () => {
    let release!: () => void;
    const slow = new Promise<void>((res) => (release = res));
    const loadTokenModule = jest
      .fn()
      .mockRejectedValueOnce({
        stage: "import",
        cause: new TypeError("Failed to fetch"),
      })
      .mockImplementation(async () => {
        await slow;
        return {
          initSession: () => undefined,
          clearSession: () => undefined,
          hasSession: () => true,
          signRequest,
        };
      });

    const tokens = bootWithLoader(loadTokenModule);
    await tokens.initRequestTokens(session);
    await goOnline();

    const saving = tokens.secureFetch("https://api.test/autosave/1", {
      method: "POST",
    });
    await new Promise((res) => setTimeout(res, 0));
    release();
    await saving;

    expect(loadTokenModule).toHaveBeenCalledTimes(2);
    expect(headers(0)["X-Token"]).toBe("tok(POST|/autosave/1|0)");
  });

  it("does not retry an engine failure on reconnect", async () => {
    const compile = new Error("WebAssembly.instantiate(): expected magic word");
    compile.name = "CompileError";
    const loadTokenModule = jest
      .fn()
      .mockRejectedValue({ stage: "init", cause: compile });

    const tokens = bootWithLoader(loadTokenModule);
    await tokens.initRequestTokens(session);
    await goOnline();

    expect(loadTokenModule).toHaveBeenCalledTimes(1);
  });
});
