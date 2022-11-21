import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";

import { Context } from "../GameProvider";
import { getKeys } from "../types/craftables";
import { ITEM_DETAILS } from "../types/images";
import { InventoryItemName } from "../types/game";

export const Revealed: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const onAcknowledge = () => {
    gameService.send("CONTINUE");
  };

  const items = getKeys(gameState.context.revealed?.inventory ?? {});
  const sfl = Number(gameState.context.revealed?.balance ?? 0);

  return (
    <div className="flex flex-col items-center p-1">
      <p className="text-center text-base mb-2">Congratulations!</p>
      {sfl > 0 && (
        <>
          <img src={token} className="w-1/5 mb-2" />
          <p className="text-center text-sm mb-2">{`You found ${sfl} SFL`}</p>
        </>
      )}

      {items.length > 0 &&
        items.map((name, index) => (
          <div key={`${name}-${index}`} className="flex flex-col items-center">
            <img
              src={ITEM_DETAILS[name as InventoryItemName].image}
              className="w-1/5 mb-2"
            />
            <p className="text-center text-sm mb-2">{`You found a ${name}`}</p>
          </div>
        ))}

      <Button onClick={onAcknowledge}>Continue</Button>
    </div>
  );
};
