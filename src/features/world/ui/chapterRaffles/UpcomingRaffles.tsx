import React, { useContext, useMemo, useState } from "react";
import useSWR from "swr";
import Decimal from "decimal.js-light";
import { useActor } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import petEggNFT from "assets/icons/pet_nft_egg.png";
import budSeedling from "assets/icons/bud_seedling.png";
import { Button } from "components/ui/Button";
import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { Loading } from "features/auth/components";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext, useGame } from "features/game/GameProvider";

import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { randomID } from "lib/utils/random";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
import { loadRaffles } from "./actions/loadRaffles";
import { RaffleDefinition } from "../../../retreat/components/auctioneer/types";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { getKeys } from "features/game/types/craftables";
import { toOrdinalSuffix } from "../../../retreat/components/auctioneer/AuctionLeaderboardTable";
import { Box } from "components/ui/Box";
import { InventoryItemName, Wardrobe } from "features/game/types/game";
import { PetNFTName } from "features/game/types/pets";
import { ChapterRaffleResult } from "./ChapterRaffleResult";
import { translate } from "lib/i18n/translate";
import { RafflePrizeTable } from "features/retreat/components/auctioneer/RaffleLeaderboardTable";

export const UpcomingRaffles: React.FC = () => {
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
  const [entryAmounts, setEntryAmounts] = useState<
    Partial<Record<InventoryItemName, Decimal>>
  >({});

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

  const selectedRaffle = upcomingRaffles.find(
    (raffle) => raffle.id === selectedRaffleId,
  );

  if (selectedRaffle && selectedRaffle.endAt < now) {
    return (
      <ChapterRaffleResult
        id={selectedRaffle.id}
        onClose={() => setSelectedRaffleId(undefined)}
      />
    );
  }

  if (selectedRaffle && showConfirmation) {
    return (
      <>
        <Label type="default">{t("auction.raffle.confirmation.title")}</Label>
        <div className="p-1">
          <p className="text-xs m-1">
            {t("auction.raffle.confirmation.description")}
          </p>
          {getKeys(selectedRaffle.entryRequirements ?? {}).map((item) => {
            const amount = entryAmounts[item] ?? new Decimal(0);

            if (!amount.gte(1)) {
              return null;
            }

            return (
              <div key={item} className="flex items-center mb-1 px-2">
                <img src={ITEM_DETAILS[item].image} className="h-4 mr-1" />
                <p className="text-xs ml-1">
                  {`${amount.toNumber()} x ${item}`}
                </p>
              </div>
            );
          })}
        </div>

        <Label type="danger" className="my-2">
          {t("auction.raffle.confirmation.noRefund")}
        </Label>

        <div className="flex items-center">
          <Button onClick={() => setShowConfirmation(false)}>{t("no")}</Button>
          <Button
            className="ml-1"
            onClick={() => {
              gameService.send({
                type: "auctionRaffle.entered",
                effect: {
                  type: "auctionRaffle.entered",
                  raffleId: selectedRaffle.id,
                  items: getKeys(selectedRaffle.entryRequirements ?? {}).reduce(
                    (acc, item) => {
                      const amount = entryAmounts[item] ?? new Decimal(0);

                      if (amount.gte(1)) {
                        acc[item] = amount.toNumber();
                      }

                      return acc;
                    },
                    {} as Partial<Record<InventoryItemName, number>>,
                  ),
                },
              });

              setShowConfirmation(false);
              setShowEntry(false);
              setEntryAmounts({});
            }}
          >
            {t("yes")}
          </Button>
        </div>
      </>
    );
  }

  if (selectedRaffle && showEntry) {
    const entryRequirements = selectedRaffle.entryRequirements ?? {};
    const entryItems = getKeys(entryRequirements);
    const totalEntryAmount = entryItems.reduce(
      (sum, item) => sum.add(entryAmounts[item] ?? new Decimal(0)),
      new Decimal(0),
    );
    const isEntryDisabled = entryItems.some((item) => {
      const amount = entryAmounts[item] ?? new Decimal(0);
      const inventoryCount = game.inventory[item] ?? new Decimal(0);

      return amount.gt(inventoryCount);
    });

    return (
      <>
        <Label className="mb-2" type="info">
          {t("auction.raffle.labelWithId", { id: selectedRaffle.id })}
        </Label>

        {entryItems.map((item) => {
          const amount = entryAmounts[item] ?? new Decimal(0);
          const inventoryCount = game.inventory[item] ?? new Decimal(0);
          const isMissing = amount.gt(inventoryCount);
          const entryValue = entryRequirements[item] ?? 0;

          return (
            <div key={item} className="flex items-center mb-2">
              <Box image={ITEM_DETAILS[item].image} count={inventoryCount} />
              <div className="flex-1">
                <div className="flex items-center ">
                  <NumberInput
                    value={amount}
                    maxDecimalPlaces={0}
                    onValueChange={(value) =>
                      setEntryAmounts((prev) => ({ ...prev, [item]: value }))
                    }
                  />
                  {amount.gt(0) && (
                    <img
                      src={SUNNYSIDE.icons.cancel}
                      className="h-6 cursor-pointer ml-2"
                      onClick={() =>
                        setEntryAmounts((prev) => ({
                          ...prev,
                          [item]: new Decimal(0),
                        }))
                      }
                    />
                  )}
                </div>

                {isMissing ? (
                  <Label type="danger">
                    {t("auction.raffle.missingChapterTicket", {
                      ticket: item,
                    })}
                  </Label>
                ) : (
                  <div className="flex">
                    <p className="text-xs ml-1">
                      {t("auction.raffle.chapterEntryInfo", {
                        count: Math.max(amount.toNumber(), 1),
                        ticket: item,
                        entries: Math.max(
                          amount.mul(entryValue).toNumber(),
                          entryValue,
                        ),
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <Button
          className="mt-2"
          disabled={isEntryDisabled || totalEntryAmount.eq(0)}
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
    const display = getPrizeDisplay({ prize: 1, raffle: selectedRaffle });
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
        <div className="p-1">
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

          <div>
            <div className="max-h-48 overflow-y-auto scrollable pr-1">
              <RafflePrizeTable prizes={selectedRaffle.prizes} />
            </div>
          </div>

          {isActiveRaffle && (
            <>
              <div className="flex items-center justify-between mt-2 ">
                <Label type={raffleEntries > 0 ? "success" : "formula"}>
                  {t("auction.raffle.entriesLabel", { count: raffleEntries })}
                </Label>
              </div>
            </>
          )}
        </div>
        {isActiveRaffle && (
          <Button onClick={() => setShowEntry(true)}>
            {raffleEntries ? t("auction.raffle.addMore") : t("raffle.enter")}
          </Button>
        )}
      </>
    );
  }

  return (
    <div>
      <p className="text-xs m-1 mb-2">{t("auction.raffle.description")}</p>
      <div className="p-0">
        <div className="max-h-52 overflow-y-auto scrollable pr-1">
          {upcomingRaffles.map((raffle) => {
            return (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                onClick={() => setSelectedRaffleId(raffle.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

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

export const formatRaffleWindow = (raffle: RaffleDefinition) =>
  `${formatRaffleDate(raffle.startAt)} - ${formatRaffleDate(raffle.endAt)}`;

export const getPrizeDisplay = ({
  prize,
  raffle,
}: {
  prize: number;
  raffle: RaffleDefinition;
}) => {
  const items = getKeys(raffle.prizes[prize].items ?? {});
  const wearables = getKeys(raffle.prizes[prize].wearables ?? {});

  const collectible = items.find((item) => isCollectible(item));
  const nft = raffle.prizes[prize].nft;

  if (nft) {
    const isBud = nft.includes("Bud");
    return {
      name: isBud ? "Bud NFT ?" : "Pet NFT ?",
      image: isBud ? budSeedling : petEggNFT,
      type: "nft" as const,
    };
  }

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
    name: translate("auction.raffle.prizeFallback"),
    image: SUNNYSIDE.icons.expression_confused,
    type: "item" as const,
  };
};

const CountdownLabel: React.FC<{ raffle: RaffleDefinition }> = ({ raffle }) => {
  const countdown = useCountdown(raffle.endAt);
  return <Label type="info">{`${formatCountdown(countdown)} left`}</Label>;
};

export const RaffleCard: React.FC<{
  raffle: RaffleDefinition;
  onClick: () => void;
}> = ({ raffle, onClick }) => {
  const { gameState } = useGame();
  const now = useNow({ live: true });
  const { t } = useAppTranslation();

  const game = gameState.context.state;
  const display = getPrizeDisplay({ prize: 1, raffle });
  const isCurrent = raffle.startAt <= now && raffle.endAt > now;

  const entries = game.raffle?.active?.[raffle.id]?.entries ?? 0;
  return (
    <ButtonPanel
      key={raffle.id}
      onClick={onClick}
      className="w-full mb-1 cursor-pointer !p-2 flex items-center overflow-hidden"
    >
      <div className="relative w-12 h-12 flex items-center justify-center mr-2">
        {display.type !== "wearable" ? (
          <>
            <img
              src={SUNNYSIDE.ui.grey_background}
              className="absolute inset-0 w-full h-full rounded-md"
            />
            <img
              src={display.image}
              className="w-2/3 h-2/3 object-contain z-10"
            />
          </>
        ) : (
          <img
            src={display.image}
            className="w-full object-contain z-10 rounded-md"
          />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm truncate mb-1 flex-1">
            {Object.keys(raffle.prizes ?? {})
              .map(
                (prize) =>
                  getPrizeDisplay({ prize: Number(prize), raffle }).name,
              )
              // Remove duplicates
              .filter((prize, index, self) => self.indexOf(prize) === index)
              .join(", ")}
          </p>
          {entries > 0 ? (
            <img src={SUNNYSIDE.icons.confirm} className="h-5" />
          ) : (
            <div className="flex">
              {getKeys(raffle.entryRequirements).map((item) => {
                return (
                  <img
                    key={item}
                    src={ITEM_DETAILS[item].image}
                    className="h-4 img-highlight -ml-1"
                  />
                );
              })}
            </div>
          )}
        </div>
        {isCurrent ? (
          <CountdownLabel raffle={raffle} />
        ) : (
          <p className="text-xxs">{formatRaffleWindow(raffle)}</p>
        )}
      </div>
    </ButtonPanel>
  );
};
