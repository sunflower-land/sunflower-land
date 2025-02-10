import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { HenHouseModal } from "./components/HenHouseModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { HEN_HOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import { SUNNYSIDE } from "assets/sunnyside";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";
import { useSound } from "lib/utils/hooks/useSound";

const _hasHungryChickens = (state: MachineState) => {
  return Object.values(state.context.state.henHouse.animals).some(
    (animal) => animal.awakeAt < Date.now(),
  );
};

const _hasSickChickens = (state: MachineState) => {
  return Object.values(state.context.state.henHouse.animals).some(
    (animal) => animal.state === "sick",
  );
};

const _chickensNeedLove = (state: MachineState) => {
  return Object.values(state.context.state.henHouse.animals).some(
    (animal) =>
      animal.asleepAt + (animal.awakeAt - animal.asleepAt) / 3 < Date.now() &&
      animal.lovedAt + (animal.awakeAt - animal.asleepAt) / 3 < Date.now(),
  );
};

const _buildingLevel = (state: MachineState) => {
  return (state.context.state.henHouse.level || 1) as AnimalBuildingLevel;
};

export const ChickenHouse: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  season,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const hasHungryChickens = useSelector(gameService, _hasHungryChickens);
  const hasSickChickens = useSelector(gameService, _hasSickChickens);
  const chickensNeedLove = useSelector(gameService, _chickensNeedLove);
  const buildingLevel = useSelector(gameService, _buildingLevel);

  const { play: barnAudio } = useSound("barn");

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      barnAudio();

      navigate("/hen-house");
      return;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper name="Hen House" onClick={handleClick}>
        {(hasHungryChickens || chickensNeedLove || hasSickChickens) && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={
              "absolute -top-2 left-1/2 transform -translate-x-1/2 z-20" +
              (showAnimations ? " ready" : "")
            }
            style={{ width: `${PIXEL_SCALE * 4}px` }}
          />
        )}
        <img
          src={HEN_HOUSE_VARIANTS[season][buildingLevel]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 68}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>
      <Modal show={isOpen} onHide={handleClose}>
        <HenHouseModal onClose={handleClose} />
      </Modal>
    </>
  );
};
