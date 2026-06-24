import { TOTAL_EXPANSION_NODES } from "features/game/types/expansions";
import type { Nodes } from "./expansionNodes";

/**
 * Regression guard for the derived expansion-node tables.
 *
 * `TOTAL_EXPANSION_NODES` is derived in `types/expansions.ts` from
 * `arrival row (base) + cumulative layout counts` (see `deriveExpansionNodes`).
 * The values below were captured from the original hardcoded table (git HEAD,
 * before the derivation refactor). The arrival row feeds the whole table; the
 * final row is the cumulative of every layout, so any drift in a single
 * expansion's node counts will fail here.
 *
 * Basic is capped at 9 (see BASIC_MAX_EXPANSION); the legacy 10–23 rows were
 * retired with that cap.
 */
const EXPECTED: Record<
  "basic" | "spring" | "desert" | "volcano",
  { first: number; last: number; base: Nodes; final: Nodes }
> = {
  basic: {
    first: 3,
    last: 9,
    base: {
      "Crop Plot": 0,
      Tree: 3,
      "Stone Rock": 2,
      "Iron Rock": 0,
      "Gold Rock": 0,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
      "Lava Pit": 0,
      "Ascension Crystal": 0,
    },
    final: {
      "Crop Plot": 31,
      Tree: 9,
      "Stone Rock": 7,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
      "Lava Pit": 0,
      "Ascension Crystal": 0,
    },
  },
  spring: {
    first: 4,
    last: 16,
    base: {
      "Crop Plot": 31,
      "Fruit Patch": 2,
      Tree: 9,
      "Stone Rock": 7,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 0,
      "Oil Reserve": 0,
      "Flower Bed": 0,
      "Lava Pit": 0,
      "Ascension Crystal": 0,
    },
    // spring[16] is the designed handoff into the desert arrival row
    // (== DESERT_BASE_NODES); legacy spring 17–20 were retired with the cap.
    final: {
      "Crop Plot": 45,
      "Fruit Patch": 11,
      Tree: 18,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 6,
      "Crimstone Rock": 2,
      "Sunstone Rock": 2,
      Beehive: 3,
      "Flower Bed": 3,
      "Oil Reserve": 0,
      "Lava Pit": 0,
      "Ascension Crystal": 0,
    },
  },
  desert: {
    first: 4,
    last: 25,
    base: {
      "Crop Plot": 45,
      "Fruit Patch": 11,
      Tree: 18,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 6,
      "Crimstone Rock": 2,
      "Sunstone Rock": 2,
      "Oil Reserve": 0,
      "Lava Pit": 0,
      Beehive: 3,
      "Flower Bed": 3,
      "Ascension Crystal": 0,
    },
    final: {
      "Crop Plot": 65,
      Tree: 23,
      "Stone Rock": 20,
      "Iron Rock": 12,
      "Gold Rock": 7,
      "Fruit Patch": 15,
      "Crimstone Rock": 4,
      "Sunstone Rock": 6,
      "Oil Reserve": 3,
      "Lava Pit": 0,
      Beehive: 3,
      "Flower Bed": 3,
      "Ascension Crystal": 0,
    },
  },
  volcano: {
    first: 5,
    last: 30,
    base: {
      "Crop Plot": 65,
      Tree: 23,
      "Stone Rock": 20,
      "Iron Rock": 12,
      "Gold Rock": 7,
      "Fruit Patch": 15,
      "Crimstone Rock": 4,
      "Sunstone Rock": 6,
      "Oil Reserve": 3,
      "Lava Pit": 0,
      Beehive: 3,
      "Flower Bed": 3,
      "Ascension Crystal": 0,
    },
    final: {
      "Crop Plot": 65,
      Tree: 23,
      "Stone Rock": 20,
      "Iron Rock": 13,
      "Gold Rock": 8,
      "Fruit Patch": 15,
      "Crimstone Rock": 5,
      "Sunstone Rock": 13,
      "Oil Reserve": 4,
      "Lava Pit": 3,
      Beehive: 3,
      "Flower Bed": 3,
      "Ascension Crystal": 0,
    },
  },
};

