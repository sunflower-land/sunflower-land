import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { WorldMap } from "./WorldMap";

export const Travel: React.FC<{ isVisiting?: boolean }> = ({
  isVisiting = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="relative">
        <div
          id="deliveries"
          className="flex relative z-50 justify-center cursor-pointer hover:img-highlight group"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 23}px`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button_pressed}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute group-active:hidden"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
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
        </div>
      </div>

      <Modal show={showModal} dialogClassName="md:max-w-3xl" onHide={onClose}>
        <WorldMap onClose={onClose} />
      </Modal>
    </>
  );
};

export const TravelButton = React.memo(Travel);
