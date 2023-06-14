import React, { useContext } from "react";

import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

import {
  AuctionResults,
  MachineInterpreter,
} from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";
import { AuctionLeaderboardTable } from "./AuctionLeaderboardTable";

interface Props {
  auctionService: MachineInterpreter;
  results: AuctionResults;
  farmId: number;
}

export const Loser: React.FC<Props> = ({ farmId, auctionService, results }) => {
  const { gameService } = useContext(Context);

  const refund = () => {
    gameService.send("bid.refunded");
    auctionService.send("REFUND");
    gameService.send("SAVE");
  };

  return (
    <div className="flex flex-col items-center">
      <AuctionLeaderboardTable
        farmId={farmId}
        leaderboard={results.leaderboard}
        showHeader
        status="loser"
      />
      <div className="my-2">
        <Label type="danger">You were unsuccesful</Label>
      </div>
      <Button className="mt-2" onClick={refund}>
        Refund resources
      </Button>
    </div>
  );
};
