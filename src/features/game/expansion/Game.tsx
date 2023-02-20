import { ValentineIsland } from "features/valentineIsland/ValentineIsland";
import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { Loading } from "features/auth/components";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { screenTracker } from "lib/utils/screen";
import { Refreshing } from "features/auth/components/Refreshing";
import { AddingSFL } from "features/auth/components/AddingSFL";
import { Context } from "../GameProvider";
import { INITIAL_SESSION, StateValues } from "../lib/gameMachine";
import { ToastProvider as OldToastProvider } from "../toast/ToastQueueProvider";
import { ToastProvider as NewToastProvider } from "../toast/ToastProvider";
import { ToastManager as OldToastPanel } from "../toast/ToastManager";
import { ToastPanel as NewToastPanel } from "../toast/ToastPanel";
import { Panel } from "components/ui/Panel";
import { Success } from "../components/Success";
import { Syncing } from "../components/Syncing";
import { Expanding } from "./components/Expanding";
import { ExpansionSuccess } from "./components/ExpansionSuccess";

import { Notifications } from "../components/Notifications";
import { Hoarding } from "../components/Hoarding";
import { NoBumpkin } from "features/island/bumpkin/NoBumpkin";
import { Swarming } from "../components/Swarming";
import { Cooldown } from "../components/Cooldown";
// import { Rules } from "../components/Rules";
import { Route, Routes } from "react-router-dom";
import { Land } from "./Land";
import { Helios } from "features/helios/Helios";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { VisitLandExpansionForm } from "./components/VisitLandExpansionForm";

import land from "assets/land/islands/island.webp";
import { TreasureIsland } from "features/treasureIsland/TreasureIsland";
import { StoneHaven } from "features/stoneHaven/StoneHaven";
import { getBumpkinLevel } from "../lib/level";
import { SnowKingdom } from "features/snowKingdom/SnowKingdom";
import { IslandNotFound } from "./components/IslandNotFound";
import { Studios } from "features/studios/Studios";
import { Rules } from "../components/Rules";
import { PumpkinPlaza } from "features/pumpkinPlaza/PumpkinPlaza";
import { hasFeatureAccess } from "lib/flags";

const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  autosaving: false,
  syncing: true,
  synced: true,
  error: true,
  refreshing: true,
  deposited: true,
  expanding: true,
  expanded: true,
  hoarding: true,
  editing: false,
  noBumpkinFound: true,
  swarming: true,
  coolingDown: true,
  gameRules: true,
  randomising: false,
  visiting: false,
  loadLandToVisit: true,
  landToVisitNotFound: true,
  checkIsVisiting: false,
  revealing: false,
  revealed: false,
  buyingSFL: true,
  depositing: true,
};

export const Game: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  useInterval(() => send("SAVE"), AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (gameState.context.actions.length === 0) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameState]);

  useEffect(() => {
    const save = () => {
      send("SAVE");
    };

    window.addEventListener("blur", save);

    screenTracker.start(authService);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("blur", save);
      screenTracker.pause();
    };
  }, []);

  const loadingSession =
    gameState.matches("loading") &&
    gameState.context.sessionId === INITIAL_SESSION;

  if (loadingSession || gameState.matches("loadLandToVisit")) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
        <Modal show centered backdrop={false}>
          <Panel>
            <Loading />
          </Panel>
        </Modal>
      </div>
    );
  }

  const GameContent = () => {
    if (gameState.matches("landToVisitNotFound")) {
      return (
        <>
          <div className="absolute z-20">
            <VisitingHud />
          </div>
          <div className="relative">
            <Modal centered show backdrop={false}>
              <Panel
                bumpkinParts={{
                  body: "Beige Farmer Potion",
                  hair: "Rancher Hair",
                  pants: "Farmer Overalls",
                  shirt: "Red Farmer Shirt",
                  tool: "Farmer Pitchfork",
                  background: "Farm Background",
                  shoes: "Black Farmer Boots",
                }}
              >
                <div className="flex flex-col items-center">
                  <h2 className="text-center">Island Not Found!</h2>
                  <img src={land} className="h-9 my-3" />
                </div>
                <VisitLandExpansionForm />
              </Panel>
            </Modal>
          </div>
        </>
      );
    }

    if (gameState.matches("visiting")) {
      return (
        <>
          <div className="absolute z-10 w-full h-full">
            <Routes>
              <Route path="/:id" element={<Land />} />
            </Routes>
          </div>
          <div className="absolute z-20">
            <VisitingHud />
          </div>
        </>
      );
    }

    const level = getBumpkinLevel(
      gameState.context.state.bumpkin?.experience ?? 0
    );

    return (
      <>
        <div className="absolute w-full h-full z-10">
          <Routes>
            <Route path="/" element={<Land />} />
            <Route path="/helios" element={<Helios key="helios" />} />

            <Route
              path="/valentine-island"
              element={<ValentineIsland key="valentine" />}
            />
            <Route path="/plaza" element={<PumpkinPlaza key="plaza" />} />
            {level >= 10 && (
              <Route
                path="/treasure-island"
                element={<TreasureIsland key="treasure" />}
              />
            )}

            {level >= 20 && (
              <Route
                path="/stone-haven"
                element={<StoneHaven key="stone-haven" />}
              />
            )}
            {level >= 50 && (
              <Route path="/snow" element={<SnowKingdom key="snow" />} />
            )}
            <Route path="/studios" element={<Studios key="hq" />} />

            <Route path="*" element={<IslandNotFound />} />
          </Routes>
        </div>
      </>
    );
  };

  const useNewToast = hasFeatureAccess(
    gameState?.context?.state?.inventory,
    "COALESCING_TOAST"
  );
  const ToastProvider = useNewToast ? NewToastProvider : OldToastProvider;
  const ToastPanel = useNewToast ? NewToastPanel : OldToastPanel;

  return (
    <ToastProvider>
      <ToastPanel />

      <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
        <Panel>
          {gameState.matches("loading") && <Loading />}
          {gameState.matches("refreshing") && <Refreshing />}
          {gameState.matches("buyingSFL") && <AddingSFL />}
          {gameState.matches("deposited") && <Notifications />}
          {gameState.matches("error") && (
            <ErrorMessage
              errorCode={gameState.context.errorCode as ErrorCode}
            />
          )}
          {gameState.matches("synced") && <Success />}
          {gameState.matches("syncing") && <Syncing />}
          {gameState.matches("expanded") && <ExpansionSuccess />}
          {gameState.matches("expanding") && <Expanding />}
          {gameState.matches("hoarding") && <Hoarding />}
          {gameState.matches("swarming") && <Swarming />}
          {gameState.matches("noBumpkinFound") && <NoBumpkin />}
          {gameState.matches("coolingDown") && <Cooldown />}
          {gameState.matches("gameRules") && <Rules />}
          {gameState.matches("depositing") && <Loading text="Depositing" />}
        </Panel>
      </Modal>

      {GameContent()}
    </ToastProvider>
  );
};
