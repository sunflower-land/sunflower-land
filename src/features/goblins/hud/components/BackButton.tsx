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
          <div className="flex justify-center p-0.5">
            <Button
              className="bg-brown-200 active:bg-brown-200 w-full"
              onClick={() => setShowModal(true)}
            >
              <div
                className="flex items-center mx-1"
                style={{
                  marginBottom: `-4px`,
                }}
              >
                <img
                  src={arrowLeft}
                  alt="back-arrow"
                  style={{
                    width: `${PIXEL_SCALE * 9}px`,
                    margin: `${PIXEL_SCALE * 1}px`,
                  }}
                />
                <span
                  className="hidden md:flex mb-1"
                  style={{
                    marginLeft: `4px`,
                  }}
                >
                  Back
                </span>
              </div>
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
