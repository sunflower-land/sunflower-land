import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { Dimensions } from "./craftables";
import { Inventory } from "./game";
import { BoostTreasure, DecorationTreasure } from "./treasure";

export type AchievementDecorationName =
  | "Chef Bear"
  | "Construction Bear"
  | "Sunflower Bear"
  | "Farmer Bear"
  | "Bear Trap"
  | "Angel Bear"
  | "Brilliant Bear"
  | "Badass Bear"
  | "Classy Bear"
  | "Rich Bear"
  | "Rainbow Artist Bear"
  | "Devil Bear";

export type ShopDecorationName =
  | "White Tulips"
  | "Potted Sunflower"
  | "Potted Potato"
  | "Potted Pumpkin"
  | "Cactus"
  | "Basic Bear"
  | "Dirt Path"
  | "Bush"
  | "Shrub"
  | "Fence"
  | "Bonnie's Tombstone"
  | "Grubnash's Tombstone"
  | "Crimson Cap"
  | "Toadstool Seat"
  | "Chestnut Fungi Stool"
  | "Mahogany Cap";

export type SeasonalDecorationName =
  | "Clementine"
  | "Cobalt"
  | "Dawn Umbrella Seat"
  | "Eggplant Grill"
  | "Giant Dawn Mushroom"
  | "Shroom Glow";

export type EventDecorationName =
  | "Valentine Bear"
  | "Easter Bear"
  | "Easter Bush"
  | "Giant Carrot";

export type DecorationName =
  | AchievementDecorationName
  | ShopDecorationName
  | EventDecorationName
  | DecorationTreasure
  | BoostTreasure
  | SeasonalDecorationName;

export const DECORATION_DIMENSIONS: Record<DecorationName, Dimensions> = {
  "White Tulips": {
    height: 1,
    width: 1,
  },
  "Potted Sunflower": {
    height: 1,
    width: 1,
  },
  "Potted Potato": {
    height: 1,
    width: 1,
  },
  "Potted Pumpkin": {
    height: 1,
    width: 1,
  },
  Cactus: {
    height: 1,
    width: 1,
  },
  "Basic Bear": {
    height: 1,
    width: 1,
  },
  "Chef Bear": {
    height: 2,
    width: 1,
  },
  "Construction Bear": {
    height: 2,
    width: 1,
  },
  "Angel Bear": {
    height: 2,
    width: 2,
  },
  "Badass Bear": {
    height: 1,
    width: 1,
  },
  "Bear Trap": {
    height: 2,
    width: 1,
  },
  "Brilliant Bear": {
    height: 1,
    width: 1,
  },
  "Classy Bear": {
    height: 2,
    width: 1,
  },
  "Farmer Bear": {
    height: 1,
    width: 1,
  },
  "Sunflower Bear": {
    height: 1,
    width: 1,
  },
  "Rich Bear": {
    height: 1,
    width: 2,
  },
  "Rainbow Artist Bear": {
    width: 1,
    height: 1,
  },
  "Devil Bear": {
    height: 1,
    width: 1,
  },
  "Abandoned Bear": {
    height: 1,
    width: 1,
  },
  "Turtle Bear": {
    height: 1,
    width: 1,
  },
  "T-Rex Skull": {
    height: 2,
    width: 2,
  },
  "Sunflower Coin": {
    height: 2,
    width: 2,
  },
  Foliant: {
    height: 2,
    width: 2,
  },
  "Skeleton King Staff": {
    height: 2,
    width: 2,
  },
  "Lifeguard Bear": {
    height: 1,
    width: 1,
  },
  "Snorkel Bear": {
    height: 1,
    width: 1,
  },
  "Whale Bear": {
    height: 1,
    width: 1,
  },
  "Parasaur Skull": {
    height: 2,
    width: 2,
  },
  "Golden Bear Head": {
    height: 2,
    width: 2,
  },
  "Pirate Bear": {
    height: 1,
    width: 1,
  },
  "Goblin Bear": {
    height: 1,
    width: 1,
  },
  Galleon: {
    height: 2,
    width: 2,
  },
  "Dinosaur Bone": {
    height: 2,
    width: 2,
  },
  "Human Bear": {
    height: 2,
    width: 1,
  },
  "Tiki Totem": {
    height: 1,
    width: 1,
  },
  "Lunar Calendar": {
    height: 1,
    width: 1,
  },
  "Valentine Bear": {
    height: 1,
    width: 1,
  },
  "Easter Bear": {
    height: 1,
    width: 1,
  },
  "Easter Bush": {
    height: 2,
    width: 2,
  },
  "Giant Carrot": {
    height: 3,
    width: 2,
  },
  "Dirt Path": {
    width: 1,
    height: 1,
  },
  Bush: {
    width: 2,
    height: 1,
  },
  Fence: {
    width: 1,
    height: 1,
  },
  Shrub: {
    width: 1,
    height: 1,
  },
  "Bonnie's Tombstone": {
    width: 1,
    height: 1,
  },
  "Chestnut Fungi Stool": {
    width: 1,
    height: 1,
  },
  "Crimson Cap": {
    width: 2,
    height: 2,
  },
  "Dawn Umbrella Seat": {
    width: 1,
    height: 1,
  },
  "Eggplant Grill": {
    width: 1,
    height: 1,
  },
  "Giant Dawn Mushroom": {
    width: 2,
    height: 2,
  },
  "Grubnash's Tombstone": {
    width: 1,
    height: 1,
  },
  "Mahogany Cap": {
    width: 2,
    height: 2,
  },
  "Toadstool Seat": {
    width: 1,
    height: 1,
  },
  Clementine: {
    width: 1,
    height: 1,
  },
  Cobalt: {
    width: 1,
    height: 1,
  },
  "Shroom Glow": {
    width: 2,
    height: 2,
  },
};

