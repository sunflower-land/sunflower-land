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
  | "Tree"
  | "Stone Rock"
  | "Iron Rock"
  | "Gold Rock"
  | "Crimstone Rock"
  | "Crop Plot"
  | "Fruit Patch"
  | "Boulder"
  | "Beehive"
  | "Sunstone Rock"
  | "Flower Bed"
  | "Oil Reserve"
  | "Lava Pit"
  | UpgradedResourceName;

export type UpgradedResourceName = "Fused Stone Rock" | "Reinforced Stone Rock";

export type ResourceTier = 1 | 2 | 3;

export type RockName = Extract<
  ResourceName,
  "Stone Rock" | "Fused Stone Rock" | "Reinforced Stone Rock"
>;

export const RESOURCES: Record<ResourceName, string> = {
  "Crop Plot": "Plant crops",
  "Fruit Patch": "Plant fruit",
  "Gold Rock": "Mine gold",
  "Iron Rock": "Mine iron",
  "Stone Rock": "Mine stone",
  "Crimstone Rock": "Mine crimstone",
  Boulder: "Mine rare minerals",
  Tree: "Chop Wood",
  Beehive: "Collect honey",
  "Flower Bed": "Plant flowers",
  "Sunstone Rock": "Mine sunstone",
  "Oil Reserve": "Drill oil",
  "Lava Pit": "Craft obsidian",
  "Fused Stone Rock": "Mine fused stone",
  "Reinforced Stone Rock": "Mine reinforced stone",
};

export const ADVANCED_RESOURCES: Record<
  UpgradedResourceName,
  Tool & {
    tier: ResourceTier;
    preRequires: {
      tier: ResourceTier;
      count: number;
    };
  }
> = {
  "Fused Stone Rock": {
    name: "Fused Stone",
    description: "Mine fused stone",
    tier: 2,
    ingredients: {
      "Stone Rock": new Decimal(4),
      Obsidian: new Decimal(1),
    },
    price: 5000,
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
      Obsidian: new Decimal(5),
    },
    price: 10000,
    // 4 fused stone rocks
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
};

export const MUSHROOM_DIMENSIONS = {
  width: 1,
  height: 1,
};
