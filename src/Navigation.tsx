import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Routes, Route, HashRouter } from "react-router-dom";

import * as AuthProvider from "features/auth/lib/Provider";

import { Splash } from "features/auth/components/Splash";
import { Auth } from "features/auth/Auth";
import { Humans } from "features/game/Humans";
import { Goblins } from "features/game/Goblins";
import { Forbidden } from "features/auth/components/Forbidden";
import { Visiting } from "features/game/Visiting";
import { useImagePreloader } from "features/auth/useImagePreloader";
import { LandExpansion } from "features/game/expansion/LandExpansion";
import { CONFIG } from "lib/config";
import { DEV_Viewer } from "features/viewer/DEV_Viewer";
import { Community } from "features/community/Community";
import { Helios } from "features/helios/Helios";
import { Retreat } from "features/retreat/Retreat";
import { SnowKingdom } from "features/snowKingdom/SnowKingdom";

/**
 * Entry point for game which reflects the user session state
 * Controls flow of authorised and unauthorised games
 */
export const Navigation: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);
  const [showGame, setShowGame] = useState(false);
  useImagePreloader();

  /**
   * Listen to web3 account/chain changes
   * TODO: move into a hook
   */
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        send("CHAIN_CHANGED");
      });

      window.ethereum.on("accountsChanged", function () {
        send("ACCOUNT_CHANGED");
      });
    }
  }, [send]);

  useEffect(() => {
    const _showGame =
      authState.matches({ connected: "authorised" }) ||
      authState.matches({ connected: "visitingContributor" }) ||
      authState.matches("visiting");

    // TODO: look into this further
    // This is to prevent a modal clash when the authmachine switches
    // to the game machine.
    setTimeout(() => setShowGame(_showGame), 20);
  }, [authState, authState.value]);

  return (
    <>
      <Auth />
      {showGame ? (
        <HashRouter>
          <Routes>
            <Route path="/" element={<Humans />} />
            {/* Forbid entry to Goblin Village when in Visiting State, show Forbidden screen */}
            {!authState.matches("visiting") ? (
              <Route path="/goblins" element={<Goblins />} />
            ) : (
              <Route
                path="/goblins"
                element={
                  <Splash>
                    <Forbidden />
                  </Splash>
                }
              />
            )}
            <Route path="/farm/:id" element={<Humans key="farm" />} />
            <Route path="/visit/:id" element={<Visiting key="visit" />} />
            {CONFIG.NETWORK !== "mainnet" && (
              <Route path="/land/:id" element={<LandExpansion key="land" />} />
            )}
            {CONFIG.NETWORK !== "mainnet" && (
              <Route path="/helios/:id" element={<Helios key="helios" />} />
            )}
            {CONFIG.NETWORK !== "mainnet" && (
              <Route path="/retreat/:id" element={<Retreat key="helios" />} />
            )}
            {CONFIG.NETWORK !== "mainnet" && (
              <Route path="/snow/:id" element={<SnowKingdom key="snow" />} />
            )}
            {CONFIG.NETWORK !== "mainnet" && (
              <Route path="/viewer/:id" element={<DEV_Viewer key="viewer" />} />
            )}
            <Route
              path="/community-garden"
              element={<Community key="farm" />}
            />
            {/* Fallback */}
            <Route element={<Humans />} />
          </Routes>
        </HashRouter>
      ) : (
        <Splash />
      )}
    </>
  );
};
