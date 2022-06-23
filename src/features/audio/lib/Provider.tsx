import React from "react";
import { useInterpret } from "@xstate/react";
import { audioMachine, MachineInterpreter } from "./audioMachine";

interface AudioContext {
  audioService: MachineInterpreter;
}

export const Context = React.createContext<AudioContext>({} as AudioContext);

export const Provider: React.FC = ({ children }) => {
  const audioService = useInterpret(audioMachine) as MachineInterpreter;

  return (
    <Context.Provider value={{ audioService }}>{children}</Context.Provider>
  );
};
