import type { CaveMerchant, InventoryItemName } from "./game";
import { createCaveRandom } from "./cavePatch";
import { CAVE_MAX_TIER } from "./caveTiers";
import { getItemValue } from "./itemValue";
import { CAVE_MUD_CROPS } from "./caveRecipes";
import { ITEM_RECIPES } from "./itemValueSources";

// Both repos keep this file byte-identical.

/*
 * The Goblin Cave Merchant (Gloomwick) visits on a seeded schedule and brings
 * a different stock each visit. Every offer is a bridge between systems that
 * do not otherwise touch - Beetroot for Crimstone, Beetles for Obsidian,
 * Sunflowers for a Pizza Margherita - priced from in-game values
 * (`itemValue.ts`) and always in the player's favour, but in bulk: the point
 * is a scramble for the cost item while he is in town. The guard rails are
 * the 2-day window, a claim limit per visit, the bulk itself, that no cost
 * asks for more than a week of farming (`CAVE_MERCHANT_WEEKLY_GATHER`), and
 * that a reward item is never a cost item in the same visit (so nothing
 * loops).
 *
 * Everything derives from a visit index and nothing is stored, so the client
 * and the API agree without syncing, and the API regenerates the offer it is
 * asked to sell rather than trusting the client.
 */

const HOUR_MS = 60 * 60 * 1000;

/** Monday 2 November 2026, 00:00 UTC: the first visit opens here. */
export const CAVE_MERCHANT_EPOCH = Date.UTC(2026, 10, 2);

/** How long each visit lasts (#7721). */
export const CAVE_MERCHANT_STAY_MS = 48 * HOUR_MS;

/** Visits open 4 to 7 days apart, to the hour (Bryn, 2026-10-21). */
export const CAVE_MERCHANT_MIN_GAP_HOURS = 4 * 24;
export const CAVE_MERCHANT_MAX_GAP_HOURS = 7 * 24;

/**
 * A longer wait brings slightly better deals: reward value over cost value
 * is 1.10x after the shortest wait and 1.30x after the longest.
 */
export const CAVE_MERCHANT_MIN_GENEROSITY = 1.1;
export const CAVE_MERCHANT_MAX_GENEROSITY = 1.3;

/** One offer in four is a curiosity - cooked food or a tool - not a resource. */
export const CAVE_MERCHANT_CURIOSITY_CHANCE = 0.25;

/** The schedule walks at most this far: ~220 years of 4-day gaps. */
const MAX_VISITS = 20_000;

/**
 * Reward counts read as round numbers: 10 Iron, not 9. The largest is the
 * most of one item an offer hands over.
 */
const REWARD_AMOUNTS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];

export type CaveMerchantVisit = {
  /** Visits count from 0 at the epoch. */
  index: number;
  opensAt: number;
  closesAt: number;
  /** Hours since the previous visit opened; the shortest gap for visit 0. */
  waitHours: number;
  nextOpensAt: number;
};

export type CaveMerchantLane =
  | "crops"
  | "fruit"
  | "produce"
  | "cave"
  | "resources";

export type CaveMerchantOffer = {
  /** 1-based; Cave tier N stocks slots 1..N. */
  slot: number;
  cost: { item: InventoryItemName; amount: number };
  reward: { item: InventoryItemName; amount: number };
  /** Claims per player per visit. */
  limit: number;
  curiosity: boolean;
  /** Reward value over cost value, after rounding the cost down. */
  generosity: number;
};

// ---------------------------------------------------------------------------
// Seeding

/** lowbias32: a well-mixed 32-bit hash, integer-only so every engine agrees. */
function hash32(input: number): number {
  let x = input >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return (x ^ (x >>> 16)) >>> 0;
}

/** A visit's 128-bit Cave seed, from its index alone. */
export function getCaveMerchantSeed(visit: number): string {
  return [0, 1, 2, 3]
    .map((word) => hash32(Math.imul(visit, 4) + word + 0x5eed))
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
}

/**
 * A visit's random stream. The first draw is always the gap to the next
 * visit, so the schedule and the offers come from one seed.
 */
function openVisit(visit: number): { random: () => number; gapHours: number } {
  const random = createCaveRandom(getCaveMerchantSeed(visit));
  const span = CAVE_MERCHANT_MAX_GAP_HOURS - CAVE_MERCHANT_MIN_GAP_HOURS + 1;
  const gapHours = CAVE_MERCHANT_MIN_GAP_HOURS + Math.floor(random() * span);
  return { random, gapHours };
}

