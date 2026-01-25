import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router";

export const PetHouse: React.FC = () => {
  const navigate = useNavigate();

  const handlePetHouseClick = () => navigate("/pet-house");

  return (
    <BuildingImageWrapper name="PetHouse">
      <img
        src={SUNNYSIDE.building.petHouse}
        className="absolute cursor-pointer hover:brightness-110 transition-all"
        style={{
          width: `${PIXEL_SCALE * 49}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        onClick={handlePetHouseClick}
      />
    </BuildingImageWrapper>
  );
};
