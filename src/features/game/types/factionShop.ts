import Decimal from "decimal.js-light";
import { FactionName, ShopItemBase } from "./game";

export type FactionShopCollectibleName =
  | "Sunflorian Throne"
  | "Nightshade Throne"
  | "Goblin Throne"
  | "Bumpkin Throne"
  | "Golden Sunflorian Egg"
  | "Goblin Mischief Egg"
  | "Bumpkin Charm Egg"
  | "Nightshade Veil Egg"
  | "Emerald Goblin Goblet"
  | "Opal Sunflorian Goblet"
  | "Sapphire Bumpkin Goblet"
  | "Amethyst Nightshade Goblet"
  | "Golden Faction Goblet"
  | "Ruby Faction Goblet"
  | "Sunflorian Victory Bunting"
  | "Nightshade Victory Bunting"
  | "Goblin Victory Bunting"
  | "Bumpkin Victory Bunting"
  | "Sunflorian Candles"
  | "Nightshade Candles"
  | "Goblin Candles"
  | "Bumpkin Candles"
  | "Sunflorian Left Wall Candle"
  | "Nightshade Left Wall Candle"
  | "Goblin Left Wall Candle"
  | "Bumpkin Left Wall Candle"
  | "Sunflorian Right Wall Candle"
  | "Nightshade Right Wall Candle"
  | "Goblin Right Wall Candle"
  | "Bumpkin Right Wall Candle"
  | "Cooking Boost"
  | "Crop Boost"
  | "Wood Boost"
  | "Mineral Boost"
  | "Fruit Boost"
  | "Flower Boost"
  | "Fish Boost"
  | "Sunflorian Faction Rug"
  | "Nightshade Faction Rug"
  | "Goblin Faction Rug"
  | "Bumpkin Faction Rug";

export type FactionShopWearableName =
  | "Goblin Armor"
  | "Goblin Helmet"
  | "Goblin Pants"
  | "Goblin Sabaton"
  | "Goblin Axe"
  | "Nightshade Armor"
  | "Nightshade Helmet"
  | "Nightshade Pants"
  | "Nightshade Sabaton"
  | "Nightshade Sword"
  | "Bumpkin Armor"
  | "Bumpkin Helmet"
  | "Bumpkin Sword"
  | "Bumpkin Pants"
  | "Bumpkin Sabaton"
  | "Sunflorian Armor"
  | "Sunflorian Sword"
  | "Sunflorian Helmet"
  | "Sunflorian Pants"
  | "Sunflorian Sabaton"
  | "Knight Gambit"
  | "Motley"
  | "Royal Braids";

type FactionItemBase = {
  faction?: FactionName;
} & ShopItemBase;

export type FactionShopWearable = {
  name: FactionShopWearableName;
} & FactionItemBase;

export type FactionShopCollectible = {
  name: FactionShopCollectibleName;
} & FactionItemBase;

export type FactionShopItemName =
  | FactionShopWearableName
  | FactionShopCollectibleName;

export type FactionShopItem = FactionShopWearable | FactionShopCollectible;

