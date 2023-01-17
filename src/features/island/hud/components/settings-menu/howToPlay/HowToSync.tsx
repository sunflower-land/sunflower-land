import React from "react";

import { Modal } from "react-bootstrap";

import { HowToModalHeader } from "features/island/hud/components/settings-menu/howToPlay/HowToModalHeader";
import { SUNNYSIDE } from "assets/sunnyside";

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
            <img src={SUNNYSIDE.icons.timer} className="w-4" />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
