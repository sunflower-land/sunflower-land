import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";
import { CONFIG } from "lib/config";

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "mumbai" || !!inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = () => CONFIG.NETWORK === "mumbai";
/*
 * How to Use:
 * Add the feature name to this list when working on a new feature.
 * When the feature is ready for public release, delete the feature from this list.
 *
 * Do not delete JEST_TEST.
 */
type FeatureName =
  | "JEST_TEST"
  | "PUMPKIN_PLAZA"
  | "NEW_DELIVERIES"
  | "NEW_FARM_FLOW"
  | "BUDS_DEPOSIT_FLOW"
  | "BEACH"
  | "HALLOWEEN"
  | "BANANA"
  | "LOCALISATION"
  | "PORTALS"
  | "BEACH_FISHING"
  | "HOME"
  | "ISLAND_UPGRADE"
  | "FLOWERS";

// Used for testing production features
export const ADMIN_IDS = [
  1, 2, 3, 39488, 1011, 45, 130170, 29, 7841, 51, 56, 73795, 21303, 2253,
  128015,
];

type FeatureFlag = (game: GameState) => boolean;

const featureFlags: Record<FeatureName, FeatureFlag> = {
  ISLAND_UPGRADE: (game: GameState) => {
    if (Date.now() > new Date("2024-02-01").getTime()) {
      return true;
    }

    return defaultFeatureFlag(game);
  },
  BEACH_FISHING: () => true,
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  PUMPKIN_PLAZA: defaultFeatureFlag,
  NEW_DELIVERIES: testnetFeatureFlag,
  NEW_FARM_FLOW: () => true,
  BUDS_DEPOSIT_FLOW: () => true,
  HOME: defaultFeatureFlag,

  HALLOWEEN: (game: GameState) => {
    if (Date.now() > new Date("2023-11-01").getTime()) {
      return false;
    }

    if (Date.now() > new Date("2023-10-26").getTime()) {
      return true;
    }

    return defaultFeatureFlag(game);
  },

  BEACH: (game: GameState) => {
    const hasBeachBud = getKeys(game.buds ?? {}).some(
      (id) => game.buds?.[id]?.type === "Beach"
    );

    if (hasBeachBud) {
      return true;
    }

    if (Date.now() > SEASONS["Catch the Kraken"].startDate.getTime()) {
      return true;
    }

    return defaultFeatureFlag(game);
  },
  BANANA: (game: GameState) => {
    if (Date.now() > SEASONS["Catch the Kraken"].startDate.getTime()) {
      return true;
    }

    return defaultFeatureFlag(game);
  },
  LOCALISATION: testnetFeatureFlag,
  FLOWERS: testnetFeatureFlag,
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  const isWitchesEve = Date.now() > SEASONS["Witches' Eve"].startDate.getTime();
  if (featureName === "NEW_DELIVERIES" && isWitchesEve) {
    return true;
  }

  if (featureName === "PUMPKIN_PLAZA" && isWitchesEve) {
    return true;
  }

  return featureFlags[featureName](game);
};
