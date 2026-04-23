import Decimal from "decimal.js-light";
import { collectWaterTrap } from "./collectWaterTrap";
import { GameState } from "features/game/types/game";
import { INITIAL_FARM } from "features/game/lib/constants";
import { InventoryItemName } from "features/game/types/game";
import { CrustaceanName } from "features/game/types/crustaceans";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";

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
        farmId: 1,
        state: GAME_STATE,
        action: {
          type: "waterTrap.collected",
          trapId,
        },
        createdAt,
      }),
    ).toThrow("No water trap placed at this spot");
  });

  it("rejects collection when trap is not ready yet", () => {
    expect(() =>
      collectWaterTrap({
        farmId: 1,
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
                  caught: { Isopod: 1 },
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
    ).toThrow("Trap is not ready to collect yet");
  });

  it("collects items from a picked up trap", () => {
    const caught: Partial<Record<InventoryItemName, number>> = {
      Crab: 8,
    };

    const state = collectWaterTrap({
      farmId: 1,
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
      farmId: 1,
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
      farmId: 1,
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
                caught: { "Blue Crab": 1 },
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

  it("gives extra crustaceans if the player has Crab House placed", () => {
    const caught: Partial<Record<CrustaceanName, number>> = {
      Barnacle: 1,
    };

    const state = collectWaterTrap({
      farmId: 1,
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
        collectibles: {
          "Crab House": [
            {
              id: "crab-house-1",
              createdAt,
              readyAt: createdAt,
              coordinates: {
                x: 0,
                y: 0,
              },
            },
          ],
        },
      },
      action: {
        type: "waterTrap.collected",
        trapId,
      },
      createdAt,
    });

    // Without Crab House: 1, With Crab House: 1 + 2 = 3
    expect(state.inventory.Barnacle).toEqual(new Decimal(3));
  });

  it("grants +1 crustacean on 20% prng chance when 'Pistol Shrimp' wearable is active", () => {
    // Arrange the trap/caught state
    const caught: Partial<Record<CrustaceanName, number>> = {
      Barnacle: 1,
    };

    let counter = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (
        prngChance({
          farmId: 1,
          itemId: KNOWN_IDS.Barnacle,
          counter,
          chance: 20,
          criticalHitName: "Pistol Shrimp",
        })
      ) {
        break;
      }
      counter++;
    }

    const state = collectWaterTrap({
      farmId: 1,
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
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin?.equipped,
            tool: "Pistol Shrimp",
          },
        },
        farmActivity: {
          "Barnacle Caught": 1,
        },
      },
      action: {
        type: "waterTrap.collected",
        trapId,
      },
      createdAt,
    });

    // Expect original amount +1 thanks to Pistol Shrimp crit
    expect(state.inventory.Barnacle).toEqual(new Decimal(2));
  });
});
