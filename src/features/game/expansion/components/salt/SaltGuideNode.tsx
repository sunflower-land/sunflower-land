import React, { useState } from "react";
import { Modal } from "components/ui/Modal";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import saltNodeEmpty from "assets/buildings/salt/salt_node_empty.webp";
import { SaltGuideModal } from "./SaltGuideModal";

export const SaltGuideNode: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="relative flex h-full w-full items-center justify-center cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img src={saltNodeEmpty} width={PIXEL_SCALE * 18} />
        <img
          src={ITEM_DETAILS["Salt Rake"].image}
          className="absolute object-contain"
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            top: `${PIXEL_SCALE * 3}px`,
            left: `${PIXEL_SCALE * 4}px`,
            transform: "rotate(-18deg)",
          }}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <SaltGuideModal onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
