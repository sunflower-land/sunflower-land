import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import world from "assets/icons/world.png";
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
        <style>
          {`
              .active-button:active {
                #round-button {
                  display: none;
                }

                #world-icon {
                  transform: translateY(2px);
                }
              }
            `}
        </style>
        <div
          id="deliveries"
          className="flex relative z-50 justify-center cursor-pointer hover:img-highlight active-button"
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
            id="round-button"
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={world}
            id="world-icon"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 5}px`,
              top: `${PIXEL_SCALE * 4}px`,
            }}
            className="absolute"
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
