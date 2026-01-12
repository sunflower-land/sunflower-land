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
        x: 0,
        y: 0,
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
          type: "waterTrap.placed",
          trapId,
          waterTrap: "Crab Pot",
        },
        createdAt,
      }),
    ).toThrow("Water trap spot already occupied");
  });

  it("places a Crab Pot with chum and deducts chum from inventory", () => {
    const state = placeWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: {
          "Crab Pot": new Decimal(1),
          Moonfur: new Decimal(5),
        },
      },
      action: {
        type: "waterTrap.placed",
        trapId,
        waterTrap: "Crab Pot",
        chum: "Moonfur",
      },
      createdAt,
    });

    expect(state.crabTraps.trapSpots?.[trapId]?.waterTrap?.chum).toBe(
      "Moonfur",
    );
    expect(state.inventory.Moonfur).toEqual(new Decimal(4));
    expect(state.inventory["Crab Pot"]).toEqual(new Decimal(0));
  });

  it("deducts exactly one trap from inventory", () => {
    const state = placeWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: {
          "Crab Pot": new Decimal(3),
          Moonfur: new Decimal(3),
        },
      },
      action: {
        type: "waterTrap.placed",
        trapId,
        waterTrap: "Crab Pot",
        chum: "Moonfur",
      },
      createdAt,
    });

    expect(state.inventory["Crab Pot"]).toEqual(new Decimal(2));
  });
});
