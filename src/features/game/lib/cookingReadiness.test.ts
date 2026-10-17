import {
  getCookingQueueReadyAts,
  pauseCookingQueue,
  resolveCookingQueue,
  getCookingOilAt,
  getCookingSpeedAt,
  settleCookingBuilding,
  convertCookingToLazyOil,
  consumeRemainingRecipeOil,
  resumeCookingBuilding,
} from "./cookingReadiness";
import { COOKING_BOOST_SPEED, getCookingBoostWindows } from "./boostWindows";
import { getExpiryCooldown } from "./collectibleBuilt";
import { TEST_FARM } from "./constants";
import type { BuildingProduct, GameState, PlacedItem } from "../types/game";

const HOUR = 60 * 60 * 1000;
const START = 1_000_000_000;

/** A farm with a Gourmet Hourglass placed at `createdAt` (2x cooking speed). */
const withHourglass = (createdAt: number): GameState =>
  ({
    ...TEST_FARM,
    collectibles: {
      ...TEST_FARM.collectibles,
      "Gourmet Hourglass": [
        { id: "1", coordinates: { x: 0, y: 0 }, createdAt, readyAt: createdAt },
      ],
    },
  }) as GameState;

describe("getCookingQueueReadyAts", () => {
  it("returns the stored readyAt for legacy recipes (no baseDurationMs)", () => {
    const crafting: BuildingProduct[] = [
      { name: "Boiled Eggs", readyAt: START + 3 * HOUR },
      { name: "Mashed Potato", readyAt: START + 5 * HOUR },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 3 * HOUR,
      START + 5 * HOUR,
    ]);
  });

  it("is startedAt + baseDurationMs when no boost window is active", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 4 * HOUR,
    ]);
  });

  it("chains each queued recipe off the previous recipe's DERIVED readyAt", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
      {
        name: "Mashed Potato",
        // Queued behind the head, so it carries NO startedAt - its start IS the
        // previous recipe's ready time, whatever that turns out to be.
        baseDurationMs: 2 * HOUR,
        readyAt: START + 6 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 4 * HOUR,
      START + 6 * HOUR,
    ]);
  });

  it("pulls the WHOLE queue forward when a boost covers it", () => {
    const game = withHourglass(START);
    // Sanity: the hourglass must outlast the whole (boosted) queue.
    expect(getExpiryCooldown("Gourmet Hourglass", game)).toBeGreaterThan(
      3 * HOUR,
    );

    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
      {
        name: "Mashed Potato",
        baseDurationMs: 2 * HOUR,
        readyAt: START + 6 * HOUR,
      },
    ];

    // 4h of work at 2x -> ready in 2h; the queued 2h of work at 2x -> +1h.
    expect(getCookingQueueReadyAts({ crafting, game })).toEqual([
      START + 2 * HOUR,
      START + 3 * HOUR,
    ]);
  });

  it("credits only the overlap when the boost expires mid-queue", () => {
    const cooldown = getExpiryCooldown("Gourmet Hourglass", TEST_FARM);
    // Hourglass placed 1h before the cook starts, so only its tail overlaps.
    const game = withHourglass(START - cooldown + 1 * HOUR);

    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
    ];

    // 1h boosted at 2x = 2h of work done; remaining 2h of work at 1x.
    expect(getCookingQueueReadyAts({ crafting, game })).toEqual([
      START + 3 * HOUR,
    ]);
  });

  it("chains a windowed recipe off a LEGACY recipe ahead of it", () => {
    const crafting: BuildingProduct[] = [
      { name: "Boiled Eggs", readyAt: START + 3 * HOUR },
      {
        name: "Mashed Potato",
        baseDurationMs: 2 * HOUR,
        readyAt: START + 5 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 3 * HOUR,
      START + 5 * HOUR,
    ]);
  });

  // A windowed recipe with neither an anchor nor a recipe ahead of it is malformed
  // state: its start was never recorded and cannot be recovered. The stored
  // `readyAt` is the last value the chain derived, so it is trusted AS IS rather
  // than reconstructed - see the two tests below for why reconstructing it is unsafe.
  it("keeps the stored readyAt when startedAt is missing and nothing is ahead", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 4 * HOUR,
    ]);
  });

  // Reconstructing the start as `readyAt - baseDurationMs` mixes units: it takes the
  // UNBOOSTED duration off an ALREADY BOOSTED ready time, inventing a start early
  // enough that the window gets applied a second time on top of itself.
  it("does not re-apply an active window to an unanchored head", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        baseDurationMs: 4 * HOUR,
        // Two hours of work left at 2x - what the chain last derived.
        readyAt: START + 2 * HOUR,
      },
    ];

    expect(
      getCookingQueueReadyAts({ crafting, game: withHourglass(START) }),
    ).toEqual([START + 2 * HOUR]);
  });

  // Every event that rewrites the queue writes the derived time back onto the
  // recipe, so a resolver that moved the time would move it again on every save.
  it("is a fixed point when the derived time is written back to the cache", () => {
    const game = withHourglass(START);
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        baseDurationMs: 4 * HOUR,
        readyAt: START + 2 * HOUR,
      },
    ];

    const first = getCookingQueueReadyAts({ crafting, game });
    const rewritten = crafting.map((recipe, index) => ({
      ...recipe,
      readyAt: first[index],
    }));

    expect(getCookingQueueReadyAts({ crafting: rewritten, game })).toEqual(
      first,
    );
  });

  it("keeps an already-ready uncollected recipe as the anchor for the queue", () => {
    const crafting: BuildingProduct[] = [
      // Finished an hour ago, still sitting uncollected at the head.
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 1 * HOUR,
        readyAt: START + 1 * HOUR,
      },
      {
        name: "Mashed Potato",
        baseDurationMs: 2 * HOUR,
        readyAt: START + 3 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 1 * HOUR,
      START + 3 * HOUR,
    ]);
  });

  // A recipe cooked after the building sat IDLE anchors on its own start, not on
  // when the previous recipe finished - otherwise the idle gap is credited as
  // progress and the recipe is born part-cooked.
  it("does not back-date a recipe cooked after an idle gap", () => {
    const crafting: BuildingProduct[] = [
      // Finished an hour ago and was collected... but a ready recipe left sitting
      // uncollected keeps the same shape.
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 1 * HOUR,
        readyAt: START + 1 * HOUR,
      },
      // Cooked an hour AFTER that one finished, with the building idle in between.
      {
        name: "Mashed Potato",
        startedAt: START + 2 * HOUR,
        baseDurationMs: 1 * HOUR,
        readyAt: START + 3 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 1 * HOUR,
      START + 3 * HOUR,
    ]);
  });

  it("returns an empty array for an empty queue", () => {
    expect(getCookingQueueReadyAts({ crafting: [], game: TEST_FARM })).toEqual(
      [],
    );
  });
});

