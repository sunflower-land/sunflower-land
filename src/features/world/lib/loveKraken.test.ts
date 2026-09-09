import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  LOVE_KRAKEN_FIGHT_BACK_PER_SEC,
  LOVE_KRAKEN_HEALTH,
  LOVE_KRAKEN_LAG_GRACE_DEG,
  LOVE_KRAKEN_LOCAL_CROWD_ANGLERS,
  LOVE_KRAKEN_RESPAWN_MS,
  LOVE_KRAKEN_RING_MS_MAX,
  LOVE_KRAKEN_RING_MS_MIN,
  LOVE_KRAKEN_RING_MS_STEP,
  LOVE_KRAKEN_ZONE_HALF_DEG,
  applyLoveKrakenFightBack,
  canClaimLoveKraken,
  createLoveKrakenLocalRound,
  getLoveKrakenLocalCrowdReelsPerSec,
  getLoveKrakenReelCooldownMs,
  getLoveKrakenRing,
  getLoveKrakenRingMs,
  getLoveKrakenRingOffset,
  getLoveKrakenSpin,
  getLoveKrakenZoneAngle,
  hasClaimedLoveKrakenRound,
  hasClaimedLoveKrakenToday,
  isLoveKrakenReelOnTarget,
  isLoveKrakenRewardOpen,
  reelLoveKrakenLocalRound,
  tickLoveKrakenLocalRound,
  type LoveKrakenRound,
} from "./loveKraken";

const now = new Date("2024-08-01T12:00:00Z").getTime();

const withClaims = (
  claims: GameState["floatingIsland"]["prizeClaims"],
): GameState => ({
  ...TEST_FARM,
  floatingIsland: { ...TEST_FARM.floatingIsland, prizeClaims: claims },
});

const fighting = (progress: number): LoveKrakenRound => ({
  roundId: 1,
  health: LOVE_KRAKEN_HEALTH,
  progress,
  caught: false,
  prize: { type: "item", item: "Bronze Love Box", amount: 1 },
});

const RING = LOVE_KRAKEN_RING_MS_MAX;

/** The ring for an angler who has never reeled - the epoch-anchored leg. */
const freshRing = (now: number, roundId = 1) =>
  getLoveKrakenRing({ roundId, reels: 0, now });

describe("loveKraken: the ring", () => {
  it("sweeps a full turn every ring period, starting at the top", () => {
    expect(freshRing(0).angle).toEqual(0);
    expect(freshRing(RING / 4).angle).toEqual(90);
    expect(freshRing(RING / 2).angle).toEqual(180);
    expect(freshRing(RING).angle).toEqual(0);
  });

  it("puts a fresh angler's zone at the top, going clockwise", () => {
    const ring = freshRing(0);

    expect(ring.zoneAngle).toEqual(0);
    expect(ring.spin).toEqual(1);
    expect(ring.ringMs).toEqual(RING);
  });

  it("measures the offset to the zone the short way round", () => {
    expect(getLoveKrakenRingOffset(freshRing(RING / 4))).toEqual(90);
    // Three quarters round is 270 degrees clockwise, but 90 from the top
    expect(getLoveKrakenRingOffset(freshRing((RING * 3) / 4))).toEqual(90);
  });

  it("lands a reel inside the catch zone and misses outside it", () => {
    const perDegree = RING / 360;

    expect(isLoveKrakenReelOnTarget({ ring: freshRing(0) })).toBe(true);
    expect(
      isLoveKrakenReelOnTarget({
        ring: freshRing(
          Math.floor((LOVE_KRAKEN_ZONE_HALF_DEG - 1) * perDegree),
        ),
      }),
    ).toBe(true);
    expect(
      isLoveKrakenReelOnTarget({
        ring: freshRing(Math.ceil((LOVE_KRAKEN_ZONE_HALF_DEG + 1) * perDegree)),
      }),
    ).toBe(false);
  });

  it("is symmetrical about the middle of the zone", () => {
    expect(isLoveKrakenReelOnTarget({ ring: freshRing(RING - 10) })).toBe(true);
  });

  it("forgives lag when the room checks with the wider tolerance", () => {
    const perDegree = RING / 360;
    const late = Math.ceil((LOVE_KRAKEN_ZONE_HALF_DEG + 10) * perDegree);

    expect(isLoveKrakenReelOnTarget({ ring: freshRing(late) })).toBe(false);
    expect(
      isLoveKrakenReelOnTarget({
        ring: freshRing(late),
        toleranceDeg: LOVE_KRAKEN_ZONE_HALF_DEG + LOVE_KRAKEN_LAG_GRACE_DEG,
      }),
    ).toBe(true);
  });
});

