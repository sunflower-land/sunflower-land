import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

interface Props {
  img: string;
  message: string;
  X: number;
  Y: number;
  scale?: string;
}

export const Npc: React.FC<Props> = ({ img, message, X, Y, scale }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        src={img}
        onClick={() => setShowModal(true)}
        className="absolute cursor-pointer hover:img-highlight z-10"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          right: `${GRID_WIDTH_PX * -X}px`,
          top: `${GRID_WIDTH_PX * Y}px`,
          transform: scale,
        }}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex items-start">
            <span className="text-shadow block">{message}</span>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
