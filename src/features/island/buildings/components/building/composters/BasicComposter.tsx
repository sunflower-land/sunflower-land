import React, { useContext, useState } from "react";

import composter from "assets/sfts/aoe/composter.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const BasicComposter: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const feedComposter = () => {
    gameService.send("basicComposter.started");
  };
  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src={composter}
          style={{
            width: `${PIXEL_SCALE * 28}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Basic Composter"
        />
      </div>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Panel className="z-10">
          <Button onClick={feedComposter}>Feed</Button>
        </Panel>
      </Modal>
    </>
  );
};
