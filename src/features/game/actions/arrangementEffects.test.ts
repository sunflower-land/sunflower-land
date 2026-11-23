import { commitArrangement, ARRANGEMENT_CONFLICT } from "./arrangementEffects";
import { flushPendingActions } from "./layoutEffects";
import { postEffect, createEffectError } from "./effect";
import { createErrorLogger } from "lib/errorLogger";
import { createApiError } from "lib/apiError";
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

const makeService = () =>
  ({
    getSnapshot: () => ({
      value: "landscaping",
      context: {
        farmId: FARM_ID,
        rawToken: "token",
        state: INITIAL_FARM,
        landscapingLocation: "farm",
        actions: [{}, {}],
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
