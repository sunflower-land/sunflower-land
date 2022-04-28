import React from "react";

import { Modal } from "react-bootstrap";

import timer from "assets/icons/timer.png";
import { HowToModalHeader } from "features/farming/hud/components/howToPlay/HowToModalHeader";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

export const HowToSync: React.FC<Props> = ({ onClose, onBack }) => {
  return (
    <>
      <HowToModalHeader
        title="How to sync?"
        onClose={onClose}
        onBack={onBack}
      />
      <Modal.Body>
        <p className="text-xs p-2 sm:text-sm text-center">
          All of your progress is saved on our game server. You will need to
          sync on chain when you want to move your tokens, NFTs and resources
          onto Polygon.
        </p>

        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">1. Open the menu</p>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">{`2. Click "Sync on chain"`}</p>
          <div className="relative">
            <img src={timer} className="w-4" />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
