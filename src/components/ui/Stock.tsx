import React, { useContext } from "react";

import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { Label } from "./Label";

interface Props {
  item: { name: InventoryItemName };
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
    <Label className="w-auto -mt-2 mb-1" type="info">
      {`${stock} in stock`}
    </Label>
  );
};
