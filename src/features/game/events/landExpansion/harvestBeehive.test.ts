import { Beehive, CropPlot, FlowerBed } from "features/game/types/game";
import { HARVEST_BEEHIVE_ERRORS, harvestBeehive } from "./harvestBeehive";
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
});
