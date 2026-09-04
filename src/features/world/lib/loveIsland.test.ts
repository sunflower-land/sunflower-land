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
  LOVE_BOULDER_HITS,
  LOVE_BOULDER_LOCAL_BOT_HITS_PER_SEC,
  LOVE_BOULDER_PRIZE,
  LOVE_BOULDER_RESPAWN_MS,
  canClaimLoveBoulder,
  createLoveBoulderLocalRound,
  getLoveBoulderPayout,
  hasClaimedLoveBoulderRound,
  hasClaimedLoveBoulderToday,
  isLoveBoulderRewardOpen,
  tickLoveBoulderLocalRound,
  LOVE_PUSH_BOULDERS,
  LOVE_PUSH_GRID_SIZE,
  LOVE_PUSH_LOCAL_BOT_MOVE_MS,
  LOVE_PUSH_MIN_SOLUTION_PUSHES,
  LOVE_PUSH_PRIZES,
  LOVE_PUSH_SOLVED_MS,
  applyLovePush,
  canClaimLovePush,
  canLovePush,
  createLovePushLocalRound,
  fromLovePushTileIndex,
  getLovePushLayout,
  getLovePushLitCount,
  getLovePushPayout,
  getLovePushPusherTile,
  getLovePushSolutionLength,
  isLovePushSolved,
  pushLoveBoulder,
  pushLovePushLocalRound,
  tickLovePushLocalRound,
  toLovePushTileIndex,
  type LovePushRound,
  type LovePushTile,
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

