import { commitArrangement, ARRANGEMENT_CONFLICT } from "./arrangementEffects";
import { flushPendingActions } from "./layoutEffects";
import { postEffect, createEffectError } from "./effect";
import { createErrorLogger } from "lib/errorLogger";
import { createApiError } from "lib/apiError";
import { ERRORS } from "lib/errors";
import type { MachineInterpreter } from "features/game/lib/gameMachine";
import { INITIAL_FARM } from "features/game/lib/constants";

// authMachine transitively imports ESM this repo's jest transform cannot
// parse; only its ART_MODE flag is needed here.
jest.mock("features/auth/lib/authMachine", () => ({ ART_MODE: false }));

jest.mock("./layoutEffects", () => ({
  flushPendingActions: jest.fn(),
}));

jest.mock("./effect", () => ({
  ...jest.requireActual("./effect"),
  postEffect: jest.fn(),
}));

jest.mock("lib/errorLogger", () => ({
  ...jest.requireActual("lib/errorLogger"),
  createErrorLogger: jest.fn(),
}));

const FARM_ID = 123;

const makeService = (errorCode?: string) =>
  ({
    getSnapshot: () => ({
      value: "landscaping",
      context: {
        farmId: FARM_ID,
        rawToken: "token",
        state: INITIAL_FARM,
        landscapingLocation: "farm",
        actions: [{}, {}],
        errorCode,
      },
    }),
    send: jest.fn(),
  }) as unknown as MachineInterpreter;

describe("commitArrangement", () => {
  const report = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createErrorLogger as jest.Mock).mockReturnValue(report);
    (flushPendingActions as jest.Mock).mockResolvedValue(undefined);
  });

  it("reports a failure to sync queued actions before the save", async () => {
    (flushPendingActions as jest.Mock).mockRejectedValue(
      new Error("SAVE_TIMED_OUT"),
    );

    await expect(commitArrangement(makeService())).rejects.toThrow(
      "SAVE_TIMED_OUT",
    );

    expect(postEffect).not.toHaveBeenCalled();
    expect(createErrorLogger).toHaveBeenCalledWith("landscaping_save", FARM_ID);
    expect(report).toHaveBeenCalledTimes(1);
    expect(report.mock.calls[0][0]).toMatchObject({
      message: "Landscaping save failed (flush): SAVE_TIMED_OUT",
      meta: {
        stage: "flush",
        location: "farm",
        pendingActions: 2,
        machineState: '"landscaping"',
      },
    });
  });

  it("reports what made the sync fail", async () => {
    (flushPendingActions as jest.Mock).mockRejectedValue(
      new Error("SAVE_FAILED"),
    );

    await expect(commitArrangement(makeService("AS-001"))).rejects.toThrow(
      "SAVE_FAILED",
    );

    expect(report.mock.calls[0][0]).toMatchObject({
      meta: { stage: "flush", syncCause: "AS-001" },
    });
  });

  it("does not report a sync that failed on a connection problem", async () => {
    (flushPendingActions as jest.Mock).mockRejectedValue(
      new Error("SAVE_FAILED"),
    );

    await expect(
      commitArrangement(makeService("Failed to fetch")),
    ).rejects.toThrow("SAVE_FAILED");

    expect(report).not.toHaveBeenCalled();
  });

  it("reports a sync timeout whatever error the machine last held", async () => {
    (flushPendingActions as jest.Mock).mockRejectedValue(
      new Error("SAVE_TIMED_OUT"),
    );

    await expect(
      commitArrangement(makeService("Failed to fetch")),
    ).rejects.toThrow("SAVE_TIMED_OUT");

    expect(report).toHaveBeenCalledTimes(1);
    expect(report.mock.calls[0][0].meta.syncCause).toBeUndefined();
  });

  it("does not report a sync that failed on an expected outcome", async () => {
    (flushPendingActions as jest.Mock).mockRejectedValue(
      new Error("SAVE_FAILED"),
    );

    await expect(
      commitArrangement(makeService(ERRORS.MULTIPLE_DEVICES_OPEN)),
    ).rejects.toThrow("SAVE_FAILED");

    expect(report).not.toHaveBeenCalled();
  });

  it("reports the surface and queue as they stood before the sync", async () => {
    const context = {
      farmId: FARM_ID,
      rawToken: "token",
      state: INITIAL_FARM,
      landscapingLocation: "level_one" as string | undefined,
      actions: [{}, {}, {}] as unknown[],
      errorCode: undefined as string | undefined,
    };
    const service = {
      getSnapshot: () => ({ value: "error", context }),
      send: jest.fn(),
    } as unknown as MachineInterpreter;

    // A failed sync leaves landscaping: the machine clears both on the way.
    (flushPendingActions as jest.Mock).mockImplementation(async () => {
      context.landscapingLocation = undefined;
      context.actions = [];
      context.errorCode = "AS-001";
      throw new Error("SAVE_FAILED");
    });

    await expect(commitArrangement(service)).rejects.toThrow("SAVE_FAILED");

    expect(report.mock.calls[0][0]).toMatchObject({
      meta: { location: "level_one", pendingActions: 3, syncCause: "AS-001" },
    });
  });

  it("reports a failed save request", async () => {
    (postEffect as jest.Mock).mockRejectedValue(new Error("EF-001"));

    await expect(commitArrangement(makeService())).rejects.toThrow("EF-001");

    expect(report).toHaveBeenCalledTimes(1);
    expect(report.mock.calls[0][0]).toMatchObject({
      code: "EF-001",
      message: "Landscaping save failed (post): EF-001",
      meta: { stage: "post" },
    });
  });

  it("passes on the request details of a failed save request", async () => {
    (postEffect as jest.Mock).mockRejectedValue(
      createApiError({
        code: "EF-001",
        status: 500,
        endpoint: "POST /event",
        transactionId: "tx-1",
      }),
    );

    await expect(commitArrangement(makeService())).rejects.toThrow("EF-001");

    expect(report.mock.calls[0][0]).toMatchObject({
      code: "EF-001",
      status: 500,
      endpoint: "POST /event",
      transactionId: "tx-1",
    });
  });

  it("does not report a conflict", async () => {
    (postEffect as jest.Mock).mockRejectedValue(
      createEffectError(ARRANGEMENT_CONFLICT, { conflicts: [] }),
    );
    const service = makeService();

    await expect(commitArrangement(service)).resolves.toBe(false);

    expect(service.send).toHaveBeenCalledWith({
      type: "ARRANGEMENT_REJECTED",
      conflicts: [],
    });
    expect(report).not.toHaveBeenCalled();
  });

  it("does not report a connection problem", async () => {
    (postEffect as jest.Mock).mockRejectedValue(
      new TypeError("Failed to fetch"),
    );

    await expect(commitArrangement(makeService())).rejects.toThrow(
      "Failed to fetch",
    );

    expect(report).not.toHaveBeenCalled();
  });
});
