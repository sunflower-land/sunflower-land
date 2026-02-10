import React, { useEffect, useState } from "react";

import { Auction } from "features/game/lib/auctionMachine";
import {
  AuctionNFT,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import {
  ChapterName,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
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
import { secondsToString } from "lib/utils/time";
import sflIcon from "assets/icons/flower_token.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { randomID } from "lib/utils/random";
import { loadAuctions } from "features/retreat/components/auctioneer/actions/loadAuctions";

type AuctionDetail = {
  supply: number;
  type: "collectible" | "wearable" | "nft";
  auctions: Auction[];
};

type AuctionItems = Record<
  BumpkinItem | InventoryItemName | AuctionNFT,
  AuctionDetail
>;

type Props = {
  chapter: ChapterName;
  farmId: number;
  gameState: GameState;
  token: string;
};

type AuctionSummary = {
  date: Date;
  currency: string;
  supply: number;
  name: string;
  image: string;
};

function groupAuctions({
  auctions,
  now,
}: {
  auctions: Auction[];
  now: number;
}): AuctionSummary[] {
  const upcoming = auctions
    .filter((a) => a.startAt > now)
    .sort((a, b) => a.startAt - b.startAt);

  // Skip if same as the previous auction
  const grouped: AuctionSummary[] = upcoming.reduce((acc, auction) => {
    const previous = acc[acc.length - 1];

    const isSame =
      previous &&
      ((auction.type === "collectible" &&
        auction.collectible === previous.name) ||
        (auction.type === "wearable" && auction.wearable === previous.name) ||
        (auction.type === "nft" && auction.nft === previous.name));

    if (isSame) {
      previous.supply += auction.supply;
      return acc;
    }

    const ingredients = getKeys(auction.ingredients);

    return [
      ...acc,
      {
        date: new Date(auction.startAt),
        currency:
          ingredients.length > 0 ? ITEM_DETAILS[ingredients[0]].image : sflIcon,
        supply: auction.supply,
        name: getAuctionItemType(auction),
        image: getAuctionItemDisplay({
          auction,
          skills: {},
          collectibles: {},
        }).image,
      } as AuctionSummary,
    ];
  }, [] as AuctionSummary[]);

  return grouped;
}
export const AuctionsSection: React.FC<Props> = ({
  chapter,
  farmId,
  gameState,
  token,
}) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  const [showMore, setShowMore] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionSummary[]>([]);
  const [totalSupply, setTotalSupply] = useState<Record<string, number>>({});

  const nextAuction = auctions[0];
  const countdown = useCountdown(nextAuction?.date.getTime() ?? 0);

  useEffect(() => {
    const load = async () => {
      const { auctions, totalSupply } = await loadAuctions({
        token,
        transactionId: randomID(),
      });
      setAuctions(groupAuctions({ auctions, now }));
      setTotalSupply(totalSupply);
      setIsLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <Loading />
        </div>
      </InnerPanel>
    );
  }

  if (!auctions.length) {
    return (
      <InnerPanel className="mb-2">
        <Label type="warning" className="mb-1">
          {t("auction.title")}
        </Label>

        <p className="text-xs px-2">
          {t("chapterDashboard.auctionsComingSoon", {
            time: secondsToString(secondsLeftInChapter(now), {
              length: "short",
            }),
          })}
        </p>
      </InnerPanel>
    );
  }

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <Label type="warning">{t("chapterDashboard.upcomingAuctions")}</Label>
          <div className="text-xs">
            <TimerDisplay time={countdown} />
          </div>
        </div>

        <div>
          {auctions.slice(0, 3).map((a) => {
            const currency: string = a.currency;
            const date = a.date.toLocaleDateString();

            return (
              <div
                className="flex items-center mb-0.5"
                key={`${a.name}-${a.date.getTime()}`}
              >
                <img
                  src={a.image}
                  className="w-12 h-12 object-contain mr-2 rounded-md"
                />

                <div>
                  <div className="flex items-center">
                    <p className="text-sm">{a.name}</p>
                    <img src={currency} className="h-5 ml-1" />
                  </div>

                  <p className="text-xxs ">
                    {t("chapterDashboard.auctionDateAndSupply", {
                      date,
                      supply: a.supply,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p
          className="text-xxs underline my-1 mx-1 cursor-pointer"
          onClick={() => setShowMore(true)}
        >
          {t("chapterDashboard.viewMore")}
        </p>
      </InnerPanel>

      <Modal show={showMore} onHide={() => setShowMore(false)} size="lg">
        <CloseButtonPanel
          onClose={() => setShowMore(false)}
          container={OuterPanel}
          tabs={[
            {
              id: "auctions",
              name: t("auction.title"),
              icon: ITEM_DETAILS.Cheer.image,
            },
          ]}
        >
          <ChapterAuctions
            chapter={chapter}
            farmId={farmId}
            gameState={gameState}
            hideNext={true}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
