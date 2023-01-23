import React, { useState } from "react";
import pirate from "assets/npcs/pirate_goblin.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const Pirate: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 19}px`,
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: "0px",
            bottom: "0px",
          }}
        />
        <img
          src={pirate}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 19}px`,
            left: `${PIXEL_SCALE * -3}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
        />
      </div>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          title="Ahoy maties!"
          onClose={() => setShowModal(false)}
        >
          <div className="p-2">
            <p className="mb-4 text-sm">
              Are you ready to visit Treasure Island?
            </p>
            <p className="text-sm">
              This island is almost ready. Gather your resources and prepare for
              a swashbuckling adventure of a lifetime!
            </p>
            <a
              className="underline hover:text-blue-500 text-xxs"
              href="https://docs.sunflower-land.com/player-guides/islands/treasure-island"
              target="_blank"
              rel="noreferrer"
            >
              Read more
            </a>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
