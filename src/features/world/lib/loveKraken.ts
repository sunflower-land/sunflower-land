import type { GameState } from "features/game/types/game";
import { getFloatingIslandGameClaimsToday } from "features/game/events/landExpansion/claimFloatingIslandPrize";
import {
  isLoveIslandTileWalkable,
  fromLoveBoulderRoomPrize,
  getLoveBoulderPrizeKey,
  mulberry32,
  LOVE_BOULDER_COINS_PRIZE,
  LOVE_BOULDER_PRIZE,
  LOVE_BOULDER_PRIZE_ITEMS,
  type LoveBoulderPrize,
  type LovePushTile,
} from "./loveIsland";
import { LOVE_ISLAND_MAP_WIDTH, LOVE_ISLAND_TILE_PX } from "./loveIslandTiles";

// ---------------------------------------------------------------------------
// The Marvel in the lake
// ---------------------------------------------------------------------------

/**
 * A Love Marine Marvel lurks in the lake on the west of the island, its
 * tentacles breaking the surface. A ring sweeps around it with a catch zone
 * on it; every islander who casts a line and reels on the beat drags it a
 * point closer to the surface, while the beast pulls back three points a
 * second. One angler can never out-pull it - it takes a crowd on the bank,
 * and around twenty of them land it in about a minute.
 *
 * Every pull of the rod moves the zone, landed or missed, so the button
 * cannot simply be held down; a landed one also reverses the marker and
 * winds the sweep up a step.
 */

/**
 * The east side of the lake, right off the end of the wharf. The bank and
 * the wharf face each other across it, which is where the crowd gathers.
 */
export const LOVE_KRAKEN_SPOT = { x: 306, y: 566 };

/**
 * Where an angler stands to fish. The wharf's deck is the only ground within
 * reach of the Marvel that a crowd can line up along, and its legal standing
 * band - a body box clear of the railings and the water, on a walkable tile -
 * is x 342..390, y 554..568.
 *
 * Everyone is dealt one of these at random on their first cast rather than
 * fishing from wherever they happen to be, so a crowd spreads along the
 * wharf instead of piling onto one plank. They are spread in **y** as well as
 * x for the same reason: a single row of Bumpkins hides the ones behind.
 */
export const LOVE_KRAKEN_CAST_SPOTS: { x: number; y: number }[] = [
  { x: 344, y: 556 },
  { x: 344, y: 566 },
  { x: 354, y: 561 },
  { x: 356, y: 554 },
  { x: 358, y: 568 },
  { x: 368, y: 558 },
  { x: 370, y: 565 },
  { x: 380, y: 556 },
  { x: 382, y: 566 },
];

/**
 * The Cast/Reel button, just above the wharf and over the spots below it.
 *
 * On a phone there is nothing to aim at: the Marvel is small, the marker is
 * moving, and a thumb covers both. So the whole game is one fixed button
 * that never moves and is drawn above every player on the wharf.
 */
export const LOVE_KRAKEN_BUTTON = { x: 356, y: 540 };

/** A Bumpkin's body sits this far below its container position. */
export const LOVE_KRAKEN_BODY_OFFSET_Y = 6;

/** Farthest a walk to the wharf will path, in tiles. */
export const LOVE_KRAKEN_WALK_MAX_TILES = 60;

/** How fast an angler walks to their spot, in px a second. */
export const LOVE_KRAKEN_WALK_SPEED = 60;

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
 * How far your own reel throws the bar forward, and for how long.
 *
 * One point of 1700 is a fiftieth of a pixel on a 38px bar - land one on
 * your own and the bar does not move at all, which reads as the game being
 * broken rather than as needing a hand. So a landed reel kicks the bar
 * forward a visible slice and it eases back to the truth.
 *
 * The kick is **a lie, and deliberately so**: it is worth far more than a
 * point, it is only ever shown to the angler who landed it, and it is never
 * added to `progress`. It is there to say "that worked - now find some more
 * people", which is exactly what a lone angler needs to be told.
 */
export const LOVE_KRAKEN_REEL_KICK_SHARE = 0.05;
export const LOVE_KRAKEN_REEL_KICK_MS = 700;

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
 * How close a player has to stand to cast at it. Covers the wharf (about
 * 22px off its end) and the whole west bank across the water, which are the
 * only two places anyone can stand at this end of the lake.
 */
