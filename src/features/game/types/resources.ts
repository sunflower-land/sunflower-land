import { Dimensions } from "./craftables";

export type CommodityName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Ruby"
  | "Diamond"
  | "Egg"
  | "Honey"
  | "Chicken"
  | "Wild Mushroom"
  | "Magic Mushroom";

export type MushroomName = Extract<
  CommodityName,
  "Wild Mushroom" | "Magic Mushroom"
>;

export type Commodity = {
  description: string;
};

export const COMMODITIES: Record<CommodityName, Commodity> = {
  Wood: {
    description: "Used to craft items",
  },
  Stone: {
    description: "Used to craft items",
  },
  Iron: {
    description: "Used to craft items",
  },
  Gold: {
    description: "Used to craft items",
  },
  Ruby: {
    description: "Used to craft items",
  },
  Diamond: {
    description: "Used to craft items",
  },
  Egg: {
    description: "Used to craft items",
  },
  Chicken: {
    description: "Used to lay eggs",
  },
  Honey: {
    description: "Used to sweeten your cooking",
  },
  "Wild Mushroom": {
    description: "Used to cook basic recipes",
  },
  "Magic Mushroom": {
    description: "Used to cook advanced recipes",
  },
};

export type ResourceName =
  | "Tree"
  | "Stone Rock"
  | "Iron Rock"
  | "Gold Rock"
  | "Ruby Rock"
  | "Crop Plot"
  | "Fruit Patch"
  | "Boulder"
  | "Beehive";

export const RESOURCES: Record<ResourceName, string> = {
  "Crop Plot": "Plant crops",
  "Fruit Patch": "Plant fruit",
  "Gold Rock": "Mine gold",
  "Iron Rock": "Mine iron",
  "Stone Rock": "Mine stone",
  "Ruby Rock": "Mine ruby",
  Boulder: "Mine rare minerals",
  Tree: "Chop Wood",
  Beehive: "Collect honey",
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
  "Ruby Rock": {
    width: 1,
    height: 1,
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
};

export const MUSHROOM_DIMENSIONS = {
  width: 1,
  height: 1,
};
