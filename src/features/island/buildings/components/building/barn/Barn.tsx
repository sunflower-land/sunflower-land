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
import type { TemperateSeasonName } from "features/game/types/game";
import { getCurrentBiome } from "features/island/biomes/biomes";
import type { LandBiomeName } from "features/island/biomes/biomes";
import { isAnimalNeedingLove } from "features/game/events/landExpansion/loveAnimal";
import classNames from "classnames";
import { saveIslandScrollPosition } from "features/game/expansion/lib/islandScroll";

export const BARN_IMAGES: Record<
  LandBiomeName,
  Record<TemperateSeasonName, Record<number, string>>
> = {
  "Basic Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.barn_1,
      2: SUNNYSIDE.seasons.spring.barn_2,
      3: SUNNYSIDE.seasons.spring.barn_3,
    },
    summer: {
      1: SUNNYSIDE.building.barnLevel1,
      2: SUNNYSIDE.building.barnLevel2,
      3: SUNNYSIDE.building.barnLevel3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.barn_1,
      2: SUNNYSIDE.seasons.autumn.barn_2,
      3: SUNNYSIDE.seasons.autumn.barn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.barn_1,
      2: SUNNYSIDE.seasons.winter.barn_2,
      3: SUNNYSIDE.seasons.winter.barn_3,
    },
  },
  "Spring Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.barn_1,
      2: SUNNYSIDE.seasons.spring.barn_2,
      3: SUNNYSIDE.seasons.spring.barn_3,
    },
    summer: {
      1: SUNNYSIDE.building.barnLevel1,
      2: SUNNYSIDE.building.barnLevel2,
      3: SUNNYSIDE.building.barnLevel3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.barn_1,
      2: SUNNYSIDE.seasons.autumn.barn_2,
      3: SUNNYSIDE.seasons.autumn.barn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.barn_1,
      2: SUNNYSIDE.seasons.winter.barn_2,
      3: SUNNYSIDE.seasons.winter.barn_3,
    },
  },
  "Desert Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.desertBarn_1,
      2: SUNNYSIDE.seasons.spring.desertBarn_2,
      3: SUNNYSIDE.seasons.spring.desertBarn_3,
    },
    summer: {
      1: SUNNYSIDE.building.desertBarn_1,
      2: SUNNYSIDE.building.desertBarn_2,
      3: SUNNYSIDE.building.desertBarn_3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.desertBarn_1,
      2: SUNNYSIDE.seasons.autumn.desertBarn_2,
      3: SUNNYSIDE.seasons.autumn.desertBarn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.desertBarn_1,
      2: SUNNYSIDE.seasons.winter.desertBarn_2,
      3: SUNNYSIDE.seasons.winter.desertBarn_3,
    },
  },
  "Volcano Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.volcanoBarn_1,
      2: SUNNYSIDE.seasons.spring.volcanoBarn_2,
      3: SUNNYSIDE.seasons.spring.volcanoBarn_3,
    },
    summer: {
      1: SUNNYSIDE.building.volcanoBarn_1,
      2: SUNNYSIDE.building.volcanoBarn_2,
      3: SUNNYSIDE.building.volcanoBarn_3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.volcanoBarn_1,
      2: SUNNYSIDE.seasons.autumn.volcanoBarn_2,
      3: SUNNYSIDE.seasons.autumn.volcanoBarn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.volcanoBarn_1,
      2: SUNNYSIDE.seasons.winter.volcanoBarn_2,
      3: SUNNYSIDE.seasons.winter.volcanoBarn_3,
    },
  },
  "Swamp Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.barn_1,
      2: SUNNYSIDE.seasons.spring.barn_2,
      3: SUNNYSIDE.seasons.spring.barn_3,
    },
    summer: {
      1: SUNNYSIDE.building.barnLevel1,
      2: SUNNYSIDE.building.barnLevel2,
      3: SUNNYSIDE.building.barnLevel3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.barn_1,
      2: SUNNYSIDE.seasons.autumn.barn_2,
      3: SUNNYSIDE.seasons.autumn.barn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.barn_1,
      2: SUNNYSIDE.seasons.winter.barn_2,
      3: SUNNYSIDE.seasons.winter.barn_3,
    },
  },
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.barn_1,
      2: SUNNYSIDE.seasons.spring.barn_2,
      3: SUNNYSIDE.seasons.spring.barn_3,
    },
    summer: {
      1: SUNNYSIDE.building.barnLevel1,
      2: SUNNYSIDE.building.barnLevel2,
      3: SUNNYSIDE.building.barnLevel3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.barn_1,
      2: SUNNYSIDE.seasons.autumn.barn_2,
      3: SUNNYSIDE.seasons.autumn.barn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.barn_1,
      2: SUNNYSIDE.seasons.winter.barn_2,
      3: SUNNYSIDE.seasons.winter.barn_3,
    },
  },
  "Crystal Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.barn_1,
      2: SUNNYSIDE.seasons.spring.barn_2,
      3: SUNNYSIDE.seasons.spring.barn_3,
    },
    summer: {
      1: SUNNYSIDE.building.barnLevel1,
      2: SUNNYSIDE.building.barnLevel2,
      3: SUNNYSIDE.building.barnLevel3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.barn_1,
      2: SUNNYSIDE.seasons.autumn.barn_2,
      3: SUNNYSIDE.seasons.autumn.barn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.barn_1,
      2: SUNNYSIDE.seasons.winter.barn_2,
      3: SUNNYSIDE.seasons.winter.barn_3,
    },
  },
  "Galaxy Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.barn_1,
      2: SUNNYSIDE.seasons.spring.barn_2,
      3: SUNNYSIDE.seasons.spring.barn_3,
    },
    summer: {
      1: SUNNYSIDE.building.barnLevel1,
      2: SUNNYSIDE.building.barnLevel2,
      3: SUNNYSIDE.building.barnLevel3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.barn_1,
      2: SUNNYSIDE.seasons.autumn.barn_2,
      3: SUNNYSIDE.seasons.autumn.barn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.barn_1,
      2: SUNNYSIDE.seasons.winter.barn_2,
      3: SUNNYSIDE.seasons.winter.barn_3,
    },
  },
  "Marble Age Biome": {
    spring: {
      1: SUNNYSIDE.seasons.spring.barn_1,
      2: SUNNYSIDE.seasons.spring.barn_2,
      3: SUNNYSIDE.seasons.spring.barn_3,
    },
    summer: {
      1: SUNNYSIDE.building.barnLevel1,
      2: SUNNYSIDE.building.barnLevel2,
      3: SUNNYSIDE.building.barnLevel3,
    },
    autumn: {
      1: SUNNYSIDE.seasons.autumn.barn_1,
      2: SUNNYSIDE.seasons.autumn.barn_2,
      3: SUNNYSIDE.seasons.autumn.barn_3,
    },
    winter: {
      1: SUNNYSIDE.seasons.winter.barn_1,
      2: SUNNYSIDE.seasons.winter.barn_2,
      3: SUNNYSIDE.seasons.winter.barn_3,
    },
  },
};

