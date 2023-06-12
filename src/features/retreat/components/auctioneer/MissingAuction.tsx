import React from "react";

import { Button } from "components/ui/Button";

import { SUNNYSIDE } from "assets/sunnyside";
import { MachineInterpreter } from "features/game/lib/auctionMachine";

interface Props {
  auctionService: MachineInterpreter;
}
export const MissingAuction: React.FC<Props> = ({ auctionService }) => {
  const refund = () => {
    auctionService.send("REFUND");
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2">Auction no longer exists</p>
      <img src={SUNNYSIDE.icons.neutral} className="w-12 mb-2" />
      <Button className="mt-2" onClick={refund}>
        Refund
      </Button>
    </div>
  );
};
