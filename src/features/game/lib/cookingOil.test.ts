import {
  COOKING_OIL_CAPACITY,
  COOKING_OIL_CLOCK_RATE,
  COOKING_OIL_RATE,
  getCookingOilAt,
  resolveCookingQueueTimings,
  settleCookingBuilding,
  type CookingOil,
} from "./cookingReadiness";
import type { BuildingProduct, PlacedItem } from "../types/game";
import { BUILDING_DAILY_OIL_CONSUMPTION } from "../events/landExpansion/cook";
import { BUILDING_DAILY_OIL_CAPACITY } from "../events/landExpansion/supplyCookingOil";

const HOUR = 60 * 60 * 1000;
const START = 1_000_000_000;

// The Deli is the round one: 12 oil per day of cooking WORK, the same as a dish
// has always cost, and its default 40% oil boost is a 5/3x speed. Unboosted, that
// burns 20 oil per real day; other boosts speed the burn up but not the cost.
const DELI = 0.4;
const deliOil = (tank: number, settledAt = START): CookingOil => ({
  tank,
  settledAt,
  ratePerDay: COOKING_OIL_RATE.Deli,
  clockRatePerDay: COOKING_OIL_CLOCK_RATE.Deli,
});

// A recipe that draws oil carries the rate `cook` snapshots for it; pass
// `oilRate: undefined` for one cooked before that snapshot existed.
const recipe = (fields: Partial<BuildingProduct>): BuildingProduct => ({
  name: "Fermented Fish",
  readyAt: 0,
  ...(fields.oilBoost !== undefined ? { oilRate: COOKING_OIL_RATE.Deli } : {}),
  ...fields,
});

describe("cooking oil rates", () => {
  it("burns the same oil per day of cooking work as a recipe always cost", () => {
    expect(COOKING_OIL_RATE).toEqual(BUILDING_DAILY_OIL_CONSUMPTION);
  });

  it("holds the same tank as before", () => {
    expect(COOKING_OIL_CAPACITY).toEqual(BUILDING_DAILY_OIL_CAPACITY);
  });
});

