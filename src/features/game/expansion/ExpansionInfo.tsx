import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import cloudGazer from "assets/npcs/cloud-gazer.gif";
import questionMark from "assets/icons/expression_confused.png";
import close from "assets/icons/close.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

export const ExpansionInfo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        height: `${GRID_WIDTH_PX * 2.2}px`,
        right: `calc(50% - ${GRID_WIDTH_PX * 36.7}px)`,
        bottom: `calc(50% - ${GRID_WIDTH_PX * 40.4}px)`,
      }}
      className="absolute"
    >
      <div className="relative h-full">
        <img
          src={questionMark}
          className="absolute w-3 left-[50%] z-10 animate-float"
        />
        <div
          style={{ borderRadius: "50%" }}
          className="absolute h-3 w-8 bg-black opacity-20 bottom-1 left-[39%]"
        />
        <img
          src={cloudGazer}
          onClick={() => setShowModal(true)}
          className="absolute w-20 bottom-0 left-1/2 -translate-x-1/2 cursor-pointer hover:img-highlight drop-shadow-md"
        />
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={() => setShowModal(false)}
          />
          <div className="flex items-start">
            <img src={questionMark} className="h-10 img-highlight mr-3" />
            <div className="flex-1">
              <span className="text-shadow block">
                {`I can't see anything through these thick clouds!`}
              </span>
              <span className="text-shadow block mt-4">
                I wonder if I will ever get to see what lies beneath them all?
              </span>
            </div>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
