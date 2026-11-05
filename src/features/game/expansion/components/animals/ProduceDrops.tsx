import React, { useContext } from "react";
import type { Animal, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getAnimalProduce } from "features/game/lib/animals";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { formatNumber } from "lib/utils/formatNumber";

interface Props {
  className?: string;
  animal: Animal;
}

const _game = (state: MachineState) => state.context.state;

export const ProduceDrops: React.FC<Props> = ({ className, animal }) => {
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);

  const drops = getAnimalProduce({ game, animal });

  return (
    <>
      {drops.map(({ resource: item, amount: boostedAmount }, index) => {
        return (
          <div
            key={item}
            className={`flex items-center justify-center absolute bounce-drop pointer-events-none ${className}`}
            style={
              {
                "--drop-delay": `${index * 400}ms`,
              } as React.CSSProperties
            }
          >
            <span className="text-xs yield-text">{`+${formatNumber(boostedAmount)}`}</span>
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
