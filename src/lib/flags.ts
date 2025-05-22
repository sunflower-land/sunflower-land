import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

export const adminFeatureFlag = ({ wardrobe, inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" ||
  (!!((wardrobe["Gift Giver"] ?? 0) > 0) && !!inventory["Beta Pass"]?.gt(0));

const usernameFeatureFlag = (game: GameState) => {
  return (
    testnetFeatureFlag() ||
    [
      "adam",
      "tango",
      "elias",
      "dcol",
      "birb",
      "Celinhotv",
      "LittleEins",
      "Craig",
      "Spencer",
    ]
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

export const MANAGER_IDS = [
  ...ADMIN_IDS,
  29, // Aeon
  130170, // Dcol
];

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

  FLOWER_DASHBOARD: usernameFeatureFlag,

  LEDGER: testnetLocalStorageFeatureFlag("ledger"),

  EASTER: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-04-21T00:00:00Z"))(game) &&
    Date.now() < new Date("2025-04-29T00:00:00Z").getTime(),
  STREAM_STAGE_ACCESS: adminFeatureFlag,

  WITHDRAWAL_THRESHOLD: timePeriodFeatureFlag({
    start: new Date("2025-05-08T00:00:00Z"),
    end: new Date("2025-06-20T00:00:00.000Z"),
  }),

  MODERATOR: (game) => !!game.wardrobe.Halo,
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof FEATURE_FLAGS;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return FEATURE_FLAGS[featureName](game);
};
