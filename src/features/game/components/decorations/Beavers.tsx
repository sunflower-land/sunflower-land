import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX } from "../../lib/constants";
import { Inventory } from "../../types/game";
import { Panel } from "components/ui/Panel";

import close from "assets/icons/close.png";
import beaver from "assets/nfts/beaver.gif";
import apprentice from "assets/nfts/apprentice_beaver.gif";
import foreman from "assets/nfts/construction_beaver.gif";

export const Beavers: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const [showModal, setShowModal] = useState(false);
  if (inventory["Foreman Beaver"]) {
    return (
      <>
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.2}px`,
          }}
          className="hover:img-highlight cursor-pointer"
          src={foreman}
          alt="Foreman Beaver"
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
              <img src={foreman} alt="Foreman Beaver" className="w-1/3" />
              <span className="text-shadow mt-2 block text-center">
                Have you got any radishes?
              </span>
            </div>
          </Panel>
        </Modal>
      </>
    );
  }

  if (inventory["Apprentice Beaver"]) {
    return (
      <>
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.2}px`,
          }}
          src={apprentice}
          alt="Apprentice Beaver"
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
              <img src={apprentice} alt="Apprentice Beaver" className="w-1/3" />
              <span className="text-shadow mt-2 block text-center">
                Have you got any radishes?
              </span>
            </div>
          </Panel>
        </Modal>
      </>
    );
  }

  if (inventory["Woody the Beaver"]) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        src={beaver}
        alt="Woody the Beaver"
      />
    );
  }

  return null;
};
