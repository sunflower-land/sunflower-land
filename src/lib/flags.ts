import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

export const RONIN_AIRDROP_ENDDATE = new Date("2025-11-04T00:00:00Z");

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
      "Aeon",
      "dcol",
      "birb",
      "Celinhotv",
      "LittleEins",
      "Labochi",
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

  RONIN_AIRDROP: (game: GameState) => {
    if (Date.now() > RONIN_AIRDROP_ENDDATE.getTime()) return false;

    return betaTimeBasedFeatureFlag(new Date("2025-10-21T00:00:00Z"))(game);
  },
  GAM3_CONTENT: adminFeatureFlag,

  // Permanent Feature Flags
  AIRDROP_PLAYER: adminFeatureFlag,
  HOARDING_CHECK: defaultFeatureFlag,
  STREAMER_HAT: (game) =>
    (game.wardrobe["Streamer Hat"] ?? 0) > 0 || testnetFeatureFlag(),

  // Temporary Feature Flags
  FACE_RECOGNITION_TEST: defaultFeatureFlag,
  LEDGER: testnetLocalStorageFeatureFlag("ledger"),

  EASTER: () => false,

  HALLOWEEN: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-10-28T00:00:00Z"))(game) &&
    Date.now() < new Date("2025-11-05T00:00:00Z").getTime(),

  STREAM_STAGE_ACCESS: adminFeatureFlag,

  WITHDRAWAL_THRESHOLD: timePeriodFeatureFlag({
    start: new Date("2025-05-08T00:00:00Z"),
    end: new Date("2025-06-20T00:00:00.000Z"),
  }),

  MODERATOR: (game) =>
    !!((game.wardrobe.Halo ?? 0) > 0) && !!game.inventory["Beta Pass"]?.gt(0),

  BLESSING: () => true,

  PETS: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-11-03T00:00:00Z"))(game),
  PET_HOUSE: testnetFeatureFlag,
  FLOWER_INSTA_GROW: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-11-03T00:00:00Z"))(game),

  API_PERFORMANCE: () => true,

  OBSIDIAN_EXCHANGE: () =>
    timeBasedFeatureFlag(new Date("2025-11-03T00:00:00Z"))(),
  GASLESS_AUCTIONS: () => true,
  NODE_FORGING: (game) =>
    betaTimeBasedFeatureFlag(new Date("2025-11-03T00:00:00Z"))(game),
  DEPOSIT_SFL: () =>
    Date.now() < new Date("2025-10-28T00:00:00.000Z").getTime(),
  RONIN_FLOWER: betaTimeBasedFeatureFlag(new Date("2025-10-21T00:00:00Z")),
  MEMORY_BETA: defaultFeatureFlag,
  PET_NFT_DEPOSIT: () =>
    timeBasedFeatureFlag(new Date("2025-11-03T00:00:00Z"))(),
  PET_NFT_MARKETPLACE: () =>
    timeBasedFeatureFlag(new Date("2025-11-03T00:00:00Z"))(),
  BUILDING_FRIENDSHIPS: betaTimeBasedFeatureFlag(
    new Date("2025-10-13T00:00:00Z"),
  ),
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof FEATURE_FLAGS;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return FEATURE_FLAGS[featureName](game);
};
