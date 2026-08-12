import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import type { GameState, InventoryItemName } from "./game";
import { getRewardsForStreak } from "./dailyRewards";
import { CHAPTERS, CHAPTER_BANNERS, type ChapterName } from "./chapters";
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

describe("getRewardsForStreak — ascension-aware reward scaling", () => {
  // A1 L50 (ready to ascend) → total Bumpkin level 200, so the reward curve keys off
  // 200 / 25 = 8. The bug scaled off the within-ascension level (50 → 50 / 25 = 2),
  // handing an ascended player only 10 Axes / 10 Rods instead of 40.
  const ascendedFarm: GameState = {
    ...TEST_FARM,
    bumpkin: { ...TEST_FARM.bumpkin, experience: 150_000_000 },
    island: { ...TEST_FARM.island, ascensionLevel: 1 },
    farmActivity: { ...TEST_FARM.farmActivity, "Daily Reward Collected": 100 },
  };

  it("scales the Tool Cache to the ascended player's total level, not their within-ascension level", () => {
    const { rewards } = getRewardsForStreak({
      game: ascendedFarm,
      streak: 7, // 7 % 7 === 0 → weekly-day-1-tool-cache
      currentDate: new Date(PAW_PRINTS_NOW).toISOString(),
      now: PAW_PRINTS_NOW,
    });

    const toolCache = rewards.find((r) => r.id === "weekly-day-1-tool-cache")!;
    expect(toolCache.items).toEqual({
      Axe: 40,
      Pickaxe: 16,
      "Stone Pickaxe": 8,
    });
  });

  it("scales the Angler Pack to the ascended player's total level, not their within-ascension level", () => {
    const { rewards } = getRewardsForStreak({
      game: ascendedFarm,
      streak: 10, // 10 % 7 === 3 → weekly-day-4-angler-pack
      currentDate: new Date(PAW_PRINTS_NOW).toISOString(),
      now: PAW_PRINTS_NOW,
    });

    const anglerPack = rewards.find(
      (r) => r.id === "weekly-day-4-angler-pack",
    )!;
    expect(anglerPack.items).toEqual({ Rod: 40, Earthworm: 24, Grub: 16 });
  });
});
