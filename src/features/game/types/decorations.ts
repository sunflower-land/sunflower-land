import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { Dimensions } from "./buildings";
import { Inventory } from "./game";
import { BoostTreasure, DecorationTreasure } from "./treasure";
import { translate } from "lib/i18n/translate";

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

export type BasicDecorationName =
  | "White Tulips"
  | "Potted Sunflower"
  | "Potted Potato"
  | "Potted Pumpkin"
  | "Cactus"
  | "Basic Bear"
  | "Bonnie's Tombstone"
  | "Grubnash's Tombstone"
  | "Town Sign";

export type LandscapingDecorationName =
  | "Dirt Path"
  | "Bush"
  | "Shrub"
  | "Fence"
  | "Crimson Cap"
  | "Toadstool Seat"
  | "Chestnut Fungi Stool"
  | "Mahogany Cap"
  | "Pine Tree"
  | "Stone Fence"
  | "Field Maple"
  | "Red Maple"
  | "Golden Maple";

export type ShopDecorationName =
  | BasicDecorationName
  | LandscapingDecorationName;

export type SeasonalDecorationName =
  | "Blossombeard"
  | "Clementine"
  | "Cobalt"
  | "Dawn Umbrella Seat"
  | "Eggplant Grill"
  | "Giant Dawn Mushroom"
  | "Shroom Glow"
  | "Candles"
  | "Haunted Stump"
  | "Spooky Tree"
  | "Observer"
  | "Crow Rock"
  | "Mini Corn Maze"
  | "Lifeguard Ring"
  | "Surfboard"
  | "Hideaway Herman"
  | "Shifty Sheldon"
  | "Tiki Torch"
  | "Beach Umbrella";

export type EventDecorationName =
  | "Baozi"
  | "Baby Panda"
  | "Valentine Bear"
  | "Easter Bear"
  | "Easter Bush"
  | "Giant Carrot"
  | "Genie Bear"
  | "Eggplant Bear"
  | "Dawn Flower"
  | "Sapo Docuras"
  | "Sapo Travessuras"
  | "Time Warp Totem"
  | "Festive Tree"
  | "Bumpkin Nutcracker"
  | "White Festive Fox"
  | "Grinx's Hammer"
  | "Earn Alliance Banner";

export type PotionHouseDecorationName =
  | "Giant Potato"
  | "Giant Pumpkin"
  | "Giant Cabbage";

export type InteriorDecorationName = "Rug" | "Wardrobe";

export type DecorationName =
  | AchievementDecorationName
  | ShopDecorationName
  | EventDecorationName
  | DecorationTreasure
  | BoostTreasure
  | SeasonalDecorationName
  | PotionHouseDecorationName
  | InteriorDecorationName;

