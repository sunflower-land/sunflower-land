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
import { ChapterName, CHAPTERS } from "features/game/types/chapters";
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
        auction.startAt < startDate.getTime() || auction.startAt > endDate.getTime(),
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

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <SectionHeader
            title="Auctions"
            labelType="warning"
            actionText="View more"
            onAction={() => setShowMore(true)}
            disabled={auctioneerState.matches("loading") || auctioneerState.matches("idle")}
          />

          {auctioneerState.matches("loading") && (
            <div className="p-2">
              <Loading />
            </div>
          )}

          {!auctioneerState.matches("loading") && summary && (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {summary.nextDrop && summary.display ? (
                  <>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        src={summary.display.image}
                        className="w-full h-full object-contain img-highlight"
                      />
                    </div>
                    <div>
                      <p className="text-sm">{summary.display.item}</p>
                      <div className="text-xxs">
                        <TimerDisplay time={starts} />
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs">No upcoming auctions</p>
                )}
              </div>

              <Label type={summary.totalRemaining <= 50 ? "formula" : "default"}>
                {`${summary.totalRemaining.toLocaleString()} NFTs left`}
              </Label>
            </div>
          )}

          {!auctioneerState.matches("loading") && !summary && (
            <p className="text-xs">{t("loading")}</p>
          )}
        </div>
      </InnerPanel>

      <Modal show={showMore} onHide={() => setShowMore(false)} size="lg">
        <CloseButtonPanel onClose={() => setShowMore(false)}>
          <div className="p-2">
            <ChapterAuctions chapter={chapter} farmId={farmId} gameState={gameState} />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

