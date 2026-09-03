import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  LOVE_DILEMMA_CHOICES_GRACE_MS,
  LOVE_DILEMMA_CHOOSE_MS,
  LOVE_DILEMMA_MAX_ATTEMPTS,
  LOVE_DILEMMA_MIN_PLAYERS,
  LOVE_DILEMMA_ROUND_MS,
  getLoveDilemmaAttemptsLeft,
  getLoveDilemmaBotChoices,
  getLoveDilemmaPayout,
  getLoveDilemmaPlatformPrizes,
  getLoveDilemmaPrize,
  getLoveDilemmaRound,
  getLoveDilemmaTiers,
  isLoveDilemmaRevealReady,
  isLoveDilemmaWinner,
  resolveLoveDilemma,
} from "./loveIsland";

const ONE_DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-09-03T12:00:00Z").getTime();

const vipFarm: GameState = {
  ...INITIAL_FARM,
  vip: { bundles: [], expiresAt: now + 30 * ONE_DAY },
};

describe("getLoveDilemmaRound", () => {
  it("is in the choose phase for the first 30s of a round", () => {
    const startAt =
      Math.floor(now / LOVE_DILEMMA_ROUND_MS) * LOVE_DILEMMA_ROUND_MS;

    const round = getLoveDilemmaRound(startAt + 5000);

    expect(round.phase).toBe("choose");
    expect(round.startAt).toBe(startAt);
    expect(round.chooseEndsAt).toBe(startAt + LOVE_DILEMMA_CHOOSE_MS);
    expect(round.revealEndsAt).toBe(startAt + LOVE_DILEMMA_ROUND_MS);
  });

  it("switches to reveal after 30s and rolls to a new round after 40s", () => {
    const startAt =
      Math.floor(now / LOVE_DILEMMA_ROUND_MS) * LOVE_DILEMMA_ROUND_MS;

    const reveal = getLoveDilemmaRound(startAt + LOVE_DILEMMA_CHOOSE_MS);
    expect(reveal.phase).toBe("reveal");
    expect(reveal.roundId).toBe(getLoveDilemmaRound(startAt).roundId);

    const next = getLoveDilemmaRound(startAt + LOVE_DILEMMA_ROUND_MS);
    expect(next.phase).toBe("choose");
    expect(next.roundId).toBe(reveal.roundId + 1);
  });

  it("assigns every tier to exactly one platform, deterministically", () => {
    const tiers = getLoveDilemmaTiers(12345);

    expect([...tiers].sort()).toEqual([0, 1, 2]);
    expect(getLoveDilemmaTiers(12345)).toEqual(tiers);
    expect(getLoveDilemmaTiers(12346)).not.toEqual(tiers);
  });
});

describe("prizes", () => {
  it("maps tiers to VIP and standard prizes", () => {
    expect(getLoveDilemmaPrize({ tier: 0, isVip: true })).toBe(20);
    expect(getLoveDilemmaPrize({ tier: 2, isVip: true })).toBe(5);
    expect(getLoveDilemmaPrize({ tier: 0, isVip: false })).toBe(3);
    expect(getLoveDilemmaPrize({ tier: 2, isVip: false })).toBe(1);
  });

  it("lists the prize on each platform in platform order", () => {
    expect(
      getLoveDilemmaPlatformPrizes({ tiers: [2, 0, 1], isVip: true }),
    ).toEqual([5, 20, 10]);
  });
});

describe("getLoveDilemmaPayout", () => {
  const withClaims = (amounts: number[]): GameState => ({
    ...INITIAL_FARM,
    floatingIsland: {
      ...INITIAL_FARM.floatingIsland,
      prizeClaims: amounts.map((amount, i) => ({
        claimedAt: now - 1000 * (amounts.length - i),
        amount,
        game: "love_dilemma" as const,
        roundId: i,
      })),
    },
  });

  it("caps a standard player's 3 + 3 at the 5/day limit", () => {
    expect(getLoveDilemmaPayout({ state: withClaims([]), prize: 3, now })).toBe(
      3,
    );
    expect(
      getLoveDilemmaPayout({ state: withClaims([3]), prize: 3, now }),
    ).toBe(2);
  });

  it("pays 3 + 2 + 0 for a standard player's 3, 2, 1 sequence", () => {
    expect(
      getLoveDilemmaPayout({ state: withClaims([3]), prize: 2, now }),
    ).toBe(2);
    expect(
      getLoveDilemmaPayout({ state: withClaims([3, 2]), prize: 1, now }),
    ).toBe(0);
  });

  it("does not cap a VIP under the 100/day limit", () => {
    expect(getLoveDilemmaPayout({ state: vipFarm, prize: 20, now })).toBe(20);
  });
});

