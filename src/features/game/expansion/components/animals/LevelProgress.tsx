import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Bar } from "components/ui/ProgressBar";
import {
  ANIMAL_LEVELS,
  AnimalLevel,
  AnimalType,
} from "features/game/types/animals";
import { getAnimalLevel, isMaxLevel } from "features/game/lib/animals";

type Props = {
  animal: AnimalType;
  experience: number;
  className?: string;
};

export const LevelProgress = ({ experience, animal, className }: Props) => {
  const level = getAnimalLevel(experience, animal);

  const getProgressPercentage = () => {
    if (isMaxLevel(animal, level)) {
      return 100;
    }

    const nextThreshold = ANIMAL_LEVELS[animal][(level + 1) as AnimalLevel];

    return (experience / nextThreshold) * 100;
  };

  return (
    <div className={`absolute w-10 ${className}`}>
      <div className="absolute">
        <Bar percentage={getProgressPercentage()} type="progress" />
      </div>
      <div className="absolute w-5 z-50 -left-1 top-0">
        <img
          src={SUNNYSIDE.icons.heart}
          alt={`Level ${level}`}
          className="w-full"
        />

        <div className="absolute top-1/2 left-1/2 leading-3 transform -translate-x-1/2 -translate-y-1/2 -mt-[1px] text-[16px] text-white">
          {level}
        </div>
      </div>
    </div>
  );
};
