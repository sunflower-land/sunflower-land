import Decimal from "decimal.js-light";
import { collectWaterTrap } from "./collectWaterTrap";
import { GameState } from "features/game/types/game";
import { INITIAL_FARM } from "features/game/lib/constants";
import { InventoryItemName } from "features/game/types/game";

const trapId = "1";
const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  crabTraps: {
    trapSpots: {
      [trapId]: {
        x: 0,
        y: 0,
      },
    },
  },
};

describe("collectWaterTrap", () => {
  const createdAt = Date.now();

  it("requires a water trap to be placed", () => {
    expect(() =>
      collectWaterTrap({
        state: GAME_STATE,
        action: {
          type: "waterTrap.collected",
          trapId,
        },
        createdAt,
      }),
    ).toThrow("No water trap placed at this spot");
  });

  it("requires the trap to have been picked up (caught field exists)", () => {
    expect(() =>
      collectWaterTrap({
        state: {
          ...GAME_STATE,
          crabTraps: {
            trapSpots: {
              [trapId]: {
                x: 0,
                y: 0,
                waterTrap: {
                  type: "Crab Pot",
                  placedAt: createdAt - 1000,
                  readyAt: createdAt + 4 * 60 * 60 * 1000,
                },
              },
            },
          },
        },
        action: {
          type: "waterTrap.collected",
          trapId,
        },
        createdAt,
      }),
    ).toThrow("Trap has not been picked up yet");
  });

  it("collects items from a picked up trap", () => {
    const caught: Partial<Record<InventoryItemName, number>> = {
      Crab: 8,
    };

    const state = collectWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: {},
        crabTraps: {
          trapSpots: {
            [trapId]: {
              x: 0,
              y: 0,
              waterTrap: {
                type: "Crab Pot",
                placedAt: createdAt - 1000,
                readyAt: createdAt - 1000,
                caught,
              },
            },
          },
        },
      },
      action: {
        type: "waterTrap.collected",
        trapId,
      },
      createdAt,
    });

    expect(state.inventory.Crab).toEqual(new Decimal(8));
    expect(state.crabTraps.trapSpots?.[trapId]?.waterTrap).toBeUndefined();
    expect(state.farmActivity["Crab Caught"]).toBe(8);
  });

  it("tracks farm activity for each caught item", () => {
    const caught: Partial<Record<InventoryItemName, number>> = {
      Crab: 10,
      "Sea Bass": 5,
      Tuna: 1,
    };

    const state = collectWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: {},
        crabTraps: {
          trapSpots: {
            [trapId]: {
              x: 0,
              y: 0,
              waterTrap: {
                type: "Mariner Pot",
                placedAt: createdAt - 1000,
                readyAt: createdAt - 1000,
                caught,
              },
            },
          },
        },
      },
      action: {
        type: "waterTrap.collected",
        trapId,
      },
      createdAt,
    });

    expect(state.farmActivity["Crab Caught"]).toBe(10);
    expect(state.farmActivity["Sea Bass Caught"]).toBe(5);
    expect(state.farmActivity["Tuna Caught"]).toBe(1);
  });

  it("removes the water trap after collection", () => {
    const caught: Partial<Record<InventoryItemName, number>> = {
      Crab: 8,
    };

    const state = collectWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: {},
        crabTraps: {
          trapSpots: {
            [trapId]: {
              x: 0,
              y: 0,
              waterTrap: {
                type: "Crab Pot",
                placedAt: createdAt - 1000,
                readyAt: createdAt - 1000,
                caught,
              },
            },
            "other-trap": {
              x: 0,
              y: 0,
              waterTrap: {
                type: "Crab Pot",
                placedAt: createdAt - 1000,
                readyAt: createdAt - 1000,
                caught: { Crab: 1 },
              },
            },
          },
        },
      },
      action: {
        type: "waterTrap.collected",
        trapId,
      },
      createdAt,
    });

    expect(state.crabTraps.trapSpots?.[trapId]?.waterTrap).toBeUndefined();
    expect(state.crabTraps.trapSpots?.["other-trap"]?.waterTrap).toBeDefined();
  });
});