// ---------------------------------------------------------------------------
// Schedule

/**
 * The latest visit that has opened by `now` (visit 0 before the epoch, so
 * there is always a next opening to count down to). Open or not is
 * `isCaveMerchantOpen`.
 */
export function getCaveMerchantVisit(now: number): CaveMerchantVisit {
  let index = 0;
  let opensAt = CAVE_MERCHANT_EPOCH;
  let waitHours = CAVE_MERCHANT_MIN_GAP_HOURS;

  for (;;) {
    const { gapHours } = openVisit(index);
    const nextOpensAt = opensAt + gapHours * HOUR_MS;

    if (now < nextOpensAt || index >= MAX_VISITS - 1) {
      return {
        index,
        opensAt,
        closesAt: opensAt + CAVE_MERCHANT_STAY_MS,
        waitHours,
        nextOpensAt,
      };
    }

    index += 1;
    opensAt = nextOpensAt;
    waitHours = gapHours;
  }
}

export function isCaveMerchantOpen(
  visit: CaveMerchantVisit,
  now: number,
): boolean {
  return now >= visit.opensAt && now < visit.closesAt;
}

/** Reward value over cost value for a visit, from how long the wait was. */
export function getCaveMerchantGenerosity(waitHours: number): number {
  const span = CAVE_MERCHANT_MAX_GAP_HOURS - CAVE_MERCHANT_MIN_GAP_HOURS;
  const t = Math.min(
    1,
    Math.max(0, (waitHours - CAVE_MERCHANT_MIN_GAP_HOURS) / span),
  );
  return (
    CAVE_MERCHANT_MIN_GENEROSITY +
    (CAVE_MERCHANT_MAX_GENEROSITY - CAVE_MERCHANT_MIN_GENEROSITY) * t
  );
}

// ---------------------------------------------------------------------------
// Stock tables

/**
 * What a slot is worth (reward value, in coins at the crop sell-price scale)
 * and how many times it can be claimed per visit. Slot N needs Cave tier N,
 * so the deep tiers see the Obsidian class bridges. The top band is sized so
 * a week of most lanes can pay for it (see `CAVE_MERCHANT_WEEKLY_GATHER`):
 * Sunstone (12,000) is above it on purpose, nothing grows that fast.
 */
export const CAVE_MERCHANT_BANDS: {
  minValue: number;
  maxValue: number;
  limit: number;
}[] = [
  { minValue: 100, maxValue: 250, limit: 3 },
  { minValue: 200, maxValue: 500, limit: 3 },
  { minValue: 400, maxValue: 900, limit: 2 },
  { minValue: 750, maxValue: 1_500, limit: 2 },
  { minValue: 1_250, maxValue: 2_500, limit: 2 },
  { minValue: 2_000, maxValue: 4_000, limit: 1 },
  { minValue: 3_000, maxValue: 6_000, limit: 1 },
  { minValue: 5_000, maxValue: 10_000, limit: 1 },
];

/**
 * What the Merchant sells, and which cost lane each belongs to (an offer's
 * cost never comes from its reward's own lane). Never a Beetle - the Merchant
 * is where Beetles are spent (spec v0.4) - and never a Pig resource: Pig
 * Bristles are the Pig's own sink.
 */
const REWARDS: { item: InventoryItemName; lane?: CaveMerchantLane }[] = [
  { item: "Iron", lane: "resources" },
  { item: "Gold", lane: "resources" },
  { item: "Crimstone", lane: "resources" },
  { item: "Oil", lane: "resources" },
  { item: "Obsidian", lane: "resources" },
  { item: "Leather", lane: "produce" },
  { item: "Milk", lane: "produce" },
  { item: "Wool", lane: "produce" },
  { item: "Merino Wool", lane: "produce" },
  { item: "Honey", lane: "produce" },
  { item: "Truffle" },
  { item: "Magic Mushroom", lane: "cave" },
  { item: "Sand Drill" },
];

const REWARD_ITEMS = new Set(REWARDS.map(({ item }) => item));

/** The tools he sometimes has a crate of. Explicit, so the repos agree. */
const CURIOSITY_TOOLS: InventoryItemName[] = [
  "Axe",
  "Pickaxe",
  "Stone Pickaxe",
  "Iron Pickaxe",
  "Gold Pickaxe",
  "Oil Drill",
  "Sand Shovel",
];

