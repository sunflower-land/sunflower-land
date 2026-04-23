import Decimal from "decimal.js-light";
import { placeWaterTrap } from "./placeWaterTrap";
import { INITIAL_FARM } from "features/game/lib/constants";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { GameState } from "features/game/types/game";
import { WATER_TRAP } from "features/game/types/crustaceans";

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
                  caught: { Isopod: 1 },
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

  it("does not deduct a trap from inventory if Royal Crab Pot is built", () => {
    const state = placeWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: { "Crab Pot": new Decimal(1), Moonfur: new Decimal(5) },
        collectibles: {
          "Royal Crab Pot": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: Date.now(),
              readyAt: Date.now(),
            },
          ],
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

    expect(state.inventory["Crab Pot"]).toEqual(new Decimal(1));
  });

  it("reduces the ready time by 20% when Speed Trap is built", () => {
    const createdAt = Date.now();
    const state = placeWaterTrap({
      state: {
        ...GAME_STATE,
        inventory: { "Crab Pot": new Decimal(2), Moonfur: new Decimal(3) },
        collectibles: {
          "Speed Trap": [
            {
              id: "1",
              coordinates: { x: 1, y: 1 },
              createdAt,
            },
          ],
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

    // Default ready time for Crab Pot is 8 hours (see WATER_TRAP config)
    const defaultReadyTimeMs =
      WATER_TRAP["Crab Pot"].readyTimeHours * 60 * 60 * 1000;
    const expectedReadyTime = createdAt + defaultReadyTimeMs * 0.8;

    expect(state.crabTraps.trapSpots?.[trapId]?.waterTrap?.readyAt).toBe(
      expectedReadyTime,
    );
  });
});
