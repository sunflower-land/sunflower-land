import Decimal from "decimal.js-light";
import type { Layout, Requirements } from "features/game/types/expansions";
import type { Nodes } from "features/game/expansion/lib/expansionNodes";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

import {
  RESOURCE_DIMENSIONS,
  type ResourceName,
} from "features/game/types/resources";
import type { IslandType } from "features/game/types/game";
import { getKeys } from "lib/object";
import {
  LEVELS_PER_ASCENSION,
  type LevelRequirement,
} from "features/game/lib/level";

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
const COST_GROWTH = 1.3;
/** Shape of the within-island cost curve across the 12 expansions. */
const COST_CURVE_EXPONENT = 1.3;
/** Drip widens by this fraction per ascension, then is capped at 12. */
const DRIP_WIDEN_PER_ASCENSION = 0.25;
const DRIP_CAP = SWAMP_EXPANSIONS_PER_ASCENSION; // 12
/** Each expansion's build time grows linearly: `e × 7h`. */
const HOURS_PER_EXPANSION = 7;

/**
 * Ascension Crystal grants — a bolt-on resource, deliberately kept OUT of the
 * drip model (`SWAMP_NODE_DRIP`/`SWAMP_BASE_NODES` stay 0 for it). Crystals are
 * single-use (mined once for shards), so they are reconciled additively rather
 * than via the cumulative `getAscensionNodes` floor (which would resurrect spent
 * crystals through the `upgradeFarm` `minimum` top-up). See ASCENSION_SYSTEM.md.
 *
 * Schedule:
 * - A0 (pre-ascension): 1 crystal on each spring/desert/volcano upgrade
 *   (cumulative-by-island below; ascension islands inherit the full 3).
 * - Per ascension A: 1 at the upgrade + 1 on each of the first
 *   `min(A + 2, 12)` expansions of the band.
 */
const A0_CRYSTALS_BY_ISLAND: Record<IslandType, number> = {
  basic: 0,
  spring: 1,
  desert: 2,
  volcano: 3,
  swamp: 3,
  spooky: 3,
  crystal: 3,
  moon: 3,
  marble: 3,
};

/** Expansion crystals granted across one ascension band: `min(A + 2, 12)`. */
const getBandExpansionCrystalTotal = (ascensionLevel: number): number =>
  Math.min(ascensionLevel + 2, SWAMP_EXPANSIONS_PER_ASCENSION);

/**
 * Crystals placed by revealing the expansion that brings the farm to
 * `expansion` Basic Land tiles: 1 for each of the band's first `min(A+2,12)`
 * expansions, otherwise 0 (and 0 off an ascension island).
 */
export const getExpansionCrystalCount = ({
  ascensionLevel,
  expansion,
}: {
  ascensionLevel: number;
  expansion: number;
}): number => {
  const a = ascensionLevel ?? 0;
  if (a < 1) return 0;
  const e = expansion - SWAMP_BASE_EXPANSION; // 1..12
  if (e < 1 || e > SWAMP_EXPANSIONS_PER_ASCENSION) return 0;
  return e <= getBandExpansionCrystalTotal(a) ? 1 : 0;
};

/**
 * Cumulative Ascension Crystals a player should have earned by their current
 * progression. Single source of truth: forward placement increments inventory
 * by this function's first-difference; `revealLand`'s missing-node airdrop
 * backfills the remainder (legacy players who progressed before the feature).
 */
export const getExpectedAscensionCrystals = ({
  islandType,
  ascensionLevel,
  basicLand,
}: {
  islandType: IslandType;
  ascensionLevel: number;
  basicLand: number;
}): number => {
  let total = A0_CRYSTALS_BY_ISLAND[islandType] ?? 0;

  const a = ascensionLevel ?? 0;
  // Every completed prior ascension granted 1 (upgrade) + its expansion nodes.
  for (let prior = 1; prior < a; prior++) {
    total += 1 + getBandExpansionCrystalTotal(prior);
  }
  // Current band: the upgrade node + the expansion nodes earned so far.
  if (a >= 1) {
    const e = Math.max(
      0,
      Math.min(
        basicLand - SWAMP_BASE_EXPANSION,
        SWAMP_EXPANSIONS_PER_ASCENSION,
      ),
    );
    total += 1 + Math.min(e, getBandExpansionCrystalTotal(a));
  }
  return total;
};

