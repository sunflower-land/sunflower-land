import type { GameState } from "features/game/types/game";
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

// Used for testing production features
export const ADMIN_IDS = [1, 3, 51, 39488, 128727];
/**
 * Adam: 1
 * Spencer: 3
 * Sacul: 51 <- Look mom I'm famous
 * Craig: 39488
 * Elias: 128727
 */

export const MODERATOR_IDS = [
  // Core Team, Engineers and Community Managers
  ...ADMIN_IDS,
  45, // Chicken
  130170, // Dcol
  29, // Aeon
  7841, // Labochi
  56, // Birb
  73795, // LittleEins
  21303, // Oniel
  2253, // Celinho

  // Moderators
  53865, // kegw
  4280, // henry
  201, // subzero
  69166, // sushi
  13, // pecelTumpang
  9609, // vitt0c
  8084, // azaro
  9239, // Mama Mahalkoe
  145238, // Droid
  202687, // TheWheatcher
];

export type FeatureFlag = (game: GameState) => boolean;

export type ExperimentName = "ONBOARDING_CHALLENGES" | "GEM_BOOSTS";

/*
 * How to Use:
 * Add the feature name to this list when working on a new feature.
 * When the feature is ready for public release, delete the feature from this list.
 *
 * Do not delete JEST_TEST.
 */
const featureFlags = {
  CHORE_BOARD: betaTimeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  ONBOARDING_REWARDS: (game: GameState) =>
    game.experiments.includes("ONBOARDING_CHALLENGES"),
  SEASONAL_TIERS: timeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  MARKETPLACE: testnetFeatureFlag,
  CROP_QUICK_SELECT: () => false,
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  EASTER: () => false, // To re-enable next easter
  SKILLS_REVAMP: testnetFeatureFlag,
  FSL: betaTimeBasedFeatureFlag(new Date("2024-10-10T00:00:00Z")),
  NEW_RESOURCES_GE: defaultFeatureFlag,
  ANIMAL_BUILDINGS: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  BARLEY: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  GEM_BOOSTS: (game: GameState) => game.experiments.includes("GEM_BOOSTS"),
  CHICKEN_GARBO: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  CRAFTING_BOX: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  FLOWER_BOUNTIES: timeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  BEDS: timeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  BULL_RUN_PLAZA: betaTimeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  BALE_AOE_END: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  ENHANCED_RESTOCK: defaultFeatureFlag,
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof featureFlags;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
