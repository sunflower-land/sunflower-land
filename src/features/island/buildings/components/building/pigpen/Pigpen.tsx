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
import { getKeys } from "lib/object";
import type { TemperateSeasonName } from "features/game/types/game";
import type { LandBiomeName } from "features/island/biomes/biomes";

// TODO(Chapter 16 art): one Pigpen sprite covers every biome, season and
// building level for now (Elias 2026-09-18), so upgrading does not change the
// building's look. Replace entries here as per-level or per-biome art lands.
const PIGPEN_LEVELS: Record<number, string> = {
  1: SUNNYSIDE.building.pigpen,
  2: SUNNYSIDE.building.pigpen,
  3: SUNNYSIDE.building.pigpen,
};

const PIGPEN_SEASONS: Record<TemperateSeasonName, Record<number, string>> = {
  spring: PIGPEN_LEVELS,
  summer: PIGPEN_LEVELS,
  autumn: PIGPEN_LEVELS,
  winter: PIGPEN_LEVELS,
};

// Biomes are taken from BARN_IMAGES rather than listed, so a new land biome
// cannot leave the Pigpen with a missing entry.
export const PIGPEN_IMAGES: Record<
  LandBiomeName,
  Record<TemperateSeasonName, Record<number, string>>
> = getKeys(BARN_IMAGES).reduce(
  (images, biome) => ({ ...images, [biome]: PIGPEN_SEASONS }),
  {} as Record<
    LandBiomeName,
    Record<TemperateSeasonName, Record<number, string>>
  >,
);

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
          // The art's own width, like the Hen House - the Pigpen sprite is
          // 50x54, so the Barn's 64 would upscale it by a fractional factor.
          width: `${PIXEL_SCALE * 50}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