/**
 * Within-ascension level (1..50, from `getAscensionLevel`) required to unlock each
 * swamp expansion, keyed by local expansion index 1..12 (Basic Land 31→1 … 42→12).
 * The gate is compared against the player's within-ascension level (not the legacy
 * Bumpkin level) — see the ascension-aware check in `expandLand`. Reaching level 50
 * completes the band (ready to ascend into the next one).
 */
export const SWAMP_EXPANSION_LEVELS: Record<number, number> = {
  1: 1,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
  6: 20,
  7: 24,
  8: 28,
  9: 32,
  10: 36,
  11: 40,
  12: 45,
};

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
  "Ascension Crystal": 0,
};

/** `{ start, end }` of the cost curve for each charged resource + coins. */
const SWAMP_COST_CURVE = {
  Crimstone: { start: 10, end: 50 },
  Oil: { start: 50, end: 400 },
  Obsidian: { start: 2, end: 20 },
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
  "Crimstone Rock": 8,
  "Oil Reserve": 12,
  "Lava Pit": 16,
  Beehive: 10,
  "Flower Bed": 10,
  "Sunstone Rock": 10,
  "Ascension Crystal": 0,
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
  "Ascension Crystal": "ascensionCrystals",
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

const NO_DRIP_CAP_NODES: (keyof Nodes)[] = [
  "Beehive",
  "Flower Bed",
  "Oil Reserve",
  "Crimstone Rock",
  "Lava Pit",
];

/** Local index 1…12 of a swamp expansion (Basic Land 31→1 … 42→12). */
const localExpansionIndex = (expansion: number): number =>
  expansion - SWAMP_BASE_EXPANSION;

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

  if (NO_DRIP_CAP_NODES.includes(node)) {
    return widened;
  }

  return Math.min(widened, DRIP_CAP);
};

/**
 * Total nodes of a type granted over one ascension's 12 expansions — the count
 * of multiples of the effective drip in the ascension's global window. This is
 * the unchanged "node formula": it equals the old sum of `globalE % drip === 0`.
 */
const getAscensionNodeTotal = (
  node: keyof Nodes,
  ascensionLevel: number,
): number => {
  const drip = getAscensionNodeDrip(node, ascensionLevel);
  if (drip <= 0) return 0;
  const span = SWAMP_EXPANSIONS_PER_ASCENSION;
  return (
    Math.floor((ascensionLevel * span) / drip) -
    Math.floor(((ascensionLevel - 1) * span) / drip)
  );
};

/** (√5 − 1) / 2 — a per-type phase that decorrelates equal-count nodes. */
const GOLDEN_RATIO = 0.6180339887498949;

/**
 * Deals each ascension's dripped nodes *evenly* across its 12 expansions: each
 * expansion gets ⌊N/12⌋…⌈N/12⌉ of the ascension's N nodes — never overloaded, and
 * never empty while N ≥ 12 (which holds across the live ascension range, a ≤ 5).
 * This replaces the old `E % drip` placement that piled the cap-12 nodes
 * (Lava/Beehive/Flower) onto expansion 42.
 *
 * Per-type totals are exactly `getAscensionNodeTotal` (the node formula is
 * unchanged); only *which* expansion each node lands on changes. Returns one
 * delta per local expansion (index 0 = Basic Land 31). Deterministic — pure
 * arithmetic plus a stable sort with an explicit tie-break — so FE and BE agree.
 */
