import React, { useContext } from "react";

import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import token from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";

import { SUNNYSIDE } from "assets/sunnyside";
import {
  AuctionResults,
  MachineInterpreter,
} from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";

interface Props {
  auctionService: MachineInterpreter;
  results: AuctionResults;
}
export const Loser: React.FC<Props> = ({ auctionService, results }) => {
  const { gameService } = useContext(Context);

  const refund = () => {
    gameService.send("bid.refunded");
    auctionService.send("REFUND");
    gameService.send("SAVE");
  };

  const minimum = results.minimum;

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2">Bid unsuccessful</p>
      <img src={SUNNYSIDE.icons.neutral} className="w-12 mb-2" />
      <Label type="warning">Auction results</Label>
      <div className="w-4/5 flex flex-col my-2 justify-center items-center">
        <div className="flex mb-2">
          <img
            src={SUNNYSIDE.icons.player}
            className="w-6 object-contain mr-2"
          />
          <span className="text-sm">{`${results.participantCount} Bumpkins placed a bid`}</span>
        </div>
        <p className="text-xs underline mb-1">Required bid</p>
        <div className="flex">
          <div>
            {minimum.sfl > 0 && (
              <div className={"flex items-center justify-center  mb-1 mr-3"}>
                <div>
                  <p className="mr-1 text-right text-sm">{minimum.sfl}</p>
                </div>
                <img src={token} className="h-5" />
              </div>
            )}
            {getKeys(minimum.items).map((name) => (
              <div
                className="flex items-center jsutify-centermb-1 mr-3"
                key={name}
              >
                <div>
                  <p className={"mr-1 text-right text-sm"}>
                    {minimum.items[name] ?? 0}
                  </p>
                </div>
                <img src={ITEM_DETAILS[name].image} className="h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button className="mt-2" onClick={refund}>
        Refund resources
      </Button>
    </div>
  );
};
