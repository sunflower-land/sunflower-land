import React, { useContext } from "react";

import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

import { AuctionResults } from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";
import { AuctionLeaderboardTable } from "./AuctionLeaderboardTable";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
interface Props {
  onRefund: () => void;
  results: AuctionResults;
  farmId: number;
}

export const Loser: React.FC<Props> = ({ farmId, onRefund, results }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);

  const refund = () => {
    gameService.send({ type: "bid.refunded" });
    onRefund();
    gameService.send({ type: "SAVE" });
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
        <Label type="danger">{t("loser.unsuccess")}</Label>
      </div>
      <Button className="mt-2" onClick={refund}>
        {t("loser.refund")}
      </Button>
    </div>
  );
};
