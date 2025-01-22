import React, { useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { LavaPitModalContent } from "./LavaPitModalContent";

interface Props {
  id: string;
}

export const LavaPit: React.FC<Props> = ({ id }) => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          id="lavap"
          src={ITEM_DETAILS["Lava Pit"].image}
          width={36 * PIXEL_SCALE}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <LavaPitModalContent onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};