describe("Love Boulder", () => {
  const withBoulderClaims = (
    claims: { claimedAt: number; roundId: number }[],
  ): GameState => ({
    ...vipFarm,
    floatingIsland: {
      ...vipFarm.floatingIsland,
      prizeClaims: claims.map((claim) => ({
        ...claim,
        amount: LOVE_BOULDER_PRIZE,
        game: "love_boulder" as const,
      })),
    },
  });

  describe("local round", () => {
    it("starts with a full boulder", () => {
      const round = createLoveBoulderLocalRound(now);

      expect(round.hitsRemaining).toBe(LOVE_BOULDER_HITS);
      expect(round.broken).toBe(false);
      expect(round.respawnAt).toBeUndefined();
    });

    it("lets the crowd chip away over time, carrying fractions", () => {
      const start = createLoveBoulderLocalRound(now);
      const later = tickLoveBoulderLocalRound({
        round: start,
        now: now + 10_000,
      });

      expect(later.hitsRemaining).toBe(
        LOVE_BOULDER_HITS - 10 * LOVE_BOULDER_LOCAL_BOT_HITS_PER_SEC,
      );
      expect(later.broken).toBe(false);

      // Half a hit's worth of time - nothing yet, but it isn't lost
      const halfHitMs = 500 / LOVE_BOULDER_LOCAL_BOT_HITS_PER_SEC;
      const half = tickLoveBoulderLocalRound({
        round: later,
        now: now + 10_000 + halfHitMs,
      });
      expect(half.hitsRemaining).toBe(later.hitsRemaining);
      const whole = tickLoveBoulderLocalRound({
        round: half,
        now: now + 10_000 + 2 * halfHitMs,
      });
      expect(whole.hitsRemaining).toBe(later.hitsRemaining - 1);
    });

    it("breaks at zero, opens the prize window, then respawns", () => {
      const nearlyDone = {
        ...createLoveBoulderLocalRound(now),
        hitsRemaining: 1,
      };

      const broken = tickLoveBoulderLocalRound({
        round: nearlyDone,
        now: now + 1000,
      });
      expect(broken.broken).toBe(true);
      expect(broken.hitsRemaining).toBe(0);
      expect(broken.brokenAt).toBe(now + 1000);
      expect(broken.respawnAt).toBe(now + 1000 + LOVE_BOULDER_RESPAWN_MS);
      expect(isLoveBoulderRewardOpen({ round: broken, now: now + 1000 })).toBe(
        true,
      );
      expect(
        isLoveBoulderRewardOpen({
          round: broken,
          now: now + 1000 + LOVE_BOULDER_RESPAWN_MS,
        }),
      ).toBe(false);

      const stillBroken = tickLoveBoulderLocalRound({
        round: broken,
        now: now + 3000,
      });
      expect(stillBroken).toBe(broken);

      const next = tickLoveBoulderLocalRound({
        round: broken,
        now: now + 1000 + LOVE_BOULDER_RESPAWN_MS,
      });
      expect(next.roundId).toBe(broken.roundId + 1);
      expect(next.broken).toBe(false);
      expect(next.hitsRemaining).toBe(LOVE_BOULDER_HITS);
    });

    it("breaks on the player's own hit", () => {
      const round = { ...createLoveBoulderLocalRound(now), hitsRemaining: 0 };

      expect(tickLoveBoulderLocalRound({ round, now }).broken).toBe(true);
    });

    it("never opens the prize while the boulder stands", () => {
      const round = createLoveBoulderLocalRound(now);

      expect(isLoveBoulderRewardOpen({ round, now })).toBe(false);
    });
  });

  describe("claims", () => {
    it("pays everyone who helped, once", () => {
      expect(
        canClaimLoveBoulder({ state: vipFarm, myHits: 1, roundId: 3, now }),
      ).toBe(true);
      expect(
        canClaimLoveBoulder({ state: vipFarm, myHits: 0, roundId: 3, now }),
      ).toBe(false);
    });

    it("only allows one claim a day", () => {
      const claimed = withBoulderClaims([
        { claimedAt: now - 1000, roundId: 2 },
      ]);

      expect(hasClaimedLoveBoulderToday({ state: claimed, now })).toBe(true);
      expect(
        canClaimLoveBoulder({ state: claimed, myHits: 5, roundId: 3, now }),
      ).toBe(false);
    });

    it("resets on the next UTC day", () => {
      const yesterday = withBoulderClaims([
        { claimedAt: now - ONE_DAY, roundId: 2 },
      ]);

      expect(hasClaimedLoveBoulderToday({ state: yesterday, now })).toBe(false);
      expect(
        canClaimLoveBoulder({ state: yesterday, myHits: 5, roundId: 3, now }),
      ).toBe(true);
    });

    it("never claims the same boulder twice", () => {
      const claimed = withBoulderClaims([
        { claimedAt: now - 1000, roundId: 3 },
      ]);

      expect(
        hasClaimedLoveBoulderRound({ state: claimed, roundId: 3, now }),
      ).toBe(true);
      expect(
        hasClaimedLoveBoulderRound({ state: claimed, roundId: 4, now }),
      ).toBe(false);
    });

    it("caps the payout to what is left today", () => {
      expect(getLoveBoulderPayout({ state: vipFarm, now })).toBe(
        LOVE_BOULDER_PRIZE,
      );

      const standard: GameState = {
        ...INITIAL_FARM,
        floatingIsland: {
          ...INITIAL_FARM.floatingIsland,
          prizeClaims: [
            { claimedAt: now - 1000, amount: 3, game: "love_dilemma" },
          ],
        },
      };

      expect(getLoveBoulderPayout({ state: standard, now })).toBe(2);
    });
  });
});

