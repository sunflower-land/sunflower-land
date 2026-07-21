import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { TEAM_USERNAMES } from "./access";

export const RONIN_AIRDROP_ENDDATE = new Date("2025-11-04T00:00:00Z");

// Ronin Waypoint (and the migration flow / transfer option for it) stops being
// available after 16th Sept 2026
export const WAYPOINT_WALLET_ENDDATE = new Date("2026-09-16T00:00:00Z");

export const isWaypointWalletDisabled = () =>
  Date.now() >= WAYPOINT_WALLET_ENDDATE.getTime();

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

const betaFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory?.["Beta Pass"]?.gt(0);

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
      return betaFeatureFlag(game) || now > start.getTime();
    }

    return (
      (betaFeatureFlag(game) || now > start.getTime()) && now < end.getTime()
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
  TICKETS_FROM_FLOWER_NPC: {
    start: new Date("2026-05-11T00:00:00Z"),
    end: null,
  },
  APRIL_FOOLS_EVENT_FLAG: {
    start: new Date("2026-04-01T00:00:00Z"),
    end: new Date("2026-04-08T00:00:00Z"),
  },
  COLORS_2026_EVENT_FLAG: {
    start: new Date("2026-07-13T00:00:00Z"),
    end: new Date("2026-07-23T00:00:00Z"),
  },
  RONIN_WAYPOINT_DEPRECATION: {
    start: WAYPOINT_WALLET_ENDDATE,
    end: null,
  },
  // Ascending from Swamp (A1) into the next island (Spooky, A2) unlocks on this
  // date. Testnet bypasses; the first ascension (Volcano → Swamp / A0 → A1) is
  // gated separately by SWAMP_ASCENSION and is unaffected.
  SPOOKY_ASCENSION: {
    start: new Date("2026-09-07T00:00:00Z"),
    end: null,
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
  TICKETS_FROM_FLOWER_NPC: timePeriodFeatureFlag,
  APRIL_FOOLS_EVENT_FLAG: betaTimePeriodFeatureFlag,
  RONIN_WAYPOINT_DEPRECATION: timePeriodFeatureFlag,
  COLORS_2026_EVENT_FLAG: betaTimePeriodFeatureFlag,
  // Testnet-only bypass before the date (not beta), so live testers can reach A2.
  SPOOKY_ASCENSION: timePeriodFeatureFlag,
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
  JEST_TEST: betaFeatureFlag,

  // Permanent Feature Flags
  ADMIN_DASHBOARDS: usernameFeatureFlag,
  AIRDROP_PLAYER: adminFeatureFlag,
  STREAMER_HAT: (game) =>
    (game.wardrobe["Streamer Hat"] ?? 0) > 0 || testnetFeatureFlag(),

  // Temporary Feature Flags
  FACE_RECOGNITION_TEST: betaFeatureFlag,
  LEDGER: testnetLocalStorageFeatureFlag("ledger"),

  LEAGUES: () => false,

  EASTER: () => false,

  STREAM_STAGE_ACCESS: adminFeatureFlag,

  MODERATOR: (game) =>
    !!((game.wardrobe.Halo ?? 0) > 0) && !!game.inventory["Beta Pass"]?.gt(0),

  /**
   * Gates the new home-interior placement system: the /interior route, the
   * /level_one upgrade route, and the `interior.upgrade` event. Beta-pass /
   * testnet only until the feature ships to all players.
   */
  HOME_EXPANSIONS: betaFeatureFlag,

  BOOSTS_DISPLAY: betaFeatureFlag,

  // Saving & re-applying named farm layouts in landscaping mode.
  SAVED_LAYOUTS: betaFeatureFlag,

  // Speed-rate (Clash-of-Clans potion) model for time-based boosts — starting
  // with the Sparrow Shrine on crops. When on, planting stores the new
  // baseDurationMs + true plantedAt model; when off, boosts stay discount-at-start.
  SPEED_BOOSTS: usernameFeatureFlag,

  // Importing leftover items from the old home into the new interior.
  HOME_ITEM_MIGRATION: betaFeatureFlag,

  SWAMP_ASCENSION: betaFeatureFlag,

  // Per-rank skill upgrades (spend Ascension Shards + skill points to rank up a
  // skill). Kept on its own flag so the upgrade UI + `skill.upgraded` event can
  // be toggled independently of the rest of the ascension system (islands,
  // expansion, level bands). Skill *effects* still apply off the stored rank
  // regardless of this flag; only purchasing new ranks is gated here.
  ASCENSION_SKILLS: betaFeatureFlag,
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof FEATURE_FLAGS;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return FEATURE_FLAGS[featureName](game);
};
