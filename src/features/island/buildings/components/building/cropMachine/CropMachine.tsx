import React, { useState } from "react";

import { CropMachineModal } from "./CropMachineModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const CropMachine: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const image = ITEM_DETAILS["Crop Machine"].image;

  return (
    <>
      <BuildingImageWrapper name="Crop Machine" onClick={handleClick}>
        <div
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 80}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        >
          <img
            src={image}
            className="w-full absolute"
            style={{
              width: `${PIXEL_SCALE * 80}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
            }}
          />
        </div>
      </BuildingImageWrapper>

      <CropMachineModal setShowModal={setShowModal} showModal={showModal} />
    </>
  );
};
