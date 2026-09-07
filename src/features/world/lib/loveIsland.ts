import {
  FLOATING_ISLAND_GAME_ITEM_PRIZE,
  getFloatingIslandGameClaimsToday,
  getFloatingIslandLoveCharmsRemainingToday,
} from "features/game/events/landExpansion/claimFloatingIslandPrize";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  LOVE_ISLAND_MAP_HEIGHT,
  LOVE_ISLAND_MAP_WIDTH,
  LOVE_ISLAND_TILE_PX,
  LOVE_ISLAND_WALKABLE,
} from "./loveIslandTiles";

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

/**
 * Taps it takes the whole island to crack one boulder. Only used by the local
 * stand-in - once the room is running, the client shows the `hits` it
 * publishes, so the room's number is the one that counts.
 */
export const LOVE_BOULDER_HITS = 10_000;
/**
 * What the boulder pays everyone who landed a hit on it: a box into the
 * inventory, or coins straight to the balance. Rolled per UTC day by the
 * server - a Bronze Love Box, a Bronze Food Box, 250 coins or 500 coins - and
 * published with the boulder as `prize` / `prizeAmount`. The claim event pays
 * the server's roll whatever the client sends, so the client only shows it.
 */
export type LoveBoulderPrize =
  | { type: "item"; item: InventoryItemName; amount: number }
  | { type: "coins"; amount: number };

/** The boxes the roll can land on - their images are preloaded for the label. */
export const LOVE_BOULDER_PRIZE_ITEMS: InventoryItemName[] = [
  "Bronze Love Box",
  "Bronze Food Box",
];

/**
 * Shown by the local stand-in, and by a room that predates the roll (it
 * publishes an empty `prize`). Never what is actually paid.
 */
export const LOVE_BOULDER_PRIZE: LoveBoulderPrize = {
  type: "item",
  item: "Bronze Love Box",
  amount: 1,
};

/** The room publishes coins under this name rather than an item's. */
export const LOVE_BOULDER_COINS_PRIZE = "Coins";

/** The room's flattened `prize` / `prizeAmount` pair back into a prize. */
export function fromLoveBoulderRoomPrize({
  prize,
  amount,
}: {
  prize?: string;
  amount?: number;
}): LoveBoulderPrize {
  if (!prize || !amount) return LOVE_BOULDER_PRIZE;

  if (prize === LOVE_BOULDER_COINS_PRIZE) return { type: "coins", amount };

  return { type: "item", item: prize as InventoryItemName, amount };
}

/** A stable key for a prize, so the label is only rebuilt when it changes. */
export function getLoveBoulderPrizeKey(prize: LoveBoulderPrize): string {
  return prize.type === "coins"
    ? `coins:${prize.amount}`
    : `${prize.item}:${prize.amount}`;
}
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
  /** Hits a fresh boulder starts with - the health bar's full width. */
  hits: number;
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
  /** What this boulder pays - the day's roll from the room. */
  prize: LoveBoulderPrize;
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
    hits: LOVE_BOULDER_HITS,
    hitsRemaining: LOVE_BOULDER_HITS,
    broken: false,
    prize: LOVE_BOULDER_PRIZE,
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
    hits: round.hits,
    hitsRemaining: 0,
    broken: true,
    brokenAt: now,
    respawnAt: now + LOVE_BOULDER_RESPAWN_MS,
    prize: round.prize,
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

export const LOVE_PUSH_BOULDERS = 4;
/**
 * Players it takes to move a boulder on mainnet. One person can't budge it:
 * each push is a vote for a direction, the arrows on the boulder show how
 * the crowd is split, and once this many are pushing the same way it rolls
 * a tile. The island has to agree.
 */
export const LOVE_PUSH_MAINNET_PUSHERS_NEEDED = 5;
/** Off mainnet a pair is enough, so testers can move a boulder. */
export const LOVE_PUSH_TESTNET_PUSHERS_NEEDED = 2;

export function getLovePushPushersNeeded(network: string): number {
  return network === "mainnet"
    ? LOVE_PUSH_MAINNET_PUSHERS_NEEDED
    : LOVE_PUSH_TESTNET_PUSHERS_NEEDED;
}

