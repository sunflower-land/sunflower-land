import Decimal from "decimal.js-light";
import type { Layout, Requirements } from "features/game/types/expansions";
import type { Nodes } from "features/game/expansion/lib/expansionNodes";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

import {
  RESOURCE_DIMENSIONS,
  type ResourceName,
} from "features/game/types/resources";
import { getKeys } from "lib/object";

/**
 * Swamp is the first "ascension" island. Unlike the linear islands (basic →
 * volcano) whose expansion costs, durations and layouts are hand-authored
 * tables, swamp is fully formula-driven and parameterised by the player's
 * ascension level (`game.island.ascensionLevel`, 1-indexed). Re-ascending wipes
 * the farm back to the base floor and bumps the level, so the same 12 physical
 * expansions (Basic Land 31→42) are replayed with steeper costs and sparser
 * node grants each time.
 *
 * Everything here is pure (driven by `expansion` + `ascensionLevel`) so it can
 * be unit-tested and mirrors the BE (`domain/land/expansions/ascension.ts`) 1:1.
 */

/** Basic Land count a player arrives on swamp with (set by `upgradeFarm`). */
export const SWAMP_BASE_EXPANSION = 30;
/** Number of expansions available per ascension (Basic Land 31…42). */
export const SWAMP_EXPANSIONS_PER_ASCENSION = 12;
/** First / last Basic Land count that is a real swamp expansion. */
const SWAMP_FIRST_EXPANSION = SWAMP_BASE_EXPANSION + 1; // 31
const SWAMP_LAST_EXPANSION =
  SWAMP_BASE_EXPANSION + SWAMP_EXPANSIONS_PER_ASCENSION; // 42

/** Per-ascension cost multiplier — `cost = floor(base × 1.4^(a-1))`. */
const COST_GROWTH = 1.4;
/** Shape of the within-island cost curve across the 12 expansions. */
const COST_CURVE_EXPONENT = 1.3;
/** Drip widens by this fraction per ascension, then is capped at 12. */
const DRIP_WIDEN_PER_ASCENSION = 0.25;
const DRIP_CAP = SWAMP_EXPANSIONS_PER_ASCENSION; // 12
/** Each expansion's build time grows linearly: `e × 7h`. */
const HOURS_PER_EXPANSION = 7;

/**
 * Bumpkin level required to expand on swamp. Stubbed at 0 (no gate) until the
 * XP/level progression lands; wire the real per-expansion requirement then.
 */
// TODO: replace with the real level gate once swamp XP levels ship.
const SWAMP_EXPANSION_BUMPKIN_LEVEL = 0;

/**
 * Expected resource totals when a player first lands on swamp (Basic Land 30).
 * A curated floor, not derivable from layouts. Higher rows are this plus the
 * dripped nodes. Single source of truth — `expansions.ts` imports it from here.
 */
export const SWAMP_BASE_NODES: Nodes = {
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
};

/** `{ start, end }` of the cost curve for each charged resource + coins. */
const SWAMP_COST_CURVE = {
  Crimstone: { start: 30, end: 150 },
  Oil: { start: 50, end: 400 },
  Obsidian: { start: 3, end: 30 },
} as const;
const SWAMP_COIN_CURVE = { start: 5000, end: 75000 };

/**
 * Base drip rate per node type: how many expansions are needed before another
 * node of that type is granted (a node drops when `globalE % drip === 0`).
 * Sunstone has no drip — it stays pinned at the base floor forever.
 */
const SWAMP_NODE_DRIP: Record<keyof Nodes, number> = {
  "Crop Plot": 2,
  Tree: 4,
  "Stone Rock": 4,
  "Fruit Patch": 3,
  "Iron Rock": 6,
  "Gold Rock": 8,
  "Crimstone Rock": 5,
  "Oil Reserve": 8,
  "Lava Pit": 12,
  Beehive: 10,
  "Flower Bed": 10,
  "Sunstone Rock": 0,
};

/** Maps each node type to the `Layout` array it is placed into. */
const NODE_TO_LAYOUT_FIELD: Record<keyof Nodes, keyof Layout> = {
  "Crop Plot": "plots",
  Tree: "trees",
  "Stone Rock": "stones",
  "Iron Rock": "iron",
  "Gold Rock": "gold",
  "Crimstone Rock": "crimstones",
  "Sunstone Rock": "sunstones",
  "Fruit Patch": "fruitPatches",
  "Flower Bed": "flowerBeds",
  Beehive: "beehives",
  "Oil Reserve": "oilReserves",
  "Lava Pit": "lavaPits",
};

/**
 * Order nodes are placed in. Larger footprints first so they claim space before
 * the 1×1 fillers, which keeps the deterministic first-fit packing tight.
 */