/**
 * The curiosities: every cooked dish past the Fire Pit (the beginner tier is
 * no prize), plus the tools above, sorted by name so the pool's order never
 * depends on a table's order.
 */
const CURIOSITIES: InventoryItemName[] = [
  ...(Object.keys(ITEM_RECIPES) as InventoryItemName[]).filter(
    (item) =>
      ITEM_RECIPES[item]?.kind === "food" &&
      ITEM_RECIPES[item]?.building !== "Fire Pit",
  ),
  ...CURIOSITY_TOOLS,
]
  .filter((item) => !REWARD_ITEMS.has(item) && getItemValue(item) !== undefined)
  .sort();

/**
 * What the player pays with, by lane, with the bulk each lane asks for: at
 * least `minAmount` of the item (the ceiling is per item, below). Crops are
 * the Cave's own crop list (no event crops such as Saltwort) and fruit leaves
 * out the Full Moon three, so every cost can be grown any week.
 */
export const CAVE_MERCHANT_LANES: Record<
  CaveMerchantLane,
  { items: InventoryItemName[]; minAmount: number }
> = {
  crops: {
    items: Object.keys(CAVE_MUD_CROPS) as InventoryItemName[],
    minAmount: 100,
  },
  fruit: {
    items: [
      "Tomato",
      "Lemon",
      "Blueberry",
      "Orange",
      "Apple",
      "Banana",
      "Grape",
    ],
    minAmount: 25,
  },
  produce: {
    items: [
      "Egg",
      "Feather",
      "Wool",
      "Merino Wool",
      "Milk",
      "Leather",
      "Honey",
    ],
    minAmount: 5,
  },
  cave: {
    items: [
      "Mud",
      "Wild Mushroom",
      "Green Beetle",
      "Blue Beetle",
      "Pink Beetle",
      "Amber Beetle",
    ],
    minAmount: 5,
  },
  resources: {
    items: ["Wood", "Stone", "Iron", "Gold", "Crimstone", "Oil"],
    minAmount: 5,
  },
};

const LANE_NAMES = Object.keys(CAVE_MERCHANT_LANES) as CaveMerchantLane[];

/**
 * The most of an item one offer can ask for: about a week of it from a full
 * Desert farm with no boosts, so no cost takes longer to farm from nothing
 * than the gap between visits (Bryn, 2026-10-21). Full Desert is 65 plots,
 * 15 fruit patches, 23 trees, 20 Stone, 12 Iron, 7 Gold, 4 Crimstone and
 * 3 Oil Reserves (`TOTAL_EXPANSION_NODES`), with 20-animal houses and
 * 3 Beehives.
 *
 * Crops: 65 plots x 168h / harvest hours, rounded, capped at 10,000 (the
 * clicks, not the plots, are the limit for the fast crops); Rice and Olive
 * from the Greenhouse's 4 pots. Fruit: 15 patches at the plant time (3 picks
 * a planting). Produce: a daily drop per animal, secondaries at a third.
 * Resources: nodes x recoveries a week; Oil at 10 per 20h drill. Cave: Myco
 * Bin batches every 12h (Mud recipe 40 Mud; Beetle recipe 5 Beetles at the
 * tier weights) plus the island's 5 Wild Mushrooms per 16h.
 */
export const CAVE_MERCHANT_WEEKLY_GATHER: Partial<
  Record<InventoryItemName, number>
> = {
  Sunflower: 10_000,
  Potato: 10_000,
  Rhubarb: 10_000,
  Pumpkin: 10_000,
  Zucchini: 10_000,
  Carrot: 10_000,
  Yam: 10_000,
  Cabbage: 5_000,
  Broccoli: 5_000,
  Soybean: 3_500,
  Beetroot: 2_500,
  Pepper: 2_500,
  Cauliflower: 1_300,
  Parsnip: 900,
  Eggplant: 650,
  Corn: 500,
  Onion: 500,
  Wheat: 450,
  Turnip: 450,
  Radish: 450,
  Kale: 300,
  Artichoke: 300,
  Barley: 220,
  Rice: 20,
  Olive: 15,

  Tomato: 1_000,
  Lemon: 600,
  Blueberry: 400,
  Orange: 300,
  Apple: 200,
  Banana: 200,
  Grape: 50,

  Egg: 150,
  Feather: 50,
  Wool: 70,
  "Merino Wool": 25,
  Milk: 70,
  Leather: 25,
  Honey: 20,

  Mud: 500,
  "Wild Mushroom": 120,
  "Green Beetle": 30,
  "Blue Beetle": 20,
  "Pink Beetle": 15,
  "Amber Beetle": 7,

  Wood: 2_000,
  Stone: 800,
  Iron: 250,
  Gold: 50,
  Crimstone: 30,
  Oil: 250,
};

