import {
  buildErrorReport,
  createErrorLogger,
  isNetworkError,
} from "./errorLogger";

describe("buildErrorReport", () => {
  it("sends the legacy modal shape as a code + transaction id", () => {
    const r = buildErrorReport("react_error_modal", 1, {
      error: "EF-001",
      transactionId: "sadiq3n",
      stack: "x",
    });
    expect(r.code).toBe("EF-001");
    expect(r.transactionId).toBe("sadiq3n");
    expect(r.error).toMatchObject({ code: "EF-001", stack: "x" });
    expect(r.error.message).toBeUndefined();
  });

  it("keeps free-text errors as the message", () => {
    const r = buildErrorReport("react_error_modal", 1, {
      error: "Failed to fetch",
    });
    expect(r.code).toBeUndefined();
    expect(r.error.message).toBe("Failed to fetch");
  });

  it("serialises real errors and plain strings", () => {
    const e = buildErrorReport("phaser_base_scene", 2, new TypeError("boom"));
    expect(e.error).toMatchObject({ name: "TypeError", message: "boom" });
    expect(e.error.stack).toContain("boom");
    expect(
      buildErrorReport("phaser_preloader_scene", 2, "SESSION_EXPIRED").code,
    ).toBe("SESSION_EXPIRED");
    expect(
      buildErrorReport("phaser_preloader_scene", 2, "File load error").error
        .message,
    ).toBe("File load error");
  });

  it("passes endpoint/status/errorId through for API failures", () => {
    const r = buildErrorReport("react_error_modal", 3, {
      code: "AS-001",
      endpoint: "POST /autosave",
      status: 500,
      transactionId: "t1",
      errorId: "e1",
      meta: { screen: "plaza" },
    });
    expect(r).toMatchObject({
      source: "react_error_modal",
      farmId: 3,
      code: "AS-001",
      endpoint: "POST /autosave",
      status: 500,
      transactionId: "t1",
      errorId: "e1",
      meta: { screen: "plaza" },
    });
  });
});

describe("isNetworkError", () => {
  it("recognises browser fetch failures in every shape the logger accepts", () => {
    expect(isNetworkError(new TypeError("Failed to fetch"))).toBe(true);
    expect(isNetworkError("Failed to fetch")).toBe(true);
    expect(isNetworkError({ error: "Failed to fetch" })).toBe(true);
    expect(isNetworkError({ message: "Load failed" })).toBe(true);
    expect(
      isNetworkError("NetworkError when attempting to fetch resource."),
    ).toBe(true);
  });

  it("does not match real errors", () => {
    expect(isNetworkError("EF-001")).toBe(false);
    expect(isNetworkError(new Error("Failed to fetch liquidity data"))).toBe(
      false,
    );
    expect(isNetworkError({ error: "ALREADY_BOUGHT" })).toBe(false);
    expect(isNetworkError(undefined)).toBe(false);
  });
});

describe("createErrorLogger", () => {
  const fetchMock = jest.fn().mockResolvedValue({ ok: true });
  const originalFetch = global.fetch;

  beforeEach(() => {
    fetchMock.mockClear();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("does not report expected backend rejections such as trading errors", async () => {
    const log = createErrorLogger("react_error_modal", 1);
    await log({ error: "ALREADY_BOUGHT", transactionId: "t-already" });
    await log({ error: "TRADE_NOT_FOUND", transactionId: "t-notfound" });
    await log("INSUFFICIENT_FLOWER");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not report network failures", async () => {
    const log = createErrorLogger("react_error_modal", 1);
    await log({ error: "Failed to fetch", transactionId: "t-fetch" });
    await log(new TypeError("Load failed"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still reports unexpected errors", async () => {
    const log = createErrorLogger("react_error_modal", 1);
    await log({ error: "EF-001", transactionId: "t-ef001-unique" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.code).toBe("EF-001");
  });
});
