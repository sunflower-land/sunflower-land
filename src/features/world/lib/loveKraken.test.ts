import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  LOVE_KRAKEN_FIGHT_BACK_PER_SEC,
  LOVE_KRAKEN_HEALTH,
  LOVE_KRAKEN_LOCAL_CROWD_ANGLERS,
  LOVE_KRAKEN_BUTTON,
  LOVE_KRAKEN_CAST_SPOTS,
  LOVE_KRAKEN_REACH,
  LOVE_KRAKEN_SPOT,
  LOVE_KRAKEN_REEL_KICK_MS,
  LOVE_KRAKEN_REEL_KICK_SHARE,
  LOVE_KRAKEN_RESPAWN_MS,
  LOVE_KRAKEN_RING_MS_MAX,
  LOVE_KRAKEN_RING_MS_MIN,
  LOVE_KRAKEN_RING_MS_STEP,
  LOVE_KRAKEN_ZONE_HALF_DEG,
  LOVE_KRAKEN_ZONE_MIN_JUMP_SHARE,
  LOVE_KRAKEN_FRESH_ANGLER,
  applyLoveKrakenFightBack,
  canClaimLoveKraken,
  createLoveKrakenLocalRound,
  getLoveKrakenBarShare,
  getLoveKrakenCastSpot,
  getLoveKrakenWalkRoute,
  toLoveKrakenTile,
  fromLoveKrakenTile,
  getLoveKrakenLocalCrowdReelsPerSec,
  getLoveKrakenReelKick,
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
  pullLoveKrakenRod,
  reelLoveKrakenLocalRound,
  tickLoveKrakenLocalRound,
  type LoveKrakenAngler,
  type LoveKrakenRound,
} from "./loveKraken";
import { isLoveIslandTileWalkable } from "./loveIsland";
import { readFileSync } from "fs";
import { join } from "path";

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

const angler = (over: Partial<LoveKrakenAngler> = {}): LoveKrakenAngler => ({
  ...LOVE_KRAKEN_FRESH_ANGLER,
  ...over,
});

/** The ring for an angler who has never pulled - the epoch-anchored leg. */
const freshRing = (now: number, roundId = 1) =>
  getLoveKrakenRing({ roundId, angler: angler(), now });