export type Decoration = {
  name: DecorationName;
  ingredients: Inventory;
  description: string;
  // If no SFL it is not available for purchase
  sfl?: Decimal;
};

export const HELIOS_DECORATIONS: () => Record<
  ShopDecorationName,
  Decoration
> = () => ({
  "White Tulips": {
    name: "White Tulips",
    sfl: marketRate(20),
    ingredients: {},
    description: "Keep the smell of goblins away.",
  },
  "Potted Sunflower": {
    name: "Potted Sunflower",
    sfl: marketRate(20),
    ingredients: {
      Sunflower: new Decimal(100),
    },
    description: "Brighten up your land.",
  },
  "Potted Potato": {
    name: "Potted Potato",
    sfl: marketRate(50),
    ingredients: {
      Potato: new Decimal(200),
    },
    description: "Potato blood runs through your Bumpkin.",
  },
  "Potted Pumpkin": {
    name: "Potted Pumpkin",
    sfl: marketRate(200),
    ingredients: {
      Pumpkin: new Decimal(200),
    },
    description: "Pumpkins for Bumpkins",
  },
  Cactus: {
    name: "Cactus",
    sfl: marketRate(20),
    ingredients: {},
    description: "Saves water and makes your farm look stunning!",
  },
  "Basic Bear": {
    name: "Basic Bear",
    sfl: marketRate(50),
    ingredients: {},
    description: "A basic bear. Use this at Goblin Retreat to build a bear!",
  },
  "Dirt Path": {
    name: "Dirt Path",
    sfl: marketRate(50),
    ingredients: {},
    description: "Keep your farmer boots clean with a well trodden path.",
  },
  Bush: {
    name: "Bush",
    sfl: marketRate(100),
    ingredients: {
      Wood: new Decimal(5),
    },
    description: "What's lurking in the bushes?",
  },
  Fence: {
    name: "Fence",
    sfl: marketRate(10),
    ingredients: {
      Wood: new Decimal(5),
    },
    description: "Add a touch of rustic charm to your farm.",
  },
  Shrub: {
    name: "Shrub",
    sfl: marketRate(50),
    ingredients: {
      Wood: new Decimal(3),
    },
    description: "Enhance your in-game landscaping with a beautiful shrub",
  },
  "Bonnie's Tombstone": {
    name: "Bonnie's Tombstone",
    sfl: marketRate(0),
    ingredients: {
      Stone: new Decimal(10),
    },
    description: "?",
  },
  "Crimson Cap": {
    name: "Crimson Cap",
    sfl: new Decimal(50),
    ingredients: {
      "Wild Mushroom": new Decimal(20),
    },
    description: "?",
  },
  "Grubnash's Tombstone": {
    name: "Grubnash's Tombstone",
    sfl: marketRate(0),
    ingredients: {
      Stone: new Decimal(20),
      Iron: new Decimal(10),
    },
    description: "?",
  },
  "Toadstool Seat": {
    name: "Toadstool Seat",
    sfl: new Decimal(0),
    ingredients: {
      "Wild Mushroom": new Decimal(5),
    },
    description: "?",
  },
  "Chestnut Fungi Stool": {
    name: "Chestnut Fungi Stool",
    sfl: new Decimal(5),
    ingredients: {
      "Toadstool Seat": new Decimal(1),
      Wood: new Decimal(10),
    },
    description: "?",
  },
  "Mahogany Cap": {
    name: "Mahogany Cap",
    sfl: new Decimal(5),
    ingredients: {
      "Crimson Cap": new Decimal(1),
      Wood: new Decimal(100),
    },
    description: "?",
  },
});

export const SEASONAL_DECORATIONS: () => Record<
  SeasonalDecorationName,
  Decoration
> = () => ({
  "Dawn Umbrella Seat": {
    name: "Dawn Umbrella Seat",
    sfl: new Decimal(0),
    ingredients: {
      Eggplant: new Decimal(10),
      "Dawn Breaker Ticket": new Decimal(10),
    },
    description: "?",
  },
  "Eggplant Grill": {
    name: "Eggplant Grill",
    sfl: new Decimal(0),
    description: "?",
    ingredients: {
      Wood: new Decimal(50),
      Gold: new Decimal(5),
      Eggplant: new Decimal(50),
      "Dawn Breaker Ticket": new Decimal(100),
    },
  },
  "Giant Dawn Mushroom": {
    name: "Giant Dawn Mushroom",
    sfl: marketRate(1600),
    description: "?",
    ingredients: {
      Mushroom: new Decimal(5),
      Eggplant: new Decimal(25),
    },
  },
  Clementine: {
    name: "Clementine",
    sfl: marketRate(1600),
    description: "?",
    ingredients: {
      Gold: new Decimal(5),
      "Wild Mushroom": new Decimal(20),
    },
  },
  Cobalt: {
    name: "Cobalt",
    sfl: marketRate(800),
    ingredients: {
      Gold: new Decimal(2),
      "Wild Mushroom": new Decimal(10),
    },
    description: "?",
  },
  "Shroom Glow": {
    name: "Shroom Glow",
    sfl: new Decimal(800),
    description: "?",
    ingredients: {
      Gold: new Decimal(5),
      Wood: new Decimal(100),
      "Wild Mushroom": new Decimal(5),
    },
  },
});
