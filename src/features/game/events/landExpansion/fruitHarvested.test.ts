import Decimal from "decimal.js-light";
import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  TEST_FARM,
} from "features/game/lib/constants";
import { prngChance } from "lib/prng";
import { PATCH_FRUIT_SEEDS } from "features/game/types/fruits";
import { CONFIG } from "lib/config";
import type { GameState, FruitPatch } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import {
  getFruitYield,
  harvestFruit,
  isFruitReadyToHarvest,
} from "./fruitHarvested";

const dateNow = Date.now();

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  fruitPatches: {
    0: {
      createdAt: dateNow,
      fruit: {
        name: "Apple",
        plantedAt: 123,
        harvestedAt: 0,
        harvestsLeft: 0,
      },
      x: -2,
      y: 0,
    },
    1: {
      createdAt: dateNow,
      x: -2,
      y: 0,
    },
  },
};

describe("fruitHarvested", () => {
  const dateNow = Date.now();

  // Legacy back-dated grow assertions; FE jest runs on amoy where SPEED_BOOSTS
  // is on, so force the flag off here. Windowed coverage lives in its own
  // describe below.
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  describe("isFruitReadyToHarvest", () => {
    const appleSeed = PATCH_FRUIT_SEEDS["Apple Seed"];

    it("fruit is not ready to harvest if just planted fruit seed", () => {
      expect(
        isFruitReadyToHarvest(
          appleSeed.plantSeconds + 1,
          {
            name: "Apple",
            plantedAt: appleSeed.plantSeconds,
            harvestsLeft: 3,
            harvestedAt: 0,
          },
          TEST_FARM,
        ),
      ).toBeFalsy();
    });

    it("fruit is not ready to harvest if just harvested fruit", () => {
      expect(
        isFruitReadyToHarvest(
          appleSeed.plantSeconds + 1,
          {
            name: "Apple",
            plantedAt: 99,
            harvestsLeft: 2,
            harvestedAt: appleSeed.plantSeconds,
          },
          TEST_FARM,
        ),
      ).toBeFalsy();
    });

    it("fruit is ready to harvest for the first time", () => {
      expect(
        isFruitReadyToHarvest(
          appleSeed.plantSeconds * 2 + 1,
          {
            name: "Apple",
            plantedAt: appleSeed.plantSeconds,
            harvestsLeft: 3,
            harvestedAt: 0,
          },
          TEST_FARM,
        ),
      ).toBeFalsy();
    });

    it("fruit is ready to harvest for subsequent times", () => {
      expect(
        isFruitReadyToHarvest(
          appleSeed.plantSeconds * 2 + 1,
          {
            name: "Apple",
            plantedAt: 99,
            harvestsLeft: 2,
            harvestedAt: appleSeed.plantSeconds,
          },
          TEST_FARM,
        ),
      ).toBeFalsy();
    });
  });

  it("does not harvest on non-existent fruit patch", () => {
    expect(() =>
      harvestFruit({
        state: GAME_STATE,
        action: {
          type: "fruit.harvested",
          index: "-1",
        },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("Fruit patch does not exist");
  });

  it("does not harvest empty air", () => {
    expect(() =>
      harvestFruit({
        state: GAME_STATE,
        action: {
          type: "fruit.harvested",
          index: "1",
        },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the fruit is not ripe", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];

    expect(() =>
      harvestFruit({
        state: {
          ...GAME_STATE,
          fruitPatches: {
            0: {
              ...fruitPatch,
              fruit: {
                name: "Apple",
                plantedAt: Date.now() - 100,
                harvestsLeft: 1,
                harvestedAt: 0,
              },
            },
          },
        },
        action: {
          type: "fruit.harvested",
          index: "0",
        },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("Not ready");
  });

  it("does not harvest if the fruit patch is not placed", () => {
    expect(() =>
      harvestFruit({
        state: {
          ...GAME_STATE,
          fruitPatches: {
            0: {
              createdAt: 0,
              fruit: {
                name: "Blueberry",
                plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
                harvestsLeft: 5,
                harvestedAt: 2,
              },
            },
          },
        },
        action: {
          type: "fruit.harvested",
          index: "0",
        },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("Fruit patch is not placed");
  });

  it("does not harvest if the fruit is still replenishing", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];

    expect(() =>
      harvestFruit({
        state: {
          ...GAME_STATE,
          fruitPatches: {
            0: {
              ...fruitPatch,
              fruit: {
                name: "Apple",
                plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
                harvestsLeft: 1,
                harvestedAt: Date.now() - 100,
              },
            },
          },
        },
        action: {
          type: "fruit.harvested",
          index: "0",
        },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("Fruit is still replenishing");
  });

  it("does not harvest if no harvest left", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];

    expect(() =>
      harvestFruit({
        state: {
          ...GAME_STATE,
          fruitPatches: {
            0: {
              ...fruitPatch,
              fruit: {
                name: "Apple",
                plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
                harvestsLeft: 0,
                harvestedAt: 0,
              },
            },
          },
        },
        action: {
          type: "fruit.harvested",
          index: "0",
        },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("No harvest left");
  });

  it("harvests the fruit when more than one harvest left", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(1),
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Apple",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 0,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    expect(state.inventory).toEqual({
      ...state.inventory,
      Apple: new Decimal(2),
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;
    expect(fruit?.harvestsLeft).toEqual(initialHarvest - 1);
    expect(fruit?.harvestedAt).toEqual(dateNow);
  });

  it("applies Lady Bug Boost", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Lady Bug": new Decimal(1),
        },
        collectibles: {
          "Lady Bug": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Apple",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    expect(state.inventory.Apple).toEqual(new Decimal(1.25));
  });

  it("applies the Black Bearry Boost", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Black Bearry": new Decimal(1),
        },
        collectibles: {
          "Black Bearry": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Blueberry",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    expect(state.inventory.Blueberry).toEqual(new Decimal(2));
  });

  it("includes Squirrel Monkey bonus on Oranges", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Squirrel Monkey": new Decimal(1),
        },
        collectibles: {
          "Squirrel Monkey": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Orange",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;

    expect(fruit?.harvestedAt).toEqual(
      dateNow - (PATCH_FRUIT_SEEDS["Orange Seed"].plantSeconds * 1000) / 2,
    );
  });

  it("gives a 50% growth time reduction when Lemon Tea Bath is placed", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Lemon Tea Bath": new Decimal(1),
        },
        collectibles: {
          "Lemon Tea Bath": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Lemon",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;

    expect(fruit?.harvestedAt).toEqual(
      dateNow - (PATCH_FRUIT_SEEDS["Lemon Seed"].plantSeconds * 1000) / 2,
    );
  });

  it("gives a 25% growth time reduction when Lemon Frog is placed", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Lemon Frog": new Decimal(1),
        },
        collectibles: {
          "Lemon Frog": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Lemon",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;

    expect(fruit?.harvestedAt).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Lemon Seed"].plantSeconds * 1000 * 0.25,
    );
  });

  it("gives a 62.5% growth time reduction when Lemon Tea Bath is placed", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Lemon Tea Bath": new Decimal(1),
          "Lemon Frog": new Decimal(1),
        },
        collectibles: {
          "Lemon Tea Bath": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
          "Lemon Frog": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Lemon",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;

    expect(fruit?.harvestedAt).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Lemon Seed"].plantSeconds * 1000 * 0.625,
    );
  });

  it("gives a 50% growth time reduction on tomatoes when Tomato Clown is placed", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Tomato Clown": new Decimal(1),
        },
        collectibles: {
          "Tomato Clown": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Tomato",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;

    expect(fruit?.harvestedAt).toEqual(
      dateNow - (PATCH_FRUIT_SEEDS["Tomato Seed"].plantSeconds * 1000) / 2,
    );
  });

  it("includes 25% Growth Time reduction on Tomatoes when Cannonball is placed", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          Cannonball: new Decimal(1),
        },
        collectibles: {
          Cannonball: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Tomato",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;

    expect(fruit?.harvestedAt).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Tomato Seed"].plantSeconds * 1000 * 0.25,
    );
  });

  it("gives a 62.5% Growth Time reduction when both Tomato Clown and Cannonball are placed", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        inventory: {
          "Tomato Clown": new Decimal(1),
          Cannonball: new Decimal(1),
        },
        collectibles: {
          "Tomato Clown": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
          Cannonball: [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Tomato",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    const { fruitPatches: fruitPatchesAfterHarvest } = state;
    const fruit = fruitPatchesAfterHarvest?.[0].fruit;

    expect(fruit?.harvestedAt).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Tomato Seed"].plantSeconds * 1000 * 0.625,
    );
  });

  it("harvests the fruit when one harvest is left", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 1;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,

        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Apple",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 0,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    expect(state.inventory).toEqual({
      ...state.inventory,
      Apple: new Decimal(1),
    });

    const fruitAfterHarvest = state.fruitPatches?.[0].fruit;

    expect(fruitAfterHarvest?.harvestsLeft).toEqual(0);
  });

  it("increments Apple Harvested activity by 1", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 1;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Apple",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 0,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    expect(state.farmActivity["Apple Harvested"]).toEqual(1);
  });

  it("applies a buds boost", () => {
    const { fruitPatches } = GAME_STATE;
    const fruitPatch = (fruitPatches as Record<number, FruitPatch>)[0];
    const initialHarvest = 2;

    const state = harvestFruit({
      state: {
        ...GAME_STATE,
        buds: {
          1: {
            aura: "No Aura",
            colour: "Green",
            ears: "No Ears",
            stem: "Hibiscus",
            type: "Beach",
            coordinates: { x: 0, y: 0 },
          },
        },
        fruitPatches: {
          0: {
            ...fruitPatch,
            fruit: {
              name: "Blueberry",
              plantedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
              harvestsLeft: initialHarvest,
              harvestedAt: 2,
            },
          },
        },
      },
      action: {
        type: "fruit.harvested",
        index: "0",
      },
      createdAt: dateNow,
      farmId: 1,
    });

    expect(state.inventory.Blueberry).toEqual(new Decimal(1.2));
  });

  describe("getFruitYield", () => {
    const farmId = 1;
    it("provides no bonuses", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: TEST_FARM,
        name: "Apple",
      });

      expect(amount).toEqual(1);
    });

    it("gives +.1 basic fruit yield with Fruitful Fumble skill", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: {
              "Fruitful Fumble": 1,
            },
          },
        },
        name: "Blueberry",
      });

      expect(amount).toEqual(1.1);
    });
    it("give +0.1 fruit yield when macaw is placed", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...INITIAL_FARM,
          collectibles: {
            Macaw: [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
        name: "Apple",
      });

      expect(amount).toEqual(1.1);
    });
    it("gives +0.2 fruit yield when macaw is placed AND has Loyal Macaw Skill", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Loyal Macaw": 1 },
          },
          collectibles: {
            Macaw: [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
        name: "Apple",
      });

      expect(amount).toEqual(1.2);
    });
    it("gives +0.2 fruit yield when Fruitful Bounty is claimed and Fruitful Blend is applied", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Fruitful Bounty": 1 },
          },
        },
        fertiliser: "Fruitful Blend",
        name: "Apple",
      });

      expect(amount).toEqual(1.2);
    });

    it("applies Fruitful Blend buff yield and boosts when Turbofruit Mix is applied without Fruitful Bounty", () => {
      const { amount, boostsUsed } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: INITIAL_FARM,
        fertiliser: "Turbofruit Mix",
        name: "Apple",
      });

      expect(amount).toEqual(1.1);
      expect(boostsUsed).toEqual([{ name: "Fruitful Blend", value: "+0.1" }]);
    });

    it("applies doubled Fruitful Blend buff when Turbofruit Mix is applied with Fruitful Bounty", () => {
      const { amount, boostsUsed } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Fruitful Bounty": 1 },
          },
        },
        fertiliser: "Turbofruit Mix",
        name: "Apple",
      });

      expect(amount).toEqual(1.2);
      expect(boostsUsed).toEqual([
        { name: "Fruitful Blend", value: "+0.1" },
        { name: "Fruitful Bounty", value: "+0.1" },
      ]);
    });
    it("gives +1 Lemon yield when Zesty Vibes skill and Lemon", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: { "Zesty Vibes": 1 },
          },
        },
        name: "Lemon",
      });
      expect(amount).toEqual(2);
    });
    it("gives -0.25 fruit yield when Zesty Vibes skill and non-Tomato/Lemon patch fruit", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: { "Zesty Vibes": 1 },
          },
        },
        name: "Apple",
      });
      expect(amount).toEqual(0.75);
    });
    it("gives +1 fruit yield when Generous Orchard triggers (prng 20%)", () => {
      const itemId = KNOWN_IDS["Apple"];
      let triggerCounter: number | null = null;
      for (let c = 0; c < 1000; c++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter: c,
            chance: 20,
            criticalHitName: "Generous Orchard",
          })
        ) {
          triggerCounter = c;
          break;
        }
      }
      expect(triggerCounter).not.toBeNull();
      const { amount } = getFruitYield({
        prngArgs: { counter: triggerCounter!, farmId },
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: { "Generous Orchard": 1 },
          },
        },
        name: "Apple",
      });
      expect(amount).toEqual(2);
    });
    it("gives +0.25 fruit yield when faction wings equipped", () => {
      const { amount } = getFruitYield({
        prngArgs: { counter: 0, farmId },
        game: {
          ...TEST_FARM,
          faction: {
            name: "bumpkins",
            pledgedAt: 0,
            history: {},
          },
          bumpkin: {
            ...TEST_FARM.bumpkin,
            equipped: {
              ...TEST_FARM.bumpkin?.equipped,
              wings: "Bumpkin Quiver",
            },
          },
        },
        name: "Apple",
      });
      expect(amount).toEqual(1.25);
    });
  });
});

