import React, { useContext, useMemo, useState } from "react";
import useSWR from "swr";
import Decimal from "decimal.js-light";
import { useActor } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import petEggNFT from "assets/icons/pet_nft_egg.png";
import { Button } from "components/ui/Button";
import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { Loading } from "features/auth/components";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import {
  getChapterRaffleTicket,
  getChapterTicket,
} from "features/game/types/chapters";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { randomID } from "lib/utils/random";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
import { loadRaffles } from "./actions/loadRaffles";
import { RaffleDefinition } from "./types";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { getKeys } from "features/game/types/craftables";
import { toOrdinalSuffix } from "./AuctionLeaderboardTable";
import { Box } from "components/ui/Box";
import { InventoryItemName, Wardrobe } from "features/game/types/game";
import { PetNFTName } from "features/game/types/pets";
import { RaffleHistory } from "./AuctionRaffleHistory";

export const AuctioneerRaffle: React.FC = () => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);
  const [showEntry, setShowEntry] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const game = gameState.context.state;

  const token = authState.context.user.rawToken as string | undefined;

  const [selectedRaffleId, setSelectedRaffleId] = useState<string>();
  const [entryType, setEntryType] = useState<"chapterTicket" | "raffleTicket">(
    "chapterTicket",
  );
  const [ticketAmount, setTicketAmount] = useState<Decimal>(new Decimal(0));
  const [raffleTicketAmount, setRaffleTicketAmount] = useState<Decimal>(
    new Decimal(0),
  );

  const rafflesFetcher = async ([, authToken]: [string, string]) => {
    return loadRaffles({
      token: authToken,
      transactionId: randomID(),
    });
  };

  const {
    data: raffles,
    isLoading,
    error,
  } = useSWR(["raffles", token], rafflesFetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    throw error;
  }

  const upcomingRaffles = useMemo(() => {
    if (!raffles) {
      return [];
    }

    return raffles
      .filter((raffle) => raffle.endAt > now)
      .sort((a, b) => a.startAt - b.startAt);
  }, [raffles, now]);

  if (isLoading || !game) {
    return (
      <div className="p-2">
        <Loading />
      </div>
    );
  }

  if (!upcomingRaffles.length) {
    return (
      <div className="p-2">
        <p className="text-xs">{t("auction.raffle.moreComing")}</p>
      </div>
    );
  }

  const formatCountdown = (countdown: ReturnType<typeof useCountdown>) => {
    if (countdown.days > 0) {
      return `${countdown.days}d ${countdown.hours}h`;
    }

    if (countdown.hours > 0) {
      return `${countdown.hours}h ${countdown.minutes}m`;
    }

    return `${countdown.minutes}m ${countdown.seconds}s`;
  };

  const formatRaffleDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = toOrdinalSuffix(date.getDate());
    const month = date.toLocaleString("en-AU", { month: "short" });
    const hour = date.toLocaleString("en-AU", {
      hour: "2-digit",
      hour12: false,
    });
    const minute = date.toLocaleString("en-AU", { minute: "2-digit" });
    return `${hour.substring(0, 2)}:${minute.substring(0, 2).padStart(2, "0")} ${day} ${month}`;
  };

  const formatRaffleWindow = (raffle: RaffleDefinition) =>
    `${formatRaffleDate(raffle.startAt)} - ${formatRaffleDate(raffle.endAt)}`;

  const getFirstPrizeDisplay = (raffle: RaffleDefinition) => {
    const items = getKeys(raffle.prizes[1].items ?? {});
    const wearables = getKeys(raffle.prizes[1].wearables ?? {});

    const collectible = items.find((item) => isCollectible(item));

    if (collectible) {
      return {
        name: collectible,
        image: ITEM_DETAILS[collectible].image,
        type: "collectible" as const,
      };
    }

    if (wearables[0]) {
      return {
        name: wearables[0],
        image: getImageUrl(ITEM_IDS[wearables[0]]),
        type: "wearable" as const,
      };
    }

    if (items[0]) {
      return {
        name: items[0],
        image: ITEM_DETAILS[items[0]].image,
        type: "item" as const,
      };
    }

    return {
      name: t("auction.raffle.prizeFallback"),
      image: SUNNYSIDE.icons.expression_confused,
      type: "item" as const,
    };
  };

  const CountdownLabel: React.FC<{ raffle: RaffleDefinition }> = ({
    raffle,
  }) => {
    const countdown = useCountdown(raffle.endAt);
    return <Label type="info">{`${formatCountdown(countdown)} left`}</Label>;
  };

  const selectedRaffle = upcomingRaffles.find(
    (raffle) => raffle.id === selectedRaffleId,
  );

  if (selectedRaffle && selectedRaffle.endAt < now) {
    return (
      <RaffleHistory
        id={selectedRaffle.id}
        onClose={() => setSelectedRaffleId(undefined)}
      />
    );
  }

  if (selectedRaffle && showConfirmation) {
    return (
      <>
        <Label type="danger">{t("auction.raffle.confirmation.title")}</Label>
        <div className="p-1">
          <p className="text-xs m-1">
            {t("auction.raffle.confirmation.description")}
          </p>
          {ticketAmount.gte(1) && (
            <div className="flex items-center mb-1 px-2">
              <img
                src={ITEM_DETAILS[getChapterTicket(now)].image}
                className="h-4 mr-1"
              />
              <p className="text-xs ml-1">
                {`${ticketAmount.toNumber()} x ${getChapterTicket(now)}`}
              </p>
            </div>
          )}

          {raffleTicketAmount.gte(1) && (
            <div className="flex items-center mb-2 px-2">
              <img
                src={ITEM_DETAILS[getChapterRaffleTicket(now)].image}
                className="h-4 mr-1"
              />
              <p className="text-xs ml-1">
                {`${raffleTicketAmount.toNumber()} x ${getChapterRaffleTicket(now)}`}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Button onClick={() => setShowConfirmation(false)}>{t("no")}</Button>
          <Button
            className="ml-1"
            onClick={() => {
              gameService.send("auctionRaffle.entered", {
                effect: {
                  type: "auctionRaffle.entered",
                  raffleId: selectedRaffle.id,
                  tickets: ticketAmount.toNumber(),
                  raffleTickets: raffleTicketAmount.toNumber(),
                },
              });

              setShowConfirmation(false);
              setShowEntry(false);
              setTicketAmount(new Decimal(0));
              setRaffleTicketAmount(new Decimal(0));
            }}
          >
            {t("yes")}
          </Button>
        </div>
      </>
    );
  }

  if (selectedRaffle && showEntry) {
    const chapterTicket = getChapterTicket(now);
    const chapterTicketCount = game.inventory[chapterTicket] ?? new Decimal(0);
    const raffleTicket = getChapterRaffleTicket(now);
    const raffleTicketCount = game.inventory[raffleTicket] ?? new Decimal(0);

    const isMissingChapterTickets =
      entryType === "chapterTicket" && ticketAmount.gt(chapterTicketCount);
    const isMissingRaffleTickets = raffleTicketAmount.gt(raffleTicketCount);
    const isEntryDisabled = isMissingRaffleTickets || isMissingChapterTickets;

    return (
      <>
        <Label className="mb-2" type="info">
          {t("auction.raffle.labelWithId", { id: selectedRaffle.id })}
        </Label>

        <p className="text-xs mx-1 mb-2">{t("auction.raffle.entryInfo")}</p>

        <div className="flex items-center mb-2">
          <Box
            image={ITEM_DETAILS[chapterTicket].image}
            count={chapterTicketCount}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <NumberInput
                value={ticketAmount}
                maxDecimalPlaces={0}
                onValueChange={setTicketAmount}
              />
              {ticketAmount.gt(0) && (
                <img
                  src={SUNNYSIDE.icons.cancel}
                  className="h-6 cursor-pointer"
                  onClick={() => setTicketAmount(new Decimal(0))}
                />
              )}
            </div>

            {isMissingChapterTickets ? (
              <Label type="danger">
                {t("auction.raffle.missingChapterTicket", {
                  ticket: chapterTicket,
                })}
              </Label>
            ) : (
              <div className="flex">
                <p className="text-xs ml-1">
                  {t("auction.raffle.chapterEntryInfo", {
                    count: Math.max(ticketAmount.toNumber(), 1),
                    ticket: chapterTicket,
                    entries: Math.max(ticketAmount.mul(10).toNumber(), 10),
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <Box
            image={ITEM_DETAILS[raffleTicket].image}
            count={raffleTicketCount}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <NumberInput
                value={raffleTicketAmount}
                maxDecimalPlaces={0}
                onValueChange={setRaffleTicketAmount}
              />
              {raffleTicketAmount.gt(0) && (
                <img
                  src={SUNNYSIDE.icons.cancel}
                  className="h-6 cursor-pointer"
                  onClick={() => setRaffleTicketAmount(new Decimal(0))}
                />
              )}
            </div>

            {isMissingRaffleTickets ? (
              <Label type="danger">
                {t("auction.raffle.missingRaffleTickets")}
              </Label>
            ) : (
              <div className="flex">
                <p className="text-xs ml-1">
                  {t("auction.raffle.raffleEntryInfo", {
                    count: Math.max(raffleTicketAmount.toNumber(), 1),
                    entries: Math.max(raffleTicketAmount.mul(1).toNumber(), 1),
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
        <Button
          className="mt-2"
          disabled={
            isEntryDisabled || (ticketAmount.eq(0) && raffleTicketAmount.eq(0))
          }
          onClick={() => {
            setShowConfirmation(true);
          }}
        >
          {t("auction.raffle.enterAction")}
        </Button>
      </>
    );
  }

  if (selectedRaffle) {
    const display = getFirstPrizeDisplay(selectedRaffle);
    const raffleEntries =
      game.raffle?.active?.[selectedRaffle.id]?.entries ?? 0;

    const isActiveRaffle =
      selectedRaffle.endAt > now && selectedRaffle.startAt < now;

    const items: Partial<Record<InventoryItemName, number>> = {};
    const wearables: Wardrobe = {};
    const nfts: PetNFTName[] = [];
    getKeys(selectedRaffle.prizes).forEach((position) => {
      const prize = selectedRaffle.prizes[position];

      getKeys(prize.items ?? {}).forEach((item) => {
        items[item] = (items[item] ?? 0) + (prize.items?.[item] ?? 0);
      });

      getKeys(prize.wearables ?? {}).forEach((wearable) => {
        wearables[wearable] =
          (wearables[wearable] ?? 0) + (prize.wearables?.[wearable] ?? 0);
      });

      if (prize.nft) {
        nfts.push(prize.nft);
      }
    });

    return (
      <>
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="h-6 cursor-pointer"
              onClick={() => setSelectedRaffleId(undefined)}
            />
            <div className="flex justify-between">
              <Label type="default" className="mr-1">
                {t("auction.raffle.details")}
              </Label>
              {isActiveRaffle && <CountdownLabel raffle={selectedRaffle} />}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <img
                  src={SUNNYSIDE.ui.grey_background}
                  className="absolute inset-0 w-full h-full rounded-md"
                />
                <img
                  src={display.image}
                  className="w-2/3 h-2/3 object-contain z-10"
                />
              </div>
              <div>
                <p className="text-sm">{display.name}</p>
                <p className="text-xxs">{formatRaffleWindow(selectedRaffle)}</p>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <Label type="default" className="mb-1">
              {t("auction.raffle.prizes")}
            </Label>
            <p className="text-xs mb-2">
              {t("auction.raffle.prizePool", {
                count: Object.keys(selectedRaffle.prizes).length,
              })}
            </p>
            <div className="flex flex-col flex-wrap gap-x-3 text-xs">
              {nfts.map((nft) => (
                <div key={nft} className="flex items-center">
                  <img src={petEggNFT} className="w-4 mr-1" />
                  <span className="text-xs">{nft}</span>
                </div>
              ))}
              {getKeys(items).map((item) => (
                <div key={item} className="flex items-center">
                  <img src={ITEM_DETAILS[item].image} className="w-4 mr-1" />
                  <span className="text-xs">{`${items[item]} x ${item}`}</span>
                </div>
              ))}
              {getKeys(wearables).map((wearable) => (
                <div key={wearable} className="flex items-center">
                  <img
                    src={getImageUrl(ITEM_IDS[wearable])}
                    className="w-4 mr-1"
                  />
                  <span className="text-xs">
                    {`${wearables[wearable]} x ${wearable}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isActiveRaffle && (
            <>
              <div className="flex items-center justify-between mt-4 ">
                <Label type={raffleEntries > 0 ? "success" : "formula"}>
                  {t("auction.raffle.entriesLabel", { count: raffleEntries })}
                </Label>
              </div>
            </>
          )}
        </div>
        <Button onClick={() => setShowEntry(true)}>
          {raffleEntries ? t("auction.raffle.addMore") : t("raffle.enter")}
        </Button>
      </>
    );
  }

  return (
    <div>
      <div className="p-2">
        <div className="max-h-52 overflow-y-auto scrollable pr-1">
          {upcomingRaffles.map((raffle) => {
            const display = getFirstPrizeDisplay(raffle);
            const isCurrent = raffle.startAt <= now && raffle.endAt > now;

            const entries = game.raffle?.active?.[raffle.id]?.entries ?? 0;

            return (
              <ButtonPanel
                key={raffle.id}
                onClick={() => setSelectedRaffleId(raffle.id)}
                className="w-full mb-1 cursor-pointer !p-2 flex items-center"
              >
                <div className="relative w-12 h-12 flex items-center justify-center mr-2">
                  <img
                    src={SUNNYSIDE.ui.grey_background}
                    className="absolute inset-0 w-full h-full rounded-md"
                  />
                  <img
                    src={display.image}
                    className="w-2/3 h-2/3 object-contain z-10"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm truncate mb-1">
                    {Object.keys(raffle.prizes ?? {}).length > 1
                      ? t(`auction.raffle.items`, {
                          item: display.name,
                          extra: Object.keys(raffle.prizes ?? {}).length - 1,
                        })
                      : display.name}
                  </p>
                  {isCurrent ? (
                    <CountdownLabel raffle={raffle} />
                  ) : (
                    <p className="text-xxs">{formatRaffleWindow(raffle)}</p>
                  )}
                </div>
              </ButtonPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};
