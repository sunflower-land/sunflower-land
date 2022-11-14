import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import frog from "assets/animals/frog.png";
import close from "assets/icons/close.png";
import { frogAudio } from "lib/utils/sfx";

export const Frog: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const open = () => {
    setShowModal(true);
    //Checks if frogAudio is playing, if false, plays the sound
    if (!frogAudio.playing()) {
      frogAudio.play();
    }
  };

  return (
    <>
      <img
        src={frog}
        className="absolute hover:img-highlight cursor-pointer z-10"
        onClick={open}
        style={{
          width: `${GRID_WIDTH_PX * 0.7}px`,
          right: `${GRID_WIDTH_PX * 5.1}px`,
          top: `${GRID_WIDTH_PX * 3.5}px`,
        }}
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
          <div className="flex items-start">
            <img src={frog} className="w-12 img-highlight mr-2" />
            <div className="flex-1">
              <span className="block">Lilly the Frog</span>
              <span className="block mt-4">Ribbbbbit!</span>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
