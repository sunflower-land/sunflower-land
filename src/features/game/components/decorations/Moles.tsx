import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX } from "../../lib/constants";
import { Inventory } from "../../types/game";
import { Panel } from "components/ui/Panel";

import close from "assets/icons/close.png";
import tunnelMole from "assets/nfts/tunnel_mole.gif";
import rockyMole from "assets/nfts/rocky_mole.gif";
import nugget from "assets/nfts/nugget.gif";

export const Moles: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const [showModal, setShowModal] = useState(false);

  if (inventory["Nugget"]) {
    return (
      <>
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.52}px`,
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
              className="h-6 top-4 right-4 absolute cursor-pointer"
              onClick={() => setShowModal(false)}
            />
            <div className="flex flex-col items-center justify-center m-2">
              <img src={nugget} alt="Nugget" className="w-1/3" />
              <span className="text-shadow text-sm mt-2 block text-center">
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
            width: `${GRID_WIDTH_PX * 1.52}px`,
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
              className="h-6 top-4 right-4 absolute cursor-pointer"
              onClick={() => setShowModal(false)}
            />
            <div className="flex flex-col items-center justify-center m-2">
              <img src={rockyMole} alt="Rocky the Mole" className="w-1/3" />
              <span className="text-shadow text-sm mt-2 block text-center">
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
          width: `${GRID_WIDTH_PX * 1.52}px`,
        }}
        src={tunnelMole}
        alt="Tunnel Mole"
      />
    );
  }

  return null;
};
