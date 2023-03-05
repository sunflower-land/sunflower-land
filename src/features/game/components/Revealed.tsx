import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";

import { Context } from "../GameProvider";
import { getKeys } from "../types/craftables";
import { ITEM_DETAILS } from "../types/images";
import { InventoryItemName } from "../types/game";
import { PIXEL_SCALE } from "../lib/constants";
import { setImageWidth } from "lib/images";

export const Revealed: React.FC<{ onAcknowledged?: () => void }> = ({
  onAcknowledged,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const handleAcknowledge = () => {
    gameService.send("CONTINUE");
    if (onAcknowledged) onAcknowledged();
  };

  const items = getKeys(gameState.context.revealed?.inventory ?? {});
  const sfl = Number(gameState.context.revealed?.balance ?? 0);

  return (
    <>
      <div className="flex flex-col items-center p-2">
        <p className="text-center text-base mb-2">Congratulations!</p>
        {sfl > 0 && (
          <>
            <img
              src={token}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 10}px`,
              }}
            />
            <p className="text-center text-sm mb-2">{`You found ${sfl} SFL`}</p>
          </>
        )}

        {items.length > 0 &&
          items.map((name, index) => (
            <div
              key={`${name}-${index}`}
              className="flex flex-col items-center"
            >
              <img
                src={ITEM_DETAILS[name as InventoryItemName].image}
                className="mb-2"
                onLoad={(e) => setImageWidth(e.currentTarget)}
                style={{
                  opacity: 0,
                }}
              />
              <p className="text-center text-sm mb-2">{`You found ${gameState.context.revealed?.inventory[name]} x ${name}`}</p>
            </div>
          ))}
      </div>
      <Button onClick={handleAcknowledge}>Continue</Button>
    </>
  );
};
