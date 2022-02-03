import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Hud } from "features/hud/Hud";
import { Crops } from "features/crops/Crops";
import { Blacksmith } from "features/blacksmith/Blacksmith";
import { Mail } from "features/mail/Mail";
import { Water } from "features/water/Water";

import { Context } from "./GameProvider";
import { Panel } from "components/ui/Panel";
import { ToastManager } from "./toast/ToastManager";

import { GameError } from "./components/GameError";
import { Decorations } from "./components/Decorations";
import { Animals } from "features/animals/Animals";

export const Game: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      <ToastManager />
      <Modal show={gameState.matches("loading")} centered>
        <Panel>Loading...</Panel>
      </Modal>
      <Modal show={gameState.matches("error")} centered>
        <Panel>
          <GameError />
        </Panel>
      </Modal>
      <Hud />

      <Blacksmith />
      <Mail />
      <Crops />
      <Water />
      <Animals />
      <Decorations />
    </>
  );
};
