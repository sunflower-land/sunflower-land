import { INITIAL_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { buyMoreReels, getReelGemPrice } from "./buyMoreReels";

const date = new Date().toISOString().split("T")[0];
describe("buyMoreReels", () => {
  it("throws an error if the player does not have any Gems", () => {
    expect(() => {
      buyMoreReels({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
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
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
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
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
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
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
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

  it("increases timesBought count by 1", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = buyMoreReels({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
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
            timesBought: {
              [today]: 0,
            },
            count: 0,
          },
        },
      },
      action: { type: "fishing.reelsBought" },
    });
    expect(result.fishing.extraReels?.timesBought?.[today]).toEqual(1);
  });

  it("increases price of gems by 2x after buying once", () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const price = getReelGemPrice({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
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
            timesBought: {
              [today]: 1,
            },
            count: 0,
          },
        },
      },
      createdAt: Date.now(),
    });
    expect(price).toEqual(20);
  });
});
