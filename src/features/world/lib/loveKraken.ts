import type { GameState } from "features/game/types/game";
import { getFloatingIslandGameClaimsToday } from "features/game/events/landExpansion/claimFloatingIslandPrize";
import {
  fromLoveBoulderRoomPrize,
  getLoveBoulderPrizeKey,
  mulberry32,
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

/**
 * The east side of the lake, right off the end of the wharf. The bank and
 * the wharf face each other across it, which is where the crowd gathers.
 */
export const LOVE_KRAKEN_SPOT = { x: 306, y: 566 };

/**
 * Progress it takes the island to land the Marvel. Only used by the local
 * stand-in - once the room is running, the client shows the `health` it
 * publishes, so the room's number is the one that counts.
 *
 * Sized for Adam's brief: twenty anglers reeling properly land it in about a
 * minute. The zone jumps 90-270 degrees ahead of the marker on every landed
 * reel, so the marker reaches the next one after half a sweep on average -
 * one reel every `ringMs / 2`. The sweep tightens with every reel an angler
 * lands, from 1s a reel down to 0.6s after twenty of them, so twenty anglers
 * make about 351 points in their first 16s and 30/s after that:
 * `351 + 44 * 30.3 ≈ 1690`.
 */
export const LOVE_KRAKEN_HEALTH = 1700;

/** What one reel landed on the beat is worth. */
export const LOVE_KRAKEN_REEL_POINTS = 1;

/** Points the Marvel drags back every second as it fights. */
export const LOVE_KRAKEN_FIGHT_BACK_PER_SEC = 3;

/**
 * A full sweep of the ring on a fresh line, and the tightest it ever gets.
 * Every reel an angler lands winds it up by `STEP`, so the fight gets more
 * frantic the closer that angler is to landing the beast - full speed after
 * `(MAX - MIN) / STEP` = 20 reels.
 */
export const LOVE_KRAKEN_RING_MS_MAX = 2000;
export const LOVE_KRAKEN_RING_MS_MIN = 1200;
export const LOVE_KRAKEN_RING_MS_STEP = 40;

/** The catch zone, as a share of a full sweep. */
export const LOVE_KRAKEN_ZONE_SHARE = 0.12;

/** Half the catch zone - a reel lands within this many degrees of its middle. */
export const LOVE_KRAKEN_ZONE_HALF_DEG = (360 * LOVE_KRAKEN_ZONE_SHARE) / 2;

/**
 * How much wider the room's check is than the client's, to forgive the trip
 * over the wire. At a 2s sweep this is about 220ms of lag; anyone slower
 * than that has to lead the marker.
 */
export const LOVE_KRAKEN_LAG_GRACE_DEG = 40;

/**
 * How close a player has to stand to cast at it. Covers the wharf (about
 * 22px off its end) and the whole west bank across the water, which are the
 * only two places anyone can stand at this end of the lake.
 */
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
 * How long one sweep takes for an angler who has landed this many reels.
 *
 * Every reel winds the marker up a step, so the fight gets more frantic the
 * closer that angler is to landing the beast, bottoming out after 20 of
 * them. Read from the reel count rather than the island's progress on
 * purpose: the count is a whole number both the client and the room hold
 * exactly, so they never disagree about the speed, and it only ever changes
 * at the one moment the sweep is allowed to change - see `getLoveKrakenRing`.
 */
export function getLoveKrakenRingMs(reels: number): number {
  return Math.max(
    LOVE_KRAKEN_RING_MS_MIN,
    LOVE_KRAKEN_RING_MS_MAX - Math.max(0, reels) * LOVE_KRAKEN_RING_MS_STEP,
  );
}

/**
 * Which way the marker is going: clockwise on a fresh line, and the other
 * way after every reel landed. Reversing keeps anyone from settling into a
 * rhythm, and it makes a hit unmistakable even out of the corner of an eye.
 */
export function getLoveKrakenSpin(reels: number): 1 | -1 {
  return Math.max(0, reels) % 2 === 0 ? 1 : -1;
}

/**
 * Fastest a reel can land, given the sweep. Only long enough to stop two
 * reels landing on one pass of the zone - the zone jumping away is what
 * actually paces a player, not this.
 */
export function getLoveKrakenReelCooldownMs(ringMs: number): number {
  return Math.round(ringMs * LOVE_KRAKEN_ZONE_SHARE * 2);
}

/**
 * Where this angler's catch zone sits, in degrees clockwise from the top.
 *
 * The zone starts at the top of the ring and jumps somewhere else on every
 * reel they land, so nobody can settle into one rhythm. Each jump carries it
 * **90 to 270 degrees from the last one** - never less than a quarter turn,
 * so it always visibly moves, and half a turn away on average, which is what
 * paces the game.
 *
 * It is a pure function of the round and the angler's own reel count, so the
 * room can work out where a player's zone is from `anglers[farmId]` and check
 * their reel against it. Copy it verbatim.
 */
export function getLoveKrakenZoneAngle({
  roundId,
  reels,
}: {
  roundId: number;
  reels: number;
}): number {
  const random = mulberry32(roundId * 7919 + 13);
  let angle = 0;

  for (let i = 0; i < Math.max(0, reels); i++) {
    angle = (angle + 90 + random() * 180) % 360;
  }

  return angle;
}

/** Fold any angle back into 0..360. */
function normaliseAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export type LoveKrakenRing = {
  /** Where the marker is, in degrees clockwise from the top. */
  angle: number;
  /** Where the middle of the catch zone is, same units. */
  zoneAngle: number;
  /** How long a full sweep takes right now. */
  ringMs: number;
  /** 1 clockwise, -1 anticlockwise. */
  spin: 1 | -1;
};

/**
 * The whole state of one angler's ring at `now`.
 *
 * The marker runs in **legs**: a leg starts the instant a reel lands and
 * runs until the next one does. Within a leg the speed and the direction are
 * fixed, so the marker sweeps smoothly; all three of the things a reel
 * changes - the zone moving, the direction reversing and the sweep winding
 * up - take effect only at a leg boundary. That matters because at the
 * moment of a hit the marker is *sitting on the zone it just hit*, so the
 * new leg starts from exactly where the marker already is. The marker never
 * jumps.
 *
 * (Reading the phase straight off the clock as `now % ringMs` looks
 * equivalent and is not: the moment `ringMs` changes, that phase lurches,
 * which is what made the marker snap back to the top mid-sweep.)
 *
 * Before an angler's first reel there is no leg to anchor to, so the sweep
 * runs off the epoch at the opening speed - every client agrees on it
 * exactly, and since nothing about it changes it is continuous too.
 *
 * `legStartAt` is just when that angler's last reel landed, which the room
 * already keeps to enforce the cooldown. The client stamps it when it sends
 * and the room when it receives, so the two are one trip apart - a few
 * degrees, well inside `LOVE_KRAKEN_LAG_GRACE_DEG`, and it cannot build up
 * because every leg re-anchors.
 */
export function getLoveKrakenRing({
  roundId,
  reels,
  legStartAt,
  now = Date.now(),
}: {
  roundId: number;
  reels: number;
  legStartAt?: number;
  now?: number;
}): LoveKrakenRing {
  const landed = Math.max(0, reels);
  const ringMs = getLoveKrakenRingMs(landed);
  const spin = getLoveKrakenSpin(landed);
  const zoneAngle = getLoveKrakenZoneAngle({ roundId, reels: landed });

  if (landed <= 0 || !legStartAt) {
    return {
      angle: normaliseAngle(((now % ringMs) / ringMs) * 360),
      zoneAngle,
      ringMs,
      spin,
    };
  }

  // The leg started on the zone this angler hit to end the last one
  const from = getLoveKrakenZoneAngle({ roundId, reels: landed - 1 });
  const swept = ((now - legStartAt) / ringMs) * 360;

  return {
    angle: normaliseAngle(from + spin * swept),
    zoneAngle,
    ringMs,
    spin,
  };
}

/** How far the marker is from the middle of the zone, the short way round. */
export function getLoveKrakenRingOffset(ring: LoveKrakenRing): number {
  const gap = Math.abs(ring.angle - ring.zoneAngle) % 360;

  return Math.min(gap, 360 - gap);
}

/**
 * Was a reel on the beat? The room checks the same thing with `toleranceDeg`
 * widened by `LOVE_KRAKEN_LAG_GRACE_DEG`, since the message only reaches it
 * after the trip over the wire.
 */
export function isLoveKrakenReelOnTarget({
  ring,
  toleranceDeg = LOVE_KRAKEN_ZONE_HALF_DEG,
}: {
  ring: LoveKrakenRing;
  toleranceDeg?: number;
}): boolean {
  return getLoveKrakenRingOffset(ring) <= toleranceDeg;
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
 * Local mode: how many anglers the simulated bank stands in for. Twenty, so
 * the stand-in plays at the pace the room will once it ships - including
 * winding up with the marker as the fight goes on.
 */
export const LOVE_KRAKEN_LOCAL_CROWD_ANGLERS = 20;

/**
 * Reels the simulated bank lands a second. An angler reeling properly lands
 * one every half sweep, since that is how far the zone jumps on average, and
 * the bank winds up over the round exactly as a real one would - the sweep
 * they are on is interpolated from how far along the fight is, since the
 * stand-in has no reel counts of its own to read.
 */
export function getLoveKrakenLocalCrowdReelsPerSec({
  progress,
  health,
}: {
  progress: number;
  health: number;
}): number {
  const share = health > 0 ? Math.min(1, Math.max(0, progress / health)) : 0;
  const ringMs =
    LOVE_KRAKEN_RING_MS_MAX -
    share * (LOVE_KRAKEN_RING_MS_MAX - LOVE_KRAKEN_RING_MS_MIN);

  return LOVE_KRAKEN_LOCAL_CROWD_ANGLERS / (ringMs / LOVE_KRAKEN_RING_MS_MAX);
}

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
  const crowd =
    (elapsed / 1000) *
    getLoveKrakenLocalCrowdReelsPerSec({
      progress: round.progress,
      health: round.health,
    });
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