const PLACEMENT_ORDER: (keyof Nodes)[] = [
  "Tree",
  "Fruit Patch",
  "Crimstone Rock",
  "Oil Reserve",
  "Lava Pit",
  "Sunstone Rock",
  "Flower Bed",
  "Crop Plot",
  "Stone Rock",
  "Iron Rock",
  "Gold Rock",
  "Beehive",
];

/** Local index 1…12 of a swamp expansion (Basic Land 31→1 … 42→12). */
const localExpansionIndex = (expansion: number): number =>
  expansion - SWAMP_BASE_EXPANSION;

/**
 * Global, monotonic expansion counter across every ascension:
 *   E = (BasicLandCount - 30) + (ascensionLevel - 1) × 12
 * `expansion` is the *post-increment* Basic Land count (31…42), so arrival
 * (count 30) maps to E = 0 — which is deliberately never evaluated for drips
 * (0 % anything === 0 would grant one of everything).
 */
export const getAscensionGlobalExpansion = (
  expansion: number,
  ascensionLevel: number,
): number =>
  localExpansionIndex(expansion) +
  (ascensionLevel - 1) * SWAMP_EXPANSIONS_PER_ASCENSION;

/** Effective drip for a node type at a given ascension (widened, then capped). */
export const getAscensionNodeDrip = (
  node: keyof Nodes,
  ascensionLevel: number,
): number => {
  const base = SWAMP_NODE_DRIP[node];
  if (base <= 0) return 0;
  const widened = Math.floor(
    base * (1 + DRIP_WIDEN_PER_ASCENSION * (ascensionLevel - 1)),
  );
  return Math.min(widened, DRIP_CAP);
};

/**
 * Nodes granted by a single swamp expansion. Each type drops at most one node
 * (the modulo check is binary). Returns `{}` for anything that is not a real
 * swamp expansion (Basic Land outside 31…42), so the E = 0 base row stays clean.
 */
export const getAscensionExpansionDelta = ({
  expansion,
  ascensionLevel,
}: {
  expansion: number;
  ascensionLevel: number;
}): Partial<Record<keyof Nodes, number>> => {
  const e = localExpansionIndex(expansion);
  if (e < 1 || e > SWAMP_EXPANSIONS_PER_ASCENSION) return {};

  const globalE = getAscensionGlobalExpansion(expansion, ascensionLevel);
  const delta: Partial<Record<keyof Nodes, number>> = {};

  getKeys(SWAMP_NODE_DRIP).forEach((node) => {
    const drip = getAscensionNodeDrip(node, ascensionLevel);
    if (drip > 0 && globalE % drip === 0) {
      delta[node] = 1;
    }
  });

  return delta;
};

const addDelta = (
  acc: Nodes,
  delta: Partial<Record<keyof Nodes, number>>,
): void => {
  getKeys(delta).forEach((node) => {
    acc[node] = (acc[node] ?? 0) + (delta[node] ?? 0);
  });
};

/**
 * Cumulative expected resource totals at a given swamp expansion + ascension.
 * Carries forward: base floor + every prior ascension's full 12-expansion drip
 * + the current ascension up to (and including) `expansion`. This matches the
 * wipe-and-top-up-to-base behaviour in `swampUpgrade`, where re-ascending keeps
 * the nodes already earned.
 */
export const getAscensionNodes = ({
  expansion,
  ascensionLevel,
}: {
  expansion: number;
  ascensionLevel: number;
}): Nodes => {
  const nodes: Nodes = { ...SWAMP_BASE_NODES };

  // Every prior ascension contributes its full 12 expansions.
  for (let prior = 1; prior < ascensionLevel; prior++) {
    for (let c = SWAMP_FIRST_EXPANSION; c <= SWAMP_LAST_EXPANSION; c++) {
      addDelta(
        nodes,
        getAscensionExpansionDelta({ expansion: c, ascensionLevel: prior }),
      );
    }
  }

  // The current ascension up to the requested expansion.
  const cap = Math.min(expansion, SWAMP_LAST_EXPANSION);
  for (let c = SWAMP_FIRST_EXPANSION; c <= cap; c++) {
    addDelta(
      nodes,
      getAscensionExpansionDelta({ expansion: c, ascensionLevel }),
    );
  }

  return nodes;
};

/**
 * Within-island cost curve, in full Decimal precision:
 *   start + (end - start) × ((e-1)/11)^1.3
 */
const swampCostBase = (start: number, end: number, e: number): Decimal =>
  new Decimal(start).plus(
    new Decimal(end - start).mul(
      new Decimal(e - 1)
        .div(SWAMP_EXPANSIONS_PER_ASCENSION - 1)
        .pow(COST_CURVE_EXPONENT),
    ),
  );

