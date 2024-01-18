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
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if the flower bed does not exist", () => {
    expect(() =>
      harvestFlower({
        state: GAME_STATE,
        action: { type: "flower.harvested", id: "1" },
      })
    ).toThrow("Flower bed does not exist");
  });

  it("throws an error if the flower bed does not have a flower", () => {
    const flowerBedId = "123";
    expect(() =>
      harvestFlower({
        state: {
          ...GAME_STATE,
          flowers: {
            [flowerBedId]: {
              createdAt: 0,
              height: 0,
              width: 0,
              x: 0,
              y: 0,
            },
          },
        },
        action: { type: "flower.harvested", id: flowerBedId },
      })
    ).toThrow("Flower bed does not have a flower");
  });

  it("throws an error if the flower is not ready to harvest", () => {
    const flowerBedId = "123";
    expect(() =>
      harvestFlower({
        state: {
          ...GAME_STATE,
          flowers: {
            [flowerBedId]: {
              createdAt: 0,
              height: 0,
              width: 0,
              x: 0,
              y: 0,
              flower: {
                amount: 1,
                name: "Flower 1",
                plantedAt: Date.now(),
              },
            },
          },
        },
        action: { type: "flower.harvested", id: flowerBedId },
      })
    ).toThrow("Flower is not ready to harvest");
  });

  it("updates the inventory", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          [flowerBedId]: {
            createdAt: 0,
            height: 0,
            width: 0,
            x: 0,
            y: 0,
            flower: {
              amount: 1,
              name: "Flower 1",
              plantedAt: 0,
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Flower 1"]).toEqual(new Decimal(1));
  });

  it("removes the flower from the flower bed", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          [flowerBedId]: {
            createdAt: 0,
            height: 0,
            width: 0,
            x: 0,
            y: 0,
            flower: {
              amount: 1,
              name: "Flower 1",
              plantedAt: 0,
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.flowers[flowerBedId].flower).toBeUndefined();
  });

  it("increments the flower harvested activity", () => {
    const amount = 1;
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          [flowerBedId]: {
            createdAt: 0,
            height: 0,
            width: 0,
            x: 0,
            y: 0,
            flower: {
              amount,
              name: "Flower 1",
              plantedAt: 0,
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.bumpkin?.activity?.["Flower 1 Harvested"]).toEqual(amount);
  });

  it.todo("updates the dex");
});
