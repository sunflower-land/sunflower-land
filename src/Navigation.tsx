import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";

import { Session } from "features/game/Session";
import { Splash } from "features/auth/components/Splash";
import { Auth } from "features/auth/Auth";

/**
 * Entry point for game which reflects the user session state
 * Controls flow of authorised and unauthorised games
 */
export const Navigation: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  useEffect(() => {
    if (!(authState.matches("authorised") || authState.matches("visiting"))) {
      return;
    }
    // Start with crops centered
    const el = document.getElementById("crops");

    el?.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center",
    });
  }, [authState]);

  /**
   * Listen to web3 account/network changes
   * TODO: move into a hook
   */
  useEffect(() => {
    console.log("window.ethereum", window.ethereum);
    if (window.ethereum) {
      window.ethereum.on("networkChanged", () => {
        send("NETWORK_CHANGED");
      });

      window.ethereum.on("accountsChanged", function () {
        send("ACCOUNT_CHANGED");
      });
    }
  }, [send]);

  const showGame =
    authState.matches("authorised") || authState.matches("visiting");

  return (
    <>
      <Auth />
      {showGame ? <Session /> : <Splash />}
    </>
  );
};
