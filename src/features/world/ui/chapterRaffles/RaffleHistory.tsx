import React, { useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { useActor } from "@xstate/react";

import { Loading } from "features/auth/components";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { randomID } from "lib/utils/random";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { loadRaffles } from "./actions/loadRaffles";
import { ChapterRaffleResult } from "./ChapterRaffleResult";
import { RaffleDefinition } from "features/retreat/components/auctioneer/types";
import { RaffleCard } from "./UpcomingRaffles";

const rafflesFetcher = async ([, token]: [string, string]): Promise<
  RaffleDefinition[]
> => {
  return loadRaffles({
    token,
    transactionId: randomID(),
  });
};

export const RaffleHistory: React.FC = () => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);

  const token = authState.context.user.rawToken as string | undefined;
  const farmId = gameState.context.farmId ?? 0;
  const game = gameState.context.state;

  const [selectedItem, setSelectedItem] = useState<{
    type: "raffle";
    id: string;
  }>();

  const now = useNow();

  const {
    data: raffles,
    isLoading: rafflesLoading,
    error: rafflesError,
  } = useSWR(["raffles", token], rafflesFetcher, {
    revalidateOnFocus: false,
  });

  const completedRaffles = useMemo(() => {
    if (!raffles) {
      return [];
    }

    return raffles
      .filter((raffle) => raffle.endAt < now)
      .sort((a, b) => b.endAt - a.endAt);
  }, [raffles, now]);

  const historyItems = useMemo(() => {
    const items = [
      ...completedRaffles.map((raffle) => ({
        type: "raffle" as const,
        id: raffle.id,
        endAt: raffle.endAt,
        raffle,
      })),
    ];
    return items.sort((a, b) => b.endAt - a.endAt).slice(0, 50);
  }, [completedRaffles]);

  const selectedRaffle =
    selectedItem?.type === "raffle"
      ? completedRaffles.find((raffle) => raffle.id === selectedItem.id)
      : undefined;

  if (rafflesLoading || !game) {
    return (
      <div className="p-2">
        <Loading />
      </div>
    );
  }

  if (!historyItems.length) {
    return (
      <div className="p-2">
        <div className="text-sm">{t("auction.const.soon")}</div>
      </div>
    );
  }

  if (selectedRaffle) {
    return (
      <ChapterRaffleResult
        id={selectedRaffle.id}
        onClose={() => setSelectedItem(undefined)}
      />
    );
  }

  return (
    <div>
      <div className="">
        <div
          className="max-h-52 overflow-y-auto scrollable pr-1"
          data-testid="auction-history-list"
        >
          {historyItems.map((item) => {
            return (
              <RaffleCard
                key={item.id}
                raffle={item.raffle}
                onClick={() => setSelectedItem({ type: "raffle", id: item.id })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
