import "lib/__mocks__/configMock";

import Decimal from "decimal.js-light";
import { tradeFlowerShop } from "./tradeFlowerShop";
import { TEST_FARM } from "features/game/lib/constants";
import { SEASONS } from "features/game/types/seasons";
import { GameState } from "features/game/types/game";

describe("tradeFlowerShop", () => {
  it("throws if before the Spring Blossom season", () => {
    expect(() =>
      tradeFlowerShop({
        state: TEST_FARM,
        action: { type: "flowerShop.traded", flower: "Red Pansy" },
        createdAt: SEASONS["Spring Blossom"].startDate.getTime() - 1,
      })
    ).toThrow("Spring Blossom season has not started");
  });

  it("throws if after the Spring Blossom season", () => {
    expect(() =>
      tradeFlowerShop({
        state: TEST_FARM,
        action: { type: "flowerShop.traded", flower: "Red Pansy" },
        createdAt: SEASONS["Spring Blossom"].endDate.getTime() + 1,
      })
    ).toThrow("Spring Blossom season has ended");
  });

  it("throws if the input flower is not the current weeks flower", () => {
    expect(() =>
      tradeFlowerShop({
        state: {
          ...TEST_FARM,
          springBlossom: {
            1: { collectedFlowerPages: [], weeklyFlower: "Red Pansy" },
          },
        },
        action: { type: "flowerShop.traded", flower: "Yellow Pansy" },
        createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
      })
    ).toThrow("Flower is not the current weeks flower");
  });

  it("throws if the player does not have enough flowers", () => {
    expect(() =>
      tradeFlowerShop({
        state: {
          ...TEST_FARM,
          springBlossom: {
            1: { collectedFlowerPages: [], weeklyFlower: "Red Pansy" },
          },
        },
        action: { type: "flowerShop.traded", flower: "Red Pansy" },
        createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
      })
    ).toThrow("Not enough flowers");
  });

  it("throws if claiming the reward twice", () => {
    const firstState = tradeFlowerShop({
      state: {
        ...TEST_FARM,
        inventory: { "Red Pansy": new Decimal(2) },
        springBlossom: {
          1: { collectedFlowerPages: [], weeklyFlower: "Red Pansy" },
        },
      },
      action: { type: "flowerShop.traded", flower: "Red Pansy" },
      createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
    });

    expect(() =>
      tradeFlowerShop({
        state: firstState,
        action: { type: "flowerShop.traded", flower: "Red Pansy" },
        createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
      })
    ).toThrow("Already claimed reward");
  });

  it("removes the flower from the inventory", () => {
    const initialState: GameState = {
      ...TEST_FARM,
      inventory: { "Red Pansy": new Decimal(1) },
      springBlossom: {
        1: { collectedFlowerPages: [], weeklyFlower: "Red Pansy" },
      },
    };

    const inventoryBefore = initialState.inventory["Red Pansy"];

    const state = tradeFlowerShop({
      state: initialState,
      action: { type: "flowerShop.traded", flower: "Red Pansy" },
      createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
    });

    const inventoryAfter = state.inventory["Red Pansy"];

    expect(inventoryAfter).toStrictEqual(inventoryBefore?.minus(1));
  });

  it("gives seasonal tickets", () => {
    const state = tradeFlowerShop({
      state: {
        ...TEST_FARM,
        inventory: { "Red Pansy": new Decimal(1) },
        springBlossom: {
          1: { collectedFlowerPages: [], weeklyFlower: "Red Pansy" },
        },
      },
      action: { type: "flowerShop.traded", flower: "Red Pansy" },
      createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
    });

    expect(state.inventory["Tulip Bulb"]?.toNumber()).toBeGreaterThanOrEqual(1);
  });
});