/** Players it takes to move a boulder here - must match the room's. */
export const LOVE_PUSH_PUSHERS_NEEDED = getLovePushPushersNeeded(
  CONFIG.NETWORK,
);
/**
 * How long a boulder takes to roll one tile - and the soonest the same
 * boulder can be moved again.
 */
export const LOVE_PUSH_MOVE_MS = 300;
/**
 * What everyone who helped roll a boulder in the solved round gets. The
 * clearing used to hold the petal puzzle, so Lover's Push pays what that
 * paid - one Bronze Love Box - and islanders keep the reward they always
 * had. Unlike the other island puzzles this is an item, not Love Charms, so
 * it is not touched by the daily Love Charm cap.
 * `FLOATING_ISLAND_GAME_ITEM_PRIZE` is what actually pays it out; this is
 * the same prize, for the UI to show.
 */
export const LOVE_PUSH_PRIZE = FLOATING_ISLAND_GAME_ITEM_PRIZE.love_push as {
  item: InventoryItemName;
  amount: number;
};
/** The prize can be claimed this many times per UTC day. */
export const LOVE_PUSH_MAX_CLAIMS = 1;
/** How long the solved round is celebrated before fresh boulders appear. */
export const LOVE_PUSH_SOLVED_MS = 10 * 1000;
/**
 * The middle of the clearing - what "the centre" means for sides and start
 * distances. Tile (38, 35), world (616, 568).
 */
export const LOVE_PUSH_CENTRE: LovePushTile = { x: 38, y: 35 };
/**
 * The four squares in the centre of the island the boulders have to be
 * rolled into - a 2x2 block around the centre. Any boulder can take any
 * free square; a boulder rolled onto a free one parks there for the round,
 * and from then on it's something the others can crash into.
 */
export const LOVE_PUSH_TARGETS: LovePushTile[] = [
  { x: 37, y: 34 },
  { x: 38, y: 34 },
  { x: 37, y: 35 },
  { x: 38, y: 35 },
];
/**
 * Boulders start at least this many tiles (Manhattan) from the centre - out
 * toward the edges of the island, so each takes a crowd to bring home.
 */
export const LOVE_PUSH_MIN_START_DISTANCE = 10;

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

/** A tile of the island map (16px), (0, 0) top-left. */
export type LovePushTile = { x: number; y: number };

/** Where a boulder goes when pushed in a direction (tiles). */
export const LOVE_PUSH_DELTAS: Record<LovePushDirection, LovePushTile> = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

/** Tiles are published as a single index, row-major across the map. */
export function toLovePushTileIndex({ x, y }: LovePushTile): number {
  return y * LOVE_ISLAND_MAP_WIDTH + x;
}

export function fromLovePushTileIndex(index: number): LovePushTile {
  return {
    x: index % LOVE_ISLAND_MAP_WIDTH,
    y: Math.floor(index / LOVE_ISLAND_MAP_WIDTH),
  };
}

/** World px of a tile's centre. */
export function getLovePushTileCentre({ x, y }: LovePushTile): {
  x: number;
  y: number;
} {
  return {
    x: x * LOVE_ISLAND_TILE_PX + LOVE_ISLAND_TILE_PX / 2,
    y: y * LOVE_ISLAND_TILE_PX + LOVE_ISLAND_TILE_PX / 2,
  };
}

/** The tile a world position is on. */
export function getLovePushTileAt({
  x,
  y,
}: {
  x: number;
  y: number;
}): LovePushTile {
  return {
    x: Math.floor(x / LOVE_ISLAND_TILE_PX),
    y: Math.floor(y / LOVE_ISLAND_TILE_PX),
  };
}

function isSameTile(a: LovePushTile, b: LovePushTile): boolean {
  return a.x === b.x && a.y === b.y;
}

function isInsideLoveIsland({ x, y }: LovePushTile): boolean {
  return (
    x >= 0 && y >= 0 && x < LOVE_ISLAND_MAP_WIDTH && y < LOVE_ISLAND_MAP_HEIGHT
  );
}

/** The packed walkability bits, decoded once. */
let walkableBits: Uint8Array | undefined;

function getWalkableBits(): Uint8Array {
  if (!walkableBits) {
    const binary = atob(LOVE_ISLAND_WALKABLE);
    walkableBits = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      walkableBits[i] = binary.charCodeAt(i);
    }
  }

  return walkableBits;
}

