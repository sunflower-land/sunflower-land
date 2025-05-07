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
});
