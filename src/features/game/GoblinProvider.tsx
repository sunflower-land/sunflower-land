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

interface Props {
  farmAddress: string;
  farmId: number;
}

export const GoblinProvider: React.FC<Props> = ({
  farmAddress,
  farmId,
  children,
}) => {
  const { authService } = useContext(Auth.Context);
  // const { gameService } = useContext(GameProviderContext);
  const [authState] = useActor(authService);
  // const [gameState] = useActor(gameService);

  const [goblinMachine] = useState(
    startGoblinVillage({
      user: authState.context.user,
      farmAddress,
      farmId,
    })
  );

  // TODO - Typescript error
  const goblinService = useInterpret(
    goblinMachine
  ) as unknown as MachineInterpreter;

  return (
    <Context.Provider value={{ goblinService }}>{children}</Context.Provider>
  );
};
