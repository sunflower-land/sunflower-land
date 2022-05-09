import React, { useState } from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import humanIdle from "assets/npcs/idle.gif";
import humanSign from "assets/buildings/human_sign.png";
import arrowLeft from "assets/icons/arrow_left.png";
import { TownEntryModal } from "./TownEntryModal";
import { Modal } from "react-bootstrap";

export const TownEntry: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: `${GRID_WIDTH_PX * 0}px`,
        width: `${GRID_WIDTH_PX * 4}px`,
        height: `${GRID_WIDTH_PX * 5}px`,
        top: `${GRID_WIDTH_PX * 8}px`,
      }}
    >
      <img
        src={arrowLeft}
        className="absolute pointing "
        style={{
          width: `${GRID_WIDTH_PX * 0.7}px`,
          right: `${GRID_WIDTH_PX * 2.7}px`,
          top: `${GRID_WIDTH_PX * 0.21}px`,
        }}
      />
      <img
        src={humanSign}
        className="absolute hover:img-highlight cursor-pointer"
        style={{
          width: `${GRID_WIDTH_PX * 1.5}px`,
          right: `${GRID_WIDTH_PX * 1}px`,
        }}
        onClick={() => setShowModal(true)}
      />

      <img
        src={humanIdle}
        className="absolute hover:img-highlight cursor-pointer"
        style={{
          width: `${GRID_WIDTH_PX * 0.8}px`,
          left: `${GRID_WIDTH_PX * 3}px`,
          top: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        onClick={() => setShowModal(true)}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <TownEntryModal onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};
