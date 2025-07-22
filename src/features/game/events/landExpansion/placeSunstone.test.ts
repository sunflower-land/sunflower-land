import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeSunstone } from "./placeSunstone";

describe("placeSunstone", () => {
  it("ensures sunstones are in inventory", () => {
    expect(() =>
      placeSunstone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Stone Rock",
          type: "sunstone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Sunstone Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No sunstone available");
  });

  it("ensures sunstones are available", () => {
    expect(() =>
      placeSunstone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Sunstone Rock",
          type: "sunstone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Stone Rock": new Decimal(1),
          },
          sunstones: {
            "123": {
              createdAt: Date.now(),
              stone: {
                amount: 1,
                minedAt: 0,
              },
              minesLeft: 1,
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No sunstone available");
  });

  it("places a sunstone", () => {
    const state = placeSunstone({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Sunstone Rock",
        type: "sunstone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Sunstone Rock": new Decimal(2),
        },
        sunstones: {
          "123": {
            createdAt: Date.now(),
            stone: {
              amount: 1,
              minedAt: 0,
            },
            minesLeft: 1,
            x: 0,
            y: 0,
          },
        },
      },
    });

    expect(state.sunstones).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 10,
        x: 2,
        y: 2,
      },
      "123": {
        createdAt: expect.any(Number),
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 1,
        x: 0,
        y: 0,
      },
    });
  });
});
