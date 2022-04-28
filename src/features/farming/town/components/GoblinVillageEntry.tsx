import React, { useState } from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import goblinCarry from "assets/npcs/goblin_carry.gif";
import goblinSign from "assets/buildings/goblin_sign.png";
import arrowRight from "assets/icons/arrow_right.png";
import { GoblinVillageModal } from "./GoblinVillageModal";
import { Modal } from "react-bootstrap";

export const GoblinVillageEntry: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        right: `${GRID_WIDTH_PX * 0}px`,
        width: `${GRID_WIDTH_PX * 4}px`,
        height: `${GRID_WIDTH_PX * 5}px`,
        top: `${GRID_WIDTH_PX * 3}px`,
      }}
    >
      <img
        src={goblinCarry}
        className="running hover:img-highlight cursor-pointer"
        style={{
          width: `${GRID_WIDTH_PX * 1}px`,
          right: `${GRID_WIDTH_PX * 2}px`,
        }}
        onClick={() => setShowModal(true)}
      />
      <img
        src={goblinSign}
        className="absolute hover:img-highlight cursor-pointer"
        style={{
          width: `${GRID_WIDTH_PX * 1.5}px`,
          right: `${GRID_WIDTH_PX * 2}px`,
        }}
        onClick={() => setShowModal(true)}
      />
      <img
        src={arrowRight}
        className="absolute pointing "
        style={{
          width: `${GRID_WIDTH_PX * 0.7}px`,
          right: `${GRID_WIDTH_PX * 1.4}px`,
          top: `${GRID_WIDTH_PX * 1.8}px`,
        }}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <GoblinVillageModal />
      </Modal>
    </div>
  );
};
