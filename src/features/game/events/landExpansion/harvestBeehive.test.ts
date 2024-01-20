import { Beehive, FlowerBed } from "features/game/types/game";
import { HARVEST_BEEHIVE_ERRORS, harvestBeehive } from "./harvestBeehive";
import { TEST_FARM } from "features/game/lib/constants";
import { HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import Decimal from "decimal.js-light";

describe("harvestBeehive", () => {
  const now = Date.now();

  const DEFAULT_BEEHIVE: Beehive = {
    x: 3,
    y: 3,
    swarm: false,
    height: 1,
    width: 1,
    honey: { updatedAt: 0, produced: 0 },
    flowers: [],
  };

  const DEFAULT_FLOWER_BED: FlowerBed = {
    createdAt: now,
    x: 0,
    y: 0,
    height: 1,
    width: 2,
    flower: {
      name: "Flower 1",
      amount: 1,
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
      })
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
      })
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
              produced: HONEY_PRODUCTION_TIME,
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
              produced: HONEY_PRODUCTION_TIME / 2,
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
            height: 1,
            width: 1,
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              amount: 1,
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

    expect(state.crops?.["987"].crop?.amount).toEqual(1);
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
            height: 1,
            width: 1,
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              amount: 1,
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

    expect(state.crops?.["987"].crop?.amount).toEqual(1);
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
              produced: HONEY_PRODUCTION_TIME,
            },
          },
        },
        crops: {
          "987": {
            height: 1,
            width: 1,
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              amount: 1,
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

    expect(state.crops?.["987"].crop?.amount).toEqual(1.2);
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
              produced: HONEY_PRODUCTION_TIME,
            },
          },
        },
        crops: {
          "987": {
            height: 1,
            width: 1,
            x: 0,
            y: -2,
            createdAt: 0,
            crop: {
              name: "Potato",
              amount: 1,
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

  it("updates the beehives", () => {
    const beehiveId = "1234";
    const flowerId = "5678";
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    const gameState = harvestBeehive({
      state: {
        ...TEST_FARM,
        flowers: {
          [flowerId]: {
            ...DEFAULT_FLOWER_BED,
            flower: {
              name: "Flower 1",
              amount: 1,
              plantedAt: fiveMinutesAgo,
            },
          },
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: fiveMinutesAgo,
              produced: HONEY_PRODUCTION_TIME,
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

    expect(gameState.beehives?.[beehiveId].flowers).toHaveLength(0);
  });
});
