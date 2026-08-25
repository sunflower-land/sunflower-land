const initSession = jest.fn();
const clearSession = jest.fn();
const computeToken = jest.fn(
  (sessionId: string, timestamp: number, counter: number) =>
    `tok-${sessionId}-${timestamp}-${counter}`,
);
let secretSet = false;

// esbuild-runner does not hoist jest.mock, so register the mock explicitly
// before requiring the module under test.
jest.doMock("./loader", () => ({
  loadWasm: () =>
    Promise.resolve({
      initSession: (secret: Uint8Array) => {
        secretSet = true;
        initSession(secret);
      },
      clearSession: () => {
        secretSet = false;
        clearSession();
      },
      hasSession: () => secretSet,
      computeToken,
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

const SECRET_HEX = "00ff10a5" + "00".repeat(28); // 32 bytes

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

  it("sends no token headers when no secret was issued", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: undefined });
    await secureFetch("https://api.test/autosave/1", { method: "POST" });

    expect(requestTokensActive()).toBe(false);
    expect(sentHeaders(0)["X-Token"]).toBeUndefined();
    expect(sentHeaders(0)["X-Counter"]).toBeUndefined();
  });

  it("passes the decoded secret bytes into the module", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    const bytes = initSession.mock.calls[0][0] as Uint8Array;
    expect(Array.from(bytes.slice(0, 4))).toEqual([0x00, 0xff, 0x10, 0xa5]);
    expect(bytes).toHaveLength(32);
    expect(requestTokensActive()).toBe(true);
  });

  it("degrades to plain fetch on a malformed secret", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: "not-hex!" });
    await secureFetch("https://api.test/autosave/1", { method: "POST" });

    expect(requestTokensActive()).toBe(false);
    expect(sentHeaders(0)["X-Token"]).toBeUndefined();
  });

  it("attaches token headers with an incrementing counter", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    await secureFetch("https://api.test/autosave/1", { method: "POST" });
    await secureFetch("https://api.test/event/1", { method: "POST" });

    expect(sentHeaders(0)["X-Counter"]).toBe("1");
    expect(sentHeaders(1)["X-Counter"]).toBe("2");
    expect(sentHeaders(0)["X-Token"]).toBe(
      `tok-s1-${sentHeaders(0)["X-Timestamp"]}-1`,
    );

    const timestamp = Number(sentHeaders(0)["X-Timestamp"]);
    expect(timestamp % 5).toBe(0);
    expect(Math.abs(timestamp - Date.now() / 1000)).toBeLessThan(10);
  });

  it("keeps existing headers when attaching token headers", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    await secureFetch("https://api.test/autosave/1", {
      method: "POST",
      headers: { Authorization: "Bearer jwt" },
    });

    expect(sentHeaders(0)["Authorization"]).toBe("Bearer jwt");
    expect(sentHeaders(0)["X-Token"]).toBeDefined();
  });

  it("resets the counter on a new session", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });
    await secureFetch("https://api.test/event/1", { method: "POST" });

    await initRequestTokens({ sessionId: "s2", sessionSecret: SECRET_HEX });
    await secureFetch("https://api.test/event/1", { method: "POST" });

    expect(sentHeaders(1)["X-Counter"]).toBe("1");
    expect(sentHeaders(1)["X-Token"]).toContain("tok-s2-");
  });

  it("dispatches concurrent requests one at a time, in counter order", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    const resolvers: Array<() => void> = [];
    fetchMock.mockImplementation(
      () =>
        new Promise((res) => {
          resolvers.push(() => res({ ok: true }));
        }),
    );

    const first = secureFetch("https://api.test/autosave/1", {
      method: "POST",
    });
    const second = secureFetch("https://api.test/event/1", { method: "POST" });

    // Let pending async work settle: only the first request may have
    // dispatched (token computation is async, so a macrotask tick is
    // needed rather than a couple of bare microtask flushes).
    await new Promise((res) => setTimeout(res, 0));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolvers[0]();
    await first;
    // Second dispatches only after the first response settled.
    await new Promise((res) => setTimeout(res, 0));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentHeaders(0)["X-Counter"]).toBe("1");
    expect(sentHeaders(1)["X-Counter"]).toBe("2");

    resolvers[1]();
    await second;
  });

  it("releases the queue when a request rejects", async () => {
    await initRequestTokens({ sessionId: "s1", sessionSecret: SECRET_HEX });

    fetchMock.mockRejectedValueOnce(new Error("network down"));

    await expect(
      secureFetch("https://api.test/autosave/1", { method: "POST" }),
    ).rejects.toThrow("network down");

    fetchMock.mockResolvedValueOnce({ ok: true });
    const response = await secureFetch("https://api.test/event/1", {
      method: "POST",
    });
    expect(response.ok).toBe(true);
    expect(sentHeaders(1)["X-Counter"]).toBe("2");
  });
});
