import { TEST_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { buyMoreReels } from "./buyMoreReels";

const date = new Date().toISOString().split("T")[0];
describe("buyMoreReels", () => {
  it("throws an error if the player does not have any Gems", () => {
    expect(() => {
      buyMoreReels({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            Gem: undefined,
          },
          fishing: {
            weather: "Sunny",
            wharf: {},
            beach: {},
            dailyAttempts: {
              [date]: 20,
            },
            extraReels: {
              count: 0,
            },
          },
        },
        action: { type: "fishing.reelsBought" },
      });
    }).toThrow("Player does not have enough Gems to buy more reels");
  });

  it("throws an error if the player has reels remaining", () => {
    expect(() => {
      buyMoreReels({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            Gem: new Decimal(20),
          },
          fishing: {
            weather: "Sunny",
            wharf: {},
            beach: {},
            dailyAttempts: {
              [date]: 1,
            },
            extraReels: {
              count: 0,
            },
          },
        },
        action: { type: "fishing.reelsBought" },
      });
    }).toThrow("Player has reels remaining");
  });

  it("adds 5 extra reels", () => {
    const result = buyMoreReels({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10),
        },
        fishing: {
          weather: "Sunny",
          wharf: {},
          beach: {},
          dailyAttempts: {
            [date]: 20,
          },
          extraReels: {
            count: 0,
          },
        },
      },
      action: { type: "fishing.reelsBought" },
    });

    expect(result.fishing.extraReels?.count).toEqual(5);
  });

  it("removes Gems from the player's inventory", () => {
    const result = buyMoreReels({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10),
        },
        fishing: {
          weather: "Sunny",
          wharf: {},
          beach: {},
          dailyAttempts: {
            [date]: 20,
          },
          extraReels: {
            count: 0,
          },
        },
      },
      action: { type: "fishing.reelsBought" },
    });

    expect(result.inventory["Gem"]).toEqual(new Decimal(0));
  });
});
