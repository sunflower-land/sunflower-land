import { Dimensions } from "./craftables";
import { translate } from "lib/i18n/translate";
import { AnimalResource } from "./game";
import { GameState } from "features/game/types/game";
import { ResourceItem } from "../expansion/placeable/lib/collisionDetection";
import { Tool } from "./tools";
import { Decimal } from "decimal.js-light";

export type CommodityName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Crimstone"
  | "Diamond"
  | "Egg"
  | "Honey"
  | "Chicken"
  | "Wild Mushroom"
  | "Magic Mushroom"
  | "Sunstone"
  | "Oil"
  | "Obsidian";

export type MushroomName = Extract<
  CommodityName,
  "Wild Mushroom" | "Magic Mushroom"
>;

export type Commodity = {
  description: string;
};

export const COMMODITIES: Record<CommodityName, Commodity> = {
  Wood: {
    description: translate("use.craft"),
  },
  Stone: {
    description: translate("use.craft"),
  },
  Iron: {
    description: translate("use.craft"),
  },
  Gold: {
    description: translate("use.craft"),
  },
  Crimstone: {
    description: translate("use.craft"),
  },
  Diamond: {
    description: translate("use.craft"),
  },
  Egg: {
    description: translate("use.craft"),
  },
  Chicken: {
    description: translate("chicken.description"),
  },
  Honey: {
    description: translate("honey.description"),
  },
  "Wild Mushroom": {
    description: translate("wildMushroom.description"),
  },
  "Magic Mushroom": {
    description: translate("magicMushroom.description"),
  },
  Sunstone: {
    description: translate("use.craft"),
  },
  Oil: {
    description: translate("use.craft"),
  },
  Obsidian: {
    description: translate("use.craft"),
  },
};

export const ANIMAL_RESOURCES: Record<AnimalResource, Commodity> = {
  Egg: {
    description: "",
  },
  Leather: {
    description: "",
  },
  Wool: {
    description: "",
  },
  "Merino Wool": {
    description: "",
  },
  Feather: {
    description: "",
  },
  Milk: {
    description: "",
  },
};

export type ResourceName =
  | BasicResourceName
  | UpgradedResourceName
  | "Crimstone Rock"
  | "Crop Plot"
  | "Fruit Patch"
  | "Boulder"
  | "Beehive"
  | "Sunstone Rock"
  | "Flower Bed"
  | "Oil Reserve"
  | "Lava Pit";

export type BasicResourceName =
  | "Stone Rock"
  | "Iron Rock"
  | "Gold Rock"
  | "Tree";

export type UpgradedResourceName =
  | "Fused Stone Rock"
  | "Reinforced Stone Rock"
  | "Ancient Tree"
  | "Sacred Tree"
  | "Refined Iron Rock"
  | "Tempered Iron Rock"
  | "Pure Gold Rock"
  | "Prime Gold Rock";

export type UpgradeableResource = BasicResourceName | UpgradedResourceName;

export type ResourceTier = 1 | 2 | 3;

export type StoneRockName =
  | "Stone Rock"
  | "Fused Stone Rock"
  | "Reinforced Stone Rock";
export type TreeName = "Tree" | "Ancient Tree" | "Sacred Tree";
export type GoldRockName = "Gold Rock" | "Pure Gold Rock" | "Prime Gold Rock";
export type IronRockName =
  | "Iron Rock"
  | "Refined Iron Rock"
  | "Tempered Iron Rock";

export type RockName =
  | StoneRockName
  | GoldRockName
  | IronRockName
  | "Sunstone Rock"
  | "Crimstone Rock";

type ResourceUpgradeRequirements = Tool & {
  tier: ResourceTier;
  preRequires: {
    tier: ResourceTier;
    count: number;
  };
};

