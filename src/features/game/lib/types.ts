import { CropName, SeedName } from "features/crops/lib/crops";

import { GameEvent } from "../events";
import { CraftableName } from "../events/craft";

import { ResourceName } from "../lib/resources";

export type FieldItem = {
  fieldIndex: number;
  crop?: {
    name: CropName;
    plantedAt: Date;
  };
};

export type InventoryItemName =
  | CropName
  | SeedName
  | CraftableName
  | ResourceName;

export type Inventory = Partial<Record<InventoryItemName, number>>;

type PastAction = GameEvent & {
  createdAt: Date;
};

export type GameState = {
  balance: number;
  fields: {
    fieldIndex: number;
    crop?: {
      name: CropName;
      plantedAt: Date;
    };
  }[];
  inventory: Inventory;
  actions: PastAction[];
};

export interface Context {
  state?: GameState;
  actions: PastAction[];
}

const EMPTY_FIELDS: FieldItem[] = Array(22)
  .fill(null)
  .map((_, fieldIndex) => ({ fieldIndex }));

export const DEFAULT_FARM: GameState = {
  balance: 50,
  fields: EMPTY_FIELDS,
  inventory: {
    "Sunflower Seed": 2,
    Wood: 2,
    Gold: 2,
  },
  actions: [],
};
