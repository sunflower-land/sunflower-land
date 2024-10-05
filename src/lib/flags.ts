import { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const timeBasedFeatureFlag = (date: Date) => () => {
  return testnetFeatureFlag() || Date.now() > date.getTime();
};

const betaTimeBasedFeatureFlag = (date: Date) => (game: GameState) => {
  return defaultFeatureFlag(game) || Date.now() > date.getTime();
};

/*
 * How to Use:
 * Add the feature name to this list when working on a new feature.
 * When the feature is ready for public release, delete the feature from this list.
 *
 * Do not delete JEST_TEST.
 */
export type FeatureName =
  | "JEST_TEST"
  | "PORTALS"
  | "EASTER"
  | "CROP_QUICK_SELECT"
  | "SKILLS_REVAMP"
  | "MARKETPLACE"
  | "ONBOARDING_REWARDS"
  | "FRUIT_DASH"
  | "HALLOWEEN"
  | "TREASURE_UPDATES"
  | "NEW_RESOURCES_GE";

// Used for testing production features
export const ADMIN_IDS = [1, 3, 51, 39488, 128727];
/**
 * Adam: 1
 * Spencer: 3
 * Sacul: 51
 * Craig: 39488
 * Elias: 128727
 */

type FeatureFlag = (game: GameState) => boolean;

export type ExperimentName = "ONBOARDING_CHALLENGES";

const featureFlags: Record<FeatureName, FeatureFlag> = {
  ONBOARDING_REWARDS: (game) =>
    game.experiments.includes("ONBOARDING_CHALLENGES"),
  MARKETPLACE: testnetFeatureFlag,
  CROP_QUICK_SELECT: () => false,
  FRUIT_DASH: betaTimeBasedFeatureFlag(new Date("2024-09-10T00:00:00Z")),
  HALLOWEEN: betaTimeBasedFeatureFlag(new Date("2024-10-31T00:00:00Z")),
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  EASTER: () => false, // To re-enable next easter
  SKILLS_REVAMP: testnetFeatureFlag,
  TREASURE_UPDATES: betaTimeBasedFeatureFlag(new Date("2024-09-16T00:00:00Z")),
  NEW_RESOURCES_GE: defaultFeatureFlag,
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
