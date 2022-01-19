/**
 * A wrapper that provides game state and dispatches events
 */
import {
  Craftable,
  CraftableName,
  CRAFTABLES,
} from "features/blacksmith/lib/craftables";
import { CropName, CROPS } from "features/crops/lib/crops";
import { cacheShortcuts, getShortcuts } from "features/hud/lib/shortcuts";
import React from "react";
import { useState } from "react";
import { ResourceName } from "./lib/resources";

export type FieldItem = {
  fieldIndex: number;
  crop?: {
    name: CropName;
    plantedAt: Date;
  };
};

export type InventoryItemName =
  | CropName
  | `${CropName} Seed`
  | CraftableName
  | ResourceName;

export type Inventory = Partial<Record<InventoryItemName, number>>;

type GameState = {
  balance: number;
  fields: {
    fieldIndex: number;
    crop?: {
      name: CropName;
      plantedAt: Date;
    };
  }[];
  level: number;
  inventory: Inventory;
  actions: GameAction[];
};

interface GameContext {
  state: GameState;
  dispatcher: (action: GameAction) => GameState;
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem?: InventoryItemName;
}

export const Context = React.createContext<GameContext>({} as GameContext);

type GameAction =
  | {
      type: "item.craft";
      item: InventoryItemName;
    }
  | {
      type: "seed.buy";
      seed: InventoryItemName;
    }
  | {
      type: "crop.planted";
      item?: InventoryItemName;
      index: number;
    }
  | {
      type: "crop.harvested";
      index: number;
    }
  | {
      type: "crop.sell";
      crop: CropName;
    };

// Seeds which are implemented
const VALID_SEEDS: InventoryItemName[] = [
  "Sunflower Seed",
  "Potato Seed",
  "Beetroot Seed",
  "Cabbage Seed",
  "Carrot Seed",
  "Cauliflower Seed",
  "Pumpkin Seed",
  "Parsnip Seed",
  "Radish Seed",
  "Wheat Seed",
];

function isSeed(crop: InventoryItemName): crop is CropName {
  return VALID_SEEDS.includes(crop);
}

function isCraftable(item: InventoryItemName): item is CraftableName {
  return (item as CraftableName) in CRAFTABLES;
}

function eventReducer(state: GameState, action: GameAction) {
  if (action.type === "item.craft") {
    if (!isCraftable(action.item)) {
      throw new Error(`This item is not craftable: ${action.item}`);
    }

    const item = CRAFTABLES[action.item];

    if (state.balance < item.price) {
      throw new Error("Insufficient tokens");
    }

    const hasIngredients = item.ingredients.every(
      (ingredient) =>
        (state.inventory[ingredient.item] || 0) >= ingredient.amount
    );

    if (!hasIngredients) {
      throw new Error("Insufficient ingredients");
    }

    const subtractedInventory = item.ingredients.reduce(
      (inventory, ingredient) => {
        const count = inventory[ingredient.item] || 0;

        if (count < ingredient.amount) {
          throw new Error(`Insufficient ingredient: ${ingredient.item}`);
        }

        return {
          ...inventory,
          [ingredient.item]: count - ingredient.amount,
        };
      },
      state.inventory
    );

    return {
      ...state,
      balance: state.balance - item.price,
      inventory: {
        ...subtractedInventory,
        [action.item]: (state.inventory[action.item] || 0) + 1,
      },
    };
  }

  if (action.type === "seed.buy") {
    if (!isSeed(action.seed)) {
      throw new Error(`Invalid seed: ${action.seed}`);
    }

    const cropName = action.seed.split(" ")[0] as CropName;
    const crop = CROPS[cropName];

    if (state.balance < crop.buyPrice) {
      throw new Error("Insufficient funds");
    }

    const seedCount = state.inventory[action.seed] || 0;

    return {
      ...state,
      balance: state.balance - crop.buyPrice,
      inventory: {
        ...state.inventory,
        [action.seed]: seedCount + 1,
      },
    };
  }

  if (action.type === "crop.planted") {
    const fields = state.fields;

    if (fields.length < action.index) {
      throw new Error("Field is not unlocked");
    }

    const field = fields[action.index];
    if (field.crop) {
      throw new Error("Crop is already planted");
    }

    if (!action.item) {
      throw new Error("No seed selected");
    }

    if (!isSeed(action.item)) {
      throw new Error("Not a seed");
    }

    const seedCount = state.inventory[action.item] || 0;
    if (seedCount === 0) {
      throw new Error("Not enough seeds");
    }

    const newFields = fields;

    const crop = action.item.split(" ")[0] as CropName;

    newFields[action.index] = {
      ...newFields[action.index],
      crop: {
        plantedAt: new Date(),
        name: crop,
      },
    };

    return {
      ...state,
      inventory: {
        ...state.inventory,
        [action.item]: seedCount - 1,
      },
      fields: newFields,
      actions: [...state.actions, action],
    } as GameState;
  }

  if (action.type === "crop.harvested") {
    const fields = state.fields;

    if (fields.length < action.index) {
      throw new Error("Field is not unlocked");
    }

    const field = fields[action.index];
    if (!field.crop) {
      throw new Error("Nothing was planted");
    }

    const crop = CROPS[field.crop.name];

    if (
      Date.now() - field.crop.plantedAt.getTime() <
      crop.harvestSeconds * 1000
    ) {
      throw new Error("Crop is not ready to harvest");
    }

    const newFields = fields;
    newFields[action.index] = {
      ...newFields[action.index],
      crop: undefined,
    };

    const cropCount = state.inventory[field.crop.name] || 0;

    return {
      ...state,
      fields: newFields,
      inventory: {
        ...state.inventory,
        [field.crop.name]: cropCount + 1,
      },
      actions: [...state.actions, action],
    } as GameState;
  }

  if (action.type === "crop.sell") {
    const crop = CROPS[action.crop];

    const cropCount = state.inventory[action.crop] || 0;

    if (cropCount === 0) {
      throw new Error("No crops to sell");
    }

    return {
      ...state,
      balance: state.balance + crop.sellPrice,
      inventory: {
        ...state.inventory,
        [crop.name]: cropCount - 1,
      },
    };
  }

  throw new Error(`Unexpected event dispatched`);
}

const EMPTY_FIELDS: FieldItem[] = Array(22)
  .fill(null)
  .map((_, fieldIndex) => ({ fieldIndex }));

export const GameProvider: React.FC = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<InventoryItemName[]>(
    getShortcuts()
  );

  const [state, setState] = useState<GameState>({
    balance: 50,
    fields: EMPTY_FIELDS,
    inventory: {
      "Sunflower Seed": 2,
      Wood: 2,
      Gold: 2,
    },
    level: 0,
    actions: [],
  });

  const dispatcher = React.useCallback(
    (action: GameAction) => {
      const newState = eventReducer(state, action);
      setState(newState);
      return newState;
    },
    [state]
  );

  const shortcutItem = (item: InventoryItemName) => {
    const items = cacheShortcuts(item);
    setShortcuts(items);
  };

  const selectedItem = shortcuts.length > 0 ? shortcuts[0] : undefined;

  return (
    <Context.Provider value={{ state, dispatcher, shortcutItem, selectedItem }}>
      {children}
    </Context.Provider>
  );
};
