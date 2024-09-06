import { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const clashOfFactionsFeatureFlag = () => {
  return true;
};

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
  | "FACTIONS"
  | "BANNER_SALES"
  | "CROP_MACHINE"
  | "DESERT_RECIPES"
  | "FACTION_HOUSE"
  | "CROP_QUICK_SELECT"
  | "FACTION_KITCHEN"
  | "FACTION_CHORES"
  | "TEST_DIGGING"
  | "NEW_FRUITS"
  | "DESERT_PLAZA"
  | "SKILLS_REVAMP"
  | "MARKETPLACE"
  | "ONBOARDING_REWARDS"
  | "FRUIT_DASH";

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
  CROP_QUICK_SELECT: defaultFeatureFlag,
  FRUIT_DASH: defaultFeatureFlag,
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  DESERT_RECIPES: defaultFeatureFlag,
  FACTION_HOUSE: betaTimeBasedFeatureFlag(new Date("2024-07-08T00:00:00Z")),
  EASTER: (game) => {
    return false;
  },
  FACTIONS: clashOfFactionsFeatureFlag,
  BANNER_SALES: clashOfFactionsFeatureFlag,
  // Just in case we need to disable the crop machine, leave the flag in temporarily
  CROP_MACHINE: () => true,
  FACTION_KITCHEN: betaTimeBasedFeatureFlag(new Date("2022-07-08T00:00:00Z")),
  FACTION_CHORES: betaTimeBasedFeatureFlag(new Date("2022-07-08T00:00:00Z")),
  TEST_DIGGING: betaTimeBasedFeatureFlag(new Date("2024-08-01T00:00:00Z")),
  NEW_FRUITS: betaTimeBasedFeatureFlag(new Date("2024-08-01T00:00:00Z")),
  DESERT_PLAZA: betaTimeBasedFeatureFlag(new Date("2024-08-01T00:00:00Z")),
  SKILLS_REVAMP: testnetFeatureFlag,
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
