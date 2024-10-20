import React, { useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { AnimatedBar } from "components/ui/ProgressBar";
import {
  ANIMAL_LEVELS,
  AnimalLevel,
  AnimalType,
} from "features/game/types/animals";
import { getAnimalLevel, isMaxLevel } from "features/game/lib/animals";
import { TState } from "features/game/lib/animalMachine";
import { Transition } from "@headlessui/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import classNames from "classnames";

type Props = {
  animal: AnimalType;
  animalState: TState["value"];
  experience: number;
  className?: string;
};

export const LevelProgress = ({
  experience,
  animal,
  animalState,
  className,
}: Props) => {
  const [prevAnimalState, setPrevAnimalState] = useState(animalState);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (prevAnimalState === "ready" && animalState === "sleeping") {
      setShowLevelUp(true);
      setTimeout(() => {
        setShowLevelUp(false);
      }, 600);
    }
    setPrevAnimalState(animalState);
  }, [animalState, prevAnimalState]);

  const level = getAnimalLevel(experience, animal);

  const getProgressPercentage = () => {
    if (isMaxLevel(animal, level) || animalState === "ready") {
      return 100;
    }

    const nextThreshold = ANIMAL_LEVELS[animal][(level + 1) as AnimalLevel];

    return (experience / nextThreshold) * 100;
  };

  // An animal get xp on every feed so they may already be in the next level
  // however, we want to have them interact with the "level up"
  // so if an animal is ready, we want to show the previous level
  const displayLevel = animalState === "ready" ? level - 1 : level;

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

      <div className={`absolute w-10 ${className}`}>
        <div className="absolute left-1">
          <AnimatedBar percentage={getProgressPercentage()} type="progress" />
        </div>
        <div
          className={`absolute w-5 z-50 -left-1 top-0 ${
            animalState === "ready" ? "pulse-no-fade" : ""
          }`}
        >
          <img
            src={SUNNYSIDE.icons.heart}
            alt={`Level ${level}`}
            className={classNames("w-full", {
              "img-highlight": animalState === "ready",
            })}
          />

          <div className="absolute top-1/2 left-1/2 leading-3 transform -translate-x-1/2 -translate-y-1/2 -mt-[1px] text-[16px] text-white">
            {displayLevel}
          </div>
        </div>
      </div>
    </>
  );
};
