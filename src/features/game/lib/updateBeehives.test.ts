import { FLOWER_SEEDS } from "../types/flowers";
import { Beehive, Beehives, FlowerBed, FlowerBeds } from "../types/game";
import { HONEY_PRODUCTION_TIME, updateBeehives } from "./updateBeehives";

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
      beehives,
      flowerBeds: {},
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
      beehives,
      flowerBeds: {},
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
      beehives,
      flowerBeds,
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
      beehives,
      flowerBeds,
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].flowers.length).toEqual(2);
  });

  it("attaches one flower to two beehives", () => {
    const flowerId = "123";
    const beehiveId1 = "abc";
    const beehiveId2 = "def";

    const halfTime = HONEY_PRODUCTION_TIME / 2;

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
      beehives,
      flowerBeds,
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
      beehives,
      flowerBeds,
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].honey.produced).toEqual(eightMinutes);
  });

  it("does not attach a flower to an already full beehive", () => {
    const beehives: Beehives = {
      "2": {
        ...DEFAULT_BEEHIVE,
        honey: { produced: HONEY_PRODUCTION_TIME, updatedAt: 0 },
        flowers: [],
      },
    };
    const flowerBeds: FlowerBeds = { "1": DEFAULT_FLOWER_BED };

    const updatedBeehives = updateBeehives({
      beehives,
      flowerBeds,
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
        honey: { updatedAt: now - HONEY_PRODUCTION_TIME, produced: 0 },
        flowers: [
          {
            id: flowerId,
            attachedAt: now - HONEY_PRODUCTION_TIME,
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].honey.produced).toEqual(
      HONEY_PRODUCTION_TIME - tenMinutes
    );
  });

  it("does not update the honey past the time the beehive is full", () => {
    const flowerId = "123";
    const beehiveId = "abc";
    const tenMinutes = 10 * 60 * 1000;

    const beehives: Beehives = {
      [beehiveId]: {
        ...DEFAULT_BEEHIVE,
        honey: { updatedAt: now - HONEY_PRODUCTION_TIME, produced: tenMinutes },
        flowers: [
          {
            id: flowerId,
            attachedAt: now - HONEY_PRODUCTION_TIME,
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].honey.produced).toEqual(
      HONEY_PRODUCTION_TIME
    );
  });

  it("set the attachedAt into the future", () => {
    const flowerId1 = "123";
    const flowerId2 = "456";
    const beehiveId1 = "abc";

    const halfTime = HONEY_PRODUCTION_TIME / 2;

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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers.length).toEqual(2);
    expect(updatedBeehives[beehiveId1].flowers[1].attachedAt).toEqual(
      now + halfTime
    );
  });

  it("set the attachedUntil when the beehive is full", () => {
    const flowerId1 = "123";
    const beehiveId1 = "abc";

    const halfTime = HONEY_PRODUCTION_TIME / 2;

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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers[0].attachedUntil).toEqual(
      now + halfTime
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers[0].attachedUntil).toEqual(
      now + threeQuarterTime
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId].flowers.length).toBe(0);
  });

  it("detaches a flower and reallocates it to a new hive", () => {
    const flowerId1 = "123";
    const flowerId2 = "456";
    const beehiveId1 = "abc";
    const beehiveId2 = "def";

    const quarterTime = HONEY_PRODUCTION_TIME / 4;
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
            attachedUntil: now + HONEY_PRODUCTION_TIME,
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId2].flowers.length).toEqual(1);
    expect(updatedBeehives[beehiveId2].flowers[0].attachedAt).toEqual(now);
    expect(updatedBeehives[beehiveId2].flowers[0].attachedUntil).toEqual(
      now + HONEY_PRODUCTION_TIME
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
      beehives,
      flowerBeds,
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
      beehives,
      flowerBeds,
      createdAt: now,
    });

    expect(updatedBeehives[beehiveId1].flowers.length).toEqual(1);
    expect(updatedBeehives[beehiveId1].flowers[0].id).toEqual(flowerId2);
  });
});
