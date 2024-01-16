import React, { useContext } from "react";

import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

import { AuctionResults } from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";
import { AuctionLeaderboardTable } from "./AuctionLeaderboardTable";
import { translate } from "lib/i18n/translate";
interface Props {
  onRefund: () => void;
  results: AuctionResults;
  farmId: number;
}

export const Loser: React.FC<Props> = ({ farmId, onRefund, results }) => {
  const { gameService } = useContext(Context);

  const refund = () => {
    gameService.send("bid.refunded");
    onRefund();
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
        <Label type="danger">{translate("loser.unsuccess")}</Label>
      </div>
      <Button className="mt-2" onClick={refund}>
        {translate("loser.refund")}
      </Button>
    </div>
  );
};
