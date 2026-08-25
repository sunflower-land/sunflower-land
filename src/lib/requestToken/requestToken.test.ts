const initSession = jest.fn();
const clearSession = jest.fn();
const computeToken = jest.fn((timestamp: number) => `tok-${timestamp}`);
let codeSet = false;

// esbuild-runner does not hoist jest.mock, so register the mock explicitly
// before requiring the module under test.
jest.doMock("./loader", () => ({
  loadWasm: () =>
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

  it("passes the session code into the module", async () => {
    await initRequestTokens(session);

    expect(initSession).toHaveBeenCalledWith(SESSION_CODE);
    expect(requestTokensActive()).toBe(true);
  });

  it("attaches token, timestamp and expiry headers", async () => {
    await initRequestTokens(session);

    await secureFetch("https://api.test/autosave/1", { method: "POST" });

    const headers = sentHeaders(0);
    const timestamp = Number(headers["X-Timestamp"]);

    expect(headers["X-Token"]).toBe(`tok-${timestamp}`);
    expect(headers["X-Expires"]).toBe(String(EXPIRES_AT));
    expect(Math.abs(timestamp - Date.now() / 1000)).toBeLessThan(5);
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

    // No queueing: both requests dispatch immediately. This is the case
    // that a monotonic counter used to reject.
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

    await new Promise((res) => setTimeout(res, 0));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Both carry a valid, self-contained token — order is irrelevant.
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

  it("propagates fetch rejections unchanged", async () => {
    await initRequestTokens(session);

    fetchMock.mockRejectedValueOnce(new Error("network down"));

    await expect(secureFetch("https://api.test/autosave/1")).rejects.toThrow(
      "network down",
    );
  });
});
