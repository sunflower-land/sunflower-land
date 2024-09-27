import Decimal from "decimal.js-light";
import { FactionName, Keys, ShopItemBase } from "./game";
import { translate } from "lib/i18n/translate";
import { HourglassType } from "features/island/collectibles/components/Hourglass";

type BumpkinFactionCollectibleName =
  | "Bumpkin Throne"
  | "Bumpkin Charm Egg"
  | "Sapphire Bumpkin Goblet"
  | "Bumpkin Bunting"
  | "Bumpkin Candles"
  | "Bumpkin Left Wall Sconce"
  | "Bumpkin Right Wall Sconce"
  | "Bumpkin Faction Rug";

type GoblinFactionCollectibleName =
  | "Goblin Throne"
  | "Goblin Mischief Egg"
  | "Emerald Goblin Goblet"
  | "Goblin Bunting"
  | "Goblin Candles"
  | "Goblin Left Wall Sconce"
  | "Goblin Right Wall Sconce"
  | "Goblin Faction Rug";

type SunflorianFactionCollectibleName =
  | "Sunflorian Throne"
  | "Golden Sunflorian Egg"
  | "Opal Sunflorian Goblet"
  | "Sunflorian Bunting"
  | "Sunflorian Candles"
  | "Sunflorian Left Wall Sconce"
  | "Sunflorian Right Wall Sconce"
  | "Sunflorian Faction Rug";

type NightshadeFactionCollectibleName =
  | "Nightshade Throne"
  | "Nightshade Veil Egg"
  | "Amethyst Nightshade Goblet"
  | "Nightshade Bunting"
  | "Nightshade Candles"
  | "Nightshade Left Wall Sconce"
  | "Nightshade Right Wall Sconce"
  | "Nightshade Faction Rug";

export type FactionShopCollectibleName =
  | BumpkinFactionCollectibleName
  | GoblinFactionCollectibleName
  | SunflorianFactionCollectibleName
  | NightshadeFactionCollectibleName
  | "Golden Faction Goblet"
  | "Ruby Faction Goblet"
  | HourglassType;

type BumpkinFactionWearableName =
  | "Bumpkin Armor"
  | "Bumpkin Helmet"
  | "Bumpkin Sword"
  | "Bumpkin Pants"
  | "Bumpkin Sabatons"
  | "Bumpkin Crown"
  | "Bumpkin Shield"
  | "Bumpkin Quiver"
  | "Bumpkin Medallion";

type GoblinFactionWearableName =
  | "Goblin Armor"
  | "Goblin Helmet"
  | "Goblin Pants"
  | "Goblin Sabatons"
  | "Goblin Axe"
  | "Goblin Crown"
  | "Goblin Shield"
  | "Goblin Quiver"
  | "Goblin Medallion";

type SunflorianFactionWearableName =
  | "Sunflorian Armor"
  | "Sunflorian Sword"
  | "Sunflorian Helmet"
  | "Sunflorian Pants"
  | "Sunflorian Sabatons"
  | "Sunflorian Crown"
  | "Sunflorian Shield"
  | "Sunflorian Quiver"
  | "Sunflorian Medallion";

type NightshadeFactionWearableName =
  | "Nightshade Armor"
  | "Nightshade Helmet"
  | "Nightshade Pants"
  | "Nightshade Sabatons"
  | "Nightshade Sword"
  | "Nightshade Crown"
  | "Nightshade Shield"
  | "Nightshade Quiver"
  | "Nightshade Medallion";

export type FactionShopWearableName =
  | BumpkinFactionWearableName
  | GoblinFactionWearableName
  | SunflorianFactionWearableName
  | NightshadeFactionWearableName
  | "Knight Gambit"
  | "Royal Braids";

export type FactionShopFoodName = "Paella" | "Caponata" | "Glazed Carrots";

type FactionItemBase = {
  faction?: FactionName;
  requires?: FactionShopWearableName;
} & ShopItemBase;

export type FactionShopWearable = {
  name: FactionShopWearableName;
} & FactionItemBase;

export type FactionShopCollectible = {
  name: FactionShopCollectibleName;
} & FactionItemBase;

export type FactionShopFood = {
  name: FactionShopFoodName;
} & FactionItemBase;

export type FactionShopKeys = {
  name: Keys;
} & FactionItemBase;

export type FactionShopItemName =
  | FactionShopWearableName
  | FactionShopCollectibleName
  | FactionShopFoodName
  | Keys;

export type FactionShopItem =
  | FactionShopWearable
  | FactionShopCollectible
  | FactionShopFood
  | FactionShopKeys;

