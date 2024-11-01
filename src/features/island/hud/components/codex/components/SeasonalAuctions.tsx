import React, { useContext, useEffect, useState } from "react";

import { useActor, useInterpret } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  Auction,
  MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import { GameState, InventoryItemName } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import { SeasonName, SEASONS } from "features/game/types/seasons";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "lib/utils/getImageURLS";
import { CollectibleName } from "features/game/types/craftables";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";

import lightning from "assets/icons/lightning.png";
import sfl from "assets/icons/sfl.webp";

import { Label } from "components/ui/Label";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { isMobile } from "mobile-device-detect";

type AuctionDetail = {
  supply: number;
  type: "collectible" | "wearable";
  auctions: Auction[];
};

type AuctionItems = Record<BumpkinItem | InventoryItemName, AuctionDetail>;

/**
 * Aggregates the seasonal auction items
 */
function getSeasonalAuctions({
  auctions,
  season,
}: {
  auctions: Auction[];
  season: SeasonName;
}) {
  const { startDate, endDate } = SEASONS[season];

  // Aggregate supplies
  let details: AuctionItems = auctions.reduce((acc, auction) => {
    const type = auction.type;
    const name =
      auction.type === "wearable" ? auction.wearable : auction.collectible;

    const existing = acc[name];

    if (existing) {
      existing.auctions.push(auction);
      existing.supply += auction.supply;
    } else {
      acc[name] = {
        type,
        supply: auction.supply,
        auctions: [auction],
      };
    }

    return acc;
  }, {} as AuctionItems);

  // Filter out any not in this season
  details = getKeys(details).reduce((acc, name) => {
    const hasNoSeasonAuctions = details[name].auctions.every(
      (auction) =>
        auction.startAt < startDate.getTime() ||
        auction.startAt > endDate.getTime(),
    );

    if (hasNoSeasonAuctions) {
      return acc;
    }

    return {
      ...acc,
      [name]: details[name],
    };
  }, {} as AuctionItems);

  return details;
}

