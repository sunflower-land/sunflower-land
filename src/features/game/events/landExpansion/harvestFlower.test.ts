import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { harvestFlower } from "./harvestFlower";
import Decimal from "decimal.js-light";

const GAME_STATE = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("harvestFlower", () => {
  it("throws an error if the flower bed does not exist", () => {
    expect(() =>
      harvestFlower({
        state: GAME_STATE,
        action: { type: "flower.harvested", id: "1" },
      }),
    ).toThrow("Flower bed does not exist");
  });

  it("throws an error if the flower bed does not have a flower", () => {
    const flowerBedId = "123";
    expect(() =>
      harvestFlower({
        state: {
          ...GAME_STATE,
          flowers: {
            discovered: {},
            flowerBeds: {
              [flowerBedId]: {
                createdAt: 0,
                x: 0,
                y: 0,
              },
            },
          },
        },
        action: { type: "flower.harvested", id: flowerBedId },
      }),
    ).toThrow("Flower bed does not have a flower");
  });

  it("throws an error if the flower is not ready to harvest", () => {
    const flowerBedId = "123";
    expect(() =>
      harvestFlower({
        state: {
          ...GAME_STATE,
          flowers: {
            discovered: {},
            flowerBeds: {
              [flowerBedId]: {
                createdAt: 0,
                x: 0,
                y: 0,
                flower: {
                  name: "Red Pansy",
                  plantedAt: Date.now(),
                },
              },
            },
          },
        },
        action: { type: "flower.harvested", id: flowerBedId },
      }),
    ).toThrow("Flower is not ready to harvest");
  });

  it("updates the inventory", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Red Pansy"]).toEqual(new Decimal(1));
  });

  it("removes the flower from the flower bed", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.flowers.flowerBeds[flowerBedId].flower).toBeUndefined();
  });

  it("increments the bumpkin flower harvested activity", () => {
    const amount = 1;
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.farmActivity["Red Pansy Harvested"]).toEqual(amount);
  });

  it("increments the farm flower harvested activity", () => {
    const amount = 1;
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.farmActivity["Red Pansy Harvested"]).toEqual(amount);
  });

  it("updates the discovered flowers", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Yellow Pansy",
                crossbreed: "Sunflower",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.flowers.discovered["Yellow Pansy"]).toEqual(["Sunflower"]);
  });

  it("gives +1 flower when Salt Crystal Flower is placed and the flower was marked as a critical hit", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        inventory: {
          "Salt Crystal Flower": new Decimal(1),
        },
        collectibles: {
          "Salt Crystal Flower": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
                criticalHit: { "Salt Crystal Flower": 1 },
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Red Pansy"]).toEqual(new Decimal(2));
  });

  it("does not give +1 flower when Salt Crystal Flower is placed but there is no critical hit", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        inventory: {
          "Salt Crystal Flower": new Decimal(1),
        },
        collectibles: {
          "Salt Crystal Flower": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Red Pansy"]).toEqual(new Decimal(1));
  });

  it("adds a reward to the inventory", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
                reward: {
                  items: [
                    {
                      name: "Desert Rose",
                      amount: 1,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Desert Rose"]).toEqual(new Decimal(1));
  });
});
