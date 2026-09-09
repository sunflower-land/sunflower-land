import type { GameState } from "features/game/types/game";
import { getFloatingIslandGameClaimsToday } from "features/game/events/landExpansion/claimFloatingIslandPrize";
import {
  fromLoveBoulderRoomPrize,
  getLoveBoulderPrizeKey,
  LOVE_BOULDER_COINS_PRIZE,
  LOVE_BOULDER_PRIZE,
  LOVE_BOULDER_PRIZE_ITEMS,
  type LoveBoulderPrize,
} from "./loveIsland";

// ---------------------------------------------------------------------------
// The Marvel in the lake
// ---------------------------------------------------------------------------

/**
 * A Love Marine Marvel lurks in the lake on the west of the island, its
 * tentacles breaking the surface. A ring sweeps around it with a catch zone
 * at the top; every islander who casts a line and reels on the beat drags it
 * a point closer to the surface, while the beast pulls back three points a
 * second. One angler can never out-pull it - it takes a crowd on the bank,
 * and around twenty of them land it in about a minute.
 */

/** Middle of the lake's lower pool, clear of the seasonal guardian. */
export const LOVE_KRAKEN_SPOT = { x: 276, y: 616 };

/**
 * Progress it takes the island to land the Marvel. Only used by the local
 * stand-in - once the room is running, the client shows the `health` it
 * publishes, so the room's number is the one that counts.
 *
 * Sized for Adam's brief: twenty anglers reeling properly land it in about a
 * minute. A full sweep of the ring is 2s and the cooldown lets one reel
 * through per sweep, so a player at their best is worth 0.5 points a second.
 * Twenty of them make 10/s, the beast takes 3/s back, and 400 / 7 ≈ 57s.
 * The same sum puts the floor at six anglers - below that the Marvel wins,
 * which is the point of it being a community game.
 */
export const LOVE_KRAKEN_HEALTH = 400;

/** What one reel landed on the beat is worth. */
export const LOVE_KRAKEN_REEL_POINTS = 1;

/** Points the Marvel drags back every second as it fights. */
export const LOVE_KRAKEN_FIGHT_BACK_PER_SEC = 3;

/** One full sweep of the ring around the Marvel. */
export const LOVE_KRAKEN_RING_MS = 2000;

/** The catch zone at the top of the ring, as a share of a full sweep. */
export const LOVE_KRAKEN_ZONE_SHARE = 0.12;

/** Half the catch zone - a reel lands within this many degrees of the top. */
export const LOVE_KRAKEN_ZONE_HALF_DEG = (360 * LOVE_KRAKEN_ZONE_SHARE) / 2;

/**
 * How much wider the room's check is than the client's, to forgive the trip
 * over the wire. At a 2s sweep this is about 220ms of lag; anyone slower
 * than that has to lead the marker.
 */
export const LOVE_KRAKEN_LAG_GRACE_DEG = 40;

/**
 * Fastest a player can land a reel. Just under a sweep, so a good angler
 * scores on every pass of the zone and nobody can score twice on one.
 */
export const LOVE_KRAKEN_REEL_COOLDOWN_MS = 1700;

/** How close a player has to stand to cast at it - the whole bank is in. */
export const LOVE_KRAKEN_REACH = 90;

/**
 * How long the prize floats over the Marvel once it is landed, and so how
 * long it is before a fresh one surfaces. Longer than the Love Boulder's
 * window: it takes a crowd to get here, and a crowd needs a moment to click.
 */
export const LOVE_KRAKEN_RESPAWN_MS = 10_000;

/** The prize can be claimed this many times per UTC day. */
export const LOVE_KRAKEN_MAX_CLAIMS = 1;

/**
 * The Marvel pays the same roll as the Love Boulder - a Bronze Love Box, a
 * Bronze Food Box, 250 coins or 500 coins, picked per UTC day on the API and
 * published on the room - so the prize shape and its parsers are shared.
 */
export type LoveKrakenPrize = LoveBoulderPrize;
export const LOVE_KRAKEN_PRIZE = LOVE_BOULDER_PRIZE;
export const LOVE_KRAKEN_PRIZE_ITEMS = LOVE_BOULDER_PRIZE_ITEMS;
export const LOVE_KRAKEN_COINS_PRIZE = LOVE_BOULDER_COINS_PRIZE;
export const fromLoveKrakenRoomPrize = fromLoveBoulderRoomPrize;
export const getLoveKrakenPrizeKey = getLoveBoulderPrizeKey;

// ---------------------------------------------------------------------------
// The ring
// ---------------------------------------------------------------------------

/**
 * Where the marker sits on the ring right now: degrees clockwise from the
 * top, which is where the catch zone is.
 *
 * Anchored to the epoch rather than to a round, so every client and the room
 * agree on the beat with no coordination - and the room can judge a reel
 * itself instead of taking the client's word for it. One ring around one
 * Marvel means the whole bank reels together, which is the point.
 */
export function getLoveKrakenRingAngle(now: number = Date.now()): number {
  return ((now % LOVE_KRAKEN_RING_MS) / LOVE_KRAKEN_RING_MS) * 360;
}

/** How far the marker is from the middle of the catch zone, in degrees. */
export function getLoveKrakenRingOffset(now: number = Date.now()): number {
  const angle = getLoveKrakenRingAngle(now);

  return Math.min(angle, 360 - angle);
}

/**
 * Was a reel at `now` on the beat? The room checks the same thing with
 * `toleranceDeg` widened by `LOVE_KRAKEN_LAG_GRACE_DEG`, since the message
 * only reaches it after the trip over the wire.
 */
