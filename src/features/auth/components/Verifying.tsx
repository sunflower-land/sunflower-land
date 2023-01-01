import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import { CONFIG } from "lib/config";

import { Context } from "../lib/Provider";

export const Verifying: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  useEffect(() => {
    const eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
    const eventer = window[eventMethod as any] as unknown as (
      name: any,
      fn: (event: MessageEvent) => void,
      propogate: boolean
    ) => void;
    const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(
      messageEvent,
      function (e: MessageEvent) {
        const frame = document.getElementById("iframe") as HTMLIFrameElement;

        // Only listen to events from the IFrame in focus
        if (
          e.origin.includes(CONFIG.API_URL as string) ||
          (e.origin === "null" && e.source === frame?.contentWindow)
        ) {
          console.log("parent received message!:  ", e.data);
          authService.send("VERIFIED", {
            data: {
              token: e.data,
            },
          });
        }
      },
      false
    );
  }, []);

  return (
    <>
      <iframe
        hidden
        src={`${CONFIG.API_URL}/auth/verify?token=${authState.context.rawToken}`}
        title="Yeeeet!"
        id="iframe"
        sandbox="allow-scripts"
      ></iframe>
      <span className="text-shadow loading">Signing you in</span>
      <span className="text-shadow block my-2 mx-2 sm:text-sm">
        Accept the signature request in your browser wallet to login.
      </span>
    </>
  );
};
