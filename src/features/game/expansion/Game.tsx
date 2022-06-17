import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Loading } from "features/auth/components";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { screenTracker } from "lib/utils/screen";
import { Resetting } from "features/auth/components/Resetting";
import { Context } from "../GameProvider";
import { StateValues } from "../lib/gameMachine";
import { ToastManager } from "../toast/ToastManager";
import { Panel } from "components/ui/Panel";
import { Success } from "../components/Success";
import { Syncing } from "../components/Syncing";
import { Land } from "./Land";
import { Hud } from "features/farming/hud/Hud";

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
  announcing: true,
};

// FOR TESTING
const land: Land = {
  level: 1,
  resources: {
    Tree: {
      0: {
        x: 1,
        y: 4,
        height: 3,
        width: 2,
      },
    },
    Bush: {
      0: {
        x: -3,
        y: 3,
        height: 2,
        width: 2,
      },
    },
    Stone: {
      0: {
        x: 1,
        y: -1,
        height: 1,
        width: 1,
      },
      1: {
        x: -2,
        y: 0,
        height: 1,
        width: 1,
      },
    },
  },
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

      <Land resources={land.resources} level={land.level} />
      <Hud />
    </>
  );
};
