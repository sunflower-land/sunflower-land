import Decimal from "decimal.js-light";
import { placeFruitPatch } from "./placeFruitPatch";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("placeFruitPatch", () => {
  const dateNow = Date.now();
  it("ensures fruitPatches are in inventory", () => {
    expect(() =>
      placeFruitPatch({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Fruit Patch",
          type: "fruitPatch.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Fruit Patch": new Decimal(0),
          },
        },
      }),
    ).toThrow("No fruit patches available");
  });

  it("ensures fruitPatches are available", () => {
    expect(() =>
      placeFruitPatch({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Fruit Patch",
          type: "fruitPatch.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Fruit Patch": new Decimal(1),
          },
          fruitPatches: {
            "123": {
              createdAt: dateNow,
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No fruit patches available");
  });

  it("places a fruit patch", () => {
    const createdAt = dateNow;
    const state = placeFruitPatch({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Fruit Patch",
        type: "fruitPatch.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Fruit Patch": new Decimal(2),
        },
        fruitPatches: {
          "123": {
            createdAt: dateNow,
            x: 0,
            y: 0,
          },
        },
      },
      createdAt,
    });

    expect(state.fruitPatches).toEqual({
      "1": {
        createdAt,
        x: 2,
        y: 2,
      },
      "123": {
        createdAt,
        x: 0,
        y: 0,
      },
    });
  });

  it("reinstates current progress when fruit was planted", () => {
    const state = placeFruitPatch({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1", // ID doesn't matter since it's an existing patch
        name: "Fruit Patch",
        type: "fruitPatch.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Fruit Patch": new Decimal(2),
        },
        fruitPatches: {
          "123": {
            fruit: {
              name: "Apple",
              plantedAt: dateNow - 180000,
              harvestsLeft: 0,
              harvestedAt: 0,
            },
            removedAt: dateNow - 120000,
            createdAt: dateNow,
          },
        },
      },
      createdAt: dateNow,
    });
    expect(state.fruitPatches["123"].fruit?.plantedAt).toBe(dateNow - 60000);
  });

  it("reinstates current progress when fruit was harvested", () => {
    const state = placeFruitPatch({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1", // ID doesn't matter since it's an existing patch
        name: "Fruit Patch",
        type: "fruitPatch.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Fruit Patch": new Decimal(2),
        },
        fruitPatches: {
          "123": {
            fruit: {
              name: "Apple",
              plantedAt: 0,
              harvestsLeft: 0,
              harvestedAt: dateNow - 180000,
            },
            removedAt: dateNow - 120000,
            createdAt: dateNow,
          },
        },
      },
      createdAt: dateNow,
    });
    expect(state.fruitPatches["123"].fruit?.harvestedAt).toBe(dateNow - 60000);
  });
});
