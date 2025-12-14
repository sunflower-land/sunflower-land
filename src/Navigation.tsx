import React, { Suspense, lazy, useState } from "react";
import { useSelector } from "@xstate/react";
import { Routes, Route, HashRouter } from "react-router";

import { useAuth } from "features/auth/lib/Provider";

import { Auth } from "features/auth/Auth";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { ZoomProvider } from "components/ZoomProvider";
import { LoadingFallback } from "./LoadingFallback";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { PWAInstallProvider } from "features/pwa/PWAInstallProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useConnectionStatus } from "lib/hooks/useConnectionStatus";

import { SUNNYSIDE } from "assets/sunnyside";
import { PixelBackground } from "components/ui/PixelBackground";
import { CenteredImage } from "components/ui/CenteredImage";
import { GameProvider } from "features/game/GameProvider";
import { FlowerDashboard } from "features/flowerDashboard/FlowerDashboard";
import { ModalProvider } from "features/game/components/modal/ModalProvider";
import { FeedProvider } from "features/social/FeedContext";
import { composeProviders } from "lib/utils/composeProviders";
import { GameRoutes } from "./routes/GameRoutes";

// Lazy load routes
const World = lazy(() =>
  import("features/world/World").then((m) => ({ default: m.World })),
);

const selectState = (state: AuthMachineState) => ({
  isAuthorised: state.matches("connected"),
  isVisiting: state.matches("visiting"),
});

const AppProviders = composeProviders([
  [PWAInstallProvider],
  [GameProvider],
  [ZoomProvider],
  [FeedProvider],
  [ModalProvider],
]);

/**
 * Entry point for game which reflects the user session state
 * Controls flow of authorised and unauthorised games
 */
export const Navigation: React.FC = () => {
  const { t } = useAppTranslation();
  const { authService } = useAuth();
  const isOffline = useConnectionStatus();
  const [landingImageLoaded, setLandingImageLoaded] = useState(false);

  const state = useSelector(authService, selectState);
  const showGame = state.isAuthorised || state.isVisiting;

  return (
    <>
      <HashRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes that don't require authentication */}
            <Route path="/flower-dashboard" element={<FlowerDashboard />} />

            {/* Protected routes that require authentication */}
            <Route
              path="/*"
              element={
                <>
                  <Auth showOfflineModal={isOffline} />
                  {showGame ? (
                    <>
                      <AppProviders>
                        <Modal show={isOffline}>
                          <Panel>
                            <div className="text-sm p-1 mb-1">
                              {t("welcome.offline")}
                            </div>
                          </Panel>
                        </Modal>
                        <GameRoutes
                          isVisiting={state.isVisiting}
                          onForbiddenClose={() => authService.send("RETURN")}
                        />
                      </AppProviders>
                    </>
                  ) : (
                    <PixelBackground
                      image={SUNNYSIDE.brand.greenBg}
                      brightness={0.7}
                    >
                      <CenteredImage
                        src={SUNNYSIDE.brand.landing}
                        alt="Landing image"
                        pixelWidth={640}
                        loaded={landingImageLoaded}
                        onLoad={() => setLandingImageLoaded(true)}
                      />
                    </PixelBackground>
                  )}
                </>
              }
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
};
