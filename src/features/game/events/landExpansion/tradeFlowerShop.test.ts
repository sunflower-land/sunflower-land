import Decimal from "decimal.js-light";
import { tradeFlowerShop } from "./tradeFlowerShop";
import { SEASONS, getSeasonalTicket } from "features/game/types/seasons";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

describe("tradeFlowerShop", () => {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const createdAt = SEASONS["Clash of Factions"].startDate.getTime();

  it("throws if the flower shop is not open", () => {
    expect(() =>
      tradeFlowerShop({
        state: { ...TEST_FARM, flowerShop: undefined },
        action: { type: "flowerShop.traded", flower: "Yellow Pansy" },
        createdAt: createdAt + 1,
      })
    ).toThrow("Flower shop is not open");
  });

  it("throws if the flower shop state is out of date", () => {
    expect(() =>
      tradeFlowerShop({
        state: {
          ...TEST_FARM,
          flowerShop: { weeklyFlower: "Red Pansy", week: createdAt },
        },
        action: { type: "flowerShop.traded", flower: "Yellow Pansy" },
        createdAt: createdAt + sevenDays + 1,
      })
    ).toThrow("Flower shop has not been updated");
  });

  it("throws if the input flower is not the current weeks flower", () => {
    expect(() =>
      tradeFlowerShop({
        state: {
          ...TEST_FARM,
          flowerShop: { weeklyFlower: "Red Pansy", week: createdAt },
        },
        action: { type: "flowerShop.traded", flower: "Yellow Pansy" },
        createdAt: createdAt + 1,
      })
    ).toThrow("Flower is not the current weeks flower");
  });

  it("throws if the player does not have enough flowers", () => {
    expect(() =>
      tradeFlowerShop({
        state: {
          ...TEST_FARM,
          flowerShop: { weeklyFlower: "Red Pansy", week: createdAt },
          inventory: {},
        },
        action: { type: "flowerShop.traded", flower: "Red Pansy" },
        createdAt: createdAt + 1,
      })
    ).toThrow("Not enough flowers");
  });

  it("throws if claiming the reward twice", () => {
    const firstState = tradeFlowerShop({
      state: {
        ...TEST_FARM,
        inventory: { "Red Pansy": new Decimal(2) },
        flowerShop: {
          weeklyFlower: "Red Pansy",
          week: createdAt,
        },
      },
      action: { type: "flowerShop.traded", flower: "Red Pansy" },
      createdAt: createdAt + 1,
    });

    expect(() =>
      tradeFlowerShop({
        state: firstState,
        action: { type: "flowerShop.traded", flower: "Red Pansy" },
        createdAt: createdAt + 1,
      })
    ).toThrow("Already claimed reward");
  });

  it("removes the flower from the inventory", () => {
    const initialState: GameState = {
      ...TEST_FARM,
      inventory: { "Red Pansy": new Decimal(1) },
      flowerShop: {
        weeklyFlower: "Red Pansy",
        week: createdAt,
      },
    };

    const inventoryBefore = initialState.inventory["Red Pansy"];

    const state = tradeFlowerShop({
      state: initialState,
      action: { type: "flowerShop.traded", flower: "Red Pansy" },
      createdAt: createdAt + 1,
    });

    const inventoryAfter = state.inventory["Red Pansy"];

    expect(inventoryAfter).toStrictEqual(inventoryBefore?.minus(1));
  });

  it("gives seasonal tickets", () => {
    const state = tradeFlowerShop({
      state: {
        ...TEST_FARM,
        inventory: { "Red Pansy": new Decimal(1) },
        flowerShop: {
          weeklyFlower: "Red Pansy",
          week: createdAt,
        },
      },
      action: { type: "flowerShop.traded", flower: "Red Pansy" },
      createdAt: createdAt + 1,
    });

    expect(
      state.inventory[getSeasonalTicket(new Date(createdAt + 1))]?.toNumber()
    ).toBeGreaterThanOrEqual(1);
  });
});
