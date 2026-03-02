import React from "react";
import { useActor, useActorRef } from "@xstate/react";
import { authMachine, MachineInterpreter } from "./authMachine";

interface AuthContext {
  authService: MachineInterpreter;
}

export const Context = React.createContext<AuthContext>({} as AuthContext);

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const authService = useActorRef(authMachine) as unknown as MachineInterpreter;

  return (
    <Context.Provider value={{ authService }}>{children}</Context.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(Context);
  const [authState] = useActor(context.authService);

  if (!context) {
    throw new Error("useAuth must be used within an GameProvider");
  }

  return { authState, authService: context.authService };
};
