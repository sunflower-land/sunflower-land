import type { Beehive, CropPlot, FlowerBed } from "features/game/types/game";
import {
  HARVEST_BEEHIVE_ERRORS,
  getFullHiveHoneyYield,
  harvestBeehive,
} from "./harvestBeehive";
import {
  TEST_FARM,
  INITIAL_BUMPKIN,
  INITIAL_FARM,
} from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";

describe("harvestBeehive", () => {
  const now = Date.now();

  const DEFAULT_BEEHIVE: Beehive = {
    x: 3,
    y: 3,
    swarm: false,
    honey: { updatedAt: 0, produced: 0 },
    flowers: [],
  };

  const DEFAULT_FLOWER_BED: FlowerBed = {
    createdAt: now,
    x: 0,
    y: 0,
    flower: {
      name: "Red Pansy",
      plantedAt: now,
    },
  };

  it("does not harvest a beehive that is not placed", () => {
    expect(() =>
      harvestBeehive({
        state: {
          ...TEST_FARM,
        },
        action: {
          type: "beehive.harvested",
          id: "1234",
        },
      }),
    ).toThrow(HARVEST_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
  });

  it("doesn't harvest a beehive that has no honey", () => {
    const beehiveId = "1234";

    expect(() =>
      harvestBeehive({
        state: {
          ...TEST_FARM,
          beehives: {
            [beehiveId]: { ...DEFAULT_BEEHIVE },
          },
        },
        action: {
          type: "beehive.harvested",
          id: beehiveId,
        },
      }),
    ).toThrow(HARVEST_BEEHIVE_ERRORS.NO_HONEY);
  });

  it("harvests a full beehive", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(1));
  });

  it("harvests a partially full beehive", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME / 2,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(0.5));
  });

  it("does not add a crop boost when there is no swarm", () => {
    const state = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: 0,
              produced: 1000,
            },
          },
        },
        crops: {
          "987": {
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              plantedAt: 0,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
    });

    expect(state.crops?.["987"].beeSwarm).toBeUndefined();
  });

  it("does not activate a swarm when the hive is not full", () => {
    const state = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            swarm: true,
            honey: {
              updatedAt: 0,
              produced: 500,
            },
          },
        },
        crops: {
          "987": {
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              plantedAt: 0,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
    });

    expect(state.crops?.["987"].beeSwarm).toBeUndefined();
  });

  it("activates the swarm when the hive is full adding 0.2 crop boost to planted crops", () => {
    const state = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            swarm: true,
            honey: {
              updatedAt: 0,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
        crops: {
          "987": {
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              plantedAt: 0,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
    });

    expect(state.crops?.["987"].beeSwarm).toMatchObject({
      count: 1,
      swarmActivatedAt: expect.any(Number),
    });
  });

  it("Adds to the swarm counter when there is no crop planted", () => {
    const crops: Record<string, CropPlot> = {
      "1": {
        x: 0,
        y: -2,
        createdAt: 0,
      },
      "2": {
        x: 1,
        y: -2,
        createdAt: 0,
      },
    };
    const state = harvestBeehive({
      state: {
        ...INITIAL_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            swarm: true,
            honey: {
              updatedAt: 0,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
        crops,
      },
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
      createdAt: now,
    });

    expect(state.crops).toEqual({
      "1": {
        x: 0,
        y: -2,
        createdAt: 0,
        beeSwarm: {
          count: 1,
          swarmActivatedAt: now,
        },
      },
      "2": {
        x: 1,
        y: -2,
        createdAt: 0,
        beeSwarm: {
          count: 1,
          swarmActivatedAt: now,
        },
      },
    });
  });

  it("Stacks the swarm counter when there is no crop planted", () => {
    const crops: Record<string, CropPlot> = {
      "1": {
        x: 0,
        y: -2,
        createdAt: 0,
        beeSwarm: {
          count: 1,
          swarmActivatedAt: now,
        },
      },
      "2": {
        x: 1,
        y: -2,
        createdAt: 0,
        beeSwarm: {
          count: 1,
          swarmActivatedAt: now,
        },
      },
    };
    const state = harvestBeehive({
      state: {
        ...INITIAL_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            swarm: true,
            honey: {
              updatedAt: 0,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
        crops,
      },
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
      createdAt: now,
    });

    expect(state.crops).toEqual({
      "1": {
        x: 0,
        y: -2,
        createdAt: 0,
        beeSwarm: {
          count: 2,
          swarmActivatedAt: now,
        },
      },
      "2": {
        x: 1,
        y: -2,
        createdAt: 0,
        beeSwarm: {
          count: 2,
          swarmActivatedAt: now,
        },
      },
    });
  });

  it("sets the swarm to false after activating the swarm", () => {
    const state = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            swarm: true,
            honey: {
              updatedAt: 0,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
        crops: {
          "987": {
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              plantedAt: 0,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
    });

    expect(state.beehives?.["1234"].swarm).toEqual(false);
  });

  it("adds bumpkin activity for honey harvested from a full hive", () => {
    const amount = 1;
    const state = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            swarm: true,
            honey: {
              updatedAt: 0,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      createdAt: Date.now(),
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
    });
    expect(state.farmActivity["Honey Harvested"]).toEqual(amount);
  });

  it("adds bumpkin activity for honey harvested from a partially full hive", () => {
    const amount = 0.5;
    const state = harvestBeehive({
      state: {
        ...TEST_FARM,
        beehives: {
          "1234": {
            ...DEFAULT_BEEHIVE,
            swarm: false,
            honey: {
              updatedAt: 0,
              produced: DEFAULT_HONEY_PRODUCTION_TIME / 2,
            },
          },
        },
      },
      createdAt: Date.now(),
      action: {
        type: "beehive.harvested",
        id: "1234",
      },
    });
    expect(state.farmActivity["Honey Harvested"]).toEqual(amount);
  });

  it("updates the beehives", () => {
    const beehiveId = "1234";
    const flowerId = "5678";
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerId]: {
              ...DEFAULT_FLOWER_BED,
              flower: {
                name: "Red Pansy",
                plantedAt: fiveMinutesAgo,
              },
            },
          },
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: fiveMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId].flowers).toHaveLength(1);
  });

  it("harvests a full beehive wearing Bee Suit", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            suit: "Bee Suit",
          },
        },

        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(1.1));
  });

  it("harvests a full beehive wearing Honeycomb Shield", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Honeycomb Shield",
          },
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(2));
  });

  it("harvests a full beehive when King of Bears placed", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        collectibles: {
          "King of Bears": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      swarm: expect.any(Boolean),
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(1.25));
  });

  it("harvests a full beehive wearing Honeycomb Shield and Bee Suit", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            suit: "Bee Suit",
            secondaryTool: "Honeycomb Shield",
          },
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(2.1));
  });

  it("harvests a half full beehive wearing Honeycomb Shield and Bee Suit", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            suit: "Bee Suit",
            secondaryTool: "Honeycomb Shield",
          },
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME / 2,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(2.1 / 2));
  });

  it("harvests +0.1 honey with Sweet Bonus skill", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            ...INITIAL_BUMPKIN.skills,
            "Sweet Bonus": 1,
          },
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.beehives?.[beehiveId]).toEqual({
      ...DEFAULT_BEEHIVE,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
    });
    expect(gameState.inventory.Honey).toEqual(new Decimal(1.1));
  });

  describe("Sweet Bonus ranks", () => {
    const harvestWithRank = (rank: number) => {
      const beehiveId = "1234";
      const now = Date.now();
      const tenMinutesAgo = now - 10 * 60 * 1000;

      return harvestBeehive({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: { ...INITIAL_BUMPKIN.skills, "Sweet Bonus": rank },
          },
          beehives: {
            [beehiveId]: {
              ...DEFAULT_BEEHIVE,
              honey: {
                updatedAt: tenMinutesAgo,
                produced: DEFAULT_HONEY_PRODUCTION_TIME,
              },
            },
          },
        },
        action: {
          type: "beehive.harvested",
          id: beehiveId,
        },
        createdAt: now,
      });
    };

    it("harvests +0.15 honey with Sweet Bonus at rank 2", () => {
      expect(harvestWithRank(2).inventory.Honey).toEqual(new Decimal(1.15));
    });

    it("harvests +0.2 honey with Sweet Bonus at rank 3", () => {
      expect(harvestWithRank(3).inventory.Honey).toEqual(new Decimal(1.2));
    });
  });
  it("adds +0.05 honey when harvesting a full beehive with Ruins Flower placed", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        collectibles: {
          "Ruins Flower": [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 } },
          ],
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.inventory.Honey).toEqual(new Decimal(1.05));
  });

  it("does not add honey for a partial hive with Ruins Flower placed", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        collectibles: {
          "Ruins Flower": [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 } },
          ],
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME / 2,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.inventory.Honey).toEqual(new Decimal(0.5));
  });

  it("does not add honey when Ruins Flower is only in the inventory", () => {
    const beehiveId = "1234";
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Ruins Flower": new Decimal(1),
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: tenMinutesAgo,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: {
        type: "beehive.harvested",
        id: beehiveId,
      },
      createdAt: now,
    });

    expect(gameState.inventory.Honey).toEqual(new Decimal(1));
  });
});

