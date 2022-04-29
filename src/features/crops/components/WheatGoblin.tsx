import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import goblin from "assets/npcs/wheat_goblin.gif";
import goblinHead from "assets/npcs/goblin_head.png";
import radishPie from "assets/nfts/radish_pie.png";
import questionMark from "assets/icons/expression_confused.png";
import heart from "assets/icons/heart.png";
import close from "assets/icons/close.png";

export const WheatGoblin: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <>
      <div
        className="absolute z-10"
        style={{
          right: `${GRID_WIDTH_PX * 30}px`,
          top: `${GRID_WIDTH_PX * 30}px`,
          width: `${GRID_WIDTH_PX}px`,
        }}
      >
        {!state.inventory["Radish Pie"] ? (
          <>
            {" "}
            <img
              src={questionMark}
              className="absolute z-10 animate-float w-3 -top-8 left-4"
            />
            <img
              src={goblin}
              className="z-10 w-full hover:img-highlight cursor-pointer"
              onClick={() => setShowModal(true)}
              style={{
                width: `${GRID_WIDTH_PX * 1}px`,
                transform: "scaleX(-1)",
              }}
            />
          </>
        ) : (
          <>
            <img
              src={heart}
              className="absolute z-10 animate-float w-3 -top-6 left-4"
            />
            <img
              src={goblin}
              className="z-10 w-full"
              style={{
                width: `${GRID_WIDTH_PX * 1}px`,
                transform: "scaleX(-1)",
              }}
            />
            <img
              src={radishPie}
              className="absolute "
              style={{
                width: `${GRID_WIDTH_PX * 0.7}px`,
                left: `-${GRID_WIDTH_PX * 0.86}px`,
                bottom: `${GRID_WIDTH_PX * 0.42}px`,
              }}
            />
          </>
        )}
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={() => setShowModal(false)}
          />
          <div className="flex items-start">
            <img src={goblinHead} className="w-16 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">Goblin Farmer</span>
              <span className="text-shadow block mt-4">
                Do you want to know the secret to growing wheat? Perhaps a
                radish pie will refresh my memory
              </span>
              <img
                src={radishPie}
                className="w-8 img-highlight float-right mr-1 mb-1"
              />
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