/**
 * Can a boulder roll over this tile (and a player stand on it)? Island
 * ground clear of the map's collision objects; anything off the island, in
 * the water or against a rock, tree or building is not.
 */
export function isLoveIslandTileWalkable(tile: LovePushTile): boolean {
  if (!isInsideLoveIsland(tile)) return false;

  const index = toLovePushTileIndex(tile);

  return ((getWalkableBits()[index >> 3] >> (index & 7)) & 1) === 1;
}

/** Is this one of the four squares? */
export function isLovePushTarget(tile: LovePushTile): boolean {
  return LOVE_PUSH_TARGETS.some((target) => isSameTile(target, tile));
}

/**
 * The tile a pusher walks in from to push a boulder in a direction - the
 * one behind it.
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

export type LovePushStep = "move" | "sink" | "reset";

/**
 * What happens to a boulder rolled one tile in a direction: it rolls on
 * (`move`), lands on a free square and parks there (`sink`), or hits
 * something - the water or the edge of the island, a rock, a tree, a
 * building, or any other boulder, parked in a square or not - and crashes
 * (`reset`): it comes back at a fresh start.
 */
export function getLovePushStep({
  boulders,
  boulder,
  direction,
}: {
  boulders: LovePushTile[];
  boulder: number;
  direction: LovePushDirection;
}): { step: LovePushStep; to: LovePushTile } {
  const from = boulders[boulder];
  const delta = LOVE_PUSH_DELTAS[direction];
  const to = { x: from.x + delta.x, y: from.y + delta.y };

  const occupied = boulders.some(
    (tile, index) => index !== boulder && isSameTile(tile, to),
  );
  if (occupied) return { step: "reset", to };

  if (isLovePushTarget(to)) return { step: "sink", to };

  return { step: isLoveIslandTileWalkable(to) ? "move" : "reset", to };
}

/**
 * Tiles from which a lone boulder can be rolled into one of the squares,
 * with how many pushes it takes: a step from `t` in direction `d` needs
 * `t + d` walkable (or a square) and `t - d` walkable, where the pusher
 * stands. Ignores the other boulders. Computed once by walking back from
 * the squares.
 */
let distanceToSquare: Map<number, number> | undefined;

function getDistancesToSquare(): Map<number, number> {
  if (distanceToSquare) return distanceToSquare;

  const distances = new Map<number, number>(
    LOVE_PUSH_TARGETS.map((target) => [toLovePushTileIndex(target), 0]),
  );
  let frontier = [...LOVE_PUSH_TARGETS];

  while (frontier.length > 0) {
    const next: LovePushTile[] = [];

    frontier.forEach((tile) => {
      const distance = distances.get(toLovePushTileIndex(tile)) ?? 0;

      LOVE_PUSH_DIRECTIONS.forEach((direction) => {
        // A boulder on `from` pushed this way lands on `tile`
        const from = getLovePushPusherTile({ boulder: tile, direction });
        const pusher = getLovePushPusherTile({ boulder: from, direction });

        if (
          isLovePushTarget(from) ||
          !isLoveIslandTileWalkable(from) ||
          !isLoveIslandTileWalkable(pusher) ||
          distances.has(toLovePushTileIndex(from))
        ) {
          return;
        }

        distances.set(toLovePushTileIndex(from), distance + 1);
        next.push(from);
      });
    });

    frontier = next;
  }

  distanceToSquare = distances;

  return distances;
}

/** Fewest pushes to roll a lone boulder from here into a square, if it can be. */
export function getLovePushDistanceToSquare(
  tile: LovePushTile,
): number | undefined {
  return getDistancesToSquare().get(toLovePushTileIndex(tile));
}

/**
 * The first push of the shortest route that rolls a boulder into a free
 * square right now - around the other boulders (parked or not) and never
 * through a taken square - or `undefined` if there's no way at the moment.
 * A breadth-first walk from where it stands; the island is small enough
 * that this is cheap.
 */
