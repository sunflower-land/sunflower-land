import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/Modal";

import * as AuthProvider from "features/auth/lib/Provider";
import { Loading } from "features/auth/components/Loading";
import { Unauthorised } from "features/auth/Unauthorised";
import { Session } from "features/game/Session";
import { Welcome } from "features/auth/components/Welcome";
import { Splash } from "features/auth/components/Splash";
import { SettingUpFarm } from "features/auth/components/SettingUpFarm";
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
        console.log("Network changed");
        send("NETWORK_CHANGED");
      });

      window.ethereum.on("accountsChanged", function () {
        send("ACCOUNT_CHANGED");
      });
    }
  }, [send]);

  let isLoading =
    authState.matches("authorising") ||
    authState.matches("connecting") ||
    authState.matches("signing");

  const showGame =
    authState.matches("authorised") || authState.matches("visiting");

  return (
    <>
      <Auth />

      {showGame ? <Session /> : <Splash />}
    </>
  );
};
