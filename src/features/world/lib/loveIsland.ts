import {
  getFloatingIslandGameClaimsToday,
  getFloatingIslandLoveCharmsRemainingToday,
} from "features/game/events/landExpansion/claimFloatingIslandPrize";
import type { GameState } from "features/game/types/game";

/**
 * Client-side rules for the Love Island games (Love Dilemma, Love Boulder).
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