describe("COOKING_BOOST_SPEED", () => {
  it("mirrors the legacy multipliers as their reciprocal speeds", () => {
    // x0.5 cook time == 2x speed; Boar Shrine's x0.8 == 1.25x.
    expect(COOKING_BOOST_SPEED["Gourmet Hourglass"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Super Totem"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Time Warp Totem"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Legendary Shrine"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Boar Shrine"]).toEqual(1.25);
  });
});

describe("pauseCookingQueue", () => {
  const MIN = 60 * 1000;
  const now = 1700000000000;

  it("does not credit pre-lift progress twice behind a completed legacy recipe", () => {
    // A legacy recipe keeps its wall-clock remainder, which for one that had
    // already FINISHED is a readyAt in the past. A windowed recipe chained to it
    // would otherwise derive a start before the placement and re-accrue the work
    // it had already banked.
    const legacyReadyAt = now - 50 * MIN;
    const removedAt = now - 30 * MIN;

    const crafting: BuildingProduct[] = [
      { id: "legacy", name: "Boiled Eggs", readyAt: legacyReadyAt },
      {
        id: "windowed",
        name: "Boiled Eggs",
        baseDurationMs: 60 * MIN,
        readyAt: 0,
      },
    ];

    pauseCookingQueue({ crafting, removedAt, placedAt: now, windows: [] });

    // It had banked 20m (legacyReadyAt -> removedAt), so 40m of work remains and
    // it resumes from the placement.
    expect(crafting[1].baseDurationMs).toEqual(40 * MIN);
    expect(crafting[1].startedAt).toEqual(now);
    expect(crafting[1].readyAt).toEqual(now + 40 * MIN);
  });

  it("leaves a recipe that had not started chained to the one ahead of it", () => {
    const removedAt = now - 30 * MIN;

    const crafting: BuildingProduct[] = [
      {
        id: "head",
        name: "Boiled Eggs",
        startedAt: now - 40 * MIN,
        baseDurationMs: 60 * MIN,
        readyAt: now + 20 * MIN,
      },
      { id: "tail", name: "Boiled Eggs", baseDurationMs: 30 * MIN, readyAt: 0 },
    ];

    pauseCookingQueue({ crafting, removedAt, placedAt: now, windows: [] });

    // The head banked 10m, so 50m left from the placement; the tail never began,
    // so it keeps chaining off whatever the head derives to.
    expect(crafting[0].readyAt).toEqual(now + 50 * MIN);
    expect(crafting[1].startedAt).toBeUndefined();
    expect(crafting[1].readyAt).toEqual(now + 80 * MIN);
  });
});