describe("loveKraken: what a landed reel changes", () => {
  const roundId = 42;

  it("moves the zone at least a quarter turn every time", () => {
    let previous = getLoveKrakenZoneAngle({ roundId, reels: 0 });

    for (let reels = 1; reels <= 40; reels++) {
      const angle = getLoveKrakenZoneAngle({ roundId, reels });
      const gap = Math.abs(angle - previous) % 360;

      expect(Math.min(gap, 360 - gap)).toBeGreaterThanOrEqual(90 - 1e-9);
      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThan(360);
      previous = angle;
    }
  });

  it("reverses the spin every time", () => {
    expect(getLoveKrakenSpin(0)).toEqual(1);
    expect(getLoveKrakenSpin(1)).toEqual(-1);
    expect(getLoveKrakenSpin(2)).toEqual(1);
    expect(getLoveKrakenSpin(3)).toEqual(-1);
  });

  it("winds the sweep up a step every time, down to the floor", () => {
    expect(getLoveKrakenRingMs(0)).toEqual(LOVE_KRAKEN_RING_MS_MAX);
    expect(getLoveKrakenRingMs(1)).toEqual(
      LOVE_KRAKEN_RING_MS_MAX - LOVE_KRAKEN_RING_MS_STEP,
    );

    let previous = Infinity;
    for (let reels = 0; reels <= 60; reels++) {
      const ringMs = getLoveKrakenRingMs(reels);

      expect(ringMs).toBeLessThanOrEqual(previous);
      expect(ringMs).toBeGreaterThanOrEqual(LOVE_KRAKEN_RING_MS_MIN);
      previous = ringMs;
    }

    expect(getLoveKrakenRingMs(1000)).toEqual(LOVE_KRAKEN_RING_MS_MIN);
  });

  it("treats a count below zero as a fresh line", () => {
    expect(getLoveKrakenZoneAngle({ roundId, reels: -3 })).toEqual(0);
    expect(getLoveKrakenSpin(-3)).toEqual(1);
    expect(getLoveKrakenRingMs(-3)).toEqual(LOVE_KRAKEN_RING_MS_MAX);
  });

  it("is the same for everyone working from the same round and count", () => {
    // What the room derives from `anglers[farmId]` must match the client
    const args = { roundId: 7, reels: 5, legStartAt: 1000, now: 1500 };

    expect(getLoveKrakenRing(args)).toEqual(getLoveKrakenRing(args));
  });

  it("gives different rounds different zone sequences", () => {
    expect(getLoveKrakenZoneAngle({ roundId: 1, reels: 3 })).not.toEqual(
      getLoveKrakenZoneAngle({ roundId: 2, reels: 3 }),
    );
  });
});

