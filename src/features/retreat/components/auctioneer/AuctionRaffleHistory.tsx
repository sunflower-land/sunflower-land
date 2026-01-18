import React from "react";
import useSWR from "swr";

import { Label } from "components/ui/Label";

import { Loading } from "features/auth/components";
import * as AuthProvider from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { randomID } from "lib/utils/random";
import { loadRaffleResults, RaffleResults } from "./actions/loadRaffleResults";
import { RaffleLeaderboardTable } from "./RaffleLeaderboardTable";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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

export const RaffleHistory: React.FC<{ id: string; onClose?: () => void }> = ({
  id,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { authState } = AuthProvider.useAuth();
  const { gameState, gameService } = useGame();
  const token = authState.context.user.rawToken as string | undefined;

  const {
    data: selectedRaffleResults,
    isLoading: raffleResultsLoading,
    error: raffleResultsError,
  } = useSWR(
    token && id ? ["raffle-results", id, token] : null,
    raffleResultsFetcher,
    {
      revalidateOnFocus: false,
    },
  );

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
    return (
      <div>
        <p className="text-xxs">{t("auction.raffle.resultsPending")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-2 flex flex-col gap-2">
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

        {canClaim && <p className="text-xxs">{t("auction.raffle.win")}</p>}

        {canDismiss && <p className="text-xxs">{t("auction.raffle.lose")}</p>}

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
