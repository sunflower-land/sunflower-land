import Decimal from "decimal.js-light";
import { FactionName, ShopItemBase } from "./game";
import { translate } from "lib/i18n/translate";

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
  | "Sunflorian Bunting"
  | "Nightshade Bunting"
  | "Goblin Bunting"
  | "Bumpkin Bunting"
  | "Sunflorian Candles"
  | "Nightshade Candles"
  | "Goblin Candles"
  | "Bumpkin Candles"
  | "Sunflorian Left Wall Sconce"
  | "Nightshade Left Wall Sconce"
  | "Goblin Left Wall Sconce"
  | "Bumpkin Left Wall Sconce"
  | "Sunflorian Right Wall Sconce"
  | "Nightshade Right Wall Sconce"
  | "Goblin Right Wall Sconce"
  | "Bumpkin Right Wall Sconce"
  | "Gourmet Hourglass"
  | "Harvest Hourglass"
  | "Timber Hourglass"
  | "Ore Hourglass"
  | "Orchard Hourglass"
  | "Blossom Hourglass"
  | "Fisher's Hourglass"
  | "Sunflorian Faction Rug"
  | "Nightshade Faction Rug"
  | "Goblin Faction Rug"
  | "Bumpkin Faction Rug";

export type FactionShopWearableName =
  | "Goblin Armor"
  | "Goblin Helmet"
  | "Goblin Pants"
  | "Goblin Sabatons"
  | "Goblin Axe"
  | "Nightshade Armor"
  | "Nightshade Helmet"
  | "Nightshade Pants"
  | "Nightshade Sabatons"
  | "Nightshade Sword"
  | "Bumpkin Armor"
  | "Bumpkin Helmet"
  | "Bumpkin Sword"
  | "Bumpkin Pants"
  | "Bumpkin Sabatons"
  | "Sunflorian Armor"
  | "Sunflorian Sword"
  | "Sunflorian Helmet"
  | "Sunflorian Pants"
  | "Sunflorian Sabatons"
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
      price: new Decimal(75000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.sunflorianThrone"),
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Throne": {
      name: "Nightshade Throne",
      price: new Decimal(75000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.nightshadeThrone"),
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Throne": {
      name: "Goblin Throne",
      price: new Decimal(75000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.goblinThrone"),
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Throne": {
      name: "Bumpkin Throne",
      price: new Decimal(75000),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.bumpkinThrone"),
      type: "collectible",
      faction: "bumpkins",
    },
    "Golden Sunflorian Egg": {
      name: "Golden Sunflorian Egg",
      price: new Decimal(37500),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.goldenSunflorianEgg"
      ),
      type: "collectible",
      faction: "sunflorians",
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
    "Bumpkin Charm Egg": {
      name: "Bumpkin Charm Egg",
      price: new Decimal(37500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.bumpkinCharmEgg"),
      type: "collectible",
      faction: "bumpkins",
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
    "Emerald Goblin Goblet": {
      name: "Emerald Goblin Goblet",
      price: new Decimal(18750),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.emeraldGoblinGoblet"
      ),
      type: "collectible",
      faction: "goblins",
    },
    "Opal Sunflorian Goblet": {
      name: "Opal Sunflorian Goblet",
      price: new Decimal(18750),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.opalSunflorianGoblet"
      ),
      type: "collectible",
      faction: "sunflorians",
    },
    "Sapphire Bumpkin Goblet": {
      name: "Sapphire Bumpkin Goblet",
      price: new Decimal(18750),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.sapphireBumpkinGoblet"
      ),
      type: "collectible",
      faction: "bumpkins",
    },
    "Amethyst Nightshade Goblet": {
      name: "Amethyst Nightshade Goblet",
      price: new Decimal(18750),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.amethystNightshadeGoblet"
      ),
      type: "collectible",
      faction: "nightshades",
    },
    "Golden Faction Goblet": {
      name: "Golden Faction Goblet",
      price: new Decimal(37500),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.goldenFactionGoblet"
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
    "Sunflorian Bunting": {
      name: "Sunflorian Bunting",
      price: new Decimal(7500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.sunflorianBunting"),
      type: "collectible",
      faction: "sunflorians",
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
    "Goblin Bunting": {
      name: "Goblin Bunting",
      price: new Decimal(7500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.goblinBunting"),
      type: "collectible",
      faction: "goblins",
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
    "Sunflorian Candles": {
      name: "Sunflorian Candles",
      price: new Decimal(750),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.sunflorianCandles"),
      type: "collectible",
      faction: "sunflorians",
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
    "Goblin Candles": {
      name: "Goblin Candles",
      price: new Decimal(750),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.goblinCandles"),
      type: "collectible",
      faction: "goblins",
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
    "Sunflorian Left Wall Sconce": {
      name: "Sunflorian Left Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.sunflorianLeftWallSconce"
      ),
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Left Wall Sconce": {
      name: "Nightshade Left Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.nightshadeLeftWallSconce"
      ),
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Left Wall Sconce": {
      name: "Goblin Left Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.goblinLeftWallSconce"
      ),
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Left Wall Sconce": {
      name: "Bumpkin Left Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.bumpkinLeftWallSconce"
      ),
      type: "collectible",
      faction: "bumpkins",
    },
    "Sunflorian Right Wall Sconce": {
      name: "Sunflorian Right Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.sunflorianRightWallSconce"
      ),
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Right Wall Sconce": {
      name: "Nightshade Right Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.nightshadeRightWallSconce"
      ),
      type: "collectible",
      faction: "nightshades",
    },
    "Goblin Right Wall Sconce": {
      name: "Goblin Right Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.goblinRightWallSconce"
      ),
      type: "collectible",
      faction: "goblins",
    },
    "Bumpkin Right Wall Sconce": {
      name: "Bumpkin Right Wall Sconce",
      price: new Decimal(375),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.bumpkinRightWallSconce"
      ),
      type: "collectible",
      faction: "bumpkins",
    },
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
    "Knight Gambit": {
      name: "Knight Gambit",
      price: new Decimal(56250),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.knightGambit"),
      type: "wearable",
    },
    Motley: {
      name: "Motley",
      price: new Decimal(22500),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.motley"),
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
    "Sunflorian Faction Rug": {
      name: "Sunflorian Faction Rug",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.sunflorianFactionRug"
      ),
      type: "collectible",
      faction: "sunflorians",
    },
    "Nightshade Faction Rug": {
      name: "Nightshade Faction Rug",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: translate(
        "description.factionShop.nightshadeFactionRug"
      ),
      type: "collectible",
      faction: "nightshades",
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
    "Bumpkin Faction Rug": {
      name: "Bumpkin Faction Rug",
      price: new Decimal(100),
      limit: null,
      currency: "Mark",
      shortDescription: translate("description.factionShop.bumpkinFactionRug"),
      type: "collectible",
      faction: "bumpkins",
    },
  };
