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
  const canClaim = !!raffleWinner && game.raffle?.id === id;
  const canDismiss = !raffleWinner && game.raffle?.id === id;
  const sortedWinners = (selectedRaffleResults?.winners ?? [])
    .slice()
    .sort((a, b) => a.position - b.position);

  if (raffleResultsLoading) {
    return <Loading />;
  }

  if (selectedRaffleResults?.status === "pending") {
    return (
      <div>
        <p className="text-xxs">Results are being calculated</p>
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
              onClick={() => onClose()}
            />
          )}

          <Label type="default">Raffle Results</Label>
        </div>

        <div className="flex flex-col gap-1">
          <RaffleLeaderboardTable
            winners={sortedWinners}
            farmId={gameState.context.farmId}
          />
        </div>
        {canClaim && (
          <Button
            onClick={() => {
              gameService.send("auctionRaffle.claimed", {
                effect: { type: "auctionRaffle.claimed" },
              });
            }}
            className="cursor-pointer"
          >
            Claim
          </Button>
        )}

        {canDismiss && (
          <Button
            onClick={() => {
              gameService.send("auctionRaffle.lost");
              onClose?.();
            }}
            className="cursor-pointer"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};
