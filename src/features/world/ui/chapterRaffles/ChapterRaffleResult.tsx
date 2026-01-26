import React, { useEffect } from "react";
import useSWR, { mutate } from "swr";

import { Label } from "components/ui/Label";

import { Loading } from "features/auth/components";
import * as AuthProvider from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { randomID } from "lib/utils/random";
import { loadRaffleResults, RaffleResults } from "./actions/loadRaffleResults";
import { RaffleLeaderboardTable } from "../../../retreat/components/auctioneer/RaffleLeaderboardTable";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { shortenCount } from "lib/utils/formatNumber";
import raffleIcon from "assets/icons/raffle_icon.png";

const raffleResultsFetcher = async ([, raffleId, token]: [
  string,
  string,
  string,
]): Promise<RaffleResults> => {
  return loadRaffleResults({
    id: raffleId,
    token,
    transactionId: randomID(),
  });
};

export const ChapterRaffleResult: React.FC<{
  id: string;
  onClose?: () => void;
}> = ({ id, onClose }) => {
  const { t } = useAppTranslation();
  const { authState } = AuthProvider.useAuth();
  const { gameState, gameService } = useGame();
  const token = authState.context.user.rawToken as string | undefined;

  const {
    data: selectedRaffleResults,
    isLoading: raffleResultsLoading,
    error: raffleResultsError,
  } = useSWR(["raffle-results", id, token], raffleResultsFetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (selectedRaffleResults?.status === "pending") {
      const interval = setInterval(() => {
        mutate(["raffle-results", id, token]);
      }, 30 * 1000);

      return () => clearInterval(interval);
    }
  }, [selectedRaffleResults?.status, id]);

  if (raffleResultsError) {
    throw raffleResultsError;
  }

  const game = gameState.context.state;
  const raffleWinner = selectedRaffleResults?.winners?.find(
    (winner) => winner.farmId === gameState.context.farmId,
  );
  const isActiveEntry = !!game.raffle?.active?.[id];
  const canClaim = !!raffleWinner && isActiveEntry;
  const canDismiss = !raffleWinner && isActiveEntry;
  const sortedWinners = (selectedRaffleResults?.winners ?? [])
    .slice()
    .sort((a, b) => a.position - b.position);

  if (raffleResultsLoading) {
    return <Loading />;
  }

  if (selectedRaffleResults?.status === "pending") {
    return <Loading text={t("auction.raffle.resultsPending")} />;
  }

  return (
    <div>
      <div className="p-1 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            {onClose && (
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="h-6 cursor-pointer"
                onClick={() => {
                  onClose();

                  if (isActiveEntry) {
                    gameService.send("auctionRaffle.claimed", {
                      effect: { type: "auctionRaffle.claimed", raffleId: id },
                    });
                  }
                }}
              />
            )}

            <Label
              type={canClaim ? "success" : canDismiss ? "danger" : "default"}
            >
              {t("auction.raffle.resultsTitle")}
            </Label>
          </div>

          <div>
            <div className="flex items-center justify-end mb-0.5">
              <p className="text-xs">{`${shortenCount(selectedRaffleResults?.participants ?? 0)} players`}</p>
              <div className="w-6 flex justify-center">
                <img src={SUNNYSIDE.icons.player_small} className="h-4 ml-1" />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <p className="text-xs">{`${shortenCount(selectedRaffleResults?.entries ?? 0)} entries`}</p>
              <div className="w-6 flex justify-center">
                <img src={raffleIcon} className="h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {canClaim && <p className="text-xs">{t("auction.raffle.win")}</p>}

        {canDismiss && <p className="text-xs">{t("auction.raffle.lose")}</p>}

        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto scrollable pr-1">
          <RaffleLeaderboardTable
            winners={sortedWinners}
            farmId={gameState.context.farmId}
          />
        </div>
      </div>
      {canClaim && (
        <Button
          onClick={() => {
            gameService.send("auctionRaffle.claimed", {
              effect: { type: "auctionRaffle.claimed", raffleId: id },
            });
            onClose?.();
          }}
          className="cursor-pointer"
        >
          {t("auction.raffle.claim")}
        </Button>
      )}

      {canDismiss && (
        <Button
          onClick={() => {
            gameService.send("auctionRaffle.claimed", {
              effect: { type: "auctionRaffle.claimed", raffleId: id },
            });
            onClose?.();
          }}
          className="cursor-pointer"
        >
          {t("ok")}
        </Button>
      )}
    </div>
  );
};
