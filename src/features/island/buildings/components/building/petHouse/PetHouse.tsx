import React, { useContext } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router";
import { useVisiting } from "lib/utils/visitUtils";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { PET_HOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { SUNNYSIDE } from "assets/sunnyside";
import { getHelpRequired } from "features/game/types/monuments";

const _farmId = (state: MachineState) => state.context.farmId;
const _petHouseLevel = (state: MachineState) =>
  state.context.state.petHouse.level ?? 1;

const _game = (state: MachineState) => state.context.state;

export const PetHouse: React.FC = () => {
  const navigate = useNavigate();
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);
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

  const helpRequired = getHelpRequired({ game });
  const petHouseHelpRequired = helpRequired.tasks.petHouse.count;

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
        {visiting && petHouseHelpRequired > 0 && (
          <div className="pointer-events-auto cursor-pointer">
            <div
              className="relative mr-2"
              style={{
                width: `${PIXEL_SCALE * 20}px`,
                top: `${PIXEL_SCALE * -8}px`,
              }}
            >
              <img className="w-full" src={SUNNYSIDE.icons.disc} />
              <img
                className="absolute"
                src={SUNNYSIDE.icons.drag}
                style={{
                  width: `${PIXEL_SCALE * 14}px`,
                  right: `${PIXEL_SCALE * 3}px`,
                  top: `${PIXEL_SCALE * 2}px`,
                  zIndex: 1000,
                }}
              />
            </div>
          </div>
        )}
      </BuildingImageWrapper>
    </div>
  );
};
