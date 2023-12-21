import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import {
  Routes,
  Route,
  HashRouter,
  Navigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";

import * as AuthProvider from "features/auth/lib/Provider";

import { Splash } from "features/auth/components/Splash";
import { Auth } from "features/auth/Auth";
import { Forbidden } from "features/auth/components/Forbidden";
import { LandExpansion } from "features/game/expansion/LandExpansion";
import { CONFIG } from "lib/config";
import { Retreat } from "features/retreat/Retreat";
import { Builder } from "features/builder/Builder";
import { wallet } from "lib/blockchain/wallet";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { ZoomProvider } from "components/ZoomProvider";
import { World } from "features/world/World";
import { CommunityTools } from "features/world/ui/CommunityTools";
import { useOrientation } from "lib/utils/hooks/useOrientation";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

/**
 * FarmID must always be passed to the /retreat/:id route.
 * The problem is that when deep-linking to goblin trader, the FarmID will not be present.
 * This reacter-router helper component will compute correct route and navigate to retreat.
 */
const TraderDeeplinkHandler: React.FC<{ farmId?: number }> = ({ farmId }) => {
  const [params] = useSearchParams();

  return <Navigate to={`/retreat/0?${createSearchParams(params)}`} replace />;
};

const selectProvider = (state: AuthMachineState) =>
  state.context.user.web3?.provider;
const selectState = (state: AuthMachineState) => ({
  isAuthorised: state.matches("connected"),
  isVisiting: state.matches("visiting"),
});

/**
 * Entry point for game which reflects the user session state
 * Controls flow of authorised and unauthorised games
 */
export const Navigation: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const provider = useSelector(authService, selectProvider);
  const state = useSelector(authService, selectState);
  const [showGame, setShowGame] = useState(false);
  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const isMobile = useIsMobile();
  const orientation = useOrientation();

  useEffect(() => {
    if (!isMobile) return;

    if (orientation === "landscape") {
      setShowOrientationModal(true);
    } else {
      setShowOrientationModal(false);
    }
  }, [orientation, isMobile]);

  /**
   * Listen to web3 account/chain changes
   * TODO: move into a hook
   */
  useEffect(() => {
    if (provider) {
      if (provider.on) {
        provider.on("chainChanged", (chain: any) => {
          if (parseInt(chain) === CONFIG.POLYGON_CHAIN_ID) {
            return;
          }

          // Phantom handles this internally
          if (provider.isPhantom) return;

          authService.send("CHAIN_CHANGED");
        });
        provider.on("accountsChanged", function (accounts: string[]) {
          // Metamask Mobile accidentally triggers this on route changes
          const didChange = accounts[0] !== wallet.myAccount;
          if (didChange) {
            authService.send("ACCOUNT_CHANGED");
          }
        });
      } else if (provider.givenProvider) {
        provider.givenProvider.on("chainChanged", () => {
          authService.send("CHAIN_CHANGED");
        });
        provider.givenProvider.on("accountsChanged", function () {
          authService.send("ACCOUNT_CHANGED");
        });
      }
    }
  }, [provider]);

  useEffect(() => {
    const _showGame = state.isAuthorised || state.isVisiting;

    // TODO: look into this further
    // This is to prevent a modal clash when the authmachine switches
    // to the game machine.
    setTimeout(() => setShowGame(_showGame), 20);
  }, [state]);

  return (
    <>
      <Auth />
      {showGame ? (
        <ZoomProvider>
          <Modal show={showOrientationModal} centered backdrop={false}>
            <Panel>
              <div className="text-sm p-1">{`Hey there Bumpkin, Sunflower Land currently prefers portrait mode. Tilt your device and enjoy the view for now, but prepare for the landscape mode coming soon!`}</div>
            </Panel>
          </Modal>
          <HashRouter>
            <Routes>
              <Route path="*" element={<LandExpansion />} />
              {/* Forbid entry to Goblin Village when in Visiting State show Forbidden screen */}
              {!state.isVisiting && (
                <Route
                  path="/goblins"
                  element={
                    <Splash>
                      <Forbidden />
                    </Splash>
                  }
                />
              )}
              <Route path="/world/:name" element={<World key="world" />} />
              <Route
                path="/community/:name"
                element={<World key="community" isCommunity />}
              />
              {CONFIG.NETWORK === "mumbai" && (
                <Route
                  path="/community-tools"
                  element={<CommunityTools key="community-tools" />}
                />
              )}

              <Route path="/visit/*" element={<LandExpansion key="visit" />} />
              <Route
                path="/land/:id?/*"
                element={<LandExpansion key="land" />}
              />
              <Route path="/retreat">
                <Route index element={<TraderDeeplinkHandler />} />
                <Route path=":id" element={<Retreat key="retreat" />} />
              </Route>
              {CONFIG.NETWORK === "mumbai" && (
                <Route path="/builder" element={<Builder key="builder" />} />
              )}
            </Routes>
          </HashRouter>
        </ZoomProvider>
      ) : (
        <Splash />
      )}
    </>
  );
};
