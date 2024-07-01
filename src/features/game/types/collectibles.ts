import Decimal from "decimal.js-light";
import { GameState, Inventory } from "./game";
import { translate } from "lib/i18n/translate";

export type CollectibleLocation = "farm" | "home";

export type SeasonPassName =
  | "Dawn Breaker Banner"
  | "Solar Flare Banner"
  | "Witches' Eve Banner"
  | "Catch the Kraken Banner";

export type PurchasableItems =
  | "Dawn Breaker Banner"
  | "Solar Flare Banner"
  | "Gold Pass"
  | "Witches' Eve Banner"
  | "Catch the Kraken Banner"
  | "Spring Blossom Banner"
  | "Clash of Factions Banner"
  | "Lifetime Farmer Banner";

export type HeliosBlacksmithItem =
  | "Immortal Pear"
  | "Treasure Map"
  | "Basic Scarecrow"
  | "Bale"
  | "Scary Mike"
  | "Laurie the Chuckle Crow"
  | "Poppy"
  | "Kernaldo"
  | "Grain Grinder"
  | "Skill Shrimpy"
  | "Soil Krabby"
  | "Nana";

export type SoldOutCollectibleName =
  | "Sir Goldensnout"
  | "Beta Bear"
  | "Peeled Potato"
  | "Christmas Snow Globe"
  | "Wood Nymph Wendy"
  | "Cyborg Bear"
  | "Palm Tree"
  | "Beach Ball"
  | "Cabbage Boy"
  | "Cabbage Girl"
  | "Heart Balloons"
  | "Flamingo"
  | "Blossom Tree"
  | "Collectible Bear"
  | "Pablo The Bunny"
  | "Easter Bush"
  | "Giant Carrot"
  | "Maneki Neko"
  | "Squirrel Monkey"
  | "Black Bearry"
  | "Hoot"
  | "Lady Bug"
  | "Freya Fox"
  | "Queen Cornelia"
  | "White Crow"
  | "Walrus"
  | "Alba"
  | "Knowledge Crab"
  | "Anchor"
  | "Rubber Ducky"
  | "Kraken Head"
  | "Humming Bird"
  | "Queen Bee"
  | "Blossom Royale"
  | "Hungry Caterpillar"
  | "Turbo Sprout"
  | "Soybliss"
  | "Grape Granny"
  | "Royal Throne"
  | "Lily Egg"
  | "Goblet";

export type MegaStoreCollectibleName =
  | "Flower Cart"
  | "Sunrise Bloom Rug"
  | "Flower Fox"
  | "Enchanted Rose"
  | "Capybara"
  | "Rainbow"
  | "Flower Rug"
  | "Tea Rug"
  | "Green Field Rug"
  | "Vinny"
  | "Clock"
  | "Fancy Rug"
  //June
  | "Regular Pawn"
  | "Novice Knight"
  | "Golden Garrison"
  | "Trainee Target"
  | "Chess Rug"
  // July
  | "Rice Panda"
  | "Silver Squire"
  | "Cluckapult"
  | "Bullseye Board"
  | "Twister Rug";

export type GoblinBlacksmithItemName =
  | "Purple Trail"
  | "Obie"
  | "Mushroom House"
  | "Maximus";

export type GoblinPirateItemName =
  | "Iron Idol"
  | "Heart of Davy Jones"
  | "Karkinos"
  | "Emerald Turtle"
  | "Tin Turtle"
  | "Parasaur Skull"
  | "Golden Bear Head";

export type PotionHouseItemName =
  | "Lab Grown Carrot"
  | "Lab Grown Radish"
  | "Lab Grown Pumpkin";

export type CraftableCollectible = {
  ingredients: Inventory;
  description: string;
  boost?: string;
  coins?: number;
  from?: Date;
  to?: Date;
};

export const HELIOS_BLACKSMITH_ITEMS: (
  game?: GameState,
  date?: Date,
) => Partial<Record<HeliosBlacksmithItem, CraftableCollectible>> = (
  state,
  date = new Date(),
) => ({
  "Basic Scarecrow": {
    description: translate("description.basic.scarecrow"),
    boost: translate("description.basic.scarecrow.boost"),
    coins: 0,
    ingredients: {
      Wood: new Decimal(2),
    },
  },
  "Scary Mike": {
    description: translate("description.scary.mike"),
    boost: translate("description.scary.mike.boost"),
    coins: 4800,
    ingredients: {
      Wood: new Decimal(30),
      Carrot: new Decimal(50),
      Wheat: new Decimal(10),
      Parsnip: new Decimal(10),
    },
  },
  "Laurie the Chuckle Crow": {
    description: translate("description.laurie.chuckle.crow"),
    boost: translate("description.laurie.chuckle.crow.boost"),
    coins: 14400,
    ingredients: {
      Wood: new Decimal(100),
      Radish: new Decimal(60),
      Kale: new Decimal(40),
      Wheat: new Decimal(20),
    },
  },
  Bale: {
    description: translate("description.bale"),
    boost: translate("description.bale.boost"),
    coins: 1600,
    ingredients: {
      Egg: new Decimal(200),
      Wheat: new Decimal(200),
      Wood: new Decimal(100),
      Stone: new Decimal(30),
    },
  },
  "Immortal Pear": {
    description: translate("description.immortal.pear"),
    boost: translate("description.immortal.pear.boost"),
    ingredients: {
      Gold: new Decimal(5),
      Apple: new Decimal(10),
      Blueberry: new Decimal(10),
      Orange: new Decimal(10),
    },
  },
  "Treasure Map": {
    description: translate("description.treasure.map"),
    boost: translate("description.treasure.map.boost"),
    ingredients: {
      Gold: new Decimal(5),
      "Wooden Compass": new Decimal(2),
    },
  },
});

export type PotionHouseItem = CraftableCollectible & {
  name: PotionHouseItemName;
};

export const POTION_HOUSE_ITEMS: Record<PotionHouseItemName, PotionHouseItem> =
  {
    "Lab Grown Carrot": {
      name: "Lab Grown Carrot",
      description: translate("description.lab.grown.carrot"),
      coins: 0,
      ingredients: {
        "Potion Ticket": new Decimal(6000),
      },
    },
    "Lab Grown Radish": {
      name: "Lab Grown Radish",
      description: translate("description.lab.grown.radish"),
      coins: 0,
      ingredients: {
        "Potion Ticket": new Decimal(8000),
      },
    },
    "Lab Grown Pumpkin": {
      name: "Lab Grown Pumpkin",
      description: translate("description.lab.grow.pumpkin"),
      coins: 0,
      ingredients: {
        "Potion Ticket": new Decimal(7000),
      },
    },
  };

export type Purchasable = CraftableCollectible & {
  usd: number;
};
