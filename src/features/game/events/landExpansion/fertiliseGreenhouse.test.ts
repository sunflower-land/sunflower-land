import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  fertiliseGreenhouse,
  FERTILISE_GREENHOUSE_ERRORS,
} from "./fertiliseGreenhouse";
import { plantGreenhouse } from "./plantGreenhouse";
import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { getGreenhouseCropYieldAmount } from "./harvestGreenHouse";
import { GREENHOUSE_CROP_TIME_SECONDS } from "features/game/lib/greenhouseGrowTimes";
import { getGreenhouseReadyAt } from "./greenhouseReadiness";
import { CONFIG } from "lib/config";

// Pin the legacy (mainnet, SPEED_BOOSTS off) behaviour for this file's existing
// tests — jest runs on amoy where the flag is ON. The windowed model is covered
// in the dedicated SPEED_BOOSTS describes.
const originalNetwork = CONFIG.NETWORK;
beforeAll(() => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
});
afterAll(() => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
});

// Legacy base-time readiness (plantedAt + base grow duration) for these
// mainnet-pinned tests; the windowed model derives it via getGreenhouseReadyAt.
const getReadyAt = ({
  plant,
  createdAt,
}: {
  plant: keyof typeof GREENHOUSE_CROP_TIME_SECONDS;
  createdAt: number;
}) => createdAt + GREENHOUSE_CROP_TIME_SECONDS[plant] * 1000;

const farm: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

const placedGreenhouse = (extra: Partial<GameState> = {}): GameState => ({
  ...farm,
  buildings: {
    Greenhouse: [
      {
        coordinates: { x: 0, y: 0 },
        id: "1",
        createdAt: 0,
        readyAt: 0,
      },
    ],
  },
  greenhouse: {
    oil: 50,
    pots: {},
  },
  inventory: {
    "Rice Seed": new Decimal(5),
    "Greenhouse Glow": new Decimal(3),
    "Greenhouse Goodie": new Decimal(3),
  },
  ...extra,
});

describe("fertiliseGreenhouse", () => {
  it("applies Greenhouse Goodie to an empty pot", () => {
    const state = fertiliseGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Goodie",
      },
      createdAt: Date.now(),
    });

    expect(state.greenhouse.pots[1].fertiliser?.name).toEqual(
      "Greenhouse Goodie",
    );
    expect(state.inventory["Greenhouse Goodie"]?.toNumber()).toEqual(2);
  });

  it("preserves fertiliser when planting after empty-pot Goodie", () => {
    let state = fertiliseGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Goodie",
      },
      createdAt: 1,
    });

    state = plantGreenhouse({
      state,
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      createdAt: 2,
    });

    expect(state.greenhouse.pots[1].fertiliser?.name).toEqual(
      "Greenhouse Goodie",
    );
    expect(state.greenhouse.pots[1].plant?.name).toEqual("Rice");
  });

  it("applies Greenhouse Glow on empty pot then shortens grow time when planting", () => {
    const tPlant = 10_000;
    let state = fertiliseGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Glow",
      },
      createdAt: 1,
    });

    state = plantGreenhouse({
      state,
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      createdAt: tPlant,
    });

    const readyGlow = getReadyAt({
      plant: "Rice",
      createdAt: state.greenhouse.pots[1].plant!.plantedAt,
    });
    const noGlowState = plantGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.planted",
        id: 2,
        seed: "Rice Seed",
      },
      createdAt: tPlant,
    });
    const readyNoGlow = getReadyAt({
      plant: "Rice",
      createdAt: noGlowState.greenhouse.pots[2].plant!.plantedAt,
    });

    const durGlow = readyGlow - tPlant;
    const durNoGlow = readyNoGlow - tPlant;
    expect(durGlow).toBeLessThan(durNoGlow);
    expect(durGlow / durNoGlow).toBeCloseTo(0.8, 5);
  });

  it("shifts plantedAt when applying Greenhouse Glow mid-grow", () => {
    const t0 = 5_000_000_000_000;
    let state = plantGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      createdAt: t0,
    });

    const plantedAt = state.greenhouse.pots[1].plant!.plantedAt;
    const readyAt = getReadyAt({ plant: "Rice", createdAt: plantedAt });
    const fertiliseAt = plantedAt + (readyAt - plantedAt) / 2;

    state = fertiliseGreenhouse({
      state,
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Glow",
      },
      createdAt: fertiliseAt,
    });

    const expectedReduction = (readyAt - fertiliseAt) * 0.2;
    expect(state.greenhouse.pots[1].plant!.plantedAt).toEqual(
      plantedAt - expectedReduction,
    );
    expect(state.greenhouse.pots[1].fertiliser?.name).toEqual(
      "Greenhouse Glow",
    );
  });

  it("adds yield from Greenhouse Goodie on harvest path", () => {
    const { amount, boostsUsed } = getGreenhouseCropYieldAmount({
      crop: "Rice",
      game: placedGreenhouse(),
      createdAt: Date.now(),
      prngArgs: { farmId: 1, counter: 0 },
      fertiliser: "Greenhouse Goodie",
    });

    const base = getGreenhouseCropYieldAmount({
      crop: "Rice",
      game: placedGreenhouse(),
      createdAt: Date.now(),
      prngArgs: { farmId: 1, counter: 0 },
    });

    expect(amount).toBeCloseTo(base.amount + 0.2, 5);
    expect(boostsUsed.some((b) => b.name === "Greenhouse Goodie")).toBe(true);
  });

  it("throws if pot already fertilised", () => {
    const state = fertiliseGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Glow",
      },
      createdAt: 1,
    });

    expect(() =>
      fertiliseGreenhouse({
        state,
        action: {
          type: "greenhouse.fertilised",
          id: 1,
          fertiliser: "Greenhouse Goodie",
        },
        createdAt: 2,
      }),
    ).toThrow(FERTILISE_GREENHOUSE_ERRORS.GREENHOUSE_ALREADY_FERTILISED);
  });

  it("throws if plant is ready to harvest", () => {
    const t0 = 8_000_000_000_000;
    const state = plantGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      createdAt: t0,
    });

    const plantedAt = state.greenhouse.pots[1].plant!.plantedAt;
    const harvestTime = getReadyAt({ plant: "Rice", createdAt: plantedAt });

    expect(() =>
      fertiliseGreenhouse({
        state,
        action: {
          type: "greenhouse.fertilised",
          id: 1,
          fertiliser: "Greenhouse Glow",
        },
        createdAt: harvestTime,
      }),
    ).toThrow(FERTILISE_GREENHOUSE_ERRORS.READY_TO_HARVEST);
  });

  it("throws if not enough fertiliser", () => {
    expect(() =>
      fertiliseGreenhouse({
        state: placedGreenhouse({
          inventory: { "Greenhouse Glow": new Decimal(0) },
        }),
        action: {
          type: "greenhouse.fertilised",
          id: 1,
          fertiliser: "Greenhouse Glow",
        },
        createdAt: 1,
      }),
    ).toThrow(FERTILISE_GREENHOUSE_ERRORS.NOT_ENOUGH_FERTILISER);
  });
});