describe("harvestFruit — SPEED_BOOSTS speed windows", () => {
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const appleMs = PATCH_FRUIT_SEEDS["Apple Seed"].plantSeconds * 1000;

  const withApplePatch = (
    fruit: Partial<GameState["fruitPatches"][string]["fruit"]>,
    extra?: Partial<GameState>,
  ): GameState => ({
    ...GAME_STATE,
    fruitPatches: {
      0: {
        createdAt: dateNow,
        x: -2,
        y: 0,
        fruit: {
          name: "Apple",
          plantedAt: dateNow - appleMs,
          harvestedAt: 0,
          harvestsLeft: 3,
          baseDurationMs: appleMs,
          ...fruit,
        },
      },
    },
    ...extra,
  });

  it("replenishes with a real harvestedAt and a fresh baseDurationMs", () => {
    const state = harvestFruit({
      state: withApplePatch({}),
      action: { type: "fruit.harvested", index: "0" },
      createdAt: dateNow,
      farmId: 1,
    });

    const fruit = state.fruitPatches[0].fruit;
    expect(fruit?.harvestsLeft).toBe(2);
    expect(fruit?.harvestedAt).toBe(dateNow);
    expect(fruit?.baseDurationMs).toBe(appleMs);
  });

  it("is not harvestable at 1× when only half the base duration has elapsed", () => {
    expect(() =>
      harvestFruit({
        state: withApplePatch({ plantedAt: dateNow - appleMs / 2 }),
        action: { type: "fruit.harvested", index: "0" },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("Not ready");
  });

  it("a 2× totem window makes the same half-elapsed fruit harvestable", () => {
    const plantedAt = dateNow - appleMs / 2;
    const state = harvestFruit({
      state: withApplePatch(
        { plantedAt },
        {
          collectibles: {
            "Super Totem": [
              {
                id: "1",
                coordinates: { x: 5, y: 5 },
                createdAt: plantedAt,
                readyAt: plantedAt,
              },
            ],
          },
        },
      ),
      action: { type: "fruit.harvested", index: "0" },
      createdAt: dateNow,
      farmId: 1,
    });

    // Work = elapsed(appleMs/2) × 2 = appleMs → ready; harvest consumed one.
    expect(state.fruitPatches[0].fruit?.harvestsLeft).toBe(2);
  });

  it("a Turbofruit Mix fertiliser window speeds replenishment readiness", () => {
    // Only 80% of the base duration has elapsed → not ready at 1×, but the
    // 1.25× Turbofruit window over the whole grow completes the work.
    const plantedAt = dateNow - appleMs * 0.8;
    const state = harvestFruit({
      state: withApplePatch(
        { plantedAt },
        {
          fruitPatches: {
            0: {
              createdAt: dateNow,
              x: -2,
              y: 0,
              fertiliser: { name: "Turbofruit Mix", fertilisedAt: plantedAt },
              fruit: {
                name: "Apple",
                plantedAt,
                harvestedAt: 0,
                harvestsLeft: 3,
                baseDurationMs: appleMs,
              },
            },
          },
        },
      ),
      action: { type: "fruit.harvested", index: "0" },
      createdAt: dateNow,
      farmId: 1,
    });

    expect(state.fruitPatches[0].fruit?.harvestsLeft).toBe(2);
  });

  it("without the Turbofruit fertiliser the same 80%-elapsed fruit is NOT ready", () => {
    expect(() =>
      harvestFruit({
        state: withApplePatch({ plantedAt: dateNow - appleMs * 0.8 }),
        action: { type: "fruit.harvested", index: "0" },
        createdAt: dateNow,
        farmId: 1,
      }),
    ).toThrow("Not ready");
  });

  it("is harvestable exactly at the windowed readyAt boundary", () => {
    // Elapsed exactly baseDurationMs at 1× → readyAt boundary (>=).
    const state = harvestFruit({
      state: withApplePatch({ plantedAt: dateNow - appleMs }),
      action: { type: "fruit.harvested", index: "0" },
      createdAt: dateNow,
      farmId: 1,
    });
    expect(state.fruitPatches[0].fruit?.harvestsLeft).toBe(2);
  });

  it("keys off baseDurationMs even on mainnet (permanent per-fruit marker)", () => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    const plantedAt = dateNow - appleMs / 2;
    // Read path ignores the flag: a baseDurationMs fruit under a 2× totem is
    // ready even with SPEED_BOOSTS off.
    const ready = isFruitReadyToHarvest(
      dateNow,
      {
        name: "Apple",
        plantedAt,
        harvestedAt: 0,
        harvestsLeft: 3,
        baseDurationMs: appleMs,
      },
      {
        ...GAME_STATE,
        collectibles: {
          "Super Totem": [
            {
              id: "1",
              coordinates: { x: 5, y: 5 },
              createdAt: plantedAt,
              readyAt: plantedAt,
            },
          ],
        },
      },
    );
    expect(ready).toBe(true);
  });

  it("keeps baseDurationMs on a flag-off replenish (windowed fruit stays windowed)", () => {
    // Flag rolled back after the fruit was planted windowed: harvesting it must
    // NOT silently revert it to legacy timing — the marker persists so remaining
    // harvests stay on the windowed model.
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    const state = harvestFruit({
      state: withApplePatch({ plantedAt: dateNow - appleMs }),
      action: { type: "fruit.harvested", index: "0" },
      createdAt: dateNow,
      farmId: 1,
    });

    const fruit = state.fruitPatches[0].fruit;
    expect(fruit?.harvestsLeft).toBe(2);
    expect(fruit?.baseDurationMs).toBe(appleMs);
    // Real harvestedAt (not back-dated) — windowed replenish.
    expect(fruit?.harvestedAt).toBe(dateNow);
  });
});
