import React, { useState } from "react";

import well from "assets/buildings/well1.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

const NonFertilePlotComponent = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="w-full h-full relative cursor-pointer hover:img-highlight">
        <img
          src={SUNNYSIDE.soil.soil_dry}
          alt="soil image"
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 2}px`,
            width: `${PIXEL_SCALE * 16}px`,
          }}
          onClick={() => setShowModal(true)}
        />
      </div>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          title="These crops need water!"
          onClose={() => setShowModal(false)}
        >
          <div className="p-2">
            In order to support more crops, build a well.
            <img
              src={well}
              alt="well"
              width={PIXEL_SCALE * 25}
              className="mx-auto mt-4 mb-2"
            />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

export const NonFertilePlot = React.memo(NonFertilePlotComponent);
