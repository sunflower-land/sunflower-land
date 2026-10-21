import type { InventoryItemName } from "./game";

// Both repos keep this file byte-identical.

/*
 * The Goblin Cave Merchant's own price list: what an item is worth, in coins
 * at the crop sell-price scale (Carrot 0.8, Kale 10, Rice 320). FROZEN on
 * 2026-10-21 and read by nothing but the Merchant, so rebalancing a crop's
 * sell price, a recipe or a tool never reshuffles his stock, and a client and
 * API released apart can never disagree on what a slot sells. Changing a
 * number here reshuffles every visit from then on (the pinned-stock test in
 * caveMerchant.test.ts fails until it is updated): only do it before the
 * visits involved are live.
 *
 * How the numbers were set (Bryn's trade-sheet review, 2026-10-21): a
 * least-squares fit, in log space, to the 39 trades Bryn priced by hand, with
 * crops and fruit fixed at their sell price, then rounded.
 * - Produce: roughly the feed that made it (Egg 10, Milk 90); Leather is what
 *   a Cow and a few Corn cost, about a Gold; the wools sit low because they
 *   have weak sinks (Merino barely above Wool).
 * - Beetles: 0.75x the Cow feeding XP they replace, doubling with rarity, so
 *   Pink and Amber are asked for in fives.
 * - Mushrooms: both are free spawns on a timer, so neither carries its recipe
 *   weight: Magic 60 (Bryn: ~50), Wild 40 so Oil asks for a few, not a dozen.
 * - Mud: 40 Mud for 5 Merino Wool.
 * - Resources: Gold is 15 Eggs or 1,000 Potatoes; Iron 160 Soybeans for 10;
 *   Crimstone 10 Wool; Obsidian 400 Turnips. Wood and Stone are set by ratio
 *   (Stone a third of Iron, Wood a third of Stone), not the coin chain.
 * - Sand Drill: a use value (a Sand Shovel does the job), not its recipe.
 * - Curiosities: the ingredients' values (recursively, so Cheese prices
 *   through Milk) plus any coin price, +25% per day of cooking or crafting
 *   capped at 2x, and dishes halved: XP has an infinite sink and a dish can't
 *   be traded on (Bryn's sheet fitted 0.49). A new curiosity is priced the
 *   same way, by hand.
 */
export const CAVE_MERCHANT_VALUES: Partial<Record<InventoryItemName, number>> =
  {
    // Resources
    Wood: 5,
    Stone: 15,
    Iron: 40,
    Gold: 180,
    Crimstone: 550,
    Oil: 160,
    Obsidian: 4000,

    // Animal produce
    Egg: 10,
    Feather: 20,
    Wool: 30,
    "Merino Wool": 35,
    Milk: 90,
    Leather: 120,
    Honey: 35,
    Truffle: 80,

    // Cave
    Mud: 4,
    "Wild Mushroom": 40,
    "Magic Mushroom": 60,
    "Sand Drill": 120,
    "Green Beetle": 60,
    "Blue Beetle": 120,
    "Pink Beetle": 240,
    "Amber Beetle": 480,

    // Crops and fruit, at their sell price
    Sunflower: 0.02,
    Potato: 0.14,
    Rhubarb: 0.24,
    Pumpkin: 0.4,
    Zucchini: 0.4,
    Carrot: 0.8,
    Yam: 0.8,
    Cabbage: 1.5,
    Broccoli: 1.5,
    Soybean: 2.3,
    Beetroot: 2.8,
    Pepper: 3,
    Cauliflower: 4.25,
    Parsnip: 6.5,
    Eggplant: 8,
    Corn: 9,
    Onion: 10,
    Wheat: 7,
    Turnip: 8,
    Radish: 9.5,
    Kale: 10,
    Artichoke: 12,
    Barley: 12,
    Rice: 320,
    Olive: 400,
    Tomato: 2,
    Lemon: 6,
    Blueberry: 12,
    Orange: 18,
    Apple: 25,
    Banana: 25,
    Grape: 240,

    // Curiosities: recipes rolled up (see above)
    "Apple Juice": 63.15,
    "Apple Pie": 205.73,
    Axe: 20,
    "Banana Blast": 180.47,
    "Beetroot Blaze": 130.01,
    "Beetroot Cake": 399.48,
    "Blue Cheese": 201.58,
    "Blueberry Jam": 33.75,
    "Bumpkin Detox": 113.82,
    "Bumpkin Roast": 109.3,
    "Bumpkin Salad": 62.71,
    "Bumpkin ganoush": 164.12,
    "Cabbage Cake": 291.95,
    "Caprese Salad": 198.76,
    "Carrot Cake": 264.55,
    "Carrot Juice": 12.12,
    "Cauliflower Burger": 50.92,
    "Cauliflower Cake": 384.11,
    Cheese: 135.47,
    "Club Sandwich": 29.39,
    Cornbread: 151.88,
    "Creamy Truffle Risotto": 1350,
    "Eggplant Cake": 381.25,
    "Fancy Fries": 50,
    "Fermented Carrots": 10,
    "Fruit Salad": 27.64,
    "Goblin Brunch": 204.54,
    "Goblin's Treat": 111.03,
    "Gold Pickaxe": 655,
    "Grape Juice": 716.72,
    "Honey Cake": 335.83,
    "Honey Cheddar": 327.04,
    "Iron Pickaxe": 295,
    "Kale & Mushroom Pie": 252.6,
    "Lemon Cheesecake": 785.76,
    "Mushroom Jacket Potatoes": 200.7,
    "Oil Drill": 1760,
    "Orange Cake": 239.58,
    "Orange Juice": 45.35,
    Pancakes: 191.98,
    "Parsnip Cake": 414.06,
    Pickaxe: 35,
    "Potato Cake": 244.06,
    "Power Smoothie": 86.33,
    "Pumpkin Cake": 234.08,
    "Purple Smoothie": 37.7,
    "Quick Juice": 8.54,
    "Radish Cake": 379.69,
    "Roast Veggies": 36.62,
    "Sand Shovel": 45,
    Sauerkraut: 18.75,
    "Shroom Syrup": 440.01,
    "Slow Juice": 2125,
    "Sour Shake": 60.63,
    "Spaghetti al Limone": 327.45,
    "Steamed Red Rice": 572.92,
    "Stone Pickaxe": 110,
    "Sunflower Cake": 208.2,
    "Sunflower Crunch": 3.01,
    "The Lot": 165.83,
    "Tofu Scramble": 148.76,
    "Truffle Cake": 1197.76,
    "Wheat Cake": 340.62,
  };

