import React, { useEffect, useState } from "react";
import { AnimatedBar } from "components/ui/ProgressBar";
import { ANIMAL_LEVELS, AnimalLevel } from "features/game/types/animals";
import { getAnimalLevel, isMaxLevel } from "features/game/lib/animals";
import { TState } from "features/game/lib/animalMachine";
import { Transition } from "@headlessui/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Animal } from "features/game/types/game";

type Props = {
  animal: Animal;
  animalState: TState["value"];
  experience: number;
  className?: string;
  onLevelUp: () => void;
};

export const LevelProgress = ({
  experience,
  animal,
  animalState,
  className,
  onLevelUp,
}: Props) => {
  const [prevAnimalState, setPrevAnimalState] = useState(animalState);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [displayExperience, setDisplayExperience] = useState(experience);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const { t } = useAppTranslation();

  // Handle level up animation sequence
  useEffect(() => {
    if (prevAnimalState === "ready" && animalState === "sleeping") {
      setIsLevelingUp(true);
      onLevelUp();
      setShowLevelUp(true);

      // Delay updating the experience until the level up animation starts
      setTimeout(() => {
        setDisplayExperience(experience);
        setIsLevelingUp(false);
      }, 50);

      setTimeout(() => {
        setShowLevelUp(false);
      }, 600);
    }
    setPrevAnimalState(animalState);
  }, [animalState, prevAnimalState, onLevelUp, experience]);

  // Handle regular experience updates (feeding)
  useEffect(() => {
    if (!isLevelingUp) {
      setDisplayExperience(experience);
    }
  }, [experience, isLevelingUp]);

  const level = getAnimalLevel(experience, animal.type);

  const hasLeveledUp =
    animalState === "ready" ||
    (animalState === "sleeping" && animal.state === "ready");

  const getProgressPercentage = () => {
    if (isMaxLevel(animal.type, level) || hasLeveledUp) {
      return 100;
    }

    const nextThreshold =
      ANIMAL_LEVELS[animal.type][(level + 1) as AnimalLevel];
    return (displayExperience / nextThreshold) * 100;
  };

  // An animal get xp on every feed so they may already be in the next level
  // however, we want to have them interact with the "level up"
  // so if an animal is ready, we want to show the previous level
  const displayLevel = hasLeveledUp ? level - 1 : level;

  return (
    <>
      <Transition
        appear={true}
        id="level-up"
        show={showLevelUp}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex -top-1 left-1/2 -translate-x-1/2 ml-2 absolute z-40 pointer-events-none"
      >
        <span
          className="text-sm yield-text whitespace-nowrap"
          style={{
            color: "#71e358",
          }}
        >
          {t("levelUp")}
        </span>
      </Transition>

      <div className={`${className}`}>
        <AnimatedBar percentage={getProgressPercentage()} type="progress" />
        <div
          className="absolute z-50 text-right yield-text right-[85%] ml-0.5 top-[11px] leading-3 transform -translate-y-1/2 text-[16px] text-white"
          style={{ color: "#71e358" }}
        >
          <div className={`relative ${hasLeveledUp ? "pulse-no-fade" : ""}`}>
            {displayLevel}
          </div>
        </div>
      </div>
    </>
  );
};
