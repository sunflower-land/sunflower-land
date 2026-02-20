import Decimal from "decimal.js-light";
import { CropSeedName } from "./crops";
import {
  BedName,
  FactionBanner,
  InventoryItemName,
  LanternName,
  MutantAnimal,
} from "./game";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flag, FLAGS } from "./flags";
import { LimitedItemType } from ".";
import { DecorationName, DECORATION_DIMENSIONS } from "./decorations";
import { BeanName, MutantCropName } from "./beans";
import {
  GoblinBlacksmithItemName,
  GoblinPirateItemName,
  HeliosBlacksmithItem,
  MegaStoreCollectibleName,
  PotionHouseItemName,
  SoldOutCollectibleName,
  TreasureCollectibleItem,
} from "./collectibles";
import { BoostTreasure } from "./treasure";
import { MarineMarvelName, OldFishName } from "./fishing";
import { ChapterBanner } from "./chapters";
import { EpicFlowerName, MutantFlowerName } from "./flowers";
import { translate } from "lib/i18n/translate";
import { FactionShopCollectibleName } from "./factionShop";
import { BED_FARMHAND_COUNT } from "./beds";
import { ChapterCollectibleName } from "./megastore";
import { MonumentName } from "./monuments";
import { PetName, PetShrineName } from "./pets";

export { FLAGS };

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName =
  | LimitedItemName
  | ToolName
  | CropSeedName
  | Food
  | Animal
  | Flag
  | Shovel
  | TravelingSalesmanItem
  | WarBanner
  | HeliosBlacksmithItem
  // TEMP
  | "Chef Apron";

export interface Craftable {
  name: CraftableName;
  description: string;
  price?: number;
  sellPrice?: number;
  ingredients: Ingredient[];
  limit?: number;
  supply?: number;
  disabled?: boolean;
  requires?: InventoryItemName;
  section?: Section;
}

export type Ingredient = {
  id?: number;
  item: InventoryItemName;
  amount: Decimal;
};

export interface CraftableItem {
  id?: number;
  name: CraftableName;
  description: string;
  price?: number;
  ingredients?: Ingredient[];
  disabled?: boolean;
  // Hidden for crafting
  hidden?: boolean;
  requires?: InventoryItemName;
  /**
   * When enabled, description and price will display as "?"
   * This is to reduce people viewing placeholder development code and assuming that is the price/buff
   */
  isPlaceholder?: boolean;
  bumpkinLevel?: number;
  canMintMultiple?: boolean;
  /**
   * Date the item will be craftable in milliseconds
   * Date.UTC(YEAR, MONTH, DAY, HOUR?, MINUTE?, SECONDS?, MS?)
   * REMEMBER MONTHS START IN 0, 0 = JAN, 1 = FEB...
   */
  mintReleaseDate?: number;
}

export interface LimitedItem extends CraftableItem {
  maxSupply?: number;
  section?: Section;
  cooldownSeconds?: number;
  mintedAt?: number;
  type?: LimitedItemType;
  requires?: InventoryItemName;
}

export type MOMEventItem = "Engine Core" | "Observatory";

export type TravelingSalesmanItem =
  | "Wicker Man"
  | "Golden Bonsai"
  | "Victoria Sisters"
  | "Christmas Bear";

export type QuestItem =
  | "Goblin Key"
  | "Sunflower Key"
  | "Ancient Goblin Sword"
  | "Ancient Human Warhammer";

export type LegacyItem =
  | "Sunflower Statue"
  | "Potato Statue"
  | "Christmas Tree"
  | "Gnome"
  | "Sunflower Tombstone"
  | "Sunflower Rock"
  | "Goblin Crown"
  | "Fountain"
  | "Woody the Beaver"
  | "Apprentice Beaver"
  | "Foreman Beaver"
  | "Nyon Statue"
  | "Homeless Tent"
  | "Egg Basket"
  | "Farmer Bath"
  | "Mysterious Head"
  | "Tunnel Mole"
  | "Rocky the Mole"
  | "Nugget"
  | "Rock Golem";

export type BarnItem =
  | "Farm Cat"
  | "Farm Dog"
  | "Chicken Coop"
  | "Gold Egg"
  | "Easter Bunny"
  | "Rooster";

export type MarketItem =
  | "Nancy"
  | "Scarecrow"
  | "Kuebiko"
  | "Golden Cauliflower"
  | "Mysterious Parsnip"
  | "Carrot Sword";

export type WarBanner = "Human War Banner" | "Goblin War Banner";

export type WarTentItem =
  | "Sunflower Amulet"
  | "Carrot Amulet"
  | "Beetroot Amulet"
  | "Green Amulet"
  | "Warrior Shirt"
  | "Warrior Pants"
  | "Warrior Helmet"
  | "Sunflower Shield"
  | "Skull Hat"
  | "War Skull"
  | "War Tombstone"
  | "Undead Rooster";

export type LimitedItemName =
  | LegacyItem
  | BarnItem
  | MarketItem
  | Flag
  | MOMEventItem
  | QuestItem
  | WarTentItem;

export type CollectibleName =
  | LegacyItem
  | BarnItem
  | MarketItem
  | Flag
  | TravelingSalesmanItem
  | MutantAnimal
  | MutantCropName
  | DecorationName
  | BeanName
  | HeliosBlacksmithItem
  | GoblinBlacksmithItemName
  | SoldOutCollectibleName
  | GoblinPirateItemName
  | ChapterBanner
  | BoostTreasure
  | WarBanner
  | LanternName
  | "Observatory"
  | "War Skull"
  | "War Tombstone"
  | "Undead Rooster"
  | PotionHouseItemName
  | MarineMarvelName
  | OldFishName
  | MegaStoreCollectibleName
  | EpicFlowerName
  | FactionBanner
  | "Lifetime Farmer Banner"
  | FactionShopCollectibleName
  | TreasureCollectibleItem
  | MutantFlowerName
  | BedName
  | ChapterCollectibleName
  | MonumentName
  | PetName
  | PetShrineName
  | "Obsidian Shrine";

export type ToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Gold Pickaxe"
  | "Hammer"
  | "Rod"
  | "Oil Drill"
  | "Crab Pot"
  | "Mariner Pot";

