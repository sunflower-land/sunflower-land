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
  | "CHICKEN_RESCUE"
  | "CROP_MACHINE"
  | "DESERT_RECIPES"
  | "FACTION_HOUSE"
  | "CROP_QUICK_SELECT"
  | "MARKS_LEADERBOARD"
  | "FESTIVAL_OF_COLORS";

// Used for testing production features
export const ADMIN_IDS = [1, 2, 3, 39488];

type FeatureFlag = (game: GameState) => boolean;

const featureFlags: Record<FeatureName, FeatureFlag> = {
  FESTIVAL_OF_COLORS: (game) => {
    if (defaultFeatureFlag(game)) return true;

    return Date.now() > new Date("2024-06-25T00:00:00Z").getTime();
  },
  CROP_QUICK_SELECT: defaultFeatureFlag,
  CHICKEN_RESCUE: defaultFeatureFlag,
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  DESERT_RECIPES: defaultFeatureFlag,
  FACTION_HOUSE: defaultFeatureFlag,
  EASTER: (game) => {
    return false;
  },
  FACTIONS: clashOfFactionsFeatureFlag,
  BANNER_SALES: clashOfFactionsFeatureFlag,
  // Just in case we need to disable the crop machine, leave the flag in temporarily
  CROP_MACHINE: () => true,
  MARKS_LEADERBOARD: defaultFeatureFlag,
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
