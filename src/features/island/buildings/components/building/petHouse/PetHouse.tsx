import React, { useContext } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router";
import { useVisiting } from "lib/utils/visitUtils";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { PET_HOUSE_VARIANTS } from "features/island/lib/alternateArt";

const _farmId = (state: MachineState) => state.context.farmId;
const _petHouseLevel = (state: MachineState) =>
  state.context.state.petHouse.level ?? 1;

export const PetHouse: React.FC = () => {
  const navigate = useNavigate();
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const { isVisiting: visiting } = useVisiting();
  const level = useSelector(gameService, _petHouseLevel);

  const handlePetHouseClick = () => {
    if (visiting) {
      const targetPath = `/visit/${farmId}/pet-house`;
      navigate(targetPath);
    } else {
      navigate("/pet-house");
    }
  };

  return (
    <div className="absolute h-full w-full">
      <BuildingImageWrapper name="PetHouse" onClick={handlePetHouseClick}>
        <img
          src={PET_HOUSE_VARIANTS[level]}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 49}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>
    </div>
  );
};
