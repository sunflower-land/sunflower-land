import { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const clashOfFactionsFeatureFlag = () => {
  if (testnetFeatureFlag()) return true;

  return Date.now() > new Date("2024-05-01T00:00:00Z").getTime();
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
  | "FACTION_LEADERBOARD"
  | "BANNER_SALES"
  | "PRESTIGE_DESERT"
  | "CHICKEN_RESCUE"
  | "CROP_MACHINE"
  | "COOKING_BOOST"
  | "DESERT_RECIPES"
  | "KINGDOM"
  | "FACTION_HOUSE"
  | "EMBLEM_COUNTDOWN_TIMER"
  | "CLAIM_EMBLEMS";

// Used for testing production features
export const ADMIN_IDS = [1, 2, 3, 39488];

type FeatureFlag = (game: GameState) => boolean;

const featureFlags: Record<FeatureName, FeatureFlag> = {
  CHICKEN_RESCUE: defaultFeatureFlag,
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  DESERT_RECIPES: defaultFeatureFlag,
  KINGDOM: defaultFeatureFlag,
  FACTION_HOUSE: defaultFeatureFlag,
  EASTER: (game) => {
    // Event ended
    if (Date.now() > new Date("2024-04-08T00:00:00Z").getTime()) return false;

    if (defaultFeatureFlag(game)) return true;

    return Date.now() > new Date("2024-03-31T00:00:00Z").getTime();
  },
  FACTIONS: clashOfFactionsFeatureFlag,
  FACTION_LEADERBOARD: clashOfFactionsFeatureFlag,
  BANNER_SALES: clashOfFactionsFeatureFlag,
  PRESTIGE_DESERT: defaultFeatureFlag,
  // Just in case we need to disable the crop machine, leave the flag in temporarily
  CROP_MACHINE: () => true,
  COOKING_BOOST: defaultFeatureFlag,
  EMBLEM_COUNTDOWN_TIMER: timeBasedFeatureFlag(
    new Date("2024-06-10T00:00:00Z")
  ),
  CLAIM_EMBLEMS: timeBasedFeatureFlag(new Date("2024-06-14T00:00:00Z")),
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
