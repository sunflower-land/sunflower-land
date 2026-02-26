import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

export const RONIN_AIRDROP_ENDDATE = new Date("2025-11-04T00:00:00Z");

export const adminFeatureFlag = ({ wardrobe, inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" ||
  (!!((wardrobe["Gift Giver"] ?? 0) > 0) && !!inventory["Beta Pass"]?.gt(0));

// const usernameFeatureFlag = (game: GameState) => {
//   return (
//     testnetFeatureFlag() ||
//     [
//       "adam",
//       "tango",
//       "elias",
//       "Aeon",
//       "dcol",
//       "birb",
//       "Celinhotv",
//       "LittleEins",
//       "Labochi",
//       "Craig",
//       "Spencer",
//     ]
//       .map((name) => name.toLowerCase())
//       .includes(game.username?.toLowerCase() ?? "")
//   );
// };

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory["Beta Pass"]?.gt(0);

export const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const localStorageFeatureFlag = (key: string) =>
  !!localStorage.getItem(key) === true;

const testnetLocalStorageFeatureFlag = (key: string) => () => {
  return testnetFeatureFlag() || localStorageFeatureFlag(key);
};

const timeBasedTestnetFeatureFlag = (date: Date) => (now: number) => {
  return testnetFeatureFlag() || now >= date.getTime();
};

const timeBasedOnlyFeatureFlag = (date: Date) => (now: number) =>
  now >= date.getTime();

const betaTimeBasedFeatureFlag = (date: Date) => (game: GameState) => {
  return defaultFeatureFlag(game) || Date.now() > date.getTime();
};

const adminTimeBasedFeatureFlag = (date: Date) => (game: GameState) => {
  return adminFeatureFlag(game) || Date.now() > date.getTime();
};

const timePeriodFeatureFlag =
  ({ start, end }: { start: Date; end: Date }) =>
  () => {
    return Date.now() > start.getTime() && Date.now() < end.getTime();
  };

/**
 * Used for testing production features and dev access
 * @Adam 1
 * @Spencer 3
 * @Craig 39488
 * @Elias 128727
 */
export const ADMIN_IDS = [1, 3, 39488, 128727];

/**
 * IDs whitelisted to airdrop players
 * @Aeon 29
 * @Dcol 130170
 * @Labochi 7841
 */
export const MANAGER_IDS = [...ADMIN_IDS, 29, 130170, 7841];

export type FeatureFlag = (game: GameState) => boolean;

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
  FACE_RECOGNITION_TEST: defaultFeatureFlag,
  LEDGER: testnetLocalStorageFeatureFlag("ledger"),

  LEAGUES: () => false,

  EASTER: () => false,

  HOLIDAYS_EVENT_FLAG: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-12-23T00:00:00Z"))(game) &&
    Date.now() < new Date("2026-01-05T00:00:00Z").getTime(),

  STREAM_STAGE_ACCESS: adminFeatureFlag,

  MODERATOR: (game) =>
    !!((game.wardrobe.Halo ?? 0) > 0) && !!game.inventory["Beta Pass"]?.gt(0),

  PET_HOUSE: defaultFeatureFlag,
} satisfies Record<string, FeatureFlag>;

const TIME_BASED_FEATURE_FLAGS = {
  TICKETS_FROM_COIN_NPC: timeBasedOnlyFeatureFlag(
    new Date("2026-02-24T00:00:00Z"),
  ),
  OFFCHAIN_RESOURCES: timeBasedTestnetFeatureFlag(
    new Date("2026-03-02T00:00:00Z"),
  ),
} satisfies Record<string, TimeBasedFeatureFlag>;

export type FeatureName = keyof typeof FEATURE_FLAGS;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return FEATURE_FLAGS[featureName](game);
};

export type TimeBasedFeatureFlag = (now: number) => boolean;

export type TimeBasedFeatureName = keyof typeof TIME_BASED_FEATURE_FLAGS;

export const hasTimeBasedFeatureAccess = (
  featureName: TimeBasedFeatureName,
  now: number,
) => {
  return TIME_BASED_FEATURE_FLAGS[featureName](now);
};
