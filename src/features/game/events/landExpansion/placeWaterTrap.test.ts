import Decimal from "decimal.js-light";
import { placeWaterTrap } from "./placeWaterTrap";
import { INITIAL_FARM } from "features/game/lib/constants";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { GameState } from "features/game/types/game";

const trapId = "1";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  bumpkin: {
    ...TEST_BUMPKIN,
    experience: 1000000,
  },
  crabTraps: {
    trapSpots: {
      [trapId]: {
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    },
  },
};

describe("placeWaterTrap", () => {
  const createdAt = Date.now();

  it("requires the water trap to be in inventory", () => {
    expect(() =>
      placeWaterTrap({
        state: GAME_STATE,
        action: {
          type: "waterTrap.placed",
          trapId,
          waterTrap: "Crab Pot",
        },
        createdAt,
      }),
    ).toThrow("Missing Crab Pot");
  });

  it("requires the correct bumpkin level for Crab Pot", () => {
    expect(() =>
      placeWaterTrap({
        state: {
          ...GAME_STATE,
          inventory: {
            "Crab Pot": new Decimal(1),
          },
          bumpkin: {
            ...TEST_BUMPKIN,
            experience: 0,
          },
        },
        action: {
          type: "waterTrap.placed",
          trapId,
          waterTrap: "Crab Pot",
        },
        createdAt,
      }),
    ).toThrow("Requires level 18");
  });

  it("requires the correct bumpkin level for Mariner Pot", () => {
    expect(() =>
      placeWaterTrap({
        state: {
          ...GAME_STATE,
          inventory: {
            "Mariner Pot": new Decimal(1),
          },
          bumpkin: {
            ...TEST_BUMPKIN,
            experience: 0,
          },
        },
        action: {
          type: "waterTrap.placed",
          trapId,
          waterTrap: "Mariner Pot",
        },
        createdAt,
      }),
    ).toThrow("Requires level 24");
  });

  it("prevents placing a trap on an occupied spot", () => {
    expect(() =>
      placeWaterTrap({
        state: {
          ...GAME_STATE,
          inventory: {
            "Crab Pot": new Decimal(1),
          },
          bumpkin: {
            ...TEST_BUMPKIN,
            experience: 1000000,
          },
          crabTraps: {
            trapSpots: {
              [trapId]: {
                coordinates: {
                  x: 0,
                  y: 0,
                },
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
          type: "waterTrap.placed",
          trapId,
          waterTrap: "Crab Pot",
        },
        createdAt,
      }),
    ).toThrow("Water trap spot already occupied");
  });

  it("requires sufficient chum", () => {
    // TODO: Build out crustaceans chum system
  });

  it("rejects unsupported chum types", () => {
    // TODO: Build out crustaceans chum system
  });

  it("requires chum to be provided", () => {
    expect(() =>
      placeWaterTrap({
        state: {
          ...GAME_STATE,
          inventory: {
            "Crab Pot": new Decimal(1),
          },
        },
        action: {
          type: "waterTrap.placed",
          trapId,
          waterTrap: "Crab Pot",
          // No chum provided
        },
        createdAt,
      }),
    ).toThrow("Chum is required");
  });

  it("places a Crab Pot with chum and deducts chum from inventory", () => {
    const state = placeWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: {
          "Crab Pot": new Decimal(1),
          Gold: new Decimal(5),
        },
      },
      action: {
        type: "waterTrap.placed",
        trapId,
        waterTrap: "Crab Pot",
        chum: "Gold",
      },
      createdAt,
    });

    expect(state.crabTraps.trapSpots?.[trapId]?.waterTrap?.chum).toBe("Gold");
    expect(state.inventory.Gold).toEqual(new Decimal(4));
    expect(state.inventory["Crab Pot"]).toEqual(new Decimal(0));
  });

  it("deducts exactly one trap from inventory", () => {
    const state = placeWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: {
          "Crab Pot": new Decimal(3),
          Gold: new Decimal(1),
        },
      },
      action: {
        type: "waterTrap.placed",
        trapId,
        waterTrap: "Crab Pot",
        chum: "Gold",
      },
      createdAt,
    });

    expect(state.inventory["Crab Pot"]).toEqual(new Decimal(2));
  });
});
