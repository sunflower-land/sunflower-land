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
  | "CHICKEN_RESCUE"
  | "CROP_MACHINE"
  | "DESERT_RECIPES"
  | "FACTION_HOUSE"
  | "CROP_QUICK_SELECT"
  | "FESTIVAL_OF_COLORS"
  | "FACTION_KITCHEN"
  | "FACTION_CHORES"
  | "CHAMPIONS";

// Used for testing production features
export const ADMIN_IDS = [1, 2, 3, 39488];

type FeatureFlag = (game: GameState) => boolean;

const featureFlags: Record<FeatureName, FeatureFlag> = {
  FESTIVAL_OF_COLORS: (game) => {
    if (defaultFeatureFlag(game)) return true;

    return Date.now() > new Date("2024-06-25T00:00:00Z").getTime();
  },
  CHAMPIONS: betaTimeBasedFeatureFlag(new Date("2024-07-15T00:00:00Z")),
  CROP_QUICK_SELECT: defaultFeatureFlag,
  CHICKEN_RESCUE: defaultFeatureFlag,
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
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