/**
 * What goes into an item, all the way down its recipe, that the Merchant
 * also takes as payment: never asked for as that item's cost.
 */
export const CAVE_MERCHANT_INGREDIENTS: Partial<
  Record<InventoryItemName, InventoryItemName[]>
> = {
  "Apple Juice": ["Apple"],
  "Apple Pie": ["Apple", "Egg", "Wheat"],
  "Banana Blast": ["Banana", "Egg"],
  "Beetroot Blaze": ["Beetroot"],
  "Beetroot Cake": ["Beetroot", "Egg", "Wheat"],
  "Blue Cheese": ["Blueberry", "Milk"],
  "Blueberry Jam": ["Blueberry"],
  "Bumpkin Detox": ["Apple", "Carrot", "Orange"],
  "Bumpkin Roast": ["Carrot", "Cauliflower", "Potato"],
  "Bumpkin Salad": ["Beetroot", "Parsnip"],
  "Bumpkin ganoush": ["Eggplant", "Parsnip", "Potato"],
  "Cabbage Cake": ["Cabbage", "Egg", "Wheat"],
  "Caprese Salad": ["Kale", "Milk", "Tomato"],
  "Carrot Cake": ["Carrot", "Egg", "Wheat"],
  "Carrot Juice": ["Carrot"],
  "Cauliflower Burger": ["Cauliflower", "Wheat"],
  "Cauliflower Cake": ["Cauliflower", "Egg", "Wheat"],
  Cheese: ["Milk"],
  "Club Sandwich": ["Carrot", "Sunflower", "Wheat"],
  Cornbread: ["Corn", "Egg", "Wheat"],
  "Creamy Truffle Risotto": ["Rice", "Wild Mushroom"],
  "Eggplant Cake": ["Egg", "Eggplant", "Wheat"],
  "Fancy Fries": ["Potato", "Sunflower"],
  "Fermented Carrots": ["Carrot"],
  "Fruit Salad": ["Apple", "Blueberry", "Orange"],
  "Goblin Brunch": ["Cabbage", "Egg", "Pumpkin", "Radish"],
  "Goblin's Treat": ["Cabbage", "Pumpkin", "Radish"],
  "Gold Pickaxe": ["Gold", "Wood"],
  "Grape Juice": ["Grape", "Radish"],
  "Honey Cake": ["Egg", "Honey", "Wheat"],
  "Honey Cheddar": ["Honey", "Milk"],
  "Iron Pickaxe": ["Iron", "Wood"],
  "Kale & Mushroom Pie": ["Kale", "Wheat", "Wild Mushroom"],
  "Lemon Cheesecake": ["Egg", "Lemon", "Milk"],
  "Mushroom Jacket Potatoes": ["Potato", "Wild Mushroom"],
  "Oil Drill": ["Iron", "Leather", "Wood"],
  "Orange Cake": ["Egg", "Orange", "Wheat"],
  "Orange Juice": ["Orange"],
  Pancakes: ["Egg", "Honey", "Wheat"],
  "Parsnip Cake": ["Egg", "Parsnip", "Wheat"],
  Pickaxe: ["Wood"],
  "Potato Cake": ["Egg", "Potato", "Wheat"],
  "Power Smoothie": ["Blueberry", "Kale"],
  "Pumpkin Cake": ["Egg", "Pumpkin", "Wheat"],
  "Purple Smoothie": ["Blueberry", "Cabbage"],
  "Quick Juice": ["Pumpkin", "Sunflower"],
  "Radish Cake": ["Egg", "Radish", "Wheat"],
  "Roast Veggies": ["Carrot", "Cauliflower"],
  "Sand Drill": ["Crimstone", "Leather", "Oil", "Wood"],
  "Sand Shovel": ["Stone", "Wood"],
  Sauerkraut: ["Cabbage"],
  "Shroom Syrup": ["Honey"],
  "Slow Juice": ["Grape", "Kale"],
  "Sour Shake": ["Lemon"],
  "Spaghetti al Limone": ["Lemon", "Milk", "Wheat"],
  "Steamed Red Rice": ["Beetroot", "Rice"],
  "Stone Pickaxe": ["Stone", "Wood"],
  "Sunflower Cake": ["Egg", "Sunflower", "Wheat"],
  "Sunflower Crunch": ["Sunflower"],
  "The Lot": ["Apple", "Banana", "Blueberry", "Grape", "Orange"],
  "Tofu Scramble": ["Cauliflower", "Egg", "Soybean"],
  "Truffle Cake": ["Egg", "Honey", "Wheat"],
  "Wheat Cake": ["Egg", "Wheat"],
};