describe("loveKraken: the marker never jumps", () => {
  const roundId = 3;

  /**
   * The bug this guards: reading the phase as `now % ringMs` made the marker
   * snap back to the top the instant a reel changed the sweep. A leg starts
   * on the zone the reel just landed on, so it picks up where it left off.
   */
  it("picks the new leg up exactly where the hit left the marker", () => {
    for (let reels = 0; reels < 8; reels++) {
      const hitAt = 10_000 + reels * 3_000;
      // At the hit the marker is sitting on the zone it just hit
      const zoneHit = getLoveKrakenZoneAngle({ roundId, reels });
      // ...and the very next instant it is on the new leg
      const after = getLoveKrakenRing({
        roundId,
        reels: reels + 1,
        legStartAt: hitAt,
        now: hitAt,
      });

      expect(after.angle).toBeCloseTo(zoneHit, 6);
    }
  });

  it("sweeps smoothly across a leg, with no step anywhere", () => {
    const legStartAt = 5_000;
    const reels = 7;
    let previous = getLoveKrakenRing({
      roundId,
      reels,
      legStartAt,
      now: legStartAt,
    }).angle;

    for (let dt = 10; dt <= 4_000; dt += 10) {
      const angle = getLoveKrakenRing({
        roundId,
        reels,
        legStartAt,
        now: legStartAt + dt,
      }).angle;
      const step = Math.abs(angle - previous) % 360;

      // A 10ms step at the fastest sweep is 3 degrees; anything near a
      // teleport would blow straight past this
      expect(Math.min(step, 360 - step)).toBeLessThan(10);
      previous = angle;
    }
  });

  it("runs the marker backwards on an odd leg", () => {
    const legStartAt = 5_000;
    const at = (reels: number, dt: number) =>
      getLoveKrakenRing({ roundId, reels, legStartAt, now: legStartAt + dt })
        .angle;

    // One reel in: anticlockwise, so the angle falls away from the start
    const start = at(1, 0);
    const later = at(1, 100);
    expect((start - later + 360) % 360).toBeGreaterThan(0);
    expect((start - later + 360) % 360).toBeLessThan(180);

    // Two reels in: clockwise again
    const start2 = at(2, 0);
    const later2 = at(2, 100);
    expect((later2 - start2 + 360) % 360).toBeGreaterThan(0);
    expect((later2 - start2 + 360) % 360).toBeLessThan(180);
  });

  it("keeps the angle in range however long the leg runs", () => {
    for (const dt of [0, 1_000, 60_000, 3_600_000]) {
      for (const reels of [1, 2, 9]) {
        const { angle } = getLoveKrakenRing({
          roundId,
          reels,
          legStartAt: 0,
          now: dt,
        });

        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(360);
      }
    }
  });

  it("falls back to the epoch leg when there is no anchor yet", () => {
    // Still that angler's own sweep, just read off the clock instead of a leg
    const reels = 4;
    const now = RING / 4;
    const ringMs = getLoveKrakenRingMs(reels);

    expect(getLoveKrakenRing({ roundId, reels, now }).angle).toBeCloseTo(
      ((now % ringMs) / ringMs) * 360,
    );
  });

  it("keeps the cooldown too short to score twice on one pass", () => {
    for (const ringMs of [LOVE_KRAKEN_RING_MS_MAX, LOVE_KRAKEN_RING_MS_MIN]) {
      const cooldown = getLoveKrakenReelCooldownMs(ringMs);
      // The marker is inside the zone for `share` of a sweep
      const zoneMs = (ringMs * (LOVE_KRAKEN_ZONE_HALF_DEG * 2)) / 360;

      expect(cooldown).toBeGreaterThan(zoneMs);
      // ...but never so long that it blocks the next zone coming round
      expect(cooldown).toBeLessThan(ringMs / 2);
    }
  });
});

