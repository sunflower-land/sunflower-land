import {
  getFloatingIslandGameClaimsToday,
  getFloatingIslandLoveCharmsRemainingToday,
} from "features/game/events/landExpansion/claimFloatingIslandPrize";
import { hasVipAccess } from "features/game/lib/vipAccess";
import type { GameState } from "features/game/types/game";

/**
 * Client-side rules for the Love Island games (Love Dilemma, Love Boulder,
 * Lover's Push).
 *
 * The games pay out through the generic `floatingIslandPrize.claimed` event.
 * The rules below (prize sizes, attempts) are deliberately enforced on the
 * client and mirrored by the MMO room - the game event only guards the daily
 * Love Charm caps.
 */

// ---------------------------------------------------------------------------
// Love Dilemma
// ---------------------------------------------------------------------------

export const LOVE_DILEMMA_PLATFORMS = 3;
export const LOVE_DILEMMA_CHOOSE_MS = 30 * 1000;
export const LOVE_DILEMMA_REVEAL_MS = 10 * 1000;
export const LOVE_DILEMMA_ROUND_MS =
  LOVE_DILEMMA_CHOOSE_MS + LOVE_DILEMMA_REVEAL_MS;
export const LOVE_DILEMMA_MIN_PLAYERS = 5;
/**
 * The room publishes `choices` about 1s after `chooseEndsAt`. A client that
 * resolves before they land would score an empty map as a void round, so
 * wait for them - but no longer than this, or an empty round never resolves.
 */
export const LOVE_DILEMMA_CHOICES_GRACE_MS = 3 * 1000;
export const LOVE_DILEMMA_MAX_ATTEMPTS = 3;

/** Love Charms per tier (tier 0 is the best platform). */
export const LOVE_DILEMMA_TIER_PRIZES = {
  vip: [20, 10, 5],
  standard: [3, 2, 1],
} as const;

export type LoveDilemmaPhase = "choose" | "reveal";

export type LoveDilemmaRound = {
  roundId: number;
  phase: LoveDilemmaPhase;
  startAt: number;
  chooseEndsAt: number;
  revealEndsAt: number;
  /** Tier (0-2) shown on each platform this round, indexed by platform. */
  tiers: number[];
};

