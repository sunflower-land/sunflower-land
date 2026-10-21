import Decimal from "decimal.js-light";
import type { InventoryItemName, PigFeedName } from "./game";

// Both repos keep this file byte-identical.

export type { PigFeedName };

export type PigFeed = {
  /** The feeding tier (#7721): a Pig's favourite moves up a tier with level. */
  tier: 1 | 2 | 3 | 4;
  /**
   * What one Slop costs: ONE item from this list, in its own quantity. The
   * quantities are #7721's "quantity per feeding action", and a Pig eats one
   * Slop per feeding. Read a mix's cost through `getPigFeedIngredients`.
   */
  ingredients: Partial<Record<InventoryItemName, number>>;
};

// The fish lists are spelled out rather than read from `getFishNamesByTier`:
// fishing.ts pulls in half the game, and this table is loaded by the animal
// types. pigFeeds.test.ts checks they match the fishing tiers.
const BASIC_FISH = [
  "Anchovy",
  "Butterflyfish",
  "Blowfish",
  "Clownfish",
  "Sea Bass",
  "Sea Horse",
  "Horse Mackerel",
  "Halibut",
  "Squid",
  "Porgy",
  "Muskellunge",
] as const satisfies readonly InventoryItemName[];

const ADVANCED_AND_EXPERT_FISH = [
  "Red Snapper",
  "Moray Eel",
  "Olive Flounder",
  "Napoleanfish",
  "Surgeonfish",
  "Angelfish",
  "Zebra Turkeyfish",
  "Ray",
  "Hammerhead shark",
  "Barred Knifejaw",
  "Walleye",
  "Rock Blackfish",
  "Tilapia",
  "Tuna",
  "Mahi Mahi",
  "Blue Marlin",
  "Oarfish",
  "Football fish",
  "Sunfish",
  "Coelacanth",
  "Parrotfish",
  "Whale Shark",
  "Saw Shark",
  "White Shark",
  "Cobia",
  "Trout",
  "Weakfish",
] as const satisfies readonly InventoryItemName[];

/** Every pot-caught crustacean but Isopod and Barnacle, which are tier 3. */
const TIER_4_CRUSTACEANS = [
  "Blue Crab",
  "Lobster",
  "Hermit Crab",
  "Shrimp",
  "Mussel",
  "Oyster",
  "Anemone",
  "Sea Slug",
  "Sea Snail",
  "Garden Eel",
  "Sea Grapes",
  "Octopus",
  "Sea Urchin",
  "Horseshoe Crab",
] as const satisfies readonly InventoryItemName[];

const each = (quantity: number, items: readonly InventoryItemName[]) =>
  Object.fromEntries(items.map((item) => [item, quantity])) as Partial<
    Record<InventoryItemName, number>
  >;

/**
 * The four Pig feeds (#7721 Generic Pig feeding). Crop and fruit quantities
 * follow the spec's weight = sqrt(seed price x grow minutes) rule, anchored on
 * 20 Carrots / 6 Cauliflower / 2 Wheat: #7721's 10 / 3 / 1 anchors doubled
 * (Bryn, 2026-10-21) so a crop-fed Pig costs roughly half to four fifths of a
 * Cow rather than a fifth to two fifths. The foraged lanes (fish, mushrooms,
 * crustaceans) stay at one item: they are time-gated, not seed-priced, and
 * cross-system feeding is the point of them. Items not listed (event crops
 * such as Saltwort and Crystal Leaf, marine marvels, chapter fish) are not
 * Pig food.
 */
export const PIG_FEEDS: Record<PigFeedName, PigFeed> = {
  "Basic Slop": {
    tier: 1,
    ingredients: {
      Sunflower: 1000,
      Potato: 160,
      Rhubarb: 80,
      Pumpkin: 40,
      Zucchini: 40,
      Carrot: 20,
      Yam: 20,
      Cabbage: 10,
      Broccoli: 10,
      Soybean: 6,
    },
  },
  "Hearty Slop": {
    tier: 2,
    ingredients: {
      Beetroot: 10,
      Pepper: 10,
      Cauliflower: 6,
      Parsnip: 4,
      Tomato: 18,
      Lemon: 8,
      Blueberry: 4,
    },
  },
  "Rich Slop": {
    tier: 3,
    ingredients: {
      ...each(2, [
        "Eggplant",
        "Corn",
        "Onion",
        "Wheat",
        "Turnip",
        "Radish",
        "Kale",
        "Artichoke",
        "Barley",
        "Orange",
        "Apple",
        "Banana",
      ]),
      ...each(1, [...BASIC_FISH, "Wild Mushroom", "Isopod", "Barnacle"]),
    },
  },
  "Gourmet Slop": {
    tier: 4,
    ingredients: {
      ...each(2, [
        "Rice",
        "Olive",
        "Grape",
        "Celestine",
        "Lunara",
        "Duskberry",
      ]),
      ...each(1, [
        ...ADVANCED_AND_EXPERT_FISH,
        "Magic Mushroom",
        ...TIER_4_CRUSTACEANS,
      ]),
    },
  },
};

/** Own-key check, so inherited names like "constructor" never pass. */
export function isPigFeed(item: unknown): item is PigFeedName {
  return (
    typeof item === "string" &&
    Object.prototype.hasOwnProperty.call(PIG_FEEDS, item)
  );
}

/** True when `item` is one of the inputs a Slop can be mixed from. */
export function isPigFeedIngredient(
  feed: PigFeedName,
  item: unknown,
): item is InventoryItemName {
  return (
    typeof item === "string" &&
    Object.prototype.hasOwnProperty.call(PIG_FEEDS[feed].ingredients, item)
  );
}

/** Every item that some Slop can be mixed from. */
export const PIG_FEED_INGREDIENTS: InventoryItemName[] = [
  ...new Set(
    Object.values(PIG_FEEDS).flatMap(
      (feed) => Object.keys(feed.ingredients) as InventoryItemName[],
    ),
  ),
];

/**
 * What mixing one Slop from `ingredient` costs, or `undefined` when the item
 * is not an input of that Slop.
 */
export function getPigFeedIngredients(
  feed: PigFeedName,
  ingredient: unknown,
): Partial<Record<InventoryItemName, Decimal>> | undefined {
  if (!isPigFeedIngredient(feed, ingredient)) return undefined;
  return {
    [ingredient]: new Decimal(PIG_FEEDS[feed].ingredients[ingredient] ?? 0),
  };
}