describe("resolveCookingQueueTimings with oil", () => {
  it("speeds a recipe up by 1 / (1 - boost) while the tank lasts", () => {
    const timings = resolveCookingQueueTimings({
      crafting: [
        recipe({ startedAt: START, baseDurationMs: 10 * HOUR, oilBoost: DELI }),
      ],
      windows: [],
      oil: deliOil(20),
    });

    expect(timings[0].readyAt).toEqual(START + 6 * HOUR);
  });

  it("burns oil as the recipe cooks, and only while it cooks", () => {
    const crafting = [
      recipe({ startedAt: START, baseDurationMs: 10 * HOUR, oilBoost: DELI }),
    ];
    const oil = deliOil(20);

    // 6 hours of cooking at 5/3x is 10 hours of work, 5 oil at 12 a day of work;
    // afterwards the tank stops draining.
    expect(
      getCookingOilAt({ crafting, windows: [], oil, at: START + 3 * HOUR }),
    ).toBeCloseTo(17.5);
    expect(
      getCookingOilAt({ crafting, windows: [], oil, at: START + 6 * HOUR }),
    ).toBeCloseTo(15);
    expect(
      getCookingOilAt({ crafting, windows: [], oil, at: START + 48 * HOUR }),
    ).toBeCloseTo(15);
  });

  it("finishes the rest of a recipe at normal speed once the tank runs dry", () => {
    const crafting = [
      recipe({ startedAt: START, baseDurationMs: 24 * HOUR, oilBoost: DELI }),
    ];
    const oil = deliOil(5); // 10 hours of work, done in 6 hours

    const timings = resolveCookingQueueTimings({ crafting, windows: [], oil });

    expect(timings[0].readyAt).toEqual(START + 20 * HOUR);
    expect(
      getCookingOilAt({ crafting, windows: [], oil, at: START + 12 * HOUR }),
    ).toEqual(0);
  });

  it("burns the tank in queue order", () => {
    const timings = resolveCookingQueueTimings({
      crafting: [
        recipe({ startedAt: START, baseDurationMs: 6 * HOUR, oilBoost: DELI }),
        recipe({ baseDurationMs: 10 * HOUR, oilBoost: DELI }),
      ],
      windows: [],
      oil: deliOil(5),
    });

    // The head takes 3.6h of the 6h of oil; the 2.4h left does 4h of the tail's
    // work and the other 6h cook at normal speed.
    expect(timings[0].readyAt).toEqual(START + 3.6 * HOUR);
    expect(timings[1].readyAt).toEqual(START + 12 * HOUR);
  });

  it("does not drain while the building sits idle between recipes", () => {
    const crafting = [
      recipe({ startedAt: START, baseDurationMs: 6 * HOUR, oilBoost: DELI }),
      recipe({
        startedAt: START + 10 * HOUR,
        baseDurationMs: 6 * HOUR,
        oilBoost: DELI,
      }),
    ];
    const oil = deliOil(20);

    expect(
      getCookingOilAt({ crafting, windows: [], oil, at: START + 8 * HOUR }),
    ).toBeCloseTo(17);
    expect(
      resolveCookingQueueTimings({ crafting, windows: [], oil })[1].readyAt,
    ).toEqual(START + 13.6 * HOUR);
  });

  it("stacks with a boost window, and a dish still costs the same oil", () => {
    const crafting = [
      recipe({ startedAt: START, baseDurationMs: 10 * HOUR, oilBoost: DELI }),
    ];
    const totem = [{ from: START, to: START + 100 * HOUR, speed: 2 }];

    const boosted = resolveCookingQueueTimings({
      crafting,
      windows: totem,
      oil: deliOil(20),
    })[0].readyAt;

    expect(boosted).toEqual(START + 3 * HOUR);

    const burned = (windows: typeof totem) =>
      20 -
      getCookingOilAt({
        crafting,
        windows,
        oil: deliOil(20),
        at: START + 48 * HOUR,
      });

    // 10 hours of work at 12 a day, with or without the totem.
    expect(burned([])).toBeCloseTo(5);
    expect(burned(totem)).toBeCloseTo(5);
  });

  it("runs dry sooner under a boost, after the same work", () => {
    const crafting = [
      recipe({ startedAt: START, baseDurationMs: 10 * HOUR, oilBoost: DELI }),
    ];
    const totem = [{ from: START, to: START + 100 * HOUR, speed: 2 }];
    const oil = deliOil(2.5); // 5 hours of work

    // 5h of work at 2 x 5/3 takes 1.5h; the other 5h at 2x takes 2.5h.
    const [timing] = resolveCookingQueueTimings({
      crafting,
      windows: totem,
      oil,
    });
    expect(timing.oilWindow?.to).toEqual(START + 1.5 * HOUR);
    expect(timing.readyAt).toEqual(START + 4 * HOUR);
    expect(
      getCookingOilAt({ crafting, windows: totem, oil, at: START + HOUR }),
      // An hour at 2 x 5/3 is 10/3 hours of work.
    ).toBeCloseTo(2.5 - (10 / 3 / 24) * 12);
  });

  it("charges a recipe at the oil rate it was cooked with", () => {
    // A permanent boost cut this recipe's work to 9h, so its rate makes up the
    // difference and the dish still costs the 5 oil of its 10h base time.
    const crafting = [
      recipe({
        startedAt: START,
        baseDurationMs: 9 * HOUR,
        oilBoost: DELI,
        oilRate: (12 * 10) / 9,
      }),
    ];

    expect(
      getCookingOilAt({
        crafting,
        windows: [],
        oil: deliOil(20),
        at: START + 48 * HOUR,
      }),
    ).toBeCloseTo(15);
  });

  it("keeps a dish cooked before its oil rate on the old clock burn", () => {
    // Queued before the work burn: its oil keeps burning by the clock at the old
    // 20 a real day, so its timing is what it was when it was cooked.
    const crafting = [
      recipe({
        startedAt: START,
        baseDurationMs: 10 * HOUR,
        oilBoost: DELI,
        oilRate: undefined,
      }),
    ];
    const totem = [{ from: START, to: START + 100 * HOUR, speed: 2 }];

    // 10h of work at 2 x 5/3 takes 3h, which burns 3h of oil at 20 a day.
    expect(
      resolveCookingQueueTimings({
        crafting,
        windows: totem,
        oil: deliOil(20),
      })[0].readyAt,
    ).toEqual(START + 3 * HOUR);
    expect(
      getCookingOilAt({
        crafting,
        windows: totem,
        oil: deliOil(20),
        at: START + 48 * HOUR,
      }),
    ).toBeCloseTo(20 - 2.5);
  });

  it("draws nothing for a recipe with no work to do", () => {
    const crafting = [
      recipe({
        startedAt: START,
        baseDurationMs: 0,
        oilBoost: DELI,
        oilRate: Number.NaN,
      }),
    ];
    const [timing] = resolveCookingQueueTimings({
      crafting,
      windows: [],
      oil: deliOil(20),
    });

    expect(timing.readyAt).toEqual(START);
    expect(timing.oilWindow).toBeUndefined();
    expect(
      getCookingOilAt({ crafting, windows: [], oil: deliOil(20), at: START }),
    ).toEqual(20);
  });

  it("draws nothing for legacy or pre-paid recipes", () => {
    const crafting = [
      // Legacy: oil deducted and baked in when it was queued.
      recipe({ readyAt: START + 2 * HOUR }),
      // Windowed but queued before clock drain: its oil is baked into the duration.
      recipe({ baseDurationMs: 2 * HOUR }),
      recipe({ baseDurationMs: 6 * HOUR, oilBoost: DELI }),
    ];
    const oil = deliOil(20);

    const timings = resolveCookingQueueTimings({ crafting, windows: [], oil });

    expect(timings.map((timing) => timing.readyAt)).toEqual([
      START + 2 * HOUR,
      START + 4 * HOUR,
      START + 7.6 * HOUR,
    ]);
    expect(
      getCookingOilAt({ crafting, windows: [], oil, at: START + 48 * HOUR }),
    ).toBeCloseTo(17);
  });

  it("ignores the oil boost on a building that is not on clock drain", () => {
    const timings = resolveCookingQueueTimings({
      crafting: [
        recipe({ startedAt: START, baseDurationMs: 10 * HOUR, oilBoost: DELI }),
      ],
      windows: [],
    });

    expect(timings[0].readyAt).toEqual(START + 10 * HOUR);
  });

  it("only spends oil from the moment the tank was settled", () => {
    const timings = resolveCookingQueueTimings({
      crafting: [
        recipe({ startedAt: START, baseDurationMs: 10 * HOUR, oilBoost: DELI }),
      ],
      windows: [],
      oil: deliOil(20, START + 2 * HOUR),
    });

    // 2h of work at normal speed, then 8h of work at 5/3x.
    expect(timings[0].readyAt).toEqual(START + 6.8 * HOUR);
  });
});

