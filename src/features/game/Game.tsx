import React, { useContext, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Hud } from "features/hud/Hud";
import { Crops } from "features/crops/Crops";
import { Water } from "features/water/Water";
import { Loading } from "features/auth/components";
import { Animals } from "features/animals/Animals";

import { useInterval } from "lib/utils/hooks/useInterval";

import { Context } from "./GameProvider";
import { Panel } from "components/ui/Panel";
import { Captcha } from "./components/Captcha";
import { ToastManager } from "./toast/ToastManager";
import { Decorations } from "./components/Decorations";
import { Minting } from "./components/Minting";
import { Success } from "./components/Success";
import { Syncing } from "./components/Syncing";
import { Withdrawing } from "./components/Withdrawing";
import { Blacklisted } from "./components/Blacklisted";
import { Offline } from "./components/Offline";

import { Quarry } from "features/quarry/Quarry";
import { TeamDonation } from "features/teamDonation/TeamDonation";
import { Forest } from "features/forest/Forest";

import { StateValues } from "./lib/gameMachine";
import { Town } from "features/town/Town";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";

const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  readonly: false,
  autosaving: false,
  minting: true,
  success: true,
  syncing: true,
  withdrawing: true,
  error: true,
  captcha: false,
  blacklisted: true,
};

export const Game: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  useInterval(() => send("SAVE"), AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const handleNavigatorOnline = () => {
      setIsOffline(false);
      console.log("Online :)");
    };
    const handleNavigatorOffline = () => {
      setIsOffline(true);
      console.log("Offline :(");
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (gameState.context.actions.length === 0) return;

      event.preventDefault();
      event.returnValue = "";
    };

    const save = () => {
      send("SAVE");
    };

    window.addEventListener("online", handleNavigatorOnline);
    window.addEventListener("offline", handleNavigatorOffline);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", save);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("online", handleNavigatorOnline);
      window.removeEventListener("offline", handleNavigatorOffline);

      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", save);
    };
  }, [gameState]);

  return (
    <>
      <ToastManager />
      <Captcha />

      <Modal show={isOffline} centered>
        <Panel className="text-shadow">
          <Offline />
        </Panel>
      </Modal>

      {!isOffline && (
        <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
          <Panel className="text-shadow">
            {gameState.matches("loading") && <Loading />}
            {gameState.matches("error") && (
              <ErrorMessage
                errorCode={gameState.context.errorCode as ErrorCode}
              />
            )}
            {gameState.matches("blacklisted") && <Blacklisted />}
            {gameState.matches("minting") && <Minting />}
            {gameState.matches("success") && <Success />}
            {gameState.matches("syncing") && <Syncing />}
            {gameState.matches("withdrawing") && <Withdrawing />}
          </Panel>
        </Modal>
      )}

      <Hud />
      <TeamDonation />
      <Crops />
      <Water />
      <Animals />
      <Decorations />
      <Forest />
      <Quarry />
      <Town />
    </>
  );
};
