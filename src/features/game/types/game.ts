import { Decimal } from "decimal.js-light";
import { GameEvent } from "../events";

import { CropName, FlowerName, FlowerSeedName, SeedName } from "./crops";
import { CraftableName, BeeItem } from "./craftables";
import { ResourceName } from "./resources";
import { SkillName } from "./skills";
import { BeeName } from "./bees";

export type Reward = {
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
  reward?: Reward;
};

export type ExplorationFieldItem = {
  name: BeeName,
  cooldown: number,
  energy:number,
  reward?: Reward,
}

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

 

export type Flower = {
  honey: Decimal;
  // Epoch time in milliseconds
  pollinatedAt: number;
  //coordinate distance from the barn
  distance:number
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
  trees: Record<number, Tree>;
  stones: Record<number, Rock>;
  iron: Record<number, Rock>;
  gold: Record<number, Rock>;
  inventory: Inventory;
  stock: Inventory;
  flowers: Record<number,Flower>
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
