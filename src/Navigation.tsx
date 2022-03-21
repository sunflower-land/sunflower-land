import React, { useContext, useEffect, useState } from "react";
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
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    // Start with crops centered
    if (showGame) {
      const el = document.getElementById("crops");

      el?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    }
  }, [showGame]);

  /**
   * Listen to web3 account/network changes
   * TODO: move into a hook
   */
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("networkChanged", () => {
        send("NETWORK_CHANGED");
      });

      window.ethereum.on("accountsChanged", function () {
        send("ACCOUNT_CHANGED");
      });
    }
  }, [send]);

  useEffect(() => {
    const _showGame =
      authState.matches({ connected: "authorised" }) ||
      authState.matches("visiting");

    // TODO: look into this further
    // This is to prevent a modal clash when the authmachine switches
    // to the game machine.
    setTimeout(() => setShowGame(_showGame), 20);
  }, [authState.value]);

  return (
    <>
     { <Session /> }
    </>
  );
};