describe("getFullHiveHoneyYield", () => {
  const now = Date.now();

  const DEFAULT_BEEHIVE: Beehive = {
    x: 3,
    y: 3,
    swarm: false,
    honey: { updatedAt: 0, produced: 0 },
    flowers: [],
  };

  it("returns a full hive's base amount with no boosts", () => {
    expect(getFullHiveHoneyYield(TEST_FARM).yield).toEqual(1);
  });

  it("adds Ruins Flower's flat +0.05 when it is placed", () => {
    const { yield: honeyYield, boostsUsed } = getFullHiveHoneyYield({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Ruins Flower": [
          {
            id: "1",
            createdAt: 0,
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
          },
        ],
      },
    });

    expect(honeyYield).toEqual(1.05);
    expect(boostsUsed).toContainEqual({
      name: "Ruins Flower",
      value: "+0.05",
    });
  });

  it("does not add anything when Ruins Flower is only in the inventory", () => {
    expect(
      getFullHiveHoneyYield({
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Ruins Flower": new Decimal(1),
        },
      }).yield,
    ).toEqual(1);
  });

  it("is not scaled by the honey multiplier", () => {
    const beehiveId = "1234";
    // Honeycomb Shield takes the multiplier to 2. If Ruins Flower were folded
    // into the multiplier the payout would be (1 + 0.05) * 2 = 2.1; it is a
    // flat post-multiplier add, so it must be 1 * 2 + 0.05 = 2.05.
    const state = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        equipped: {
          ...TEST_FARM.bumpkin.equipped,
          secondaryTool: "Honeycomb Shield" as const,
        },
      },
      collectibles: {
        ...TEST_FARM.collectibles,
        "Ruins Flower": [
          { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
        ],
      },
    };

    const gameState = harvestBeehive({
      state: {
        ...state,
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: now - 10 * 60 * 1000,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: { type: "beehive.harvested", id: beehiveId },
      createdAt: now,
    });

    expect(gameState.inventory.Honey).toEqual(new Decimal(2.05));
    expect(getFullHiveHoneyYield(state).yield).toEqual(2.05);
  });

  it("matches what a full hive actually pays out", () => {
    const beehiveId = "1234";
    const collectibles = {
      ...TEST_FARM.collectibles,
      "Ruins Flower": [
        { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
      ],
    };

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        collectibles,
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: now - 10 * 60 * 1000,
              produced: DEFAULT_HONEY_PRODUCTION_TIME,
            },
          },
        },
      },
      action: { type: "beehive.harvested", id: beehiveId },
      createdAt: now,
    });

    expect(gameState.inventory.Honey).toEqual(
      new Decimal(getFullHiveHoneyYield({ ...TEST_FARM, collectibles }).yield),
    );
  });
});