export function isLoveKrakenReelOnTarget({
  now = Date.now(),
  toleranceDeg = LOVE_KRAKEN_ZONE_HALF_DEG,
}: { now?: number; toleranceDeg?: number } = {}): boolean {
  return getLoveKrakenRingOffset(now) <= toleranceDeg;
}

// ---------------------------------------------------------------------------
// The round
// ---------------------------------------------------------------------------

export type LoveKrakenRound = {
  /** Increments every time a fresh Marvel surfaces. */
  roundId: number;
  /** Points it takes to land it - the progress bar's full width. */
  health: number;
  /** Points the island has on it, 0..health. */
  progress: number;
  /**
   * True only once the Marvel is authoritatively landed. Kept separate from
   * `progress` so a client's own optimism can't land it early.
   */
  caught: boolean;
  /** Epoch ms it was landed; unset while it fights. */
  caughtAt?: number;
  /** Epoch ms a fresh Marvel surfaces; unset while it fights. */
  respawnAt?: number;
  /** What this Marvel pays - the server's roll for the day. */
  prize: LoveKrakenPrize;
};

/** Progress left after the Marvel has fought back for `elapsedMs`. */
export function applyLoveKrakenFightBack({
  progress,
  elapsedMs,
}: {
  progress: number;
  elapsedMs: number;
}): number {
  return Math.max(
    0,
    progress - (Math.max(0, elapsedMs) / 1000) * LOVE_KRAKEN_FIGHT_BACK_PER_SEC,
  );
}

/** Is the prize floating over the Marvel right now, waiting to be clicked? */
export function isLoveKrakenRewardOpen({
  round,
  now = Date.now(),
}: {
  round: LoveKrakenRound;
  now?: number;
}): boolean {
  return round.caught && now < (round.respawnAt ?? 0);
}

// ---------------------------------------------------------------------------
// Claiming
// ---------------------------------------------------------------------------

/** Today's Marvel claims (at most one, but the event keeps a list). */
export function getLoveKrakenClaimsToday({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}) {
  return getFloatingIslandGameClaimsToday({
    state,
    game: "love_kraken",
    createdAt: now,
  });
}

export function hasClaimedLoveKrakenToday({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): boolean {
  return (
    getLoveKrakenClaimsToday({ state, now }).length >= LOVE_KRAKEN_MAX_CLAIMS
  );
}

/** Has this exact Marvel already been claimed (e.g. a reload mid-window)? */
export function hasClaimedLoveKrakenRound({
  state,
  roundId,
  now = Date.now(),
}: {
  state: GameState;
  roundId: number;
  now?: number;
}): boolean {
  return getLoveKrakenClaimsToday({ state, now }).some(
    (claim) => claim.roundId === roundId,
  );
}

/**
 * Whether the prize pays this player: they must have landed at least one
 * reel on the Marvel that was caught, and not have claimed one yet today.
 */
export function canClaimLoveKraken({
  state,
  myReels,
  roundId,
  now = Date.now(),
}: {
  state: GameState;
  myReels: number;
  roundId: number;
  now?: number;
}): boolean {
  if (myReels <= 0) return false;
  if (hasClaimedLoveKrakenRound({ state, roundId, now })) return false;

  return !hasClaimedLoveKrakenToday({ state, now });
}

// ---------------------------------------------------------------------------
// Local stand-in
// ---------------------------------------------------------------------------

/**
 * Local mode: reels the simulated bank lands a second. Set to what twenty
 * anglers reeling properly would make, so the stand-in plays at the pace the
 * room will once it ships.
 */
export const LOVE_KRAKEN_LOCAL_CROWD_REELS_PER_SEC = 10;

export type LoveKrakenLocalRound = LoveKrakenRound & {
  lastTickAt: number;
};

export function createLoveKrakenLocalRound(
  now: number = Date.now(),
  roundId = 1,
): LoveKrakenLocalRound {
  return {
    roundId,
    health: LOVE_KRAKEN_HEALTH,
    progress: 0,
    caught: false,
    prize: LOVE_KRAKEN_PRIZE,
    lastTickAt: now,
  };
}

/**
 * Local stand-in while the MMO room has no Marvel state: a simulated bank
 * reels at a steady rate against the beast pulling back, the local player's
 * own reels go straight on top, and once it is landed the prize window runs
 * before a fresh Marvel surfaces - the same shape the room publishes.
 */
export function tickLoveKrakenLocalRound({
  round,
  now = Date.now(),
}: {
  round: LoveKrakenLocalRound;
  now?: number;
}): LoveKrakenLocalRound {
  if (round.caught) {
    return now >= (round.respawnAt ?? 0)
      ? createLoveKrakenLocalRound(now, round.roundId + 1)
      : round;
  }

  const elapsed = Math.max(0, now - round.lastTickAt);
  const crowd = (elapsed / 1000) * LOVE_KRAKEN_LOCAL_CROWD_REELS_PER_SEC;
  const progress = Math.min(
    round.health,
    applyLoveKrakenFightBack({ progress: round.progress, elapsedMs: elapsed }) +
      crowd,
  );

  if (progress < round.health) {
    return { ...round, progress, lastTickAt: now };
  }

  return {
    ...round,
    progress: round.health,
    caught: true,
    caughtAt: now,
    respawnAt: now + LOVE_KRAKEN_RESPAWN_MS,
    lastTickAt: now,
  };
}

/** The local player landed a reel on the stand-in. */
export function reelLoveKrakenLocalRound({
  round,
  now = Date.now(),
}: {
  round: LoveKrakenLocalRound;
  now?: number;
}): LoveKrakenLocalRound {
  if (round.caught) return round;

  return tickLoveKrakenLocalRound({
    round: {
      ...round,
      progress: Math.min(
        round.health,
        round.progress + LOVE_KRAKEN_REEL_POINTS,
      ),
    },
    now,
  });
}
