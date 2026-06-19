import type { Layout } from "features/game/types/expansions";
import {
  SWAMP_BASE_NODES,
  getAscensionExpansionDelta,
  getAscensionExpansionRequirements,
  getAscensionLayout,
  getAscensionNodes,
} from "./ascension";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

const HOUR = 60 * 60;

describe("swamp expansion requirements", () => {
  it("expansion 1 of ascension 1 equals the curve start", () => {
    expect(
      getAscensionExpansionRequirements({ expansion: 31, ascensionLevel: 1 }),
    ).toEqual({
      resources: { Crimstone: 30, Oil: 50, Obsidian: 3 },
      coins: 5000,
      seconds: 7 * HOUR,
      bumpkinLevel: { ascension: 1, level: 1 },
    });
  });

  it("expansion 12 of ascension 1 equals the curve end", () => {
    expect(
      getAscensionExpansionRequirements({ expansion: 42, ascensionLevel: 1 }),
    ).toEqual({
      resources: { Crimstone: 150, Oil: 400, Obsidian: 30 },
      coins: 75000,
      seconds: 84 * HOUR,
      bumpkinLevel: { ascension: 1, level: 45 },
    });
  });

  it("rounds resources to the nearest integer and coins up to the nearest 10", () => {
    // Expansion 32 (local e=2) of ascension 1. Curve coins = 8099.47 → 8100.
    const req = getAscensionExpansionRequirements({
      expansion: 32,
      ascensionLevel: 1,
    });
    expect(req?.resources).toEqual({ Crimstone: 35, Oil: 65, Obsidian: 4 });
    expect(req?.coins).toBe(8100);
  });

  it("scales cost by 1.4^(a-1) and keeps time ascension-invariant", () => {
    expect(
      getAscensionExpansionRequirements({ expansion: 42, ascensionLevel: 2 }),
    ).toEqual({
      resources: { Crimstone: 210, Oil: 560, Obsidian: 42 },
      coins: 105000,
      seconds: 84 * HOUR,
      bumpkinLevel: { ascension: 2, level: 45 },
    });

    expect(
      getAscensionExpansionRequirements({ expansion: 42, ascensionLevel: 5 }),
    ).toEqual({
      resources: { Crimstone: 576, Oil: 1537, Obsidian: 115 },
      coins: 288120,
      seconds: 84 * HOUR,
      bumpkinLevel: { ascension: 5, level: 45 },
    });
  });

  it("returns undefined outside the 31-42 expansion range", () => {
    expect(
      getAscensionExpansionRequirements({ expansion: 30, ascensionLevel: 1 }),
    ).toBeUndefined();
    expect(
      getAscensionExpansionRequirements({ expansion: 43, ascensionLevel: 1 }),
    ).toBeUndefined();
  });
});

describe("swamp node drip", () => {
  it("grants nothing at the base row (E = 0)", () => {
    expect(
      getAscensionExpansionDelta({ expansion: 30, ascensionLevel: 1 }),
    ).toEqual({});
  });

  it("grants exactly one Lava/Beehive/Flower per ascension", () => {
    for (let a = 1; a <= 5; a++) {
      const totals: Partial<Record<string, number>> = {};
      for (let expansion = 31; expansion <= 42; expansion++) {
        const delta = getAscensionExpansionDelta({
          expansion,
          ascensionLevel: a,
        });
        for (const [node, count] of Object.entries(delta)) {
          totals[node] = (totals[node] ?? 0) + (count ?? 0);
        }
      }
      // The cap-12 nodes are granted exactly once per ascension — now spread
      // evenly rather than pinned to the final expansion.
      expect(totals["Lava Pit"]).toBe(1);
      expect(totals["Beehive"]).toBe(1);
      expect(totals["Flower Bed"]).toBe(1);
    }
  });

  it("keeps Sunstone pinned at the base floor (never drips)", () => {
    expect(
      getAscensionNodes({ expansion: 42, ascensionLevel: 5 })["Sunstone Rock"],
    ).toBe(SWAMP_BASE_NODES["Sunstone Rock"]);
  });
});

