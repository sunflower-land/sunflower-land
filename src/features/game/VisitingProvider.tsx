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
      farmToVisitID: Number(id),
    })
  );

  // TODO - Typescript error
  const gameService = useInterpret(visitingMachine) as MachineInterpreter;

  return (
    <Context.Provider value={{ gameService }}>{children}</Context.Provider>
  );
};
