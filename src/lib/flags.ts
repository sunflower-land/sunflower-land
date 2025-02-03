import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

type FeatureFlagGameState = Pick<
  GameState,
  "inventory" | "wardrobe" | "username" | "experiments"
>;

const adminFeatureFlag = ({ wardrobe, inventory }: FeatureFlagGameState) =>
  CONFIG.NETWORK === "amoy" ||
  (!!((wardrobe["Gift Giver"] ?? 0) > 0) && !!inventory["Beta Pass"]?.gt(0));

const seasonAdminFeatureFlag = (game: FeatureFlagGameState) => {
  return (
    testnetFeatureFlag() ||
    ["adam", "tango", "eliassfl", "dcol", "Aeon", "Craig", "Spencer", "Sacul"]
      .map((name) => name.toLowerCase())
      .includes(game.username?.toLowerCase() ?? "")
  );
};

const defaultFeatureFlag = (game: FeatureFlagGameState) =>
  CONFIG.NETWORK === "amoy" || !!game.inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const timeBasedFeatureFlag = (date: Date) => () => {
  return testnetFeatureFlag() || Date.now() > date.getTime();
};

const betaTimeBasedFeatureFlag =
  (date: Date) => (game: FeatureFlagGameState) => {
    return defaultFeatureFlag(game) || Date.now() > date.getTime();
  };

const timePeriodFeatureFlag =
  ({ start, end }: { start: Date; end: Date }) =>
  () => {
    return Date.now() > start.getTime() && Date.now() < end.getTime();
  };

// Used for testing production features
export const ADMIN_IDS = [1, 3, 51, 39488, 128727];
/**
 * Adam: 1
 * Spencer: 3
 * Sacul: 51
 * Craig: 39488
 * Elias: 128727
 */

export type FeatureFlag = (game: FeatureFlagGameState) => boolean;

export type ExperimentName = "ONBOARDING_CHALLENGES" | "GEM_BOOSTS";

/*
 * How to Use:
 * Add the feature name to this list when working on a new feature.
 * When the feature is ready for public release, delete the feature from this list.
 *
 * Do not delete JEST_TEST.
 */
const featureFlags = {
  ONBOARDING_REWARDS: (game: FeatureFlagGameState) =>
    game.experiments.includes("ONBOARDING_CHALLENGES"),
  CROP_QUICK_SELECT: () => false,
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  EASTER: () => false, // To re-enable next easter
  SKILLS_REVAMP: defaultFeatureFlag,
  HALLOWEEN_2024: defaultFeatureFlag,
  ANIMAL_COMPETITION: betaTimeBasedFeatureFlag(
    new Date("2024-12-18T00:00:00Z"),
  ),
  FRUIT_PATCH_QUICK_SELECT: defaultFeatureFlag,
  SEASONAL_EVENTS_NOTIFICATIONS: defaultFeatureFlag,
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof featureFlags;

export const hasFeatureAccess = (
  game: FeatureFlagGameState,
  featureName: FeatureName,
) => {
  return featureFlags[featureName](game);
};
