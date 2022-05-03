/**
 * A wrapper that provides game state and dispatches events
 */
import { useState } from "react";
import { useActor, useInterpret } from "@xstate/react";
import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { startGoblinVillage, MachineInterpreter } from "./lib/goblinMachine";

interface GameContext {
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
  const goblinService = useInterpret(goblinMachine, {
    devTools: true,
  }) as MachineInterpreter;

  return (
    <Context.Provider value={{ goblinService }}>{children}</Context.Provider>
  );
};
