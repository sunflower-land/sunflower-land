import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeCrimstone } from "./placeCrimstone";

describe("placeRuby", () => {
  it("ensures crimstone are in inventory", () => {
    expect(() =>
      placeCrimstone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crimstone Rock",
          type: "crimstone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crimstone Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No crimstones available");
  });

  it("ensures crimstone are available", () => {
    expect(() =>
      placeCrimstone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crimstone Rock",
          type: "crimstone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crimstone Rock": new Decimal(1),
          },
          crimstones: {
            "123": {
              createdAt: Date.now(),
              stone: {
                amount: 1,
                minedAt: 0,
              },
              x: 1,
              y: 1,
              minesLeft: 5,
            },
          },
        },
      }),
    ).toThrow("No crimstones available");
  });

  it("places a crimstone", () => {
    const state = placeCrimstone({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Crimstone Rock",
        type: "crimstone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Crimstone Rock": new Decimal(2),
        },
        crimstones: {
          "123": {
            createdAt: Date.now(),
            stone: {
              amount: 1,
              minedAt: 0,
            },
            x: 0,
            y: 0,
            minesLeft: 5,
          },
        },
      },
    });

    expect(state.crimstones).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          amount: 1,
          minedAt: 0,
        },
        x: 2,
        y: 2,
        minesLeft: 5,
      },
      "123": {
        createdAt: expect.any(Number),
        stone: {
          amount: 1,
          minedAt: 0,
        },
        x: 0,
        y: 0,
        minesLeft: 5,
      },
    });
  });
});
