import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { PetHouseModal } from "./PetHouseModal";

export const PetHouse: React.FC = () => {
  const [showPetHouseModal, setShowPetHouseModal] = useState(false);

  const handlePetHouseClick = () => setShowPetHouseModal(true);

  return (
    <>
      <BuildingImageWrapper name="PetHouse">
        <img
          src={SUNNYSIDE.building.tent}
          className="absolute cursor-pointer hover:brightness-110 transition-all"
          style={{
            width: `${PIXEL_SCALE * 46}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          onClick={handlePetHouseClick}
        />
      </BuildingImageWrapper>

      <PetHouseModal
        show={showPetHouseModal}
        onClose={() => setShowPetHouseModal(false)}
      />
    </>
  );
};
