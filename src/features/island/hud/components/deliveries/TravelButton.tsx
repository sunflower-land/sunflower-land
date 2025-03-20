import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { WorldMap } from "./WorldMap";
import { RoundButton } from "components/ui/RoundButton";
import { SUNNYSIDE } from "assets/sunnyside";

export const Travel: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <RoundButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowModal(true);
        }}
      >
        <img
          src={SUNNYSIDE.icons.worldIcon}
          id="world-icon"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            left: `${PIXEL_SCALE * 5}px`,
            top: `${PIXEL_SCALE * 4}px`,
          }}
          className="absolute group-active:translate-y-[2px]"
        />
      </RoundButton>
      <Modal show={showModal} dialogClassName="md:max-w-3xl" onHide={onClose}>
        <WorldMap onClose={onClose} />
      </Modal>
    </>
  );
};

export const TravelButton = React.memo(Travel);
