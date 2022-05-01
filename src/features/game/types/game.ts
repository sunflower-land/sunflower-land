import { Decimal } from "decimal.js-light";
import { GameEvent } from "../events";

import { CropName, SeedName } from "./crops";
import { CraftableName, BeeItem } from "./craftables";
import { ResourceName } from "./resources";
import { SkillName } from "./skills";
import { FlowerName, FlowerSeedName } from "./flowers";

export type Reward = {
  items: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type FlowerReward = {
  items: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type FieldItem = {
  name: CropName;
  // Epoch time in milliseconds
  plantedAt: number;
  multiplier?: number;
  reward?: FlowerReward;
};
export type FlowerFieldItem = {
  name: FlowerName;
  // Epoch time in milliseconds
  plantedAt: number;
  multiplier?: number;
  flowerReward?: FlowerReward;
};

export type Tree = {
  wood: Decimal;
  // Epoch time in milliseconds
  choppedAt: number;
};

export type Rock = {
  amount: Decimal;
  // Epoch time in milliseconds
  minedAt: number;
};

export type Flower = {
  amount: Decimal;
  // Epoch time in milliseconds
  pollinatedAt: number;
};

export type EasterEgg =
  | "Red Egg"
  | "Orange Egg"
  | "Green Egg"
  | "Blue Egg"
  | "Pink Egg"
  | "Purple Egg"
  | "Yellow Egg";

export const EASTER_EGGS: EasterEgg[] = [
  "Blue Egg",
  "Green Egg",
  "Orange Egg",
  "Pink Egg",
  "Purple Egg",
  "Red Egg",
  "Yellow Egg",
];

export type FlowerType = {
  honey: Decimal;
  //Epoch time in milliseconds
  pollinatedAt: number;
};

export type FlowerColor = "Blue Flower" | "White Flower";

export type EasterBunny = "Easter Bunny";

export type InventoryItemName =
  | CropName
  | SeedName
  | CraftableName
  | ResourceName
  | SkillName
  | EasterEgg
  | EasterBunny
  | BeeItem
  | FlowerName
  | FlowerSeedName;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

type PastAction = GameEvent & {
  createdAt: Date;
};

export type GameState = {
  id?: number;
  balance: Decimal;
  fields: Record<number, FieldItem>;
  flowerFields: Record<number, FlowerFieldItem>;
  trees: Record<number, Tree>;
  stones: Record<number, Rock>;
  iron: Record<number, Rock>;
  gold: Record<number, Rock>;
  // flowers: Record<number, FlowerType>;
  inventory: Inventory;
  stock: Inventory;

  farmAddress?: string;

  skills: {
    farming: Decimal;
    gathering: Decimal;
  };
};

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
