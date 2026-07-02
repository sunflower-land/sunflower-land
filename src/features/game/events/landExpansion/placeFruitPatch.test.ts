import Decimal from "decimal.js-light";
import { placeFruitPatch } from "./placeFruitPatch";
import { INITIAL_FARM } from "features/game/lib/constants";
import { FRUIT_BOOST_SPEED } from "features/game/lib/boostWindows";

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

  it("banks boosted work when a fruit speed window covered the pre-lift period", () => {
    const now = Date.now();
    const plantedAt = now - 180000;
    const removedAt = now - 120000; // 60s of real growth before the lift
    const baseDurationMs = 200000;
    const speed = FRUIT_BOOST_SPEED["Orchard Hourglass"]; // 1.35x

    const state = placeFruitPatch({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "1",
        name: "Fruit Patch",
        type: "fruitPatch.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Fruit Patch": new Decimal(2) },
        collectibles: {
          "Orchard Hourglass": [
            {
              id: "hg",
              coordinates: { x: 5, y: 5 },
              createdAt: now - 200000,
              readyAt: now - 200000,
            },
          ],
        },
        fruitPatches: {
          "123": {
            createdAt: now,
            fruit: {
              name: "Apple",
              plantedAt,
              harvestsLeft: 3,
              harvestedAt: 0,
              baseDurationMs,
            },
            removedAt,
          },
        },
      },
      createdAt: now,
    });

    const fruit = state.fruitPatches["123"].fruit;
    const banked = 60000 * speed;
    expect(fruit?.plantedAt).toBe(now);
    expect(fruit?.baseDurationMs).toBeCloseTo(baseDurationMs - banked, 5);
    // Banked work is retained as boostedTime for the progress bar.
    expect(fruit?.boostedTime).toBeCloseTo(banked, 5);
  });

  it("banks replenishing-phase boosted work (harvestedAt) for a windowed fruit on lift", () => {
    const now = Date.now();
    const plantedAt = now - 600000; // first planted long ago
    const harvestedAt = now - 180000; // last harvested → replenishing phase active
    const removedAt = now - 120000; // 60s of replenish before the lift
    const baseDurationMs = 200000;
    const speed = FRUIT_BOOST_SPEED["Orchard Hourglass"]; // 1.35x

    const state = placeFruitPatch({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "1",
        name: "Fruit Patch",
        type: "fruitPatch.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Fruit Patch": new Decimal(2) },
        collectibles: {
          "Orchard Hourglass": [
            {
              id: "hg",
              coordinates: { x: 5, y: 5 },
              createdAt: now - 200000,
              readyAt: now - 200000,
            },
          ],
        },
        fruitPatches: {
          "123": {
            createdAt: now,
            fruit: {
              name: "Apple",
              plantedAt,
              harvestsLeft: 2,
              harvestedAt,
              baseDurationMs,
            },
            removedAt,
          },
        },
      },
      createdAt: now,
    });

    const fruit = state.fruitPatches["123"].fruit;
    const banked = 60000 * speed;
    // Replenishing (harvestedAt > plantedAt): the active phase timestamp is
    // harvestedAt, so it — not plantedAt — is reset to now.
    expect(fruit?.harvestedAt).toBe(now);
    expect(fruit?.plantedAt).toBe(plantedAt);
    expect(fruit?.baseDurationMs).toBeCloseTo(baseDurationMs - banked, 5);
    expect(fruit?.boostedTime).toBeCloseTo(banked, 5);
  });

  it("only banks unboosted work when a fruit boost starts during the lift", () => {
    const now = Date.now();
    const plantedAt = now - 180000;
    const removedAt = now - 120000; // 60s of UNBOOSTED growth before the lift
    const baseDurationMs = 200000;

    const state = placeFruitPatch({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "1",
        name: "Fruit Patch",
        type: "fruitPatch.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Fruit Patch": new Decimal(2) },
        collectibles: {
          // Placed AFTER the patch was lifted — must not retro-credit pre-lift growth.
          "Orchard Hourglass": [
            {
              id: "hg",
              coordinates: { x: 5, y: 5 },
              createdAt: now - 60000,
              readyAt: now - 60000,
            },
          ],
        },
        fruitPatches: {
          "123": {
            createdAt: now,
            fruit: {
              name: "Apple",
              plantedAt,
              harvestsLeft: 3,
              harvestedAt: 0,
              baseDurationMs,
            },
            removedAt,
          },
        },
      },
      createdAt: now,
    });

    const fruit = state.fruitPatches["123"].fruit;
    expect(fruit?.plantedAt).toBe(now);
    expect(fruit?.baseDurationMs).toBe(baseDurationMs - 60000);
  });
});
