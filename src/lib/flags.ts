import { getKeys } from "features/game/types/craftables";
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
  | "BANNER_SALES"
  | "PRESTIGE_DESERT"
  | "CHICKEN_RESCUE"
  | "CROP_MACHINE"
  | "DESERT_RECIPES"
  | "KINGDOM"
  | "FACTION_HOUSE"
  | "CLAIM_EMBLEMS"
  | "EMBLEM_TRADING"
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
  EMBLEM_TRADING: (game) => {
    if (defaultFeatureFlag(game)) return true;

    return Date.now() > new Date("2024-06-14T01:00:00Z").getTime();
  },
  KINGDOM: (game) => {
    const hasCastleBud = getKeys(game.buds ?? {}).some(
      (id) => game.buds?.[id].type === "Castle"
    );

    if (hasCastleBud) return true;

    if (defaultFeatureFlag(game)) return true;

    return Date.now() > new Date("2024-06-14T00:00:00Z").getTime();
  },
  FACTION_HOUSE: defaultFeatureFlag,
  EASTER: (game) => {
    // Event ended
    if (Date.now() > new Date("2024-04-08T00:00:00Z").getTime()) return false;

    if (defaultFeatureFlag(game)) return true;

    return Date.now() > new Date("2024-03-31T00:00:00Z").getTime();
  },
  FACTIONS: clashOfFactionsFeatureFlag,
  BANNER_SALES: clashOfFactionsFeatureFlag,
  PRESTIGE_DESERT: defaultFeatureFlag,
  // Just in case we need to disable the crop machine, leave the flag in temporarily
  CROP_MACHINE: () => true,
  CLAIM_EMBLEMS: timeBasedFeatureFlag(new Date("2024-06-14T00:00:00Z")),
  MARKS_LEADERBOARD: defaultFeatureFlag,
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
