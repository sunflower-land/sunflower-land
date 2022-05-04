import React, { useContext } from "react";

import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { CraftableItem } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";

interface Props {
  item: CraftableItem;
}

export const Stock: React.FC<Props> = ({ item }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const stock = state.stock[item.name] || new Decimal(0);

  return (
    <span className="w-32 -mt-4 sm:mr-auto bg-blue-600 text-shadow border text-xxs p-1 rounded-md">
      {`${stock} in stock`}
    </span>
  );
};