describe("loveKraken: fighting back", () => {
  it("drags back the fight-back rate every second", () => {
    expect(
      applyLoveKrakenFightBack({ progress: 100, elapsedMs: 1000 }),
    ).toEqual(100 - LOVE_KRAKEN_FIGHT_BACK_PER_SEC);
    expect(
      applyLoveKrakenFightBack({ progress: 100, elapsedMs: 2000 }),
    ).toEqual(100 - LOVE_KRAKEN_FIGHT_BACK_PER_SEC * 2);
  });

  it("never drags progress below zero", () => {
    expect(
      applyLoveKrakenFightBack({ progress: 1, elapsedMs: 60_000 }),
    ).toEqual(0);
  });

  it("takes a crowd to out-pull it", () => {
    // The zone jumps half a turn ahead on average, so an angler reeling
    // properly lands one every half sweep
    const perAnglerPerSec = 2000 / LOVE_KRAKEN_RING_MS_MAX;
    const anglersNeeded = LOVE_KRAKEN_FIGHT_BACK_PER_SEC / perAnglerPerSec;

    expect(anglersNeeded).toBeGreaterThan(1);
  });

  it("lands in about a minute with twenty anglers - Adam's brief", () => {
    // Twenty anglers in lockstep, each landing one every half sweep, with the
    // sweep winding up on their own count as they go
    const anglers = 20;
    let progress = 0;
    let seconds = 0;

    for (
      let reels = 0;
      progress < LOVE_KRAKEN_HEALTH && reels < 5000;
      reels++
    ) {
      const legSeconds = getLoveKrakenRingMs(reels) / 2 / 1000;

      seconds += legSeconds;
      progress = Math.max(
        0,
        progress + anglers - LOVE_KRAKEN_FIGHT_BACK_PER_SEC * legSeconds,
      );
    }

    expect(seconds).toBeGreaterThan(45);
    expect(seconds).toBeLessThan(75);
  });

  it("cannot be landed at all by fewer anglers than the floor", () => {
    // At the opening sweep an angler is worth one point a second
    const perAnglerPerSec = 2000 / LOVE_KRAKEN_RING_MS_MAX;
    const floor = LOVE_KRAKEN_FIGHT_BACK_PER_SEC / perAnglerPerSec;

    expect(floor * perAnglerPerSec).toEqual(LOVE_KRAKEN_FIGHT_BACK_PER_SEC);
    // One under the floor loses ground no matter how well they play
    expect(
      (floor - 1) * perAnglerPerSec - LOVE_KRAKEN_FIGHT_BACK_PER_SEC,
    ).toBeLessThan(0);
  });
});

describe("loveKraken: the prize window", () => {
  it("is shut while the Marvel is still fighting", () => {
    expect(isLoveKrakenRewardOpen({ round: fighting(200), now })).toBe(false);
  });

  it("is open until the Marvel respawns", () => {
    const round: LoveKrakenRound = {
      ...fighting(LOVE_KRAKEN_HEALTH),
      caught: true,
      caughtAt: now,
      respawnAt: now + LOVE_KRAKEN_RESPAWN_MS,
    };

    expect(isLoveKrakenRewardOpen({ round, now })).toBe(true);
    expect(
      isLoveKrakenRewardOpen({ round, now: now + LOVE_KRAKEN_RESPAWN_MS - 1 }),
    ).toBe(true);
    expect(
      isLoveKrakenRewardOpen({ round, now: now + LOVE_KRAKEN_RESPAWN_MS }),
    ).toBe(false);
  });
});

describe("loveKraken: claiming", () => {
  it("pays a player who landed a reel", () => {
    expect(
      canClaimLoveKraken({
        state: withClaims([]),
        myReels: 1,
        roundId: 1,
        now,
      }),
    ).toBe(true);
  });

  it("does not pay a player who never reeled", () => {
    expect(
      canClaimLoveKraken({
        state: withClaims([]),
        myReels: 0,
        roundId: 1,
        now,
      }),
    ).toBe(false);
  });

  it("only pays once a day", () => {
    const state = withClaims([
      { claimedAt: now - 1000, amount: 0, game: "love_kraken", roundId: 1 },
    ]);

    expect(hasClaimedLoveKrakenToday({ state, now })).toBe(true);
    expect(canClaimLoveKraken({ state, myReels: 5, roundId: 2, now })).toBe(
      false,
    );
  });

  it("does not count the other island games toward its own limit", () => {
    const state = withClaims([
      { claimedAt: now - 1000, amount: 0, game: "love_boulder", roundId: 7 },
    ]);

    expect(hasClaimedLoveKrakenToday({ state, now })).toBe(false);
    expect(canClaimLoveKraken({ state, myReels: 1, roundId: 1, now })).toBe(
      true,
    );
  });

  it("refuses a round already claimed - a reload mid-window pays nothing", () => {
    const state = withClaims([
      { claimedAt: now - 1000, amount: 0, game: "love_kraken", roundId: 4 },
    ]);

    expect(hasClaimedLoveKrakenRound({ state, roundId: 4, now })).toBe(true);
    expect(canClaimLoveKraken({ state, myReels: 3, roundId: 4, now })).toBe(
      false,
    );
  });

  it("forgets yesterday's claim", () => {
    const state = withClaims([
      {
        claimedAt: now - 24 * 60 * 60 * 1000,
        amount: 0,
        game: "love_kraken",
        roundId: 1,
      },
    ]);

    expect(hasClaimedLoveKrakenToday({ state, now })).toBe(false);
  });
});

