import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";

import { AuctionLeaderboardTable } from "./AuctionLeaderboardTable";
import { AuctionResults } from "features/game/lib/auctionMachine";
import { Label } from "components/ui/Label";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onMint: (id: string) => void;
  bid: Bid;
  farmId: number;
  results: AuctionResults;
}
export const Winner: React.FC<Props> = ({ onMint, bid, farmId, results }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deadline = results.endAt + 24 * 60 * 60 * 1000;
  const countdown = useCountdown(deadline);
  const { t } = useAppTranslation();
  if (showConfirmation) {
    return (
      <GameWallet action="purchase">
        <>
          <div className="flex flex-col justify-center items-center pt-2">
            <div className="my-2">
              <Label type="success">{t("congrats")}</Label>
            </div>
            <p className="text-xs mb-2">{t("winner.mintTime")}</p>
            <TimerDisplay time={countdown} />
            <a
              href="https://docs.sunflower-land.com/player-guides/auctions#how-to-mint-an-items"
              className="mx-auto text-xxs underline text-center pb-2 pt-2"
              target="_blank"
              rel="noreferrer"
            >
              {t("read.more")}
            </a>
            <Button className="mt-2" onClick={() => onMint(bid.auctionId)}>
              {t("mint")}
            </Button>
          </div>
        </>
      </GameWallet>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center pt-2">
      <AuctionLeaderboardTable
        farmId={farmId}
        leaderboard={results.leaderboard}
        showHeader
        status="winner"
      />

      <div className="my-2">
        <Label type="success">{t("congrats")}</Label>
      </div>

      <p className="text-xs mb-2">{t("winner.mintTime")}</p>
      <TimerDisplay time={countdown} />
      <a
        href="https://docs.sunflower-land.com/player-guides/auctions#how-to-mint-an-items"
        className="mx-auto text-xxs underline text-center pb-2 pt-2"
        target="_blank"
        rel="noreferrer"
      >
        {t("read.more")}
      </a>

      <Button className="mt-2" onClick={() => setShowConfirmation(true)}>
        {t("mint")}
      </Button>
    </div>
  );
};
