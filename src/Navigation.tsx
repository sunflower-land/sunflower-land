import React, {
  Suspense,
  lazy,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useSelector } from "@xstate/react";
import { Routes, Route, HashRouter } from "react-router";

import * as AuthProvider from "features/auth/lib/Provider";

import { Splash } from "features/auth/components/Splash";
import { Auth } from "features/auth/Auth";
import { Forbidden } from "features/auth/components/Forbidden";
import { LandExpansion } from "features/game/expansion/LandExpansion";
import { CONFIG } from "lib/config";
import { Builder } from "features/builder/Builder";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { ZoomProvider } from "components/ZoomProvider";
import { LoadingFallback } from "./LoadingFallback";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { PWAInstallProvider } from "features/pwa/PWAInstallProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { SUNNYSIDE } from "assets/sunnyside";
import { INITIAL_FARM, PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Marketplace } from "features/marketplace/Marketplace";
import { LedgerDashboardProfile } from "features/ledgerDashboard/LedgerDashboardProfile";
import { hasFeatureAccess } from "lib/flags";
import { GameProvider } from "features/game/GameProvider";
import { FlowerDashboard } from "features/flowerDashboard/FlowerDashboard";
import { ModalProvider } from "features/game/components/modal/ModalProvider";

// Lazy load routes
const World = lazy(() =>
  import("features/world/World").then((m) => ({ default: m.World })),
);
const CommunityTools = lazy(() =>
  import("features/world/ui/CommunityTools").then((m) => ({
    default: m.CommunityTools,
  })),
);

const selectState = (state: AuthMachineState) => ({
  isAuthorised: state.matches("connected"),
  isVisiting: state.matches("visiting"),
});

/**
 * Entry point for game which reflects the user session state
 * Controls flow of authorised and unauthorised games
 */
export const Navigation: React.FC = () => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const state = useSelector(authService, selectState);
  const [showGame, setShowGame] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [landingImageLoaded, setLandingImageLoaded] = useState(false);

  useEffect(() => {
    // Check if online on initial load
    if (!navigator.onLine) {
      setShowConnectionModal(true);
    }
    // Set up listeners to watch for connection changes
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleOffline = () => {
    setShowConnectionModal(true);
  };

  const handleOnline = async () => {
    const response = await fetch(".");
    // Verify we get a valid response from the server
    if (response.status >= 200 && response.status < 500) {
      setShowConnectionModal(false);
    }
  };

  useLayoutEffect(() => {
    const _showGame = state.isAuthorised || state.isVisiting;

    // TODO: look into this further
    // This is to prevent a modal clash when the authmachine switches
    // to the game machine.
    setShowGame(_showGame);
  }, [state]);

  return (
    <>
      <Auth showOfflineModal={showConnectionModal} />

      {!showGame && (
        <div
          style={{
            width: "100vw", // Full width of the viewport
            height: "100vh", // Full height of the viewport
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#63c74d", // Optional: to visualize the container
            backgroundImage: `url(${SUNNYSIDE.brand.greenBg})`,
            backgroundRepeat: "repeat",
            backgroundSize: `${PIXEL_SCALE * 64}px`,
            imageRendering: "pixelated",
            filter: "brightness(0.7)",
          }}
        >
          <img
            src={SUNNYSIDE.brand.landing}
            alt="Landing image"
            className={classNames("transition-opacity", {
              "opacity-0": !landingImageLoaded,
              "opacity-100": landingImageLoaded,
            })}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${PIXEL_SCALE * 640}px`,
              maxWidth: "none", // Ensure the image maintains its original size
              maxHeight: "none", // Ensure the image maintains its original size
              transitionDuration: "1s",
            }}
            onLoad={() => setLandingImageLoaded(true)}
          />
        </div>
      )}

      {/* <div className="absolute inset-0 z-10 w-max">
        <img
          src={landing}
          style={{
            width: `${PIXEL_SCALE * 640}px`,
            height: `${PIXEL_SCALE * 480}px`,
            filter: "brightness(0.8)",
          }}
        />
      </div> */}

      {showGame ? (
        <PWAInstallProvider>
          <GameProvider>
            <ZoomProvider>
              <ModalProvider>
                <Modal show={showConnectionModal}>
                  <Panel>
                    <div className="text-sm p-1 mb-1">
                      {t("welcome.offline")}
                    </div>
                  </Panel>
                </Modal>
                <HashRouter>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Forbid entry to Goblin Village when in Visiting State show Forbidden screen */}
                      {!state.isVisiting && (
                        <Route
                          path="/goblins"
                          element={
                            <Splash>
                              <Forbidden
                                onClose={() => {
                                  authService.send("RETURN");
                                }}
                              />
                            </Splash>
                          }
                        />
                      )}{" "}
                      <Route path="/world" element={<World key="world" />}>
                        <Route
                          path="marketplace/*"
                          element={
                            <div className="absolute inset-0 z-50">
                              <Marketplace />
                            </div>
                          }
                        />
                        <Route
                          path="flower-dashboard"
                          element={<FlowerDashboard />}
                        />
                        <Route path=":name" element={null} />
                      </Route>
                      <Route
                        path="/community/:name"
                        element={<World key="community" isCommunity />}
                      />
                      <Route
                        path="/visit/*"
                        element={<LandExpansion key="visit" />}
                      />
                      {CONFIG.NETWORK === "amoy" && (
                        <Route
                          path="/community-tools"
                          element={<CommunityTools key="community-tools" />}
                        />
                      )}
                      {CONFIG.NETWORK === "amoy" && (
                        <Route
                          path="/builder"
                          element={<Builder key="builder" />}
                        />
                      )}
                      {hasFeatureAccess(INITIAL_FARM, "LEDGER") && (
                        <>
                          <Route
                            path="/ledger-dashboard/:id"
                            element={
                              <LedgerDashboardProfile key="ledger-dashboard" />
                            }
                          />
                        </>
                      )}
                      <Route path="*" element={<LandExpansion key="land" />} />
                    </Routes>
                  </Suspense>
                </HashRouter>
              </ModalProvider>
            </ZoomProvider>
          </GameProvider>
        </PWAInstallProvider>
      ) : (
        <Splash />
      )}
    </>
  );
};
