import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";

import frog from "assets/animals/frog.png";
import frogMp3 from "../../../assets/sound-effects/frog.mp3";

export const Frog: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const open = () => {
    const frogAudio = new Audio(frogMp3);
    frogAudio.volume = 0.2;

    frogAudio.play();
    setShowModal(true);
  };

  return (
    <>
      <img
        src={frog}
        className="absolute hover:img-highlight cursor-pointer"
        onClick={() => open()}
        style={{
          width: `${GRID_WIDTH_PX * 0.7}px`,
          right: `${GRID_WIDTH_PX * 5.1}px`,
          top: `${GRID_WIDTH_PX * 3.5}px`,
        }}
      />
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex items-start">
            <img src={frog} className="w-12 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow block">Lilly the Frog</span>
              <span className="text-shadow block mt-4">Ribbbbbit!</span>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
