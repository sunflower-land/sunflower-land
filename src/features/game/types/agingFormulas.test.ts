import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import type { Skills } from "./game";
import {
  getAgingOutput,
  getPrimeAgedChance,
  getRefinedSaltChance,
} from "./agingFormulas";

describe("getRefinedSaltChance", () => {
  it("returns 0 without Refiner", () => {
    expect(getRefinedSaltChance({} as Skills)).toBe(0);
  });

  it("returns 15 with Refiner", () => {
    expect(getRefinedSaltChance({ Refiner: 1 } as Skills)).toBe(15);
  });
});

describe("getPrimeAgedChance", () => {
  it("defaults to 10%", () => {
    expect(getPrimeAgedChance({} as Skills)).toBe(10);
  });

  it("doubles to 20% with Fish Smoking", () => {
    expect(getPrimeAgedChance({ "Fish Smoking": 1 } as Skills)).toBe(20);
  });
});

describe("getAgingOutput", () => {
  const farmId = 1;

  it("returns base amount when no relevant skills", () => {
    const skills = {} as Skills;
    expect(
      getAgingOutput(skills, new Decimal(3), "Salt", {
        farmId,
        itemId: KNOWN_IDS.Salt,
        counter: 0,
      }).toNumber(),
    ).toBe(3);
  });

  it("adds +1 for Ager on any item", () => {
    const skills = { Ager: 1 } as Skills;
    expect(
      getAgingOutput(skills, new Decimal(2), "Pickled Radish", {
        farmId,
        itemId: KNOWN_IDS["Pickled Radish"],
        counter: 0,
      }).toNumber(),
    ).toBe(3);
  });

  describe("Refiner bonus on Refined Salt (15% PRNG)", () => {
    const refinedSaltId = KNOWN_IDS["Refined Salt"];
    const skills = { Refiner: 1 } as Skills;

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
        getAgingOutput({} as Skills, base, "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(2);
    });

    it("does not roll Refiner for non–Refined Salt items", () => {
      const skillsWithRefiner = { Refiner: 1 } as Skills;
      expect(
        getAgingOutput(skillsWithRefiner, new Decimal(2), "Salt", {
          farmId,
          itemId: KNOWN_IDS.Salt,
          counter: 4,
        }).toNumber(),
      ).toBe(2);
    });

    it("adds +1 on PRNG hit (counter 4) from base 2", () => {
      expect(
        getAgingOutput(skills, new Decimal(2), "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(3);
    });

    it("does not add Refiner +1 on PRNG miss (counter 0) from base 2", () => {
      expect(
        getAgingOutput(skills, new Decimal(2), "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 0,
        }).toNumber(),
      ).toBe(2);
    });

    it("stacks Ager +1 with Refiner bonus on hit", () => {
      const agerRefiner = { Ager: 1, Refiner: 1 } as Skills;
      expect(
        getAgingOutput(agerRefiner, new Decimal(2), "Refined Salt", {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(4);
    });
  });
});