export const FACTION_SHOP_ITEMS: Record<FactionShopItemName, FactionShopItem> =
  {
    "Sunflorian Throne": {
      name: "Sunflorian Throne",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A throne fit for a Sunflorian.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Throne": {
      name: "Nightshade Throne",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A throne fit for a Nightshade.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Throne": {
      name: "Goblin Throne",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A throne fit for a Goblin.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Throne": {
      name: "Bumpkin Throne",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A throne fit for a Bumpkin.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Golden Sunflorian Egg": {
      name: "Golden Sunflorian Egg",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A jewelled egg created by the House of Sunflorian.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Goblin Mischief Egg": {
      name: "Goblin Mischief Egg",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A jewelled egg created by the House of Goblin.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Charm Egg": {
      name: "Bumpkin Charm Egg",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A jewelled egg created by the House of Bumpkin.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Nightshade Veil Egg": {
      name: "Nightshade Veil Egg",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A jewelled egg created by the House of Nightshade.",
      type: "collectible",
      faction: "nightshades",
    },
    "Emerald Goblin Goblet": {
      name: "Emerald Goblin Goblet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "An emerald goblet.",
      type: "collectible",
      faction: "goblins",
    },
    "Opal Sunflorian Goblet": {
      name: "Opal Sunflorian Goblet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "An opal goblet.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Sapphire Bumpkin Goblet": {
      name: "Sapphire Bumpkin Goblet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A sapphire goblet.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Amethyst Nightshade Goblet": {
      name: "Amethyst Nightshade Goblet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "An amethyst goblet.",
      type: "collectible",
      faction: "nightshades",
    },
    "Golden Faction Goblet": {
      name: "Golden Faction Goblet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A golden goblet.",
      type: "collectible",
    },
    "Ruby Faction Goblet": {
      name: "Ruby Faction Goblet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A ruby goblet.",
      type: "collectible",
    },
    "Sunflorian Victory Bunting": {
      name: "Sunflorian Victory Bunting",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Victory bunting from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Victory Bunting": {
      name: "Nightshade Victory Bunting",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Victory bunting from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Victory Bunting": {
      name: "Goblin Victory Bunting",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Victory bunting from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Victory Bunting": {
      name: "Bumpkin Victory Bunting",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Victory bunting from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Sunflorian Candles": {
      name: "Sunflorian Candles",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Candles from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Candles": {
      name: "Nightshade Candles",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Candles from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Candles": {
      name: "Goblin Candles",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Candles from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Candles": {
      name: "Bumpkin Candles",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Candles from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Sunflorian Left Wall Candle": {
      name: "Sunflorian Left Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription:
        "A candle for the left wall from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Left Wall Candle": {
      name: "Nightshade Left Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription:
        "A candle for the left wall from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Left Wall Candle": {
      name: "Goblin Left Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A candle for the left wall from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Left Wall Candle": {
      name: "Bumpkin Left Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A candle for the left wall from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Sunflorian Right Wall Candle": {
      name: "Sunflorian Right Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription:
        "A candle for the right wall from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Right Wall Candle": {
      name: "Nightshade Right Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription:
        "A candle for the right wall from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Right Wall Candle": {
      name: "Goblin Right Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A candle for the right wall from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Right Wall Candle": {
      name: "Bumpkin Right Wall Candle",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A candle for the right wall from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Goblin Armor": {
      name: "Goblin Armor",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Armor from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Helmet": {
      name: "Goblin Helmet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A helmet from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Pants": {
      name: "Goblin Pants",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Pants from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Sabaton": {
      name: "Goblin Sabaton",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Sabatons from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Axe": {
      name: "Goblin Axe",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "An axe from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Nightshade Armor": {
      name: "Nightshade Armor",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Armor from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Helmet": {
      name: "Nightshade Helmet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A helmet from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Pants": {
      name: "Nightshade Pants",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Pants from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Sabaton": {
      name: "Nightshade Sabaton",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Sabatons from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Sword": {
      name: "Nightshade Sword",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A sword from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Bumpkin Armor": {
      name: "Bumpkin Armor",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Armor from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Helmet": {
      name: "Bumpkin Helmet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A helmet from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Sword": {
      name: "Bumpkin Sword",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A sword from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Pants": {
      name: "Bumpkin Pants",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Pants from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Sabaton": {
      name: "Bumpkin Sabaton",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Sabatons from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Sunflorian Armor": {
      name: "Sunflorian Armor",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Armor from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Sword": {
      name: "Sunflorian Sword",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A sword from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Helmet": {
      name: "Sunflorian Helmet",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A helmet from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Pants": {
      name: "Sunflorian Pants",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Pants from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Sabaton": {
      name: "Sunflorian Sabaton",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Sabatons from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Knight Gambit": {
      name: "Knight Gambit",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A gambit from the Knights.",
      type: "wearable",
    },
    Motley: {
      name: "Motley",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A motley from the Jesters.",
      type: "wearable",
    },
    "Royal Braids": {
      name: "Royal Braids",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Royal braids from the Royals.",
      type: "wearable",
    },
    "Cooking Boost": {
      name: "Cooking Boost",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Reduces cooking time by 50% for 4 hours.",
      type: "collectible",
    },
    "Crop Boost": {
      name: "Crop Boost",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Reduces crop growth time by 25% for 6 hours.",
      type: "collectible",
    },
    "Wood Boost": {
      name: "Wood Boost",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Reduces tree growth time by 25% for 4 hours.",
      type: "collectible",
    },
    "Mineral Boost": {
      name: "Mineral Boost",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription:
        "Reduces mineral replenish cooldown by 50% for 3 hours.",
      type: "collectible",
    },
    "Fruit Boost": {
      name: "Fruit Boost",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Reduces fruit growth time by 25% for 6 hours.",
      type: "collectible",
    },
    "Fish Boost": {
      name: "Fish Boost",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Gives a 50% chance of +1 fish for 4 hours.",
      type: "collectible",
    },
    "Flower Boost": {
      name: "Flower Boost",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "Increases flower growth time by 25% for 4 hours.",
      type: "collectible",
    },
    "Sunflorian Faction Rug": {
      name: "Sunflorian Faction Rug",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A rug from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Faction Rug": {
      name: "Nightshade Faction Rug",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A rug from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Faction Rug": {
      name: "Goblin Faction Rug",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A rug from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Faction Rug": {
      name: "Bumpkin Faction Rug",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: "A rug from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
  };
