/**
 * A wrapper that provides game state and dispatches events
 */

import { CropName, SeedName } from "features/crops/lib/crops";
import { cacheShortcuts, getShortcuts } from "features/hud/lib/shortcuts";
import React from "react";
import { useState } from "react";
import { GameEvent, processEvent } from "./events";
import { CraftableName } from "./events/craft";
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
  level: number;
  inventory: Inventory;
  actions: PastAction[];
};

interface GameContext {
  state: GameState;
  dispatcher: (action: GameEvent) => GameState;
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem?: InventoryItemName;
}

export const Context = React.createContext<GameContext>({} as GameContext);

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
      Wood: 11,
      Gold: 2,
      Sunflower: 30,
      Cauliflower: 20,
      Radish: 5,
    },
    level: 0,
    actions: [],
  });

  const dispatcher = React.useCallback(
    (action: GameEvent) => {
      const newState = processEvent(state, action);

      const actions = [
        ...state.actions,
        {
          ...action,
          createdAt: new Date(),
        },
      ];

      setState({
        ...newState,
        actions,
      });
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
