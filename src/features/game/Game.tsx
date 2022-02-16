import React, { useContext, useEffect, useLayoutEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Hud } from "features/hud/Hud";
import { Crops } from "features/crops/Crops";
import { Blacksmith } from "features/blacksmith/Blacksmith";
import { Mail } from "features/mail/Mail";
import { Water } from "features/water/Water";
import { Loading } from "features/auth/components";
import { Animals } from "features/animals/Animals";
import { WishingWell } from "features/wishingWell/WishingWell";

import { useInterval } from "lib/utils/useInterval";

import { Context } from "./GameProvider";
import { Panel } from "components/ui/Panel";
import { ToastManager } from "./toast/ToastManager";

import { GameError } from "./components/GameError";
import { Decorations } from "./components/Decorations";
import { Minting } from "./components/Minting";
import { Success } from "./components/Success";
import { Syncing } from "./components/Syncing";
import { Withdrawing } from "./components/Withdrawing";
import { Quarry } from "features/quarry/Quarry";
import { StateValues } from "./lib/gameMachine";

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
};

export const Game: React.FC = () => {
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

  return (
    <>
      <ToastManager />

      <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
        <Panel className="text-shadow">
          {gameState.matches("loading") && <Loading />}
          {gameState.matches("error") && <GameError />}
          {gameState.matches("minting") && <Minting />}
          {gameState.matches("success") && <Success />}
          {gameState.matches("syncing") && <Syncing />}
          {gameState.matches("withdrawing") && <Withdrawing />}
        </Panel>
      </Modal>

      <Hud />

      <Blacksmith />
      <WishingWell />
      <Mail />
      <Crops />
      <Water />
      <Animals />
      <Decorations />
      <Quarry />
    </>
  );
};
