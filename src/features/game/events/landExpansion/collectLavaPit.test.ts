import { INITIAL_FARM } from "features/game/lib/constants";
import { collectLavaPit } from "./collectLavaPit";
import Decimal from "decimal.js-light";

describe("collectLavaPit", () => {
  const now = Date.now();

  it("requires a lava pit", () => {
    expect(() =>
      collectLavaPit({
        state: INITIAL_FARM,
        action: { type: "lavaPit.collected", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit not found");
  });

  it("requires lava pit to be started", () => {
    expect(() =>
      collectLavaPit({
        state: {
          ...INITIAL_FARM,
          lavaPits: {
            1: { x: 0, y: 0, width: 2, height: 2, createdAt: 0 },
          },
        },
        action: { type: "lavaPit.collected", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit not started");
  });

  it("collects the lava pit", () => {
    const result = collectLavaPit({
      state: {
        ...INITIAL_FARM,
        lavaPits: {
          1: { x: 0, y: 0, width: 2, height: 2, startedAt: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.collected", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].startedAt).toBe(undefined);
    expect(result.lavaPits[1].collectedAt).toBe(now);
  });

  it("requires the lava pit was started 72 hours ago", () => {
    expect(() =>
      collectLavaPit({
        state: {
          ...INITIAL_FARM,
          lavaPits: {
            1: {
              x: 0,
              y: 0,
              width: 2,
              height: 2,
              startedAt: now,
              createdAt: 0,
            },
          },
        },
        action: { type: "lavaPit.collected", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit still active");
  });

  it("gives an obsidian", () => {
    const result = collectLavaPit({
      state: {
        ...INITIAL_FARM,
        lavaPits: {
          1: { x: 0, y: 0, width: 2, height: 2, startedAt: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.collected", id: "1" },
      createdAt: now,
    });

    expect(result.inventory.Obsidian).toEqual(new Decimal(1));
  });
});
