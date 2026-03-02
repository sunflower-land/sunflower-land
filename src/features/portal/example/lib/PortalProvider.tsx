import React, { useEffect } from "react";
import { useActorRef } from "@xstate/react";
import { MachineInterpreter, portalMachine } from "./portalMachine";

interface PortalContext {
  portalService: MachineInterpreter;
}

export const PortalContext = React.createContext<PortalContext>(
  {} as PortalContext,
);

export const PortalProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const portalService = useActorRef(
    portalMachine,
  ) as unknown as MachineInterpreter;

  /**
   * Below is how we can listen to messages from the parent window
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle the received message
      if (event.data.event === "purchased") {
        // Put in your handlers here
        portalService.send({ type: "PURCHASED" });
      }
    };

    // Add event listener to listen for messages from the parent window
    window.addEventListener("message", handleMessage);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <PortalContext.Provider value={{ portalService }}>
      {children}
    </PortalContext.Provider>
  );
};
