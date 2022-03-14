import React, { useContext } from "react";

import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Craftable, LimitedItems } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";

interface Props {
    item: Craftable
}

export const Stock: React.FC<Props> = ({ item }) => {
  const { gameService } = useContext(Context);
  const [{ context: { state }}] = useActor(gameService);
  const stock = state.stock[item.name] || new Decimal(0);
  const isLimitedItem = item.name in LimitedItems;
  
  return (
    <span className="w-32 -mt-4 sm:mr-auto bg-blue-600 text-shadow border text-xxs p-1 rounded-md">
      {isLimitedItem 
        ? item.supply === 0 ? "Sold Out" : `${item.supply} left` 
        : `${stock} in stock`
      }
    </span>
  )
}