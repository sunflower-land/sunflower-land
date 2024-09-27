import { useCallback, useEffect } from "react";
import { EventObject, Interpreter, State } from "xstate";

export const useOnMachineTransition = <TContext, TEvent extends EventObject>(
  service: Interpreter<TContext, any, TEvent>, // The XState service (interpreter)
  prevState: string, // The previous state to check
  newState: string, // The new state to check
  callback: () => void, // The callback function to run
  shouldListen = true, // Whether to listen to the transition
) => {
  const memoizedCallback = useCallback(() => {
    callback();
  }, [callback]);

  useEffect(() => {
    if (!shouldListen) return;

    const handleTransition = (state: State<TContext, TEvent>) => {
      if (!state.changed) return;

      // Check if the state transitioned from prevState to newState
      if (state.history?.matches(prevState) && state.matches(newState)) {
        memoizedCallback();
      }
    };

    // Register the transition handler
    service.onTransition(handleTransition);

    return () => {
      service.off(handleTransition); // Correct cleanup using `service.off()`
    };
  }, []); // Add dependencies for the hook
};
