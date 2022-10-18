import React, { useState } from "react";

import mine from "assets/resources/mine.png";
import pickaxe from "assets/tools/stone_pickaxe.png";
import close from "assets/icons/close.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const Mine: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
      >
        <img
          src={mine}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            left: `${PIXEL_SCALE * 1}px`,
            top: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1 absolute right-4 top-4"
            onClick={() => setShowModal(false)}
          />
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg">You found a rare mine!</p>
            <img src={pickaxe} className="w-1/4 mt-2" />
            <p className="text-sm text-center mt-2">
              {`Advanced mining on it's way.`}
            </p>
            <p className="mt-2">Coming soon...</p>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
