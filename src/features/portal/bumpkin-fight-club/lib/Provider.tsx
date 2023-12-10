import React from "react";
import { useInterpret } from "@xstate/react";
import { MachineInterpreter, portalMachine } from "./machine";

interface PortalContext {
  portalService: MachineInterpreter;
}

export const PortalContext = React.createContext<PortalContext>(
  {} as PortalContext
);

export const PortalProvider: React.FC = ({ children }) => {
  const portalService = useInterpret(
    portalMachine
  ) as unknown as MachineInterpreter;

  return (
    <PortalContext.Provider value={{ portalService }}>
      {children}
    </PortalContext.Provider>
  );
};
