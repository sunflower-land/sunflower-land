import { GameState } from "features/game/types/game";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { supplyCookingOil } from "./supplyCookingOil";
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
      })
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
      })
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
      })
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
            Oil: new Decimal(3),
          },
        },
        action: {
          type: "cookingOil.supplied",
          building: "Fire Pit",
          buildingId: "1",
          oilQuantity: 2,
        },
        createdAt: Date.now(),
      })
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
                oil: 24,
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
      })
    ).toThrow("Oil capacity exceeded");
  });
});