// ---------------------------------------------------------------------------
// Retroactive (lazy) oil
// ---------------------------------------------------------------------------

describe("lazy oil resolution", () => {
  // 1 oil per hour of base work -> a 10h recipe costs exactly 10 oil at full
  // coverage, which is the economy the slice-1 model charged.
  const OIL_PER_WORK_MS = 1 / HOUR;

  const lazyBuilding = (
    over: Partial<PlacedItem> & { oil: number; oilSettledAt: number },
  ): PlacedItem =>
    ({
      id: "1",
      coordinates: { x: 0, y: 0 },
      readyAt: 0,
      ...over,
    }) as PlacedItem;

  const recipe = (over: Partial<BuildingProduct>): BuildingProduct => ({
    name: "Boiled Eggs",
    baseDurationMs: 10 * HOUR,
    oilPercent: 0.2,
    oilPerWorkMs: OIL_PER_WORK_MS,
    readyAt: 0,
    ...over,
  });

  it("full tank => B*(1-p), identical to the slice-1 baked timing", () => {
    const crafting = [recipe({ startedAt: START })];
    const [readyAt] = resolveCookingQueue({
      crafting,
      windows: [],
      oil: { level: 10, settledAt: START },
    });
    // 10h of work, 20% oil => 8h.
    expect(readyAt).toEqual(START + 8 * HOUR);
  });

  it("partial tank => B*(1-f*p)", () => {
    const crafting = [recipe({ startedAt: START })];
    const [readyAt] = resolveCookingQueue({
      crafting,
      windows: [],
      // Half the oil => covers half the work (f=0.5) => 10h*(1-0.1)=9h.
      oil: { level: 5, settledAt: START },
    });
    expect(readyAt).toEqual(START + 9 * HOUR);
  });

  it("empty tank => no boost, full base duration", () => {
    const crafting = [recipe({ startedAt: START })];
    const [readyAt] = resolveCookingQueue({
      crafting,
      windows: [],
      oil: { level: 0, settledAt: START },
    });
    expect(readyAt).toEqual(START + 10 * HOUR);
  });

  it("composes with a boost window (full oil under a 2x hourglass)", () => {
    const crafting = [recipe({ startedAt: START })];
    const windows = getCookingBoostWindows(withHourglass(START));
    const [readyAt] = resolveCookingQueue({
      crafting,
      windows,
      oil: { level: 10, settledAt: START },
    });
    // Effective 8h of work at 2x => 4h. Same as slice-1 baking 8h then 2x.
    expect(readyAt).toEqual(START + 4 * HOUR);
  });

  it("shares one tank across the queue in order", () => {
    const crafting = [
      recipe({ startedAt: START }),
      recipe({}), // chained
    ];
    const readyAts = resolveCookingQueue({
      crafting,
      windows: [],
      // 15 oil: first recipe takes 10 (full), 5 left for the second (half).
      oil: { level: 15, settledAt: START },
    });
    // r1: 8h. r2 starts at +8h, half-covered => 9h => +17h.
    expect(readyAts).toEqual([START + 8 * HOUR, START + 17 * HOUR]);
  });

  it("draws nothing for a slice-1 baked recipe (no oilPerWorkMs)", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 8 * HOUR,
        readyAt: 0,
      },
      recipe({}),
    ];
    const readyAts = resolveCookingQueue({
      crafting,
      windows: [],
      oil: { level: 10, settledAt: START },
    });
    // The baked recipe passes the whole tank to the lazy one behind it.
    expect(readyAts).toEqual([START + 8 * HOUR, START + 16 * HOUR]);
  });

  describe("getCookingOilAt", () => {
    it("drains per unit of covered work", () => {
      const building = lazyBuilding({
        oil: 15,
        oilSettledAt: START,
        crafting: [recipe({ startedAt: START })],
      });
      // At +4h (no window), running at 1.25x => 5h of base work done => 5 oil.
      expect(
        getCookingOilAt({ building, windows: [], at: START + 4 * HOUR }),
      ).toEqual(15 - 5);
    });

    it("stops draining once the recipe's covered work is done", () => {
      const building = lazyBuilding({
        oil: 15,
        oilSettledAt: START,
        crafting: [recipe({ startedAt: START })],
      });
      // Fully cooked (>= 8h) => burned exactly its 10 oil, then holds.
      expect(
        getCookingOilAt({ building, windows: [], at: START + 100 * HOUR }),
      ).toEqual(15 - 10);
    });
  });

  describe("getCookingSpeedAt", () => {
    it("is 1/(1-p) while oil covers the cook, 1 after it runs dry", () => {
      const building = lazyBuilding({
        oil: 5, // covers 5h of work
        oilSettledAt: START,
        crafting: [recipe({ startedAt: START })],
      });
      // In the covered phase: 1/0.8 = 1.25.
      expect(
        getCookingSpeedAt({ building, windows: [], at: START + 1 * HOUR }),
      ).toBeCloseTo(1.25);
      // Past the covered work (5h base done by 5h wall clock at 1.25x -> covered
      // ends at 4h wall clock), back to 1x.
      expect(
        getCookingSpeedAt({ building, windows: [], at: START + 6 * HOUR }),
      ).toEqual(1);
    });
  });

  describe("settleCookingBuilding", () => {
    it("is behaviour-neutral: the future timeline is unchanged", () => {
      const crafting = [recipe({ startedAt: START }), recipe({})];
      const building = lazyBuilding({ oil: 15, oilSettledAt: START, crafting });

      const before = resolveCookingQueue({
        crafting,
        windows: [],
        oil: { level: 15, settledAt: START },
      });

      settleCookingBuilding({ building, windows: [], now: START + 3 * HOUR });

      const after = resolveCookingQueue({
        crafting: building.crafting!,
        windows: [],
        oil: { level: building.oil!, settledAt: building.oilSettledAt! },
      });

      expect(after).toEqual(before);
    });

    it("is a no-op when now is before the anchor (monotonic)", () => {
      const crafting = [recipe({ startedAt: START })];
      const building = lazyBuilding({ oil: 10, oilSettledAt: START, crafting });
      settleCookingBuilding({ building, windows: [], now: START - HOUR });
      expect(building.oilSettledAt).toEqual(START);
      expect(building.oil).toEqual(10);
    });

    it("burns the oil consumed and advances the anchor", () => {
      const crafting = [recipe({ startedAt: START })];
      const building = lazyBuilding({ oil: 15, oilSettledAt: START, crafting });
      settleCookingBuilding({ building, windows: [], now: START + 4 * HOUR });
      // 5h of base work done at 1.25x => 5 oil burned.
      expect(building.oil).toEqual(10);
      expect(building.oilSettledAt).toEqual(START + 4 * HOUR);
    });
  });

  describe("consumeRemainingRecipeOil", () => {
    it("removes the oil the recipe would still have drawn", () => {
      const r = recipe({ startedAt: START });
      const building = lazyBuilding({
        oil: 10,
        oilSettledAt: START,
        crafting: [r],
      });
      consumeRemainingRecipeOil({ building, recipe: r });
      // Nothing cooked yet: the full 10 oil is claimed.
      expect(building.oil).toEqual(0);
    });
  });

  describe("convertCookingToLazyOil", () => {
    it("stamps oilSettledAt and leaves the tank untouched", () => {
      const building = lazyBuilding({
        oil: 7,
        oilSettledAt: undefined as never,
      });
      delete (building as PlacedItem).oilSettledAt;
      convertCookingToLazyOil({ building, now: START });
      expect(building.oilSettledAt).toEqual(START);
      expect(building.oil).toEqual(7);
    });

    it("is idempotent", () => {
      const building = lazyBuilding({ oil: 7, oilSettledAt: START });
      convertCookingToLazyOil({ building, now: START + HOUR });
      expect(building.oilSettledAt).toEqual(START);
    });
  });

  describe("resumeCookingBuilding", () => {
    it("shifts the anchor and started recipes across the downtime", () => {
      const r = recipe({ startedAt: START });
      const building = lazyBuilding({
        oil: 10,
        oilSettledAt: START,
        crafting: [r],
      });
      // Settled at the lift (2h in), then placed back 3h later.
      settleCookingBuilding({ building, windows: [], now: START + 2 * HOUR });
      const remaining = building.crafting![0].baseDurationMs!;
      resumeCookingBuilding({
        building,
        windows: [],
        removedAt: START + 2 * HOUR,
        placedAt: START + 5 * HOUR,
      });
      expect(building.oilSettledAt).toEqual(START + 5 * HOUR);
      expect(building.crafting![0].startedAt).toEqual(START + 5 * HOUR);
      // Remaining work is unchanged by the lift; it just resumes later.
      expect(building.crafting![0].baseDurationMs).toEqual(remaining);
    });
  });
});
