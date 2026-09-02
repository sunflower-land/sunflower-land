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