describe("fertiliseGreenhouse under SPEED_BOOSTS (windowed)", () => {
  beforeAll(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterAll(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const plantRice = (state: GameState, createdAt: number): GameState =>
    plantGreenhouse({
      state,
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      createdAt,
    });

  it("applies Greenhouse Glow mid-grow with NO plant mutation", () => {
    const t0 = Date.now();
    const base = GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000;
    let state = plantRice(placedGreenhouse(), t0);
    const before = { ...state.greenhouse.pots[1].plant! };

    state = fertiliseGreenhouse({
      state,
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Glow",
      },
      createdAt: t0 + base / 2,
    });

    // Unlike the legacy back-date, the windowed plant is untouched…
    expect(state.greenhouse.pots[1].plant).toEqual(before);
    // …and readiness moves earlier purely via the pot's open-ended window:
    // half the grow at 1×, the remaining half at 1.25×.
    expect(
      getGreenhouseReadyAt(
        state.greenhouse.pots[1].plant!,
        state,
        state.greenhouse.pots[1].fertiliser,
      ),
    ).toEqual(t0 + base / 2 + base / 2 / 1.25);
  });

  it("keeps the whole grow boosted when the pot was fertilised before planting", () => {
    const t0 = Date.now();
    const base = GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000;
    let state = fertiliseGreenhouse({
      state: placedGreenhouse(),
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Glow",
      },
      createdAt: t0,
    });
    state = plantRice(state, t0 + 1000);

    expect(
      getGreenhouseReadyAt(
        state.greenhouse.pots[1].plant!,
        state,
        state.greenhouse.pots[1].fertiliser,
      ),
    ).toEqual(t0 + 1000 + base / 1.25);
  });

  it("throws READY_TO_HARVEST when a boost already made the windowed plant ready", () => {
    const t0 = Date.now();
    const base = GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000;
    const state = plantRice(
      {
        ...placedGreenhouse(),
        collectibles: {
          "Tortoise Shrine": [
            {
              id: "1",
              createdAt: t0,
              coordinates: { x: 0, y: 0 },
              readyAt: t0,
            },
          ],
        },
      },
      t0,
    );

    // Ready by the windowed clock (1.5×) even though the base grow time has
    // not elapsed — the guard must use windowed readiness.
    expect(() =>
      fertiliseGreenhouse({
        state,
        action: {
          type: "greenhouse.fertilised",
          id: 1,
          fertiliser: "Greenhouse Goodie",
        },
        createdAt: t0 + base / 1.5,
      }),
    ).toThrow(FERTILISE_GREENHOUSE_ERRORS.READY_TO_HARVEST);
  });
});