describe("loveKraken: getting to the wharf", () => {
  // The `assets/` alias is stubbed in jest, so read the real map off disk
  type Rect = { x: number; y: number; width: number; height: number };
  const map = JSON.parse(
    readFileSync(
      join(__dirname, "../../../assets/map/love_island_map.json"),
      "utf8",
    ),
  ) as { layers: { name: string; objects?: Rect[] }[] };
  const rects =
    map.layers.find((layer) => layer.name === "Collision")?.objects ?? [];

  /** A Bumpkin's arcade body: 10x8, sitting 6px below the container. */
  const standsClear = ({ x, y }: { x: number; y: number }) => {
    const box = { l: x - 5, r: x + 5, t: y + 2, b: y + 10 };

    return !rects.some(
      (o) =>
        box.l < o.x + o.width &&
        box.r > o.x &&
        box.t < o.y + o.height &&
        box.b > o.y,
    );
  };

  it("puts every cast spot somewhere a Bumpkin can legally stand", () => {
    for (const spot of LOVE_KRAKEN_CAST_SPOTS) {
      expect({ ...spot, clear: standsClear(spot) }).toEqual({
        ...spot,
        clear: true,
      });
      expect(isLoveIslandTileWalkable(toLoveKrakenTile(spot))).toBe(true);
    }
  });

  it("puts every cast spot within reach of the Marvel", () => {
    for (const spot of LOVE_KRAKEN_CAST_SPOTS) {
      const away = Math.hypot(
        spot.x - LOVE_KRAKEN_SPOT.x,
        spot.y - LOVE_KRAKEN_SPOT.y,
      );

      expect({ ...spot, away: away <= LOVE_KRAKEN_REACH }).toEqual({
        ...spot,
        away: true,
      });
    }
  });

  it("spreads the spots out so a crowd is not stacked on one plank", () => {
    for (const a of LOVE_KRAKEN_CAST_SPOTS) {
      for (const b of LOVE_KRAKEN_CAST_SPOTS) {
        if (a === b) continue;
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(6);
      }
    }

    // ...and in y, not just along the wharf
    expect(
      new Set(LOVE_KRAKEN_CAST_SPOTS.map((s) => s.y)).size,
    ).toBeGreaterThan(2);
  });

  it("deals a spot across the whole list, and never off the end", () => {
    expect(getLoveKrakenCastSpot(0)).toEqual(LOVE_KRAKEN_CAST_SPOTS[0]);
    expect(getLoveKrakenCastSpot(0.999)).toEqual(
      LOVE_KRAKEN_CAST_SPOTS[LOVE_KRAKEN_CAST_SPOTS.length - 1],
    );
    // Math.random() can never return 1, but a caller could
    expect(getLoveKrakenCastSpot(1)).toEqual(
      LOVE_KRAKEN_CAST_SPOTS[LOVE_KRAKEN_CAST_SPOTS.length - 1],
    );
    expect(getLoveKrakenCastSpot(-1)).toEqual(LOVE_KRAKEN_CAST_SPOTS[0]);
  });

  it("round-trips a container position through its tile", () => {
    const tile = toLoveKrakenTile({ x: 344, y: 556 });
    const back = fromLoveKrakenTile(tile);

    expect(toLoveKrakenTile(back)).toEqual(tile);
  });

  it("walks from the island's path out to a spot on the wharf", () => {
    const spot = LOVE_KRAKEN_CAST_SPOTS[0];
    const route = getLoveKrakenWalkRoute({
      // On the main path east of the wharf
      from: { x: 470, y: 566 },
      to: spot,
    });

    expect(route).toBeDefined();
    expect(route?.[route.length - 1]).toEqual(spot);
  });

  /** The whole point of pathing rather than tweening in a straight line. */
  it("never routes a walk through water, a railing or a rock", () => {
    for (const from of [
      { x: 470, y: 566 }, // the path just east of the wharf
      { x: 620, y: 500 }, // the middle of the island
      { x: 615, y: 660 }, // the south of the island
      { x: 620, y: 470 }, // stood on a decorative tile, ground nearby
    ]) {
      const route = getLoveKrakenWalkRoute({
        from,
        to: LOVE_KRAKEN_CAST_SPOTS[4],
      });
      expect(route).toBeDefined();

      for (const step of route ?? []) {
        expect(isLoveIslandTileWalkable(toLoveKrakenTile(step))).toBe(true);
      }
    }
  });

  it("still walks someone already standing on the wharf to their own spot", () => {
    const route = getLoveKrakenWalkRoute({
      from: LOVE_KRAKEN_CAST_SPOTS[0],
      to: LOVE_KRAKEN_CAST_SPOTS[8],
    });

    expect(route).toBeDefined();
    expect(route?.[route.length - 1]).toEqual(LOVE_KRAKEN_CAST_SPOTS[8]);
  });

  it("steps straight across when the spot is on the tile already stood on", () => {
    const spot = LOVE_KRAKEN_CAST_SPOTS[0];
    const route = getLoveKrakenWalkRoute({
      from: { x: spot.x + 2, y: spot.y + 1 },
      to: spot,
    });

    expect(route).toEqual([spot]);
  });

  it("walks someone stood on a decorative tile, from the ground beside it", () => {
    const from = { x: 620, y: 470 };
    expect(isLoveIslandTileWalkable(toLoveKrakenTile(from))).toBe(false);

    const route = getLoveKrakenWalkRoute({
      from,
      to: LOVE_KRAKEN_CAST_SPOTS[0],
    });

    expect(route).toBeDefined();
    expect(route?.[route.length - 1]).toEqual(LOVE_KRAKEN_CAST_SPOTS[0]);
  });

  it("gives up rather than dragging someone across the island", () => {
    expect(
      getLoveKrakenWalkRoute({
        from: { x: 470, y: 566 },
        to: LOVE_KRAKEN_CAST_SPOTS[0],
        maxTiles: 2,
      }),
    ).toBeUndefined();
  });

  it("gives up when there is no way there at all", () => {
    // Out in the sky off the edge of the island
    expect(
      getLoveKrakenWalkRoute({
        from: { x: 40, y: 40 },
        to: LOVE_KRAKEN_CAST_SPOTS[0],
      }),
    ).toBeUndefined();
  });

  it("keeps the button clear of the wharf the anglers stand on", () => {
    // Above every spot, so it never sits behind a Bumpkin
    for (const spot of LOVE_KRAKEN_CAST_SPOTS) {
      expect(LOVE_KRAKEN_BUTTON.y).toBeLessThan(spot.y);
    }
  });
});

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
});