export const DECORATION_DIMENSIONS: Record<DecorationName, Dimensions> = {
  Baozi: {
    width: 1,
    height: 1,
  },
  "Baby Panda": {
    width: 1,
    height: 1,
  },
  "Earn Alliance Banner": {
    width: 1,
    height: 2,
  },
  Blossombeard: {
    width: 1,
    height: 1,
  },
  Wardrobe: {
    height: 1,
    width: 1,
  },
  "White Festive Fox": {
    height: 2,
    width: 2,
  },
  Rug: {
    height: 3,
    width: 3,
  },
  "Grinx's Hammer": {
    height: 1,
    width: 1,
  },
  "Sapo Docuras": {
    height: 1,
    width: 1,
  },
  "Sapo Travessuras": {
    height: 1,
    width: 1,
  },
  "Dawn Flower": {
    height: 1,
    width: 1,
  },
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
    height: 1,
    width: 1,
  },
  "Construction Bear": {
    height: 1,
    width: 1,
  },
  "Angel Bear": {
    height: 1,
    width: 2,
  },
  "Badass Bear": {
    height: 1,
    width: 1,
  },
  "Bear Trap": {
    height: 1,
    width: 1,
  },
  "Brilliant Bear": {
    height: 1,
    width: 1,
  },
  "Classy Bear": {
    height: 1,
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
    width: 1,
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
    height: 1,
    width: 2,
  },
  "Sunflower Coin": {
    height: 1,
    width: 2,
  },
  Foliant: {
    height: 1,
    width: 2,
  },
  "Skeleton King Staff": {
    height: 1,
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
  "Pirate Bear": {
    height: 1,
    width: 1,
  },
  "Goblin Bear": {
    height: 1,
    width: 1,
  },
  Galleon: {
    height: 1,
    width: 2,
  },
  "Dinosaur Bone": {
    height: 1,
    width: 2,
  },
  "Human Bear": {
    height: 1,
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
    height: 1,
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
  "Eggplant Bear": {
    width: 1,
    height: 1,
  },
  "Field Maple": {
    width: 2,
    height: 2,
  },
  "Red Maple": {
    width: 2,
    height: 2,
  },
  "Golden Maple": {
    width: 2,
    height: 2,
  },
  Fence: {
    width: 1,
    height: 1,
  },
  "Stone Fence": {
    width: 1,
    height: 1,
  },
  Shrub: {
    width: 1,
    height: 1,
  },
  "Pine Tree": {
    width: 1,
    height: 2,
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
  "Genie Lamp": {
    width: 2,
    height: 1,
  },
  "Genie Bear": {
    width: 1,
    height: 1,
  },
  Candles: {
    width: 1,
    height: 1,
  },
  "Haunted Stump": {
    width: 1,
    height: 1,
  },
  "Spooky Tree": {
    width: 1,
    height: 2,
  },
  "Mini Corn Maze": {
    width: 1,
    height: 1,
  },
  Observer: {
    width: 1,
    height: 1,
  },
  "Crow Rock": {
    width: 2,
    height: 2,
  },
  "Giant Cabbage": {
    width: 2,
    height: 2,
  },
  "Giant Potato": {
    width: 1,
    height: 2,
  },
  "Giant Pumpkin": {
    width: 2,
    height: 2,
  },
  "Town Sign": {
    width: 2,
    height: 1,
  },
  "Lifeguard Ring": {
    width: 1,
    height: 1,
  },
  Surfboard: {
    width: 1,
    height: 2,
  },
  "Hideaway Herman": {
    width: 1,
    height: 1,
  },
  "Shifty Sheldon": {
    width: 1,
    height: 1,
  },
  "Tiki Torch": {
    width: 1,
    height: 1,
  },
  "Beach Umbrella": {
    width: 2,
    height: 2,
  },
  "Time Warp Totem": {
    height: 1,
    width: 1,
  },
  "Bumpkin Nutcracker": {
    height: 1,
    width: 1,
  },
  "Festive Tree": {
    height: 2,
    width: 2,
  },
};

export type Decoration = {
  name: DecorationName;
  ingredients: Inventory;
  description: string;
  // If no SFL it is not available for purchase
  sfl?: Decimal;
  limit?: number;
  from?: Date;
  to?: Date;
};

export const BASIC_DECORATIONS: () => Record<
  BasicDecorationName,
  Decoration
> = () => ({
  "White Tulips": {
    name: "White Tulips",
    sfl: new Decimal(0.25),
    ingredients: {},
    description: translate("description.white.tulips"),
  },
  "Potted Sunflower": {
    name: "Potted Sunflower",
    description: translate("description.potted.sunflower"),
    sfl: new Decimal(0.25),
    ingredients: {
      Sunflower: new Decimal(100),
    },
  },
  "Potted Potato": {
    name: "Potted Potato",
    description: translate("description.potted.potato"),
    sfl: new Decimal(0.625),
    ingredients: {
      Potato: new Decimal(200),
    },
  },
  "Potted Pumpkin": {
    name: "Potted Pumpkin",
    description: translate("description.potted.pumpkin"),
    sfl: new Decimal(2.5),
    ingredients: {
      Pumpkin: new Decimal(200),
    },
  },
  Cactus: {
    name: "Cactus",
    description: translate("description.cactus"),
    sfl: new Decimal(0.25),
    ingredients: {},
  },
  "Basic Bear": {
    name: "Basic Bear",
    description: translate("description.basic.bear"),
    sfl: new Decimal(0.625),
    ingredients: {},
  },

  "Bonnie's Tombstone": {
    name: "Bonnie's Tombstone",
    description: translate("description.bonnies.tombstone"),
    sfl: marketRate(0),
    ingredients: {
      Stone: new Decimal(10),
    },
  },

  "Grubnash's Tombstone": {
    name: "Grubnash's Tombstone",
    description: translate("description.grubnashs.tombstone"),
    sfl: marketRate(0),
    ingredients: {
      Stone: new Decimal(20),
      Iron: new Decimal(10),
    },
  },
  "Town Sign": {
    name: "Town Sign",
    description: translate("description.town.sign"),
    sfl: marketRate(0),
    ingredients: {},
    limit: 1,
  },
});

export const LANDSCAPING_DECORATIONS: () => Record<
  LandscapingDecorationName,
  Decoration
> = () => ({
  "Dirt Path": {
    name: "Dirt Path",
    description: translate("description.dirt.path"),
    sfl: new Decimal(0.625),
    ingredients: {},
  },
  Bush: {
    name: "Bush",
    description: translate("description.bush"),
    sfl: new Decimal(1.25),
    ingredients: {
      Wood: new Decimal(5),
    },
  },
  Fence: {
    name: "Fence",
    description: translate("description.fence"),
    sfl: new Decimal(0.125),
    ingredients: {
      Wood: new Decimal(5),
    },
  },
  "Stone Fence": {
    name: "Stone Fence",
    description: translate("description.stone.fence"),
    sfl: new Decimal(0.25),
    ingredients: {
      Stone: new Decimal(5),
    },
  },
  "Pine Tree": {
    name: "Pine Tree",
    description: translate("description.pine.tree"),
    sfl: new Decimal(1.25),
    ingredients: {
      Wood: new Decimal(7),
    },
  },
  Shrub: {
    name: "Shrub",
    description: translate("description.shrub"),
    sfl: new Decimal(0.625),
    ingredients: {
      Wood: new Decimal(3),
    },
  },
  "Field Maple": {
    name: "Field Maple",
    description: translate("description.field.maple"),
    sfl: new Decimal(0.625),
    ingredients: {
      Wood: new Decimal(20),
    },
  },
  "Red Maple": {
    name: "Red Maple",
    description: translate("description.red.maple"),
    sfl: new Decimal(0.625),
    ingredients: {
      Wood: new Decimal(3),
      "Block Buck": new Decimal(1),
    },
  },
  "Golden Maple": {
    name: "Golden Maple",
    description: translate("description.golden.maple"),
    sfl: new Decimal(0.625),
    ingredients: {
      Wood: new Decimal(3),
      "Block Buck": new Decimal(1),
    },
  },
  "Crimson Cap": {
    name: "Crimson Cap",
    description: translate("description.crimson.cap"),
    sfl: new Decimal(50),
    ingredients: {
      "Wild Mushroom": new Decimal(20),
    },
  },
  "Toadstool Seat": {
    name: "Toadstool Seat",
    description: translate("description.toadstool.seat"),
    sfl: new Decimal(0),
    ingredients: {
      "Wild Mushroom": new Decimal(5),
    },
  },
  "Chestnut Fungi Stool": {
    name: "Chestnut Fungi Stool",
    description: translate("description.chestnut.fungi.stool"),
    sfl: new Decimal(5),
    ingredients: {
      "Toadstool Seat": new Decimal(1),
      Wood: new Decimal(10),
    },
  },
  "Mahogany Cap": {
    name: "Mahogany Cap",
    description: translate("description.mahogany.cap"),
    sfl: new Decimal(5),
    ingredients: {
      "Crimson Cap": new Decimal(1),
      Wood: new Decimal(100),
    },
  },
});

export const POTION_HOUSE_DECORATIONS: () => Record<
  PotionHouseDecorationName,
  Decoration
> = () => ({
  "Magic Bean": {
    name: "Magic Bean",
    description: translate("description.magic.bean"),
    sfl: new Decimal(0),
    ingredients: {
      "Potion Ticket": new Decimal(2000),
    },
  },
  "Giant Potato": {
    name: "Giant Potato",
    description: translate("description.giant.potato"),
    sfl: new Decimal(0),
    ingredients: {
      "Potion Ticket": new Decimal(500),
    },
  },
  "Giant Pumpkin": {
    name: "Giant Pumpkin",
    description: translate("description.giant.pumpkin"),
    sfl: new Decimal(0),
    ingredients: {
      "Potion Ticket": new Decimal(750),
    },
  },
  "Giant Cabbage": {
    name: "Giant Cabbage",
    description: translate("description.giant.cabbage"),
    sfl: new Decimal(0),
    ingredients: {
      "Potion Ticket": new Decimal(1000),
    },
  },
});
