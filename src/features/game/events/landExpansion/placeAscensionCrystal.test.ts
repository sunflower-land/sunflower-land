import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeAscensionCrystal } from "./placeAscensionCrystal";

describe("placeAscensionCrystal", () => {
  it("ensures ascension crystals are in inventory", () => {
    expect(() =>
      placeAscensionCrystal({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Ascension Crystal",
          type: "ascensionCrystal.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Ascension Crystal": new Decimal(0),
          },
        },
      }),
    ).toThrow("No ascension crystal available");
  });

  it("ensures ascension crystals are available", () => {
    expect(() =>
      placeAscensionCrystal({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Ascension Crystal",
          type: "ascensionCrystal.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Ascension Crystal": new Decimal(1),
          },
          ascensionCrystals: {
            "123": {
              createdAt: Date.now(),
              stone: {
                minedAt: 0,
              },
              minesLeft: 1,
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No ascension crystal available");
  });

  it("places an ascension crystal", () => {
    const state = placeAscensionCrystal({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Ascension Crystal",
        type: "ascensionCrystal.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Ascension Crystal": new Decimal(2),
        },
        ascensionCrystals: {
          "123": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            minesLeft: 1,
            x: 0,
            y: 0,
          },
        },
      },
    });

    expect(state.ascensionCrystals).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        minesLeft: 1,
        x: 2,
        y: 2,
      },
      "123": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        minesLeft: 1,
        x: 0,
        y: 0,
      },
    });
  });

  it("reinstates current progress when the rock was mined", () => {
    const dateNow = Date.now();
    const state = placeAscensionCrystal({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1", // ID doesn't matter since it's an existing rock
        name: "Ascension Crystal",
        type: "ascensionCrystal.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Ascension Crystal": new Decimal(2),
        },
        ascensionCrystals: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt: dateNow - 180000 },
            removedAt: dateNow - 120000,
            minesLeft: 1,
          },
        },
      },
      createdAt: dateNow,
    });

    expect(state.ascensionCrystals).toEqual({
      "123": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: dateNow - 60000,
        },
        x: 2,
        y: 2,
        minesLeft: 1,
      },
    });
  });
});
