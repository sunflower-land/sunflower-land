/**
 * A wrapper that provides game state and dispatches events
 */
import { useState } from "react";
import { useInterpret } from "@xstate/react";
import React from "react";

import { startGame, MachineInterpreter } from "./lib/visitingMachine";
import { InventoryItemName } from "./types/game";
import { useParams } from "react-router-dom";

interface GameContext {
  selectedItem?: InventoryItemName;
  gameService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const VisitingProvider: React.FC = ({ children }) => {
  const { id } = useParams();

  const [visitingMachine] = useState(
    startGame({
      farmId: Number(id),
      // If the last event was a create farm, walk them through the tutorial
      // For now hide the tutorial until we can figure out an approach that is maintainable
    })
  );

  // TODO - Typescript error
  const gameService = useInterpret(visitingMachine, {
    devTools: true,
  }) as MachineInterpreter;

  return (
    <Context.Provider value={{ gameService }}>{children}</Context.Provider>
  );
};
