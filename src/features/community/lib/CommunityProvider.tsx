/**
 * A wrapper that provides game state and dispatches events
 */
import { useContext, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";
import React from "react";

import * as Auth from "features/auth/lib/Provider";
import { MachineInterpreter, startCommunityMachine } from "./communityMachine";

interface GameContext {
  communityService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const CommunityProvider: React.FC = ({ children }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const [communityMachine] = useState(
    startCommunityMachine({ ...authState.context })
  );

  // TODO - Typescript error
  const communityService = useInterpret(
    communityMachine
  ) as unknown as MachineInterpreter;

  return (
    <Context.Provider value={{ communityService }}>{children}</Context.Provider>
  );
};