// ---------------------------------------------------------------------------
// Generation

/** Costs read as round numbers: 15, 30, 200, 800, 1,000. */
const ROUND_COSTS = [1, 1.5, 2, 3, 4, 5, 6, 8];

/** Rounds down to the nearest round number, so 2,347 reads as 2,000. */
export function roundCostDown(amount: number): number {
  if (amount < 1) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(amount));
  const leading = amount / magnitude;
  const step = [...ROUND_COSTS].reverse().find((n) => n <= leading + 1e-9) ?? 1;
  return Math.round(step * magnitude);
}

/** Everything that goes into an item, down through its recipe. */
function ingredientsOf(item: InventoryItemName): Set<InventoryItemName> {
  const found = new Set<InventoryItemName>();
  const walk = (name: InventoryItemName) => {
    for (const ingredient of Object.keys(
      ITEM_RECIPES[name]?.ingredients ?? {},
    )) {
      if (found.has(ingredient as InventoryItemName)) continue;
      found.add(ingredient as InventoryItemName);
      walk(ingredient as InventoryItemName);
    }
  };
  walk(item);
  return found;
}

/**
 * Which lanes may pay for a reward. A dish is never bought with crops or
 * fruit (that is cooking with extra steps, and lets the player price it
 * apples to apples); Truffles are never bought with crops (that is feeding
 * the Pigs with extra steps). Produce, resources and the Cave for both.
 */
function costLanesFor(reward: RewardDraw): CaveMerchantLane[] {
  const dish = ITEM_RECIPES[reward.item]?.kind === "food";
  return LANE_NAMES.filter(
    (lane) =>
      lane !== reward.lane &&
      !(dish && (lane === "crops" || lane === "fruit")) &&
      !(reward.item === "Truffle" && lane === "crops"),
  );
}

/** Draws an index in [0, length). */
const pick = (random: () => number, length: number) =>
  Math.min(length - 1, Math.floor(random() * length));

type RewardDraw = {
  item: InventoryItemName;
  amount: number;
  value: number;
  lane?: CaveMerchantLane;
  curiosity: boolean;
};

/** The round reward amounts of `item` that land inside a band's value range. */
function rewardAmounts(
  item: InventoryItemName,
  band: (typeof CAVE_MERCHANT_BANDS)[number],
): number[] | undefined {
  const value = getItemValue(item);
  if (value === undefined || value <= 0) return undefined;

  const min = Math.max(1, Math.ceil(band.minValue / value));
  const max = Math.floor(band.maxValue / value);
  const amounts = REWARD_AMOUNTS.filter((n) => n >= min && n <= max);

  return amounts.length > 0 ? amounts : undefined;
}

function drawReward(random: () => number, slot: number): RewardDraw {
  const band = CAVE_MERCHANT_BANDS[slot - 1];
  const curiosity = random() < CAVE_MERCHANT_CURIOSITY_CHANCE;

  const pool = (
    curiosity ? CURIOSITIES.map((item) => ({ item, lane: undefined })) : REWARDS
  )
    .map((reward) => ({ ...reward, amounts: rewardAmounts(reward.item, band) }))
    .filter((reward) => reward.amounts !== undefined);

  // Every band has regular rewards; fall back to them if no curiosity fits.
  const candidates =
    pool.length > 0
      ? pool
      : REWARDS.map((reward) => ({
          ...reward,
          amounts: rewardAmounts(reward.item, band),
        })).filter((reward) => reward.amounts !== undefined);

  const chosen = candidates[pick(random, candidates.length)];
  const amounts = chosen.amounts as number[];
  const amount = amounts[pick(random, amounts.length)];

  return {
    item: chosen.item,
    amount,
    value: (getItemValue(chosen.item) as number) * amount,
    lane: chosen.lane,
    curiosity: pool.length > 0 && curiosity,
  };
}

type CostDraw = {
  item: InventoryItemName;
  amount: number;
  lane: CaveMerchantLane;
};

/**
 * The cost for a reward: a lane other than the reward's (`costLanesFor`),
 * then an item in it, never one of the reward's own ingredients, whose bulk
 * is at least the lane's floor and at most a week's gathering. Lanes are
 * drawn evenly, so the crop lane's size does not drown out the others.
 */
