/**
 * A wrapper that provides game state and dispatches events
 */
import { useState, useCallback } from "react";
import { useActor, useInterpret } from "@xstate/react";
import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";
import {
  cacheShortcuts,
  getShortcuts,
} from "features/farming/hud/lib/shortcuts";

import { startGame, MachineInterpreter } from "./lib/gameMachine";
import { InventoryItemName } from "./types/game";
import { useParams } from "react-router-dom";

interface GameContext {
  shortcutItem: (item: InventoryItemName) => void;
  selectedItem?: InventoryItemName;
  gameService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const GameProvider: React.FC = ({ children }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { id } = useParams();
  const [gameMachine] = useState(
    startGame({
      ...authState.context,
      farmId: id ? Number(id) : authState.context.farmId,
      // If the last event was a create farm, walk them through the tutorial
      // For now hide the tutorial until we can figure out an approach that is maintainable
      isNoob: false, //authState.history?.event.type === "CREATE_FARM",
    }) as any
  );

  // TODO - Typescript error
  const gameService = useInterpret(gameMachine) as MachineInterpreter;
  const [shortcuts, setShortcuts] = useState<InventoryItemName[]>(
    getShortcuts()
  );

  const shortcutItem = useCallback(
    (item: InventoryItemName) => {
      if (gameService.state.matches("readonly")) {
        return;
      }

      const items = cacheShortcuts(item);
      setShortcuts(items);
    },
    [gameService.state]
  );

  const selectedItem = shortcuts.length > 0 ? shortcuts[0] : undefined;

  return (
    <Context.Provider value={{ shortcutItem, selectedItem, gameService }}>
      {children}
    </Context.Provider>
  );
};