export const RESOURCES: Record<ResourceName, string> = {
  "Crop Plot": "Plant crops",
  "Fruit Patch": "Plant fruit",
  "Gold Rock": "Mine gold",
  "Pure Gold Rock": "Mine gold",
  "Prime Gold Rock": "Mine gold",
  "Iron Rock": "Mine iron",
  "Refined Iron Rock": "Mine iron",
  "Tempered Iron Rock": "Mine iron",
  "Stone Rock": "Mine stone",
  "Fused Stone Rock": "Mine fused stone",
  "Reinforced Stone Rock": "Mine reinforced stone",
  "Crimstone Rock": "Mine crimstone",
  Boulder: "Mine rare minerals",
  Tree: "Chop Wood",
  "Ancient Tree": "Chop Wood",
  "Sacred Tree": "Chop Wood",
  Beehive: "Collect honey",
  "Flower Bed": "Plant flowers",
  "Sunstone Rock": "Mine sunstone",
  "Oil Reserve": "Drill oil",
  "Lava Pit": "Craft obsidian",
};

export const ADVANCED_RESOURCES: Record<
  UpgradedResourceName,
  ResourceUpgradeRequirements
> = {
  "Fused Stone Rock": {
    name: "Fused Stone",
    description: "Mine fused stone",
    tier: 2,
    ingredients: {
      "Stone Rock": new Decimal(4),
      Obsidian: new Decimal(5),
    },
    price: 50_000,
    // 4 stone rocks
    preRequires: {
      tier: 1,
      count: 4,
    },
  },
  "Reinforced Stone Rock": {
    name: "Reinforced Stone",
    description: "Mine reinforced stone",
    tier: 3,
    ingredients: {
      "Fused Stone Rock": new Decimal(4),
      Obsidian: new Decimal(10),
    },
    price: 100_000,
    // 4 fused stone rocks
    preRequires: {
      tier: 2,
      count: 4,
    },
  },
  "Ancient Tree": {
    name: "Ancient Tree",
    description: "Chop Wood",
    tier: 2,
    ingredients: {
      Obsidian: new Decimal(3),
      Tree: new Decimal(4),
    },
    price: 25_000,
    preRequires: {
      tier: 1,
      count: 4,
    },
  },
  "Sacred Tree": {
    name: "Sacred Tree",
    description: "Chop Wood",
    tier: 3,
    ingredients: {
      Obsidian: new Decimal(5),
      "Ancient Tree": new Decimal(4),
    },
    price: 50_000,
    preRequires: {
      tier: 2,
      count: 4,
    },
  },
  "Refined Iron Rock": {
    name: "Refined Iron",
    description: "Mine iron",
    tier: 2,
    ingredients: {
      "Iron Rock": new Decimal(4),
      Obsidian: new Decimal(10),
    },
    price: 100_000,
    preRequires: {
      tier: 1,
      count: 4,
    },
  },
  "Tempered Iron Rock": {
    name: "Tempered Iron",
    description: "Mine iron",
    tier: 3,
    ingredients: {
      "Refined Iron Rock": new Decimal(4),
      Obsidian: new Decimal(15),
    },
    price: 200_000,
    preRequires: {
      tier: 2,
      count: 4,
    },
  },
  "Pure Gold Rock": {
    name: "Pure Gold",
    description: "Mine gold",
    tier: 2,
    ingredients: {
      "Gold Rock": new Decimal(4),
      Obsidian: new Decimal(15),
    },
    price: 200_000,
    preRequires: {
      tier: 1,
      count: 4,
    },
  },
  "Prime Gold Rock": {
    name: "Prime Gold",
    description: "Mine gold",
    tier: 3,
    ingredients: {
      "Pure Gold Rock": new Decimal(4),
      Obsidian: new Decimal(20),
    },
    price: 350_000,
    preRequires: {
      tier: 2,
      count: 4,
    },
  },
};

export const RESOURCE_STATE_ACCESSORS: Record<
  Exclude<ResourceName, "Boulder">,
  (game: GameState) => Record<string, ResourceItem>
