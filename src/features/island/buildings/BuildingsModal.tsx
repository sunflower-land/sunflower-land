import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ModalContent } from "./components/ui/ModalContent";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Tutorial } from "./Tutorial";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BuildingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("BuildingMenu")
  );

  const acknowledge = () => {
    acknowledgeTutorial("BuildingMenu");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <Modal centered show={isOpen} onClose={acknowledge}>
        <Tutorial onClose={acknowledge} />
      </Modal>
    );
  }

  return (
    <Modal centered show={isOpen} onHide={onClose}>
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
            onClick={onClose}
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
          <ModalContent closeModal={onClose} />
        </div>
      </Panel>
    </Modal>
  );
};
