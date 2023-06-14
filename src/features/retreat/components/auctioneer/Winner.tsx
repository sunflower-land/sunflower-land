import React from "react";

import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";

import { AuctionLeaderboardTable } from "./AuctionLeaderboardTable";
import { AuctionResults } from "features/game/lib/auctionMachine";
import { Label } from "components/ui/Label";

interface Props {
  onMint: (id: string) => void;
  bid: Bid;
  farmId: number;
  results: AuctionResults;
}
export const Winner: React.FC<Props> = ({ onMint, bid, farmId, results }) => {
  return (
    <div className="flex flex-col justify-center items-center pt-2">
      <AuctionLeaderboardTable
        farmId={farmId}
        leaderboard={results.leaderboard}
        showHeader
        status="winner"
      />

      <div className="my-2">
        <Label type="success">Congratulations!</Label>
      </div>

      <Button className="mt-2" onClick={() => onMint(bid.auctionId)}>
        Mint
      </Button>
    </div>
  );
};