describe("TOTAL_EXPANSION_NODES (derived from layouts)", () => {
  (Object.keys(EXPECTED) as (keyof typeof EXPECTED)[]).forEach((island) => {
    const exp = EXPECTED[island];

    describe(island, () => {
      it("covers a contiguous expansion range", () => {
        const keys = Object.keys(TOTAL_EXPANSION_NODES[island])
          .map(Number)
          .sort((a, b) => a - b);

        expect(keys).toEqual(
          Array.from(
            { length: exp.last - exp.first + 1 },
            (_, i) => exp.first + i,
          ),
        );
      });

      it("matches the arrival (base) row", () => {
        expect(TOTAL_EXPANSION_NODES[island][exp.first]).toEqual(exp.base);
      });

      it("matches the final (cumulative) row", () => {
        expect(TOTAL_EXPANSION_NODES[island][exp.last]).toEqual(exp.final);
      });
    });
  });
});

// Per-expansion cumulative counts for the sparse, high-value nodes, captured
// from the audited derived table (== the original hardcoded table for these
// ranges). The first/final checks above can miss a drifted intermediate row;
// these guard it for the nodes where a single wrong row is most impactful and
// least visible — gameplay reads each intermediate row directly.
const SPARSE: Record<
  keyof typeof EXPECTED,
  Partial<Record<keyof Nodes, number[]>>
> = {
  basic: {
    "Sunstone Rock": [0, 0, 0, 0, 0, 0, 0],
    "Crimstone Rock": [0, 0, 0, 0, 0, 0, 0],
    "Oil Reserve": [0, 0, 0, 0, 0, 0, 0],
    "Lava Pit": [0, 0, 0, 0, 0, 0, 0],
  },
  spring: {
    "Sunstone Rock": [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
    "Crimstone Rock": [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    "Oil Reserve": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Lava Pit": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  desert: {
    "Sunstone Rock": [
      2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6,
    ],
    "Crimstone Rock": [
      2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4,
    ],
    "Oil Reserve": [
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
    ],
    "Lava Pit": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  volcano: {
    "Sunstone Rock": [
      6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 10, 10, 11, 11, 11, 11, 11, 11,
      11, 12, 12, 13,
    ],
    "Crimstone Rock": [
      4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5,
      5,
    ],
    "Oil Reserve": [
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
      4,
    ],
    "Lava Pit": [
      0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
      3,
    ],
  },
};

describe("sparse high-value nodes match per expansion (intermediate-row guard)", () => {
  (Object.keys(SPARSE) as (keyof typeof SPARSE)[]).forEach((island) => {
    const exp = EXPECTED[island];

    (Object.keys(SPARSE[island]) as (keyof Nodes)[]).forEach((node) => {
      it(`${island} ${node}`, () => {
        const actual: number[] = [];
        for (let e = exp.first; e <= exp.last; e++) {
          actual.push(TOTAL_EXPANSION_NODES[island][e][node]);
        }
        expect(actual).toEqual(SPARSE[island][node]);
      });
    });
  });
});

describe("prestige handoff: an island's arrival row never has fewer nodes than the previous island's cap", () => {
  // Each island prestiges to the next at its ISLAND_UPGRADE threshold (basic 9,
  // spring 16, desert 25). A player must not lose nodes on prestige, so the next
  // island's arrival (base) row must be >= the previous island's totals at its cap.
  const HANDOFFS = [
    { prev: "basic", cap: 9, next: "spring" },
    { prev: "spring", cap: 16, next: "desert" },
    { prev: "desert", cap: 25, next: "volcano" },
  ] as const;

  it.each(HANDOFFS)("$next arrival >= $prev[$cap]", ({ prev, cap, next }) => {
    const prevFinal = TOTAL_EXPANSION_NODES[prev][cap];
    const nextFirst = Math.min(
      ...Object.keys(TOTAL_EXPANSION_NODES[next]).map(Number),
    );
    const nextBase = TOTAL_EXPANSION_NODES[next][nextFirst];

    (Object.keys(prevFinal) as (keyof Nodes)[]).forEach((key) => {
      expect(nextBase[key]).toBeGreaterThanOrEqual(prevFinal[key]);
    });
  });
});
