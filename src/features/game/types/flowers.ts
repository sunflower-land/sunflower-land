import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";
import { getKeys } from "./craftables";

export type FlowerName = "Flower 1";

export type FlowerSeedName = "Sunpetal Seed";

export type FlowerSeed = {
  price: Decimal;
  bumpkinLevel: number;
  sfl: Decimal;
  description: string;
  plantSeconds: number;
};

export function isFlowerSeed(seed: FlowerSeedName) {
  return getKeys(FLOWER_SEEDS()).includes(seed);
}

export const FLOWER_SEEDS: () => Record<FlowerSeedName, FlowerSeed> = () => ({
  "Sunpetal Seed": {
    price: new Decimal(0),
    bumpkinLevel: 0,
    sfl: new Decimal(0),
    description: "A seed for a flower",
    plantSeconds: 60,
  },
});

export const FLOWER_CHUM_AMOUNTS: Partial<Record<InventoryItemName, number>> = {
  Gold: 1,
  Iron: 5,
  Stone: 5,
  Egg: 5,
  Sunflower: 50,
  Potato: 20,
  Pumpkin: 20,
  Carrot: 10,
  Cabbage: 10,
  Beetroot: 10,
  Cauliflower: 5,
  Parsnip: 5,
  Eggplant: 5,
  Corn: 5,
  Radish: 5,
  Wheat: 5,
  Kale: 5,
  Blueberry: 3,
  Orange: 3,
  Apple: 3,
  Banana: 3,
  Seaweed: 1,
  Crab: 2,
  Anchovy: 1,
  "Red Snapper": 1,
  Tuna: 1,
  Squid: 1,
};

export const FLOWER_CHUM_DETAILS: Partial<Record<InventoryItemName, string>> = {
  Gold: "The shimmering gold can be seen 100 miles away",
  Iron: "A shimmering sparkle, can be seen at all angles during Dusk",
  Egg: "Hmmm, not sure what fish would like eggs...",
  Sunflower: "A sunny, vibrant lure for curious fish.",
  Potato: "Potatoes make for an unusual fishy feast.",
  Pumpkin: "Fish might be intrigued by the orange glow of pumpkins.",
  Carrot: "Best used with Earthworms to catch Anchovies!",
  Cabbage: "A leafy temptation for underwater herbivores.",
  Beetroot: "Beets, the undersea delight for the bold fish.",
  Cauliflower: "Fish may find the florets oddly enticing.",
  Parsnip: "An earthy, rooty lure for curious fish.",
  Eggplant: "Eggplants: the aquatic adventure for the daring fish.",
  Corn: "Corn on the cob – an odd but intriguing treat.",
  Radish: "Radishes, the buried treasure for aquatics.",
  Wheat: "Wheat, a grainy delight for underwater foragers.",
  Kale: "A leafy green surprise for the inquisitive fish.",
  Blueberry: "Often confused by blue fish as potential mates.",
  Orange: "Oranges, the citrusy curiosity for sea creatures.",
  Apple: "Apples – a crunchy enigma beneath the waves.",
  Banana: "Lighter than water!",
  Seaweed: "A taste of the ocean in a leafy underwater snack.",
  Crab: "A tantalizing morsel for a curious undersea fish.",
  Anchovy: "Anchovies, mysteriously alluring to the outlaws of the sea.",
  "Red Snapper": "A mystery hidden within the depths of the ocean.",
  Tuna: "What is big enough to eat a tuna?",
  Squid: "Awaken a ray with its favorite treat!",
};
