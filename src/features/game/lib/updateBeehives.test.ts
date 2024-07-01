import { FLOWER_SEEDS } from "../types/flowers";
import {
  Beehive,
  Beehives,
  FlowerBed,
  FlowerBeds,
  GameState,
} from "../types/game";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  DEFAULT_HONEY_PRODUCTION_TIME,
  updateBeehives,
} from "./updateBeehives";

describe("updateBeehives", () => {
  const now = Date.now();

  const FLOWER_GROW_TIME = FLOWER_SEEDS()["Sunpetal Seed"].plantSeconds * 1000;

  const DEFAULT_FLOWER_BED: FlowerBed = {
    createdAt: now,
    x: 0,
    y: 0,
    height: 1,
    width: 2,
    flower: {
      name: "Red Pansy",
      amount: 1,
      plantedAt: now,
    },
  };

  const DEFAULT_BEEHIVE: Beehive = {
    x: 3,
    y: 3,
    height: 1,
    width: 1,
    swarm: false,
    honey: { updatedAt: now, produced: 0 },
    flowers: [],
  };

  it("does not update beehives if none are placed", () => {
    const beehives = {};
    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives },
      createdAt: now,
    });
    expect(updatedBeehives).toEqual({});
  });

  it("does not update beehives if there are no flowers growing", () => {
    const beehives: Beehives = {
      "1": {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [],
      },
    };
    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives },
      createdAt: now,
    });

    expect(updatedBeehives).toEqual(beehives);
  });

  it("attaches a flower to an unattached beehive", () => {
    const beehives: Beehives = {
      "1": {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = { "1": DEFAULT_FLOWER_BED };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives).toMatchObject({
      "1": {
        flowers: [
          {
            id: "1",
          },
        ],
      },
    });
  });

  it("attaches two flowers to two beehives", () => {
    const beehives: Beehives = {
      "1": {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [],
      },
      "2": {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = {
      "1": DEFAULT_FLOWER_BED,
      "2": DEFAULT_FLOWER_BED,
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(Object.values(updatedBeehives)[0].flowers.length).toEqual(1);
    expect(Object.values(updatedBeehives)[1].flowers.length).toEqual(1);
  });

  it("attaches two flowers to one beehive", () => {
    const flowerId1 = "123";
    const flowerId2 = "456";
    const beehiveId = "abc";
    const fiveMinutes = 5 * 60 * 1000;
    const twoMinutes = 2 * 60 * 1000;

    const flower1PlantedAt = now - FLOWER_GROW_TIME + fiveMinutes;
    const flower2PlantedAt = now - FLOWER_GROW_TIME + twoMinutes;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: flower1PlantedAt,
        },
      },
      [flowerId2]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: flower2PlantedAt,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].flowers.length).toEqual(2);
  });

  it("attaches one flower to two beehives", () => {
    const flowerId = "123";
    const beehiveId1 = "abc";
    const beehiveId2 = "def";

    const halfTime = DEFAULT_HONEY_PRODUCTION_TIME / 2;

    const beehives: Beehives = {
      [beehiveId1]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: halfTime },
        flowers: [],
      },
      [beehiveId2]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: halfTime },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers.length).toEqual(1);
    expect(updatedBeehives[beehiveId2].flowers.length).toEqual(1);
  });

  it("updates the honey produced on a beehive from one flower", () => {
    const flowerId = "123";
    const beehiveId = "abc";
    const tenMinutes = 10 * 60 * 1000;
    const tenMinutesAgo = now - tenMinutes;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: tenMinutesAgo, produced: 0 },
        flowers: [
          {
            id: flowerId,
            attachedAt: tenMinutesAgo,
            attachedUntil: tenMinutesAgo + FLOWER_GROW_TIME,
          },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId]: {
        ...DEFAULT_FLOWER_BED,
        flower: { name: "Red Pansy", amount: 1, plantedAt: tenMinutesAgo },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].honey.produced).toEqual(tenMinutes);
  });

  it("updates the honey produced on a beehive from two flowers", () => {
    const flowerId1 = "123";
    const flowerId2 = "456";
    const beehiveId = "abc";
    const tenMinutes = 10 * 60 * 1000;
    const eightMinutes = 8 * 60 * 1000;
    const fiveMinutes = 5 * 60 * 1000;
    const twoMinutes = 2 * 60 * 1000;

    const hivePlacedAt = now - tenMinutes;
    const flower1PlantedAt = now - FLOWER_GROW_TIME - fiveMinutes;
    const flower1FinishedAt = flower1PlantedAt + FLOWER_GROW_TIME;
    const flower2PlantedAt = now - FLOWER_GROW_TIME - twoMinutes;
    const flower2FinishedAt = flower2PlantedAt + FLOWER_GROW_TIME;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: hivePlacedAt, produced: 0 },
        flowers: [
          {
            id: flowerId1,
            attachedAt: hivePlacedAt,
            attachedUntil: flower1FinishedAt,
          },
          {
            id: flowerId2,
            attachedAt: flower1FinishedAt,
            attachedUntil: flower2FinishedAt,
          },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: flower1PlantedAt,
        },
      },
      [flowerId2]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: flower2PlantedAt,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].honey.produced).toEqual(eightMinutes);
  });

  it("does not attach a flower to an already full beehive", () => {
    const beehives: Beehives = {
      "2": {
        ...DEFAULT_BEEHIVE,
        honey: { produced: DEFAULT_HONEY_PRODUCTION_TIME, updatedAt: 0 },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = { "1": DEFAULT_FLOWER_BED };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    const attachedFlowerIds = Object.values(updatedBeehives)
      .flatMap((hive) => hive.flowers)
      .map((flower) => flower.id)
      .filter(Number);

    expect(attachedFlowerIds.length).toEqual(0);
  });

  it("does not update the honey past the time the flower is ready", () => {
    const flowerId = "123";
    const beehiveId = "abc";
    const tenMinutes = 10 * 60 * 1000;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: {
          updatedAt: now - DEFAULT_HONEY_PRODUCTION_TIME,
          produced: 0,
        },
        flowers: [
          {
            id: flowerId,
            attachedAt: now - DEFAULT_HONEY_PRODUCTION_TIME,
            attachedUntil: now - tenMinutes,
          },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - FLOWER_GROW_TIME - tenMinutes,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].honey.produced).toEqual(
      DEFAULT_HONEY_PRODUCTION_TIME - tenMinutes,
    );
  });

  it("does not update the honey past the time the beehive is full", () => {
    const flowerId = "123";
    const beehiveId = "abc";
    const tenMinutes = 10 * 60 * 1000;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: {
          updatedAt: now - DEFAULT_HONEY_PRODUCTION_TIME,
          produced: tenMinutes,
        },
        flowers: [
          {
            id: flowerId,
            attachedAt: now - DEFAULT_HONEY_PRODUCTION_TIME,
            attachedUntil: now - tenMinutes,
          },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - FLOWER_GROW_TIME,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].honey.produced).toEqual(
      DEFAULT_HONEY_PRODUCTION_TIME,
    );
  });

  it("set the attachedAt into the future", () => {
    const flowerId1 = "123";
    const flowerId2 = "456";
    const beehiveId1 = "abc";

    const halfTime = DEFAULT_HONEY_PRODUCTION_TIME / 2;

    const beehives: Beehives = {
      [beehiveId1]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [
          { attachedAt: now, attachedUntil: now + halfTime, id: flowerId1 },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - halfTime,
        },
      },
      [flowerId2]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers.length).toEqual(2);
    expect(updatedBeehives[beehiveId1].flowers[1].attachedAt).toEqual(
      now + halfTime,
    );
  });

  it("set the attachedUntil when the beehive is full", () => {
    const flowerId1 = "123";
    const beehiveId1 = "abc";

    const halfTime = DEFAULT_HONEY_PRODUCTION_TIME / 2;

    const beehives: Beehives = {
      [beehiveId1]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: halfTime },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers[0].attachedUntil).toEqual(
      now + halfTime,
    );
  });

  it("set the attachedUntil when the flower is full", () => {
    const flowerId1 = "123";
    const beehiveId1 = "abc";

    const quarterTime = FLOWER_GROW_TIME / 4;
    const threeQuarterTime = quarterTime * 3;

    const beehives: Beehives = {
      [beehiveId1]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - quarterTime,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers[0].attachedUntil).toEqual(
      now + threeQuarterTime,
    );
  });

  it("detaches a flower if hive is full", () => {
    const flowerId = "123";
    const beehiveId = "abc";

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: {
          updatedAt: now - FLOWER_GROW_TIME,
          produced: 0,
        },
        flowers: [
          {
            id: flowerId,
            attachedAt: now - FLOWER_GROW_TIME,
            attachedUntil: now,
          },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - FLOWER_GROW_TIME,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].flowers.length).toBe(0);
  });

  it("detaches a flower and reallocates it to a new hive", () => {
    const flowerId1 = "123";
    const flowerId2 = "456";
    const beehiveId1 = "abc";
    const beehiveId2 = "def";

    const quarterTime = DEFAULT_HONEY_PRODUCTION_TIME / 4;
    const threeQuarterTime = quarterTime * 3;

    const beehives: Beehives = {
      [beehiveId1]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [
          {
            id: flowerId1,
            attachedAt: now,
            attachedUntil: now + threeQuarterTime,
          },
          {
            id: flowerId2,
            attachedAt: now + threeQuarterTime,
            attachedUntil: now + DEFAULT_HONEY_PRODUCTION_TIME,
          },
        ],
      },
      [beehiveId2]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - quarterTime,
        },
      },
      [flowerId2]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId2].flowers.length).toEqual(1);
    expect(updatedBeehives[beehiveId2].flowers[0].attachedAt).toEqual(now);
    expect(updatedBeehives[beehiveId2].flowers[0].attachedUntil).toEqual(
      now + DEFAULT_HONEY_PRODUCTION_TIME,
    );
  });

  it("detaches a flower that is fully grown", () => {
    const flowerId1 = "123";
    const beehiveId1 = "abc";

    const tenMinutes = 10 * 60 * 1000;

    const beehives: Beehives = {
      [beehiveId1]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [
          {
            id: flowerId1,
            attachedAt: now - FLOWER_GROW_TIME - tenMinutes,
            attachedUntil: now - tenMinutes,
          },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - FLOWER_GROW_TIME - tenMinutes,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers.length).toEqual(0);
  });

  it("detaches a flower that is fully grown and attaches an available flower", () => {
    const flowerId1 = "123";
    const flowerId2 = "456";
    const beehiveId1 = "abc";

    const tenMinutes = 10 * 60 * 1000;

    const beehives: Beehives = {
      [beehiveId1]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
        flowers: [
          {
            id: flowerId1,
            attachedAt: now - FLOWER_GROW_TIME - tenMinutes,
            attachedUntil: now - tenMinutes,
          },
        ],
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId1]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now - FLOWER_GROW_TIME - tenMinutes,
        },
      },
      [flowerId2]: {
        ...DEFAULT_FLOWER_BED,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: now,
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: { ...TEST_FARM, beehives, flowers: { flowerBeds, discovered: {} } },
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers.length).toEqual(1);
    expect(updatedBeehives[beehiveId1].flowers[0].id).toEqual(flowerId2);
  });

  it("adds a non boosted flower and a boosted flower to a beehive when a queen bee is placed", () => {
    const gameState: GameState = {
      ...TEST_FARM,
      beehives: { abc: { ...DEFAULT_BEEHIVE } },
      flowers: {
        discovered: {},
        flowerBeds: {
          "123": {
            createdAt: now - DEFAULT_HONEY_PRODUCTION_TIME / 2,
            height: 1,
            width: 2,
            x: 0,
            y: 0,
            flower: {
              name: "Red Pansy",
              amount: 1,
              plantedAt: now - DEFAULT_HONEY_PRODUCTION_TIME / 2,
            },
          },
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: gameState,
      createdAt: now,
    });

    const finalBeehives = updateBeehives({
      game: {
        ...gameState,
        beehives: updatedBeehives,
        collectibles: {
          "Queen Bee": [
            {
              createdAt: now,
              id: "123",
              readyAt: now,
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
        flowers: {
          ...gameState.flowers,
          flowerBeds: {
            ...gameState.flowers.flowerBeds,
            "456": {
              createdAt: now,
              height: 1,
              width: 2,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                amount: 1,
                plantedAt: now,
              },
            },
          },
        },
      },
      createdAt: now,
    });

    expect(finalBeehives["abc"].flowers.length).toEqual(2);
    expect(finalBeehives["abc"].flowers[0].attachedUntil).toEqual(
      now + DEFAULT_HONEY_PRODUCTION_TIME / 2,
    );
    expect(finalBeehives["abc"].flowers[1].attachedUntil).toEqual(
      now + (3 * DEFAULT_HONEY_PRODUCTION_TIME) / 4,
    );
  });

  it("adds a boosted flower and a non boosted flower to a beehive when a queen bee is placed", () => {
    const gameState: GameState = {
      ...TEST_FARM,
      collectibles: {
        "Queen Bee": [
          {
            createdAt: now,
            id: "123",
            readyAt: now,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
      beehives: { abc: { ...DEFAULT_BEEHIVE } },
      flowers: {
        discovered: {},
        flowerBeds: {
          "123": {
            createdAt: now - (3 * DEFAULT_HONEY_PRODUCTION_TIME) / 4,
            height: 1,
            width: 2,
            x: 0,
            y: 0,
            flower: {
              name: "Red Pansy",
              amount: 1,
              plantedAt: now - (3 * DEFAULT_HONEY_PRODUCTION_TIME) / 4,
            },
          },
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: gameState,
      createdAt: now,
    });

    const finalBeehives = updateBeehives({
      game: {
        ...gameState,
        beehives: updatedBeehives,
        collectibles: {},
        flowers: {
          ...gameState.flowers,
          flowerBeds: {
            ...gameState.flowers.flowerBeds,
            "456": {
              createdAt: now,
              height: 1,
              width: 2,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                amount: 1,
                plantedAt: now,
              },
            },
          },
        },
      },
      createdAt: now,
    });

    expect(finalBeehives["abc"].flowers.length).toEqual(2);
    expect(finalBeehives["abc"].flowers[0].attachedUntil).toEqual(
      now + DEFAULT_HONEY_PRODUCTION_TIME / 4,
    );
    expect(finalBeehives["abc"].flowers[1].attachedUntil).toEqual(
      now + DEFAULT_HONEY_PRODUCTION_TIME,
    );
  });

  it("correctly forecasts a hive when the hive already has an attachment", () => {
    const flower1 = {
      attachedAt: now - DEFAULT_HONEY_PRODUCTION_TIME / 2,
      attachedUntil: now + DEFAULT_HONEY_PRODUCTION_TIME / 2,
      rate: 1,
      id: "123",
    };
    const flower2 = {
      attachedAt: now + DEFAULT_HONEY_PRODUCTION_TIME / 2,
      attachedUntil: now + DEFAULT_HONEY_PRODUCTION_TIME,
      rate: 1,
      id: "456",
    };

    const gameState: GameState = {
      ...TEST_FARM,
      collectibles: {},
      beehives: {
        abc: {
          height: 1,
          width: 1,
          x: 0,
          y: 0,
          honey: { updatedAt: now, produced: 0 },
          swarm: false,
          flowers: [flower1],
        },
      },
      flowers: {
        discovered: {},
        flowerBeds: {
          "123": {
            createdAt: 0,
            height: 1,
            width: 2,
            x: 0,
            y: 0,
            flower: {
              name: "Red Pansy",
              amount: 1,
              plantedAt: now - DEFAULT_HONEY_PRODUCTION_TIME / 2,
            },
          },
          "456": {
            createdAt: 0,
            height: 1,
            width: 2,
            x: 0,
            y: 0,
            flower: {
              name: "Red Pansy",
              amount: 1,
              plantedAt: now,
            },
          },
        },
      },
    };

    const updatedBeehives = updateBeehives({
      game: gameState,
      createdAt: now,
    });

    expect(updatedBeehives["abc"].flowers.length).toEqual(2);
    expect(updatedBeehives["abc"].flowers[0]).toEqual(flower1);
    expect(updatedBeehives["abc"].flowers[1]).toEqual(flower2);
  });

  it("boosts 20% Honey speed when Beekeeper Hat is active", () => {
    const flowerId = "123";
    const beehiveId = "abc";
    const tenMinutes = 10 * 60 * 1000;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId]: {
        ...DEFAULT_FLOWER_BED,
        flower: { name: "Red Pansy", amount: 1, plantedAt: now },
      },
    };

    const gameState: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: { ...INITIAL_BUMPKIN.equipped, hat: "Beekeeper Hat" },
      },
    };
    const game = {
      ...gameState,
      beehives,
      flowers: { flowerBeds, discovered: {} },
    };

    const updatedBeehives = updateBeehives({
      game,
      createdAt: now,
    });

    const futureUpdate = updateBeehives({
      game: { ...game, beehives: updatedBeehives },
      createdAt: now + tenMinutes,
    });

    expect(futureUpdate[beehiveId].honey.produced).toEqual(tenMinutes * 1.2);
  });

  it("boosts 2.2x Honey speed when Queen Bee is placed and Beekeeper Hat is active", () => {
    const flowerId = "123";
    const beehiveId = "abc";
    const tenMinutes = 10 * 60 * 1000;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now, produced: 0 },
      },
    };
    const flowerBeds: FlowerBeds = {
      [flowerId]: {
        ...DEFAULT_FLOWER_BED,
        flower: { name: "Red Pansy", amount: 1, plantedAt: now },
      },
    };

    const gameState: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: { ...INITIAL_BUMPKIN.equipped, hat: "Beekeeper Hat" },
      },
      collectibles: {
        "Queen Bee": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 1000,
            id: "12",
            readyAt: 1000,
          },
        ],
      },
    };
    const game = {
      ...gameState,
      beehives,
      flowers: { flowerBeds, discovered: {} },
    };

    const updatedBeehives = updateBeehives({
      game,
      createdAt: now,
    });

    const futureUpdate = updateBeehives({
      game: { ...game, beehives: updatedBeehives },
      createdAt: now + tenMinutes,
    });

    expect(futureUpdate[beehiveId].honey.produced).toEqual(tenMinutes * 2.2);
  });
});
