import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  LOVE_KRAKEN_FIGHT_BACK_PER_SEC,
  LOVE_KRAKEN_HEALTH,
  LOVE_KRAKEN_LAG_GRACE_DEG,
  LOVE_KRAKEN_LOCAL_CROWD_REELS_PER_SEC,
  LOVE_KRAKEN_RESPAWN_MS,
  LOVE_KRAKEN_RING_MS,
  LOVE_KRAKEN_ZONE_HALF_DEG,
  applyLoveKrakenFightBack,
  canClaimLoveKraken,
  createLoveKrakenLocalRound,
  getLoveKrakenRingAngle,
  getLoveKrakenRingOffset,
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

describe("loveKraken: the ring", () => {
  it("sweeps a full turn every ring period, starting at the top", () => {
    expect(getLoveKrakenRingAngle(0)).toEqual(0);
    expect(getLoveKrakenRingAngle(LOVE_KRAKEN_RING_MS / 4)).toEqual(90);
    expect(getLoveKrakenRingAngle(LOVE_KRAKEN_RING_MS / 2)).toEqual(180);
    expect(getLoveKrakenRingAngle(LOVE_KRAKEN_RING_MS)).toEqual(0);
  });

  it("measures the offset to the top the short way round", () => {
    expect(getLoveKrakenRingOffset(LOVE_KRAKEN_RING_MS / 4)).toEqual(90);
    // Three quarters round is 270 degrees clockwise, but 90 from the top
    expect(getLoveKrakenRingOffset((LOVE_KRAKEN_RING_MS * 3) / 4)).toEqual(90);
  });

  it("lands a reel inside the catch zone and misses outside it", () => {
    const perDegree = LOVE_KRAKEN_RING_MS / 360;

    expect(isLoveKrakenReelOnTarget({ now: 0 })).toBe(true);
    expect(
      isLoveKrakenReelOnTarget({
        now: Math.floor((LOVE_KRAKEN_ZONE_HALF_DEG - 1) * perDegree),
      }),
    ).toBe(true);
    expect(
      isLoveKrakenReelOnTarget({
        now: Math.ceil((LOVE_KRAKEN_ZONE_HALF_DEG + 1) * perDegree),
      }),
    ).toBe(false);
  });

  it("is symmetrical about the top of the ring", () => {
    const justBefore = LOVE_KRAKEN_RING_MS - 10;

    expect(isLoveKrakenReelOnTarget({ now: justBefore })).toBe(true);
  });

  it("forgives lag when the room checks with the wider tolerance", () => {
    const perDegree = LOVE_KRAKEN_RING_MS / 360;
    const late = Math.ceil((LOVE_KRAKEN_ZONE_HALF_DEG + 10) * perDegree);

    expect(isLoveKrakenReelOnTarget({ now: late })).toBe(false);
    expect(
      isLoveKrakenReelOnTarget({
        now: late,
        toleranceDeg: LOVE_KRAKEN_ZONE_HALF_DEG + LOVE_KRAKEN_LAG_GRACE_DEG,
      }),
    ).toBe(true);
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
    // One angler at their very best - a reel every sweep of the ring
    const perAnglerPerSec = 1000 / LOVE_KRAKEN_RING_MS;
    const anglersNeeded = LOVE_KRAKEN_FIGHT_BACK_PER_SEC / perAnglerPerSec;

    expect(anglersNeeded).toBeGreaterThan(1);
    // Adam's brief: twenty anglers land it in about a minute
    const netPerSec = 20 * perAnglerPerSec - LOVE_KRAKEN_FIGHT_BACK_PER_SEC;
    expect(LOVE_KRAKEN_HEALTH / netPerSec).toBeGreaterThan(30);
    expect(LOVE_KRAKEN_HEALTH / netPerSec).toBeLessThan(90);
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
        LOVE_KRAKEN_LOCAL_CROWD_REELS_PER_SEC -
        LOVE_KRAKEN_FIGHT_BACK_PER_SEC,
    );
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
