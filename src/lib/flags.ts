import { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

const defaultFeatureFlag = (inventory: GameState["inventory"]) =>
  CONFIG.NETWORK === "mumbai" || !!inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = (inventory: GameState["inventory"]) =>
  CONFIG.NETWORK === "mumbai";
/*
 * How to Use:
 * Add the feature name to this list when working on a new feature.
 * When the feature is ready for public release, delete the feature from this list.
 *
 * Do not delete JEST_TEST.
 */
type FeatureName = "JEST_TEST" | "FRUIT" | "FRUIT_QUEST";
type FeatureFlag = (inventory: GameState["inventory"]) => boolean;

const featureFlags: Record<FeatureName, FeatureFlag> = {
  JEST_TEST: defaultFeatureFlag,
  FRUIT: defaultFeatureFlag,
  FRUIT_QUEST: testnetFeatureFlag,
};

export const hasFeatureAccess = (
  inventory: GameState["inventory"],
  featureName: FeatureName
) => featureFlags[featureName](inventory);
