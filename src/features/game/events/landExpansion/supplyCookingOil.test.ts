import type { GameState, PlacedItem } from "features/game/types/game";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { supplyCookingOil } from "./supplyCookingOil";
import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";

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
    const network = CONFIG.NETWORK;
    (CONFIG as { NETWORK: string }).NETWORK = "mainnet";
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
    (CONFIG as { NETWORK: string }).NETWORK = network;
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

describe("supplyCookingOil (oil by the clock)", () => {
  const HOUR = 60 * 60 * 1000;
  const now = Date.now();

  const deliFarm = (deli: Partial<PlacedItem> = {}): GameState => ({
    ...GAME_STATE,
    inventory: { Oil: new Decimal(200) },
    buildings: {
      Deli: [
        {
          id: "1",
          coordinates: { x: 0, y: 0 },
          createdAt: 0,
          readyAt: 0,
          ...deli,
        },
      ],
    },
  });

  const supply = (state: GameState, oilQuantity: number, createdAt = now) =>
    supplyCookingOil({
      state,
      action: {
        type: "cookingOil.supplied",
        building: "Deli",
        buildingId: "1",
        oilQuantity,
      },
      createdAt,
    }).buildings.Deli?.[0];

  it("holds five real days of cooking", () => {
    expect(supply(deliFarm({ oil: 98 }), 2)?.oil).toEqual(100);
    expect(() => supply(deliFarm({ oil: 99 }), 2)).toThrow(
      "Oil capacity exceeded",
    );
  });

  it("speeds up the recipe already cooking", () => {
    const deli = supply(
      deliFarm({
        oil: 0,
        oilSettledAt: now - HOUR,
        crafting: [
          {
            name: "Fermented Fish",
            startedAt: now,
            baseDurationMs: 10 * HOUR,
            oilBoost: 0.4,
            readyAt: now + 10 * HOUR,
          },
        ],
      }),
      20,
    );

    expect(deli?.crafting?.[0].readyAt).toEqual(now + 6 * HOUR);
  });

  it("burns the tank down to its live level before topping it up", () => {
    const deli = supply(
      deliFarm({
        oil: 20,
        oilSettledAt: now,
        crafting: [
          {
            name: "Fermented Fish",
            startedAt: now,
            baseDurationMs: 10 * HOUR,
            oilBoost: 0.4,
            readyAt: now + 6 * HOUR,
          },
        ],
      }),
      1,
      now + 3 * HOUR,
    );

    // 3h of cooking at 20 a day burned 2.5.
    expect(deli?.oil).toBeCloseTo(18.5);
    expect(deli?.oilSettledAt).toEqual(now + 3 * HOUR);
  });

  it("does not fill a lifted building", () => {
    expect(() =>
      supply(
        {
          ...deliFarm({ oil: 0, oilSettledAt: now }),
          buildings: {
            Deli: [
              {
                id: "2",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
              {
                id: "1",
                createdAt: 0,
                readyAt: 0,
                removedAt: now - HOUR,
                oil: 0,
                oilSettledAt: now - 2 * HOUR,
              },
            ],
          },
        },
        1,
      ),
    ).toThrow("Building does not exist");
  });
});
