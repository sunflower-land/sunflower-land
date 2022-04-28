import React from "react";

import { Modal } from "react-bootstrap";
import { HowToModalHeader } from "features/farming/hud/components/howToPlay/HowToModalHeader";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

export const LetsGo: React.FC<Props> = ({ onClose, onBack }) => {
  return (
    <>
      <HowToModalHeader
        title="Time to play!"
        onClose={onClose}
        onBack={onBack}
      />
      <Modal.Body>
        <p className="text-xs p-2 sm:text-sm text-center">
          Thanks for playing beta! We are still working on the game and
          appreciate your support during the early stages!
        </p>

        <p className="text-xs p-2 sm:text-sm text-center">
          You can read more about the game in the{" "}
          <a
            className="text-xs sm:text-sm underline"
            href="https://docs.sunflower-land.com"
            target="_blank"
            rel="noreferrer"
          >
            official docs.
          </a>
        </p>
      </Modal.Body>
    </>
  );
};
