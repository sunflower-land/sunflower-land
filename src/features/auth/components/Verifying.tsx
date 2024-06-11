import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import { CONFIG } from "lib/config";

import { Context } from "../lib/Provider";
import { wallet } from "lib/blockchain/wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "./Loading";

export const Verifying: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const { t } = useAppTranslation();

  useEffect(() => {
    const setup = () => {
      const eventMethod =
        !!window.addEventListener === true ? "addEventListener" : "attachEvent";

      const eventer = window[eventMethod as any] as unknown as (
        name: any,
        fn: (event: MessageEvent) => void,
        propogate: boolean
      ) => void;
      const messageEvent =
        eventMethod == "attachEvent" ? "onmessage" : "message";

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
            authService.send("VERIFIED", {
              data: {
                account: wallet.myAccount,
                token: e.data,
              },
            });
          }
        },
        false
      );
    };

    setup();
  }, []);

  return (
    <>
      <iframe
        hidden
        src={`${CONFIG.API_URL}/auth/verify?token=${authState.context.user.rawToken}`}
        title="Yeeeet!"
        id="iframe"
        style={{ height: 0 }}
      ></iframe>
      <Loading />
    </>
  );
};