export function getLovePushRouteStep({
  boulders,
  boulder,
}: {
  boulders: LovePushTile[];
  boulder: number;
}): LovePushDirection | undefined {
  const start = boulders[boulder];
  if (!start) return undefined;

  const others = boulders.filter((_, index) => index !== boulder);
  const occupied = (tile: LovePushTile) =>
    others.some((other) => isSameTile(other, tile));
  const clear = (tile: LovePushTile) =>
    isLoveIslandTileWalkable(tile) && !occupied(tile);

  // tile index -> the first push that leads there
  const firstStep = new Map<number, LovePushDirection>();
  const seen = new Set<number>([toLovePushTileIndex(start)]);
  let frontier: { tile: LovePushTile; first?: LovePushDirection }[] = [
    { tile: start },
  ];

  while (frontier.length > 0) {
    const next: typeof frontier = [];

    for (const { tile, first } of frontier) {
      for (const direction of LOVE_PUSH_DIRECTIONS) {
        const delta = LOVE_PUSH_DELTAS[direction];
        const to = { x: tile.x + delta.x, y: tile.y + delta.y };
        const pusher = getLovePushPusherTile({ boulder: tile, direction });
        const step = first ?? direction;

        if (!clear(pusher) || occupied(to)) continue;

        // A free square - home
        if (isLovePushTarget(to)) return step;

        if (!isLoveIslandTileWalkable(to)) continue;

        const index = toLovePushTileIndex(to);
        if (seen.has(index)) continue;

        seen.add(index);
        firstStep.set(index, step);
        next.push({ tile: to, first: step });
      }
    }

    frontier = next;
  }

  return undefined;
}

function manhattan(a: LovePushTile, b: LovePushTile): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Which side of the island a tile is on, relative to the centre - the way the
 * boulders are dealt out, hub and spoke: 0 top (north), 1 right (east),
 * 2 bottom (south), 3 left (west). Boulder `b` always starts on side `b`.
 */
export function getLovePushSide(tile: LovePushTile): number {
  const dx = tile.x - LOVE_PUSH_CENTRE.x;
  const dy = tile.y - LOVE_PUSH_CENTRE.y;

  if (Math.abs(dy) > Math.abs(dx)) return dy < 0 ? 0 : 2;

  return dx >= 0 ? 1 : 3;
}

/**
 * Every tile a boulder may start on: walkable, far enough from the centre,
 * and with a way to roll it into a square. Computed once, in tile order.
 */
let startCandidates: LovePushTile[] | undefined;

function getLovePushStartCandidates(): LovePushTile[] {
  if (startCandidates) return startCandidates;

  startCandidates = [...getDistancesToSquare().keys()]
    .map(fromLovePushTileIndex)
    .filter(
      (tile) =>
        manhattan(tile, LOVE_PUSH_CENTRE) >= LOVE_PUSH_MIN_START_DISTANCE,
    )
    .sort((a, b) => toLovePushTileIndex(a) - toLovePushTileIndex(b));

  return startCandidates;
}

/**
 * A random start for a boulder on its side of the island (any side with a
 * path, if its own has no room), avoiding `taken` tiles. `undefined` only
 * if there's nowhere at all.
 */
function pickLovePushStart({
  random,
  boulder,
  taken,
}: {
  random: () => number;
  boulder: number;
  taken: LovePushTile[];
}): LovePushTile | undefined {
  const candidates = getLovePushStartCandidates();
  const free = (pool: LovePushTile[]) =>
    pool.filter((tile) => !taken.some((t) => isSameTile(t, tile)));

  const side = free(
    candidates.filter((tile) => getLovePushSide(tile) === boulder),
  );
  const pool = side.length > 0 ? side : free(candidates);
  if (pool.length === 0) return undefined;

  return pool[Math.floor(random() * pool.length)];
}

/**
 * Where a boulder starts again after it has hit something - a fresh spot on
 * its side of the island, never the one it just left, clear of the other
 * boulders and their starts. Seeded by the round, the boulder and how many
 * times it has crashed, so the room and every client agree.
 */
export function getLovePushRestart({
  roundId,
  boulder,
  resets,
  boulders,
  starts,
}: {
  roundId: number;
  boulder: number;
  /** Crashes so far, this one included. */
  resets: number;
  boulders: LovePushTile[];
  starts: LovePushTile[];
}): LovePushTile {
  const random = mulberry32(
    roundId * 104729 + 7 + boulder * 7919 + resets * 31,
  );

  return (
    pickLovePushStart({
      random,
      boulder,
      taken: [...boulders, ...starts],
    }) ?? starts[boulder]
  );
}

export type LovePushLayout = {
  /** Where each boulder starts this round, indexed by boulder. */
  starts: LovePushTile[];
};

