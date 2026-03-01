import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { TEAM_USERNAMES } from "./access";

export const RONIN_AIRDROP_ENDDATE = new Date("2025-11-04T00:00:00Z");

export const adminFeatureFlag = ({ wardrobe, inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" ||
  (!!((wardrobe["Gift Giver"] ?? 0) > 0) && !!inventory["Beta Pass"]?.gt(0));

const usernameFeatureFlag = (game: GameState) => {
  return (
    testnetFeatureFlag() ||
    TEAM_USERNAMES.map((name) => name.toLowerCase()).includes(
      game.username?.toLowerCase() ?? "",
    )
  );
};

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory["Beta Pass"]?.gt(0);

export const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const localStorageFeatureFlag = (key: string) =>
  !!localStorage.getItem(key) === true;

const testnetLocalStorageFeatureFlag = (key: string) => () => {
  return testnetFeatureFlag() || localStorageFeatureFlag(key);
};

const timeBasedTestnetFeatureFlag = (date: Date) => () => (now: number) => {
  return testnetFeatureFlag() || now >= date.getTime();
};

const timeBasedOnlyFeatureFlag = (date: Date) => () => (now: number) =>
  now >= date.getTime();

const betaTimeBasedFeatureFlag =
  (date: Date) => (game: GameState) => (now: number) => {
    return defaultFeatureFlag(game) || now > date.getTime();
  };

const adminTimeBasedFeatureFlag = (date: Date) => (game: GameState) => {
  return adminFeatureFlag(game) || Date.now() > date.getTime();
};

const timePeriodFeatureFlag =
  ({ start, end }: { start: Date; end: Date }) =>
  () =>
  (now: number) => {
    return now > start.getTime() && now < end.getTime();
  };

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
  PLACE_FARM_HAND: defaultFeatureFlag,
} satisfies Record<string, FeatureFlag>;

const TIME_BASED_FEATURE_FLAGS = {
  TICKETS_FROM_COIN_NPC: timeBasedOnlyFeatureFlag(
    new Date("2026-02-24T00:00:00Z"),
  ),
  OFFCHAIN_RESOURCES: betaTimeBasedFeatureFlag(
    new Date("2026-03-02T00:00:00Z"),
  ),
} satisfies Record<string, TimeBasedFeatureFlag>;

export type FeatureName = keyof typeof FEATURE_FLAGS;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return FEATURE_FLAGS[featureName](game);
};

export type TimeBasedFeatureFlag = (
  game: GameState,
) => (now: number) => boolean;

export type TimeBasedFeatureName = keyof typeof TIME_BASED_FEATURE_FLAGS;

export const hasTimeBasedFeatureAccess = ({
  featureName,
  now,
  game,
}: {
  featureName: TimeBasedFeatureName;
  now: number;
  game: GameState;
}) => {
  return TIME_BASED_FEATURE_FLAGS[featureName](game)(now);
};
