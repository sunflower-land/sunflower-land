import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";

import { Context } from "../GameProvider";
import { getKeys } from "../types/craftables";
import { ITEM_DETAILS } from "../types/images";
import { InventoryItemName } from "../types/game";
import { setImageWidth } from "lib/images";
import { getSeasonalTicket } from "../types/seasons";

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
  const seasonalTicket =
    gameState.context.revealed?.inventory[getSeasonalTicket()];

  const ticketImage = () => {
    return (
      <img
        src={ITEM_DETAILS[getSeasonalTicket()].image}
        className="mb-2"
        onLoad={(e) => setImageWidth(e.currentTarget)}
        style={{
          opacity: 0,
        }}
      />
    );
  };

  const ticketText = () => {
    return (
      <p className="text-center text-sm mb-2">{`and 1x ${getSeasonalTicket()}`}</p>
    );
  };
  return (
    <>
      <div className="flex flex-col items-center p-2">
        <p className="text-center text-base mb-2">Congratulations!</p>

        {sfl > 0 && (
          <>
            <div className="flex flex-wrap justify-center items-center mb-2 space-x-2 mt-1">
              <img
                src={token}
                className="mb-2"
                onLoad={(e) => setImageWidth(e.currentTarget)}
              />
              {seasonalTicket && ticketImage()}
            </div>

            <p className="text-center text-sm mb-2">{`You found ${sfl} SFL`}</p>

            {seasonalTicket && ticketText()}
          </>
        )}

        {items.length > 0 &&
          items.map(
            (name, index) =>
              name != getSeasonalTicket() && (
                <div
                  key={`${name}-${index}`}
                  className="flex flex-col items-center"
                >
                  {/* Images */}
                  <div className="flex flex-wrap justify-center items-center mb-2 space-x-2 mt-1">
                    {sfl > 0 && (
                      <img
                        src={token}
                        className="mb-2"
                        onLoad={(e) => setImageWidth(e.currentTarget)}
                      />
                    )}

                    {items.map((name, index) => (
                      <img
                        key={`${name}-${index}`}
                        src={ITEM_DETAILS[name as InventoryItemName].image}
                        className="mb-2"
                        onLoad={(e) => setImageWidth(e.currentTarget)}
                        style={{
                          opacity: 0,
                        }}
                      />
                    ))}
                  </div>

                  {/* Text*/}
                  <div>
                    <p className="text-center text-sm mb-2">You found</p>
                    {sfl > 0 && (
                      <p className="text-center text-sm mb-2">{`${sfl} SFL`}</p>
                    )}
                    {items.map((name, index) => (
                      <p
                        key={`${name}-${index}`}
                        className="text-center text-sm mb-2"
                      >{`${gameState.context.revealed?.inventory[name]} x ${name}`}</p>
                    ))}
                  </div>
                </div>
              )
          )}
      </div>
      <Button onClick={handleAcknowledge}>Continue</Button>
    </>
  );
};