describe("swamp cumulative nodes (carry-forward)", () => {
  it("row 30 is exactly the base floor", () => {
    expect(getAscensionNodes({ expansion: 30, ascensionLevel: 1 })).toEqual(
      SWAMP_BASE_NODES,
    );
  });

  it("matches the end-of-ascension totals for a1 and a5", () => {
    expect(getAscensionNodes({ expansion: 42, ascensionLevel: 1 })).toEqual({
      "Crop Plot": 71,
      Tree: 26,
      "Stone Rock": 23,
      "Fruit Patch": 19,
      "Iron Rock": 15,
      "Gold Rock": 9,
      "Crimstone Rock": 7,
      "Oil Reserve": 5,
      "Lava Pit": 4,
      Beehive: 4,
      "Flower Bed": 4,
      "Sunstone Rock": 13,
    });

    expect(getAscensionNodes({ expansion: 42, ascensionLevel: 5 })).toEqual({
      "Crop Plot": 88,
      Tree: 32,
      "Stone Rock": 29,
      "Fruit Patch": 30,
      "Iron Rock": 21,
      "Gold Rock": 13,
      "Crimstone Rock": 15,
      "Oil Reserve": 9,
      "Lava Pit": 8,
      Beehive: 8,
      "Flower Bed": 8,
      "Sunstone Rock": 13,
    });
  });
});

describe("swamp layout placement", () => {
  const FIELD_TO_RESOURCE: Partial<
    Record<keyof Layout, keyof typeof RESOURCE_DIMENSIONS>
  > = {
    plots: "Crop Plot",
    trees: "Tree",
    stones: "Stone Rock",
    iron: "Iron Rock",
    gold: "Gold Rock",
    crimstones: "Crimstone Rock",
    sunstones: "Sunstone Rock",
    fruitPatches: "Fruit Patch",
    flowerBeds: "Flower Bed",
    beehives: "Beehive",
    oilReserves: "Oil Reserve",
    lavaPits: "Lava Pit",
  };

  it("places non-overlapping footprints fully inside the 6x6 block", () => {
    for (let a = 1; a <= 5; a++) {
      for (let expansion = 31; expansion <= 42; expansion++) {
        const layout = getAscensionLayout({ expansion, ascensionLevel: a });
        const occupied = new Set<string>();

        (Object.keys(FIELD_TO_RESOURCE) as (keyof Layout)[]).forEach(
          (field) => {
            const coords = layout[field] as
              | { x: number; y: number }[]
              | undefined;
            const resource = FIELD_TO_RESOURCE[field]!;
            const { width, height } = RESOURCE_DIMENSIONS[resource];
            (coords ?? []).forEach(({ x, y }) => {
              // Footprint stays inside the local [-3, 3] x [-3, 3] block.
              expect(x).toBeGreaterThanOrEqual(-3);
              expect(x + width).toBeLessThanOrEqual(3);
              expect(y).toBeLessThanOrEqual(3);
              expect(y - height).toBeGreaterThanOrEqual(-3);

              for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                  const key = `${x + i},${y - j}`;
                  expect(occupied.has(key)).toBe(false);
                  occupied.add(key);
                }
              }
            });
          },
        );
      }
    }
  });

  it("spreads nodes evenly — no empty expansion, totals preserved", () => {
    for (let a = 1; a <= 5; a++) {
      const startOfAscension = getAscensionNodes({
        expansion: 30,
        ascensionLevel: a,
      });
      const endOfAscension = getAscensionNodes({
        expansion: 42,
        ascensionLevel: a,
      });
      const dealt: Partial<Record<string, number>> = {};

      for (let expansion = 31; expansion <= 42; expansion++) {
        const delta = getAscensionExpansionDelta({
          expansion,
          ascensionLevel: a,
        });
        const count = Object.values(delta).reduce(
          (sum, n) => sum + (n ?? 0),
          0,
        );
        // No expansion is empty — nodes are dealt across all 12, not piled on 42.
        expect(count).toBeGreaterThan(0);
        for (const [node, n] of Object.entries(delta)) {
          dealt[node] = (dealt[node] ?? 0) + (n ?? 0);
        }
      }

      // Per-type totals are unchanged: the dealt counts equal the ascension's
      // end-of-ascension floor minus its starting floor.
      for (const node of Object.keys(
        endOfAscension,
      ) as (keyof typeof endOfAscension)[]) {
        expect(dealt[node] ?? 0).toBe(
          (endOfAscension[node] ?? 0) - (startOfAscension[node] ?? 0),
        );
      }
    }
  });
});