const BUMPKIN_FACTION_ITEMS: Record<
  BumpkinFactionCollectibleName | BumpkinFactionWearableName,
  FactionShopItem & { faction: "bumpkins" }
> = {
  "Bumpkin Throne": {
    name: "Bumpkin Throne",
    price: new Decimal(75000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinThrone"),
    type: "collectible",
    faction: "bumpkins",
  },
  "Bumpkin Charm Egg": {
    name: "Bumpkin Charm Egg",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinCharmEgg"),
    type: "collectible",
    faction: "bumpkins",
  },
  "Sapphire Bumpkin Goblet": {
    name: "Sapphire Bumpkin Goblet",
    price: new Decimal(18750),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.sapphireBumpkinGoblet",
    ),
    type: "collectible",
    faction: "bumpkins",
  },
  "Bumpkin Bunting": {
    name: "Bumpkin Bunting",
    price: new Decimal(7500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinBunting"),
    type: "collectible",
    faction: "bumpkins",
  },
  "Bumpkin Candles": {
    name: "Bumpkin Candles",
    price: new Decimal(750),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinCandles"),
    type: "collectible",
    faction: "bumpkins",
  },
  "Bumpkin Left Wall Sconce": {
    name: "Bumpkin Left Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.bumpkinLeftWallSconce",
    ),
    type: "collectible",
    faction: "bumpkins",
  },
  "Bumpkin Right Wall Sconce": {
    name: "Bumpkin Right Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.bumpkinRightWallSconce",
    ),
    type: "collectible",
    faction: "bumpkins",
  },
  "Bumpkin Faction Rug": {
    name: "Bumpkin Faction Rug",
    price: new Decimal(100),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinFactionRug"),
    type: "collectible",
    faction: "bumpkins",
  },

  // Wearables
  "Bumpkin Armor": {
    name: "Bumpkin Armor",
    price: new Decimal(112500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinArmor"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Helmet": {
    name: "Bumpkin Helmet",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinHelmet"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Sword": {
    name: "Bumpkin Sword",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinSword"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Pants": {
    name: "Bumpkin Pants",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinPants"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Sabatons": {
    name: "Bumpkin Sabatons",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinSabatons"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Crown": {
    name: "Bumpkin Crown",
    price: new Decimal(210000),
    requires: "Bumpkin Helmet",
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinCrown"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Shield": {
    name: "Bumpkin Shield",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinShield"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Quiver": {
    name: "Bumpkin Quiver",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinQuiver"),
    type: "wearable",
    faction: "bumpkins",
  },
  "Bumpkin Medallion": {
    name: "Bumpkin Medallion",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.bumpkinMedallion"),
    type: "wearable",
    faction: "bumpkins",
  },
};

const GOBLIN_FACTION_ITEMS: Record<
  GoblinFactionCollectibleName | GoblinFactionWearableName,
  FactionShopItem & { faction: "goblins" }
> = {
  "Goblin Throne": {
    name: "Goblin Throne",
    price: new Decimal(75000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinThrone"),
    type: "collectible",
    faction: "goblins",
  },
  "Goblin Mischief Egg": {
    name: "Goblin Mischief Egg",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinMischiefEgg"),
    type: "collectible",
    faction: "goblins",
  },
  "Emerald Goblin Goblet": {
    name: "Emerald Goblin Goblet",
    price: new Decimal(18750),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.emeraldGoblinGoblet"),
    type: "collectible",
    faction: "goblins",
  },
  "Goblin Bunting": {
    name: "Goblin Bunting",
    price: new Decimal(7500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinBunting"),
    type: "collectible",
    faction: "goblins",
  },
  "Goblin Candles": {
    name: "Goblin Candles",
    price: new Decimal(750),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinCandles"),
    type: "collectible",
    faction: "goblins",
  },
  "Goblin Left Wall Sconce": {
    name: "Goblin Left Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinLeftWallSconce"),
    type: "collectible",
    faction: "goblins",
  },
  "Goblin Right Wall Sconce": {
    name: "Goblin Right Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.goblinRightWallSconce",
    ),
    type: "collectible",
    faction: "goblins",
  },
  "Goblin Faction Rug": {
    name: "Goblin Faction Rug",
    price: new Decimal(100),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinFactionRug"),
    type: "collectible",
    faction: "goblins",
  },

  // Wearables
  "Goblin Armor": {
    name: "Goblin Armor",
    price: new Decimal(112500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinArmor"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Helmet": {
    name: "Goblin Helmet",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinHelmet"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Pants": {
    name: "Goblin Pants",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinPants"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Sabatons": {
    name: "Goblin Sabatons",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinSabatons"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Axe": {
    name: "Goblin Axe",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinAxe"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Crown": {
    name: "Goblin Crown",
    price: new Decimal(210000),
    requires: "Goblin Helmet",
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinCrown"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Shield": {
    name: "Goblin Shield",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinShield"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Quiver": {
    name: "Goblin Quiver",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinQuiver"),
    type: "wearable",
    faction: "goblins",
  },
  "Goblin Medallion": {
    name: "Goblin Medallion",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goblinMedallion"),
    type: "wearable",
    faction: "goblins",
  },
};

const SUNFLORIAN_FACTION_ITEMS: Record<
  SunflorianFactionCollectibleName | SunflorianFactionWearableName,
  FactionShopItem & { faction: "sunflorians" }
> = {
  // Collectibles
  "Sunflorian Throne": {
    name: "Sunflorian Throne",
    price: new Decimal(75000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianThrone"),
    type: "collectible",
    faction: "sunflorians",
  },
  "Golden Sunflorian Egg": {
    name: "Golden Sunflorian Egg",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.goldenSunflorianEgg"),
    type: "collectible",
    faction: "sunflorians",
  },
  "Opal Sunflorian Goblet": {
    name: "Opal Sunflorian Goblet",
    price: new Decimal(18750),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.opalSunflorianGoblet"),
    type: "collectible",
    faction: "sunflorians",
  },
  "Sunflorian Bunting": {
    name: "Sunflorian Bunting",
    price: new Decimal(7500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianBunting"),
    type: "collectible",
    faction: "sunflorians",
  },
  "Sunflorian Candles": {
    name: "Sunflorian Candles",
    price: new Decimal(750),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianCandles"),
    type: "collectible",
    faction: "sunflorians",
  },
  "Sunflorian Left Wall Sconce": {
    name: "Sunflorian Left Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.sunflorianLeftWallSconce",
    ),
    type: "collectible",
    faction: "sunflorians",
  },
  "Sunflorian Right Wall Sconce": {
    name: "Sunflorian Right Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.sunflorianRightWallSconce",
    ),
    type: "collectible",
    faction: "sunflorians",
  },
  "Sunflorian Faction Rug": {
    name: "Sunflorian Faction Rug",
    price: new Decimal(100),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianFactionRug"),
    type: "collectible",
    faction: "sunflorians",
  },

  // Wearables
  "Sunflorian Armor": {
    name: "Sunflorian Armor",
    price: new Decimal(112500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianArmor"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Sword": {
    name: "Sunflorian Sword",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianSword"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Helmet": {
    name: "Sunflorian Helmet",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianHelmet"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Pants": {
    name: "Sunflorian Pants",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianPants"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Sabatons": {
    name: "Sunflorian Sabatons",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianSabatons"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Crown": {
    name: "Sunflorian Crown",
    price: new Decimal(210000),
    requires: "Sunflorian Helmet",
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianCrown"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Shield": {
    name: "Sunflorian Shield",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianShield"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Quiver": {
    name: "Sunflorian Quiver",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianQuiver"),
    type: "wearable",
    faction: "sunflorians",
  },
  "Sunflorian Medallion": {
    name: "Sunflorian Medallion",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.sunflorianMedallion"),
    type: "wearable",
    faction: "sunflorians",
  },
};

const NIGHTSHADE_FACTION_ITEMS: Record<
  NightshadeFactionCollectibleName | NightshadeFactionWearableName,
  FactionShopItem & { faction: "nightshades" }
> = {
  "Nightshade Throne": {
    name: "Nightshade Throne",
    price: new Decimal(75000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeThrone"),
    type: "collectible",
    faction: "nightshades",
  },
  "Nightshade Veil Egg": {
    name: "Nightshade Veil Egg",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeVeilEgg"),
    type: "collectible",
    faction: "nightshades",
  },
  "Amethyst Nightshade Goblet": {
    name: "Amethyst Nightshade Goblet",
    price: new Decimal(18750),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.amethystNightshadeGoblet",
    ),
    type: "collectible",
    faction: "nightshades",
  },
  "Nightshade Bunting": {
    name: "Nightshade Bunting",
    price: new Decimal(7500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeBunting"),
    type: "collectible",
    faction: "nightshades",
  },
  "Nightshade Candles": {
    name: "Nightshade Candles",
    price: new Decimal(750),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeCandles"),
    type: "collectible",
    faction: "nightshades",
  },
  "Nightshade Left Wall Sconce": {
    name: "Nightshade Left Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.nightshadeLeftWallSconce",
    ),
    type: "collectible",
    faction: "nightshades",
  },
  "Nightshade Right Wall Sconce": {
    name: "Nightshade Right Wall Sconce",
    price: new Decimal(375),
    limit: null,
    currency: "Mark",
    shortDescription: translate(
      "description.factionShop.nightshadeRightWallSconce",
    ),
    type: "collectible",
    faction: "nightshades",
  },
  "Nightshade Faction Rug": {
    name: "Nightshade Faction Rug",
    price: new Decimal(100),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeFactionRug"),
    type: "collectible",
    faction: "nightshades",
  },

  // Wearables
  "Nightshade Armor": {
    name: "Nightshade Armor",
    price: new Decimal(112500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeArmor"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Helmet": {
    name: "Nightshade Helmet",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeHelmet"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Pants": {
    name: "Nightshade Pants",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadePants"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Sabatons": {
    name: "Nightshade Sabatons",
    price: new Decimal(37500),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeSabatons"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Sword": {
    name: "Nightshade Sword",
    price: new Decimal(56250),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeSword"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Crown": {
    name: "Nightshade Crown",
    price: new Decimal(210000),
    requires: "Nightshade Helmet",
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeCrown"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Shield": {
    name: "Nightshade Shield",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeShield"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Quiver": {
    name: "Nightshade Quiver",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeQuiver"),
    type: "wearable",
    faction: "nightshades",
  },
  "Nightshade Medallion": {
    name: "Nightshade Medallion",
    price: new Decimal(240000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.factionShop.nightshadeMedallion"),
    type: "wearable",
    faction: "nightshades",
  },
};

export const FACTION_SHOP_KEYS: Record<Keys, FactionShopKeys> = {
  "Treasure Key": {
    name: "Treasure Key",
    price: new Decimal(1000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.treasure.key"),
    type: "keys",
  },
  "Rare Key": {
    name: "Rare Key",
    price: new Decimal(3000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.rare.key"),
    type: "keys",
  },
  "Luxury Key": {
    name: "Luxury Key",
    price: new Decimal(10000),
    limit: null,
    currency: "Mark",
    shortDescription: translate("description.luxury.key"),
    type: "keys",
  },
};

export const FACTION_SHOP_ITEMS: Record<FactionShopItemName, FactionShopItem> =
  {
    "Golden Faction Goblet": {
      name: "Golden Faction Goblet",
      price: new Decimal(37500),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.goldenFactionGoblet",
      ),
      type: "collectible",
    },
    "Ruby Faction Goblet": {
      name: "Ruby Faction Goblet",
      price: new Decimal(75000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.rubyFactionGoblet"),
      type: "collectible",
    },
    "Knight Gambit": {
      name: "Knight Gambit",
      price: new Decimal(56250),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.knightGambit"),
      type: "wearable",
    },
    "Royal Braids": {
      name: "Royal Braids",
      price: new Decimal(37500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.royalBraids"),
      type: "wearable",
    },
    "Gourmet Hourglass": {
      name: "Gourmet Hourglass",
      price: new Decimal(1500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.cookingBoost"),
      type: "collectible",
    },
    "Harvest Hourglass": {
      name: "Harvest Hourglass",
      price: new Decimal(5000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.cropBoost"),
      type: "collectible",
    },
    "Timber Hourglass": {
      name: "Timber Hourglass",
      price: new Decimal(4000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.woodBoost"),
      type: "collectible",
    },
    "Ore Hourglass": {
      name: "Ore Hourglass",
      price: new Decimal(8000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.mineralBoost"),
      type: "collectible",
    },
    "Orchard Hourglass": {
      name: "Orchard Hourglass",
      price: new Decimal(4000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.fruitBoost"),
      type: "collectible",
    },
    "Fisher's Hourglass": {
      name: "Fisher's Hourglass",
      price: new Decimal(2000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.fishBoost"),
      type: "collectible",
    },
    "Blossom Hourglass": {
      name: "Blossom Hourglass",
      price: new Decimal(2000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.flowerBoost"),
      type: "collectible",
    },
    Paella: {
      name: "Paella",
      price: new Decimal(2500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.paella.one"),
      type: "food",
    },
    Caponata: {
      name: "Caponata",
      price: new Decimal(2000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.caponata.one"),
      type: "food",
    },
    "Glazed Carrots": {
      name: "Glazed Carrots",
      price: new Decimal(1500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.glazedCarrots.one"),
      type: "food",
    },
    ...BUMPKIN_FACTION_ITEMS,
    ...GOBLIN_FACTION_ITEMS,
    ...SUNFLORIAN_FACTION_ITEMS,
    ...NIGHTSHADE_FACTION_ITEMS,
    ...FACTION_SHOP_KEYS,
  };
