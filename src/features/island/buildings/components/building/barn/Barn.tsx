import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { useNavigate } from "react-router";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";
import { useSound } from "lib/utils/hooks/useSound";
import { BARN_VARIANTS } from "features/island/lib/alternateArt";

const _hasHungryAnimals = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) => animal.awakeAt < Date.now(),
  );
};

const _hasAwakeSickAnimals = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) => animal.state === "sick" && animal.awakeAt < Date.now(),
  );
};

const _animalsNeedLove = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) =>
      animal.asleepAt + (animal.awakeAt - animal.asleepAt) / 3 < Date.now() &&
      animal.lovedAt + (animal.awakeAt - animal.asleepAt) / 3 < Date.now(),
  );
};

const _barnLevel = (state: MachineState) => {
  return state.context.state.barn.level;
};

const _islandType = (state: MachineState) => {
  return state.context.state.island.type;
};

export const Barn: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const { gameService, showAnimations } = useContext(Context);
  const buildingLevel = useSelector(
    gameService,
    _barnLevel,
  ) as AnimalBuildingLevel;

  const navigate = useNavigate();

  const { play: barnAudio } = useSound("barn");

  const hasHungryAnimals = useSelector(gameService, _hasHungryAnimals);
  const animalsNeedLove = useSelector(gameService, _animalsNeedLove);
  const hasAwakeSickAnimals = useSelector(gameService, _hasAwakeSickAnimals);
  const islandType = useSelector(gameService, _islandType);
  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      barnAudio();
      navigate("/barn");
    }
  };

  return (
    <>
      <BuildingImageWrapper name="Barn" onClick={handleClick}>
        {(hasHungryAnimals || animalsNeedLove || hasAwakeSickAnimals) && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={
              "absolute -top-2 -ml-[5px] left-1/2 transform -translate-x-1/2 z-20" +
              (showAnimations ? " ready" : "")
            }
            style={{ width: `${PIXEL_SCALE * 4}px` }}
          />
        )}
        <img
          src={BARN_VARIANTS[islandType][buildingLevel]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 64}px`,
          }}
        />
      </BuildingImageWrapper>
    </>
  );
};
