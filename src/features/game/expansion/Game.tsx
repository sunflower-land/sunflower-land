import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";
import { Routes, Route } from "react-router-dom";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { Loading, Splash } from "features/auth/components";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { screenTracker } from "lib/utils/screen";
import { Refreshing } from "features/auth/components/Refreshing";
import { Context } from "../GameProvider";
import { INITIAL_SESSION, StateValues } from "../lib/gameMachine";
import { ToastManager } from "../toast/ToastManager";
import { Panel } from "components/ui/Panel";
import { Success } from "../components/Success";
import { Syncing } from "../components/Syncing";
import { Land } from "./Land";
import { Hud } from "features/island/hud/Hud";
import { Expanding } from "./components/Expanding";
import { ExpansionSuccess } from "./components/ExpansionSuccess";
import { PlaceableOverlay } from "./components/PlaceableOverlay";

import jumpingGoblin from "assets/npcs/goblin_jump.gif";
import curly from "assets/npcs/curly_hair.png";
import { Notifications } from "../components/Notifications";
import { Announcements } from "features/announcements/Announcement";
import { Hoarding } from "../components/Hoarding";
import { NoBumpkin } from "features/island/bumpkin/NoBumpkin";
import { MintingBumpkin } from "features/island/bumpkin/components/MintingBumpkin";
import { BumpkinMinted } from "features/island/bumpkin/components/BumpkinMinted";
import { Swarming } from "../components/Swarming";
import { Helios } from "features/helios/Helios";
import { Cooldown } from "../components/Cooldown";
import { Rules } from "../components/Rules";

const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  autosaving: false,
  syncing: true,
  synced: true,
  error: true,
  levelling: false,
  refreshing: true,
  announcing: true,
  deposited: true,
  expanding: true,
  expanded: true,
  hoarding: true,
  editing: false,
  noBumpkinFound: true,
  mintingBumpkin: true,
  bumpkinMinted: true,
  swarming: true,
  coolingDown: true,
  gameRules: true,
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

  if (loadingSession) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
        <Splash fadeIn={false} />
        <Modal show centered backdrop={false}>
          <div className="relative">
            <img
              id="curly"
              src={curly}
              className="absolute w-54 -top-11 right-20 -z-10 scale-[4]"
            />
            <img
              src={jumpingGoblin}
              className="absolute w-52 -top-[83px] -z-10"
            />
            <Panel>
              <Loading />
            </Panel>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <>
      <ToastManager />

      <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
        <Panel>
          {gameState.matches("loading") && <Loading />}
          {gameState.matches("refreshing") && <Refreshing />}
          {gameState.matches("deposited") && <Notifications />}
          {gameState.matches("announcing") && <Announcements />}
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
          {gameState.matches("mintingBumpkin") && <MintingBumpkin />}
          {gameState.matches("bumpkinMinted") && <BumpkinMinted />}
          {gameState.matches("coolingDown") && <Cooldown />}
          {gameState.matches("gameRules") && <Rules />}
        </Panel>
      </Modal>

      <div className="absolute z-10 w-full h-full">
        <PlaceableOverlay>
          <Routes>
            <Route path="/" element={<Land />} />
            <Route path="/helios" element={<Helios key="helios" />} />
            <Route element={<Land />} />
          </Routes>
        </PlaceableOverlay>
      </div>
      <div className="absolute z-20">
        <Hud />
      </div>
    </>
  );
};
