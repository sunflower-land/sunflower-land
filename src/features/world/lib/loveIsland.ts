import { getFloatingIslandGameClaimsToday } from "features/game/events/landExpansion/claimFloatingIslandPrize";
import type { GameState } from "features/game/types/game";

/**
 * Client-side rules for the Love Island Love Dilemma.
 *
 * The game pays out through the generic `floatingIslandPrize.claimed` event.
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
