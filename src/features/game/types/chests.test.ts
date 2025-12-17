import {
  isCollectible,
  isWearable,
} from "../events/landExpansion/buyChapterItem";
import {
  BASIC_REWARDS,
  RARE_REWARDS,
  LUXURY_REWARDS,
  MEGASTORE_TIER_WEIGHTS,
  MEGASTORE_RESTRICTED_ITEMS,
  CHEST_MULTIPLIER,
} from "./chests";
import { MEGASTORE, ChapterStore } from "./megastore";
import { RewardBoxReward } from "./rewardBoxes";
import { getCurrentChapter } from "./chapters";

describe("CHAPTER_REWARDS", () => {
  const currentChapter = getCurrentChapter(Date.now()); // Test all reward types
  const rewardTypes: {
    rewards: RewardBoxReward[];
    weight: number;
    chestTier: "basic" | "rare" | "luxury";
  }[] = [
    { rewards: BASIC_REWARDS(), weight: 20, chestTier: "basic" },
    { rewards: RARE_REWARDS(), weight: 50, chestTier: "rare" },
    { rewards: LUXURY_REWARDS(), weight: 50, chestTier: "luxury" },
  ];

  it("includes seasonal megastore items in all reward types with correct tier-based weightings", () => {
    const store = MEGASTORE[currentChapter];

    rewardTypes.forEach(({ rewards, weight, chestTier }) => {
      // Test tiers based on chest tier filtering
      Object.entries(MEGASTORE_TIER_WEIGHTS).forEach(([tier, tierWeight]) => {
        // Apply the same filtering logic as CHAPTER_REWARDS
        if (chestTier === "basic" && (tier === "mega" || tier === "epic"))
          return;
        if (chestTier === "rare" && tier === "mega") return;

        const tierItems = store[tier as keyof ChapterStore].items;

        // For each item in the tier, verify it exists in rewards with correct weighting
        tierItems.forEach((item) => {
          if (
            isCollectible(item) &&
            !MEGASTORE_RESTRICTED_ITEMS.includes(item.collectible)
          ) {
            expect(rewards).toContainEqual({
              items: { [item.collectible]: 1 },
              weighting: weight * CHEST_MULTIPLIER * tierWeight,
            });
          }
          if (
            isWearable(item) &&
            !MEGASTORE_RESTRICTED_ITEMS.includes(item.wearable)
          ) {
            expect(rewards).toContainEqual({
              wearables: { [item.wearable]: 1 },
              weighting: weight * CHEST_MULTIPLIER * tierWeight,
            });
          }
        });
      });
    });
  });

  it("does not include restricted items", () => {
    rewardTypes.forEach(({ rewards }) => {
      MEGASTORE_RESTRICTED_ITEMS.forEach((item) => {
        expect(rewards).not.toContainEqual({
          items: { [item]: 1 },
          weighting: expect.any(Number),
        });
      });
    });
  });

  it("does not include items from other seasons", () => {
    rewardTypes.forEach(({ rewards }) => {
      // Verify items from other seasons are not included
      Object.entries(MEGASTORE).forEach(([season, seasonStore]) => {
        if (season === currentChapter) return; // Skip current season

        // Check all tiers in other seasons
        Object.entries(MEGASTORE_TIER_WEIGHTS).forEach(([tier]) => {
          const tierItems = seasonStore[tier as keyof ChapterStore].items;

          tierItems.forEach((item) => {
            if (isCollectible(item)) {
              expect(rewards).not.toContainEqual({
                items: { [item.collectible]: 1 },
                weighting: expect.any(Number),
              });
            }
            if (isWearable(item)) {
              expect(rewards).not.toContainEqual({
                wearables: { [item.wearable]: 1 },
                weighting: expect.any(Number),
              });
            }
          });
        });
      });
    });
  });
});