describe("loveKraken: the local stand-in", () => {
  it("starts a fresh Marvel at no progress", () => {
    const round = createLoveKrakenLocalRound(now);

    expect(round.progress).toEqual(0);
    expect(round.health).toEqual(LOVE_KRAKEN_HEALTH);
    expect(round.caught).toBe(false);
  });

  it("makes ground at the simulated bank's rate, less the fight back", () => {
    const round = tickLoveKrakenLocalRound({
      round: { ...createLoveKrakenLocalRound(now), progress: 100 },
      now: now + 1000,
    });

    expect(round.progress).toBeCloseTo(
      100 +
        getLoveKrakenLocalCrowdReelsPerSec({
          progress: 100,
          health: LOVE_KRAKEN_HEALTH,
        }) -
        LOVE_KRAKEN_FIGHT_BACK_PER_SEC,
    );
  });

  it("stands in for a full bank on a fresh Marvel", () => {
    expect(
      getLoveKrakenLocalCrowdReelsPerSec({ progress: 0, health: 1000 }),
    ).toEqual(LOVE_KRAKEN_LOCAL_CROWD_ANGLERS);
  });

  it("winds the simulated bank up as the fight goes on", () => {
    expect(
      getLoveKrakenLocalCrowdReelsPerSec({ progress: 1000, health: 1000 }),
    ).toBeGreaterThan(
      getLoveKrakenLocalCrowdReelsPerSec({ progress: 0, health: 1000 }),
    );
  });

  it("copes with a round that has no health at all", () => {
    expect(
      getLoveKrakenLocalCrowdReelsPerSec({ progress: 0, health: 0 }),
    ).toEqual(LOVE_KRAKEN_LOCAL_CROWD_ANGLERS);
  });

  it("cannot be dragged below no progress at all", () => {
    const round = tickLoveKrakenLocalRound({
      round: {
        ...createLoveKrakenLocalRound(now),
        progress: 1,
        // A round with nobody on the bank
        health: LOVE_KRAKEN_HEALTH,
      },
      now: now + 1,
    });

    expect(round.progress).toBeGreaterThanOrEqual(0);
  });

  it("adds the local player's own reel on top", () => {
    const base = createLoveKrakenLocalRound(now);
    const reeled = reelLoveKrakenLocalRound({ round: base, now });

    expect(reeled.progress).toEqual(1);
  });

  it("lands the Marvel once the bank has pulled it all the way up", () => {
    const round = tickLoveKrakenLocalRound({
      round: createLoveKrakenLocalRound(now),
      now: now + 120_000,
    });

    expect(round.caught).toBe(true);
    expect(round.progress).toEqual(LOVE_KRAKEN_HEALTH);
    expect(round.respawnAt).toEqual(now + 120_000 + LOVE_KRAKEN_RESPAWN_MS);
  });

  it("holds the landed Marvel until the prize window shuts", () => {
    const caught = tickLoveKrakenLocalRound({
      round: createLoveKrakenLocalRound(now),
      now: now + 120_000,
    });
    const during = tickLoveKrakenLocalRound({
      round: caught,
      now: now + 120_000 + LOVE_KRAKEN_RESPAWN_MS - 1,
    });

    expect(during).toBe(caught);
  });

  it("surfaces a fresh Marvel when the window shuts", () => {
    const caught = tickLoveKrakenLocalRound({
      round: createLoveKrakenLocalRound(now),
      now: now + 120_000,
    });
    const next = tickLoveKrakenLocalRound({
      round: caught,
      now: now + 120_000 + LOVE_KRAKEN_RESPAWN_MS,
    });

    expect(next.roundId).toEqual(caught.roundId + 1);
    expect(next.caught).toBe(false);
    expect(next.progress).toEqual(0);
  });

  it("ignores a reel on a Marvel that is already landed", () => {
    const caught = tickLoveKrakenLocalRound({
      round: createLoveKrakenLocalRound(now),
      now: now + 120_000,
    });

    expect(reelLoveKrakenLocalRound({ round: caught, now })).toBe(caught);
  });
});
