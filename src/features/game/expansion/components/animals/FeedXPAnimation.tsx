import {
  ANIMAL_FOOD_EXPERIENCE,
  AnimalLevel,
  AnimalType,
} from "features/game/types/animals";
import React from "react";
import { Transition } from "@headlessui/react";
import { formatNumber } from "lib/utils/formatNumber";
import { AnimalFoodName } from "features/game/types/game";

type Props = {
  show: boolean;
  foodFed: AnimalFoodName;
  animal: AnimalType;
  level: AnimalLevel;
  isFavourite: boolean;
};

export const FeedXPAnimation: React.FC<Props> = ({
  show,
  foodFed,
  animal,
  level,
  isFavourite,
}) => {
  const xp = ANIMAL_FOOD_EXPERIENCE[animal][level][foodFed];

  return (
    <Transition
      appear={true}
      id="oil-reserve-collected-amount"
      show={show}
      enter="transition-opacity transition-transform duration-200"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 -translate-y-0"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="flex top-0 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
    >
      <span
        className="text-sm yield-text"
        style={{
          color: isFavourite ? "#71e358" : "#fff",
        }}
      >{`+${formatNumber(xp)}`}</span>
    </Transition>
  );
};