export const LOVE_KRAKEN_REACH = 90;

/**
 * How long the prize floats over the Marvel once it is landed, and so how
 * long it is before a fresh one surfaces. Longer than the Love Boulder's
 * window: it claims itself part way through, and the rest is celebration.
 */
export const LOVE_KRAKEN_RESPAWN_MS = 10_000;

/** The prize can be claimed this many times per UTC day. */
export const LOVE_KRAKEN_MAX_CLAIMS = 1;

/**
 * How long the prize sits there before it claims itself for everyone who
 * helped. Nobody has to click: they hauled the beast up together, so the box
 * lands in the farm on its own a moment later. The rest of the window is
 * celebration.
 */
export const LOVE_KRAKEN_AUTO_CLAIM_MS = 2000;

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
// Getting to the wharf
// ---------------------------------------------------------------------------

export type LoveKrakenSpot = { x: number; y: number };

/** One of the wharf's spots, at random. */
export function getLoveKrakenCastSpot(
  random: number = Math.random(),
): LoveKrakenSpot {
  const index = Math.min(
    LOVE_KRAKEN_CAST_SPOTS.length - 1,
    Math.max(0, Math.floor(random * LOVE_KRAKEN_CAST_SPOTS.length)),
  );

  return LOVE_KRAKEN_CAST_SPOTS[index];
}

/** The tile a Bumpkin standing at this container position is on. */
export function toLoveKrakenTile({ x, y }: LoveKrakenSpot): LovePushTile {
  return {
    x: Math.floor(x / LOVE_ISLAND_TILE_PX),
    y: Math.floor((y + LOVE_KRAKEN_BODY_OFFSET_Y) / LOVE_ISLAND_TILE_PX),
  };
}

/** Where to put a Bumpkin's container so its body stands on a tile's middle. */
export function fromLoveKrakenTile({ x, y }: LovePushTile): LoveKrakenSpot {
  const half = LOVE_ISLAND_TILE_PX / 2;

  return {
    x: x * LOVE_ISLAND_TILE_PX + half,
    y: y * LOVE_ISLAND_TILE_PX + half - LOVE_KRAKEN_BODY_OFFSET_Y,
  };
}

/** How far to look for ground when a player is stood on a decorative tile. */
const NEAREST_WALKABLE_RADIUS = 3;

/**
 * The walkable tile nearest this one - itself when it already is. Rings
 * outward, so the first hit is the closest.
 */
function nearestWalkableTile(tile: LovePushTile): LovePushTile | undefined {
  if (isLoveIslandTileWalkable(tile)) return tile;

  for (let radius = 1; radius <= NEAREST_WALKABLE_RADIUS; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        // Only the ring's edge - the inside was covered by a smaller radius
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

        const near = { x: tile.x + dx, y: tile.y + dy };
        if (isLoveIslandTileWalkable(near)) return near;
      }
    }
  }

  return undefined;
}

/**
 * A route from where an angler is standing to their spot on the wharf, as
 * container positions to walk through.
 *
 * Love Island has no NavMesh layer, so this walks the island's own walkable
 * tile bitmap instead - the same one Lover's Push rolls its rocks over, which
 * is ground and paths minus the map's collision. A breadth-first search over
 * it is the shortest route in tiles, and every tile on it is somewhere a
 * Bumpkin can legitimately stand, so nobody is ever dragged through a railing
 * or across the water.
 *
 * Returns `undefined` when there is no route, or none inside `maxTiles` -
 * the caller should tell the player to walk over themselves rather than
 * teleporting them across the island.
 */
