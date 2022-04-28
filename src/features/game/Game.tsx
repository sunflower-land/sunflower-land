import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Hud } from "features/farming/hud/Hud";
import { Crops } from "features/farming/crops/Crops";
import { Water } from "features/farming/water/Water";
import { Loading } from "features/auth/components";
import { Animals } from "features/farming/animals/Animals";

import { useInterval } from "lib/utils/hooks/useInterval";

import { Context } from "./GameProvider";
import { Panel } from "components/ui/Panel";
import { ToastManager } from "./toast/ToastManager";
import { Decorations } from "./components/Decorations";
import { Minting } from "./components/Minting";
import { Success } from "./components/Success";
import { Syncing } from "./components/Syncing";
import { Withdrawing } from "./components/Withdrawing";
import { Blacklisted } from "./components/Blacklisted";

import { Quarry } from "features/farming/quarry/Quarry";
import { TeamDonation } from "features/farming/teamDonation/TeamDonation";
import { Forest } from "features/farming/forest/Forest";

import { StateValues } from "./lib/gameMachine";
import { Town } from "features/farming/town/Town";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { House } from "features/farming/house/House";
import { Tailor } from "features/goblins/tailor/Tailor";
import { Lore } from "./components/Lore";
import { ClockIssue } from "./components/ClockIssue";
import { screenTracker } from "lib/utils/screen";
import { Withdrawn } from "./components/Withdrawn";
import { Resetting } from "features/auth/components/Resetting";

const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  readonly: false,
  autosaving: false,
  minting: true,
  syncing: true,
  synced: true,
  withdrawing: true,
  withdrawn: true,
  error: true,
  blacklisted: true,
  levelling: false,
  resetting: true,
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

  useEffect(() => {
    const save = () => {
      send("SAVE");
    };

    window.addEventListener("blur", save);

    screenTracker.start();

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
          {gameState.matches("blacklisted") && <Blacklisted />}
          {gameState.matches("synced") && <Success />}
          {gameState.matches("syncing") && <Syncing />}
          {/* {gameState.matches("withdrawn") && <Withdrawn />} */}
        </Panel>
      </Modal>

      <ClockIssue show={gameState.context.offset > 0} />
      {/*     */}
      <Hud />
      <TeamDonation />
      <Crops />
      <Water />
      <Animals />
      <Decorations />
      <Forest />
      <Quarry />
      <Town />
      <House />
      <Lore />
    </>
  );
};
