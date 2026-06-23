import type { Layout } from "features/game/types/expansions";
import {
  SWAMP_BASE_NODES,
  getAscensionExpansionDelta,
  getAscensionExpansionRequirements,
  getAscensionLayout,
  getAscensionNodeDrip,
  getAscensionNodes,
} from "./ascension";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

const HOUR = 60 * 60;

describe("swamp expansion requirements", () => {
  it("expansion 1 of ascension 1 equals the curve start", () => {
    expect(
      getAscensionExpansionRequirements({ expansion: 31, ascensionLevel: 1 }),
    ).toEqual({
      resources: { Crimstone: 10, Oil: 50, Obsidian: 2 },
      coins: 5000,
      seconds: 7 * HOUR,
      bumpkinLevel: { ascension: 1, level: 1 },
    });
  });

  it("expansion 12 of ascension 1 equals the curve end", () => {
    expect(
      getAscensionExpansionRequirements({ expansion: 42, ascensionLevel: 1 }),
    ).toEqual({
      resources: { Crimstone: 50, Oil: 400, Obsidian: 20 },
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
    expect(req?.resources).toEqual({ Crimstone: 12, Oil: 65, Obsidian: 3 });
    expect(req?.coins).toBe(8100);
  });

  it("scales cost by 1.3^(a-1) and keeps time ascension-invariant", () => {
    expect(
      getAscensionExpansionRequirements({ expansion: 42, ascensionLevel: 2 }),
    ).toEqual({
      resources: { Crimstone: 65, Oil: 520, Obsidian: 26 },
      coins: 97500,
      seconds: 84 * HOUR,
      bumpkinLevel: { ascension: 2, level: 45 },
    });

    expect(
      getAscensionExpansionRequirements({ expansion: 42, ascensionLevel: 5 }),
    ).toEqual({
      resources: { Crimstone: 143, Oil: 1142, Obsidian: 57 },
      coins: 214210,
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

  it("grants Beehive and Flower Bed together (paired) each ascension", () => {
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
      // Beehive and Flower Bed share a drip and always unlock as a pair.
      expect(totals["Beehive"] ?? 0).toBe(totals["Flower Bed"] ?? 0);
    }
  });

  it("drips Sunstone above the base floor across ascensions", () => {
    expect(
      getAscensionNodes({ expansion: 42, ascensionLevel: 5 })["Sunstone Rock"],
    ).toBeGreaterThan(SWAMP_BASE_NODES["Sunstone Rock"]);
  });
});

describe("ascension node drip widening (cap vs uncap)", () => {
  it("returns the base drip at ascension 1", () => {
    expect(getAscensionNodeDrip("Crimstone Rock", 1)).toBe(8);
  });

  it("widens uncapped nodes past the 12 cap at higher ascensions", () => {
    // NO_DRIP_CAP_NODES keep widening: floor(base * (1 + 0.25 * (a - 1))).
    expect(getAscensionNodeDrip("Lava Pit", 2)).toBe(20); // floor(16 * 1.25)
    expect(getAscensionNodeDrip("Oil Reserve", 5)).toBe(24); // floor(12 * 2)
    expect(getAscensionNodeDrip("Beehive", 5)).toBe(20); // floor(10 * 2)
    expect(getAscensionNodeDrip("Crimstone Rock", 5)).toBe(16); // floor(8 * 2)
    expect(getAscensionNodeDrip("Sunstone Rock", 5)).toBe(20); // floor(10 * 2)
  });

  it("clamps capped nodes at the 12 drip cap", () => {
    // Gold Rock widened would be 16 → clamps to 12.
    expect(getAscensionNodeDrip("Gold Rock", 5)).toBe(12);
  });

  it("keeps zero-drip nodes at zero (never widens)", () => {
    expect(getAscensionNodeDrip("Ascension Crystal", 1)).toBe(0);
    expect(getAscensionNodeDrip("Ascension Crystal", 5)).toBe(0);
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
      "Crimstone Rock": 6,
      "Oil Reserve": 5,
      "Lava Pit": 3,
      Beehive: 4,
      "Flower Bed": 4,
      "Sunstone Rock": 14,
      "Ascension Crystal": 0,
    });

    expect(getAscensionNodes({ expansion: 42, ascensionLevel: 5 })).toEqual({
      "Crop Plot": 88,
      Tree: 32,
      "Stone Rock": 29,
      "Fruit Patch": 30,
      "Iron Rock": 21,
      "Gold Rock": 13,
      "Crimstone Rock": 9,
      "Oil Reserve": 8,
      "Lava Pit": 4,
      Beehive: 7,
      "Flower Bed": 7,
      "Sunstone Rock": 17,
      "Ascension Crystal": 0,
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

  it("deals dripped nodes across the band — per-type totals preserved", () => {
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
        // At higher ascensions the widened drips can leave some expansions
        // empty; that's fine — only the per-type band totals must be preserved.
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
