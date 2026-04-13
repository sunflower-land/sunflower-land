import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import type { GameState, Skills } from "./game";
import {
  getAgingOutput,
  getAgingSaltCost,
  getAgingTimeMs,
  getBoostedAgingFishCost,
  getBoostedAgingSaltCost,
  getBoostedAgingTimeMs,
  getPrimeAgedChance,
  getRefinedSaltChance,
} from "./agingFormulas";

function stateWithSkills(skills: Skills): GameState {
  return { bumpkin: { skills } } as GameState;
}

describe("getRefinedSaltChance", () => {
  it("returns 0 without Refiner", () => {
    expect(getRefinedSaltChance(stateWithSkills({} as Skills))).toBe(0);
  });

  it("returns 15 with Refiner", () => {
    expect(
      getRefinedSaltChance(stateWithSkills({ Refiner: 1 } as Skills)),
    ).toBe(15);
  });
});

describe("getPrimeAgedChance", () => {
  it("defaults to 10%", () => {
    expect(getPrimeAgedChance(stateWithSkills({} as Skills))).toBe(10);
  });

  it("doubles to 20% with Fish Smoking", () => {
    expect(
      getPrimeAgedChance(stateWithSkills({ "Fish Smoking": 1 } as Skills)),
    ).toBe(20);
  });
});

describe("getAgingOutput", () => {
  const farmId = 1;

  it("returns base amount when no relevant skills", () => {
    const state = stateWithSkills({} as Skills);
    expect(
      getAgingOutput(state, new Decimal(3), "Salt", {
        farmId,
        itemId: KNOWN_IDS.Salt,
        counter: 0,
      }).toNumber(),
    ).toBe(3);
  });

  it("doubles output for Ager on any item", () => {
    const state = stateWithSkills({ Ager: 1 } as Skills);
    expect(
      getAgingOutput(state, new Decimal(2), "Pickled Radish", {
        farmId,
        itemId: KNOWN_IDS["Pickled Radish"],
        counter: 0,
      }).toNumber(),
    ).toBe(4);
  });

  describe("Refiner bonus on Refined Salt (15% PRNG)", () => {
    const refinedSaltId = KNOWN_IDS["Refined Salt"];
    const state = stateWithSkills({ Refiner: 1 } as Skills);

    it("documents deterministic miss at counter 0 for farmId 1", () => {
      expect(
        prngChance({
          farmId,
          itemId: refinedSaltId,
          counter: 0,
          chance: 15,
          criticalHitName: "Refiner",
        }),
      ).toBe(false);
    });

    it("documents deterministic hit at counter 4 for farmId 1", () => {
      expect(
        prngChance({
          farmId,
          itemId: refinedSaltId,
          counter: 4,
          chance: 15,
          criticalHitName: "Refiner",
        }),
      ).toBe(true);
    });

    it("does not add Refiner bonus without the skill", () => {
      const base = new Decimal(2);
      expect(
        getAgingOutput(stateWithSkills({} as Skills), base, "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(2);
    });

    it("does not roll Refiner for non–Refined Salt items", () => {
      const stateWithRefiner = stateWithSkills({ Refiner: 1 } as Skills);
      expect(
        getAgingOutput(stateWithRefiner, new Decimal(2), "Salt", {
          farmId,
          itemId: KNOWN_IDS.Salt,
          counter: 4,
        }).toNumber(),
      ).toBe(2);
    });

    it("adds +1 on PRNG hit (counter 4) from base 2", () => {
      expect(
        getAgingOutput(state, new Decimal(2), "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(3);
    });

    it("does not add Refiner +1 on PRNG miss (counter 0) from base 2", () => {
      expect(
        getAgingOutput(state, new Decimal(2), "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 0,
        }).toNumber(),
      ).toBe(2);
    });

    it("stacks Ager 2× with Refiner bonus on hit", () => {
      const agerRefinerState = stateWithSkills({
        Ager: 1,
        Refiner: 1,
      } as Skills);
      expect(
        getAgingOutput(agerRefinerState, new Decimal(2), "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(5);
    });
  });
});

describe("getBoostedAgingTimeMs", () => {
  const baseXP = 500;

  it("halves aging time for Tuna vs other fish at the same base XP", () => {
    const baseMs = getAgingTimeMs(baseXP);
    expect(getBoostedAgingTimeMs(baseXP, {}, "Tuna")).toBe(baseMs * 0.5);
    expect(getBoostedAgingTimeMs(baseXP, {}, "Angelfish")).toBe(baseMs);
  });

  it("applies Speedy Aging after the Tuna discount", () => {
    const baseMs = getAgingTimeMs(baseXP);
    expect(
      getBoostedAgingTimeMs(baseXP, { "Speedy Aging": 1 } as Skills, "Tuna"),
    ).toBe(baseMs * 0.5 * 0.9);
  });
});

describe("getBoostedAgingFishCost", () => {
  it("requires 1 fish without Ager", () => {
    expect(getBoostedAgingFishCost(stateWithSkills({}))).toBe(1);
  });

  it("requires 2 fish with Ager (Aging Rack)", () => {
    expect(getBoostedAgingFishCost(stateWithSkills({ Ager: 1 }))).toBe(2);
  });
});

describe("getBoostedAgingSaltCost", () => {
  const baseXP = 60;

  it("matches base salt cost without Ager", () => {
    const base = getAgingSaltCost(baseXP);
    expect(getBoostedAgingSaltCost(baseXP, stateWithSkills({}))).toBe(base);
  });

  it("doubles salt cost with Ager (Aging Rack)", () => {
    const base = getAgingSaltCost(baseXP);
    expect(getBoostedAgingSaltCost(baseXP, stateWithSkills({ Ager: 1 }))).toBe(
      base * 2,
    );
  });
});
