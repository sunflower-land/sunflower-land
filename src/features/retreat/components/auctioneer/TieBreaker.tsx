import React, { useContext } from "react";

import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

import {
  AuctionResults,
  MachineInterpreter,
} from "features/game/lib/auctionMachine";
import { Context } from "features/game/GameProvider";
import {
  AuctionLeaderboardTable,
  toOrdinalSuffix,
} from "./AuctionLeaderboardTable";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  auctionService: MachineInterpreter;
  results: AuctionResults;
  farmId: number;
}

export const TieBreaker: React.FC<Props> = ({
  farmId,
  auctionService,
  results,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const refund = () => {
    gameService.send({ type: "bid.refunded" });
    auctionService.send({ type: "REFUND" });
    gameService.send({ type: "SAVE" });
  };

  return (
    <div className="flex flex-col items-center">
      <AuctionLeaderboardTable
        farmId={farmId}
        leaderboard={results.leaderboard}
        showHeader
        status="tiebreaker"
      />
      <div className="my-2">
        <Label type="warning">{"Tiebreaker"}</Label>
      </div>
      <p className="text-xs mb-2 text-center px-2">
        {`So close! You bid the exact same resources as the ${toOrdinalSuffix(
          results.supply,
        )} bid.`}{" "}
        {t("tieBreaker.closeBid")}
      </p>
      <p className="text-xs  mb-1 text-center px-2">
        {t("tieBreaker.betterLuck")}
      </p>
      <a
        className="underline hover:text-blue-500 text-xxs text-center"
        href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
        target="_blank"
        rel="noreferrer"
      >
        {t("read.more")}
      </a>
      <Button className="mt-2" onClick={refund}>
        {t("loser.refund")}
      </Button>
    </div>
  );
};
