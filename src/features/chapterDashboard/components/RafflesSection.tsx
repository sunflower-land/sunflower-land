import React, { useMemo, useState } from "react";
import useSWR from "swr";

import { InnerPanel } from "components/ui/Panel";
import { SectionHeader } from "./SectionHeader";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChapterName, CHAPTERS } from "features/game/types/chapters";
import { loadRaffles } from "features/world/ui/chapterRaffles/actions/loadRaffles";
import { randomID } from "lib/utils/random";
import { RaffleDefinition } from "features/retreat/components/auctioneer/types";
import { useNow } from "lib/utils/hooks/useNow";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { SUNNYSIDE } from "assets/sunnyside";
import petEggNFT from "assets/icons/pet_nft_egg.png";
import budSeedling from "assets/icons/bud_seedling.png";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { UpcomingRaffles } from "features/world/ui/chapterRaffles/UpcomingRaffles";
import { Loading } from "features/auth/components";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { CONFIG } from "lib/config";

type Props = {
  chapter: ChapterName;
  token: string;
};

const getPrizeDisplay = (raffle: RaffleDefinition) => {
  const firstPrize = raffle.prizes?.[1];
  const items = getKeys(firstPrize?.items ?? {});
  const wearables = getKeys(firstPrize?.wearables ?? {});
  const collectible = items.find((item) => isCollectible(item));
  const nft = firstPrize?.nft;

  if (nft) {
    const isBud = nft.includes("Bud");
    return {
      name: isBud ? "Bud NFT" : "Pet NFT",
      image: isBud ? budSeedling : petEggNFT,
    };
  }

  if (collectible) {
    return { name: collectible, image: ITEM_DETAILS[collectible].image };
  }

  if (wearables[0]) {
    return { name: wearables[0], image: getImageUrl(ITEM_IDS[wearables[0]]) };
  }

  if (items[0]) {
    return { name: items[0], image: ITEM_DETAILS[items[0]].image };
  }

  return {
    name: "Mystery prize",
    image: SUNNYSIDE.icons.expression_confused,
  };
};

const formatCountdown = (countdown: ReturnType<typeof useCountdown>) => {
  if (countdown.days > 0) return `${countdown.days}d ${countdown.hours}h`;
  if (countdown.hours > 0) return `${countdown.hours}h ${countdown.minutes}m`;
  return `${countdown.minutes}m ${countdown.seconds}s`;
};

export const RafflesSection: React.FC<Props> = ({ chapter, token }) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  const [showMore, setShowMore] = useState(false);
  const isOffline = !CONFIG.API_URL;

  const { data: raffles, isLoading } = useSWR(
    token || isOffline ? ["chapter-raffles", token] : null,
    async ([, authToken]: [string, string]) =>
      loadRaffles({ token: authToken, transactionId: randomID() }),
    { revalidateOnFocus: false },
  );

  const summary = useMemo(() => {
    if (!raffles) return null;
    const { startDate, endDate } = CHAPTERS[chapter];

    const inChapter = raffles.filter(
      (r) => r.startAt >= startDate.getTime() && r.startAt <= endDate.getTime(),
    );

    const upcomingOrActive = inChapter
      .filter((r) => r.endAt > now)
      .sort((a, b) => a.startAt - b.startAt);

    const next = upcomingOrActive[0];
    const rafflesLeft = inChapter.filter((r) => r.startAt > now).length;

    return { next, rafflesLeft };
  }, [raffles, chapter, now]);

  const isActive = Boolean(
    summary?.next && summary.next.startAt <= now && summary.next.endAt > now,
  );
  const countdown = useCountdown(
    summary?.next ? (isActive ? summary.next.endAt : summary.next.startAt) : 0,
  );

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <SectionHeader
            title="Raffles"
            labelType="warning"
            actionText="View more"
            onAction={() => setShowMore(true)}
            disabled={isLoading}
          />

          {isLoading && (
            <div className="p-2">
              <Loading />
            </div>
          )}

          {!isLoading && summary?.next && (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <img
                    src={SUNNYSIDE.ui.grey_background}
                    className="absolute inset-0 w-full h-full rounded-md"
                  />
                  <img
                    src={getPrizeDisplay(summary.next).image}
                    className="w-2/3 h-2/3 object-contain z-10"
                  />
                </div>
                <div>
                  <p className="text-sm">
                    {getPrizeDisplay(summary.next).name}
                  </p>
                  <p className="text-xxs">
                    {t("auction.raffle.labelWithId", { id: summary.next.id })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <Label type="info">{`${formatCountdown(countdown)} ${isActive ? "left" : "until start"}`}</Label>
                <Label type={summary.rafflesLeft <= 1 ? "formula" : "default"}>
                  {`${summary.rafflesLeft} raffles left`}
                </Label>
              </div>
            </div>
          )}

          {!isLoading && summary && !summary.next && (
            <p className="text-xs">{t("auction.raffle.moreComing")}</p>
          )}
        </div>
      </InnerPanel>

      <Modal show={showMore} onHide={() => setShowMore(false)} size="lg">
        <CloseButtonPanel onClose={() => setShowMore(false)}>
          <div className="p-2">
            <UpcomingRaffles />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
