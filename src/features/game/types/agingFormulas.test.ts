import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import type { GameState, Skills } from "./game";
import {
  getAgingInputMultiplier,
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

  it("scales with Refiner rank", () => {
    expect(
      getRefinedSaltChance(stateWithSkills({ Refiner: 2 } as Skills)),
    ).toBe(25);
    expect(
      getRefinedSaltChance(stateWithSkills({ Refiner: 3 } as Skills)),
    ).toBe(35);
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

  it("triples at Fish Smoking rank 2 and quadruples at rank 3", () => {
    expect(
      getPrimeAgedChance(stateWithSkills({ "Fish Smoking": 2 } as Skills)),
    ).toBe(30);
    expect(
      getPrimeAgedChance(stateWithSkills({ "Fish Smoking": 3 } as Skills)),
    ).toBe(40);
  });
});

describe("getAgingOutput", () => {
  const farmId = 1;

  it("returns base amount when no relevant skills", () => {
    const state = stateWithSkills({} as Skills);
    expect(
      getAgingOutput(state, new Decimal(3), "Salt", 0, {
        farmId,
        itemId: KNOWN_IDS.Salt,
        counter: 0,
      }).toNumber(),
    ).toBe(3);
  });

  it("doubles output at Ager rank 1", () => {
    const state = stateWithSkills({ Ager: 1 } as Skills);
    expect(
      getAgingOutput(state, new Decimal(2), "Pickled Radish", 1, {
        farmId,
        itemId: KNOWN_IDS["Pickled Radish"],
        counter: 0,
      }).toNumber(),
    ).toBe(4);
  });

  it("triples at stamped Ager rank 2 and quadruples at rank 3", () => {
    // No live Ager skill at all: the stamp alone drives the multiplier.
    const state = stateWithSkills({} as Skills);
    const collect = (agerLevel: number) =>
      getAgingOutput(state, new Decimal(2), "Pickled Radish", agerLevel, {
        farmId,
        itemId: KNOWN_IDS["Pickled Radish"],
        counter: 0,
      }).toNumber();

    expect(collect(2)).toBe(6);
    expect(collect(3)).toBe(8);
  });

  it("ignores current Ager skill when stamp says not applied", () => {
    // Exploit guard: player activates Ager after starting; stamp was 0 → 1x output
    const state = stateWithSkills({ Ager: 1 } as Skills);
    expect(
      getAgingOutput(state, new Decimal(2), "Pickled Radish", 0, {
        farmId,
        itemId: KNOWN_IDS["Pickled Radish"],
        counter: 0,
      }).toNumber(),
    ).toBe(2);
  });

  it("pays out the stamped rank, not a higher live rank", () => {
    // Exploit guard: player ranks Ager 1 → 3 mid-job, having only paid 2x
    // inputs. Collect must still settle at the stamped rank 1 (2x).
    const state = stateWithSkills({ Ager: 3 } as Skills);
    expect(
      getAgingOutput(state, new Decimal(2), "Pickled Radish", 1, {
        farmId,
        itemId: KNOWN_IDS["Pickled Radish"],
        counter: 0,
      }).toNumber(),
    ).toBe(4);
  });

  it("applies Ager stamp even when current skill is off", () => {
    // Symmetric guard: player deactivates Ager after starting; stamp was 1 → 2x output
    const state = stateWithSkills({} as Skills);
    expect(
      getAgingOutput(state, new Decimal(2), "Pickled Radish", 1, {
        farmId,
        itemId: KNOWN_IDS["Pickled Radish"],
        counter: 0,
      }).toNumber(),
    ).toBe(4);
  });

  describe("Bacalhau bait bonus", () => {
    const bait = "Capsule Bait";

    it("adds nothing without the skill", () => {
      expect(
        getAgingOutput(
          stateWithSkills({} as Skills),
          new Decimal(1),
          bait,
          0,
        ).toNumber(),
      ).toBe(1);
    });

    it("scales the bait bonus with rank", () => {
      const collect = (rank: number) =>
        getAgingOutput(
          stateWithSkills({ Bacalhau: rank } as Skills),
          new Decimal(1),
          bait,
          0,
        ).toNumber();

      expect(collect(1)).toBe(2);
      expect(collect(2)).toBe(3);
      expect(collect(3)).toBe(4);
    });

    it("does not apply to non-bait items", () => {
      expect(
        getAgingOutput(
          stateWithSkills({ Bacalhau: 3 } as Skills),
          new Decimal(1),
          "Salt",
          0,
        ).toNumber(),
      ).toBe(1);
    });
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
        getAgingOutput(stateWithSkills({} as Skills), base, "Refined Salt", 0, {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(2);
    });

    it("does not roll Refiner for non–Refined Salt items", () => {
      const stateWithRefiner = stateWithSkills({ Refiner: 1 } as Skills);
      expect(
        getAgingOutput(stateWithRefiner, new Decimal(2), "Salt", 0, {
          farmId,
          itemId: KNOWN_IDS.Salt,
          counter: 4,
        }).toNumber(),
      ).toBe(2);
    });

    it("adds +1 on PRNG hit (counter 4) from base 2", () => {
      expect(
        getAgingOutput(state, new Decimal(2), "Refined Salt", 0, {
          farmId,
          itemId: refinedSaltId,
          counter: 4,
        }).toNumber(),
      ).toBe(3);
    });

    it("does not add Refiner +1 on PRNG miss (counter 0) from base 2", () => {
      expect(
        getAgingOutput(state, new Decimal(2), "Refined Salt", 0, {
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
        getAgingOutput(agerRefinerState, new Decimal(2), "Refined Salt", 1, {
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

  it("matches base aging time with no boosts", () => {
    const state = stateWithSkills({} as Skills);
    expect(getBoostedAgingTimeMs(baseXP, state)).toBe(getAgingTimeMs(baseXP));
  });

  it("applies Speedy Aging as 0.9×", () => {
    const baseMs = getAgingTimeMs(baseXP);
    expect(
      getBoostedAgingTimeMs(
        baseXP,
        stateWithSkills({ "Speedy Aging": 1 } as Skills),
      ),
    ).toBe(baseMs * 0.9);
  });

  it("applies Salt Sculpture level 5+ as 0.95×", () => {
    const baseMs = getAgingTimeMs(baseXP);
    const state = {
      bumpkin: { skills: {} as Skills },
      sculptures: { "Salt Sculpture": { level: 5 } },
    } as GameState;
    expect(getBoostedAgingTimeMs(baseXP, state)).toBe(baseMs * 0.95);
  });

  it("stacks Speedy Aging and Salt Sculpture discounts", () => {
    const baseMs = getAgingTimeMs(baseXP);
    const state = {
      bumpkin: { skills: { "Speedy Aging": 1 } as Skills },
      sculptures: { "Salt Sculpture": { level: 5 } },
    } as GameState;
    expect(getBoostedAgingTimeMs(baseXP, state)).toBeCloseTo(
      baseMs * 0.9 * 0.95,
    );
  });

  it("applies Speedy Aging rank 2 as 0.85× and rank 3 as 0.8×", () => {
    const baseMs = getAgingTimeMs(baseXP);
    expect(
      getBoostedAgingTimeMs(
        baseXP,
        stateWithSkills({ "Speedy Aging": 2 } as Skills),
      ),
    ).toBeCloseTo(baseMs * 0.85);
    expect(
      getBoostedAgingTimeMs(
        baseXP,
        stateWithSkills({ "Speedy Aging": 3 } as Skills),
      ),
    ).toBeCloseTo(baseMs * 0.8);
  });
});

describe("stamped Ager level for in-progress jobs", () => {
  // The in-progress panels show what a running job actually cost, so they pass
  // the job's stamped rank instead of letting the live rank recompute it.
  const baseXP = 60;

  it("uses an explicit Ager level over the live rank", () => {
    const rankedUp = stateWithSkills({ Ager: 3 });
    const base = getAgingSaltCost(baseXP);

    // Job was stamped at rank 1, player is now rank 3: show what was charged.
    expect(getAgingInputMultiplier(rankedUp, 1)).toBe(2);
    expect(getBoostedAgingSaltCost(baseXP, rankedUp, 1)).toBe(base * 2);
    expect(getBoostedAgingFishCost(rankedUp, 1)).toBe(2);
  });

  it("preserves an explicit level 0 rather than falling back to the live rank", () => {
    // The `?? live` vs `|| live` trap: a job started without Ager stamps 0, and
    // 0 must stay 0 even once the player has the skill.
    const rankedUp = stateWithSkills({ Ager: 3 });
    const base = getAgingSaltCost(baseXP);

    expect(getAgingInputMultiplier(rankedUp, 0)).toBe(1);
    expect(getBoostedAgingSaltCost(baseXP, rankedUp, 0)).toBe(base);
    expect(getBoostedAgingFishCost(rankedUp, 0)).toBe(1);
  });

  it("falls back to the live rank when no level is given", () => {
    // Empty panels preview an unstarted job, so they still read live.
    const base = getAgingSaltCost(baseXP);
    expect(getAgingInputMultiplier(stateWithSkills({ Ager: 3 }))).toBe(4);
    expect(getBoostedAgingSaltCost(baseXP, stateWithSkills({ Ager: 2 }))).toBe(
      base * 3,
    );
    expect(getBoostedAgingFishCost(stateWithSkills({ Ager: 2 }))).toBe(3);
  });
});

describe("getBoostedAgingFishCost", () => {
  it("requires 1 fish without Ager", () => {
    expect(getBoostedAgingFishCost(stateWithSkills({}))).toBe(1);
  });

  it("requires 2 fish with Ager (Aging Rack)", () => {
    expect(getBoostedAgingFishCost(stateWithSkills({ Ager: 1 }))).toBe(2);
  });

  it("scales the fish cost with Ager rank", () => {
    expect(getBoostedAgingFishCost(stateWithSkills({ Ager: 2 }))).toBe(3);
    expect(getBoostedAgingFishCost(stateWithSkills({ Ager: 3 }))).toBe(4);
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

  it("scales the salt cost with Ager rank", () => {
    const base = getAgingSaltCost(baseXP);
    expect(getBoostedAgingSaltCost(baseXP, stateWithSkills({ Ager: 2 }))).toBe(
      base * 3,
    );
    expect(getBoostedAgingSaltCost(baseXP, stateWithSkills({ Ager: 3 }))).toBe(
      base * 4,
    );
  });
});