/**
 * Resource/coin/time requirements for a swamp expansion. `expansion` is the
 * post-increment Basic Land count (31…42). Returns `undefined` outside that
 * range. Costs scale `× 1.4^(a-1)`; resources are rounded to the nearest
 * integer and coins are rounded UP to the nearest 10 (all in Decimal). Build
 * time is `e × 7h`, ascension-invariant.
 */
export const getAscensionExpansionRequirements = ({
  expansion,
  ascensionLevel,
}: {
  expansion: number;
  ascensionLevel: number;
}): Requirements | undefined => {
  const e = localExpansionIndex(expansion);
  if (e < 1 || e > SWAMP_EXPANSIONS_PER_ASCENSION) return undefined;

  const multiplier = new Decimal(COST_GROWTH).pow(ascensionLevel - 1);

  // Resources round to the nearest integer; coins round UP to the nearest 10.
  const scaleResource = (base: Decimal): number =>
    base.mul(multiplier).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
  const scaleCoins = (base: Decimal): number =>
    base
      .mul(multiplier)
      .div(10)
      .toDecimalPlaces(0, Decimal.ROUND_UP)
      .mul(10)
      .toNumber();

  return {
    resources: {
      Crimstone: scaleResource(
        swampCostBase(
          SWAMP_COST_CURVE.Crimstone.start,
          SWAMP_COST_CURVE.Crimstone.end,
          e,
        ),
      ),
      Oil: scaleResource(
        swampCostBase(SWAMP_COST_CURVE.Oil.start, SWAMP_COST_CURVE.Oil.end, e),
      ),
      Obsidian: scaleResource(
        swampCostBase(
          SWAMP_COST_CURVE.Obsidian.start,
          SWAMP_COST_CURVE.Obsidian.end,
          e,
        ),
      ),
    },
    coins: scaleCoins(
      swampCostBase(SWAMP_COIN_CURVE.start, SWAMP_COIN_CURVE.end, e),
    ),
    seconds: e * HOURS_PER_EXPANSION * 60 * 60,
    bumpkinLevel: SWAMP_EXPANSION_BUMPKIN_LEVEL,
  };
};

/**
 * Deterministic, footprint-aware placement of a single expansion's dripped
 * nodes within its 6×6 land block. A node at `(x, y)` of size `w×h` occupies
 * `[x, x+w) × [y-h, y]` (matching the collision engine), and every footprint is
 * kept fully inside the local `[-3, 3] × [-3, 3]` block so it can never bleed
 * into a neighbouring expansion. First-fit from the top-left guarantees the same
 * coordinates on the client and server.
 */
export const getAscensionLayout = ({
  expansion,
  ascensionLevel,
}: {
  expansion: number;
  ascensionLevel: number;
}): Layout => {
  const layout: Layout = {
    id: `swamp_${expansion}`,
    plots: [],
    trees: [],
    stones: [],
    iron: [],
    gold: [],
    crimstones: [],
    sunstones: [],
    beehives: [],
    flowerBeds: [],
    fruitPatches: [],
    oilReserves: [],
    lavaPits: [],
  };

  const delta = getAscensionExpansionDelta({ expansion, ascensionLevel });
  const occupied = new Set<string>();

  const place = (width: number, height: number): Coordinates => {
    // Top-to-bottom, left-to-right. y is the top edge (extends down by height),
    // x the left edge (extends right by width).
    for (let y = 3; y - height >= -3; y--) {
      for (let x = -3; x + width <= 3; x++) {
        let fits = true;
        for (let i = 0; i < width && fits; i++) {
          for (let j = 0; j < height && fits; j++) {
            if (occupied.has(`${x + i},${y - j}`)) fits = false;
          }
        }
        if (fits) {
          for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
              occupied.add(`${x + i},${y - j}`);
            }
          }
          return { x, y };
        }
      }
    }
    // Should be unreachable: a single expansion's drip never fills the block.
    throw new Error(`Swamp layout: no room for ${width}x${height} node`);
  };

  PLACEMENT_ORDER.forEach((node) => {
    const count = delta[node] ?? 0;
    if (!count) return;
    const { width, height } = RESOURCE_DIMENSIONS[node as ResourceName];
    const field = NODE_TO_LAYOUT_FIELD[node];
    for (let k = 0; k < count; k++) {
      (layout[field] as Coordinates[]).push(place(width, height));
    }
  });

  return layout;
};

/** The full set of swamp expansion layouts (31…42) for a given ascension. */
export const ASCENSION_LAYOUTS = (
  ascensionLevel: number,
): Record<number, Layout> => {
  const layouts: Record<number, Layout> = {};
  for (let c = SWAMP_FIRST_EXPANSION; c <= SWAMP_LAST_EXPANSION; c++) {
    layouts[c] = getAscensionLayout({ expansion: c, ascensionLevel });
  }
  return layouts;
};