const buildAscensionSchedule = (
  ascensionLevel: number,
): Partial<Record<keyof Nodes, number>>[] => {
  const span = SWAMP_EXPANSIONS_PER_ASCENSION;

  // Spread each type's instances evenly in [0, 1); the golden-ratio per-type
  // phase keeps equal-count types from landing on the same slots. Flower Bed is
  // not dealt on its own — it rides along with Beehive so the two always unlock
  // in the same expansion (they share a drip rate, so their counts always match).
  const items: { pos: number; node: keyof Nodes; tie: number }[] = [];
  getKeys(SWAMP_NODE_DRIP).forEach((node, t) => {
    if (node === "Flower Bed") return;
    const count = getAscensionNodeTotal(node, ascensionLevel);
    const phase = (t * GOLDEN_RATIO) % 1;
    for (let i = 0; i < count; i++) {
      items.push({ pos: (i + phase) / count, node, tie: t });
    }
  });

  items.sort((a, b) => a.pos - b.pos || a.tie - b.tie);

  // Deal by rank: each expansion gets floor(N/span)…ceil(N/span) nodes.
  const schedule: Partial<Record<keyof Nodes, number>>[] = Array.from(
    { length: span },
    () => ({}),
  );
  items.forEach((item, k) => {
    const slot = Math.floor((k * span) / items.length); // 0…span-1
    schedule[slot][item.node] = (schedule[slot][item.node] ?? 0) + 1;
    // Beehive and Flower Bed unlock together as a pair.
    if (item.node === "Beehive") {
      schedule[slot]["Flower Bed"] = (schedule[slot]["Flower Bed"] ?? 0) + 1;
    }
  });

  return schedule;
};

/**
 * Memoized `buildAscensionSchedule` — the schedule is pure and keyed only by
 * ascension level, but `getAscensionNodes` rebuilds it once per prior ascension.
 * Callers only read the returned deltas, so sharing cached references is safe.
 */
const scheduleCache = new Map<number, Partial<Record<keyof Nodes, number>>[]>();

const getAscensionSchedule = (
  ascensionLevel: number,
): Partial<Record<keyof Nodes, number>>[] => {
  const cached = scheduleCache.get(ascensionLevel);
  if (cached) return cached;

  const schedule = buildAscensionSchedule(ascensionLevel);
  scheduleCache.set(ascensionLevel, schedule);
  return schedule;
};

/**
 * Nodes granted by a single swamp expansion — the evenly-dealt schedule slot.
 * Returns `{}` for anything that is not a real swamp expansion (Basic Land
 * outside 31…42), so the E = 0 base row stays clean.
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
  return getAscensionSchedule(ascensionLevel)[e - 1];
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
    getAscensionSchedule(prior).forEach((delta) => addDelta(nodes, delta));
  }

  // The current ascension up to (and including) the requested expansion.
  const cap = Math.min(
    localExpansionIndex(expansion),
    SWAMP_EXPANSIONS_PER_ASCENSION,
  );
  const schedule = getAscensionSchedule(ascensionLevel);
  for (let e = 1; e <= cap; e++) {
    addDelta(nodes, schedule[e - 1]);
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
    bumpkinLevel: {
      ascension: ascensionLevel,
      level: SWAMP_EXPANSION_LEVELS[e] ?? LEVELS_PER_ASCENSION,
    } satisfies LevelRequirement,
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
    id: `swamp_${ascensionLevel}_${expansion}`,
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
    ascensionCrystals: [],
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

  // Ascension Crystals are placed outside the drip schedule (see helpers above):
  // 1 on each of the band's first `min(A+2,12)` expansions.
  const crystals = getExpansionCrystalCount({ ascensionLevel, expansion });
  const crystalDimensions = RESOURCE_DIMENSIONS["Ascension Crystal"];
  for (let k = 0; k < crystals; k++) {
    layout.ascensionCrystals!.push(
      place(crystalDimensions.width, crystalDimensions.height),
    );
  }

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
