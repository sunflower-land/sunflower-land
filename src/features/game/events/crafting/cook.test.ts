import Decimal from "decimal.js-light";
import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  TEST_FARM,
} from "features/game/lib/constants";
import { COOKABLES } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import {
  cook,
  getCookingOilBoost,
  getOilConsumption,
  getReadyAt,
} from "./cook";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { getCookingTime } from "features/game/expansion/lib/boosts";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
};

const createdAt = Date.now();

describe("cook", () => {
  it("does not cook if building does not exist", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "123",
        },
        createdAt,
      }),
    ).toThrow(`Required building does not exist`);
  });

  it("does not cook if building is not placed", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                coordinates: { x: 2, y: 3 },
                readyAt: 1660563190206,
                createdAt: 1660563160206,
                id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
              },
            ],
          },
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "123",
        },
        createdAt,
      }),
    ).toThrow(`Required building does not exist`);
  });

  it("does not cook if there are no available slots", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                coordinates: {
                  x: 2,
                  y: 3,
                },
                readyAt: 1660563190206,
                createdAt: 1660563160206,
                id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
                crafting: [
                  {
                    name: "Boiled Eggs",
                    readyAt: createdAt + 60 * 1000,
                  },
                  {
                    name: "Boiled Eggs",
                    readyAt: createdAt + 60 * 1000,
                  },
                  {
                    name: "Boiled Eggs",
                    readyAt: createdAt + 60 * 1000,
                  },
                  {
                    name: "Boiled Eggs",
                    readyAt: createdAt + 60 * 1000,
                  },
                ],
              },
            ],
          },
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
        },
        createdAt,
      }),
    ).toThrow("No available slots");
  });

  it("does not cook if player does not have all the ingredients", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          inventory: {},
          buildings: {
            "Fire Pit": [
              {
                coordinates: {
                  x: 2,
                  y: 3,
                },
                readyAt: 1660563190206,
                createdAt: 1660563160206,
                id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
              },
            ],
          },
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
        },
        createdAt,
      }),
    ).toThrow("Insufficient ingredient: Egg");
  });

  it("subtracts required ingredients from inventory", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: { Egg: new Decimal(22) },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
      createdAt,
    });

    expect(state.inventory["Egg"]).toEqual(new Decimal(12));
  });

  it("does not affect existing inventory", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(22),
          Radish: new Decimal(2),
          Gold: new Decimal(4),
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
      createdAt,
    });

    expect(state.inventory["Radish"]).toEqual(new Decimal(2));
    expect(state.inventory["Gold"]).toEqual(new Decimal(4));
  });

  it("adds the crafting state to the building data structure", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(20),
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
      createdAt,
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting?.[0]).toEqual(
      expect.objectContaining({
        name: "Boiled Eggs",
        readyAt: expect.any(Number),
      }),
    );
  });

  it("subtracts oil from building", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(20),
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1000,
              createdAt: 1000,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
              oil: 10,
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
      createdAt,
    });

    const oilconsumed = getOilConsumption("Fire Pit", "Boiled Eggs");
    expect(state.buildings["Fire Pit"]?.[0].oil).toEqual(10 - oilconsumed);
  });

  it("applies partial boost if not enough oil", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(20),
          Sunflower: new Decimal(1000),
          Potato: new Decimal(1000),
        },
        buildings: {
          Deli: [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
              oil: 10,
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Fancy Fries",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
      createdAt,
    });

    const readyAt = createdAt + 60 * 60 * 16 * 1000;

    expect(state.buildings["Deli"]?.[0].crafting?.[0]).toEqual(
      expect.objectContaining({
        name: "Fancy Fries",
        readyAt: readyAt,
      }),
    );
  });

  it("requires two times the food cook requirement with Double Nom skill", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(20),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Double Nom": 1 },
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1000,
              createdAt: 1000,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
              oil: 0,
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
      createdAt,
    });

    expect(state.inventory["Egg"]).toEqual(new Decimal(0));
  });

  it("adds another recipe to the building if there is a slot available", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Potato: new Decimal(1000),
        },
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: createdAt }],
          expiresAt: createdAt + 31 * 24 * 60 * 60 * 1000,
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: { x: 2, y: 3 },
              readyAt: 1000,
              createdAt: 1000,
              id: "blah",
              oil: 0,
              crafting: [
                {
                  name: "Boiled Eggs",
                  readyAt: createdAt + 60 * 1000,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Mashed Potato",
        buildingId: "blah",
      },
      createdAt,
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting?.[1]).toEqual(
      expect.objectContaining({
        name: "Mashed Potato",
        readyAt: expect.any(Number),
      }),
    );
  });

  it("adds the correct readyAt for the second recipe when a recipe is already cooking", () => {
    const firstReadyAt = createdAt + 60 * 1000;
    const cookingSeconds = COOKABLES["Mashed Potato"].cookingSeconds;

    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Potato: new Decimal(1000),
        },
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: createdAt }],
          expiresAt: createdAt + 31 * 24 * 60 * 60 * 1000,
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: { x: 2, y: 3 },
              readyAt: 1000,
              createdAt: 1000,
              id: "blah",
              oil: 0,
              crafting: [
                {
                  name: "Boiled Eggs",
                  readyAt: createdAt + 60 * 1000,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Mashed Potato",
        buildingId: "blah",
      },
      createdAt,
    });

    const readyAt = firstReadyAt + cookingSeconds * 1000;

    expect(state.buildings["Fire Pit"]?.[0].crafting?.[1].readyAt).toEqual(
      readyAt,
    );
  });

  it("adds the correct readyAt for the second recipe when a recipe is already cooked", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Potato: new Decimal(100),
        },
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: createdAt }],
          expiresAt: createdAt + 31 * 24 * 60 * 60 * 1000,
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: { x: 2, y: 3 },
              readyAt: 1000,
              createdAt: 1000,
              id: "blah",
              oil: 0,
              crafting: [
                {
                  name: "Boiled Eggs",
                  readyAt: createdAt - 60 * 60 * 1000, // Finished 1 hour ago
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Mashed Potato",
        buildingId: "blah",
      },
      createdAt,
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting?.[1].readyAt).toBeCloseTo(
      createdAt + COOKABLES["Mashed Potato"].cookingSeconds * 1000,
    );
  });
});

