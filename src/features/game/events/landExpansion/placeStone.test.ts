import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeStone } from "./placeStone";

describe("placeStone", () => {
  it("ensures stones are in inventory", () => {
    expect(() =>
      placeStone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Stone Rock",
          type: "stone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Stone Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No stone available");
  });

  it("ensures stones are available", () => {
    expect(() =>
      placeStone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Stone Rock",
          type: "stone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Stone Rock": new Decimal(1),
          },
          stones: {
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
    ).toThrow("No stone available");
  });

  it("places a stone", () => {
    const state = placeStone({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Stone Rock",
        type: "stone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Stone Rock": new Decimal(2),
        },
        stones: {
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

    expect(state.stones).toEqual({
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
