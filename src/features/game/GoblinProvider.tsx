/**
 * A wrapper that provides game state and dispatches events
 */
import { useState, useCallback, useEffect } from "react";
import { useActor, useInterpret } from "@xstate/react";
import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";
import { cacheShortcuts, getShortcuts } from "features/hud/lib/shortcuts";

import { startGoblinVillage, MachineInterpreter } from "./lib/goblinMachine";
import { InventoryItemName } from "./types/game";

interface GameContext {
  gameService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const GoblinProvider: React.FC = ({ children }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const [gameMachine] = useState(
    startGoblinVillage({
      ...authState.context,
    })
  );

  // TODO - Typescript error
  const goblinService = useInterpret(gameMachine) as MachineInterpreter;

  return (
    <Context.Provider value={{ goblinService }}>{children}</Context.Provider>
  );
};
