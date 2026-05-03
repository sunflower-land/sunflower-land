import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { GameState } from "./game";
import { getRewardsForStreak } from "./dailyRewards";

const PAW_PRINTS_NOW = new Date("2026-01-15T00:00:00.000Z").getTime();
const CRABS_AND_TRAPS_NOW = new Date("2026-03-01T00:00:00.000Z").getTime();
const SALT_AWAKENING_NOW = new Date("2026-06-01T00:00:00.000Z").getTime();

const vipFarm = (now: number): GameState => ({
  ...TEST_FARM,
  vip: { expiresAt: now + 1000 * 60 * 60 * 24 * 30, bundles: [] },
});

describe("getRewardsForStreak — VIP banner perk chapter cutoff", () => {
  it("does not grant a banner for VIPs before Crabs and Traps", () => {
    const game = vipFarm(PAW_PRINTS_NOW);

    const { rewards } = getRewardsForStreak({
      game,
      streak: 7,
      currentDate: new Date(PAW_PRINTS_NOW).toISOString(),
      now: PAW_PRINTS_NOW,
    });

    const defaultReward = rewards.find((r) => r.id === "default-reward")!;
    expect(defaultReward.items?.["Paw Prints Banner"]).toBeUndefined();
  });

  it("grants the chapter banner for VIPs during Crabs and Traps", () => {
    const game = vipFarm(CRABS_AND_TRAPS_NOW);

    const { rewards } = getRewardsForStreak({
      game,
      streak: 7,
      currentDate: new Date(CRABS_AND_TRAPS_NOW).toISOString(),
      now: CRABS_AND_TRAPS_NOW,
    });

    const defaultReward = rewards.find((r) => r.id === "default-reward")!;
    expect(defaultReward.items?.["Crabs and Traps Banner"]).toBe(1);
  });

  it("grants the chapter banner for VIPs in chapters after Crabs and Traps", () => {
    const game = vipFarm(SALT_AWAKENING_NOW);

    const { rewards } = getRewardsForStreak({
      game,
      streak: 7,
      currentDate: new Date(SALT_AWAKENING_NOW).toISOString(),
      now: SALT_AWAKENING_NOW,
    });

    const defaultReward = rewards.find((r) => r.id === "default-reward")!;
    expect(defaultReward.items?.["Salt Awakening Banner"]).toBe(1);
  });

  it("does not grant the banner for non-VIPs in eligible chapters", () => {
    const game: GameState = { ...TEST_FARM };

    const { rewards } = getRewardsForStreak({
      game,
      streak: 7,
      currentDate: new Date(SALT_AWAKENING_NOW).toISOString(),
      now: SALT_AWAKENING_NOW,
    });

    const defaultReward = rewards.find((r) => r.id === "default-reward")!;
    expect(defaultReward.items?.["Salt Awakening Banner"]).toBeUndefined();
  });

  it("does not grant the banner if the VIP already owns it", () => {
    const game: GameState = {
      ...vipFarm(SALT_AWAKENING_NOW),
      inventory: {
        ...TEST_FARM.inventory,
        "Salt Awakening Banner": new Decimal(1),
      },
    };

    const { rewards } = getRewardsForStreak({
      game,
      streak: 7,
      currentDate: new Date(SALT_AWAKENING_NOW).toISOString(),
      now: SALT_AWAKENING_NOW,
    });

    const defaultReward = rewards.find((r) => r.id === "default-reward")!;
    expect(defaultReward.items?.["Salt Awakening Banner"]).toBeUndefined();
  });
});
