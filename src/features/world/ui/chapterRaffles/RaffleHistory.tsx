import React, { useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { useActor } from "@xstate/react";

import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import { Loading } from "features/auth/components";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { randomID } from "lib/utils/random";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { loadRaffles } from "./actions/loadRaffles";
import { loadRaffleResults, RaffleResults } from "./actions/loadRaffleResults";
import { ChapterRaffleResult } from "./ChapterRaffleResult";
import { RaffleDefinition } from "features/retreat/components/auctioneer/types";

const rafflesFetcher = async ([, token]: [string, string]): Promise<
  RaffleDefinition[]
> => {
  return loadRaffles({
    token,
    transactionId: randomID(),
  });
};

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
  } = useSWR(token ? ["raffles", token] : null, rafflesFetcher, {
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
      <div className="p-2">
        <div
          className="max-h-52 overflow-y-auto scrollable pr-1"
          data-testid="auction-history-list"
        >
          {historyItems.map((item) => {
            const isActiveRaffle = !!game.raffle?.active?.[item.id];

            return (
              <ButtonPanel
                key={`raffle-${item.id}`}
                onClick={() => setSelectedItem({ type: "raffle", id: item.id })}
                className="w-full mb-1 cursor-pointer !p-2 flex items-center"
              >
                <div className="relative w-12 h-12 flex items-center justify-center mr-2">
                  <img
                    src={SUNNYSIDE.ui.grey_background}
                    className="absolute inset-0 w-full h-full rounded-md"
                  />
                  <img
                    src={SUNNYSIDE.icons.treasure}
                    className="w-2/3 h-2/3 object-contain z-10"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm truncate">
                    {t("auction.raffle.results")}
                  </p>
                  <p className="text-xxs">
                    {new Date(item.endAt).toLocaleString("en-AU", {
                      timeZoneName: "shortOffset",
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
                <Label type="vibrant">{t("auction.raffle")}</Label>

                {isActiveRaffle && (
                  <img
                    src={SUNNYSIDE.icons.search}
                    className="h-6 absolute top-1 -right-0"
                  />
                )}
              </ButtonPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};
