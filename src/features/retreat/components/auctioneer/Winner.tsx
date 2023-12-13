import React from "react";

import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";

import { AuctionLeaderboardTable } from "./AuctionLeaderboardTable";
import { AuctionResults } from "features/game/lib/auctionMachine";
import { Label } from "components/ui/Label";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";

interface Props {
  onMint: (id: string) => void;
  bid: Bid;
  farmId: number;
  results: AuctionResults;
}
export const Winner: React.FC<Props> = ({ onMint, bid, farmId, results }) => {
  const deadline = results.endAt + 24 * 60 * 60 * 1000;
  const countdown = useCountdown(deadline);

  return (
    <div className="flex flex-col justify-center items-center pt-2">
      <AuctionLeaderboardTable
        farmId={farmId}
        leaderboard={results.leaderboard}
        showHeader
        status="winner"
        username={""}
      />

      <div className="my-2">
        <Label type="success">Congratulations!</Label>
      </div>

      <p className="text-xs mb-2">You have 24 hours to mint your prize.</p>
      <TimerDisplay time={countdown} />
      <a
        href="https://docs.sunflower-land.com/player-guides/auctions#how-to-mint-an-items"
        className="mx-auto text-xxs underline text-center pb-2 pt-2"
        target="_blank"
        rel="noreferrer"
      >
        Read more
      </a>

      <Button className="mt-2" onClick={() => onMint(bid.auctionId)}>
        Mint
      </Button>
    </div>
  );
};
