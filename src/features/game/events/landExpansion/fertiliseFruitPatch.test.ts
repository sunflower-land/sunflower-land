import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState, PlantedFruit } from "features/game/types/game";
import {
  FERTILISE_FRUIT_ERRORS,
  fertiliseFruitPatch,
} from "./fertiliseFruitPatch";
import { PATCH_FRUIT_SEEDS } from "features/game/types/fruits";
import { getFruitReadyAt } from "./fruitPatchReadiness";
import { CONFIG } from "lib/config";

const dateNow = Date.now();
const appleMs = PATCH_FRUIT_SEEDS["Apple Seed"].plantSeconds * 1000;

const baseGame: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  inventory: {
    "Fruitful Blend": new Decimal(5),
    "Turbofruit Mix": new Decimal(5),
  },
};

const withPatch = (
  fruit: PlantedFruit | undefined,
  extra: Partial<GameState["fruitPatches"][string]> = {},
): GameState => ({
  ...baseGame,
  fruitPatches: {
    0: {
      createdAt: dateNow,
      x: -2,
      y: 0,
      ...(fruit ? { fruit } : {}),
      ...extra,
    },
  },
});

describe("fertiliseFruitPatch", () => {
  it("throws on a non-existent patch", () => {
    expect(() =>
      fertiliseFruitPatch({
        state: baseGame,
        action: {
          type: "fruitPatch.fertilised",
          patchID: "999",
          fertiliser: "Fruitful Blend",
        },
        createdAt: dateNow,
      }),
    ).toThrow(FERTILISE_FRUIT_ERRORS.EMPTY_PATCH);
  });

  it("throws when the patch is already fertilised", () => {
    expect(() =>
      fertiliseFruitPatch({
        state: withPatch(
          {
            name: "Apple",
            plantedAt: dateNow - 1000,
            harvestedAt: 0,
            harvestsLeft: 3,
          },
          { fertiliser: { name: "Fruitful Blend", fertilisedAt: dateNow } },
        ),
        action: {
          type: "fruitPatch.fertilised",
          patchID: "0",
          fertiliser: "Fruitful Blend",
        },
        createdAt: dateNow,
      }),
    ).toThrow(FERTILISE_FRUIT_ERRORS.FRUIT_ALREADY_FERTILISED);
  });

  it("throws when there is not enough fertiliser", () => {
    expect(() =>
      fertiliseFruitPatch({
        state: {
          ...withPatch({
            name: "Apple",
            plantedAt: dateNow - 1000,
            harvestedAt: 0,
            harvestsLeft: 3,
          }),
          inventory: { "Fruitful Blend": new Decimal(0) },
        },
        action: {
          type: "fruitPatch.fertilised",
          patchID: "0",
          fertiliser: "Fruitful Blend",
        },
        createdAt: dateNow,
      }),
    ).toThrow(FERTILISE_FRUIT_ERRORS.NOT_ENOUGH_FERTILISER);
  });

  it("throws when the fruit is already ready to harvest", () => {
    expect(() =>
      fertiliseFruitPatch({
        state: withPatch({
          name: "Apple",
          plantedAt: dateNow - appleMs * 2,
          harvestedAt: 0,
          harvestsLeft: 3,
        }),
        action: {
          type: "fruitPatch.fertilised",
          patchID: "0",
          fertiliser: "Fruitful Blend",
        },
        createdAt: dateNow,
      }),
    ).toThrow(FERTILISE_FRUIT_ERRORS.READY_TO_HARVEST);
  });

  it("applies Fruitful Blend and decrements the inventory", () => {
    const state = fertiliseFruitPatch({
      state: withPatch({
        name: "Apple",
        plantedAt: dateNow - 1000,
        harvestedAt: 0,
        harvestsLeft: 3,
      }),
      action: {
        type: "fruitPatch.fertilised",
        patchID: "0",
        fertiliser: "Fruitful Blend",
      },
      createdAt: dateNow,
    });

    expect(state.fruitPatches["0"].fertiliser?.name).toEqual("Fruitful Blend");
    expect(state.inventory["Fruitful Blend"]).toEqual(new Decimal(4));
  });

  describe("Turbofruit Mix — LEGACY (mainnet, back-dated deduction)", () => {
    const originalNetwork = CONFIG.NETWORK;
    beforeEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });
    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    it("back-dates plantedAt so the remaining grow time is ×0.8", () => {
      const plantedAt = dateNow - appleMs / 2;
      const state = fertiliseFruitPatch({
        state: withPatch({
          name: "Apple",
          plantedAt,
          harvestedAt: 0,
          harvestsLeft: 3,
        }),
        action: {
          type: "fruitPatch.fertilised",
          patchID: "0",
          fertiliser: "Turbofruit Mix",
        },
        createdAt: dateNow,
      });

      const remainingMs = plantedAt + appleMs - dateNow;
      expect(state.fruitPatches["0"].fruit?.plantedAt).toEqual(
        plantedAt - remainingMs * 0.2,
      );
    });
  });

  describe("Turbofruit Mix — SPEED_BOOSTS (amoy, live window)", () => {
    const originalNetwork = CONFIG.NETWORK;
    beforeEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
    });
    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    it("does NOT mutate the fruit — just records the fertiliser at fertilisedAt", () => {
      const plantedAt = dateNow - appleMs / 2;
      const state = fertiliseFruitPatch({
        state: withPatch({
          name: "Apple",
          plantedAt,
          harvestedAt: 0,
          harvestsLeft: 3,
          baseDurationMs: appleMs,
        }),
        action: {
          type: "fruitPatch.fertilised",
          patchID: "0",
          fertiliser: "Turbofruit Mix",
        },
        createdAt: dateNow,
      });

      const fruit = state.fruitPatches["0"].fruit;
      // No deduction: plantedAt and baseDurationMs are untouched.
      expect(fruit?.plantedAt).toBe(plantedAt);
      expect(fruit?.baseDurationMs).toBe(appleMs);
      expect(state.fruitPatches["0"].fertiliser).toEqual({
        name: "Turbofruit Mix",
        fertilisedAt: dateNow,
      });
    });

    it("brings the ready time forward by speeding the work accrued AFTER it was applied", () => {
      const plantedAt = dateNow - appleMs / 2;
      const state = fertiliseFruitPatch({
        state: withPatch({
          name: "Apple",
          plantedAt,
          harvestedAt: 0,
          harvestsLeft: 3,
          baseDurationMs: appleMs,
        }),
        action: {
          type: "fruitPatch.fertilised",
          patchID: "0",
          fertiliser: "Turbofruit Mix",
        },
        createdAt: dateNow,
      });

      const fruit = state.fruitPatches["0"].fruit as PlantedFruit;
      const fertiliser = state.fruitPatches["0"].fertiliser;

      const readyWith = getFruitReadyAt(fruit, state, fertiliser);
      const readyWithout = getFruitReadyAt(fruit, state, undefined);

      // Half the work was done at 1×; the remaining half accrues at 1.25× from
      // fertilisedAt (dateNow): readyAt = dateNow + (appleMs / 2) / 1.25.
      expect(readyWith).toBe(dateNow + appleMs / 2 / 1.25);
      expect(readyWith).toBeLessThan(readyWithout);
    });
  });
});
