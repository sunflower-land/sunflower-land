/**
 * A wrapper that provides game state and dispatches events
 */
import { useState, useCallback } from "react";
import { useActor, useInterpret } from "@xstate/react";
import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";
import { cacheShortcuts, getShortcuts } from "features/hud/lib/shortcuts";

import { startGame, MachineInterpreter } from "./lib/gameMachine";
import { InventoryItemName } from "./types/game";

interface GameContext {
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem?: InventoryItemName;
  gameService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const GameProvider: React.FC = ({ children }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  // TODO - Typescript error
  const gameService = useInterpret(
    startGame({
      ...authState.context,
      // If the last event was a create farm, walk them through the tutorial
      isNoob: authState.history?.event.type === "CREATE_FARM",
    }) as any
  ) as MachineInterpreter;
  const [shortcuts, setShortcuts] = useState<InventoryItemName[]>(
    getShortcuts()
  );

  const shortcutItem = useCallback((item: InventoryItemName) => {
    const items = cacheShortcuts(item);
    setShortcuts(items);
  }, []);

  const selectedItem = shortcuts.length > 0 ? shortcuts[0] : undefined;

  return (
    <Context.Provider value={{ shortcutItem, selectedItem, gameService }}>
      {children}
    </Context.Provider>
  );
};