export function getLoveKrakenWalkRoute({
  from,
  to,
  maxTiles = LOVE_KRAKEN_WALK_MAX_TILES,
}: {
  from: LoveKrakenSpot;
  to: LoveKrakenSpot;
  maxTiles?: number;
}): LoveKrakenSpot[] | undefined {
  const goal = toLoveKrakenTile(to);
  if (!isLoveIslandTileWalkable(goal)) return undefined;

  // The bitmap is ground and paths only, so a player standing on a
  // decorative tile is "unwalkable" where they stand. Start from the nearest
  // tile that is, rather than refusing to walk them at all.
  const start = nearestWalkableTile(toLoveKrakenTile(from));
  if (!start) return undefined;

  // Already on the right tile - just step across to the spot
  if (start.x === goal.x && start.y === goal.y) return [to];

  const key = ({ x, y }: LovePushTile) => y * LOVE_ISLAND_MAP_WIDTH + x;
  const cameFrom = new Map<number, number>();
  const seen = new Set<number>([key(start)]);
  let frontier: LovePushTile[] = [start];
  let depth = 0;
  let found = false;

  while (frontier.length > 0 && depth < maxTiles && !found) {
    const next: LovePushTile[] = [];

    for (const tile of frontier) {
      for (const step of [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ]) {
        const to = { x: tile.x + step.x, y: tile.y + step.y };
        const id = key(to);

        if (seen.has(id)) continue;
        if (!isLoveIslandTileWalkable(to)) continue;

        seen.add(id);
        cameFrom.set(id, key(tile));

        if (to.x === goal.x && to.y === goal.y) {
          found = true;
          break;
        }

        next.push(to);
      }

      if (found) break;
    }

    frontier = next;
    depth += 1;
  }

  if (!found) return undefined;

  // Walk the trail back, then hand it over front to back
  const route: LoveKrakenSpot[] = [];
  let cursor: number | undefined = key(goal);

  while (cursor !== undefined && cursor !== key(start)) {
    route.unshift(
      fromLoveKrakenTile({
        x: cursor % LOVE_ISLAND_MAP_WIDTH,
        y: Math.floor(cursor / LOVE_ISLAND_MAP_WIDTH),
      }),
    );
    cursor = cameFrom.get(cursor);
  }

  // The last tile centre is not the spot itself - finish on it
  route[route.length - 1] = to;

  return route;
}

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
 * The tightest the zone can ever land ahead of the marker, as a share of a
 * sweep. It jumps at least a quarter turn, so a legitimate reel can never
 * come sooner than this.
 */
export const LOVE_KRAKEN_ZONE_MIN_JUMP_SHARE = 0.25;

/**
 * Fastest a reel can land, given the sweep.
 *
 * Set to the tightest gap the zone can legitimately leave, so it never
 * blocks an honest angler who got a short jump - and it is the room's whole
 * anti-spam story: a forged client that ignores the ring entirely is still
 * capped at two reels a sweep, against the one a sweep an honest angler
 * averages.
 */
export function getLoveKrakenReelCooldownMs(ringMs: number): number {
  return Math.round(ringMs * LOVE_KRAKEN_ZONE_MIN_JUMP_SHARE);
}

/**
 * Where this angler's catch zone sits, in degrees clockwise from the top.
 *
 * The zone starts at the top of the ring and jumps somewhere else on **every
 * pull of the rod, landed or missed**. Missing has to move it too, or the
 * whole game is beaten by holding the button down until the marker happens
 * to cross a zone that never moves.
 *
 * Each jump carries it **90 to 270 degrees from the last one** - never less
 * than a quarter turn, so it always visibly moves, and half a turn away on
 * average, which is what paces the game. A pull that misses therefore costs
 * an angler about as much time as one that lands, and scores nothing.
 */
export function getLoveKrakenZoneAngle({
  roundId,
  attempts,
}: {
  roundId: number;
  attempts: number;
}): number {
  const random = mulberry32(roundId * 7919 + 13);
  let angle = 0;

  for (let i = 0; i < Math.max(0, attempts); i++) {
    angle = (angle + 90 + random() * 180) % 360;
  }

  return angle;
}

/** Fold any angle back into 0..360. */
function normaliseAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * One angler's state in a round. The client keeps this for the local player;
 * the room needs none of it (see `getLoveKrakenReelCooldownMs`).
 */
export type LoveKrakenAngler = {
  /** Pulls of the rod that counted, landed or missed - the zone follows it. */
  attempts: number;
  /** Reels landed - the spin and the sweep follow this one. */
  reels: number;
  /** When the last reel landed, and where the marker was when it did. */
  legStartAt?: number;
  legStartAngle?: number;
};

