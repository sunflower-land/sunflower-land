import { FactionName } from "./game";

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
  | "Bumpkin Right Wall Candle";

type FactionShopWearableName =
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
  marks: number;
  shortDescription: string;
  faction?: FactionName;
  type: "wearable" | "collectible";
};

type FactionShopWearable = {
  name: FactionShopWearableName;
} & FactionItemBase;

type FactionShopCollectible = {
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
      marks: 100,
      shortDescription: "A throne fit for a Sunflorian.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Throne": {
      name: "Nightshade Throne",
      marks: 100,
      shortDescription: "A throne fit for a Nightshade.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Throne": {
      name: "Goblin Throne",
      marks: 100,
      shortDescription: "A throne fit for a Goblin.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Throne": {
      name: "Bumpkin Throne",
      marks: 100,
      shortDescription: "A throne fit for a Bumpkin.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Golden Sunflorian Egg": {
      name: "Golden Sunflorian Egg",
      marks: 50,
      shortDescription: "A jewelled egg created by the House of Sunflorian.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Goblin Mischief Egg": {
      name: "Goblin Mischief Egg",
      marks: 50,
      shortDescription: "A jewelled egg created by the House of Goblin.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Charm Egg": {
      name: "Bumpkin Charm Egg",
      marks: 50,
      shortDescription: "A jewelled egg created by the House of Bumpkin.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Nightshade Veil Egg": {
      name: "Nightshade Veil Egg",
      marks: 50,
      shortDescription: "A jewelled egg created by the House of Nightshade.",
      type: "collectible",
      faction: "nightshades",
    },
    "Emerald Goblin Goblet": {
      name: "Emerald Goblin Goblet",
      marks: 25,
      shortDescription: "An emerald goblet.",
      type: "collectible",
      faction: "goblins",
    },
    "Opal Sunflorian Goblet": {
      name: "Opal Sunflorian Goblet",
      marks: 25,
      shortDescription: "An opal goblet.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Sapphire Bumpkin Goblet": {
      name: "Sapphire Bumpkin Goblet",
      marks: 25,
      shortDescription: "A sapphire goblet.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Amethyst Nightshade Goblet": {
      name: "Amethyst Nightshade Goblet",
      marks: 25,
      shortDescription: "An amethyst goblet.",
      type: "collectible",
      faction: "nightshades",
    },
    "Golden Faction Goblet": {
      name: "Golden Faction Goblet",
      marks: 25,
      shortDescription: "A golden goblet.",
      type: "collectible",
    },
    "Ruby Faction Goblet": {
      name: "Ruby Faction Goblet",
      marks: 25,
      shortDescription: "A ruby goblet.",
      type: "collectible",
    },
    "Sunflorian Victory Bunting": {
      name: "Sunflorian Victory Bunting",
      marks: 10,
      shortDescription: "Victory bunting from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Victory Bunting": {
      name: "Nightshade Victory Bunting",
      marks: 10,
      shortDescription: "Victory bunting from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Victory Bunting": {
      name: "Goblin Victory Bunting",
      marks: 10,
      shortDescription: "Victory bunting from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Victory Bunting": {
      name: "Bumpkin Victory Bunting",
      marks: 10,
      shortDescription: "Victory bunting from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Sunflorian Candles": {
      name: "Sunflorian Candles",
      marks: 5,
      shortDescription: "Candles from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Candles": {
      name: "Nightshade Candles",
      marks: 5,
      shortDescription: "Candles from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Candles": {
      name: "Goblin Candles",
      marks: 5,
      shortDescription: "Candles from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Candles": {
      name: "Bumpkin Candles",
      marks: 5,
      shortDescription: "Candles from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Sunflorian Left Wall Candle": {
      name: "Sunflorian Left Wall Candle",
      marks: 5,
      shortDescription:
        "A candle for the left wall from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Left Wall Candle": {
      name: "Nightshade Left Wall Candle",
      marks: 5,
      shortDescription:
        "A candle for the left wall from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Left Wall Candle": {
      name: "Goblin Left Wall Candle",
      marks: 5,
      shortDescription: "A candle for the left wall from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Left Wall Candle": {
      name: "Bumpkin Left Wall Candle",
      marks: 5,
      shortDescription: "A candle for the left wall from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Sunflorian Right Wall Candle": {
      name: "Sunflorian Right Wall Candle",
      marks: 5,
      shortDescription:
        "A candle for the right wall from the Sunflorian faction.",
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Right Wall Candle": {
      name: "Nightshade Right Wall Candle",
      marks: 5,
      shortDescription:
        "A candle for the right wall from the Nightshade faction.",
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Right Wall Candle": {
      name: "Goblin Right Wall Candle",
      marks: 5,
      shortDescription: "A candle for the right wall from the Goblin faction.",
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Right Wall Candle": {
      name: "Bumpkin Right Wall Candle",
      marks: 5,
      shortDescription: "A candle for the right wall from the Bumpkin faction.",
      type: "collectible",
      faction: "bumpkins",
    },
    "Goblin Armor": {
      name: "Goblin Armor",
      marks: 50,
      shortDescription: "Armor from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Helmet": {
      name: "Goblin Helmet",
      marks: 25,
      shortDescription: "A helmet from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Pants": {
      name: "Goblin Pants",
      marks: 25,
      shortDescription: "Pants from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Sabaton": {
      name: "Goblin Sabaton",
      marks: 25,
      shortDescription: "Sabatons from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Goblin Axe": {
      name: "Goblin Axe",
      marks: 50,
      shortDescription: "An axe from the Goblin faction.",
      type: "wearable",
      faction: "goblins",
    },
    "Nightshade Armor": {
      name: "Nightshade Armor",
      marks: 50,
      shortDescription: "Armor from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Helmet": {
      name: "Nightshade Helmet",
      marks: 25,
      shortDescription: "A helmet from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Pants": {
      name: "Nightshade Pants",
      marks: 25,
      shortDescription: "Pants from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Sabaton": {
      name: "Nightshade Sabaton",
      marks: 25,
      shortDescription: "Sabatons from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Nightshade Sword": {
      name: "Nightshade Sword",
      marks: 50,
      shortDescription: "A sword from the Nightshade faction.",
      type: "wearable",
      faction: "nightshades",
    },
    "Bumpkin Armor": {
      name: "Bumpkin Armor",
      marks: 50,
      shortDescription: "Armor from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Helmet": {
      name: "Bumpkin Helmet",
      marks: 25,
      shortDescription: "A helmet from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Sword": {
      name: "Bumpkin Sword",
      marks: 50,
      shortDescription: "A sword from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Pants": {
      name: "Bumpkin Pants",
      marks: 25,
      shortDescription: "Pants from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Bumpkin Sabaton": {
      name: "Bumpkin Sabaton",
      marks: 25,
      shortDescription: "Sabatons from the Bumpkin faction.",
      type: "wearable",
      faction: "bumpkins",
    },
    "Sunflorian Armor": {
      name: "Sunflorian Armor",
      marks: 50,
      shortDescription: "Armor from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Sword": {
      name: "Sunflorian Sword",
      marks: 50,
      shortDescription: "A sword from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Helmet": {
      name: "Sunflorian Helmet",
      marks: 25,
      shortDescription: "A helmet from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Pants": {
      name: "Sunflorian Pants",
      marks: 25,
      shortDescription: "Pants from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Sunflorian Sabaton": {
      name: "Sunflorian Sabaton",
      marks: 25,
      shortDescription: "Sabatons from the Sunflorian faction.",
      type: "wearable",
      faction: "sunflorians",
    },
    "Knight Gambit": {
      name: "Knight Gambit",
      marks: 25,
      shortDescription: "A gambit from the Knights.",
      type: "wearable",
    },
    Motley: {
      name: "Motley",
      marks: 25,
      shortDescription: "A motley from the Jesters.",
      type: "wearable",
    },
    "Royal Braids": {
      name: "Royal Braids",
      marks: 25,
      shortDescription: "Royal braids from the Royals.",
      type: "wearable",
    },
  };
