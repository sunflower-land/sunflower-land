import React, { useContext, useEffect, useState } from "react";

import { useActor, useActorRef, useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  Auction,
  MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import {
  AuctionNFT,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import {
  getCurrentChapter,
  ChapterName,
  CHAPTERS,
} from "features/game/types/chapters";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";

import lightning from "assets/icons/lightning.png";
import sfl from "assets/icons/flower_token.webp";
import chapterIcon from "assets/icons/chapter_icon_3.webp";

import { Label } from "components/ui/Label";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { isMobile } from "mobile-device-detect";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { getAuctionItemType } from "features/retreat/components/auctioneer/lib/getAuctionItemType";
import { getAuctionItemDisplay } from "features/retreat/components/auctioneer/lib/getAuctionItemDisplay";
import { useNow } from "lib/utils/hooks/useNow";

type AuctionDetail = {
  supply: number;
  type: "collectible" | "wearable" | "nft";
  auctions: Auction[];
};

type AuctionItems = Record<
  BumpkinItem | InventoryItemName | AuctionNFT,
  AuctionDetail
>;

/**
 * Aggregates the seasonal auction items
 */
function getChapterAuctions({
  auctions,
  chapter,
}: {
  auctions: Auction[];
  chapter: ChapterName;
}) {
  const { startDate, endDate } = CHAPTERS[chapter];
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const chapterAuctions = auctions.filter(
    (auction) => auction.startAt >= startTime && auction.startAt <= endTime,
  );

  // Aggregate supplies
  const details: AuctionItems = chapterAuctions.reduce((acc, auction) => {
    const name = getAuctionItemType(auction);

    const existing = acc[name];

    if (existing) {
      existing.auctions.push(auction);
      existing.supply += auction.supply;
    } else {
      acc[name] = {
        type: auction.type,
        supply: auction.supply,
        auctions: [auction],
      };
    }

    return acc;
  }, {} as AuctionItems);

  return { details };
}

const NextDrop: React.FC<{ auctions: AuctionItems; game: GameState }> = ({
  auctions,
  game,
}) => {
  const { t } = useAppTranslation();
  const now = useNow();

  let drops = getKeys(auctions).reduce((acc, name) => {
    return [...acc, ...auctions[name].auctions];
  }, [] as Auction[]);

  drops = drops.sort((a, b) => (a.startAt > b.startAt ? 1 : -1));

  const nextDrop = drops.find((drop) => drop.startAt > now);

  const starts = useCountdown(nextDrop?.startAt ?? 0);

  if (!nextDrop) {
    return null;
  }

  const { image, buffLabels, item } = getAuctionItemDisplay({
    auction: nextDrop,
    skills: game.bumpkin.skills,
    collectibles: game.collectibles,
  });

  const nextDropTime = new Date(nextDrop.startAt).toLocaleString("en-AU", {
    timeZoneName: "shortOffset",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <InnerPanel className="mb-1">
      <div className="p-1">
        <div className="flex justify-between mb-1 flex-wrap wrap">
          <Label className="-ml-1 mb-1" type="default">
            {t("season.codex.nextDrop")}
          </Label>
          {nextDrop.sfl > 0 && (
            <Label type="formula" icon={sfl} className="mb-1">
              {t("season.codex.nextDrop.available", {
                dropSupply: nextDrop.supply,
              })}
            </Label>
          )}
          {getKeys(nextDrop.ingredients).map((name) => (
            <Label
              type="formula"
              icon={ITEM_DETAILS[name].image}
              className="mb-1"
              key={`${name}-${nextDrop.startAt}`}
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
                <p className="text-sm mb-1">{item}</p>
                {buffLabels ? (
                  <div className="flex">
                    {isMobile ? (
                      <Label
                        type="vibrant"
                        icon={lightning}
                        style={{
                          marginLeft: "3px",
                        }}
                      >
                        {nextDrop.type === "collectible"
                          ? t("collectible")
                          : t("wearable")}
                      </Label>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {buffLabels.map(
                          ({
                            labelType,
                            boostTypeIcon,
                            boostedItemIcon,
                            shortDescription,
                          }) => (
                            <Label
                              key={shortDescription}
                              type={labelType}
                              icon={boostTypeIcon}
                              secondaryIcon={boostedItemIcon}
                            >
                              {shortDescription}
                            </Label>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex">
                    <Label
                      type="default"
                      icon={SUNNYSIDE.icons.heart}
                      style={{
                        marginLeft: "6px",
                      }}
                    >
                      {nextDrop.type === "collectible"
                        ? t("decoration")
                        : t("cosmetic")}
                    </Label>
                  </div>
                )}
                {isMobile && (
                  <div className="flex flex-col text-start text-base">
                    <TimerDisplay time={starts} />
                    <span className="text-xs">{nextDropTime}</span>
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className="flex flex-col text-end text-base">
                  <TimerDisplay time={starts} />
                  <span className="text-xs">{nextDropTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </InnerPanel>
  );
};

const Drops: React.FC<{
  detail: AuctionDetail;
  name: BumpkinItem | InventoryItemName | AuctionNFT;
  maxSupply: number;
  game: GameState;
}> = ({ detail, name, maxSupply, game }) => {
  const { t } = useAppTranslation();
  const auction = detail.auctions[0];
  const now = useNow();

  const { buffLabels, typeLabel } = getAuctionItemDisplay({
    auction,
    skills: game.bumpkin.skills,
    collectibles: game.collectibles,
  });
  const currentChapter = getCurrentChapter(now);
  const chapter = CHAPTERS[currentChapter];
  const chapterSupply = detail.auctions.reduce((acc, drop) => {
    if (
      drop.startAt < chapter.startDate.getTime() ||
      drop.startAt > chapter.endDate.getTime()
    ) {
      return acc;
    }

    return acc + drop.supply;
  }, 0);

  return (
    <InnerPanel>
      <div className="p-1 mb-2">
        <Label type="default" className="mt-1 mb-1 -ml-1">
          {typeLabel}
        </Label>

        <div className="flex flex-row flex-wrap my-2 justify-between items-center mr-2">
          <p className="text-sm">{name}</p>
          {buffLabels ? (
            <Label
              type={buffLabels[0].labelType}
              icon={buffLabels[0].boostTypeIcon}
              secondaryIcon={buffLabels[0].boostedItemIcon}
              className="-mr-1"
            >
              {buffLabels[0].shortDescription}
            </Label>
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
        <div className="flex justify-between items-center mb-1">
          <Label
            type="transparent"
            className="mt-1 mb-1 ml-3"
            icon={SUNNYSIDE.icons.basket}
          >
            {t("season.codex.auction.totalSupply", {
              totalSupply: maxSupply,
            })}
          </Label>
          <Label
            secondaryIcon={chapterIcon}
            type="transparent"
            className="mt-1 mb-1 mr-3"
          >
            {t("season.codex.auction.chapterSupply", {
              chapterSupply: chapterSupply,
            })}
          </Label>
        </div>
        <p className="text-xxs italic">
          {t("season.codex.auction.chapterSupply.description")}
        </p>
      </div>
      <div
        style={{ maxHeight: "250px" }}
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
                        {new Date(drop.startAt).toLocaleString("en-AU", {
                          timeZoneName: "shortOffset",
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
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
                          <div
                            className="flex items-center ml-1"
                            key={`${name}-${drop.auctionId}`}
                          >
                            <img
                              src={ITEM_DETAILS[name].image}
                              className="h-4"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {drop.startAt > now ? (
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
    </InnerPanel>
  );
};

interface Props {
  gameState: GameState;
  farmId: number;
  chapter: ChapterName;
  hideNext?: boolean;
}

const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

export const ChapterAuctions: React.FC<Props> = ({
  farmId,
  gameState,
  chapter,
  hideNext,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(authService, _rawToken);

  const [selected, setSelected] = useState<
    InventoryItemName | BumpkinItem | AuctionNFT
  >();

  const auctionService = useActorRef(
    createAuctioneerMachine({
      onUpdate: () => {
        // No op
      },
    }),
    {
      context: {
        farmId: farmId,
        token: rawToken,
        bid: gameState.auctioneer.bid,
        deviceTrackerId: "0x",
        canAccess: true,
        linkedAddress: "0x",
      },
    },
  ) as unknown as MachineInterpreter;

  const [auctioneerState] = useActor(auctionService);

  useEffect(() => {
    auctionService.send({ type: "OPEN", gameState });
  }, []);

  if (auctioneerState.matches("idle")) {
    return null;
  }

  if (auctioneerState.matches("loading")) {
    return <Loading />;
  }

  const { details: auctionItems } = getChapterAuctions({
    auctions: auctioneerState.context.auctions,
    chapter,
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
            <Drops
              name={selected}
              detail={auctionItems[selected]}
              maxSupply={auctioneerState.context.totalSupply[selected] ?? 0}
              game={gameState}
            />
          )}
        </CloseButtonPanel>
      </ModalOverlay>

      {!hideNext && <NextDrop auctions={auctionItems} game={gameState} />}

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
              const auction = details.auctions[0];

              const { item, image, buffLabels, typeLabel } =
                getAuctionItemDisplay({
                  auction,
                  skills: gameState.bumpkin.skills,
                  collectibles: gameState.collectibles,
                });

              const remainingAuctions = details.auctions.filter(
                (auction) => auction.startAt > Date.now(),
              );
              const remainingLeft = remainingAuctions.reduce(
                (total, auction) => total + auction.supply,
                0,
              );

              return (
                <ButtonPanel
                  onClick={() => setSelected(item)}
                  className="relative"
                  key={`${name}-${auction.auctionId}-button`}
                >
                  <div className="flex">
                    <div className="w-12 h-12  mr-1">
                      <img src={image} className="h-full mx-auto" />
                    </div>
                    <div>
                      <p className="text-sm mb-1">{name}</p>
                      {buffLabels ? (
                        <div className="flex">
                          <img src={lightning} className="h-4 mr-0.5" />
                          <p className="text-xs">
                            {buffLabels
                              .map(({ shortDescription }) => shortDescription)
                              .join(", ")}
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
                      {!isMobile && <Label type="default">{typeLabel}</Label>}
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
