import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import apicultor from "assets/npcs/apicultor.gif";
import questionMark from "assets/icons/expression_confused.png";
import Bee from "assets/animals/bee.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

export const Apicultor: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        src={questionMark}
        className="absolute z-10 animate-float"
        style={{
          width: `${GRID_WIDTH_PX * 0.3}px`,
          right: `${GRID_WIDTH_PX * -0.65}px`,

          top: `${GRID_WIDTH_PX * 0.1}px`,
        }}
      />
      <img
        src={apicultor}
        onClick={() => setShowModal(true)}
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${GRID_WIDTH_PX * 1}px`,
          right: `${GRID_WIDTH_PX * -1}px`,
          top: `${GRID_WIDTH_PX * 0.9}px`,
        }}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex items-start">
            <img src={Bee} className="w-12 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">
                So many different scents and colors...
              </span>
              <span className="text-shadow block mt-4">
                Honey from these flowers should taste amazing!
              </span>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
