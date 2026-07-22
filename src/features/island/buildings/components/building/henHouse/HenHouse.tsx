import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import type { BuildingProps } from "../Building";
import { HEN_HOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSound } from "lib/utils/hooks/useSound";
import { useNow } from "lib/utils/hooks/useNow";
import { isAnimalReadyForLove } from "features/game/events/landExpansion/loveAnimal";
import classNames from "classnames";
import { saveIslandScrollPosition } from "features/game/expansion/lib/islandScroll";

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

const _henHouseAnimals = (state: MachineState) =>
  state.context.state.henHouse.animals;

const _buildingLevel = (state: MachineState) =>
  state.context.state.henHouse.level;

export const ChickenHouse: React.FC<BuildingProps> = ({ isBuilt, season }) => {
  const { gameService, showAnimations } = useContext(Context);
  const navigate = useNavigate();

  const hasHungryChickens = useSelector(gameService, _hasHungryChickens);
  const hasSickChickens = useSelector(gameService, _hasSickChickens);
  const henHouseAnimals = useSelector(gameService, _henHouseAnimals);
  const buildingLevel = useSelector(gameService, _buildingLevel);

  // useNow drives a tick every second so the alert flips on as soon as
  // the love window opens — the underlying gate values only change on
  // game-state events, which wouldn't fire when crossing the time gate.
  const now = useNow({ live: true });
  const chickensNeedLove = Object.values(henHouseAnimals).some((animal) =>
    isAnimalReadyForLove(animal, now),
  );

  const { play: barnAudio } = useSound("barn");

  const handleClick = () => {
    if (isBuilt) {
      // Add future on click actions here
      barnAudio();
      saveIslandScrollPosition();

      navigate("/hen-house");
      return;
    }
  };

  const henHouseAlertIcons: React.ReactElement[] = [];
  const classNamesList = classNames({ ready: showAnimations });
  if (hasHungryChickens) {
    henHouseAlertIcons.push(
      <img
        key="hungry"
        src={SUNNYSIDE.icons.expression_alerted}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 4}px` }}
      />,
    );
  }
  if (hasSickChickens) {
    henHouseAlertIcons.push(
      <img
        key="sick"
        src={SUNNYSIDE.icons.expression_stress}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 7}px` }}
      />,
    );
  }
  if (chickensNeedLove) {
    henHouseAlertIcons.push(
      <img
        key="love"
        src={SUNNYSIDE.icons.expression_chat}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 8}px` }}
      />,
    );
  }

  return (
    <BuildingImageWrapper name="Hen House" onClick={handleClick}>
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 items-center">
        {henHouseAlertIcons}
      </div>
      <img
        src={HEN_HOUSE_VARIANTS[season][buildingLevel]}
        className="absolute bottom-0 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 68}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
