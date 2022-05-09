import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";

import leftArrow from "assets/icons/arrow_left.png";
import { OuterPanel } from "components/ui/Panel";
import { TownEntryModal } from "features/goblins/components/TownEntryModal";

export const BackButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="fixed top-2 left-2 z-50 shadow-lg">
        <OuterPanel>
          <div className="flex justify-center p-1">
            <Button
              className="bg-brown-200 active:bg-brown-200 w-full"
              onClick={() => setShowModal(true)}
            >
              <img className="w-6 md:mr-2" src={leftArrow} alt="back-arrow" />
              <span className="hidden md:flex">Back</span>
            </Button>
          </div>
        </OuterPanel>
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <TownEntryModal onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