describe("Lover's Push", () => {
  const tile = (x: number, y: number): LovePushTile => ({ x, y });
  const targets = [tile(2, 2), tile(3, 2), tile(2, 3), tile(3, 3)];
  const boulders = [tile(1, 1), tile(4, 1), tile(1, 4), tile(4, 4)];

  const round = (overrides: Partial<LovePushRound> = {}): LovePushRound => ({
    roundId: 1,
    boulders,
    lit: 0,
    pushers: {},
    solved: false,
    ...overrides,
  });

  describe("tile indices", () => {
    it("round-trips through the row-major index", () => {
      expect(toLovePushTileIndex(tile(0, 0))).toBe(0);
      expect(toLovePushTileIndex(tile(5, 0))).toBe(5);
      expect(toLovePushTileIndex(tile(0, 1))).toBe(LOVE_PUSH_GRID_SIZE);
      expect(fromLovePushTileIndex(35)).toEqual(tile(5, 5));
      expect(fromLovePushTileIndex(toLovePushTileIndex(tile(3, 4)))).toEqual(
        tile(3, 4),
      );
    });
  });

  describe("canLovePush", () => {
    it("pushers come in from the tile behind the boulder", () => {
      expect(
        getLovePushPusherTile({ boulder: tile(2, 2), direction: "east" }),
      ).toEqual(tile(1, 2));
      expect(
        getLovePushPusherTile({ boulder: tile(2, 2), direction: "north" }),
      ).toEqual(tile(2, 3));
    });

    it("allows a push with room on both sides", () => {
      expect(canLovePush({ boulders, boulder: 0, direction: "east" })).toBe(
        true,
      );
      expect(canLovePush({ boulders, boulder: 0, direction: "south" })).toBe(
        true,
      );
    });

    it("can't push a boulder off the grid", () => {
      const edge = [tile(0, 2), tile(5, 5)];

      expect(
        canLovePush({ boulders: edge, boulder: 0, direction: "west" }),
      ).toBe(false);
      expect(
        canLovePush({ boulders: edge, boulder: 1, direction: "south" }),
      ).toBe(false);
      expect(
        canLovePush({ boulders: edge, boulder: 1, direction: "east" }),
      ).toBe(false);
    });

    it("can push a boulder back off a wall or out of a corner from outside the grid", () => {
      const edge = [tile(0, 2), tile(5, 5)];

      expect(
        canLovePush({ boulders: edge, boulder: 0, direction: "east" }),
      ).toBe(true);
      expect(
        canLovePush({ boulders: edge, boulder: 0, direction: "north" }),
      ).toBe(true);
      expect(
        canLovePush({ boulders: edge, boulder: 1, direction: "north" }),
      ).toBe(true);
      expect(
        canLovePush({ boulders: edge, boulder: 1, direction: "west" }),
      ).toBe(true);
    });

    it("can't push into another boulder or from a tile one occupies", () => {
      const pair = [tile(2, 2), tile(3, 2)];

      expect(
        canLovePush({ boulders: pair, boulder: 0, direction: "east" }),
      ).toBe(false);
      expect(
        canLovePush({ boulders: pair, boulder: 1, direction: "west" }),
      ).toBe(false);
      // The pusher would have to come from boulder 1's tile
      expect(
        canLovePush({ boulders: pair, boulder: 0, direction: "west" }),
      ).toBe(false);
    });

    it("rejects an unknown boulder", () => {
      expect(canLovePush({ boulders, boulder: 9, direction: "east" })).toBe(
        false,
      );
    });
  });

  describe("applyLovePush", () => {
    it("moves only the pushed boulder one tile", () => {
      const moved = applyLovePush({ boulders, boulder: 0, direction: "east" });

      expect(moved[0]).toEqual(tile(2, 1));
      expect(moved.slice(1)).toEqual(boulders.slice(1));
    });

    it("leaves an impossible push alone", () => {
      const edge = [tile(0, 0)];

      expect(
        applyLovePush({ boulders: edge, boulder: 0, direction: "west" }),
      ).toBe(edge);
    });
  });

  describe("lights", () => {
    it("counts boulders on any target, whichever boulder", () => {
      expect(getLovePushLitCount({ boulders, targets })).toBe(0);
      expect(
        getLovePushLitCount({
          boulders: [tile(3, 3), tile(2, 2), tile(0, 0), tile(5, 5)],
          targets,
        }),
      ).toBe(2);
      expect(
        isLovePushSolved({
          boulders: [tile(3, 3), tile(2, 2), tile(3, 2), tile(2, 3)],
          targets,
        }),
      ).toBe(true);
    });
  });

  describe("getLovePushSolutionLength", () => {
    it("is 0 when already solved", () => {
      expect(getLovePushSolutionLength({ boulders: targets, targets })).toBe(0);
    });

    it("finds the fewest pushes", () => {
      // Each boulder is one push from its target
      expect(
        getLovePushSolutionLength({
          boulders: [tile(1, 2), tile(4, 2), tile(1, 3), tile(4, 3)],
          targets,
        }),
      ).toBe(4);
    });

    it("gets a boulder out of a corner - the border is walkable", () => {
      // Straight there is 6 pushes (3 east, 3 south) if nothing were in
      // the way; the other boulders block the last step so it's a bit more
      const pushes = getLovePushSolutionLength({
        boulders: [tile(0, 0), tile(2, 2), tile(3, 2), tile(2, 3)],
        targets,
      });

      expect(pushes).toBeDefined();
      expect(pushes).toBeGreaterThanOrEqual(6);
    });

    it("is undefined only when boulders box each other in", () => {
      // Four boulders in a 2x2 block can always be pushed apart, so a
      // solvable layout is the norm; a single target off the grid is not
      expect(
        getLovePushSolutionLength({
          boulders: [tile(0, 0)],
          targets: [tile(-1, 0)],
        }),
      ).toBeUndefined();
    });
  });

  describe("getLovePushLayout", () => {
    it("is deterministic per round and differs between rounds", () => {
      expect(getLovePushLayout(7)).toEqual(getLovePushLayout(7));
      expect(getLovePushLayout(7)).not.toEqual(getLovePushLayout(8));
    });

    it("only produces solvable layouts that take a few pushes", () => {
      for (let roundId = 1; roundId <= 25; roundId++) {
        const layout = getLovePushLayout(roundId);

        expect(layout.boulders).toHaveLength(LOVE_PUSH_BOULDERS);
        expect(layout.targets).toHaveLength(LOVE_PUSH_BOULDERS);
        expect(getLovePushLitCount(layout)).toBe(0);

        const pushes = getLovePushSolutionLength(layout);
        expect(pushes).toBeDefined();
        expect(pushes).toBeGreaterThanOrEqual(LOVE_PUSH_MIN_SOLUTION_PUSHES);
      }
    });

    it("never puts two boulders or two targets on one tile", () => {
      const layout = getLovePushLayout(3);
      const keys = [...layout.boulders, ...layout.targets].map(
        toLovePushTileIndex,
      );

      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe("pushLoveBoulder", () => {
    it("moves the boulder one tile and credits the pusher", () => {
      const next = pushLoveBoulder({
        round: round(),
        boulder: 0,
        direction: "east",
        farmId: "f1",
        targets,
        now,
      });

      expect(next.boulders[0]).toEqual(tile(2, 1));
      expect(next.boulders.slice(1)).toEqual(boulders.slice(1));
      expect(next.pushers).toEqual({ f1: 1 });
      expect(next.solved).toBe(false);
    });

    it("keeps counting a player's moves", () => {
      let next = round();
      next = pushLoveBoulder({
        round: next,
        boulder: 0,
        direction: "east",
        farmId: "f1",
        targets,
        now,
      });
      next = pushLoveBoulder({
        round: next,
        boulder: 1,
        direction: "west",
        farmId: "f1",
        targets,
        now,
      });

      expect(next.pushers).toEqual({ f1: 2 });
    });

    it("ignores an impossible push", () => {
      // Off the grid, or into another boulder
      const stuck = round({ boulders: [tile(0, 0), tile(1, 0)] });

      expect(
        pushLoveBoulder({
          round: stuck,
          boulder: 0,
          direction: "west",
          farmId: "f1",
          targets,
          now,
        }),
      ).toBe(stuck);
      expect(
        pushLoveBoulder({
          round: stuck,
          boulder: 0,
          direction: "east",
          farmId: "f1",
          targets,
          now,
        }),
      ).toBe(stuck);
    });

    it("lights the lamps and solves when the last boulder lands", () => {
      const almost = round({
        boulders: [tile(3, 3), tile(2, 2), tile(3, 2), tile(2, 4)],
        lit: 3,
      });

      const next = pushLoveBoulder({
        round: almost,
        boulder: 3,
        direction: "north",
        farmId: "f1",
        targets,
        now,
      });

      expect(next.lit).toBe(4);
      expect(next.solved).toBe(true);
      expect(next.solvedAt).toBe(now);
      expect(next.nextRoundAt).toBe(now + LOVE_PUSH_SOLVED_MS);

      // Nothing moves once solved
      expect(
        pushLoveBoulder({
          round: next,
          boulder: 0,
          direction: "west",
          farmId: "f2",
          targets,
          now,
        }),
      ).toBe(next);
    });

    it("turns a light off when a boulder is pushed off a target", () => {
      const lit = round({
        boulders: [tile(2, 2), tile(0, 5), tile(5, 0), tile(4, 4)],
        lit: 1,
      });

      const next = pushLoveBoulder({
        round: lit,
        boulder: 0,
        direction: "west",
        farmId: "f1",
        targets,
        now,
      });

      expect(next.boulders[0]).toEqual(tile(1, 2));
      expect(next.lit).toBe(0);
    });
  });

  describe("claims", () => {
    it("pays VIP and standard prizes", () => {
      expect(getLovePushPayout({ state: vipFarm, now })).toBe(
        LOVE_PUSH_PRIZES.vip,
      );
      expect(getLovePushPayout({ state: INITIAL_FARM, now })).toBe(
        LOVE_PUSH_PRIZES.standard,
      );
    });

    it("caps the payout at what's left today", () => {
      const standard: GameState = {
        ...INITIAL_FARM,
        floatingIsland: {
          ...INITIAL_FARM.floatingIsland,
          prizeClaims: [
            { claimedAt: now - 1000, amount: 4, game: "love_dilemma" },
          ],
        },
      };

      expect(getLovePushPayout({ state: standard, now })).toBe(1);
    });

    it("only pays players who moved a boulder", () => {
      expect(
        canClaimLovePush({ state: INITIAL_FARM, myMoves: 0, roundId: 1, now }),
      ).toBe(false);
      expect(
        canClaimLovePush({ state: INITIAL_FARM, myMoves: 1, roundId: 1, now }),
      ).toBe(true);
    });

    it("pays once a day, and never the same round twice", () => {
      const claimed: GameState = {
        ...INITIAL_FARM,
        floatingIsland: {
          ...INITIAL_FARM.floatingIsland,
          prizeClaims: [
            { claimedAt: now - 1000, amount: 3, game: "love_push", roundId: 1 },
          ],
        },
      };

      expect(
        canClaimLovePush({ state: claimed, myMoves: 2, roundId: 1, now }),
      ).toBe(false);
      expect(
        canClaimLovePush({ state: claimed, myMoves: 2, roundId: 2, now }),
      ).toBe(false);
      expect(
        canClaimLovePush({
          state: claimed,
          myMoves: 2,
          roundId: 2,
          now: now + ONE_DAY,
        }),
      ).toBe(true);
    });
  });

  describe("local mode", () => {
    it("starts unsolved on the seeded layout", () => {
      const local = createLovePushLocalRound(now, 5);

      expect(local.boulders).toEqual(getLovePushLayout(5).boulders);
      expect(local.targets).toEqual(getLovePushLayout(5).targets);
      expect(local.lit).toBe(0);
      expect(local.solved).toBe(false);
    });

    it("moves a boulder the local player shoves straight away", () => {
      const local = createLovePushLocalRound(now, 5);
      const direction = (["east", "south", "west", "north"] as const).find(
        (candidate) =>
          canLovePush({
            boulders: local.boulders,
            boulder: 0,
            direction: candidate,
          }),
      )!;

      const next = pushLovePushLocalRound({
        round: local,
        boulder: 0,
        direction,
        farmId: "farm-1",
        now,
      });

      expect(next.boulders).toEqual(
        applyLovePush({ boulders: local.boulders, boulder: 0, direction }),
      );
      expect(next.pushers["farm-1"]).toBe(1);
      expect(next.moves).toBe(1);
      expect(next.targets).toEqual(local.targets);
    });

    it("has the crowd shove a boulder on its own now and then", () => {
      const local = createLovePushLocalRound(now, 5);

      const early = tickLovePushLocalRound({
        round: local,
        now: now + LOVE_PUSH_LOCAL_BOT_MOVE_MS - 1,
      });
      expect(early.boulders).toEqual(local.boulders);

      const later = tickLovePushLocalRound({
        round: local,
        now: now + LOVE_PUSH_LOCAL_BOT_MOVE_MS,
      });
      expect(later.boulders).not.toEqual(local.boulders);
      expect(later.moves).toBe(1);
      expect(later.pushers["farm-1"]).toBeUndefined();

      // And waits again before the next one
      expect(
        tickLovePushLocalRound({
          round: later,
          now: now + LOVE_PUSH_LOCAL_BOT_MOVE_MS + 1,
        }).boulders,
      ).toEqual(later.boulders);
    });

    it("starts a fresh layout after the celebration", () => {
      const solved = {
        ...createLovePushLocalRound(now, 5),
        solved: true,
        lit: LOVE_PUSH_BOULDERS,
        solvedAt: now,
        nextRoundAt: now + LOVE_PUSH_SOLVED_MS,
      };

      expect(
        tickLovePushLocalRound({
          round: solved,
          now: now + LOVE_PUSH_SOLVED_MS - 1,
        }),
      ).toBe(solved);

      const next = tickLovePushLocalRound({
        round: solved,
        now: now + LOVE_PUSH_SOLVED_MS,
      });
      expect(next.roundId).toBe(6);
      expect(next.solved).toBe(false);
      expect(next.boulders).toEqual(getLovePushLayout(6).boulders);
    });
  });
});
