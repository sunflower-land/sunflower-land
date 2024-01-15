import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { FlowerBedModal } from "./FlowerBedModal";

export const FlowerBed: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={SUNNYSIDE.resource.boulder}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 26}px`,
            left: `${PIXEL_SCALE * 3}px`,
            top: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <FlowerBedModal onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
