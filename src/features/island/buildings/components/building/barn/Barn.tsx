import React, { useContext, useEffect } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { barnAudio, loadAudio } from "lib/utils/sfx";
import { useNavigate } from "react-router-dom";
import { ITEM_DETAILS } from "features/game/types/images";
import { MachineState } from "features/game/lib/gameMachine";
import {
  ANIMAL_NEEDS_LOVE_DURATION,
  ANIMAL_SLEEP_DURATION,
} from "features/game/events/landExpansion/feedAnimal";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";

const _hasHungryAnimals = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) => animal.asleepAt + ANIMAL_SLEEP_DURATION < Date.now(),
  );
};

const _hasAwakeSickAnimals = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) =>
      animal.state === "sick" &&
      animal.asleepAt + ANIMAL_SLEEP_DURATION < Date.now(),
  );
};

const _animalsNeedLove = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) =>
      animal.asleepAt + ANIMAL_NEEDS_LOVE_DURATION < Date.now() &&
      animal.lovedAt + ANIMAL_NEEDS_LOVE_DURATION < Date.now(),
  );
};

export const Barn: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const { gameService, showAnimations } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    loadAudio([barnAudio]);
  }, []);

  const hasHungryAnimals = useSelector(gameService, _hasHungryAnimals);
  const animalsNeedLove = useSelector(gameService, _animalsNeedLove);
  const hasAwakeSickAnimals = useSelector(gameService, _hasAwakeSickAnimals);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      barnAudio.play();
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
          src={ITEM_DETAILS.Barn.image}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 64}px`,
          }}
        />
      </BuildingImageWrapper>
    </>
  );
};
