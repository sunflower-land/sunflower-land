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

  // A2 L50 → total Bumpkin level 250, which must scale past the historical 200 cap:
  // the bug clamped every ascended player to 200, so A2 L50 got the same items as A1 L50.
  const ascendedFarmA2: GameState = {
    ...TEST_FARM,
    bumpkin: { ...TEST_FARM.bumpkin, experience: 220_000_000 },
    island: { ...TEST_FARM.island, ascensionLevel: 2 },
    farmActivity: { ...TEST_FARM.farmActivity, "Daily Reward Collected": 100 },
  };

  it("scales items past the level-200 cap for higher ascensions (A2 L50 > A1 L50)", () => {
    const rewardsFor = (game: GameState, streak: number) =>
      getRewardsForStreak({
        game,
        streak,
        currentDate: new Date(PAW_PRINTS_NOW).toISOString(),
        now: PAW_PRINTS_NOW,
      }).rewards;

    // Tool Cache: 250 / 25 = 10 → 5×/2×/1× × 10.
    const toolCache = rewardsFor(ascendedFarmA2, 7).find(
      (r) => r.id === "weekly-day-1-tool-cache",
    )!;
    expect(toolCache.items).toEqual({
      Axe: 50,
      Pickaxe: 20,
      "Stone Pickaxe": 10,
    });

    // Angler Pack: 5×/3×/2× × 10.
    const anglerPack = rewardsFor(ascendedFarmA2, 10).find(
      (r) => r.id === "weekly-day-4-angler-pack",
    )!;
    expect(anglerPack.items).toEqual({ Rod: 50, Earthworm: 30, Grub: 20 });

    // Coin Stash: 500 × (250 / 25) = 5000 (A1 L50 gives 4000).
    const coinStash = rewardsFor(ascendedFarmA2, 12).find(
      (r) => r.id === "weekly-day-6-coin-stash",
    )!;
    expect(coinStash.coins).toBe(5000);
  });
});

describe("getRewardsForStreak — Growth Feast XP scaling", () => {
  // streak % 7 === 4 → weekly-day-5-growth-feast; Daily Reward Collected > 6 skips onboarding.
  const growthFeastFor = (game: GameState) =>
    getRewardsForStreak({
      game,
      streak: 11,
      currentDate: new Date(PAW_PRINTS_NOW).toISOString(),
      now: PAW_PRINTS_NOW,
    }).rewards.find((r) => r.id === "weekly-day-5-growth-feast")!;

  const farmAt = (experience: number, ascensionLevel: number): GameState => ({
    ...TEST_FARM,
    bumpkin: { ...TEST_FARM.bumpkin, experience },
    island: { ...TEST_FARM.island, ascensionLevel },
    farmActivity: { ...TEST_FARM.farmActivity, "Daily Reward Collected": 100 },
  });

  it("scales an ascended player's XP linearly with total Bumpkin level", () => {
    // A1 L50 → total level 200 → 1000 × 200.
    expect(growthFeastFor(farmAt(150_000_000, 1)).xp).toBe(200_000);
  });

  it("grants a higher ascension strictly more XP (A2 L50 !== A1 L50)", () => {
    const a1 = growthFeastFor(farmAt(150_000_000, 1)).xp!; // total 200 → 200,000
    const a2 = growthFeastFor(farmAt(220_000_000, 2)).xp!; // total 250 → 250,000
    expect(a2).toBe(250_000);
    expect(a2).toBeGreaterThan(a1);
  });

  it("bumps (does not drop) XP the moment a maxed player ascends", () => {
    // Non-ascended at the level-150 cap vs. their first ascended level.
    const preAscension = growthFeastFor(farmAt(94_333_905, 0)).xp!;
    const firstAscended = growthFeastFor(farmAt(94_333_905 + 1, 1)).xp!; // A1 L1 → 151
    expect(firstAscended).toBe(151_000);
    expect(firstAscended).toBeGreaterThanOrEqual(preAscension);
  });

  it("keeps the historical fraction-of-next-level curve for non-ascended players", () => {
    // A mid-level, non-ascended player is untouched by the ascension branch: their
    // reward is a small fraction of a level, not the linear 1000 × level.
    const midLevelExperience = 1_000_000; // level 50
    const xp = growthFeastFor(farmAt(midLevelExperience, 0)).xp!;
    expect(xp).toBeGreaterThan(0);
    expect(xp).toBeLessThan(51 * 1000); // well under the linear 1000 × level rate
  });

  it("holds the non-ascended display and grant in sync (frontend cap === backend cap)", () => {
    // A non-ascended player parked at the level cap must read the same XP the server
    // grants — the legacy mismatch came from the frontend capping at 150 while the
    // backend walked the 151-200 table. Both now cap at the pre-ascension max.
    const xp = growthFeastFor(farmAt(94_333_905, 0)).xp!;
    expect(xp).toBe(103_768);
  });
});
