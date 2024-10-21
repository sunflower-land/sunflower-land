import React from "react";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  ANIMAL_RESOURCE_DROP,
  AnimalLevel,
  AnimalType,
} from "features/game/types/animals";

interface Props {
  animalType: AnimalType;
  currentLevel: number;
  className?: string;
}

export const ProduceDrops: React.FC<Props> = ({
  currentLevel,
  animalType,
  className,
}) => {
  const previousLevel = Math.max(currentLevel - 1, 1) as AnimalLevel;
  const dropItems = ANIMAL_RESOURCE_DROP[animalType][previousLevel];
  const itemEntries = Object.entries(dropItems);

  return (
    <>
      {itemEntries.map(([item, amount], index) => (
        <div
          key={item}
          className={`flex items-center justify-center absolute bounce-drop ${className}`}
          style={
            {
              "--drop-delay": `${index * 400}ms`,
            } as React.CSSProperties
          }
        >
          <span className="text-xs yield-text">{`+${amount}`}</span>
          <img
            src={ITEM_DETAILS[item as InventoryItemName]?.image}
            alt={item}
            className="w-4 img-highlight mb-0.5"
          />
        </div>
      ))}
    </>
  );
};
