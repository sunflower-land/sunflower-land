import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import disc from "assets/icons/disc.png";
import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ModalContent } from "./components/ui/ModalContent";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Buildings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[84px] right-2 z-50 flex flex-col items-end cursor-pointer hover:img-highlight"
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          <img src={disc} className="w-full absolute inset-0" />
          <img src={hammer} className="w-9 mb-1 z-10" />
        </div>
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel className="relative" hasTabs>
          <div
            className="absolute flex"
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
            }}
          >
            <Tab isActive>
              <img src={hammer} className="h-5 mr-2" />
              <span className="text-sm">Buildings</span>
            </Tab>
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              onClick={() => setIsOpen(false)}
              style={{
                top: `${PIXEL_SCALE * 1}px`,
                right: `${PIXEL_SCALE * 1}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>

          <div
            style={{
              minHeight: "200px",
            }}
          >
            <ModalContent closeModal={() => setIsOpen(false)} />
          </div>
        </Panel>
      </Modal>
    </>
  );
};