/**
 * Where the boulders start for a round - a seeded roll (mulberry32, the same
 * PRNG as the Dilemma tiers) so the room and every client agree. Hub and
 * spoke: one boulder at the top, one on the right, one at the bottom and
 * one on the left of the island (boulder `b` on side `b`), each far from the
 * centre and always with a path a crowd can roll it along into a square.
 */
export function getLovePushLayout(roundId: number): LovePushLayout {
  const random = mulberry32(roundId * 104729 + 7);
  const starts: LovePushTile[] = [];

  for (let boulder = 0; boulder < LOVE_PUSH_BOULDERS; boulder++) {
    const start = pickLovePushStart({ random, boulder, taken: starts });
    if (start) starts.push(start);
  }

  return { starts };
}

/** farmId -> the way each player is pushing one boulder right now. */
export type LovePushVotes = Record<string, LovePushDirection>;

/**
 * What shows on a boulder: how many players are pushing it each way. Every
 * direction with a push gets its own arrow - the crowd may well disagree,
 * and the first direction to reach the full crowd is the one that goes.
 */
export type LovePushBoulderPushes = Partial<Record<LovePushDirection, number>>;

/** Players behind each direction on a boulder. */
export function getLovePushPushCounts(
  votes: LovePushVotes,
): LovePushBoulderPushes {
  const counts: LovePushBoulderPushes = {};

  Object.values(votes).forEach((direction) => {
    counts[direction] = (counts[direction] ?? 0) + 1;
  });

  return counts;
}

/** The biggest crowd behind any one direction - how close the boulder is to moving. */
export function getLovePushMaxCount(pushes: LovePushBoulderPushes): number {
  return Math.max(
    0,
    ...LOVE_PUSH_DIRECTIONS.map((direction) => pushes[direction] ?? 0),
  );
}

/** Empty pushes for a fresh round. */
export function createLovePushVotes(): LovePushVotes[] {
  return Array.from({ length: LOVE_PUSH_BOULDERS }, () => ({}));
}

export type LovePushRound = {
  /** Increments every time fresh boulders appear. */
  roundId: number;
  /** Where each boulder is now, indexed by boulder (its square, once parked). */
  boulders: LovePushTile[];
  /** Where each boulder last started from, indexed by boulder - a fresh spot after every crash. */
  starts: LovePushTile[];
  /** Which boulders are parked in a square. Indexed by boulder. */
  sunk: boolean[];
  /** How many times each boulder has hit something and gone back. Indexed by boulder. */
  resets: number[];
  /** Players behind each direction on each boulder - the arrows it shows. Indexed by boulder. */
  pushes: LovePushBoulderPushes[];
  /** farmId -> boulders this player has helped roll this round. Proof of who helped. */
  pushers: Record<string, number>;
  solved: boolean;
  /** Epoch ms the last boulder dropped in - only set once solved. */
  solvedAt?: number;
  /** Epoch ms fresh boulders appear - only set once solved. */
  nextRoundAt?: number;
};

/** A round with the private part a room keeps: every player's push. */
export type LovePushFullRound = LovePushRound & {
  /** Every player's push on each boulder. Indexed by boulder. */
  votes: LovePushVotes[];
};

export function getLovePushSunkCount(sunk: boolean[]): number {
  return sunk.filter(Boolean).length;
}

/**
 * A player pushes a boulder in a direction. Their push is recorded, one per
 * player per boulder (pushing another side moves it); once
 * `LOVE_PUSH_PUSHERS_NEEDED` players are pushing it the same way it rolls a
 * tile - parking if it lands on a free square, or, if it hits something, it
 * crashes and comes back at a fresh start on its side of the island - and
 * that boulder's pushes are cleared. Everyone behind a roll or a sink is
 * credited; nobody is for a crash. Nothing changes on a
 * sunk boulder or once the round is solved.
 */
