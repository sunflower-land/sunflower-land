import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CHAPTERS } from "features/game/types/chapters";
import { openRewardBox } from "./openRewardBox";

jest.mock("lib/config", () => ({
  CONFIG: {
    NETWORK: "mainnet",
    API_URL: "",
  },
}));

describe("openRewardBox", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("swaps Fermented Fish for Surimi Rice Bowl after Crabs and Traps (bronze)", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.81);
    const now = CHAPTERS["Crabs and Traps"].startDate.getTime() + 1000;

    const result = openRewardBox({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Bronze Food Box": new Decimal(1),
        },
      },
      action: { type: "rewardBox.opened", name: "Bronze Food Box" },
      createdAt: now,
    });

    expect(result.rewardBoxes?.["Bronze Food Box"]?.reward?.items).toEqual({
      "Surimi Rice Bowl": 1,
    });
  });

  it("swaps Fermented Fish for Surimi Rice Bowl after Crabs and Traps (silver)", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.6);
    const now = CHAPTERS["Crabs and Traps"].startDate.getTime() + 1000;

    const result = openRewardBox({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Silver Food Box": new Decimal(1),
        },
      },
      action: { type: "rewardBox.opened", name: "Silver Food Box" },
      createdAt: now,
    });

    expect(result.rewardBoxes?.["Silver Food Box"]?.reward?.items).toEqual({
      "Surimi Rice Bowl": 1,
    });
  });

  it("only gives non-VIP players the non-VIP Weekly Mega Box rewards", () => {
    const now = Date.now();
    // Sweep the whole roll range: none of it may land on a VIP (Gem) reward.
    [0.01, 0.25, 0.49, 0.51, 0.75, 0.99].forEach((roll) => {
      jest.spyOn(Math, "random").mockReturnValue(roll);
      const result = openRewardBox({
        state: {
          ...INITIAL_FARM,
          inventory: { "Weekly Mega Box": new Decimal(1) },
        },
        action: { type: "rewardBox.opened", name: "Weekly Mega Box" },
        createdAt: now,
      });

      const reward = result.rewardBoxes?.["Weekly Mega Box"]?.reward;
      expect(reward?.items?.Gem).toBeUndefined();
      expect(!!reward?.coins || !!reward?.items?.["Fishing Lure"]).toBe(true);
    });
  });

  it("only gives VIP players the VIP Weekly Mega Box rewards", () => {
    const now = Date.now();
    [0.01, 0.25, 0.49, 0.51, 0.75, 0.99].forEach((roll) => {
      jest.spyOn(Math, "random").mockReturnValue(roll);
      const result = openRewardBox({
        state: {
          ...INITIAL_FARM,
          vip: {
            bundles: [{ name: "1_MONTH", boughtAt: now }],
            expiresAt: now + 30 * 24 * 60 * 60 * 1000,
          },
          inventory: { "Weekly Mega Box": new Decimal(1) },
        },
        action: { type: "rewardBox.opened", name: "Weekly Mega Box" },
        createdAt: now,
      });

      const reward = result.rewardBoxes?.["Weekly Mega Box"]?.reward;
      expect(reward?.items?.Gem).toBeGreaterThan(0);
    });
  });
});
