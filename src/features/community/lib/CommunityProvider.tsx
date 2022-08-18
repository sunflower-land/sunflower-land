/**
 * A wrapper that provides game state and dispatches events
 */
import { useState } from "react";
import { useInterpret } from "@xstate/react";
import React from "react";

import { MachineInterpreter, startCommunityMachine } from "./communityMachine";

interface GameContext {
  communityService: MachineInterpreter;
}

export const Context = React.createContext<GameContext>({} as GameContext);

export const CommunityProvider: React.FC = ({ children }) => {
  const [communityMachine] = useState(startCommunityMachine({}));

  // TODO - Typescript error
  const communityService = useInterpret(
    communityMachine
  ) as unknown as MachineInterpreter;

  return (
    <Context.Provider value={{ communityService }}>{children}</Context.Provider>
  );
};