/**
 * The curiosities he sometimes brings instead of a resource: cooked dishes
 * past the Fire Pit (the beginner tier is no prize) and a few tools. Written
 * out, so a recipe added later never joins the pool. Add new ones here on
 * purpose, with a value and ingredients above.
 */
export const CAVE_MERCHANT_CURIOSITIES: Partial<
  Record<InventoryItemName, "dish" | "tool">
> = {
  "Apple Juice": "dish",
  "Apple Pie": "dish",
  Axe: "tool",
  "Banana Blast": "dish",
  "Beetroot Blaze": "dish",
  "Beetroot Cake": "dish",
  "Blue Cheese": "dish",
  "Blueberry Jam": "dish",
  "Bumpkin Detox": "dish",
  "Bumpkin Roast": "dish",
  "Bumpkin Salad": "dish",
  "Bumpkin ganoush": "dish",
  "Cabbage Cake": "dish",
  "Caprese Salad": "dish",
  "Carrot Cake": "dish",
  "Carrot Juice": "dish",
  "Cauliflower Burger": "dish",
  "Cauliflower Cake": "dish",
  Cheese: "dish",
  "Club Sandwich": "dish",
  Cornbread: "dish",
  "Creamy Truffle Risotto": "dish",
  "Eggplant Cake": "dish",
  "Fancy Fries": "dish",
  "Fermented Carrots": "dish",
  "Fruit Salad": "dish",
  "Goblin Brunch": "dish",
  "Goblin's Treat": "dish",
  "Gold Pickaxe": "tool",
  "Grape Juice": "dish",
  "Honey Cake": "dish",
  "Honey Cheddar": "dish",
  "Iron Pickaxe": "tool",
  "Kale & Mushroom Pie": "dish",
  "Lemon Cheesecake": "dish",
  "Mushroom Jacket Potatoes": "dish",
  "Oil Drill": "tool",
  "Orange Cake": "dish",
  "Orange Juice": "dish",
  Pancakes: "dish",
  "Parsnip Cake": "dish",
  Pickaxe: "tool",
  "Potato Cake": "dish",
  "Power Smoothie": "dish",
  "Pumpkin Cake": "dish",
  "Purple Smoothie": "dish",
  "Quick Juice": "dish",
  "Radish Cake": "dish",
  "Roast Veggies": "dish",
  "Sand Shovel": "tool",
  Sauerkraut: "dish",
  "Shroom Syrup": "dish",
  "Slow Juice": "dish",
  "Sour Shake": "dish",
  "Spaghetti al Limone": "dish",
  "Steamed Red Rice": "dish",
  "Stone Pickaxe": "tool",
  "Sunflower Cake": "dish",
  "Sunflower Crunch": "dish",
  "The Lot": "dish",
  "Tofu Scramble": "dish",
  "Truffle Cake": "dish",
  "Wheat Cake": "dish",
};
