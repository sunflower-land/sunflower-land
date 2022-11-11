import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "../../lib/constants";
import { Inventory } from "../../types/game";
import { Panel } from "components/ui/Panel";

import close from "assets/icons/close.png";
import tunnelMole from "assets/sfts/tunnel_mole.gif";
import rockyMole from "assets/sfts/rocky_mole.gif";
import nugget from "assets/sfts/nugget.gif";

export const Moles: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const [showModal, setShowModal] = useState(false);

  if (inventory["Nugget"]) {
    return (
      <>
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.2}px`,
          }}
          src={nugget}
          alt="Nugget"
          className="hover:img-highlight cursor-pointer"
          onClick={() => setShowModal(true)}
        />
        <Modal centered show={showModal} onHide={() => setShowModal(false)}>
          <Panel>
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              onClick={() => setShowModal(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <div className="flex flex-col items-center justify-center m-2">
              <img src={nugget} alt="Nugget" className="w-1/3" />
              <span className="text-sm mt-2 block text-center">
                One day my father ate 300 Pumpkins. Afterwards, he had so much
                energy that he dug an entire valley!
              </span>
            </div>
          </Panel>
        </Modal>
      </>
    );
  }

  if (inventory["Rocky the Mole"]) {
    return (
      <>
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.2}px`,
          }}
          src={rockyMole}
          alt="Rocky the Mole"
          className="hover:img-highlight cursor-pointer"
          onClick={() => setShowModal(true)}
        />
        <Modal centered show={showModal} onHide={() => setShowModal(false)}>
          <Panel>
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              onClick={() => setShowModal(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <div className="flex flex-col items-center justify-center m-2">
              <img src={rockyMole} alt="Rocky the Mole" className="w-1/3" />
              <span className="text-sm mt-2 block text-center">
                One day my father ate 300 Pumpkins. Afterwards, he had so much
                energy that he dug an entire valley!
              </span>
            </div>
          </Panel>
        </Modal>
      </>
    );
  }

  if (inventory["Tunnel Mole"]) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.2}px`,
          top: `${GRID_WIDTH_PX * 0.15}px`,
        }}
        src={tunnelMole}
        className="absolute"
        alt="Tunnel Mole"
      />
    );
  }

  return null;
};
