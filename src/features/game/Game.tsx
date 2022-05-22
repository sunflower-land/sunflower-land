import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Hud } from "features/farming/hud/Hud";
import { Crops } from "features/farming/crops/Crops";
import { Water } from "features/farming/water/Water";
import { Loading } from "features/auth/components";
import { Animals } from "features/farming/animals/Animals";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { Context } from "./GameProvider";
import { Panel } from "components/ui/Panel";
import { ToastManager } from "./toast/ToastManager";
import { Decorations } from "./components/Decorations";
import { Success } from "./components/Success";
import { Syncing } from "./components/Syncing";

import { Quarry } from "features/farming/quarry/Quarry";
import { TeamDonation } from "features/farming/teamDonation/TeamDonation";
import { Forest } from "features/farming/forest/Forest";

import { StateValues } from "./lib/gameMachine";
import { Town } from "features/farming/town/Town";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { House } from "features/farming/house/House";
import { Lore } from "./components/Lore";
import { ClockIssue } from "./components/ClockIssue";
import { screenTracker } from "lib/utils/screen";
import { Resetting } from "features/auth/components/Resetting";
import { GoblinShovel } from "features/farming/crops/components/GoblinShovel";

const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  autosaving: false,
  syncing: true,
  synced: true,
  error: true,
  levelling: false,
  resetting: true,
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

  return (
    <>
      <ToastManager />

      <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
        <Panel className="text-shadow">
          {gameState.matches("loading") && <Loading />}
          {gameState.matches("resetting") && <Resetting />}
          {gameState.matches("error") && (
            <ErrorMessage
              errorCode={gameState.context.errorCode as ErrorCode}
            />
          )}
          {gameState.matches("synced") && <Success />}
          {gameState.matches("syncing") && <Syncing />}
        </Panel>
      </Modal>

      <ClockIssue show={gameState.context.offset > 0} />
      <Hud />
      <TeamDonation />
      <Crops />
      <Water />
      <Animals />
      <Decorations state={gameState.context.state} />
      <Forest />
      <Quarry />
      <Town />
      <House
        state={gameState.context.state}
        playerCanLevelUp={gameState.matches("levelling")}
        isFarming
      />
      <Lore />
      <GoblinShovel />
    </>
  );
};
