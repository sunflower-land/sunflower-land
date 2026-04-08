import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  fertiliseGreenhouse,
  FERTILISE_GREENHOUSE_ERRORS,
} from "./fertiliseGreenhouse";
import { plantGreenhouse } from "./plantGreenhouse";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { getReadyAt, getGreenhouseCropYieldAmount } from "./harvestGreenHouse";

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