export const LOVE_KRAKEN_FRESH_ANGLER: LoveKrakenAngler = {
  attempts: 0,
  reels: 0,
};

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
 * fixed, so the marker sweeps smoothly, and a leg begins at exactly the
 * angle the marker had reached - so the reversal and the wind-up a reel
 * brings never move it.
 *
 * (Reading the phase straight off the clock as `now % ringMs` looks
 * equivalent and is not: the moment `ringMs` changes, that phase lurches,
 * which is what made the marker snap back to the top mid-sweep.)
 *
 * A **miss leaves the marker alone** and only moves the zone, so the line
 * keeps sweeping evenly however wildly the angler is tapping.
 *
 * Before the first reel there is no leg to anchor to, so the sweep runs off
 * the epoch at the opening speed - continuous, and the same on every client.
 */
export function getLoveKrakenRing({
  roundId,
  angler,
  now = Date.now(),
}: {
  roundId: number;
  angler: LoveKrakenAngler;
  now?: number;
}): LoveKrakenRing {
  const reels = Math.max(0, angler.reels);
  const ringMs = getLoveKrakenRingMs(reels);
  const spin = getLoveKrakenSpin(reels);
  const zoneAngle = getLoveKrakenZoneAngle({
    roundId,
    attempts: angler.attempts,
  });

  if (angler.legStartAt === undefined || angler.legStartAngle === undefined) {
    return {
      angle: normaliseAngle(((now % ringMs) / ringMs) * 360),
      zoneAngle,
      ringMs,
      spin,
    };
  }

  const swept = ((now - angler.legStartAt) / ringMs) * 360;

  return {
    angle: normaliseAngle(angler.legStartAngle + spin * swept),
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

/** Was a pull of the rod on the beat? */
export function isLoveKrakenReelOnTarget({
  ring,
  toleranceDeg = LOVE_KRAKEN_ZONE_HALF_DEG,
}: {
  ring: LoveKrakenRing;
  toleranceDeg?: number;
}): boolean {
  return getLoveKrakenRingOffset(ring) <= toleranceDeg;
}

/**
 * The angler after a pull of the rod. The zone moves either way - that is
 * what stops the button being held down - but only a hit re-anchors the
 * marker's leg, so a miss never interrupts the sweep.
 */
export function pullLoveKrakenRod({
  angler,
  ring,
  landed,
  now = Date.now(),
}: {
  angler: LoveKrakenAngler;
  ring: LoveKrakenRing;
  landed: boolean;
  now?: number;
}): LoveKrakenAngler {
  return {
    attempts: angler.attempts + 1,
    reels: angler.reels + (landed ? 1 : 0),
    // Pick the new leg up exactly where the marker had got to
    legStartAt: landed ? now : angler.legStartAt,
    legStartAngle: landed ? ring.angle : angler.legStartAngle,
  };
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

/**
 * How much of the bar the kick from your last reel is still worth, as a
 * share of the whole bar.
 *
 * Pops to the full share the instant the reel lands and eases back to
 * nothing - `sqrt` so it holds near the top for the first stretch and then
 * settles, which is what makes it read as a lurch forward rather than a
 * flicker. A fresh reel restarts it, so a flurry keeps the bar sitting
 * forward instead of stacking ever higher.
 */
export function getLoveKrakenReelKick({
  landedAt,
  now = Date.now(),
}: {
  landedAt?: number;
  now?: number;
}): number {
  if (landedAt === undefined) return 0;

  const elapsed = now - landedAt;
  if (elapsed < 0 || elapsed >= LOVE_KRAKEN_REEL_KICK_MS) return 0;

  const remaining = 1 - elapsed / LOVE_KRAKEN_REEL_KICK_MS;

  return LOVE_KRAKEN_REEL_KICK_SHARE * Math.sqrt(remaining);
}

/**
 * What the bar should draw: where the island really is, plus whatever the
 * angler's own last reel is still worth, clamped to the ends.
 */
export function getLoveKrakenBarShare({
  progress,
  health,
  landedAt,
  now = Date.now(),
}: {
  progress: number;
  health: number;
  landedAt?: number;
  now?: number;
}): number {
  if (health <= 0) return 0;

  const real = Math.min(1, Math.max(0, progress / health));

  return Math.min(1, real + getLoveKrakenReelKick({ landedAt, now }));
}

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
