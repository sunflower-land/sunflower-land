import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import { Hud } from "features/hud/Hud";
import { Crops } from "features/crops/Crops";
import { Blacksmith } from "features/blacksmith/Blacksmith";
import { Bakery } from "features/bakery/Bakery";
import { Water } from "features/water/Water";

import { Context } from "./GameProvider";
import { useActor } from "@xstate/react";
import { Panel } from "components/ui/Panel";

export const Game: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      <Modal show={gameState.matches("loading")} centered>
        <Panel>Loading...</Panel>
      </Modal>
      <Hud />

      <Blacksmith />
        <Bakery />
      <Crops />
      <Water />
    </>
  );
};