export function pushLoveBoulder<T extends LovePushFullRound>({
  round,
  boulder,
  direction,
  farmId,
  now = Date.now(),
}: {
  round: T;
  boulder: number;
  direction: LovePushDirection;
  farmId: string;
  now?: number;
}): T {
  if (round.solved) return round;
  if (!round.boulders[boulder] || round.sunk[boulder]) return round;

  // Already pushing it this way - nothing to add
  if (round.votes[boulder]?.[farmId] === direction) return round;

  const boulderVotes = { ...(round.votes[boulder] ?? {}), [farmId]: direction };
  const crowd = Object.keys(boulderVotes).filter(
    (id) => boulderVotes[id] === direction,
  );

  if (crowd.length < LOVE_PUSH_PUSHERS_NEEDED) {
    // Not enough of them yet - just count the push
    const votes = round.votes.map((existing, index) =>
      index === boulder ? boulderVotes : existing,
    );

    return {
      ...round,
      votes,
      pushes: votes.map(getLovePushPushCounts),
    };
  }

  const { step, to } = getLovePushStep({
    boulders: round.boulders,
    boulder,
    direction,
  });

  // Every push on it is spent, whichever way it pointed
  const votes = round.votes.map((existing, index) =>
    index === boulder ? {} : existing,
  );
  const pushes = votes.map(getLovePushPushCounts);

  if (step === "reset") {
    // It's gone - and comes back somewhere new on its side of the island
    const resets = round.resets.map((count, index) =>
      index === boulder ? count + 1 : count,
    );
    const restart = getLovePushRestart({
      roundId: round.roundId,
      boulder,
      resets: resets[boulder],
      boulders: round.boulders,
      starts: round.starts,
    });

    return {
      ...round,
      boulders: round.boulders.map((tile, index) =>
        index === boulder ? restart : tile,
      ),
      starts: round.starts.map((tile, index) =>
        index === boulder ? restart : tile,
      ),
      resets,
      votes,
      pushes,
    };
  }

  const boulders = round.boulders.map((tile, index) =>
    index === boulder ? to : tile,
  );
  const sunk = round.sunk.map((was, index) =>
    index === boulder ? step === "sink" : was,
  );
  const solved = getLovePushSunkCount(sunk) === LOVE_PUSH_BOULDERS;

  const pushers = { ...round.pushers };
  crowd.forEach((id) => {
    pushers[id] = (pushers[id] ?? 0) + 1;
  });

  return {
    ...round,
    boulders,
    sunk,
    votes,
    pushes,
    pushers,
    solved,
    ...(solved
      ? { solvedAt: now, nextRoundAt: now + LOVE_PUSH_SOLVED_MS }
      : {}),
  };
}

/**
 * The prize pays no Love Charms, so unlike the Dilemma and the Boulder there
 * is nothing to cap: everyone who pushed gets the same box, VIP or not, and a
 * player who has spent their whole Love Charm allowance elsewhere still gets
 * it. `canClaimLovePush` below is the only thing standing between a solved
 * round and the box.
 */
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
 * Whether the solved puzzle pays this player: they must have helped roll a
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

/** Local mode: how often the simulated crowd rolls a boulder on its own. */
export const LOVE_PUSH_LOCAL_BOT_MOVE_MS = 8000;
/**
 * Local mode: how often another simulated player joins a push the local
 * player started, so a lone tester can still roll a boulder.
 */
export const LOVE_PUSH_LOCAL_BOT_JOIN_MS = 1000;
/** Local mode: the simulated crowd's farm ids in `pushers`. */
const LOVE_PUSH_LOCAL_BOTS = Array.from(
  { length: LOVE_PUSH_PUSHERS_NEEDED },
  (_, i) => `bot-${i}`,
);

export type LovePushLocalRound = LovePushFullRound & {
  /** Boulder rolls so far - seeds the crowd's next move. */
  moves: number;
  lastBotMoveAt: number;
  /** The push the local player last made, for the crowd to join. */
  myPush?: { boulder: number; direction: LovePushDirection; farmId: string };
  lastBotJoinAt: number;
};

export function createLovePushLocalRound(
  now = Date.now(),
  roundId = 1,
): LovePushLocalRound {
  const { starts } = getLovePushLayout(roundId);
  const votes = createLovePushVotes();

  return {
    roundId,
    boulders: starts,
    starts,
    sunk: starts.map(() => false),
    resets: starts.map(() => 0),
    votes,
    pushes: votes.map(getLovePushPushCounts),
    pushers: {},
    solved: false,
    moves: 0,
    lastBotMoveAt: now,
    lastBotJoinAt: now,
  };
}

