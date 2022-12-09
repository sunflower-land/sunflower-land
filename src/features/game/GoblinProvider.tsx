/**
 * A wrapper that provides game state and dispatches events
 */
import { useCallback, useLayoutEffect, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";
import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { startGoblinVillage, MachineInterpreter } from "./lib/goblinMachine";
import { InventoryItemName } from "./types/game";
import {
  cacheShortcuts,
  getShortcuts,
} from "features/farming/hud/lib/shortcuts";

export interface GameContext {
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem?: InventoryItemName;
  goblinService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const GoblinProvider: React.FC = ({ children }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const [goblinMachine] = useState(
    startGoblinVillage({
      ...authState.context,
    })
  );

  // TODO - Typescript error
  const goblinService = useInterpret(
    goblinMachine
  ) as unknown as MachineInterpreter;

  const [shortcuts, setShortcuts] = useState<InventoryItemName[]>([]);

  const shortcutItem = useCallback((item: InventoryItemName) => {
    const items = cacheShortcuts(item);

    setShortcuts(items);
  }, []);

  useLayoutEffect(() => {
    const savedShortcuts = getShortcuts();

    setShortcuts(savedShortcuts);
  }, []);

  const selectedItem = shortcuts.length > 0 ? shortcuts[0] : undefined;

  return (
    <Context.Provider value={{ shortcutItem, selectedItem, goblinService }}>
      {children}
    </Context.Provider>
  );
};
