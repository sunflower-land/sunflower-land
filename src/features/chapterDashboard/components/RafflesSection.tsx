import React, { useState } from "react";
import useSWR from "swr";

import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChapterName } from "features/game/types/chapters";
import { loadRaffles } from "features/world/ui/chapterRaffles/actions/loadRaffles";
import { randomID } from "lib/utils/random";
import { useNow } from "lib/utils/hooks/useNow";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  getPrizeDisplay,
  UpcomingRaffles,
} from "features/world/ui/chapterRaffles/UpcomingRaffles";
import { Loading } from "features/auth/components";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { CONFIG } from "lib/config";
import lightning from "assets/icons/lightning.png";
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
          {t("auction.raffle.title")}
        </Label>
        <p className="text-xs p-2">{t("chapterDashboard.noActiveRaffles")}</p>
      </InnerPanel>
    );
  }
  const display = getPrizeDisplay({ prize: 1, raffle: active });

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <Label type="warning" className="">
            {t("auction.raffle")}
          </Label>
          <div className="flex items-center gap-1">
            <div className="text-xs">
              {t("chapterDashboard.raffleDateRange", {
                start: new Date(active.startAt)
                  .toLocaleDateString()
                  .slice(0, 5),
                end: new Date(active.endAt).toLocaleDateString().slice(0, 5),
              })}
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
              {t("chapterDashboard.raffleExtraPrizes", {
                count: getKeys(active.prizes).length - 1,
              })}
            </p>
          </div>
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
          tabs={[
            { icon: calendar, name: t("auction.raffle.title"), id: "raffles" },
          ]}
          onClose={() => setShowMore(false)}
        >
          <UpcomingRaffles />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
