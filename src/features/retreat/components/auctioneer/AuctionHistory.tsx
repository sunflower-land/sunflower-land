import React, { useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { useActor } from "@xstate/react";

import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import { Loading } from "features/auth/components";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { Auction, AuctionResults } from "features/game/lib/auctionMachine";
import { getAuctionResults } from "features/game/actions/getAuctionResults";
import { loadAuctions } from "./actions/loadAuctions";
import { getAuctionItemDisplay } from "./lib/getAuctionItemDisplay";
import { AuctionLeaderboardTable } from "./AuctionLeaderboardTable";
import { SUNNYSIDE } from "assets/sunnyside";
import { randomID } from "lib/utils/random";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";

const historyFetcher = async ([, token]: [string, string]): Promise<
  Auction[]
> => {
  const { auctions } = await loadAuctions({
    token,
    transactionId: randomID(),
  });

  return auctions;
};

const resultsFetcher = async ([, auctionId, token, farmId]: [
  string,
  string,
  string,
  number | undefined,
]): Promise<AuctionResults> => {
  const result = await getAuctionResults({
    auctionId,
    token,
    farmId: Number(farmId ?? 0),
    transactionId: randomID(),
  });

  return {
    ...result,
    rank: 0,
  } as AuctionResults;
};

export const AuctionHistory: React.FC = () => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);

  const token = authState.context.user.rawToken as string | undefined;
  const farmId = gameState.context.farmId ?? 0;
  const game = gameState.context.state;

  const [selectedAuctionId, setSelectedAuctionId] = useState<string>();

  const now = useNow();

  const {
    data: auctions,
    isLoading: auctionsLoading,
    error: auctionsError,
  } = useSWR(token ? ["auction-history", token] : null, historyFetcher, {
    revalidateOnFocus: false,
  });

  if (auctionsError) {
    throw auctionsError;
  }

  const completedAuctions = useMemo(() => {
    if (!auctions) {
      return [];
    }

    return auctions
      .filter((auction) => auction.endAt < now)
      .sort((a, b) => b.endAt - a.endAt)
      .slice(0, 20);
  }, [auctions, now]);

  const selectedAuction = completedAuctions.find(
    (auction) => auction.auctionId === selectedAuctionId,
  );

  const {
    data: selectedResults,
    isLoading: resultsLoading,
    error: resultsError,
  } = useSWR(
    token && selectedAuction
      ? ["auction-results", selectedAuction.auctionId, token, farmId]
      : null,
    resultsFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  if (resultsError) {
    throw resultsError;
  }

  if (auctionsLoading || !game) {
    return (
      <div className="p-2">
        <Loading />
      </div>
    );
  }

  if (!completedAuctions.length) {
    return (
      <div className="p-2">
        <div className="text-sm">{t("auction.const.soon")}</div>
      </div>
    );
  }

  if (selectedAuction) {
    const selectedDisplay = getAuctionItemDisplay({
      auction: selectedAuction,
      skills: game.bumpkin.skills,
      collectibles: game.collectibles,
    });

    return (
      <div>
        <div className="p-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="h-6 cursor-pointer"
              onClick={() => setSelectedAuctionId(undefined)}
            />
            <Label type="default">{t("auction.results")}</Label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <img
                  src={SUNNYSIDE.ui.grey_background}
                  className="absolute inset-0 w-full h-full rounded-md"
                />
                <img
                  src={selectedDisplay.image}
                  className="w-2/3 h-2/3 object-contain z-10"
                />
              </div>
              <div>
                <p className="text-sm">{selectedDisplay.item}</p>
                <Label type="transparent" className="!px-1 !py-0.5 mt-1">
                  {selectedDisplay.typeLabel}
                </Label>
                <p className="text-xxs ">
                  {t("auction.closed")}{" "}
                  {new Date(selectedAuction.endAt).toLocaleString("en-AU", {
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
            </div>
            <div className="text-right text-xxs ">
              <div>{`Supply: ${selectedAuction.supply}`}</div>
              {selectedResults && (
                <div>{`Participants: ${selectedResults.participantCount}`}</div>
              )}
            </div>
          </div>

          {resultsLoading && <Loading />}

          {!resultsLoading && selectedResults && (
            <div className="flex flex-col gap-1">
              {selectedResults.leaderboard.length > 0 ? (
                <AuctionLeaderboardTable
                  leaderboard={selectedResults.leaderboard}
                  showHeader
                  farmId={farmId}
                  status={selectedResults.status}
                />
              ) : (
                <p className="text-xxs">{t("auction.results.notAvailable")}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-2">
        <div
          className="max-h-52 overflow-y-auto scrollable pr-1"
          data-testid="auction-history-list"
        >
          {completedAuctions.map((auction) => {
            const { image, item, typeLabel } = getAuctionItemDisplay({
              auction,
              skills: game.bumpkin.skills,
              collectibles: game.collectibles,
            });

            return (
              <ButtonPanel
                key={auction.auctionId}
                onClick={() => setSelectedAuctionId(auction.auctionId)}
                className="w-full mb-1 cursor-pointer !p-2 flex items-center"
              >
                <div className="relative w-12 h-12 flex items-center justify-center mr-2">
                  <img
                    src={SUNNYSIDE.ui.grey_background}
                    className="absolute inset-0 w-full h-full rounded-md"
                  />
                  <img
                    src={image}
                    className="w-2/3 h-2/3 object-contain z-10"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm truncate">{item}</p>
                  <p className="text-xxs">
                    {new Date(auction.endAt).toLocaleString("en-AU", {
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
                <Label type="transparent">{typeLabel}</Label>
              </ButtonPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};