/** Did the boulder roll (or crash, or park) between two rounds? */
function changedLovePushBoulder(
  before: LovePushLocalRound,
  after: LovePushLocalRound,
  boulder: number,
): boolean {
  return (
    !isSameTile(before.boulders[boulder], after.boulders[boulder]) ||
    before.resets[boulder] !== after.resets[boulder] ||
    before.sunk[boulder] !== after.sunk[boulder]
  );
}

/**
 * The local player's push, kept only while their vote still stands on the
 * boulder - it's gone once that boulder rolls, crashes or parks.
 */
function standingLocalPush(
  round: LovePushLocalRound,
): LovePushLocalRound["myPush"] {
  const myPush = round.myPush;
  if (!myPush) return undefined;

  return round.votes[myPush.boulder]?.[myPush.farmId] === myPush.direction
    ? myPush
    : undefined;
}

/**
 * The local player pushed a boulder while the room has no push state. The
 * push counts straight away; the simulated crowd joins it over the next few
 * seconds (see `tickLovePushLocalRound`) until the boulder rolls.
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
  const next = pushLoveBoulder({ round, boulder, direction, farmId, now });
  if (next === round) return round;

  const pushed = {
    ...next,
    moves: changedLovePushBoulder(round, next, boulder)
      ? round.moves + 1
      : round.moves,
    myPush: { boulder, direction, farmId },
    lastBotJoinAt: now,
  };

  return { ...pushed, myPush: standingLocalPush(pushed) };
}

/** The simulated crowd rolls a boulder together - enough of them to move it. */
function crowdPushLovePushLocalRound({
  round,
  boulder,
  direction,
  now,
}: {
  round: LovePushLocalRound;
  boulder: number;
  direction: LovePushDirection;
  now: number;
}): LovePushLocalRound {
  let next = round;

  for (const bot of LOVE_PUSH_LOCAL_BOTS) {
    next = pushLoveBoulder({
      round: next,
      boulder,
      direction,
      farmId: bot,
      now,
    });
    if (changedLovePushBoulder(round, next, boulder)) break;
  }

  if (!changedLovePushBoulder(round, next, boulder)) return round;

  const shoved = { ...next, moves: round.moves + 1 };

  return { ...shoved, myPush: standingLocalPush(shoved) };
}

/**
 * Local stand-in while the MMO room has no push state. A simulated player
 * joins the local player's push every second until the boulder rolls, so a
 * lone tester can still shift one; and the crowd rolls a random boulder of
 * its own a step toward a free square now and then, so boulders are seen moving
 * that the player didn't push. Once solved the celebration runs before
 * fresh boulders appear - the same shape the room publishes.
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

  // Someone joins the local player's push
  const myPush = standingLocalPush(round);
  if (myPush && now - round.lastBotJoinAt >= LOVE_PUSH_LOCAL_BOT_JOIN_MS) {
    const votes = round.votes[myPush.boulder] ?? {};
    const bot = LOVE_PUSH_LOCAL_BOTS.find(
      (id) => votes[id] !== myPush.direction,
    );

    if (bot) {
      const next = pushLoveBoulder({
        round,
        boulder: myPush.boulder,
        direction: myPush.direction,
        farmId: bot,
        now,
      });
      const joined = {
        ...next,
        moves: changedLovePushBoulder(round, next, myPush.boulder)
          ? round.moves + 1
          : round.moves,
        lastBotJoinAt: now,
      };

      return { ...joined, myPush: standingLocalPush(joined) };
    }
  }

  if (now - round.lastBotMoveAt < LOVE_PUSH_LOCAL_BOT_MOVE_MS) return round;

  // The crowd rolls a boulder that's still out there a step along its route
  // to a free square
  const random = mulberry32(round.roundId * 7919 + round.moves + 1);
  const options = round.boulders
    .map((_, boulder) => ({
      boulder,
      direction: round.sunk[boulder]
        ? undefined
        : getLovePushRouteStep({ boulders: round.boulders, boulder }),
    }))
    .filter(
      (option): option is { boulder: number; direction: LovePushDirection } =>
        option.direction !== undefined,
    );

  if (options.length === 0) return { ...round, lastBotMoveAt: now };

  const choice = options[Math.floor(random() * options.length)];

  return {
    ...crowdPushLovePushLocalRound({ round, ...choice, now }),
    lastBotMoveAt: now,
  };
}
