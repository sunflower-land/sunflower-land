import React, { useState } from "react";
import sunflower from "assets/decorations/helios_sunflower.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const HeliosSunflower: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="z-10 absolute cursor-pointer hover:img-highlight"
        // TODO some sort of coordinate system
        style={{
          right: `${GRID_WIDTH_PX * 17.9}px`,
          top: `${GRID_WIDTH_PX * 8.2}px`,
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src={sunflower}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
      </div>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Panel>
          <p>Clytie the Sunflower</p>
          <p className="mt-2">
            Only the true saviour can return and harvest this Sunflower.
          </p>
        </Panel>
      </Modal>
    </>
  );
};
