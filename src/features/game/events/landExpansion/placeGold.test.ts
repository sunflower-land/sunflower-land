import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeGold } from "./placeGold";

describe("placeGold", () => {
  it("ensures gold are in inventory", () => {
    expect(() =>
      placeGold({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Gold Rock",
          type: "gold.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Gold Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No gold available");
  });

  it("ensures gold are available", () => {
    expect(() =>
      placeGold({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Gold Rock",
          type: "gold.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Gold Rock": new Decimal(1),
          },
          gold: {
            "123": {
              createdAt: Date.now(),
              stone: {
                amount: 1,
                minedAt: 0,
              },
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No gold available");
  });

  it("places a gold rock", () => {
    const state = placeGold({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Gold Rock",
        type: "gold.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Gold Rock": new Decimal(2),
        },
        gold: {
          "123": {
            createdAt: Date.now(),
            stone: {
              amount: 1,
              minedAt: 0,
            },
            x: 0,
            y: 0,
          },
        },
      },
    });

    expect(state.gold).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          amount: 1,
          minedAt: 0,
        },
        x: 2,
        y: 2,
      },
      "123": {
        createdAt: expect.any(Number),
        stone: {
          amount: 1,
          minedAt: 0,
        },
        x: 0,
        y: 0,
      },
    });
  });
});
