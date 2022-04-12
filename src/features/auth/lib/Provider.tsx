import React from "react";
import { useInterpret } from "@xstate/react";
import { authMachine, MachineInterpreter } from "./authMachine";

interface AuthContext {
  authService: MachineInterpreter;
}

export const Context = React.createContext<AuthContext>({} as AuthContext);

export const Provider: React.FC = ({ children }) => {
  const authService = useInterpret(authMachine) as MachineInterpreter;

  return (
    <Context.Provider value={{ authService }}>{children}</Context.Provider>
  );
};
