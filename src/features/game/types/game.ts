import { Decimal } from "decimal.js-light";
import { GameEvent } from "../events";

import { CropName, SeedName } from "./crops";
import { CraftableName } from "./craftables";
import { ResourceName } from "./resources";

export type FieldItem = {
  name: CropName;
  // Epoch time in milliseconds
  plantedAt: number;
};

export type InventoryItemName =
  | CropName
  | SeedName
  | CraftableName
  | ResourceName;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

type PastAction = GameEvent & {
  createdAt: Date;
};

export type GameState = {
  balance: Decimal;
  fields: Record<number, FieldItem>;
  inventory: Inventory;
  stock: Inventory;

  // Session values
  id: number;
  address?: string;
};

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
