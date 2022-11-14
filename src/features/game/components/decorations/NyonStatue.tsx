import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "../../lib/constants";
import { Panel } from "components/ui/Panel";

import close from "assets/icons/close.png";
import nyonStatue from "assets/sfts/nyon_statue.png";

// Only show 1 Nyon statue at a time
export const NyonStatue: React.FC = () => {
  const [showNyonLore, setShowNyonLore] = useState(false);

  return (
    <>
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.8}px`,
        }}
        className="hover:img-highlight cursor-pointer"
        src={nyonStatue}
        alt="Nyon Statue"
        onClick={() => setShowNyonLore(true)}
      />
      <Modal centered show={showNyonLore} onHide={() => setShowNyonLore(false)}>
        <Panel>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={() => setShowNyonLore(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="flex flex-col items-cetner justify-content-between">
            <div className="flex justify-content m-2">
              <img
                style={{
                  width: `${GRID_WIDTH_PX * 1.5}px`,
                }}
                className="img-highlight mr-2"
                src={nyonStatue}
                alt="Nyon Statue"
              />
              <div className="ml-2 mt-3">
                <span className="text-shadow text-xs block">In memory of</span>
                <span className="text-shadow block">Nyon Lann</span>
              </div>
            </div>
            <div className="flex-1 ml-2 mr-2">
              <span className="text-shadow block mb-2 text-xs">
                The legendary knight responsible for clearing the goblins from
                the mines. Shortly after his victory he died by poisoning from a
                Goblin conspirator. The Sunflower Citizens erected this statue
                with his armor to commemorate his conquests.
              </span>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