export type Shovel = "Rusty Shovel" | "Shovel";

export type Food =
  | "Pumpkin Soup"
  | "Roasted Cauliflower"
  | "Sauerkraut"
  | "Radish Pie"
  | Cake;

export type Cake =
  | "Sunflower Cake"
  | "Potato Cake"
  | "Pumpkin Cake"
  | "Carrot Cake"
  | "Cabbage Cake"
  | "Beetroot Cake"
  | "Cauliflower Cake"
  | "Parsnip Cake"
  | "Radish Cake"
  | "Wheat Cake";

export type Animal = "Chicken" | "Cow" | "Pig" | "Sheep";

export const FOODS: () => Record<Food, CraftableItem> = () => ({
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: translate("description.pumpkin.soup"),
    price: 3,
    ingredients: [
      {
        item: "Pumpkin",
        amount: new Decimal(5),
      },
    ],
    limit: 1,
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: translate("description.sauerkraut"),
    price: 25,
    ingredients: [
      {
        item: "Cabbage",
        amount: new Decimal(10),
      },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description: translate("description.roasted.cauliflower"),
    price: 150,
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(30),
      },
    ],
  },
  "Radish Pie": {
    name: "Radish Pie",
    description: translate("description.radish.pie"),
    price: 300,
    ingredients: [
      {
        item: "Radish",
        amount: new Decimal(60),
      },
    ],
  },
  ...CAKES(),
});

