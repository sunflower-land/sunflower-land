import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  LOVE_ISLAND_MAP_HEIGHT,
  LOVE_ISLAND_MAP_WIDTH,
} from "./loveIslandTiles";
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
  LOVE_PUSH_DELTAS,
  LOVE_PUSH_LOCAL_BOT_JOIN_MS,
  LOVE_PUSH_LOCAL_BOT_MOVE_MS,
  LOVE_PUSH_MIN_START_DISTANCE,
  LOVE_PUSH_PIT,
  LOVE_PUSH_PRIZE,
  LOVE_PUSH_PUSHERS_NEEDED,
  LOVE_PUSH_SOLVED_MS,
  canClaimLovePush,
  createLovePushLocalRound,
  createLovePushVotes,
  fromLovePushTileIndex,
  getLovePushDistanceToPit,
  getLovePushLayout,
  getLovePushMaxCount,
  getLovePushPushCounts,
  getLovePushPushersNeeded,
  getLovePushStep,
  getLovePushStepTowardPit,
  getLovePushSunkCount,
  getLovePushTileAt,
  getLovePushTileCentre,
  isLoveIslandTileWalkable,
  isLovePushPit,
  pushLoveBoulder,
  pushLovePushLocalRound,
  tickLovePushLocalRound,
  toLovePushTileIndex,
  type LovePushDirection,
  type LovePushFullRound,
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
  /** Tiles in the clearing around the pit - all open ground. */
  const clearing = [tile(34, 34), tile(40, 33), tile(36, 36), tile(42, 35)];

  const round = (
    overrides: Partial<LovePushFullRound> = {},
  ): LovePushFullRound => {
    const boulders = overrides.boulders ?? clearing;
    const votes = overrides.votes ?? createLovePushVotes();

    return {
      roundId: 1,
      boulders,
      starts: overrides.starts ?? boulders,
      sunk: boulders.map(() => false),
      resets: boulders.map(() => 0),
      votes,
      pushes: votes.map(getLovePushPushCounts),
      pushers: {},
      solved: false,
      ...overrides,
    };
  };

  /** `count` players push a boulder the same way, one after another. */
  const crowdPush = (
    start: LovePushFullRound,
    {
      boulder,
      direction,
      count = LOVE_PUSH_PUSHERS_NEEDED,
      prefix = "f",
    }: {
      boulder: number;
      direction: LovePushDirection;
      count?: number;
      prefix?: string;
    },
  ): LovePushFullRound =>
    Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`).reduce(
      (current, farmId) =>
        pushLoveBoulder({ round: current, boulder, direction, farmId, now }),
      start,
    );

  describe("tiles", () => {
    it("round-trips through the row-major index across the island map", () => {
      expect(toLovePushTileIndex(tile(0, 0))).toBe(0);
      expect(toLovePushTileIndex(tile(0, 1))).toBe(LOVE_ISLAND_MAP_WIDTH);
      expect(fromLovePushTileIndex(toLovePushTileIndex(tile(38, 35)))).toEqual(
        tile(38, 35),
      );
    });

    it("puts the pit in the middle of the clearing", () => {
      expect(getLovePushTileCentre(LOVE_PUSH_PIT)).toEqual({ x: 616, y: 568 });
      expect(getLovePushTileAt({ x: 615, y: 566 })).toEqual(LOVE_PUSH_PIT);
      expect(isLovePushPit(LOVE_PUSH_PIT)).toBe(true);
    });

    it("knows the island's ground from its water and rocks", () => {
      expect(isLoveIslandTileWalkable(LOVE_PUSH_PIT)).toBe(true);
      clearing.forEach((spot) =>
        expect(isLoveIslandTileWalkable(spot)).toBe(true),
      );
      // Water off the island's edge, the Love Boulder's rock, and off the map
      expect(isLoveIslandTileWalkable(tile(3, 9))).toBe(false);
      expect(isLoveIslandTileWalkable(tile(38, 22))).toBe(false);
      expect(isLoveIslandTileWalkable(tile(-1, 35))).toBe(false);
      expect(isLoveIslandTileWalkable(tile(80, 35))).toBe(false);
    });
  });

  describe("getLovePushStep", () => {
    const sunk = [false, false, false, false];

    it("rolls onto open ground", () => {
      expect(
        getLovePushStep({
          boulders: clearing,
          sunk,
          boulder: 0,
          direction: "east",
        }),
      ).toEqual({ step: "move", to: tile(35, 34) });
    });

    it("drops into the pit", () => {
      const beside = [tile(37, 35), ...clearing.slice(1)];

      expect(
        getLovePushStep({
          boulders: beside,
          sunk,
          boulder: 0,
          direction: "east",
        }),
      ).toEqual({ step: "sink", to: LOVE_PUSH_PIT });
    });

    it("resets when it hits the water, a rock, or the edge of the map", () => {
      // (10, 35) is the last ground before the water to the west; (13, 35)
      // has rock to its east
      const edge = [tile(10, 35), tile(13, 35), tile(0, 35), tile(42, 35)];

      expect(
        getLovePushStep({ boulders: edge, sunk, boulder: 0, direction: "west" })
          .step,
      ).toBe("reset");
      expect(
        getLovePushStep({ boulders: edge, sunk, boulder: 1, direction: "east" })
          .step,
      ).toBe("reset");
      expect(
        getLovePushStep({ boulders: edge, sunk, boulder: 2, direction: "west" })
          .step,
      ).toBe("reset");
    });

    it("resets when it hits another boulder still in play, but not one already sunk", () => {
      const pair = [tile(34, 34), tile(35, 34), tile(36, 36), tile(42, 35)];

      expect(
        getLovePushStep({ boulders: pair, sunk, boulder: 0, direction: "east" })
          .step,
      ).toBe("reset");
      expect(
        getLovePushStep({
          boulders: pair,
          sunk: [false, true, false, false],
          boulder: 0,
          direction: "east",
        }).step,
      ).toBe("move");
    });
  });

  describe("paths to the pit", () => {
    it("measures pushes to the pit and points the way", () => {
      expect(getLovePushDistanceToPit(LOVE_PUSH_PIT)).toBe(0);
      expect(getLovePushDistanceToPit(tile(37, 35))).toBe(1);
      expect(getLovePushStepTowardPit(tile(37, 35))).toBe("east");
      expect(getLovePushStepTowardPit(LOVE_PUSH_PIT)).toBeUndefined();

      clearing.forEach((spot) => {
        const distance = getLovePushDistanceToPit(spot) as number;
        const direction = getLovePushStepTowardPit(spot) as LovePushDirection;
        expect(distance).toBeGreaterThan(0);
        const delta = LOVE_PUSH_DELTAS[direction];
        expect(
          getLovePushDistanceToPit({
            x: spot.x + delta.x,
            y: spot.y + delta.y,
          }),
        ).toBe(distance - 1);
      });
    });

    it("has no path from the water or from behind a rock", () => {
      expect(getLovePushDistanceToPit(tile(3, 9))).toBeUndefined();
      expect(getLovePushDistanceToPit(tile(38, 22))).toBeUndefined();
    });
  });

  describe("getLovePushLayout", () => {
    const corner = (spot: LovePushTile) =>
      (spot.x >= LOVE_PUSH_PIT.x ? 1 : 0) + (spot.y >= LOVE_PUSH_PIT.y ? 2 : 0);

    it("is deterministic per round and differs between rounds", () => {
      expect(getLovePushLayout(7)).toEqual(getLovePushLayout(7));
      expect(getLovePushLayout(7)).not.toEqual(getLovePushLayout(8));
    });

    it("starts every boulder far from the pit, on ground, with a way to roll it home", () => {
      for (let roundId = 1; roundId <= 25; roundId++) {
        const { starts } = getLovePushLayout(roundId);

        expect(starts).toHaveLength(LOVE_PUSH_BOULDERS);
        expect(new Set(starts.map(toLovePushTileIndex)).size).toBe(
          LOVE_PUSH_BOULDERS,
        );
        starts.forEach((start) => {
          expect(isLoveIslandTileWalkable(start)).toBe(true);
          expect(
            Math.abs(start.x - LOVE_PUSH_PIT.x) +
              Math.abs(start.y - LOVE_PUSH_PIT.y),
          ).toBeGreaterThanOrEqual(LOVE_PUSH_MIN_START_DISTANCE);
          expect(getLovePushDistanceToPit(start)).toBeGreaterThan(0);
        });
      }
    });

    it("spreads the boulders across the corners of the island", () => {
      // Every corner that has somewhere a boulder could start gets one
      const corners = new Set<number>();
      for (let y = 0; y < LOVE_ISLAND_MAP_HEIGHT; y++) {
        for (let x = 0; x < LOVE_ISLAND_MAP_WIDTH; x++) {
          const spot = tile(x, y);
          const far =
            Math.abs(x - LOVE_PUSH_PIT.x) + Math.abs(y - LOVE_PUSH_PIT.y) >=
            LOVE_PUSH_MIN_START_DISTANCE;
          if (far && getLovePushDistanceToPit(spot) !== undefined) {
            corners.add(corner(spot));
          }
        }
      }
      expect(corners.size).toBeGreaterThanOrEqual(3);

      for (let roundId = 1; roundId <= 10; roundId++) {
        const { starts } = getLovePushLayout(roundId);
        expect(new Set(starts.map(corner)).size).toBe(
          Math.min(LOVE_PUSH_BOULDERS, corners.size),
        );
      }
    });
  });

  describe("push counts", () => {
    it("is empty while nobody is pushing", () => {
      expect(getLovePushPushCounts({})).toEqual({});
      expect(getLovePushMaxCount({})).toBe(0);
    });

    it("counts every direction separately - the crowd may be split", () => {
      const pushes = getLovePushPushCounts({
        f1: "east",
        f2: "north",
        f3: "east",
        f4: "east",
        f5: "north",
      });

      expect(pushes).toEqual({ east: 3, north: 2 });
      expect(getLovePushMaxCount(pushes)).toBe(3);
    });
  });

  describe("pushLoveBoulder", () => {
    it("takes five players to move a boulder on mainnet, two everywhere else", () => {
      expect(getLovePushPushersNeeded("mainnet")).toBe(5);
      expect(getLovePushPushersNeeded("amoy")).toBe(2);
      expect(LOVE_PUSH_PUSHERS_NEEDED).toBe(
        getLovePushPushersNeeded(CONFIG.NETWORK),
      );
    });

    it("counts a push without moving the boulder", () => {
      const next = pushLoveBoulder({
        round: round(),
        boulder: 0,
        direction: "east",
        farmId: "f1",
        now,
      });

      expect(next.boulders).toEqual(clearing);
      expect(next.votes[0]).toEqual({ f1: "east" });
      expect(next.pushes[0]).toEqual({ east: 1 });
      expect(next.pushes.slice(1)).toEqual([{}, {}, {}]);
      expect(next.pushers).toEqual({});
      expect(next.solved).toBe(false);
    });

    it("counts up as more players push the same way", () => {
      const short = crowdPush(round(), {
        boulder: 0,
        direction: "east",
        count: LOVE_PUSH_PUSHERS_NEEDED - 1,
      });

      expect(short.boulders).toEqual(clearing);
      expect(short.pushes[0]).toEqual({ east: LOVE_PUSH_PUSHERS_NEEDED - 1 });
    });

    it("rolls the boulder once the last player pushes, crediting all of them", () => {
      const moved = crowdPush(round(), { boulder: 0, direction: "east" });

      expect(moved.boulders[0]).toEqual(tile(35, 34));
      expect(moved.boulders.slice(1)).toEqual(clearing.slice(1));
      expect(moved.pushers).toEqual(
        Object.fromEntries(
          Array.from({ length: LOVE_PUSH_PUSHERS_NEEDED }, (_, i) => [
            `f${i + 1}`,
            1,
          ]),
        ),
      );
      // Every push on it is spent
      expect(moved.votes[0]).toEqual({});
      expect(moved.pushes[0]).toEqual({});
      expect(moved.resets[0]).toBe(0);
      expect(moved.solved).toBe(false);
    });

    it("only counts each player once, and lets them change sides", () => {
      let next = round();
      for (let i = 0; i < 10; i++) {
        next = pushLoveBoulder({
          round: next,
          boulder: 0,
          direction: "east",
          farmId: "f1",
          now,
        });
      }

      expect(next.boulders).toEqual(clearing);
      expect(next.pushes[0]).toEqual({ east: 1 });

      // Pushing the same way again changes nothing at all
      expect(
        pushLoveBoulder({
          round: next,
          boulder: 0,
          direction: "east",
          farmId: "f1",
          now,
        }),
      ).toBe(next);

      const switched = pushLoveBoulder({
        round: next,
        boulder: 0,
        direction: "south",
        farmId: "f1",
        now,
      });

      expect(switched.votes[0]).toEqual({ f1: "south" });
      expect(switched.pushes[0]).toEqual({ south: 1 });
    });

    it("needs the crowd pushing the SAME way - a split crowd goes nowhere", () => {
      const short = LOVE_PUSH_PUSHERS_NEEDED - 1;
      const split = crowdPush(
        crowdPush(round(), { boulder: 0, direction: "east", count: short }),
        { boulder: 0, direction: "south", count: short, prefix: "s" },
      );

      expect(split.boulders).toEqual(clearing);
      // Both sides show
      expect(split.pushes[0]).toEqual({ east: short, south: short });

      // One more to the south and it goes south - and the easterners'
      // pushes are spent with it
      const moved = crowdPush(split, {
        boulder: 0,
        direction: "south",
        count: 1,
        prefix: "t",
      });

      expect(moved.boulders[0]).toEqual(tile(34, 35));
      expect(Object.keys(moved.pushers).sort()).toEqual(
        [...Array.from({ length: short }, (_, i) => `s${i + 1}`), "t1"].sort(),
      );
      expect(moved.votes[0]).toEqual({});
    });

    it("keeps pushes on the other boulders when one rolls", () => {
      const pushing = pushLoveBoulder({
        round: round(),
        boulder: 1,
        direction: "west",
        farmId: "f1",
        now,
      });
      const moved = crowdPush(pushing, { boulder: 0, direction: "east" });

      expect(moved.votes[1]).toEqual({ f1: "west" });
      expect(moved.pushes[1]).toEqual({ west: 1 });
    });

    it("sends a boulder back to its start when it hits something, crediting nobody", () => {
      // (10, 35) is the last ground before the water to the west
      const start = tile(10, 35);
      const edge = round({
        boulders: [tile(11, 35), ...clearing.slice(1)],
        starts: [start, ...clearing.slice(1)],
      });

      const reset = crowdPush(edge, { boulder: 0, direction: "west" });
      expect(reset.boulders[0]).toEqual(tile(10, 35));

      const again = crowdPush(reset, { boulder: 0, direction: "west" });
      expect(again.boulders[0]).toEqual(start);
      expect(again.resets[0]).toBe(1);
      expect(again.pushers).toEqual(reset.pushers);
      expect(again.votes[0]).toEqual({});
      expect(again.pushes[0]).toEqual({});

      // Into another boulder too
      const pair = round({
        boulders: [tile(34, 34), tile(35, 34), tile(36, 36), tile(42, 35)],
      });
      const bumped = crowdPush(pair, { boulder: 0, direction: "east" });
      expect(bumped.boulders[0]).toEqual(tile(34, 34));
      expect(bumped.resets[0]).toBe(1);
      expect(bumped.pushers).toEqual({});
    });

    it("sinks a boulder pushed into the pit, and solves on the last one", () => {
      const beside = round({
        boulders: [tile(37, 35), tile(39, 35), tile(38, 34), tile(38, 36)],
        sunk: [false, true, true, true],
      });

      const sunk = crowdPush(beside, { boulder: 0, direction: "east" });

      expect(sunk.boulders[0]).toEqual(LOVE_PUSH_PIT);
      expect(sunk.sunk).toEqual([true, true, true, true]);
      expect(getLovePushSunkCount(sunk.sunk)).toBe(4);
      expect(Object.keys(sunk.pushers)).toHaveLength(LOVE_PUSH_PUSHERS_NEEDED);
      expect(sunk.solved).toBe(true);
      expect(sunk.solvedAt).toBe(now);
      expect(sunk.nextRoundAt).toBe(now + LOVE_PUSH_SOLVED_MS);

      // Nothing moves once solved
      expect(
        pushLoveBoulder({
          round: sunk,
          boulder: 0,
          direction: "west",
          farmId: "f9",
          now,
        }),
      ).toBe(sunk);
    });

    it("ignores pushes on a boulder that's already in the pit", () => {
      const partly = round({
        boulders: [LOVE_PUSH_PIT, ...clearing.slice(1)],
        sunk: [true, false, false, false],
      });

      expect(
        pushLoveBoulder({
          round: partly,
          boulder: 0,
          direction: "west",
          farmId: "f1",
          now,
        }),
      ).toBe(partly);
      expect(partly.solved).toBe(false);
    });
  });

  describe("claims", () => {
    it("pays the petal puzzle's old prize", () => {
      expect(LOVE_PUSH_PRIZE).toEqual({ item: "Bronze Love Box", amount: 1 });
    });

    /**
     * The box is not Love Charms, so a player who has already spent the day's
     * whole Love Charm allowance elsewhere is still paid in full - the thing
     * the VIP/standard split used to decide.
     */
    it("pays the same however many Love Charms have been claimed today", () => {
      const spent: GameState = {
        ...INITIAL_FARM,
        floatingIsland: {
          ...INITIAL_FARM.floatingIsland,
          prizeClaims: [
            { claimedAt: now - 1000, amount: 5, game: "love_dilemma" },
          ],
        },
      };

      expect(
        canClaimLovePush({ state: spent, myMoves: 1, roundId: 1, now }),
      ).toBe(true);
      expect(
        canClaimLovePush({ state: vipFarm, myMoves: 1, roundId: 1, now }),
      ).toBe(true);
    });

    it("only pays players who helped roll a boulder", () => {
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
    it("starts with the round's boulders at their starts, nobody pushing", () => {
      const local = createLovePushLocalRound(now, 5);
      const { starts } = getLovePushLayout(5);

      expect(local.boulders).toEqual(starts);
      expect(local.starts).toEqual(starts);
      expect(local.sunk).toEqual([false, false, false, false]);
      expect(local.resets).toEqual([0, 0, 0, 0]);
      expect(local.pushes).toEqual([{}, {}, {}, {}]);
      expect(local.solved).toBe(false);
    });

    it("counts the local player's push straight away, then the crowd joins until it rolls", () => {
      const local = createLovePushLocalRound(now, 5);
      const direction = getLovePushStepTowardPit(
        local.boulders[0],
      ) as LovePushDirection;
      expect(direction).toBeDefined();

      let next = pushLovePushLocalRound({
        round: local,
        boulder: 0,
        direction,
        farmId: "farm-1",
        now,
      });

      expect(next.boulders).toEqual(local.boulders);
      expect(next.pushes[0]).toEqual({ [direction]: 1 });
      expect(next.myPush).toEqual({ boulder: 0, direction, farmId: "farm-1" });

      // Nobody joins straight away
      expect(
        tickLovePushLocalRound({
          round: next,
          now: now + LOVE_PUSH_LOCAL_BOT_JOIN_MS - 1,
        }),
      ).toBe(next);

      // One simulated player a second, until there are enough
      for (let joined = 1; joined < LOVE_PUSH_PUSHERS_NEEDED - 1; joined++) {
        next = tickLovePushLocalRound({
          round: next,
          now: now + joined * LOVE_PUSH_LOCAL_BOT_JOIN_MS,
        });
        expect(next.boulders).toEqual(local.boulders);
        expect(next.pushes[0]).toEqual({ [direction]: joined + 1 });
      }

      next = tickLovePushLocalRound({
        round: next,
        now: now + (LOVE_PUSH_PUSHERS_NEEDED - 1) * LOVE_PUSH_LOCAL_BOT_JOIN_MS,
      });

      const delta = LOVE_PUSH_DELTAS[direction];
      expect(next.boulders[0]).toEqual({
        x: local.boulders[0].x + delta.x,
        y: local.boulders[0].y + delta.y,
      });
      expect(next.pushers["farm-1"]).toBe(1);
      expect(next.pushes[0]).toEqual({});
      expect(next.moves).toBe(1);
      expect(next.myPush).toBeUndefined();
    });

    it("has the crowd roll a boulder toward the pit on its own now and then", () => {
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
      expect(later.resets).toEqual([0, 0, 0, 0]);
      expect(later.pushers["farm-1"]).toBeUndefined();
      // The whole crowd pushed it, and their pushes are spent
      expect(later.pushes).toEqual([{}, {}, {}, {}]);

      // Closer to the pit than it was
      const moved = later.boulders.findIndex(
        (spot, index) =>
          spot.x !== local.boulders[index].x ||
          spot.y !== local.boulders[index].y,
      );
      expect(getLovePushDistanceToPit(later.boulders[moved])).toBe(
        (getLovePushDistanceToPit(local.boulders[moved]) as number) - 1,
      );

      // And waits again before the next one
      expect(
        tickLovePushLocalRound({
          round: later,
          now: now + LOVE_PUSH_LOCAL_BOT_MOVE_MS + 1,
        }).boulders,
      ).toEqual(later.boulders);
    });

    it("starts fresh boulders after the celebration", () => {
      const solved = {
        ...createLovePushLocalRound(now, 5),
        solved: true,
        sunk: [true, true, true, true],
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
      expect(next.boulders).toEqual(getLovePushLayout(6).starts);
    });
  });
});
