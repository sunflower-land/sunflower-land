import React from "react";
import { useActor, useInterpret } from "@xstate/react";
import { authMachine } from "./authMachine";

type AuthService = ReturnType<typeof useInterpret<typeof authMachine>>;

const AuthContext = React.createContext<AuthService | null>(null);

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const authService = useInterpret(authMachine);

  return (
    <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const service = React.useContext(AuthContext);

  if (!service) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const [authState] = useActor(service);

  return { authState, authService: service };
};