const NextDrop: React.FC<{ auctions: AuctionItems }> = ({ auctions }) => {
  const { t } = useAppTranslation();

  let drops = getKeys(auctions).reduce((acc, name) => {
    return [...acc, ...auctions[name].auctions];
  }, [] as Auction[]);

  drops = drops.sort((a, b) => (a.startAt > b.startAt ? 1 : -1));

  const nextDrop = drops.find((drop) => drop.startAt > Date.now());

  const starts = useCountdown(nextDrop?.startAt ?? 0);

  if (!nextDrop) {
    return null;
  }

  const image =
    nextDrop.type === "collectible"
      ? ITEM_DETAILS[nextDrop.collectible as CollectibleName].image
      : getImageUrl(ITEM_IDS[nextDrop.wearable as BumpkinItem]);

  const buffLabel =
    nextDrop.type === "collectible"
      ? COLLECTIBLE_BUFF_LABELS[nextDrop.collectible as CollectibleName]
      : BUMPKIN_ITEM_BUFF_LABELS[nextDrop.wearable as BumpkinItem];

  return (
    <InnerPanel className="mb-1">
      <div className="p-1">
        <div className="flex justify-between mb-1 flex-wrap wrap">
          <Label className="-ml-1 mb-1" type="default">
            {t("season.codex.nextDrop")}
          </Label>
          {getKeys(nextDrop.ingredients).map((name) => (
            <Label
              type="formula"
              icon={nextDrop.sfl > 0 ? sfl : ITEM_DETAILS[name].image}
              className="mb-1"
              key={name}
            >
              {t("season.codex.nextDrop.available", {
                dropSupply: nextDrop.supply,
              })}
            </Label>
          ))}
        </div>
        <div className="flex justify-between items-start">
          <div className="flex w-full">
            <div className="w-12 h-12  mr-1">
              <img src={image} className="h-full mx-auto" />
            </div>
            <div className="flex justify-between flex-1 flex-wrap">
              <div className="mb-1">
                <p className="text-sm mb-1">
                  {nextDrop.type === "collectible"
                    ? nextDrop.collectible
                    : nextDrop.wearable}
                </p>
                {buffLabel ? (
                  <div className="flex">
                    {isMobile ? (
                      <Label
                        type="vibrant"
                        icon={lightning}
                        style={{
                          marginLeft: "4px",
                        }}
                      >
                        {nextDrop.type === "collectible"
                          ? t("collectible")
                          : t("wearable")}
                      </Label>
                    ) : (
                      <Label
                        type={buffLabel.labelType}
                        icon={buffLabel.boostTypeIcon}
                        secondaryIcon={buffLabel.boostedItemIcon}
                        style={{
                          marginLeft: "4px",
                        }}
                      >
                        {buffLabel.shortDescription}
                      </Label>
                    )}
                  </div>
                ) : (
                  <div className="flex">
                    <Label
                      type="default"
                      icon={SUNNYSIDE.icons.heart}
                      style={{
                        marginLeft: "7px",
                      }}
                    >
                      {nextDrop.type === "collectible"
                        ? t("decoration")
                        : t("cosmetic")}
                    </Label>
                  </div>
                )}
              </div>
              <div className="flex flex-col text-center mt-0.5 text-base">
                <TimerDisplay time={starts} />
                <span className="text-xs">
                  {new Date(nextDrop.startAt).toLocaleString().slice(0, -3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InnerPanel>
  );
};

const Drops: React.FC<{
  detail: AuctionDetail;
  name: BumpkinItem | InventoryItemName;
}> = ({ detail, name }) => {
  const { t } = useAppTranslation();
  const buffLabel =
    detail.type === "collectible"
      ? COLLECTIBLE_BUFF_LABELS[name as CollectibleName]
      : BUMPKIN_ITEM_BUFF_LABELS[name as BumpkinItem];

  return (
    <>
      <div className="p-1">
        <p className="text-sm mb-1">{name}</p>
        <Label type="default" className="mt-1 mb-1">
          {detail.type === "collectible" ? t("collectible") : t("wearable")}
        </Label>
        {buffLabel ? (
          <div className="flex">
            <img src={lightning} className="h-4 mr-0.5" />
            <p className="text-xs">{buffLabel.shortDescription}</p>
          </div>
        ) : detail.type === "collectible" ? (
          <div className="flex">
            <img src={SUNNYSIDE.icons.heart} className="h-4 mr-0.5" />
            <p className="text-xs">{t("decoration")}</p>
          </div>
        ) : (
          <div className="flex">
            <img src={SUNNYSIDE.icons.heart} className="h-4 mr-0.5" />
            <p className="text-xs">{t("cosmetic")}</p>
          </div>
        )}
      </div>
      <div
        style={{ maxHeight: "300px" }}
        className="overflow-y-auto divide-brown-600 pb-0 scrollable pr-1"
      >
        {detail.auctions.map((drop) => {
          return (
            <InnerPanel className="mb-1" key={drop.auctionId}>
              <div className="p-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <img
                        src={SUNNYSIDE.icons.stopwatch}
                        className="h-4 mr-1"
                      />
                      <span className="text-xs">
                        {new Date(drop.startAt).toLocaleString().slice(0, -3)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs mb-1">{`Requires:`}</span>
                      <div className="flex items-center justify-center">
                        {drop.sfl > 0 && (
                          <div className="flex items-center">
                            <img src={sfl} className="h-4" />
                          </div>
                        )}
                        {getKeys(drop.ingredients).map((name) => (
                          <div className="flex items-center ml-1" key={name}>
                            <img
                              src={ITEM_DETAILS[name].image}
                              className="h-4"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {drop.startAt > Date.now() ? (
                    <Label type="formula">
                      {t("season.codex.nextDrop.available", {
                        dropSupply: drop.supply,
                      })}
                    </Label>
                  ) : (
                    <Label type="danger">{t("statements.soldOut")}</Label>
                  )}
                </div>
              </div>
            </InnerPanel>
          );
        })}
      </div>
    </>
  );
};

interface Props {
  gameState: GameState;
  farmId: number;
  season: SeasonName;
}

export const SeasonalAuctions: React.FC<Props> = ({
  farmId,
  gameState,
  season,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [selected, setSelected] = useState<InventoryItemName | BumpkinItem>();

  const auctionService = useInterpret(
    createAuctioneerMachine({
      onUpdate: () => {
        // No op
      },
    }),
    {
      context: {
        farmId: farmId,
        token: authState.context.user.rawToken,
        bid: gameState.auctioneer.bid,
        deviceTrackerId: "0x",
        canAccess: true,
        linkedAddress: "0x",
      },
    },
  ) as unknown as MachineInterpreter;

  const [auctioneerState] = useActor(auctionService);

  useEffect(() => {
    auctionService.send("OPEN", { gameState });
  }, []);

  if (auctioneerState.matches("idle")) {
    return null;
  }

  if (auctioneerState.matches("loading")) {
    return <Loading />;
  }

  const auctionItems = getSeasonalAuctions({
    auctions: auctioneerState.context.auctions,
    season,
  });

  return (
    <>
      <ModalOverlay
        show={!!selected}
        onBackdropClick={() => setSelected(undefined)}
      >
        <CloseButtonPanel
          container={OuterPanel}
          onClose={() => setSelected(undefined)}
        >
          {selected && (
            <Drops name={selected} detail={auctionItems[selected]} />
          )}
        </CloseButtonPanel>
      </ModalOverlay>

      <NextDrop auctions={auctionItems} />

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2">
            <Label className="-ml-1" type="default">
              {t("season.codex.seasonalDrops")}
            </Label>
          </div>
          <p className="text-xs mb-2">
            {t("season.codex.seasonalDrops.description")}
          </p>

          <div className="flex flex-col -mx-1">
            {getKeys(auctionItems).map((name) => {
              const details = auctionItems[name];
              const isCollectible = details.type === "collectible";

              const image = isCollectible
                ? ITEM_DETAILS[name as CollectibleName].image
                : getImageUrl(ITEM_IDS[name as BumpkinItem]);

              const buffLabel = isCollectible
                ? COLLECTIBLE_BUFF_LABELS[name as CollectibleName]
                : BUMPKIN_ITEM_BUFF_LABELS[name as BumpkinItem];

              const remainingAuctions = details.auctions.filter(
                (auction) => auction.startAt > Date.now(),
              );
              const remainingLeft = remainingAuctions.reduce(
                (total, auction) => total + auction.supply,
                0,
              );

              return (
                <ButtonPanel
                  onClick={() => setSelected(name)}
                  key={name}
                  className="relative"
                >
                  <div className="flex">
                    <div className="w-12 h-12  mr-1">
                      <img src={image} className="h-full mx-auto" />
                    </div>
                    <div>
                      <p className="text-sm mb-1">{name}</p>
                      {buffLabel ? (
                        <div className="flex">
                          <img src={lightning} className="h-4 mr-0.5" />
                          <p className="text-xs">
                            {buffLabel.shortDescription}
                          </p>
                        </div>
                      ) : isCollectible ? (
                        <div className="flex">
                          <img
                            src={SUNNYSIDE.icons.heart}
                            className="h-4 mr-0.5"
                          />
                          <p className="text-xs">{t("decoration")}</p>
                        </div>
                      ) : (
                        <div className="flex">
                          <img
                            src={SUNNYSIDE.icons.heart}
                            className="h-4 mr-0.5"
                          />
                          <p className="text-xs">{t("cosmetic")}</p>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-0 right-0 flex space-x-2">
                      {!isMobile && (
                        <Label type="default">
                          {isCollectible ? t("collectible") : t("wearable")}
                        </Label>
                      )}
                      {remainingLeft === 0 ? (
                        <Label type="danger">{t("season.codex.soldOut")}</Label>
                      ) : remainingLeft <= 50 ? (
                        <Label type="formula">{`${remainingLeft} left`}</Label>
                      ) : (
                        <Label type="default">{`${remainingLeft} left`}</Label>
                      )}
                    </div>
                  </div>
                </ButtonPanel>
              );
            })}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
