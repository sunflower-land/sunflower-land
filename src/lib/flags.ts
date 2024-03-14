import { GameState } from "features/game/types/game";
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
type FeatureName = "JEST_TEST" | "PORTALS" | "DEQUIPPER" | "CHESTS";

// Used for testing production features
export const ADMIN_IDS = [
  1, 2, 3, 39488, 1011, 45, 130170, 29, 7841, 51, 56, 73795, 21303, 2253,
  128015,
];

type FeatureFlag = (game: GameState) => boolean;

const featureFlags: Record<FeatureName, FeatureFlag> = {
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  DEQUIPPER: defaultFeatureFlag,
  CHESTS: defaultFeatureFlag,
};

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