describe("loveKraken: a pull of the rod moves the zone either way", () => {
  const roundId = 42;

  /**
   * The exploit this closes: with the zone fixed until a hit, holding the
   * button down beat the game outright - every tap was free, so the marker
   * eventually wandered into a zone that had never moved.
   */
  it("moves the zone on a miss just as far as on a hit", () => {
    const before = getLoveKrakenRing({
      roundId,
      angler: angler({ attempts: 3, reels: 1 }),
    });
    const missed = pullLoveKrakenRod({
      angler: angler({ attempts: 3, reels: 1 }),
      ring: before,
      landed: false,
    });
    const after = getLoveKrakenRing({ roundId, angler: missed });

    const gap = Math.abs(after.zoneAngle - before.zoneAngle) % 360;
    expect(Math.min(gap, 360 - gap)).toBeGreaterThanOrEqual(90 - 1e-9);
  });

  it("counts a miss but scores nothing", () => {
    const missed = pullLoveKrakenRod({
      angler: angler({ attempts: 3, reels: 1 }),
      ring: freshRing(0, roundId),
      landed: false,
    });

    expect(missed.attempts).toEqual(4);
    expect(missed.reels).toEqual(1);
  });

  it("leaves the marker's leg alone on a miss", () => {
    const started = angler({
      attempts: 3,
      reels: 1,
      legStartAt: 1_000,
      legStartAngle: 200,
    });
    const missed = pullLoveKrakenRod({
      angler: started,
      ring: getLoveKrakenRing({ roundId, angler: started, now: 1_500 }),
      landed: false,
      now: 1_500,
    });

    expect(missed.legStartAt).toEqual(started.legStartAt);
    expect(missed.legStartAngle).toEqual(started.legStartAngle);
    // ...so the sweep runs on exactly as it was
    expect(
      getLoveKrakenRing({ roundId, angler: missed, now: 1_500 }).angle,
    ).toEqual(
      getLoveKrakenRing({ roundId, angler: started, now: 1_500 }).angle,
    );
  });

  it("re-anchors the leg on a hit, and only on a hit", () => {
    const started = angler({ attempts: 3, reels: 1 });
    const ring = getLoveKrakenRing({ roundId, angler: started, now: 1_500 });
    const hit = pullLoveKrakenRod({
      angler: started,
      ring,
      landed: true,
      now: 1_500,
    });

    expect(hit.attempts).toEqual(4);
    expect(hit.reels).toEqual(2);
    expect(hit.legStartAt).toEqual(1_500);
    expect(hit.legStartAngle).toEqual(ring.angle);
  });

  it("moves the zone at least a quarter turn on every pull", () => {
    let previous = getLoveKrakenZoneAngle({ roundId, attempts: 0 });

    for (let attempts = 1; attempts <= 40; attempts++) {
      const zone = getLoveKrakenZoneAngle({ roundId, attempts });
      const gap = Math.abs(zone - previous) % 360;

      expect(Math.min(gap, 360 - gap)).toBeGreaterThanOrEqual(90 - 1e-9);
      expect(zone).toBeGreaterThanOrEqual(0);
      expect(zone).toBeLessThan(360);
      previous = zone;
    }
  });

  it("reverses the spin on a hit, but not on a miss", () => {
    expect(getLoveKrakenSpin(0)).toEqual(1);
    expect(getLoveKrakenSpin(1)).toEqual(-1);
    expect(getLoveKrakenSpin(2)).toEqual(1);
    expect(getLoveKrakenSpin(3)).toEqual(-1);

    // Ten misses in a row: the spin is still whatever the reels say
    const missed = angler({ attempts: 10, reels: 0 });
    expect(getLoveKrakenRing({ roundId, angler: missed }).spin).toEqual(1);
  });

  it("winds the sweep up on a hit, but not on a miss", () => {
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

    const missed = angler({ attempts: 10, reels: 0 });
    expect(getLoveKrakenRing({ roundId, angler: missed }).ringMs).toEqual(
      LOVE_KRAKEN_RING_MS_MAX,
    );
  });

  it("treats a count below zero as a fresh line", () => {
    expect(getLoveKrakenZoneAngle({ roundId, attempts: -3 })).toEqual(0);
    expect(getLoveKrakenSpin(-3)).toEqual(1);
    expect(getLoveKrakenRingMs(-3)).toEqual(LOVE_KRAKEN_RING_MS_MAX);
  });

  it("gives different rounds different zone sequences", () => {
    expect(getLoveKrakenZoneAngle({ roundId: 1, attempts: 3 })).not.toEqual(
      getLoveKrakenZoneAngle({ roundId: 2, attempts: 3 }),
    );
  });

  it("makes spamming strictly worse than playing properly", () => {
    // A spammer pulls as fast as the cooldown allows, into a zone that is
    // somewhere new every time - they land the share of the ring it covers
    const cooldown = getLoveKrakenReelCooldownMs(RING);
    const chance = (LOVE_KRAKEN_ZONE_HALF_DEG * 2) / 360;
    const spamPerSec = chance / (cooldown / 1000);
    // An angler waiting for the marker lands one every half sweep
    const honestPerSec = 2000 / RING;

    expect(spamPerSec).toBeLessThan(honestPerSec);
  });
});

