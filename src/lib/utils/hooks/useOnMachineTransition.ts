import { useEffect, useRef } from "react";
import { AnyActor } from "xstate";

export const useOnMachineTransition = (
  service: AnyActor,
  prevState: string,
  newState: string,
  callback?: () => void,
  shouldListen = true,
) => {
  const previousValueRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!shouldListen) return;

    const snapshot = service.getSnapshot();
    previousValueRef.current = String(snapshot.value);

    const subscription = service.subscribe((snapshot) => {
      const currentValue = String(snapshot.value);

      if (
        previousValueRef.current === prevState &&
        currentValue === newState &&
        callback
      ) {
        callback();
      }

      previousValueRef.current = currentValue;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array is fine since we only want to set up the listener once
};
