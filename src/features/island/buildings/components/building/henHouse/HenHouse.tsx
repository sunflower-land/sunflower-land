import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { HenHouseModal } from "./components/HenHouseModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { barnAudio, loadAudio } from "lib/utils/sfx";
import { HEN_HOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { hasFeatureAccess } from "lib/flags";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { GameState } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import {
  ANIMAL_NEEDS_LOVE_DURATION,
  ANIMAL_SLEEP_DURATION,
} from "features/game/events/landExpansion/feedAnimal";
import { SUNNYSIDE } from "assets/sunnyside";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";

const _betaInventory = (state: MachineState) => {
  const pass = state.context.state.inventory["Beta Pass"];

  return { inventory: { "Beta Pass": pass } } as GameState;
};

const _hasHungryChickens = (state: MachineState) => {
  return Object.values(state.context.state.henHouse.animals).some(
    (animal) => animal.asleepAt + ANIMAL_SLEEP_DURATION < Date.now(),
  );
};

const _hasAwakeSickChickens = (state: MachineState) => {
  return Object.values(state.context.state.henHouse.animals).some(
    (animal) =>
      animal.state === "sick" &&
      animal.asleepAt + ANIMAL_SLEEP_DURATION < Date.now(),
  );
};

const _chickensNeedLove = (state: MachineState) => {
  return Object.values(state.context.state.henHouse.animals).some(
    (animal) =>
      animal.asleepAt + ANIMAL_NEEDS_LOVE_DURATION < Date.now() &&
      animal.lovedAt + ANIMAL_NEEDS_LOVE_DURATION < Date.now(),
  );
};

const _buildingLevel = (state: MachineState) => {
  return (state.context.state.henHouse.level || 1) as AnimalBuildingLevel;
};

export const ChickenHouse: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  island,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const betaInventory = useSelector(gameService, _betaInventory);
  const hasHungryChickens = useSelector(gameService, _hasHungryChickens);
  const hasAwakeSickChickens = useSelector(gameService, _hasAwakeSickChickens);
  const chickensNeedLove = useSelector(gameService, _chickensNeedLove);
  const buildingLevel = useSelector(gameService, _buildingLevel);
  useEffect(() => {
    loadAudio([barnAudio]);
  }, []);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      barnAudio.play();

      if (hasFeatureAccess(betaInventory, "ANIMAL_BUILDINGS")) {
        navigate("/hen-house");
        return;
      }

      setIsOpen(true);
      return;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper name="Hen House" onClick={handleClick}>
        {(hasHungryChickens || chickensNeedLove || hasAwakeSickChickens) && (
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
          src={HEN_HOUSE_VARIANTS[island][buildingLevel]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 61}px`,
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
