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
import {
  formatRaffleWindow,
  getPrizeDisplay,
  UpcomingRaffles,
} from "features/world/ui/chapterRaffles/UpcomingRaffles";
import { Loading } from "features/auth/components";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { CONFIG } from "lib/config";
import lightning from "assets/icons/lightning.png";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import calendar from "assets/icons/calendar.webp";

type Props = {
  chapter: ChapterName;
  token: string;
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

  const active = raffles?.filter((raffle) => raffle.endAt > now)[0];

  const countdown = useCountdown(active?.endAt ?? 0);

  if (isLoading) {
    return (
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <Loading />
        </div>
      </InnerPanel>
    );
  }

  if (!active) {
    return (
      <InnerPanel className="mb-2">
        <Label type="warning" icon={SUNNYSIDE.icons.sad}>
          Raffles
        </Label>
        <p className="text-xs p-2">No active raffles.</p>
      </InnerPanel>
    );
  }
  const display = getPrizeDisplay({ prize: 1, raffle: active });

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <Label type="warning" className="">
            Raffle
          </Label>
          <div className="flex items-center gap-1">
            <div className="text-xs">
              {new Date(active.startAt).toLocaleDateString().slice(0, 5)}-
              {new Date(active.endAt).toLocaleDateString().slice(0, 5)}
            </div>
            <img src={calendar} className="h-5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <img
              src={display.image}
              className="absolute inset-0 w-full h-full rounded-md"
            />
            <img src={lightning} className="absolute h-5 -top-1 -right-1" />
          </div>
          <div>
            <p className="text-sm">{display.name}</p>
            <p className="text-xs">
              +{getKeys(active.prizes).length - 1} prizes
            </p>
          </div>
        </div>

        <p
          className="text-xxs underline my-1 mx-1 cursor-pointer"
          onClick={() => setShowMore(true)}
        >
          View more
        </p>
      </InnerPanel>

      <Modal show={showMore} onHide={() => setShowMore(false)} size="lg">
        <CloseButtonPanel onClose={() => setShowMore(false)}>
          <UpcomingRaffles />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
