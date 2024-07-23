import "lib/__mocks__/configMock";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { harvestFlower } from "./harvestFlower";
import Decimal from "decimal.js-light";

const GAME_STATE = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("harvestFlower", () => {
  it("throws if the bumpkin does not exist", () => {
    expect(() =>
      harvestFlower({
        state: { ...GAME_STATE, bumpkin: undefined },
        action: { type: "flower.harvested", id: "1" },
      }),
    ).toThrow("You do not have a Bumpkin");
  });

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
                height: 0,
                width: 0,
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
                height: 0,
                width: 0,
                x: 0,
                y: 0,
                flower: {
                  amount: 1,
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
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              flower: {
                amount: 1,
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
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              flower: {
                amount: 1,
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
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              flower: {
                amount,
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.bumpkin?.activity?.["Red Pansy Harvested"]).toEqual(amount);
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
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              flower: {
                amount,
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
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              flower: {
                amount,
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
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              flower: {
                amount: 1,
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
