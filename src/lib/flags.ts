import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

const adminFeatureFlag = ({ wardrobe, inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" ||
  (!!((wardrobe["Gift Giver"] ?? 0) > 0) && !!inventory["Beta Pass"]?.gt(0));

const usernameFeatureFlag = (game: GameState) => {
  return (
    testnetFeatureFlag() ||
    ["adam", "tango", "elias", "dcol", "birb", "Celinhotv", "LittleEins"]
      .map((name) => name.toLowerCase())
      .includes(game.username?.toLowerCase() ?? "")
  );
};

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const localStorageFeatureFlag = (key: string) =>
  !!localStorage.getItem(key) === true;

const testnetLocalStorageFeatureFlag = (key: string) => () => {
  return testnetFeatureFlag() || localStorageFeatureFlag(key);
};

const timeBasedFeatureFlag = (date: Date) => () => {
  return testnetFeatureFlag() || Date.now() > date.getTime();
};

const betaTimeBasedFeatureFlag = (date: Date) => (game: GameState) => {
  return defaultFeatureFlag(game) || Date.now() > date.getTime();
};

const timePeriodFeatureFlag =
  ({ start, end }: { start: Date; end: Date }) =>
  () => {
    return Date.now() > start.getTime() && Date.now() < end.getTime();
  };

// Used for testing production features and dev access
export const ADMIN_IDS = [1, 3, 39488, 128727];
/**
 * Adam: 1
 * Spencer: 3
 * Craig: 39488
 * Elias: 128727
 */

export type FeatureFlag = (game: GameState) => boolean;

export type ExperimentName = "ONBOARDING_CHALLENGES" | "GEM_BOOSTS";

/*
 * How to Use:
 * Add the feature name to this list when working on a new feature.
 * When the feature is ready for public release, delete the feature from this list.
 *
 * Do not delete JEST_TEST.
 */
const FEATURE_FLAGS = {
  // For testing
  JEST_TEST: defaultFeatureFlag,

  // Permanent Feature Flags
  AIRDROP_PLAYER: adminFeatureFlag,
  HOARDING_CHECK: defaultFeatureFlag,
  STREAMER_HAT: (game) =>
    (game.wardrobe["Streamer Hat"] ?? 0) > 0 || testnetFeatureFlag(),

  // Temporary Feature Flags
  FACE_RECOGNITION: (game) =>
    game.createdAt > new Date("2025-01-01T00:00:00Z").getTime() ||
    !game.verified,
  FACE_RECOGNITION_TEST: defaultFeatureFlag,

  FLOWER_DEPOSIT: usernameFeatureFlag,

  // Released to All Players on 5th May
  FLOWER_GEMS: timeBasedFeatureFlag(new Date("2025-05-05T00:00:00Z")),

  // Testnet only feature flags - Please don't change these until release
  LOVE_CHARM_FLOWER_EXCHANGE: timeBasedFeatureFlag(
    new Date("2025-05-01T00:00:00Z"),
  ),
  //Testnet only
  LOVE_CHARM_REWARD_SHOP: timeBasedFeatureFlag(
    new Date("2025-05-01T00:00:00Z"),
  ),

  LEDGER: testnetLocalStorageFeatureFlag("ledger"),
  BLOCKCHAIN_BOX: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-04-07T00:00:00Z"))(game) &&
    Date.now() < new Date("2025-05-05T00:00:00Z").getTime(),

  // Don't change this feature flag until the love rush event is over
  LOVE_RUSH: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-04-07T00:00:00Z"))(game) &&
    Date.now() < new Date("2025-05-05T00:00:00Z").getTime(),

  EASTER: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-04-21T00:00:00Z"))(game) &&
    Date.now() < new Date("2025-04-29T00:00:00Z").getTime(),
  STREAM_STAGE_ACCESS: adminFeatureFlag,

  LOVE_ISLAND: defaultFeatureFlag,

  GOODBYE_BERT: timeBasedFeatureFlag(new Date("2025-05-01T00:00:00Z")),
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof FEATURE_FLAGS;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return FEATURE_FLAGS[featureName](game);
};