describe("getReadyAt", () => {
  it("applies 50% speed boost with Luna's Hat", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Boiled Eggs",
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: { ...INITIAL_BUMPKIN.equipped, hat: "Luna's Hat" },
        },
      },

      createdAt: now,
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.5;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies 25% speed boost with Faction Medallion", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            necklace: "Goblin Medallion",
          },
        },
        faction: {
          name: "goblins",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
      },
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.25;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies a -15% cooking time boost when Master Chef's Cleaver is equipped", () => {
    const now = createdAt;

    const state: GameState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_FARM.bumpkin,
        equipped: {
          ...INITIAL_FARM.bumpkin.equipped,
          tool: "Master Chef's Cleaver",
        },
      },
      buildings: {
        Deli: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: now,
            id: "1",
            readyAt: 0,
            oil: 24,
          },
        ],
      },
    };

    const time = getCookingTime({
      seconds: COOKABLES["Fermented Fish"].cookingSeconds,
      item: "Fermented Fish",
      game: state,
      cookStartAt: now,
    }).reducedSecs;

    expect(time).toEqual(COOKABLES["Fermented Fish"].cookingSeconds * 0.85);
  });

  it("does not apply 25% speed boost with Faction Medallion when pledged in different Faction", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            necklace: "Goblin Medallion",
          },
        },
        faction: {
          name: "nightshades",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
      },
    });

    const readyAt = now + COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    expect(time).toEqual(readyAt);
  });

  it("does not apply 25% speed boost with Faction Medallion when not pledged in a Faction", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            necklace: "Goblin Medallion",
          },
        },
      },
    });

    const readyAt = now + COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies Time Warp Totem", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Boiled Eggs",
      game: {
        ...TEST_FARM,
        collectibles: {
          "Time Warp Totem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: now,
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.5;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies Super Totem", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Boiled Eggs",
      game: {
        ...TEST_FARM,
        collectibles: {
          "Super Totem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: now,
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.5;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("doesn't stack Super Totem and Time Warp Totem", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Boiled Eggs",
      game: {
        ...TEST_FARM,
        collectibles: {
          "Time Warp Totem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
          "Super Totem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: now,
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.5;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies desert gnome boost", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Boiled Eggs",
      createdAt: now,
      game: {
        ...TEST_FARM,
        collectibles: {
          "Desert Gnome": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: createdAt,
              id: "1",
              readyAt: createdAt,
            },
          ],
        },
      },
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.1;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("boosts Fire Pit time by 20% with enough oil to finish cooking", () => {
    const now = createdAt;
    const FirePit = {
      coordinates: { x: 1, y: 1 },
      createdAt: createdAt,
      id: "1",
      readyAt: createdAt,
      oil: 10,
    };

    const { createdAt: result } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt: now,
      game: {
        ...TEST_FARM,
        buildings: {
          "Fire Pit": [FirePit],
        },
      },
    });

    const readyAt = now + COOKABLES["Boiled Eggs"].cookingSeconds * 0.8 * 1000;

    expect(result).toEqual(readyAt);
  });

  it("applies Gourmet Hourglass boost of +50% cooking speed for 4 hours", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00Z").getTime());

    const now = createdAt;

    const state: GameState = {
      ...GAME_STATE,
      buildings: {
        Kitchen: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: createdAt,
            id: "1",
            readyAt: 0,
            oil: 0,
          },
        ],
      },
      collectibles: {
        "Gourmet Hourglass": [
          {
            coordinates: { x: 1, y: 1 },
            createdAt: createdAt,
            id: "1",
            readyAt: createdAt,
          },
        ],
      },
    };

    const { createdAt: boostedTime } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt: now,
      game: state,
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.5;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(boostedTime).toEqual(readyAt);

    jest.useRealTimers();
  });

  it("does not apply expired Gourmet Hourglass boost of +50% cooking speed for 4 hours", () => {
    const now = createdAt;
    const fiveHoursAgo = now - 5 * 60 * 60 * 1000;

    const state: GameState = {
      ...GAME_STATE,
      buildings: {
        Kitchen: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: createdAt,
            id: "1",
            readyAt: 0,
            oil: 0,
          },
        ],
      },
      collectibles: {
        "Gourmet Hourglass": [
          {
            coordinates: { x: 1, y: 1 },
            createdAt: fiveHoursAgo,
            id: "1",
            readyAt: fiveHoursAgo,
          },
        ],
      },
    };

    const { createdAt: time } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt: now,
      game: state,
    });

    const readyAt = now + COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies 10% speed boost on Firepit with Fast Feasts skill", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Boiled Eggs",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Fast Feasts": 1 } },
      },
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.1;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies 10% speed boost on Kitchen with Fast Feasts skill", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Sunflower Crunch",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Fast Feasts": 1 } },
      },
    });

    const boost = COOKABLES["Sunflower Crunch"].cookingSeconds * 0.1;

    const readyAt =
      now + (COOKABLES["Sunflower Crunch"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies a 40% speed boost on Fire Pit when using oil with Swift Sizzle skill", () => {
    const game: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        skills: { "Swift Sizzle": 1 },
      },
      buildings: {
        "Fire Pit": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: createdAt,
            id: "1",
            readyAt: 0,
            oil: 1,
          },
        ],
      },
    };

    const time = getCookingOilBoost("Boiled Eggs", game, "1").timeToCook;

    expect(time).toEqual(60 * 60 * 0.6);
  });

  it("does not apply Swift Sizzle boost on Kitchen", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Sunflower Crunch",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Swift Sizzle": 1 } },
      },
    });

    const readyAt = now + COOKABLES["Sunflower Crunch"].cookingSeconds * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies a 10% speed boost on cakes with Frosted Cakes skill", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Parsnip Cake",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Frosted Cakes": 1 } },
      },
    });

    const boost = COOKABLES["Parsnip Cake"].cookingSeconds * 0.1;

    const readyAt =
      now + (COOKABLES["Parsnip Cake"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies a 50% speed boost on Kitchen when using oil with Turbo Fry skill", () => {
    const game: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        skills: {
          "Turbo Fry": 1,
        },
      },
      buildings: {
        Kitchen: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: createdAt,
            id: "1",
            readyAt: 0,
            oil: 10,
          },
        ],
      },
    };

    const time = getCookingOilBoost("Fruit Salad", game, "1").timeToCook;

    expect(time).toEqual(COOKABLES["Fruit Salad"].cookingSeconds * 0.5);
  });

  it("does not apply Turbo Fry boost on Fire Pit", () => {
    const now = createdAt;

    const { createdAt: time } = getReadyAt({
      buildingId: "123",
      item: "Boiled Eggs",
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Turbo Fry": 1 } },
      },
    });

    const readyAt = now + COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies a 60% speed boost on Deli meals when using Oil with Fry Frenzy skill", () => {
    const game: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        skills: {
          "Fry Frenzy": 1,
        },
      },
      buildings: {
        Deli: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: createdAt,
            id: "1",
            readyAt: 0,
            oil: 24,
          },
        ],
      },
    };

    const time = getCookingOilBoost("Fermented Fish", game, "1").timeToCook;

    expect(time).toEqual(COOKABLES["Fermented Fish"].cookingSeconds * 0.4);
  });

  it("partial boost if oil is less than cooking required oil", () => {
    const game = {
      ...TEST_FARM,
      buildings: {
        Deli: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: createdAt,
            id: "1",
            readyAt: 0,
            oil: 6,
          },
        ],
      },
    };

    const boost = getCookingOilBoost("Fermented Carrots", game, "1");

    // Deli consumption is 12 oil per day
    // Deli boost is 0.4 (40% speed boost, meaning 60% of the original time)
    // Full boosted time will be 14.4 hours (86400 * 0.6 = 51840 seconds)
    // With half the oil (6 out of 12), the boost should be half as effective (20% boost)
    // Expected time = 86400 * 0.8 = 69120 seconds = 19.2 hours
    expect(boost.timeToCook).toEqual(60 * 60 * 19.2);
    expect(boost.oilConsumed).toEqual(6);
  });

  it("does not apply Gourmet Hourglass boost to queued recipe when boost expires before cooking starts", () => {
    const now = createdAt;

    // First recipe (Boiled Eggs) will finish in 10 seconds
    const eggReadyAt = now + 10 * 1000;

    // Hourglass expires in 1 second
    const hourglassCreatedAt =
      now - (EXPIRY_COOLDOWNS["Gourmet Hourglass"] as number) + 1 * 1000;

    const mashedPotatoCookingTime =
      COOKABLES["Mashed Potato"].cookingSeconds * 1000;

    const state = cook({
      state: {
        ...TEST_FARM,
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: now }],
          expiresAt: now + 31 * 24 * 60 * 60 * 1000,
        },
        inventory: {
          Potato: new Decimal(100),
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
              crafting: [
                {
                  name: "Boiled Eggs",
                  readyAt: eggReadyAt,
                },
              ],
            },
          ],
        },
        collectibles: {
          "Gourmet Hourglass": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: hourglassCreatedAt,
              id: "1",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Mashed Potato",
        buildingId: "1",
      },
      createdAt: now,
    });

    const building = state.buildings["Fire Pit"]?.[0];
    const queuedRecipe = building?.crafting?.[1];

    // Mashed Potato should start after eggs finish (eggReadyAt)
    // and cook for the full duration since boost will have expired
    expect(queuedRecipe?.readyAt).toEqual(eggReadyAt + mashedPotatoCookingTime);

    expect(building?.crafting?.[0]).toEqual({
      name: "Boiled Eggs",
      readyAt: eggReadyAt,
    });
  });

  it("applies the Gourmet Hourglass boost if the queued recipe will start before the boost expires", () => {
    const now = createdAt;
    // Hourglass expires in 30 minutes
    const hourglassCreatedAt =
      now - (EXPIRY_COOLDOWNS["Gourmet Hourglass"] as number) + 30 * 60 * 1000;
    const cookTimeMs = COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    const state = cook({
      state: {
        ...TEST_FARM,
        inventory: {
          Egg: new Decimal(100),
        },
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: now }],
          expiresAt: now + 31 * 24 * 60 * 60 * 1000,
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
              crafting: [
                {
                  name: "Boiled Eggs",
                  readyAt: now + 29 * 60 * 1000, // Ready in 29 minutes
                },
              ],
            },
          ],
        },
        collectibles: {
          "Gourmet Hourglass": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: hourglassCreatedAt,
              id: "1",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "1",
      },
      createdAt: now,
    });

    const building = state.buildings["Fire Pit"]?.[0];
    const currentRecipeReadyAt = building?.crafting?.[0]?.readyAt as number;
    const nextRecipeReadyAt = building?.crafting?.[1]?.readyAt;

    expect(nextRecipeReadyAt).toEqual(currentRecipeReadyAt + cookTimeMs * 0.5);
  });

  it("applies the Boar Shrine boost", () => {
    const cookTimeMs = COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    const { createdAt: time } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt,
      game: {
        ...TEST_FARM,
        collectibles: {
          "Boar Shrine": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt,
              id: "1",
              readyAt: createdAt,
            },
          ],
        },
      },
    });

    expect(time).toEqual(createdAt + cookTimeMs * 0.8);
  });

  it("does not apply the Boar Shrine boost if expired", () => {
    const cookTimeMs = COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    const { createdAt: time } = getReadyAt({
      buildingId: "1",
      item: "Boiled Eggs",
      createdAt,
      game: {
        ...TEST_FARM,
        collectibles: {
          "Boar Shrine": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: createdAt - EXPIRY_COOLDOWNS["Boar Shrine"],
              id: "1",
              readyAt: createdAt,
            },
          ],
        },
      },
    });

    expect(time).toEqual(createdAt + cookTimeMs);
  });
});

describe("getCookingOilBoost", () => {
  it("returns 60 minutes for Boiled Egg if no oil", () => {
    const time = getCookingOilBoost("Boiled Eggs", TEST_FARM, "1").timeToCook;

    expect(time).toEqual(60 * 60);
  });

  it("boosts Fire Pit time by 20% with oil", () => {
    const game = {
      ...TEST_FARM,
      buildings: {
        "Fire Pit": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: createdAt,
            id: "1",
            readyAt: 0,
            oil: 1,
          },
        ],
      },
    };

    const time = getCookingOilBoost("Boiled Eggs", game, "1").timeToCook;

    expect(time).toEqual(60 * 60 * 0.8);
  });
});

describe("getOilConsumption", () => {
  it("consumes 1 oil for Boiled Egg", () => {
    const oil = getOilConsumption("Deli", "Fermented Carrots");

    expect(oil).toEqual(12);
  });

  it("consumes 20 oil for Parsnip Cake", () => {
    const oil = getOilConsumption("Bakery", "Parsnip Cake");

    expect(oil).toEqual(10);
  });
});