describe("loveKraken: the marker never jumps", () => {
  const roundId = 3;

  /**
   * The bug this guards: reading the phase as `now % ringMs` made the marker
   * snap back to the top the instant a reel changed the sweep. A leg starts
   * exactly where the marker had got to.
   */
  it("picks the new leg up exactly where the hit left the marker", () => {
    let state = angler();

    for (let hit = 0; hit < 8; hit++) {
      const hitAt = 10_000 + hit * 3_000;
      const before = getLoveKrakenRing({ roundId, angler: state, now: hitAt });

      state = pullLoveKrakenRod({
        angler: state,
        ring: before,
        landed: true,
        now: hitAt,
      });

      const after = getLoveKrakenRing({ roundId, angler: state, now: hitAt });
      expect(after.angle).toBeCloseTo(before.angle, 6);
    }
  });

  it("sweeps smoothly across a leg, with no step anywhere", () => {
    const legStartAt = 5_000;
    const state = angler({
      attempts: 9,
      reels: 7,
      legStartAt,
      legStartAngle: 123,
    });
    let previous = getLoveKrakenRing({
      roundId,
      angler: state,
      now: legStartAt,
    }).angle;

    for (let dt = 10; dt <= 4_000; dt += 10) {
      const { angle } = getLoveKrakenRing({
        roundId,
        angler: state,
        now: legStartAt + dt,
      });
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
      getLoveKrakenRing({
        roundId,
        angler: angler({
          attempts: reels,
          reels,
          legStartAt,
          legStartAngle: 0,
        }),
        now: legStartAt + dt,
      }).angle;

    // One reel in: anticlockwise, so the angle falls away from the start
    expect((at(1, 0) - at(1, 100) + 360) % 360).toBeGreaterThan(0);
    expect((at(1, 0) - at(1, 100) + 360) % 360).toBeLessThan(180);

    // Two reels in: clockwise again
    expect((at(2, 100) - at(2, 0) + 360) % 360).toBeGreaterThan(0);
    expect((at(2, 100) - at(2, 0) + 360) % 360).toBeLessThan(180);
  });

  it("keeps the angle in range however long the leg runs", () => {
    for (const dt of [0, 1_000, 60_000, 3_600_000]) {
      for (const reels of [1, 2, 9]) {
        const { angle } = getLoveKrakenRing({
          roundId,
          angler: angler({
            attempts: reels,
            reels,
            legStartAt: 0,
            legStartAngle: 40,
          }),
          now: dt,
        });

        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(360);
      }
    }
  });

  it("falls back to the epoch leg when there is no anchor yet", () => {
    // Misses alone never anchor a leg, so the sweep is still off the clock
    const now = RING / 4;
    const missed = angler({ attempts: 6, reels: 0 });

    expect(getLoveKrakenRing({ roundId, angler: missed, now }).angle).toEqual(
      90,
    );
  });

  it("never blocks a legitimate reel with the cooldown", () => {
    for (const ringMs of [LOVE_KRAKEN_RING_MS_MAX, LOVE_KRAKEN_RING_MS_MIN]) {
      const cooldown = getLoveKrakenReelCooldownMs(ringMs);
      // The zone can never land closer than a quarter turn ahead
      const soonestLegitimateMs = ringMs * LOVE_KRAKEN_ZONE_MIN_JUMP_SHARE;

      expect(cooldown).toBeLessThanOrEqual(Math.ceil(soonestLegitimateMs));
      // ...and it is still long enough to stop two landing on one pass
      expect(cooldown).toBeGreaterThan(
        (ringMs * (LOVE_KRAKEN_ZONE_HALF_DEG * 2)) / 360,
      );
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

describe("loveKraken: the kick on your own reel", () => {
  const landedAt = 1_000_000;
  const health = LOVE_KRAKEN_HEALTH;

  it("shows nothing when you have not reeled", () => {
    expect(
      getLoveKrakenReelKick({ landedAt: undefined, now: landedAt }),
    ).toEqual(0);
  });

  it("pops to the full slice the instant a reel lands", () => {
    expect(getLoveKrakenReelKick({ landedAt, now: landedAt })).toBeCloseTo(
      LOVE_KRAKEN_REEL_KICK_SHARE,
    );
  });

  it("eases back to nothing, and never goes negative", () => {
    let previous = Infinity;

    for (let dt = 0; dt <= LOVE_KRAKEN_REEL_KICK_MS + 500; dt += 25) {
      const kick = getLoveKrakenReelKick({ landedAt, now: landedAt + dt });

      expect(kick).toBeLessThanOrEqual(previous + 1e-9);
      expect(kick).toBeGreaterThanOrEqual(0);
      previous = kick;
    }

    expect(
      getLoveKrakenReelKick({
        landedAt,
        now: landedAt + LOVE_KRAKEN_REEL_KICK_MS,
      }),
    ).toEqual(0);
  });

  it("holds near the top for the first stretch, so it reads as a lurch", () => {
    // A quarter of the way through it is still worth over half the slice
    expect(
      getLoveKrakenReelKick({
        landedAt,
        now: landedAt + LOVE_KRAKEN_REEL_KICK_MS * 0.25,
      }),
    ).toBeGreaterThan(LOVE_KRAKEN_REEL_KICK_SHARE * 0.5);
  });

  it("ignores a reel that somehow landed in the future", () => {
    expect(getLoveKrakenReelKick({ landedAt, now: landedAt - 100 })).toEqual(0);
  });

  it("moves the bar for a lone angler, where the point alone cannot", () => {
    const progress = 400;
    // The real point is a fiftieth of a pixel on a 38px bar
    const real = getLoveKrakenBarShare({ progress, health, now: landedAt });
    const kicked = getLoveKrakenBarShare({
      progress,
      health,
      landedAt,
      now: landedAt,
    });

    expect(kicked - real).toBeCloseTo(LOVE_KRAKEN_REEL_KICK_SHARE);
    // ...which is worth a visible pixel or two of a 38px bar
    expect(Math.round(38 * kicked) - Math.round(38 * real)).toBeGreaterThan(0);
  });

  it("settles back to exactly where the island really is", () => {
    const progress = 400;

    expect(
      getLoveKrakenBarShare({
        progress,
        health,
        landedAt,
        now: landedAt + LOVE_KRAKEN_REEL_KICK_MS,
      }),
    ).toEqual(progress / health);
  });

  it("never overflows the end of the bar", () => {
    expect(
      getLoveKrakenBarShare({
        progress: health,
        health,
        landedAt,
        now: landedAt,
      }),
    ).toEqual(1);
  });

  it("never lets the bar run off the near end either", () => {
    expect(
      getLoveKrakenBarShare({ progress: -50, health, now: landedAt }),
    ).toEqual(0);
  });

  it("copes with a round that has no health at all", () => {
    expect(getLoveKrakenBarShare({ progress: 0, health: 0 })).toEqual(0);
  });

  it("is never added to the island's own progress", () => {
    // The kick is a lie told to one angler - the round is untouched
    const round = {
      ...createLoveKrakenLocalRound(landedAt),
      progress: 400,
    };
    const before = round.progress;

    getLoveKrakenBarShare({
      progress: round.progress,
      health: round.health,
      landedAt,
      now: landedAt,
    });

    expect(round.progress).toEqual(before);
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
