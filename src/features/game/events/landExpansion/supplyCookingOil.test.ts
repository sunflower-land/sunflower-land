import type { GameState } from "features/game/types/game";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { supplyCookingOil } from "./supplyCookingOil";
import { cook } from "./cook";
import { getCookingQueueReadyAts } from "features/game/lib/cookingReadiness";
import Decimal from "decimal.js-light";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("supplyCookingOil", () => {
  it("requires building exists", () => {
    expect(() =>
      supplyCookingOil({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "cookingOil.supplied",
          building: "Kitchen",
          buildingId: "1",
          oilQuantity: 1,
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Building does not exist");
  });

  it("requires building to be placed", () => {
    expect(() =>
      supplyCookingOil({
        state: {
          ...GAME_STATE,
          buildings: {
            Kitchen: [
              {
                coordinates: undefined,
                id: "1",
                createdAt: Date.now(),
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "cookingOil.supplied",
          building: "Kitchen",
          buildingId: "1",
          oilQuantity: 1,
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Building does not exist");
  });

  it("requires buildingId exists", () => {
    expect(() =>
      supplyCookingOil({
        state: {
          ...GAME_STATE,
          buildings: {
            Kitchen: [
              {
                coordinates: { x: 0, y: 0 },
                id: "2",
                createdAt: Date.now(),
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "cookingOil.supplied",
          building: "Kitchen",
          buildingId: "1",
          oilQuantity: 1,
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Building does not exist");
  });

  it("requires oil in inventory", () => {
    expect(() =>
      supplyCookingOil({
        state: {
          ...GAME_STATE,
          buildings: {
            Kitchen: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: Date.now(),
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "cookingOil.supplied",
          building: "Kitchen",
          buildingId: "1",
          oilQuantity: 1,
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Not enough oil");
  });

  it("adds oil to building", () => {
    const result = supplyCookingOil({
      state: {
        ...GAME_STATE,
        buildings: {
          Kitchen: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: Date.now(),
              readyAt: 0,
            },
          ],
        },
        inventory: {
          Oil: new Decimal(1),
        },
      },
      action: {
        type: "cookingOil.supplied",
        building: "Kitchen",
        buildingId: "1",
        oilQuantity: 1,
      },
      createdAt: Date.now(),
    });

    expect(result.buildings?.Kitchen?.[0]?.oil).toBe(1);
  });

  it("removes oil from inventory", () => {
    const result = supplyCookingOil({
      state: {
        ...GAME_STATE,
        buildings: {
          Kitchen: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: Date.now(),
              readyAt: 0,
            },
          ],
        },
        inventory: {
          Oil: new Decimal(1),
        },
      },
      action: {
        type: "cookingOil.supplied",
        building: "Kitchen",
        buildingId: "1",
        oilQuantity: 1,
      },
      createdAt: Date.now(),
    });

    expect(result.inventory.Oil).toEqual(new Decimal(0));
  });

  it("throws if supplying more oil to Fire Pit the building capacity", () => {
    expect(() =>
      supplyCookingOil({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: Date.now(),
                readyAt: 0,
                oil: 1,
              },
            ],
          },
          inventory: {
            Oil: new Decimal(7),
          },
        },
        action: {
          type: "cookingOil.supplied",
          building: "Fire Pit",
          buildingId: "1",
          oilQuantity: 6,
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Oil capacity exceeded");
  });

  it("throws if supplying more oil to Deli the building capacity", () => {
    expect(() =>
      supplyCookingOil({
        state: {
          ...GAME_STATE,
          buildings: {
            Deli: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: Date.now(),
                readyAt: 0,
                oil: 60,
              },
            ],
          },
          inventory: {
            Oil: new Decimal(3),
          },
        },
        action: {
          type: "cookingOil.supplied",
          building: "Deli",
          buildingId: "1",
          oilQuantity: 2,
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Oil capacity exceeded");
  });
});

describe("supplyCookingOil exploit guards", () => {
  const withFirePit: GameState = {
    ...GAME_STATE,
    inventory: { ...GAME_STATE.inventory, Oil: new Decimal(0) },
    buildings: {
      ...GAME_STATE.buildings,
      "Fire Pit": [
        {
          id: "1",
          createdAt: 0,
          readyAt: 0,
          coordinates: { x: 0, y: 0 },
          oil: 0,
        },
      ],
    },
  };

  it("rejects a negative oilQuantity (would otherwise mint free Oil)", () => {
    expect(() =>
      supplyCookingOil({
        state: withFirePit,
        action: {
          type: "cookingOil.supplied",
          building: "Fire Pit",
          buildingId: "1",
          oilQuantity: -1000,
        },
      }),
    ).toThrow("Invalid oil quantity");
  });

  it("rejects a non-integer oilQuantity", () => {
    expect(() =>
      supplyCookingOil({
        state: withFirePit,
        action: {
          type: "cookingOil.supplied",
          building: "Fire Pit",
          buildingId: "1",
          oilQuantity: 1.5,
        },
      }),
    ).toThrow("Invalid oil quantity");
  });
});

describe("supplyCookingOil retroactive speed boost", () => {
  const HOUR = 60 * 60 * 1000;

  const firePitWithEgg = (): GameState => ({
    ...GAME_STATE,
    inventory: {
      Egg: new Decimal(10),
      Oil: new Decimal(10),
      "Lifetime Farmer Banner": new Decimal(1),
    },
    buildings: {
      "Fire Pit": [
        {
          id: "1",
          coordinates: { x: 0, y: 0 },
          createdAt: 0,
          readyAt: 0,
          oil: 0,
        },
      ],
    },
  });

  it("speeds up the recipe already in the oven when oil is added", () => {
    const now = 1_700_000_000_000;

    // Cook with an EMPTY tank: the egg cooks at 1x (no oil boost).
    const cooked = cook({
      state: firePitWithEgg(),
      action: { type: "recipe.cooked", item: "Boiled Eggs", buildingId: "1" },
      farmId: 1,
      createdAt: now,
    });
    const before = getCookingQueueReadyAts({
      crafting: cooked.buildings["Fire Pit"]![0].crafting!,
      game: cooked,
      building: cooked.buildings["Fire Pit"]![0],
    })[0];
    // 1h base, no oil -> ready in 1h.
    expect(before).toBe(now + HOUR);

    // Add oil at cook start -> retroactively covers the whole cook (20% faster).
    const supplied = supplyCookingOil({
      state: cooked,
      action: {
        type: "cookingOil.supplied",
        building: "Fire Pit",
        buildingId: "1",
        oilQuantity: 1,
      },
      createdAt: now,
    });
    const after = getCookingQueueReadyAts({
      crafting: supplied.buildings["Fire Pit"]![0].crafting!,
      game: supplied,
      building: supplied.buildings["Fire Pit"]![0],
    })[0];
    expect(after).toBe(now + 0.8 * HOUR);
  });

  it("speeds up recipes queued behind the one cooking", () => {
    const now = 1_700_000_000_000;

    let state = cook({
      state: firePitWithEgg(),
      action: { type: "recipe.cooked", item: "Boiled Eggs", buildingId: "1" },
      farmId: 1,
      createdAt: now,
    });
    // VIP not required for a second slot here; queue a second egg directly.
    state = cook({
      state: {
        ...state,
        inventory: { ...state.inventory, Egg: new Decimal(10) },
      },
      action: { type: "recipe.cooked", item: "Boiled Eggs", buildingId: "1" },
      farmId: 1,
      createdAt: now,
    });

    const supplied = supplyCookingOil({
      state: {
        ...state,
        inventory: { ...state.inventory, Oil: new Decimal(10) },
      },
      action: {
        type: "cookingOil.supplied",
        building: "Fire Pit",
        buildingId: "1",
        oilQuantity: 2,
      },
      createdAt: now,
    });

    const readyAts = getCookingQueueReadyAts({
      crafting: supplied.buildings["Fire Pit"]![0].crafting!,
      game: supplied,
      building: supplied.buildings["Fire Pit"]![0],
    });
    // Both eggs now oil-boosted: 0.8h each -> 0.8h and 1.6h.
    expect(readyAts[0]).toBe(now + 0.8 * HOUR);
    expect(readyAts[1] ?? readyAts[0]).toBe(now + 1.6 * HOUR);
  });
});