describe("isLoveDilemmaRevealReady", () => {
  const chooseEndsAt = now;

  it("is never ready during the choose phase", () => {
    expect(
      isLoveDilemmaRevealReady({
        now: chooseEndsAt - 1,
        chooseEndsAt,
        choicesCount: 5,
        chosenCount: 5,
      }),
    ).toBe(false);
  });

  it("waits while the room's choices have not landed yet", () => {
    expect(
      isLoveDilemmaRevealReady({
        now: chooseEndsAt + 500,
        chooseEndsAt,
        choicesCount: 0,
        chosenCount: 6,
      }),
    ).toBe(false);
    expect(
      isLoveDilemmaRevealReady({
        now: chooseEndsAt + 500,
        chooseEndsAt,
        choicesCount: 3,
        chosenCount: 6,
      }),
    ).toBe(false);
  });

  it("is ready once every locked-in pick has arrived", () => {
    expect(
      isLoveDilemmaRevealReady({
        now: chooseEndsAt + 1000,
        chooseEndsAt,
        choicesCount: 6,
        chosenCount: 6,
      }),
    ).toBe(true);
  });

  it("does not trust an empty map just because chosenCount is 0", () => {
    expect(
      isLoveDilemmaRevealReady({
        now: chooseEndsAt + 500,
        chooseEndsAt,
        choicesCount: 0,
        chosenCount: 0,
      }),
    ).toBe(false);
  });

  it("resolves with whatever is there once the grace period passes", () => {
    expect(
      isLoveDilemmaRevealReady({
        now: chooseEndsAt + LOVE_DILEMMA_CHOICES_GRACE_MS,
        chooseEndsAt,
        choicesCount: 0,
        chosenCount: 0,
      }),
    ).toBe(true);
    expect(
      isLoveDilemmaRevealReady({
        now: chooseEndsAt + LOVE_DILEMMA_CHOICES_GRACE_MS,
        chooseEndsAt,
        choicesCount: 3,
        chosenCount: 6,
      }),
    ).toBe(true);
  });
});

describe("resolveLoveDilemma", () => {
  it("makes the most crowded platform lose", () => {
    const result = resolveLoveDilemma({
      a: 0,
      b: 0,
      c: 0,
      d: 1,
      e: 2,
    });

    expect(result.counts).toEqual([3, 1, 1]);
    expect(result.total).toBe(5);
    expect(result.losingPlatforms).toEqual([0]);
    expect(result.isVoid).toBe(false);
    expect(isLoveDilemmaWinner({ platform: 0, result })).toBe(false);
    expect(isLoveDilemmaWinner({ platform: 1, result })).toBe(true);
    expect(isLoveDilemmaWinner({ platform: 2, result })).toBe(true);
  });

  it("makes everyone on tied top platforms lose", () => {
    const result = resolveLoveDilemma({
      a: 0,
      b: 0,
      c: 1,
      d: 1,
      e: 2,
    });

    expect(result.losingPlatforms).toEqual([0, 1]);
    expect(isLoveDilemmaWinner({ platform: 0, result })).toBe(false);
    expect(isLoveDilemmaWinner({ platform: 1, result })).toBe(false);
    expect(isLoveDilemmaWinner({ platform: 2, result })).toBe(true);
  });

  it("voids the round with fewer than the minimum players", () => {
    const result = resolveLoveDilemma({ a: 0, b: 1, c: 2, d: 2 });

    expect(result.total).toBe(LOVE_DILEMMA_MIN_PLAYERS - 1);
    expect(result.isVoid).toBe(true);
    expect(isLoveDilemmaWinner({ platform: 1, result })).toBe(false);
  });

  it("ignores out-of-range platforms", () => {
    const result = resolveLoveDilemma({ a: -1, b: 3, c: 2 });

    expect(result.counts).toEqual([0, 0, 1]);
    expect(result.total).toBe(1);
  });
});

describe("attempts", () => {
  it("counts every claim for the game today, wins and losses alike", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      floatingIsland: {
        ...INITIAL_FARM.floatingIsland,
        prizeClaims: [
          { claimedAt: now - 3000, amount: 0, game: "love_dilemma" },
          { claimedAt: now - 2000, amount: 20, game: "love_dilemma" },
          { claimedAt: now - 1000, amount: 5, game: "petal_puzzle" },
          { claimedAt: now - ONE_DAY, amount: 0, game: "love_dilemma" },
        ],
      },
    };

    expect(getLoveDilemmaAttemptsLeft({ state, now })).toBe(
      LOVE_DILEMMA_MAX_ATTEMPTS - 2,
    );
  });

  it("never goes below zero", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      floatingIsland: {
        ...INITIAL_FARM.floatingIsland,
        prizeClaims: Array.from({ length: 5 }, () => ({
          claimedAt: now,
          amount: 0,
          game: "love_dilemma" as const,
        })),
      },
    };

    expect(getLoveDilemmaAttemptsLeft({ state, now })).toBe(0);
  });
});

describe("getLoveDilemmaBotChoices", () => {
  it("is deterministic per round and picks valid platforms", () => {
    const first = getLoveDilemmaBotChoices(42, 6);
    const again = getLoveDilemmaBotChoices(42, 6);

    expect(again).toEqual(first);
    expect(Object.keys(first)).toHaveLength(6);
    Object.values(first).forEach((platform) => {
      expect(platform).toBeGreaterThanOrEqual(0);
      expect(platform).toBeLessThan(3);
    });
  });

  it("varies between rounds", () => {
    const rounds = Array.from({ length: 20 }, (_, i) =>
      JSON.stringify(getLoveDilemmaBotChoices(i, 6)),
    );

    expect(new Set(rounds).size).toBeGreaterThan(1);
  });
});
