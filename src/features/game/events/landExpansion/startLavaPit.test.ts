import Decimal from "decimal.js-light";
import { startLavaPit } from "./startLavaPit";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

const TEST_FARM: GameState = {
  ...INITIAL_FARM,
  inventory: {
    ...INITIAL_FARM.inventory,
    Oil: new Decimal(100),
    Cobia: new Decimal(10),
  },
  season: {
    season: "summer",
    startedAt: 0,
  },
};

describe("startLavaPit", () => {
  const now = Date.now();

  it("requires the lava pit to exist", () => {
    expect(() =>
      startLavaPit({
        state: INITIAL_FARM,
        action: { type: "lavaPit.started", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit not found");
  });

  it("requires resources to start", () => {
    expect(() =>
      startLavaPit({
        state: {
          ...TEST_FARM,
          inventory: {},
          lavaPits: {
            1: { x: 0, y: 0, createdAt: 0 },
          },
        },
        action: { type: "lavaPit.started", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Required resource Oil not found");
  });

  it("subtracts the required resources", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        lavaPits: {
          1: { x: 0, y: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.inventory.Oil).toEqual(new Decimal(40));
  });

  it("starts the lava pit", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        lavaPits: { 1: { x: 0, y: 0, createdAt: 0 } },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].startedAt).toBeGreaterThan(0);
  });

  it("does not start the lava pit if it is already started", () => {
    expect(() =>
      startLavaPit({
        state: {
          ...TEST_FARM,
          lavaPits: {
            1: {
              x: 0,
              y: 0,
              startedAt: now,
              createdAt: 0,
            },
          },
        },
        action: { type: "lavaPit.started", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit already started");
  });

  it("unsets the collectedAt", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        lavaPits: {
          1: { x: 0, y: 0, createdAt: 0, collectedAt: 1 },
        },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].collectedAt).toBeUndefined();
  });
});