> = {
  "Crop Plot": (game) => game.crops,
  Tree: (game) => game.trees,
  "Stone Rock": (game) => game.stones,
  "Iron Rock": (game) => game.iron,
  "Gold Rock": (game) => game.gold,
  "Crimstone Rock": (game) => game.crimstones,
  Beehive: (game) => game.beehives,
  "Fruit Patch": (game) => game.fruitPatches,
  "Flower Bed": (game) => game.flowers.flowerBeds,
  "Sunstone Rock": (game) => game.sunstones,
  "Oil Reserve": (game) => game.oilReserves,
  "Lava Pit": (game) => game.lavaPits,
  "Fused Stone Rock": (game) => game.stones,
  "Reinforced Stone Rock": (game) => game.stones,
  "Ancient Tree": (game) => game.trees,
  "Sacred Tree": (game) => game.trees,
  "Refined Iron Rock": (game) => game.iron,
  "Tempered Iron Rock": (game) => game.iron,
  "Pure Gold Rock": (game) => game.gold,
  "Prime Gold Rock": (game) => game.gold,
};

// IMPORTANT: Order matters in the UpgradesTo array.
export const BASIC_RESOURCES_UPGRADES_TO: Partial<
  Record<BasicResourceName, UpgradedResourceName[]>
> = {
  "Stone Rock": ["Fused Stone Rock", "Reinforced Stone Rock"],
  // "Iron Rock": ["Tempered Iron Rock", "Pure Iron Rock"],
  // "Gold Rock": ["Pure Gold Rock", "Enchanted Gold Rock"],
  Tree: ["Ancient Tree", "Sacred Tree"],
};

export const RESOURCE_MULTIPLIER: Record<UpgradeableResource, number> = {
  "Stone Rock": 1,
  "Fused Stone Rock": 4,
  "Reinforced Stone Rock": 16,
  Tree: 1,
  "Ancient Tree": 4,
  "Sacred Tree": 16,
  "Iron Rock": 1,
  "Refined Iron Rock": 4,
  "Tempered Iron Rock": 16,
  "Gold Rock": 1,
  "Pure Gold Rock": 4,
  "Prime Gold Rock": 16,
};

export const RESOURCE_DIMENSIONS: Record<ResourceName, Dimensions> = {
  "Crop Plot": {
    width: 1,
    height: 1,
  },
  "Gold Rock": {
    width: 1,
    height: 1,
  },
  "Iron Rock": {
    width: 1,
    height: 1,
  },
  "Stone Rock": {
    width: 1,
    height: 1,
  },
  "Crimstone Rock": {
    width: 2,
    height: 2,
  },
  Tree: {
    width: 2,
    height: 2,
  },
  "Fruit Patch": {
    width: 2,
    height: 2,
  },
  Boulder: {
    width: 2,
    height: 2,
  },
  Beehive: {
    width: 1,
    height: 1,
  },
  "Flower Bed": {
    width: 3,
    height: 1,
  },
  "Sunstone Rock": {
    width: 2,
    height: 2,
  },
  "Oil Reserve": {
    width: 2,
    height: 2,
  },
  "Lava Pit": {
    width: 2,
    height: 2,
  },
  "Fused Stone Rock": {
    width: 1,
    height: 1,
  },
  "Reinforced Stone Rock": {
    width: 1,
    height: 1,
  },
  "Ancient Tree": {
    width: 2,
    height: 2,
  },
  "Sacred Tree": {
    width: 2,
    height: 2,
  },
  "Refined Iron Rock": {
    width: 1,
    height: 1,
  },
  "Tempered Iron Rock": {
    width: 1,
    height: 1,
  },
  "Pure Gold Rock": {
    width: 1,
    height: 1,
  },
  "Prime Gold Rock": {
    width: 1,
    height: 1,
  },
};

export const MUSHROOM_DIMENSIONS = {
  width: 1,
  height: 1,
};
