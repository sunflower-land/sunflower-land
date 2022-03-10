import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import idle from "assets/npcs/idle.gif";
import questionMark from "assets/icons/expression_confused.png";
import axe from "assets/tools/axe.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

export const Lumberjack: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        src={questionMark}
        className="absolute z-10 animate-float"
        style={{
          width: `${GRID_WIDTH_PX * 0.3}px`,
          right: `${GRID_WIDTH_PX * 5}px`,

          top: `${GRID_WIDTH_PX * 2.8}px`,
        }}
      />
      <img
        src={idle}
        onClick={() => setShowModal(true)}
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${GRID_WIDTH_PX * 1}px`,
          right: `${GRID_WIDTH_PX * 4.65}px`,
          top: `${GRID_WIDTH_PX * 3.4}px`,
        }}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex items-start">
            <img src={axe} className="w-12 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">
                Something looks different about these trees...
              </span>
              <span className="text-shadow block mt-4">
                I wonder if I can craft something to chop them down?
              </span>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