function drawCost(
  random: () => number,
  reward: RewardDraw,
  generosity: number,
  excluded: Set<InventoryItemName>,
): CostDraw {
  const ingredients = ingredientsOf(reward.item);
  const options = costLanesFor(reward).map((lane) => ({
    lane,
    items: CAVE_MERCHANT_LANES[lane].items.flatMap((item) => {
      if (excluded.has(item) || ingredients.has(item)) return [];
      const value = getItemValue(item);
      if (value === undefined || value <= 0) return [];
      const amount = roundCostDown(reward.value / (generosity * value));
      const { minAmount } = CAVE_MERCHANT_LANES[lane];
      const maxAmount = CAVE_MERCHANT_WEEKLY_GATHER[item] ?? 0;
      return amount >= minAmount && amount <= maxAmount
        ? [{ item, amount }]
        : [];
    }),
  }));

  const lanes = options.filter((option) => option.items.length > 0);
  // Two draws whether or not a lane fits, so later slots never shift.
  const laneRoll = random();
  const itemRoll = random();

  if (lanes.length === 0) {
    // Nothing lands in bulk: take the cheapest allowed item at a sane amount.
    // The invariant test sweeps visits so this path should never be reached.
    const fallback = options
      .flatMap(({ lane }) =>
        CAVE_MERCHANT_LANES[lane].items
          .filter(
            (item) =>
              !excluded.has(item) &&
              !ingredients.has(item) &&
              getItemValue(item),
          )
          .map((item) => ({ lane, item, value: getItemValue(item) as number })),
      )
      .sort((a, b) => a.value - b.value)[0];
    const amount = Math.max(
      1,
      roundCostDown(reward.value / (generosity * fallback.value)),
    );
    return { item: fallback.item, amount, lane: fallback.lane };
  }

  const lane =
    lanes[Math.min(lanes.length - 1, Math.floor(laneRoll * lanes.length))];
  const choice =
    lane.items[
      Math.min(lane.items.length - 1, Math.floor(itemRoll * lane.items.length))
    ];

  return { ...choice, lane: lane.lane };
}

const offerCache = new Map<number, CaveMerchantOffer[]>();

/**
 * All eight offers of a visit, slot 1 to 8. Rewards are drawn first for every
 * slot, then costs, so a reward item is never a cost item in the same visit.
 * Computed, not stored: both repos derive the same stock from the index.
 */
export function getCaveMerchantOffers(visit: number): CaveMerchantOffer[] {
  const cached = offerCache.get(visit);
  if (cached) return cached;

  const { random } = openVisit(visit);
  // The wait before this visit is the previous visit's gap.
  const waitHours =
    visit === 0 ? CAVE_MERCHANT_MIN_GAP_HOURS : openVisit(visit - 1).gapHours;
  const generosity = getCaveMerchantGenerosity(waitHours);

  const rewards = CAVE_MERCHANT_BANDS.map((_, index) =>
    drawReward(random, index + 1),
  );
  const excluded = new Set(rewards.map((reward) => reward.item));

  const offers = rewards.map((reward, index): CaveMerchantOffer => {
    const cost = drawCost(random, reward, generosity, excluded);
    const costValue = (getItemValue(cost.item) as number) * cost.amount;

    return {
      slot: index + 1,
      cost: { item: cost.item, amount: cost.amount },
      reward: { item: reward.item, amount: reward.amount },
      limit: CAVE_MERCHANT_BANDS[index].limit,
      curiosity: reward.curiosity,
      generosity: reward.value / costValue,
    };
  });

  offerCache.set(visit, offers);
  return offers;
}

/** The offers a Cave tier can see: slots 1..tier. */
export function getCaveMerchantStock(
  visit: number,
  tier: number,
): CaveMerchantOffer[] {
  const slots = Math.max(0, Math.min(CAVE_MAX_TIER, Math.floor(tier)));
  return getCaveMerchantOffers(visit).slice(0, slots);
}

/** How many more times the player can take an offer this visit. */
export function getCaveMerchantOffersLeft({
  merchant,
  visit,
  slot,
  limit,
}: {
  merchant?: CaveMerchant;
  visit: number;
  slot: number;
  limit: number;
}): number {
  const bought = merchant?.purchases[String(visit)]?.[slot] ?? 0;
  return Math.max(0, limit - bought);
}
