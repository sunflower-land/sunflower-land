import {
  isCollectible,
  isWearable,
} from "../events/landExpansion/buySeasonalItem";
import {
  ChestReward,
  BASIC_REWARDS,
  RARE_REWARDS,
  LUXURY_REWARDS,
  MEGASTORE_TIER_WEIGHTS,
  MEGASTORE_RESTRICTED_ITEMS,
  CHEST_MULTIPLIER,
} from "./chests";
import { MEGASTORE, SeasonalStore } from "./megastore";
import { getCurrentSeason } from "./seasons";

describe("SEASONAL_REWARDS", () => {
  it("includes seasonal megastore items in all reward types with correct tier-based weightings", () => {
    const currentSeason = getCurrentSeason(new Date());
    const store = MEGASTORE[currentSeason];

    // Test all reward types
    const rewardTypes: {
      rewards: ChestReward[];
      weight: number;
    }[] = [
      { rewards: BASIC_REWARDS(), weight: 5 },
      { rewards: RARE_REWARDS(), weight: 25 },
      { rewards: LUXURY_REWARDS(), weight: 50 },
    ];

    rewardTypes.forEach(({ rewards, weight }) => {
      // Test all tiers
      Object.entries(MEGASTORE_TIER_WEIGHTS).forEach(([tier, tierWeight]) => {
        const tierItems = store[tier as keyof SeasonalStore].items;

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

      // Verify items from other seasons are not included
      Object.entries(MEGASTORE).forEach(([season, seasonStore]) => {
        if (season === currentSeason) return; // Skip current season

        // Check all tiers in other seasons
        Object.entries(MEGASTORE_TIER_WEIGHTS).forEach(([tier]) => {
          const tierItems = seasonStore[tier as keyof SeasonalStore].items;

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