export const CAKES: () => Record<Cake, Craftable> = () => ({
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: translate("description.sunflower.cake"),
    price: 0,
    sellPrice: 320,
    ingredients: [
      {
        item: "Sunflower",
        amount: new Decimal(1000),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Potato Cake": {
    name: "Potato Cake",
    description: translate("description.potato.cake"),
    price: 0,
    sellPrice: 320,
    ingredients: [
      {
        item: "Potato",
        amount: new Decimal(500),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description: translate("description.pumpkin.cake"),
    price: 0,
    sellPrice: 320,
    ingredients: [
      {
        item: "Pumpkin",
        amount: new Decimal(130),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description: translate("description.carrot.cake"),
    price: 0,
    sellPrice: 360,
    ingredients: [
      {
        item: "Carrot",
        amount: new Decimal(120),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description: translate("description.cabbage.cake"),
    price: 0,
    sellPrice: 360,
    ingredients: [
      {
        item: "Cabbage",
        amount: new Decimal(90),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description: translate("description.beetroot.cake"),
    price: 0,
    sellPrice: 560,
    ingredients: [
      {
        item: "Beetroot",
        amount: new Decimal(100),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description: translate("description.cauliflower.cake"),
    price: 0,
    sellPrice: 560,
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(60),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description: translate("description.parsnip.cake"),
    price: 0,
    sellPrice: 560,
    ingredients: [
      {
        item: "Parsnip",
        amount: new Decimal(45),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Radish Cake": {
    name: "Radish Cake",
    description: translate("description.radish.cake"),
    price: 0,
    sellPrice: 560,
    ingredients: [
      {
        item: "Radish",
        amount: new Decimal(25),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description: translate("description.wheat.cake"),
    price: 0,
    sellPrice: 560,
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(35),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
});

export const TOOLS: Record<ToolName, CraftableItem> = {
  Axe: {
    name: "Axe",
    description: translate("description.axe"),
    price: 320,
    ingredients: [],
  },
  Pickaxe: {
    name: "Pickaxe",
    description: translate("description.pickaxe"),
    price: 320,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(2),
      },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: translate("description.stone.pickaxe"),
    price: 640,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(3),
      },
      {
        item: "Stone",
        amount: new Decimal(3),
      },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: translate("description.iron.pickaxe"),
    price: 1600,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Iron",
        amount: new Decimal(3),
      },
    ],
  },
  "Gold Pickaxe": {
    name: "Gold Pickaxe",
    description: translate("description.gold.pickaxe"),
    price: 2240,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(3),
      },
      {
        item: "Gold",
        amount: new Decimal(3),
      },
    ],
  },
  "Oil Drill": {
    name: "Oil Drill",
    description: translate("description.oil.drill"),
    price: 2240,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(25),
      },
      {
        item: "Iron",
        amount: new Decimal(10),
      },
    ],
  },
  Hammer: {
    name: "Hammer",
    description: translate("coming.soon"),
    price: 1600,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
  Rod: {
    name: "Rod",
    description: translate("description.rod"),
    price: 1600,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
  "Crab Pot": {
    name: "Crab Pot",
    description: translate("description.crab.pot"),
    price: 250,
    ingredients: [
      {
        item: "Feather",
        amount: new Decimal(5),
      },
      {
        item: "Wool",
        amount: new Decimal(3),
      },
    ],
  },
  "Mariner Pot": {
    name: "Mariner Pot",
    description: translate("description.mariner.pot"),
    price: 500,
    ingredients: [
      {
        item: "Feather",
        amount: new Decimal(10),
      },
      {
        item: "Merino Wool",
        amount: new Decimal(10),
      },
    ],
  },
};

export const SHOVELS: Record<Shovel, CraftableItem> = {
  "Rusty Shovel": {
    name: "Rusty Shovel",
    description: translate("description.rusty.shovel"),
    ingredients: [],
    hidden: true,
  },
  Shovel: {
    name: "Shovel",
    description: translate("description.shovel"),
    price: 0,
    ingredients: [
      {
        item: "Rusty Shovel",
        amount: new Decimal(1),
      },
      {
        item: "Iron",
        amount: new Decimal(10),
      },
      {
        item: "Wood",
        amount: new Decimal(20),
      },
    ],
  },
};

export const QUEST_ITEMS: Record<QuestItem, LimitedItem> = {
  "Goblin Key": {
    name: "Goblin Key",
    description: translate("description.goblin.key"),
    type: LimitedItemType.QuestItem,
  },
  "Sunflower Key": {
    name: "Sunflower Key",
    description: translate("description.sunflower.key"),
    type: LimitedItemType.QuestItem,
  },
  "Ancient Goblin Sword": {
    name: "Ancient Goblin Sword",
    description: translate("description.ancient.goblin.sword"),
    type: LimitedItemType.QuestItem,
  },
  "Ancient Human Warhammer": {
    name: "Ancient Human Warhammer",
    description: translate("description.ancient.human.warhammer"),
    type: LimitedItemType.QuestItem,
  },
};

export const SALESMAN_ITEMS: Record<TravelingSalesmanItem, LimitedItem> = {
  "Wicker Man": {
    name: "Wicker Man",
    description: translate("description.wicker.man"),
    disabled: false,
    section: Section["Wicker Man"],
  },
  "Golden Bonsai": {
    name: "Golden Bonsai",
    description: translate("description.golden bonsai"),
    section: Section["Golden Bonsai"],
    isPlaceholder: true,
  },
  "Victoria Sisters": {
    name: "Victoria Sisters",
    description: translate("description.victoria.sisters"),
    section: Section["Golden Bonsai"],
    isPlaceholder: true,
  },
  "Christmas Bear": {
    name: "Christmas Bear",
    description: translate("description.christmas.bear"),
    section: Section["Christmas Bear"],
    isPlaceholder: true,
  },
};

export const WAR_TENT_ITEMS: Record<WarTentItem, LimitedItem> = {
  "Sunflower Amulet": {
    name: "Sunflower Amulet",
    description: translate("description.sunflower.amulet"),
    type: LimitedItemType.WarTentItem,
  },
  "Carrot Amulet": {
    name: "Carrot Amulet",
    description: translate("description.carrot.amulet"),
    type: LimitedItemType.WarTentItem,
  },
  "Beetroot Amulet": {
    name: "Beetroot Amulet",
    description: translate("description.beetroot.amulet"),
    type: LimitedItemType.WarTentItem,
  },
  "Green Amulet": {
    name: "Green Amulet",
    description: translate("description.green.amulet"),
    type: LimitedItemType.WarTentItem,
  },
  "Warrior Shirt": {
    name: "Warrior Shirt",
    description: translate("description.warrior.shirt"),
    type: LimitedItemType.WarTentItem,
  },
  "Warrior Pants": {
    name: "Warrior Pants",
    description: translate("description.warrior.pants"),
    type: LimitedItemType.WarTentItem,
  },
  "Warrior Helmet": {
    name: "Warrior Helmet",
    description: translate("description.warrior.helmet"),
    type: LimitedItemType.WarTentItem,
  },
  "Sunflower Shield": {
    name: "Sunflower Shield",
    description: translate("description.sunflower.shield"),
    type: LimitedItemType.WarTentItem,
  },
  "Skull Hat": {
    name: "Skull Hat",
    description: translate("description.skull.hat"),
    type: LimitedItemType.WarTentItem,
  },
  "War Skull": {
    name: "War Skull",
    description: translate("description.war.skull"),
    type: LimitedItemType.WarTentItem,
    canMintMultiple: true,
  },
  "War Tombstone": {
    name: "War Tombstone",
    description: translate("description.war.tombstone"),
    type: LimitedItemType.WarTentItem,
    canMintMultiple: true,
  },
  "Undead Rooster": {
    name: "Undead Rooster",
    description: translate("description.undead.rooster"),
    type: LimitedItemType.WarTentItem,
  },
};

export const MOM_EVENT_ITEMS: Record<MOMEventItem, LimitedItem> = {
  "Engine Core": {
    name: "Engine Core",
    description: translate("description.engine.core"),
    type: LimitedItemType.MOMEventItem,
  },
  Observatory: {
    name: "Observatory",
    description: translate("description.observatory"),
    section: Section.Observatory,
    type: LimitedItemType.MOMEventItem,
  },
};

export const WAR_BANNERS: Record<WarBanner, CraftableItem> = {
  "Goblin War Banner": {
    name: "Goblin War Banner",
    description: translate("description.goblin.war.banner"),
  },
  "Human War Banner": {
    name: "Human War Banner",
    description: translate("description.human.war.banner"),
  },
};

export const BLACKSMITH_ITEMS: Record<LegacyItem | "Chef Apron", LimitedItem> =
  {
    "Sunflower Statue": {
      name: "Sunflower Statue",
      description: translate("description.sunflower.statue"),
      section: Section["Sunflower Statue"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Potato Statue": {
      name: "Potato Statue",
      description: translate("description.potato.statue"),
      section: Section["Potato Statue"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Christmas Tree": {
      name: "Christmas Tree",
      description: translate("description.christmas.tree"),
      section: Section["Christmas Tree"],
      type: LimitedItemType.BlacksmithItem,
    },
    Gnome: {
      name: "Gnome",
      description: translate("description.gnome"),
      section: Section.Gnome,
      type: LimitedItemType.BlacksmithItem,
    },
    "Homeless Tent": {
      name: "Homeless Tent",
      description: translate("description.homeless.tent"),
      section: Section.Tent,
      type: LimitedItemType.BlacksmithItem,
    },
    "Sunflower Tombstone": {
      name: "Sunflower Tombstone",
      description: translate("description.sunflower.tombstone"),
      section: Section["Sunflower Tombstone"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Sunflower Rock": {
      name: "Sunflower Rock",
      description: translate("description.sunflower.rock"),
      section: Section["Sunflower Rock"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Goblin Crown": {
      name: "Goblin Crown",
      description: translate("description.goblin.crown"),
      section: Section["Goblin Crown"],
      type: LimitedItemType.BlacksmithItem,
    },
    Fountain: {
      name: "Fountain",
      description: translate("description.fountain"),
      section: Section.Fountain,
      type: LimitedItemType.BlacksmithItem,
    },
    "Nyon Statue": {
      name: "Nyon Statue",
      description: translate("description.nyon.statue"),
      section: Section["Nyon Statue"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Farmer Bath": {
      name: "Farmer Bath",
      description: translate("description.farmer.bath"),
      section: Section["Bath"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Woody the Beaver": {
      name: "Woody the Beaver",
      description: translate("description.woody.Beaver"),
      section: Section.Beaver,
      type: LimitedItemType.BlacksmithItem,
    },
    "Apprentice Beaver": {
      name: "Apprentice Beaver",
      description: translate("description.apprentice.beaver"),
      section: Section.Beaver,
      type: LimitedItemType.BlacksmithItem,
    },
    "Foreman Beaver": {
      name: "Foreman Beaver",
      description: translate("description.foreman.beaver"),
      section: Section.Beaver,
      type: LimitedItemType.BlacksmithItem,
    },
    "Egg Basket": {
      name: "Egg Basket",
      description: translate("description.egg.basket"),
      type: LimitedItemType.BlacksmithItem,
    },
    "Mysterious Head": {
      name: "Mysterious Head",
      description: translate("description.mysterious.head"),
      section: Section["Mysterious Head"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Tunnel Mole": {
      name: "Tunnel Mole",
      description: translate("description.tunnel.mole"),
      section: Section.Mole,
      type: LimitedItemType.BlacksmithItem,
    },
    "Rocky the Mole": {
      name: "Rocky the Mole",
      description: translate("description.rocky.the.mole"),
      section: Section.Mole,
      type: LimitedItemType.BlacksmithItem,
    },
    Nugget: {
      name: "Nugget",
      description: translate("description.nugget"),
      section: Section.Mole,
      type: LimitedItemType.BlacksmithItem,
    },
    "Rock Golem": {
      name: "Rock Golem",
      description: translate("description.rock.golem"),
      section: Section["Rock Golem"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Chef Apron": {
      name: "Chef Apron",
      description: translate("description.chef.apron"),
      type: LimitedItemType.BlacksmithItem,
    },
  };

export const MARKET_ITEMS: Record<MarketItem, LimitedItem> = {
  Nancy: {
    name: "Nancy",
    description: translate("description.nancy"),
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  Scarecrow: {
    name: "Scarecrow",
    description: translate("description.scarecrow"),
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  Kuebiko: {
    name: "Kuebiko",
    description: translate("description.kuebiko"),
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description: translate("description.golden.cauliflower"),
    type: LimitedItemType.MarketItem,
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description: translate("description.mysterious.parsnip"),
    type: LimitedItemType.MarketItem,
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description: translate("description.carrot.sword"),
    type: LimitedItemType.MarketItem,
  },
};

export const BARN_ITEMS: Record<BarnItem, LimitedItem> = {
  "Chicken Coop": {
    name: "Chicken Coop",
    description: translate("description.chicken.coop"),
    section: Section["Chicken Coop"],
    type: LimitedItemType.BarnItem,
  },
  "Farm Cat": {
    name: "Farm Cat",
    description: translate("description.farm.cat"),
    section: Section["Farm Cat"],
    type: LimitedItemType.BarnItem,
  },
  "Farm Dog": {
    name: "Farm Dog",
    description: translate("description.farm.dog"),
    section: Section["Farm Dog"],
    type: LimitedItemType.BarnItem,
  },
  "Gold Egg": {
    name: "Gold Egg",
    description: translate("description.gold.egg"),
    type: LimitedItemType.BarnItem,
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description: translate("description.easter.bunny"),
    section: Section["Easter Bunny"],
    type: LimitedItemType.BarnItem,
  },
  Rooster: {
    name: "Rooster",
    description: translate("description.rooster"),
    section: Section["Rooster"],
    type: LimitedItemType.BarnItem,
  },
};

export const ANIMALS: Record<Animal, CraftableItem> = {
  Chicken: {
    name: "Chicken",
    description: translate("description.chicken"),
    price: 200,
    ingredients: [],
  },
  Cow: {
    name: "Cow",
    description: translate("description.cow"),
    price: 16000,
    ingredients: [],
    disabled: true,
  },
  Pig: {
    name: "Pig",
    description: translate("description.pig"),
    price: 6400,
    ingredients: [],
    disabled: true,
  },
  Sheep: {
    name: "Sheep",
    description: translate("description.sheep"),
    price: 6400,
    ingredients: [],
    disabled: true,
  },
};

/**
 * getKeys is a ref to Object.keys, but the return is typed literally.
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T,
) => Array<keyof T>;

/**
 * getEntries is a ref to Object.entries, but the return is typed literally.
 */
type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
export const getEntries = Object.entries as <T extends object>(
  obj: T,
) => Entries<T>[];

export type Dimensions = { width: number; height: number };

const flagsDimension = getKeys(FLAGS).reduce(
  (previous, flagName) => ({
    ...previous,
    [flagName]: {
      width: 1,
      height: 1,
    },
  }),
  {} as Record<Flag, Dimensions>,
);

const bedsDimension = getKeys(BED_FARMHAND_COUNT).reduce(
  (previous, bedName) => ({
    ...previous,
    [bedName]: { width: 1, height: 1 },
  }),
  {} as Record<Exclude<BedName, "Double Bed">, Dimensions>,
);

export const COLLECTIBLES_DIMENSIONS: Record<CollectibleName, Dimensions> = {
  // Salesman Items
  "Wicker Man": { width: 1, height: 1 },
  "Golden Bonsai": { width: 1, height: 1 },

  // Pets
  Barkley: { width: 1, height: 1 },
  Meowchi: { width: 1, height: 1 },
  Twizzle: { width: 1, height: 1 },
  Burro: { width: 1, height: 1 },
  Mudhorn: { width: 1, height: 1 },
  Nibbles: { width: 1, height: 1 },
  Waddles: { width: 1, height: 1 },
  Ramsey: { width: 2, height: 2 },
  Biscuit: { width: 1, height: 1 },
  Cloudy: { width: 1, height: 1 },
  Butters: { width: 1, height: 1 },
  Smokey: { width: 1, height: 1 },
  Flicker: { width: 1, height: 1 },
  Pippin: { width: 1, height: 1 },
  Pinto: { width: 1, height: 1 },
  Roan: { width: 1, height: 1 },
  Stallion: { width: 1, height: 1 },
  Bison: { width: 1, height: 1 },
  Oxen: { width: 1, height: 1 },
  Peanuts: { width: 1, height: 1 },
  Pip: { width: 1, height: 1 },
  Skipper: { width: 1, height: 1 },

  // Flags
  ...flagsDimension,
  ...bedsDimension,

  ...DECORATION_DIMENSIONS,

  // Blacksmith Items
  "Sunflower Statue": { width: 3, height: 4 },
  "Potato Statue": { width: 2, height: 2 },
  "Christmas Tree": { width: 2, height: 2 },
  Gnome: { width: 1, height: 1 },
  "Sunflower Tombstone": { width: 2, height: 2 },
  "Sunflower Rock": { width: 5, height: 4 },
  "Goblin Crown": { width: 1, height: 1 },
  Fountain: { width: 2, height: 2 },
  "Woody the Beaver": { width: 1, height: 1 },
  "Apprentice Beaver": { width: 1, height: 1 },
  "Foreman Beaver": { width: 1, height: 1 },
  "Nyon Statue": { width: 2, height: 2 },
  "Homeless Tent": { width: 2, height: 2 },
  "Farmer Bath": { width: 2, height: 3 },
  "Mysterious Head": { width: 2, height: 2 },
  "Rock Golem": { width: 2, height: 2 },
  "Tunnel Mole": { width: 1, height: 1 },
  "Rocky the Mole": { width: 1, height: 1 },
  Nugget: { width: 1, height: 1 },
  "Immortal Pear": { width: 2, height: 1 },

  // Market Items
  Scarecrow: { width: 2, height: 1 },
  Nancy: { width: 1, height: 1 },
  Kuebiko: { width: 2, height: 1 },
  "Golden Cauliflower": { width: 2, height: 2 },
  "Mysterious Parsnip": { width: 1, height: 1 },
  "Carrot Sword": { width: 1, height: 1 },

  // Barn Items
  "Farm Cat": { width: 1, height: 1 },
  "Farm Dog": { width: 1, height: 1 },
  "Chicken Coop": { width: 2, height: 2 },
  "Gold Egg": { width: 1, height: 1 },
  Rooster: { width: 1, height: 1 },
  "Egg Basket": { width: 1, height: 1 },
  "Fat Chicken": { width: 1, height: 1 },
  "Rich Chicken": { width: 1, height: 1 },
  "Speed Chicken": { width: 1, height: 1 },
  "Ayam Cemani": { width: 1, height: 1 },
  "El Pollo Veloz": { width: 1, height: 1 },
  "Banana Chicken": { width: 1, height: 2 },
  "Crim Peckster": { width: 1, height: 1 },
  "Knight Chicken": { width: 1, height: 1 },
  "Pharaoh Chicken": { width: 1, height: 1 },
  // War Tent Items
  "War Skull": { width: 1, height: 1 },
  "War Tombstone": { width: 1, height: 1 },
  "Undead Rooster": { width: 1, height: 1 },

  Observatory: { width: 2, height: 2 },
  "Victoria Sisters": { width: 2, height: 2 },
  "Basic Bear": { width: 1, height: 1 },
  "Peeled Potato": { width: 1, height: 1 },
  "Wood Nymph Wendy": { width: 1, height: 1 },
  "Cabbage Boy": { width: 1, height: 1 },
  "Cabbage Girl": { width: 1, height: 1 },

  "Magic Bean": { width: 2, height: 2 },

  "Stellar Sunflower": { width: 1, height: 1 },
  "Potent Potato": { width: 1, height: 1 },
  "Radical Radish": { width: 1, height: 1 },

  "Christmas Bear": { width: 1, height: 1 },
  "Christmas Snow Globe": { width: 2, height: 2 },
  "Lady Bug": { width: 1, height: 1 },
  "Squirrel Monkey": { width: 2, height: 2 },
  "Black Bearry": { width: 1, height: 1 },
  "Iron Idol": { height: 1, width: 2 },
  "Parasaur Skull": { height: 1, width: 2 },
  "Golden Bear Head": { height: 1, width: 2 },

  "Maneki Neko": { width: 1, height: 1 },
  "Collectible Bear": { width: 2, height: 2 },
  "Cyborg Bear": { width: 1, height: 1 },
  "Beta Bear": { width: 1, height: 1 },

  //Easter Event Items
  "Easter Bunny": { width: 2, height: 1 },
  "Pablo The Bunny": { width: 1, height: 1 },
  "Easter Bear": { width: 1, height: 1 },
  "Giant Carrot": { width: 2, height: 2 },
  "Easter Bush": { width: 2, height: 1 },

  // Treasure Island SFTs
  "Tiki Totem": { height: 1, width: 1 },
  "Lunar Calendar": { height: 1, width: 1 },
  "Heart of Davy Jones": { height: 2, width: 2 },
  "Treasure Map": { height: 1, width: 2 },
  "Heart Balloons": { height: 1, width: 1 },
  Flamingo: { height: 2, width: 2 },
  "Blossom Tree": { height: 2, width: 2 },

  // Solar Flare SFTs
  "Palm Tree": { height: 2, width: 2 },
  "Beach Ball": { height: 1, width: 1 },
  Karkinos: { height: 2, width: 2 },

  // Banners
  "Witches' Eve Banner": { width: 1, height: 2 },
  "Dawn Breaker Banner": { width: 1, height: 2 },
  "Solar Flare Banner": { width: 1, height: 2 },
  "Bull Run Banner": { width: 1, height: 2 },
  "Human War Banner": { width: 1, height: 2 },
  "Goblin War Banner": { width: 1, height: 2 },
  "Catch the Kraken Banner": { width: 1, height: 2 },
  "Spring Blossom Banner": { width: 1, height: 2 },
  "Sunflorian Faction Banner": { height: 2, width: 1 },
  "Bumpkin Faction Banner": { height: 2, width: 1 },
  "Goblin Faction Banner": { height: 2, width: 1 },
  "Nightshade Faction Banner": { height: 2, width: 1 },
  "Clash of Factions Banner": { width: 1, height: 2 },
  "Pharaoh's Treasure Banner": { width: 1, height: 2 },
  "Lifetime Farmer Banner": { width: 1, height: 2 },
  "Better Together Banner": { width: 1, height: 2 },
  "Paw Prints Banner": { width: 1, height: 2 },
  "Crabs and Traps Banner": { width: 1, height: 2 },

  // Dawn Breaker SFTs
  "Mushroom House": { height: 3, width: 2 },
  "Luminous Lantern": { height: 2, width: 1 },
  "Aurora Lantern": { height: 2, width: 1 },
  "Radiance Lantern": { height: 2, width: 1 },
  "Ocean Lantern": { height: 2, width: 1 },
  "Solar Lantern": { height: 2, width: 1 },
  "Goblin Lantern": { height: 2, width: 1 },
  "Bumpkin Lantern": { height: 2, width: 1 },
  "Betty Lantern": { height: 2, width: 1 },

  "Purple Trail": { width: 1, height: 1 },
  Obie: { width: 1, height: 1 },
  Maximus: { width: 2, height: 2 },
  Hoot: { width: 1, height: 1 },
  "Freya Fox": { width: 1, height: 1 },
  Poppy: { width: 1, height: 1 },
  "Grain Grinder": { width: 2, height: 1 },
  Kernaldo: { width: 1, height: 1 },

  // AoE items
  "Emerald Turtle": { height: 1, width: 1 },
  "Tin Turtle": { height: 1, width: 1 },
  "Basic Scarecrow": { width: 1, height: 1 },
  Bale: { width: 2, height: 2 },
  "Sir Goldensnout": { width: 2, height: 2 },
  "Scary Mike": { width: 1, height: 1 },
  "Laurie the Chuckle Crow": { width: 1, height: 1 },
  "Queen Cornelia": { width: 1, height: 2 },

  // Potion House Items
  "Lab Grown Carrot": { width: 1, height: 1 },
  "Lab Grown Radish": { width: 1, height: 1 },
  "Lab Grown Pumpkin": { width: 1, height: 1 },

  "White Crow": { width: 1, height: 1 },

  // Marine Marvel Trophies
  "Twilight Anglerfish": { width: 2, height: 1 },
  "Starlight Tuna": { width: 2, height: 1 },
  "Radiant Ray": { width: 2, height: 1 },
  "Phantom Barracuda": { width: 2, height: 1 },
  "Gilded Swordfish": { width: 2, height: 1 },
  "Super Star": { width: 2, height: 1 },
  "Giant Isopod": { width: 2, height: 1 },
  Nautilus: { width: 2, height: 1 },
  Dollocaris: { width: 2, height: 1 },
  "Crimson Carp": { width: 2, height: 1 },
  "Battle Fish": { width: 2, height: 1 },
  "Lemon Shark": { width: 2, height: 1 },
  "Longhorn Cowfish": { width: 2, height: 1 },
  Poseidon: { width: 2, height: 1 },
  "Kraken Tentacle": { width: 1, height: 1 },

  // Catch the Kraken SFTs
  Walrus: { width: 2, height: 2 },
  Alba: { width: 1, height: 1 },
  "Knowledge Crab": { width: 1, height: 1 },
  Anchor: { width: 2, height: 2 },
  "Rubber Ducky": { width: 1, height: 1 },
  "Kraken Head": { width: 1, height: 1 },
  "Skill Shrimpy": { width: 1, height: 1 },
  Nana: { width: 1, height: 1 },
  "Soil Krabby": { width: 1, height: 1 },
  "Speckled Kissing Fish": { width: 2, height: 1 },
  "Dark Eyed Kissing Fish": { width: 2, height: 1 },
  "Fisherman's Boat": { width: 2, height: 1 },
  "Sea Arch": { width: 3, height: 2 },
  "Crabs and Fish Rug": { width: 3, height: 2 },
  "Fish Flags": { width: 2, height: 1 },
  "Fish Drying Rack": { width: 2, height: 1 },
  "Yellow Submarine Trophy": { width: 2, height: 2 },
  Oaken: { width: 1, height: 1 },
  Meerkat: { width: 1, height: 1 },
  "Pearl Bed": { width: 2, height: 1 },
  "Crimstone Clam": { width: 2, height: 2 },
  "Poseidon's Throne": { width: 3, height: 3 },
  "Fish Kite": { width: 1, height: 1 },

  // Spring Blossom SFTs
  "Flower Cart": { width: 2, height: 2 },
  "Blossom Royale": { width: 2, height: 2 },
  "Sunrise Bloom Rug": { width: 3, height: 2 },
  "Humming Bird": { width: 1, height: 1 },
  "Queen Bee": { width: 1, height: 1 },
  "Hungry Caterpillar": { width: 1, height: 1 },
  "Flower Fox": { width: 1, height: 1 },
  "Enchanted Rose": { width: 1, height: 2 },
  Capybara: { width: 1, height: 1 },
  Rainbow: { width: 2, height: 1 },
  "Flower Rug": { width: 3, height: 3 },
  "Tea Rug": { width: 3, height: 3 },
  "Green Field Rug": { width: 3, height: 3 },

  // Flowers
  "Prism Petal": { width: 1, height: 1 },
  "Celestial Frostbloom": { width: 1, height: 1 },
  "Primula Enigma": { width: 1, height: 1 },

  // Clash of Factions
  "Turbo Sprout": { width: 2, height: 2 },
  Soybliss: { width: 1, height: 2 },
  "Grape Granny": { width: 1, height: 1 },
  "Royal Throne": { width: 2, height: 2 },
  "Lily Egg": { width: 1, height: 2 },
  Goblet: { width: 1, height: 1 },
  Vinny: { width: 1, height: 1 },
  Clock: { width: 1, height: 1 },
  "Fancy Rug": { width: 3, height: 2 },
  "Bullseye Board": { width: 2, height: 2 },
  "Chess Rug": { width: 4, height: 4 },
  "Twister Rug": { width: 3, height: 2 },
  Cluckapult: { width: 2, height: 2 },
  "Trainee Target": { width: 1, height: 1 },
  "Golden Garrison": { width: 1, height: 1 },
  "Novice Knight": { width: 1, height: 1 },
  "Regular Pawn": { width: 1, height: 1 },
  "Silver Squire": { width: 1, height: 1 },
  "Rice Panda": { width: 1, height: 2 },
  // Faction Shop
  "Sunflorian Throne": { width: 1, height: 2 },
  "Nightshade Throne": { width: 1, height: 2 },
  "Goblin Throne": { width: 1, height: 2 },
  "Bumpkin Throne": { width: 1, height: 2 },
  "Golden Sunflorian Egg": { width: 1, height: 1 },
  "Goblin Mischief Egg": { width: 1, height: 1 },
  "Bumpkin Charm Egg": { width: 1, height: 1 },
  "Nightshade Veil Egg": { width: 1, height: 1 },
  "Emerald Goblin Goblet": { width: 1, height: 1 },
  "Opal Sunflorian Goblet": { width: 1, height: 1 },
  "Sapphire Bumpkin Goblet": { width: 1, height: 1 },
  "Amethyst Nightshade Goblet": { width: 1, height: 1 },
  "Golden Faction Goblet": { width: 1, height: 1 },
  "Ruby Faction Goblet": { width: 1, height: 1 },
  "Sunflorian Bunting": { width: 2, height: 1 },
  "Nightshade Bunting": { width: 2, height: 1 },
  "Goblin Bunting": { width: 2, height: 1 },
  "Bumpkin Bunting": { width: 2, height: 1 },
  "Sunflorian Candles": { width: 1, height: 1 },
  "Nightshade Candles": { width: 1, height: 1 },
  "Goblin Candles": { width: 1, height: 1 },
  "Bumpkin Candles": { width: 1, height: 1 },
  "Sunflorian Left Wall Sconce": { width: 1, height: 1 },
  "Nightshade Left Wall Sconce": { width: 1, height: 1 },
  "Goblin Left Wall Sconce": { width: 1, height: 1 },
  "Bumpkin Left Wall Sconce": { width: 1, height: 1 },
  "Sunflorian Right Wall Sconce": { width: 1, height: 1 },
  "Nightshade Right Wall Sconce": { width: 1, height: 1 },
  "Goblin Right Wall Sconce": { width: 1, height: 1 },
  "Bumpkin Right Wall Sconce": { width: 1, height: 1 },
  "Gourmet Hourglass": { width: 1, height: 1 },
  "Harvest Hourglass": { width: 1, height: 1 },
  "Timber Hourglass": { width: 1, height: 1 },
  "Ore Hourglass": { width: 1, height: 1 },
  "Orchard Hourglass": { width: 1, height: 1 },
  "Blossom Hourglass": { width: 1, height: 1 },
  "Fisher's Hourglass": { width: 1, height: 1 },
  "Sunflorian Faction Rug": { width: 3, height: 2 },
  "Nightshade Faction Rug": { width: 3, height: 2 },
  "Goblin Faction Rug": { width: 3, height: 2 },
  "Bumpkin Faction Rug": { width: 3, height: 2 },
  "Desert Rose": { width: 1, height: 1 },
  Chicory: { width: 1, height: 1 },
  Chamomile: { width: 1, height: 1 },
  "Hapy Jar": { width: 1, height: 2 },
  "Duamutef Jar": { width: 1, height: 2 },
  "Qebehsenuef Jar": { width: 1, height: 2 },
  "Imsety Jar": { width: 1, height: 2 },
  "Adrift Ark": { width: 2, height: 2 },
  Castellan: { width: 2, height: 2 },
  "Sunlit Citadel": { width: 2, height: 2 },
  "Pharaoh Gnome": { width: 1, height: 1 },

  // To update dimensions
  Sarcophagus: { width: 1, height: 2 },
  Cannonball: { width: 1, height: 1 },
  "Clay Tablet": { width: 2, height: 1 },
  "Snake in Jar": { width: 1, height: 1 },
  "Reveling Lemon": { width: 2, height: 2 },
  "Anubis Jackal": { width: 2, height: 2 },
  Sundial: { width: 2, height: 2 },
  "Sand Golem": { width: 2, height: 1 },
  "Cactus King": { width: 1, height: 2 },
  "Lemon Frog": { width: 1, height: 1 },
  "Scarab Beetle": { width: 2, height: 1 },
  "Lemon Tea Bath": { width: 3, height: 2 },
  "Tomato Clown": { width: 1, height: 1 },
  Pyramid: { width: 2, height: 2 },
  Oasis: { width: 3, height: 4 },
  "Baobab Tree": { width: 3, height: 3 },
  Camel: { width: 2, height: 1 },
  "Tomato Bombard": { width: 2, height: 2 },
  "Stone Beetle": { width: 1, height: 2 },
  "Iron Beetle": { width: 1, height: 2 },
  "Gold Beetle": { width: 1, height: 2 },
  "Fairy Circle": { width: 2, height: 2 },
  Squirrel: { width: 2, height: 1 },
  Macaw: { width: 1, height: 1 },
  Butterfly: { width: 1, height: 1 },

  "Fox Shrine": { width: 1, height: 1 },
  "Boar Shrine": { width: 1, height: 1 },
  "Hound Shrine": { width: 1, height: 1 },
  "Stag Shrine": { width: 1, height: 1 },
  "Legendary Shrine": { width: 2, height: 2 },
  "Obsidian Shrine": { width: 1, height: 1 },
  "Mole Shrine": { width: 1, height: 1 },
  "Bear Shrine": { width: 1, height: 1 },
  "Tortoise Shrine": { width: 1, height: 1 },
  "Moth Shrine": { width: 1, height: 1 },
  "Sparrow Shrine": { width: 1, height: 1 },
  "Toucan Shrine": { width: 1, height: 1 },
  "Collie Shrine": { width: 1, height: 1 },
  "Badger Shrine": { width: 1, height: 1 },
  "Bantam Shrine": { width: 1, height: 1 },
  "Trading Shrine": { width: 1, height: 1 },

  // Animal Season
  "Cow Scratcher": { width: 1, height: 2 },
  "Spinning Wheel": { width: 2, height: 2 },
  "Sleepy Rug": { width: 3, height: 2 },
  Meteorite: { width: 2, height: 2 },
  "Sheaf of Plenty": { width: 1, height: 2 },
  "Mechanical Bull": { width: 2, height: 2 },
  "Crop Circle": { width: 2, height: 2 },
  "Moo-ver": { width: 2, height: 2 },
  "Swiss Whiskers": { width: 1, height: 1 },
  Cluckulator: { width: 1, height: 2 },
  UFO: { width: 2, height: 2 },
  Wagon: { width: 2, height: 2 },
  "Black Sheep": { width: 2, height: 1 },
  "Alien Chicken": { width: 1, height: 1 },
  "Toxic Tuft": { width: 2, height: 1 },
  Mootant: { width: 2, height: 1 },
  "Halloween Scarecrow": { width: 1, height: 1 },
  "Vampire Bear": { width: 1, height: 1 },
  "Super Totem": { width: 1, height: 1 },
  "Christmas Stocking": { width: 1, height: 1 },
  "Golden Christmas Stocking": { width: 1, height: 1 },
  "Cozy Fireplace": { width: 2, height: 1 },
  "Christmas Rug": { width: 3, height: 2 },
  "Christmas Candle": { width: 1, height: 1 },
  "Santa Penguin": { width: 1, height: 1 },
  "Penguin Pool": { width: 2, height: 2 },
  Snowman: { width: 1, height: 1 },
  "Festive Toy Train": { width: 2, height: 2 },
  "Golden Cow": { width: 2, height: 2 },
  Kite: { width: 2, height: 1 },
  "Acorn House": { width: 2, height: 2 },
  "Spring Duckling": { width: 1, height: 1 },
  Igloo: { width: 2, height: 2 },
  "Ugly Duckling": { width: 1, height: 1 },
  "Lake Rug": { width: 3, height: 3 },
  Hammock: { width: 3, height: 1 },
  Mammoth: { width: 3, height: 2 },
  "Cup of Chocolate": { width: 2, height: 2 },
  "Golden Sheep": { width: 2, height: 2 },
  "Barn Blueprint": { width: 2, height: 1 },
  "Mama Duck": { width: 1, height: 1 },
  "Summer Duckling": { width: 1, height: 1 },
  "Autumn Duckling": { width: 1, height: 1 },
  "Winter Duckling": { width: 1, height: 1 },
  "Winds of Change Banner": { width: 1, height: 2 },
  "Great Bloom Banner": { width: 1, height: 2 },
  "Frozen Cow": { width: 2, height: 1 },
  "Frozen Sheep": { width: 2, height: 1 },
  "Summer Chicken": { width: 1, height: 1 },
  Jellyfish: { width: 2, height: 2 },
  Quarry: { width: 2, height: 2 },
  "Obsidian Turtle": { width: 1, height: 1 },
  "Winter Guardian": { width: 2, height: 2 },
  "Summer Guardian": { width: 2, height: 2 },
  "Spring Guardian": { width: 2, height: 2 },
  "Autumn Guardian": { width: 2, height: 2 },
  "Sky Pillar": { width: 2, height: 2 },
  "Flower-Scribed Statue": { width: 2, height: 1 },
  "Balloon Rug": { width: 2, height: 2 },
  "Giant Yam": { width: 1, height: 2 },
  "Heart Air Balloon": { width: 3, height: 5 },
  "Giant Zucchini": { width: 1, height: 2 },
  "Mini Floating Island": { width: 2, height: 1 },
  "Love Chicken": { width: 1, height: 2 },
  "Dr Cow": { width: 2, height: 1 },
  "Nurse Sheep": { width: 2, height: 1 },
  Lunalist: { width: 1, height: 1 },
  "Pink Dolphin": { width: 2, height: 2 },
  "Giant Kale": { width: 2, height: 2 },

  "Big Apple": { width: 2, height: 2 },
  "Big Orange": { width: 2, height: 2 },
  "Big Banana": { width: 2, height: 2 },
  "Farmer's Monument": { width: 3, height: 3 },
  "Miner's Monument": { width: 3, height: 3 },
  "Woodcutter's Monument": { width: 3, height: 3 },
  "Teamwork Monument": { width: 3, height: 3 },
  "Basic Cooking Pot": { width: 2, height: 2 },
  "Expert Cooking Pot": { width: 2, height: 2 },
  "Advanced Cooking Pot": { width: 2, height: 2 },

  "Floor Mirror": { width: 1, height: 1 },
  "Long Rug": { width: 4, height: 2 },
  "Garbage Bin": { width: 1, height: 1 },
  Wheelbarrow: { width: 2, height: 1 },
  "Snail King": { width: 1, height: 1 },
  "Reelmaster's Chair": { width: 1, height: 1 },
  "Rat King": { width: 1, height: 1 },
  "Fruit Tune Box": { width: 1, height: 1 },
  "Double Bed": { width: 2, height: 1 },
  "Giant Artichoke": { width: 2, height: 2 },
  "Rocket Statue": { width: 1, height: 1 },
  "Ant Queen": { width: 1, height: 1 },
  "Jurassic Droplet": { width: 2, height: 1 },
  "Giant Onion": { width: 1, height: 2 },
  "Giant Turnip": { width: 2, height: 2 },
  "Groovy Gramophone": { width: 1, height: 1 },
  "Paw Prints Rug": { width: 3, height: 3 },
  "Pet Bowls": { width: 2, height: 1 },
  "Pet Bed": { width: 2, height: 1 },
  "Giant Acorn": { width: 2, height: 1 },
  "Moon Fox Statue": { width: 2, height: 3 },
  "Baby Cow": { width: 1, height: 1 },
  "Baby Sheep": { width: 1, height: 1 },
  "Janitor Chicken": { width: 1, height: 1 },
  "Venus Bumpkin Trap": { width: 1, height: 1 },
  "Black Hole Flower": { width: 1, height: 1 },
  "Sleepy Chicken": { width: 1, height: 2 },
  "Astronaut Cow": { width: 1, height: 1 },
  "Astronaut Sheep": { width: 1, height: 1 },
  "Mermaid Cow": { width: 2, height: 1 },
  "Mermaid Sheep": { width: 1, height: 1 },
  "Squid Chicken": { width: 1, height: 2 },
  "Anemone Flower": { width: 1, height: 1 },
  "Petnip Plant": { width: 2, height: 1 },
  "Pet Kennel": { width: 2, height: 2 },
  "Pet Toys": { width: 1, height: 1 },
  "Pet Playground": { width: 2, height: 2 },
  "Fish Bowl": { width: 2, height: 1 },
  "Giant Gold Bone": { width: 2, height: 1 },
  "Lunar Temple": { width: 3, height: 3 },
  "Magma Stone": { width: 1, height: 2 },
  Cornucopia: { width: 3, height: 2 },
  "Messy Bed": { width: 1, height: 1 },
};

export const ANIMAL_DIMENSIONS: Record<"Chicken", Dimensions> = {
  Chicken: { width: 1, height: 1 },
};
