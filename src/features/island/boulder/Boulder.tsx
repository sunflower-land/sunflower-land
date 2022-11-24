import React, { useState } from "react";

import mine from "assets/resources/rare_mine.png";
import pickaxe from "assets/tools/stone_pickaxe.png";
import close from "assets/icons/close.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const Boulder: React.FC = () => {
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
            width: `${PIXEL_SCALE * 26}px`,
            left: `${PIXEL_SCALE * 3}px`,
            top: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
