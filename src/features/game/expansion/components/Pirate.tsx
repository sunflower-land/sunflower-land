import React, { useState } from "react";
import pirate from "assets/npcs/pirate_goblin.gif";
import shadow from "assets/npcs/shadow.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const Pirate: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="absolute"
      style={{
        left: `${GRID_WIDTH_PX * 2}px`,
        top: `${GRID_WIDTH_PX * 2}px`,
        width: `${PIXEL_SCALE * 19}px`,
      }}
    >
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="p-1">
            <p className="mb-2">Ahoy maties!</p>
            <p className="mb-2 text-sm">
              Are you ready to visit Treasure Island?
            </p>
            <p className="text-sm">
              This island is almost ready. Gather your resources and prepare for
              a swashbuckling adventure of a lifetime!
            </p>
            <a
              className="underline hover:text-white text-xxs"
              href="https://docs.sunflower-land.com/player-guides/islands/treasure-island"
              target="_blank"
              rel="noreferrer"
            >
              Read more
            </a>
          </div>
        </CloseButtonPanel>
      </Modal>
      <img
        className="z-10 cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
        src={pirate}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
        }}
      />
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          left: `${PIXEL_SCALE * 2.5}px`,
          bottom: `${PIXEL_SCALE * -2}px`,
        }}
      />
    </div>
  );
};
