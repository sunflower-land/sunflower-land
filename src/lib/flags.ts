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

const timePeriodFeatureFlag =
  ({ start, end }: TimeBasedFeatureWindow) =>
  () =>
  (now: number) => {
    if (end === null) {
      return testnetFeatureFlag() || now >= start.getTime();
    }

    return (
      (testnetFeatureFlag() || now > start.getTime()) && now < end.getTime()
    );
  };

const betaTimePeriodFeatureFlag =
  ({ start, end }: TimeBasedFeatureWindow) =>
  (game: GameState) =>
  (now: number) => {
    if (end === null) {
      return defaultFeatureFlag(game) || now > start.getTime();
    }

    return (
      (defaultFeatureFlag(game) || now > start.getTime()) && now < end.getTime()
    );
  };

export type FeatureFlag = (game: GameState) => boolean;

/**
 * @param start - The start date of the feature.
 * @param end - The end date of the feature. If null, the feature is available indefinitely.
 */
export type TimeBasedFeatureWindow = { start: Date; end: Date | null };

export const TIME_BASED_FEATURE_FLAG_WINDOWS = {
  TICKETS_FROM_COIN_NPC: { start: new Date("2026-02-24T00:00:00Z"), end: null },
  APRIL_FOOLS_EVENT_FLAG: {
    start: new Date("2026-04-01T00:00:00Z"),
    end: new Date("2026-04-08T00:00:00Z"),
  },
} satisfies Record<string, TimeBasedFeatureWindow>;

/** All time-based flags receive the full window; start-only helpers ignore `end`. */
export type TimeBasedFeatureFlag = (
  window: TimeBasedFeatureWindow,
) => (game: GameState) => (now: number) => boolean;

export type TimeBasedFeatureName = keyof typeof TIME_BASED_FEATURE_FLAG_WINDOWS;

export const TIME_BASED_FEATURE_FLAGS: Record<
  TimeBasedFeatureName,
  TimeBasedFeatureFlag
> = {
  TICKETS_FROM_COIN_NPC: timePeriodFeatureFlag,
  APRIL_FOOLS_EVENT_FLAG: betaTimePeriodFeatureFlag,
};

/**
 * @param featureName - The name of the feature to check access for.
 * @param startTime - Instant to evaluate access at (e.g. order `createdAt` or `Date.now()`).
 * @param game - The game state.
 * @returns True if the player has access to the feature at `startTime`, false otherwise.
 */
export function hasTimeBasedFeatureAccess({
  featureName,
  now,
  game,
}: {
  featureName: TimeBasedFeatureName;
  game: GameState;
  now: number;
}) {
  const window = TIME_BASED_FEATURE_FLAG_WINDOWS[featureName];
  return TIME_BASED_FEATURE_FLAGS[featureName](window)(game)(now);
}

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

  STREAM_STAGE_ACCESS: adminFeatureFlag,

  MODERATOR: (game) =>
    !!((game.wardrobe.Halo ?? 0) > 0) && !!game.inventory["Beta Pass"]?.gt(0),

  CHAACS_TEMPLE_BETA: defaultFeatureFlag,
  SALT_FARM: usernameFeatureFlag,

  AGING_SHED: usernameFeatureFlag,

  /** Tokenized minigame economy: dashboard, portal API, marketplace minigames row. */
  TOKEN_MINIGAMES: defaultFeatureFlag,
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof FEATURE_FLAGS;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return FEATURE_FLAGS[featureName](game);
};
