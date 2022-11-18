import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import roundButton from "assets/ui/button/round_button.png";
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
        className="fixed z-50 cursor-pointer hover:img-highlight"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 51}px`,
          width: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <img
          src={roundButton}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={hammer}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 13}px`,
          }}
        />
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
