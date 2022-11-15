import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";

import arrowLeft from "assets/icons/arrow_left.png";
import { OuterPanel } from "components/ui/Panel";
import { TownEntryModal } from "features/goblins/components/TownEntryModal";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BackButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="fixed top-2 left-2 z-50">
        <OuterPanel>
          <div className="flex justify-center p-1">
            <Button
              className="bg-brown-200 active:bg-brown-200 w-full"
              onClick={() => setShowModal(true)}
            >
              <img
                src={arrowLeft}
                alt="back-arrow"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  margin: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <span
                className="hidden md:flex"
                style={{
                  marginLeft: `${PIXEL_SCALE * 3}px`,
                }}
              >
                Back
              </span>
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
