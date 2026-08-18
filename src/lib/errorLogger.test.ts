import { buildErrorReport } from "./errorLogger";

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