const _hasHungryAnimals = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) => animal.awakeAt < Date.now(),
  );
};

const _hasSickAnimals = (state: MachineState) => {
  return Object.values(state.context.state.barn.animals).some(
    (animal) => animal.state === "sick",
  );
};

const _barnAnimals = (state: MachineState) => state.context.state.barn.animals;

const _barnLevel = (state: MachineState) => {
  return state.context.state.barn.level;
};

export const Barn: React.FC<BuildingProps> = ({ isBuilt, island, season }) => {
  const { gameService, showAnimations } = useContext(Context);
  const buildingLevel = useSelector(gameService, _barnLevel);

  const navigate = useNavigate();

  const { play: barnAudio } = useSound("barn");

  const hasHungryAnimals = useSelector(gameService, _hasHungryAnimals);
  const barnAnimals = useSelector(gameService, _barnAnimals);
  const hasSickAnimals = useSelector(gameService, _hasSickAnimals);

  // useNow drives a tick every second so the alert flips on as soon as
  // the love window opens — the underlying gate values only change on
  // game-state events, which wouldn't fire when crossing the time gate.
  const now = useNow({ live: true });
  const animalsNeedLove = Object.values(barnAnimals).some((animal) =>
    isAnimalNeedingLove(animal, now),
  );
  const handleClick = () => {
    if (isBuilt) {
      // Add future on click actions here
      barnAudio();
      saveIslandScrollPosition();
      navigate("/barn");
    }
  };
  const barnAlertIcons: React.ReactElement[] = [];
  const classNamesList = classNames({ ready: showAnimations });
  if (hasHungryAnimals) {
    barnAlertIcons.push(
      <img
        key="hungry"
        src={SUNNYSIDE.icons.expression_alerted}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 4}px` }}
      />,
    );
  }
  if (hasSickAnimals) {
    barnAlertIcons.push(
      <img
        key="sick"
        src={SUNNYSIDE.icons.expression_stress}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 7}px` }}
      />,
    );
  }
  if (animalsNeedLove) {
    barnAlertIcons.push(
      <img
        key="love"
        src={SUNNYSIDE.icons.expression_chat}
        className={classNamesList}
        style={{ width: `${PIXEL_SCALE * 8}px` }}
      />,
    );
  }

  return (
    <BuildingImageWrapper name="Barn" onClick={handleClick}>
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 items-center">
        {barnAlertIcons}
      </div>
      <img
        src={BARN_IMAGES[getCurrentBiome(island)][season][buildingLevel]}
        className="absolute bottom-0 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 64}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
