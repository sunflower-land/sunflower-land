import React, { useContext } from "react";
import { AnimalResource, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  ANIMAL_RESOURCE_DROP,
  AnimalLevel,
  AnimalType,
} from "features/game/types/animals";
import { getResourceDropAmount } from "features/game/lib/animals";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

interface Props {
  animalType: AnimalType;
  level: AnimalLevel;
  multiplier: number;
  className?: string;
}

const _game = (state: MachineState) => state.context.state;

export const ProduceDrops: React.FC<Props> = ({
  level,
  animalType,
  multiplier,
  className,
}) => {
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);

  const dropItems = ANIMAL_RESOURCE_DROP[animalType][level];
  const itemEntries = Object.entries(dropItems);

  return (
    <>
      {itemEntries.map(([item, amount], index) => {
        const boostedAmount = getResourceDropAmount({
          game,
          animalType,
          baseAmount: amount.toNumber(),
          resource: item as AnimalResource,
          multiplier,
        });

        return (
          <div
            key={item}
            className={`flex items-center justify-center absolute bounce-drop ${className}`}
            style={
              {
                "--drop-delay": `${index * 400}ms`,
              } as React.CSSProperties
            }
          >
            <span className="text-xs yield-text">{`+${boostedAmount}`}</span>
            <img
              src={ITEM_DETAILS[item as InventoryItemName]?.image}
              alt={item}
              className="w-4 img-highlight mb-0.5"
            />
          </div>
        );
      })}
    </>
  );
};
