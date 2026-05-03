import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { GameState, InventoryItemName } from "./game";
import { getRewardsForStreak } from "./dailyRewards";
import { CHAPTERS, CHAPTER_BANNERS, ChapterName } from "./chapters";
import { getKeys } from "lib/object";

const midChapter = (chapter: ChapterName): number =>
  CHAPTERS[chapter].startDate.getTime() + 1000 * 60 * 60 * 24;

const PAW_PRINTS_NOW = midChapter("Paw Prints");
const CRABS_AND_TRAPS_NOW = midChapter("Crabs and Traps");
const SALT_AWAKENING_NOW = midChapter("Salt Awakening");

const ALL_CHAPTER_BANNERS = getKeys(CHAPTER_BANNERS);

const vipFarm = (now: number): GameState => ({
  ...TEST_FARM,
  vip: { expiresAt: now + 1000 * 60 * 60 * 24 * 30, bundles: [] },
});

const expectNoChapterBanner = (
  items: Partial<Record<InventoryItemName, number>> | undefined,
) => {
  for (const banner of ALL_CHAPTER_BANNERS) {
    expect(items?.[banner]).toBeUndefined();
  }
};

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
    expectNoChapterBanner(defaultReward.items);
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
    expectNoChapterBanner(defaultReward.items);
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