describe("settleCookingBuilding", () => {
  const deli = (): PlacedItem => ({
    id: "deli",
    coordinates: { x: 0, y: 0 },
    oil: 10, // 12 hours of oil
    oilSettledAt: START,
    crafting: [
      recipe({
        id: "a",
        startedAt: START,
        baseDurationMs: 10 * HOUR,
        oilBoost: DELI,
      }),
      recipe({ id: "b", baseDurationMs: 24 * HOUR, oilBoost: DELI }),
    ],
  });

  const project = (building: PlacedItem, at: number) => {
    const oil = deliOil(building.oil ?? 0, building.oilSettledAt ?? 0);
    const crafting = building.crafting ?? [];
    return {
      readyAts: resolveCookingQueueTimings({ crafting, windows: [], oil }).map(
        (timing) => timing.readyAt,
      ),
      oil: getCookingOilAt({ crafting, windows: [], oil, at }),
    };
  };

  it("changes nothing a player can see", () => {
    const building = deli();
    const before = project(building, START + 20 * HOUR);

    settleCookingBuilding({
      building,
      buildingName: "Deli",
      at: START + 8 * HOUR,
      windows: [],
    });

    // a: 6h on oil. b: the last 6h of oil does 10h of work, 14h left at 1x.
    expect(before.readyAts).toEqual([START + 6 * HOUR, START + 26 * HOUR]);
    const after = project(building, START + 20 * HOUR);
    expect(after.readyAts).toEqual(before.readyAts);
    expect(after.oil).toBeCloseTo(before.oil);
  });

  it("banks the work done, burns the oil used and moves the anchor", () => {
    const building = deli();

    settleCookingBuilding({
      building,
      buildingName: "Deli",
      at: START + 8 * HOUR,
      windows: [],
    });

    const [a, b] = building.crafting ?? [];
    // a finished at 6h and stays finished there.
    expect(a.startedAt).toEqual(START + 6 * HOUR);
    expect(a.baseDurationMs).toEqual(0);
    // b has cooked 2h on oil, which is 3h20m of its 24h.
    expect(b.startedAt).toEqual(START + 8 * HOUR);
    expect(b.baseDurationMs).toBeCloseTo(24 * HOUR - (2 * HOUR) / (1 - DELI));
    expect(b.readyAt).toEqual(START + 26 * HOUR);
    // 8h of cooking at 20/day.
    expect(building.oil).toBeCloseTo(10 - 20 / 3);
    expect(building.oilSettledAt).toEqual(START + 8 * HOUR);
  });

  it("burns a recipe's own oil rate when it settles", () => {
    const building: PlacedItem = {
      id: "deli",
      coordinates: { x: 0, y: 0 },
      oil: 20,
      oilSettledAt: START,
      crafting: [
        recipe({
          startedAt: START,
          baseDurationMs: 10 * HOUR,
          oilBoost: DELI,
          oilRate: 24,
        }),
      ],
    };

    settleCookingBuilding({
      building,
      buildingName: "Deli",
      at: START + 3 * HOUR,
      windows: [],
    });

    // 3h at 5/3x is 5h of work, 5 oil at 24 a day of work.
    expect(building.oil).toBeCloseTo(15);
    expect(building.crafting?.[0].baseDurationMs).toBeCloseTo(5 * HOUR);
  });

  it("is idempotent", () => {
    const building = deli();
    const settle = () =>
      settleCookingBuilding({
        building,
        buildingName: "Deli",
        at: START + 8 * HOUR,
        windows: [],
      });

    settle();
    const once = JSON.parse(JSON.stringify(building));
    settle();

    expect(building).toEqual(once);
  });

  it("never moves the anchor backwards", () => {
    const building = deli();
    settleCookingBuilding({
      building,
      buildingName: "Deli",
      at: START + 8 * HOUR,
      windows: [],
    });
    const settled = JSON.parse(JSON.stringify(building));

    settleCookingBuilding({
      building,
      buildingName: "Deli",
      at: START + 5 * HOUR,
      windows: [],
    });

    expect(building).toEqual(settled);
  });

  it("neither cooks nor burns oil between a lift and the placement", () => {
    const building = deli();

    settleCookingBuilding({
      building,
      buildingName: "Deli",
      at: START + 8 * HOUR,
      resumeAt: START + 20 * HOUR,
      windows: [],
    });

    // b resumes at 20h with 20h40m of work and 4h of oil: the oil does 6h40m,
    // leaving 14h at normal speed.
    expect(building.oilSettledAt).toEqual(START + 20 * HOUR);
    expect(building.crafting?.[1].readyAt).toEqual(START + 38 * HOUR);
    expect(project(building, START + 20 * HOUR).oil).toBeCloseTo(10 - 20 / 3);
  });

  it("shifts a legacy recipe by the downtime of a lift", () => {
    const building: PlacedItem = {
      id: "deli",
      coordinates: { x: 0, y: 0 },
      oil: 0,
      oilSettledAt: START,
      crafting: [recipe({ readyAt: START + 10 * HOUR })],
    };

    settleCookingBuilding({
      building,
      buildingName: "Deli",
      at: START + 4 * HOUR,
      resumeAt: START + 7 * HOUR,
      windows: [],
    });

    expect(building.crafting?.[0].readyAt).toEqual(START + 13 * HOUR);
  });
});
