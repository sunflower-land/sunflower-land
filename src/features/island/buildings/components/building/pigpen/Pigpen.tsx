import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import type { BuildingProps } from "../Building";
import { useNavigate } from "react-router";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSound } from "lib/utils/hooks/useSound";
import { useNow } from "lib/utils/hooks/useNow";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { isAnimalReadyForLove } from "features/game/events/landExpansion/loveAnimal";
import { getOverCapacityAnimalIds } from "features/game/events/landExpansion/buyAnimal";
import { getAnimalReadyAt } from "features/game/lib/animals";
import { isAnimalCoveredByGoldenAsset } from "features/game/events/landExpansion/feedAllAnimals";
import classNames from "classnames";
import { saveIslandScrollPosition } from "features/game/expansion/lib/islandScroll";
import { BARN_IMAGES } from "../barn/Barn";

// TODO(Chapter 16 art): the Pigpen reuses the Barn's per-biome, per-season,
// per-level art until its own exists. Swap this alias for a real table then.
export const PIGPEN_IMAGES = BARN_IMAGES;

const _hasHungryAnimals = (state: MachineState) => {
  const game = state.context.state;
  // Capacity-locked animals cannot be fed, so they never count as hungry.
  const lockedIds = getOverCapacityAnimalIds("pigpen", game);
  return Object.values(game.pigpen.animals).some(
    (animal) =>
      getAnimalReadyAt(animal, game) < Date.now() && !lockedIds.has(animal.id),
  );
};

const _hasSickAnimals = (state: MachineState) => {
  return Object.values(state.context.state.pigpen.animals).some(
    (animal) => animal.state === "sick",
  );
};

const _pigpenAnimals = (state: MachineState) =>
  state.context.state.pigpen.animals;
const _game = (state: MachineState) => state.context.state;

const _pigpenLevel = (state: MachineState) => {
  return state.context.state.pigpen.level;
};

export const Pigpen: React.FC<BuildingProps> = ({
  isBuilt,
  island,
  season,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const buildingLevel = useSelector(gameService, _pigpenLevel);

  const navigate = useNavigate();

  // TODO(Chapter 16 art): reuses the Barn door sound until Pig SFX are wired up.
  const { play: pigpenAudio } = useSound("barn");

  const hasHungryAnimals = useSelector(gameService, _hasHungryAnimals);
  const pigpenAnimals = useSelector(gameService, _pigpenAnimals);
  const game = useSelector(gameService, _game);
  const hasSickAnimals = useSelector(gameService, _hasSickAnimals);

  // useNow drives a tick every second so the alert flips on as soon as
  // the love window opens — the underlying gate values only change on
  // game-state events, which wouldn't fire when crossing the time gate.
  const now = useNow({ live: true });
  const animalsNeedLove = Object.values(pigpenAnimals).some(
    (animal) =>
      !isAnimalCoveredByGoldenAsset({
        state: game,
        animalType: animal.type,
      }) && isAnimalReadyForLove(animal, now, getAnimalReadyAt(animal, game)),
  );
  const handleClick = () => {
    if (isBuilt) {
      // Add future on click actions here
      pigpenAudio();
      saveIslandScrollPosition();
      navigate("/pigpen");
    }
  };
  const pigpenAlertIcons: React.ReactElement[] = [];
  const classNamesList = classNames({ ready: showAnimations });
  if (hasHungryAnimals) {
    pigpenAlertIcons.push(
      <img
        key="hungry"
        src={SUNNYSIDE.icons.expression_alerted}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 4}px` }}
      />,
    );
  }
  if (hasSickAnimals) {
    pigpenAlertIcons.push(
      <img
        key="sick"
        src={SUNNYSIDE.icons.expression_stress}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 7}px` }}
      />,
    );
  }
  if (animalsNeedLove) {
    pigpenAlertIcons.push(
      <img
        key="love"
        src={SUNNYSIDE.icons.expression_chat}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 8}px` }}
      />,
    );
  }

  return (
    <BuildingImageWrapper name="Pigpen" onClick={handleClick}>
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 items-center">
        {pigpenAlertIcons}
      </div>
      <img
        src={PIGPEN_IMAGES[getCurrentBiome(island)][season][buildingLevel]}
        className="absolute bottom-0 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 64}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
