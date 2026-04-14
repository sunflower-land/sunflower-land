import { useEffect } from "react";
import { EventObject, Interpreter, State } from "xstate";

export const useOnMachineTransition = <TContext, TEvent extends EventObject>(
  service: Interpreter<TContext, any, TEvent>,
  prevState: string,
  newState: string,
  callback?: () => void,
  shouldListen = true,
) => {
  useEffect(() => {
    if (!shouldListen) return;

    const handleTransition = (state: State<TContext, TEvent>) => {
      if (!state.changed) return;

      // Check if the state transitioned from prevState to newState
      if (
        state.history?.matches(prevState) &&
        state.matches(newState) &&
        callback
      ) {
        callback();
      }
    };

    // Register the transition handler
    service.onTransition(handleTransition);

    return () => {
      service.off(handleTransition);
    };
  }, []); // Empty dependency array is fine since we only want to set up the listener once
};