/** Deterministic PRNG so every client (and the server) derives the same round. */
function mulberry32(seed: number) {
  let a = seed >>> 0;

  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Which tier each platform shows for a round - a seeded shuffle of 0..2. */
export function getLoveDilemmaTiers(roundId: number): number[] {
  const random = mulberry32(roundId);
  const tiers = Array.from({ length: LOVE_DILEMMA_PLATFORMS }, (_, i) => i);

  for (let i = tiers.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [tiers[i], tiers[j]] = [tiers[j], tiers[i]];
  }

  return tiers;
}

/**
 * Rounds run on a fixed clock anchored to the epoch so no coordination is
 * needed to agree on the current round: 30s to choose, then 10s of reveal.
 */
export function getLoveDilemmaRound(now = Date.now()): LoveDilemmaRound {
  const roundId = Math.floor(now / LOVE_DILEMMA_ROUND_MS);
  const startAt = roundId * LOVE_DILEMMA_ROUND_MS;
  const chooseEndsAt = startAt + LOVE_DILEMMA_CHOOSE_MS;
  const revealEndsAt = startAt + LOVE_DILEMMA_ROUND_MS;

  return {
    roundId,
    phase: now < chooseEndsAt ? "choose" : "reveal",
    startAt,
    chooseEndsAt,
    revealEndsAt,
    tiers: getLoveDilemmaTiers(roundId),
  };
}

export function getLoveDilemmaPrize({
  tier,
  isVip,
}: {
  tier: number;
  isVip: boolean;
}): number {
  const prizes = isVip
    ? LOVE_DILEMMA_TIER_PRIZES.vip
    : LOVE_DILEMMA_TIER_PRIZES.standard;

  return prizes[tier] ?? 0;
}

/** Prize shown on each platform for this player, indexed by platform. */
export function getLoveDilemmaPlatformPrizes({
  tiers,
  isVip,
}: {
  tiers: number[];
  isVip: boolean;
}): number[] {
  return tiers.map((tier) => getLoveDilemmaPrize({ tier, isVip }));
}

/**
 * What a platform actually pays this player right now: the prize, capped by
 * the Love Charms they can still earn today. A standard player on 3/day
 * who has already won 3 sees (and gets) 2 from a "3" platform.
 */
export function getLoveDilemmaPayout({
  state,
  prize,
  now = Date.now(),
}: {
  state: GameState;
  prize: number;
  now?: number;
}): number {
  return Math.min(
    prize,
    getFloatingIslandLoveCharmsRemainingToday({ state, createdAt: now }),
  );
}

/**
 * Can the reveal be scored yet? True once the published choices are
 * non-empty and have caught up with the number of players who locked in, or
 * once the grace period after `chooseEndsAt` has passed with whatever is
 * there (a genuinely empty round is void, and must still resolve).
 */
export function isLoveDilemmaRevealReady({
  now,
  chooseEndsAt,
  choicesCount,
  chosenCount,
}: {
  now: number;
  chooseEndsAt: number;
  choicesCount: number;
  chosenCount: number;
}): boolean {
  if (now < chooseEndsAt) return false;

  if (choicesCount > 0 && choicesCount >= chosenCount) return true;

  return now >= chooseEndsAt + LOVE_DILEMMA_CHOICES_GRACE_MS;
}

/** Player key (session id) -> platform index (0-2). */
export type LoveDilemmaChoices = Record<string, number>;

export type LoveDilemmaResult = {
  /** Players on each platform, indexed by platform. */
  counts: number[];
  total: number;
  /** Platforms with the most players - everyone on them gets nothing. */
  losingPlatforms: number[];
  /** Fewer than the minimum players chose - nobody wins or loses. */
  isVoid: boolean;
};

export function resolveLoveDilemma(
  choices: LoveDilemmaChoices,
): LoveDilemmaResult {
  const counts = Array.from({ length: LOVE_DILEMMA_PLATFORMS }, () => 0);

  Object.values(choices).forEach((platform) => {
    if (platform >= 0 && platform < LOVE_DILEMMA_PLATFORMS) {
      counts[platform] += 1;
    }
  });

  const total = counts.reduce((sum, count) => sum + count, 0);
  const max = Math.max(...counts);
  const losingPlatforms =
    total === 0
      ? []
      : counts
          .map((count, platform) => (count === max ? platform : -1))
          .filter((platform) => platform >= 0);

  return {
    counts,
    total,
    losingPlatforms,
    isVoid: total < LOVE_DILEMMA_MIN_PLAYERS,
  };
}

export function isLoveDilemmaWinner({
  platform,
  result,
}: {
  platform: number;
  result: LoveDilemmaResult;
}): boolean {
  return !result.isVoid && !result.losingPlatforms.includes(platform);
}

/**
 * Every resolved round records a claim (0 Love Charms on a loss), so the
 * number of claims today is the number of attempts used.
 */
export function getLoveDilemmaAttemptsToday({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): number {
  return getFloatingIslandGameClaimsToday({
    state,
    game: "love_dilemma",
    createdAt: now,
  }).length;
}

export function getLoveDilemmaAttemptsLeft({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): number {
  return Math.max(
    0,
    LOVE_DILEMMA_MAX_ATTEMPTS - getLoveDilemmaAttemptsToday({ state, now }),
  );
}

/**
 * Local stand-in for other players while the MMO room has no dilemma state.
 * Deterministic per round, and biased toward the juicier platforms the way
 * real players are.
 */
export function getLoveDilemmaBotChoices(
  roundId: number,
  count = 6,
): LoveDilemmaChoices {
  const random = mulberry32(roundId * 7919 + 1);
  const tiers = getLoveDilemmaTiers(roundId);
  const weights = tiers.map((tier) => [5, 3, 2][tier] ?? 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  const choices: LoveDilemmaChoices = {};

  for (let i = 0; i < count; i++) {
    let roll = random() * totalWeight;
    let platform = 0;

    while (platform < weights.length - 1 && roll >= weights[platform]) {
      roll -= weights[platform];
      platform += 1;
    }

    choices[`bot-${i}`] = platform;
  }

  return choices;
}

// ---------------------------------------------------------------------------
// Love Boulder
// ---------------------------------------------------------------------------

/** Taps it takes the whole island to crack one boulder. */
export const LOVE_BOULDER_HITS = 50_000;
/** Love Charms for everyone who landed a hit on the boulder that broke. */
export const LOVE_BOULDER_PRIZE = 5;
/** The prize can be claimed this many times per UTC day. */
export const LOVE_BOULDER_MAX_CLAIMS = 1;
/** Fastest a single player may tap - the room drops anything quicker. */
export const LOVE_BOULDER_HIT_COOLDOWN_MS = 200;
/**
 * How long the prize sits on the rubble to be claimed. When it runs out a
 * fresh boulder appears and anyone who didn't click misses out.
 */
export const LOVE_BOULDER_RESPAWN_MS = 5 * 1000;

export type LoveBoulderRound = {
  /** Increments every time a fresh boulder appears. */
  roundId: number;
  /** Hits still needed to break it (0 once broken). */
  hitsRemaining: number;
  /**
   * True only once the boulder is authoritatively broken. Kept separate from
   * `hitsRemaining` so an optimistic local count can't break it early.
   */
  broken: boolean;
  /** Epoch ms the boulder broke - only set once broken. */
  brokenAt?: number;
  /** Epoch ms a fresh boulder appears - only set once broken. */
  respawnAt?: number;
};

/** Is the prize sitting on the rubble right now, waiting to be clicked? */
export function isLoveBoulderRewardOpen({
  round,
  now = Date.now(),
}: {
  round: LoveBoulderRound;
  now?: number;
}): boolean {
  return round.broken && now < (round.respawnAt ?? 0);
}

/** Today's Love Boulder claims (at most one, but the event keeps a list). */
export function getLoveBoulderClaimsToday({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}) {
  return getFloatingIslandGameClaimsToday({
    state,
    game: "love_boulder",
    createdAt: now,
  });
}

export function hasClaimedLoveBoulderToday({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): boolean {
  return (
    getLoveBoulderClaimsToday({ state, now }).length >= LOVE_BOULDER_MAX_CLAIMS
  );
}

/** Has this exact boulder already been claimed (e.g. a reload mid-window)? */
export function hasClaimedLoveBoulderRound({
  state,
  roundId,
  now = Date.now(),
}: {
  state: GameState;
  roundId: number;
  now?: number;
}): boolean {
  return getLoveBoulderClaimsToday({ state, now }).some(
    (claim) => claim.roundId === roundId,
  );
}

/**
 * Whether the prize pays this player: they must have landed at least one hit
 * on the boulder that broke, and not have claimed a boulder prize yet today.
 */
export function canClaimLoveBoulder({
  state,
  myHits,
  roundId,
  now = Date.now(),
}: {
  state: GameState;
  myHits: number;
  roundId: number;
  now?: number;
}): boolean {
  if (myHits <= 0) return false;
  if (hasClaimedLoveBoulderRound({ state, roundId, now })) return false;

  return !hasClaimedLoveBoulderToday({ state, now });
}

/**
 * What the boulder actually pays this player right now: the prize, capped
 * by the Love Charms they can still earn today (the event rejects more).
 */
export function getLoveBoulderPayout({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): number {
  return Math.min(
    LOVE_BOULDER_PRIZE,
    getFloatingIslandLoveCharmsRemainingToday({ state, createdAt: now }),
  );
}

/** Local mode: the simulated crowd's combined tapping speed. */
export const LOVE_BOULDER_LOCAL_BOT_HITS_PER_SEC = 40;

export type LoveBoulderLocalRound = LoveBoulderRound & {
  /** Fractional crowd hits carried between ticks. */
  crowdProgress: number;
  lastTickAt: number;
};

export function createLoveBoulderLocalRound(
  now = Date.now(),
  roundId = 1,
): LoveBoulderLocalRound {
  return {
    roundId,
    hitsRemaining: LOVE_BOULDER_HITS,
    broken: false,
    crowdProgress: 0,
    lastTickAt: now,
  };
}

/**
 * Local stand-in while the MMO room has no boulder state: a simulated crowd
 * chips away at a steady rate, the local player's own hits come straight off
 * `hitsRemaining`, and once it breaks the prize window runs before a fresh
 * boulder appears - the same shape the room publishes.
 */
export function tickLoveBoulderLocalRound({
  round,
  now = Date.now(),
}: {
  round: LoveBoulderLocalRound;
  now?: number;
}): LoveBoulderLocalRound {
  if (round.broken) {
    return now >= (round.respawnAt ?? 0)
      ? createLoveBoulderLocalRound(now, round.roundId + 1)
      : round;
  }

  const elapsed = Math.max(0, now - round.lastTickAt);
  const progress =
    round.crowdProgress +
    (elapsed / 1000) * LOVE_BOULDER_LOCAL_BOT_HITS_PER_SEC;
  const crowdHits = Math.floor(progress);
  const hitsRemaining = Math.max(0, round.hitsRemaining - crowdHits);

  if (hitsRemaining > 0) {
    return {
      ...round,
      hitsRemaining,
      crowdProgress: progress - crowdHits,
      lastTickAt: now,
    };
  }

  return {
    roundId: round.roundId,
    hitsRemaining: 0,
    broken: true,
    brokenAt: now,
    respawnAt: now + LOVE_BOULDER_RESPAWN_MS,
    crowdProgress: 0,
    lastTickAt: now,
  };
}

// ---------------------------------------------------------------------------
// Which puzzle runs in the centre of the island
// ---------------------------------------------------------------------------

export type LoveIslandCentrePuzzle = "dilemma" | "push";

/**
 * The centre of the island hosts one puzzle at a time: the Love Dilemma
 * (platforms) or Lover's Push (boulders). Flip this by hand to switch.
 */
export const LOVE_ISLAND_CENTRE_PUZZLE: LoveIslandCentrePuzzle = "push";

// ---------------------------------------------------------------------------
// Lover's Push
// ---------------------------------------------------------------------------

/** The grid is square, this many tiles a side. */
export const LOVE_PUSH_GRID_SIZE = 6;
export const LOVE_PUSH_BOULDERS = 4;
/**
 * How long a boulder takes to slide one tile - and the soonest the same
 * boulder can be pushed again. Anyone can push at any time; the first
 * shove after the cooldown is the one that counts.
 */
export const LOVE_PUSH_MOVE_MS = 300;
/** Love Charms for everyone who moved a boulder in the solved round. */
export const LOVE_PUSH_PRIZES = { vip: 20, standard: 3 } as const;
/** The prize can be claimed this many times per UTC day. */
export const LOVE_PUSH_MAX_CLAIMS = 1;
/** How long the solved layout is celebrated before a fresh one appears. */
export const LOVE_PUSH_SOLVED_MS = 10 * 1000;
/**
 * A layout must take at least this many pushes so it can't be solved by
 * accident, and no boulder starts on a target.
 */
export const LOVE_PUSH_MIN_SOLUTION_PUSHES = 6;
/** Layouts tried per round before falling back to the last solvable one. */
const LOVE_PUSH_LAYOUT_ATTEMPTS = 40;

export type LovePushDirection = "north" | "east" | "south" | "west";

export const LOVE_PUSH_DIRECTIONS: LovePushDirection[] = [
  "north",
  "east",
  "south",
  "west",
];

export function isLovePushDirection(
  value: unknown,
): value is LovePushDirection {
  return LOVE_PUSH_DIRECTIONS.includes(value as LovePushDirection);
}

/** Where a boulder goes when pushed in a direction (grid tiles). */
export const LOVE_PUSH_DELTAS: Record<LovePushDirection, LovePushTile> = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

/** A grid tile, 0..5 on each axis, (0, 0) top-left. */
export type LovePushTile = { x: number; y: number };

/** Tiles are published as a single index, row-major. */
export function toLovePushTileIndex({ x, y }: LovePushTile): number {
  return y * LOVE_PUSH_GRID_SIZE + x;
}

export function fromLovePushTileIndex(index: number): LovePushTile {
  return {
    x: index % LOVE_PUSH_GRID_SIZE,
    y: Math.floor(index / LOVE_PUSH_GRID_SIZE),
  };
}

function isInsideLovePushGrid({ x, y }: LovePushTile): boolean {
  return x >= 0 && y >= 0 && x < LOVE_PUSH_GRID_SIZE && y < LOVE_PUSH_GRID_SIZE;
}

function isSameTile(a: LovePushTile, b: LovePushTile): boolean {
  return a.x === b.x && a.y === b.y;
}

function hasBoulderAt(boulders: LovePushTile[], tile: LovePushTile): boolean {
  return boulders.some((boulder) => isSameTile(boulder, tile));
}

/**
 * The tile a pusher walks in from to push a boulder in a direction. It may
 * be outside the grid - the border is walkable, so a boulder against a wall
 * can always be pushed back in.
 */
export function getLovePushPusherTile({
  boulder,
  direction,
}: {
  boulder: LovePushTile;
  direction: LovePushDirection;
}): LovePushTile {
  const delta = LOVE_PUSH_DELTAS[direction];

  return { x: boulder.x - delta.x, y: boulder.y - delta.y };
}

/**
 * Can this boulder be pushed this way? The tile it moves onto must be
 * inside the grid and free, and the tile behind it (where the pusher walks
 * in from) can't hold another boulder. Pushers may stand outside the grid,
 * so nothing is ever stuck against a wall or in a corner.
 */
export function canLovePush({
  boulders,
  boulder,
  direction,
}: {
  boulders: LovePushTile[];
  boulder: number;
  direction: LovePushDirection;
}): boolean {
  const from = boulders[boulder];
  if (!from) return false;

  const delta = LOVE_PUSH_DELTAS[direction];
  const to = { x: from.x + delta.x, y: from.y + delta.y };
  const pusher = getLovePushPusherTile({ boulder: from, direction });

  return (
    isInsideLovePushGrid(to) &&
    !hasBoulderAt(boulders, to) &&
    !hasBoulderAt(boulders, pusher)
  );
}

/** The boulders after one push (unchanged if the push isn't possible). */
export function applyLovePush({
  boulders,
  boulder,
  direction,
}: {
  boulders: LovePushTile[];
  boulder: number;
  direction: LovePushDirection;
}): LovePushTile[] {
  if (!canLovePush({ boulders, boulder, direction })) return boulders;

  const delta = LOVE_PUSH_DELTAS[direction];

  return boulders.map((tile, index) =>
    index === boulder ? { x: tile.x + delta.x, y: tile.y + delta.y } : tile,
  );
}

/** How many boulders sit on a target - the number of green lights. */
export function getLovePushLitCount({
  boulders,
  targets,
}: {
  boulders: LovePushTile[];
  targets: LovePushTile[];
}): number {
  return boulders.filter((boulder) => hasBoulderAt(targets, boulder)).length;
}

export function isLovePushSolved({
  boulders,
  targets,
}: {
  boulders: LovePushTile[];
  targets: LovePushTile[];
}): boolean {
  return (
    getLovePushLitCount({ boulders, targets }) === LOVE_PUSH_BOULDERS &&
    boulders.length === LOVE_PUSH_BOULDERS
  );
}

/** 2^index per tile - a set of tiles is the sum (36 bits fit a double exactly). */
const LOVE_PUSH_TILE_BITS = Array.from(
  { length: LOVE_PUSH_GRID_SIZE * LOVE_PUSH_GRID_SIZE },
  (_, index) => 2 ** index,
);

/** The push deltas as tile-index offsets, in `LOVE_PUSH_DIRECTIONS` order. */
const LOVE_PUSH_INDEX_DELTAS = LOVE_PUSH_DIRECTIONS.map(
  (direction) =>
    LOVE_PUSH_DELTAS[direction].y * LOVE_PUSH_GRID_SIZE +
    LOVE_PUSH_DELTAS[direction].x,
);

/**
 * Fewest pushes to get every boulder onto a target, or `undefined` if the
 * layout can't be solved. Breadth-first over the ~59k possible boulder
 * sets. Runs on tile indices rather than tiles to keep it quick - it's the
 * same push rule as `canLovePush`, and the tests hold the two to each other.
 */
export function getLovePushSolutionLength({
  boulders,
  targets,
}: {
  boulders: LovePushTile[];
  targets: LovePushTile[];
}): number | undefined {
  if (isLovePushSolved({ boulders, targets })) return 0;

  const size = LOVE_PUSH_GRID_SIZE;
  const targetKey = targets.reduce(
    (sum, tile) => sum + LOVE_PUSH_TILE_BITS[toLovePushTileIndex(tile)],
    0,
  );
  const stateKey = (state: number[]) =>
    state.reduce((sum, index) => sum + LOVE_PUSH_TILE_BITS[index], 0);

  const start = boulders.map(toLovePushTileIndex);
  const seen = new Set<number>([stateKey(start)]);
  let frontier: number[][] = [start];
  let pushes = 0;

  while (frontier.length > 0) {
    pushes += 1;
    const next: number[][] = [];

    for (const state of frontier) {
      for (let boulder = 0; boulder < state.length; boulder++) {
        const from = state[boulder];
        const x = from % size;
        const y = (from - x) / size;

        for (let d = 0; d < LOVE_PUSH_DIRECTIONS.length; d++) {
          const { x: dx, y: dy } = LOVE_PUSH_DELTAS[LOVE_PUSH_DIRECTIONS[d]];
          // Room to move into
          if (x + dx < 0 || x + dx >= size || y + dy < 0 || y + dy >= size) {
            continue;
          }

          const to = from + LOVE_PUSH_INDEX_DELTAS[d];
          if (state.includes(to)) continue;

          // The pusher's tile may be off the grid (fine) but not a boulder
          const pusherInGrid =
            x - dx >= 0 && x - dx < size && y - dy >= 0 && y - dy < size;
          if (
            pusherInGrid &&
            state.includes(from - LOVE_PUSH_INDEX_DELTAS[d])
          ) {
            continue;
          }

          const moved = state.slice();
          moved[boulder] = to;

          const key = stateKey(moved);
          if (seen.has(key)) continue;

          // Solved when every boulder's bit is inside the targets' bits
          if (isSubset(key, targetKey)) return pushes;

          seen.add(key);
          next.push(moved);
        }
      }
    }

    frontier = next;
  }

  return undefined;
}

/** Is every bit of `key` set in `superset`? Both may exceed 32 bits. */
function isSubset(key: number, superset: number): boolean {
  const low = 2 ** 32;
  const keyHigh = Math.floor(key / low);
  const keyLow = key % low;
  const superHigh = Math.floor(superset / low);
  const superLow = superset % low;

  return (
    (keyLow & superLow) >>> 0 === keyLow &&
    (keyHigh & superHigh) >>> 0 === keyHigh
  );
}

export type LovePushLayout = {
  /** Where the boulders start, indexed by boulder. */
  boulders: LovePushTile[];
  /** The hidden tiles the boulders have to end up on (any boulder, any target). */
  targets: LovePushTile[];
};

/** `count` distinct random tiles, avoiding `taken`. */
function pickLovePushTiles(
  random: () => number,
  count: number,
  taken: LovePushTile[] = [],
): LovePushTile[] {
  const free = Array.from(
    { length: LOVE_PUSH_GRID_SIZE * LOVE_PUSH_GRID_SIZE },
    (_, index) => fromLovePushTileIndex(index),
  ).filter((tile) => !hasBoulderAt(taken, tile));

  const picked: LovePushTile[] = [];

  for (let i = 0; i < count && free.length > 0; i++) {
    const [tile] = free.splice(Math.floor(random() * free.length), 1);
    picked.push(tile);
  }

  return picked;
}

/**
 * The layout for a round - a seeded roll (mulberry32(roundId), the same PRNG
 * as the Dilemma tiers) so the server and every client agree without
 * publishing the targets. Only solvable layouts that need a few pushes are
 * accepted; the roll keeps going until one turns up.
 */
export function getLovePushLayout(roundId: number): LovePushLayout {
  const random = mulberry32(roundId * 104729 + 7);
  let fallback: LovePushLayout | undefined;

  for (let attempt = 0; attempt < LOVE_PUSH_LAYOUT_ATTEMPTS; attempt++) {
    const targets = pickLovePushTiles(random, LOVE_PUSH_BOULDERS);
    const boulders = pickLovePushTiles(random, LOVE_PUSH_BOULDERS, targets);
    const layout = { boulders, targets };

    const pushes = getLovePushSolutionLength(layout);
    if (pushes === undefined) continue;

    if (pushes >= LOVE_PUSH_MIN_SOLUTION_PUSHES) return layout;

    fallback = fallback ?? layout;
  }

  // Every roll was too easy (never happens in practice) - the easiest
  // solvable one is still a valid puzzle
  if (fallback) return fallback;

  // Or none were solvable at all - a hand-checked layout, 8 pushes
  return {
    boulders: [
      { x: 1, y: 1 },
      { x: 4, y: 1 },
      { x: 1, y: 4 },
      { x: 4, y: 4 },
    ],
    targets: [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
  };
}

export type LovePushRound = {
  /** Increments every time a fresh layout appears. */
  roundId: number;
  /** Where each boulder is now, indexed by boulder. */
  boulders: LovePushTile[];
  /** Boulders on a target right now - the green lights. */
  lit: number;
  /** farmId -> boulders this player has moved this round. Proof of who helped. */
  pushers: Record<string, number>;
  solved: boolean;
  /** Epoch ms the last light came on - only set once solved. */
  solvedAt?: number;
  /** Epoch ms a fresh layout appears - only set once solved. */
  nextRoundAt?: number;
};

/**
 * A player shoves a boulder one tile and is credited with the move.
 * Nothing changes on an impossible push or once the round is solved.
 */
export function pushLoveBoulder({
  round,
  boulder,
  direction,
  farmId,
  targets,
  now = Date.now(),
}: {
  round: LovePushRound;
  boulder: number;
  direction: LovePushDirection;
  farmId: string;
  targets: LovePushTile[];
  now?: number;
}): LovePushRound {
  if (round.solved) return round;

  if (!canLovePush({ boulders: round.boulders, boulder, direction })) {
    return round;
  }

  const boulders = applyLovePush({
    boulders: round.boulders,
    boulder,
    direction,
  });
  const lit = getLovePushLitCount({ boulders, targets });
  const solved = lit === LOVE_PUSH_BOULDERS;

  return {
    ...round,
    boulders,
    lit,
    pushers: { ...round.pushers, [farmId]: (round.pushers[farmId] ?? 0) + 1 },
    solved,
    ...(solved
      ? { solvedAt: now, nextRoundAt: now + LOVE_PUSH_SOLVED_MS }
      : {}),
  };
}

export function getLovePushPrize({ isVip }: { isVip: boolean }): number {
  return isVip ? LOVE_PUSH_PRIZES.vip : LOVE_PUSH_PRIZES.standard;
}

/**
 * What a solved puzzle actually pays this player right now: the prize,
 * capped by the Love Charms they can still earn today (the event rejects
 * more).
 */
export function getLovePushPayout({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): number {
  return Math.min(
    getLovePushPrize({ isVip: hasVipAccess({ game: state, now }) }),
    getFloatingIslandLoveCharmsRemainingToday({ state, createdAt: now }),
  );
}

/** Today's Lover's Push claims (at most one, but the event keeps a list). */
export function getLovePushClaimsToday({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}) {
  return getFloatingIslandGameClaimsToday({
    state,
    game: "love_push",
    createdAt: now,
  });
}

export function hasClaimedLovePushToday({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): boolean {
  return getLovePushClaimsToday({ state, now }).length >= LOVE_PUSH_MAX_CLAIMS;
}

/** Has this exact round already been claimed (e.g. a reload mid-celebration)? */
export function hasClaimedLovePushRound({
  state,
  roundId,
  now = Date.now(),
}: {
  state: GameState;
  roundId: number;
  now?: number;
}): boolean {
  return getLovePushClaimsToday({ state, now }).some(
    (claim) => claim.roundId === roundId,
  );
}

/**
 * Whether the solved puzzle pays this player: they must have moved a
 * boulder this round, and not have claimed a Lover's Push prize yet today.
 */
export function canClaimLovePush({
  state,
  myMoves,
  roundId,
  now = Date.now(),
}: {
  state: GameState;
  myMoves: number;
  roundId: number;
  now?: number;
}): boolean {
  if (myMoves <= 0) return false;
  if (hasClaimedLovePushRound({ state, roundId, now })) return false;

  return !hasClaimedLovePushToday({ state, now });
}

/** Local mode: how often the simulated crowd shoves a boulder. */
export const LOVE_PUSH_LOCAL_BOT_MOVE_MS = 8000;
/** Local mode: the simulated crowd's farm id in `pushers`. */
const LOVE_PUSH_LOCAL_BOT = "bot";

export type LovePushLocalRound = LovePushRound & {
  targets: LovePushTile[];
  /** Boulder moves so far - seeds the crowd's next move. */
  moves: number;
  lastBotMoveAt: number;
};

export function createLovePushLocalRound(
  now = Date.now(),
  roundId = 1,
): LovePushLocalRound {
  const { boulders, targets } = getLovePushLayout(roundId);

  return {
    roundId,
    boulders,
    targets,
    lit: getLovePushLitCount({ boulders, targets }),
    pushers: {},
    solved: false,
    moves: 0,
    lastBotMoveAt: now,
  };
}

/** Every push that could be made right now. */
function getLovePushOptions(
  boulders: LovePushTile[],
): { boulder: number; direction: LovePushDirection }[] {
  const options: { boulder: number; direction: LovePushDirection }[] = [];

  boulders.forEach((_, boulder) => {
    LOVE_PUSH_DIRECTIONS.forEach((direction) => {
      if (canLovePush({ boulders, boulder, direction })) {
        options.push({ boulder, direction });
      }
    });
  });

  return options;
}

/**
 * The local player shoved a boulder while the room has no push state.
 */
export function pushLovePushLocalRound({
  round,
  boulder,
  direction,
  farmId,
  now = Date.now(),
}: {
  round: LovePushLocalRound;
  boulder: number;
  direction: LovePushDirection;
  farmId: string;
  now?: number;
}): LovePushLocalRound {
  const next = pushLoveBoulder({
    round,
    boulder,
    direction,
    farmId,
    targets: round.targets,
    now,
  });

  return next === round ? round : { ...round, ...next, moves: round.moves + 1 };
}

/**
 * Local stand-in while the MMO room has no push state: a simulated crowd
 * shoves a random boulder now and then (never one that's already on a
 * target), so the local player sees boulders move that they didn't push.
 * Once solved the celebration runs before a fresh layout appears - the same
 * shape the room publishes.
 */
export function tickLovePushLocalRound({
  round,
  now = Date.now(),
}: {
  round: LovePushLocalRound;
  now?: number;
}): LovePushLocalRound {
  if (round.solved) {
    return now >= (round.nextRoundAt ?? 0)
      ? createLovePushLocalRound(now, round.roundId + 1)
      : round;
  }

  if (now - round.lastBotMoveAt < LOVE_PUSH_LOCAL_BOT_MOVE_MS) return round;

  const random = mulberry32(round.roundId * 7919 + round.moves + 1);
  const options = getLovePushOptions(round.boulders).filter(
    (option) => !hasBoulderAt(round.targets, round.boulders[option.boulder]),
  );

  if (options.length === 0) return { ...round, lastBotMoveAt: now };

  const choice = options[Math.floor(random() * options.length)];

  return {
    ...pushLovePushLocalRound({
      round,
      ...choice,
      farmId: LOVE_PUSH_LOCAL_BOT,
      now,
    }),
    lastBotMoveAt: now,
  };
}
