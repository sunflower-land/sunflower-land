import React, { useEffect, useMemo, useState } from "react";

import { useActor, useInterpret } from "@xstate/react";

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
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import {
  ChapterName,
  CHAPTERS,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { InnerPanel } from "components/ui/Panel";
import { SectionHeader } from "./SectionHeader";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { Label } from "components/ui/Label";
import { useNow } from "lib/utils/hooks/useNow";
import { getAuctionItemType } from "features/retreat/components/auctioneer/lib/getAuctionItemType";
import { getAuctionItemDisplay } from "features/retreat/components/auctioneer/lib/getAuctionItemDisplay";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ChapterAuctions } from "features/island/hud/components/codex/components/ChapterAuctions";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { CONFIG } from "lib/config";
import { secondsToString } from "lib/utils/time";
import sflIcon from "assets/icons/flower_token.webp";
import { ITEM_DETAILS } from "features/game/types/images";

type AuctionDetail = {
  supply: number;
  type: "collectible" | "wearable" | "nft";
  auctions: Auction[];
};

type AuctionItems = Record<
  BumpkinItem | InventoryItemName | AuctionNFT,
  AuctionDetail
>;

function getChapterAuctions({
  auctions,
  totalSupply,
  chapter,
}: {
  auctions: Auction[];
  totalSupply: Record<string, number>;
  chapter: ChapterName;
}) {
  const { startDate, endDate } = CHAPTERS[chapter];

  // Aggregate supplies
  let details: AuctionItems = auctions.reduce((acc, auction) => {
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

  // Filter out any not in this chapter
  details = getKeys(details).reduce((acc, name) => {
    const hasNoChapterAuctions = details[name].auctions.every(
      (auction) =>
        auction.startAt < startDate.getTime() ||
        auction.startAt > endDate.getTime(),
    );

    if (hasNoChapterAuctions) return acc;

    return {
      ...acc,
      [name]: details[name],
    };
  }, {} as AuctionItems);

  const filteredTotalSupply = Object.fromEntries(
    Object.entries(totalSupply).filter(([name]) => name in details),
  );

  return { details, filteredTotalSupply };
}

type Props = {
  chapter: ChapterName;
  farmId: number;
  gameState: GameState;
  token: string;
};

export const AuctionsSection: React.FC<Props> = ({
  chapter,
  farmId,
  gameState,
  token,
}) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  const [showMore, setShowMore] = useState(false);
  const isOffline = !CONFIG.API_URL;

  const auctionService = useInterpret(
    createAuctioneerMachine({
      onUpdate: () => undefined,
    }),
    {
      context: {
        farmId,
        token,
        bid: gameState.auctioneer.bid,
        deviceTrackerId: "0x",
        canAccess: true,
        linkedAddress: "0x",
        // Provide some stub data in offline mode (since we don't fetch).
        ...(isOffline
          ? {
              auctions: [
                {
                  auctionId: "offline-auction-1",
                  type: "wearable",
                  wearable: "Acorn Hat",
                  startAt: Date.now() + 60 * 60 * 1000,
                  endAt: Date.now() + 2 * 60 * 60 * 1000,
                  ingredients: { Wood: 1, Gold: 10 },
                  sfl: 5,
                  supply: 500,
                  chapterLimit: 1,
                },
              ] as Auction[],
              totalSupply: { "Acorn Hat": 500 } as Record<string, number>,
            }
          : {}),
      },
    },
  ) as unknown as MachineInterpreter;

  const [auctioneerState] = useActor(auctionService);

  useEffect(() => {
    auctionService.send("OPEN", { gameState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    if (!auctioneerState.context.auctions?.length) return null;

    const { details } = getChapterAuctions({
      auctions: auctioneerState.context.auctions,
      totalSupply: auctioneerState.context.totalSupply,
      chapter,
    });

    const drops = getKeys(details)
      .flatMap((name) => details[name].auctions)
      .sort((a, b) => (a.startAt > b.startAt ? 1 : -1));

    const nextDrop = drops.find((d) => d.startAt > now);
    const totalRemaining = getKeys(details).reduce((acc, name) => {
      const remaining = details[name].auctions
        .filter((a) => a.startAt > now)
        .reduce((sum, a) => sum + a.supply, 0);
      return acc + remaining;
    }, 0);

    if (!nextDrop) {
      return { nextDrop: null as Auction | null, totalRemaining };
    }

    const display = getAuctionItemDisplay({
      auction: nextDrop,
      skills: gameState.bumpkin.skills,
      collectibles: gameState.collectibles,
    });

    return { nextDrop, totalRemaining, display };
  }, [auctioneerState.context, chapter, gameState, now]);

  const starts = useCountdown(summary?.nextDrop?.startAt ?? 0);

  if (auctioneerState.matches("loading") || !summary) {
    return (
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <Loading />
        </div>
      </InnerPanel>
    );
  }

  if (!summary.display || !summary.nextDrop) {
    return (
      <InnerPanel className="mb-2">
        <Label type="warning">Auctions</Label>

        <p className="text-xs">
          New auctions coming soon -{" "}
          {secondsToString(secondsLeftInChapter(now), { length: "full" })}
        </p>
      </InnerPanel>
    );
  }

  let currency: string = sflIcon;

  if (summary.nextDrop.ingredients) {
    currency = ITEM_DETAILS[getKeys(summary.nextDrop.ingredients)[0]].image;
  }

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <Label type="warning">Upcoming Auctions</Label>
          <div className="text-xs">
            <TimerDisplay time={starts} />
          </div>
        </div>

        <div className="flex">
          <img
            src={summary.display.image}
            className="w-12 h-12 mr-2 rounded-md"
          />

          <div>
            <div className="flex items-center">
              <p className="text-sm">{summary.display.item}</p>
              <img src={currency} className="h-5 ml-1" />
            </div>

            <p className="text-xxs ">{`Supply: ${summary.nextDrop.supply}`}</p>
          </div>
        </div>
      </InnerPanel>

      <Modal show={showMore} onHide={() => setShowMore(false)} size="lg">
        <CloseButtonPanel onClose={() => setShowMore(false)}>
          <div className="p-2">
            <ChapterAuctions
              chapter={chapter}
              farmId={farmId}
              gameState={gameState}
            />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
