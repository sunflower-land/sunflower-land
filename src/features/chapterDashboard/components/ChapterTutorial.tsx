import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import {
  CHAPTER_TICKET_NAME,
  getCurrentChapter,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { getBumpkinHoliday } from "lib/utils/getSeasonWeek";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import choreIcon from "assets/icons/chores.webp";
import { Label } from "components/ui/Label";
import shopIcon from "assets/icons/shop.png";
import lockIcon from "assets/icons/lock.png";
import medal from "assets/icons/red_medal.webp";
export const ChapterTutorial: React.FC = () => {
  const { t } = useAppTranslation();

  const now = useNow();
  const chapter = getCurrentChapter(now);

  const { holiday } = getBumpkinHoliday({ now });
  const isHoliday = holiday === new Date(now).toISOString().split("T")[0];

  const chapterTicket = CHAPTER_TICKET_NAME[chapter];

  return (
    <div>
      <Label type="default" className="mb-2">
        {t("chapterDashboard.howToEarnTickets", { ticket: chapterTicket })}
      </Label>

      {isHoliday && (
        <div className="flex gap-x-2 items-center mb-2">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img src={lockIcon} className="h-8 w-8 object-contain" />
          </div>
          <p className="text-xs flex-1">
            {t("chapterDashboard.tasksAvailableSoon")}
          </p>
        </div>
      )}

      <div className="flex gap-x-2 items-center mb-2">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <NPCIcon parts={NPC_WEARABLES["pumpkin' pete"]} width={32} />
        </div>
        <p className="text-xs flex-1">{t("chapterDashboard.deliveries")}</p>
      </div>

      <div className="flex gap-x-2 items-center mb-2">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src={choreIcon} className="h-8 w-8 object-contain" />
        </div>
        <p className="text-xs flex-1">{t("chapterDashboard.chores")}</p>
      </div>

      <div className="flex gap-x-2 items-center mb-2">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <NPCIcon parts={NPC_WEARABLES["poppy"]} width={32} />
        </div>
        <p className="text-xs flex-1">{t("chapterDashboard.bounties")}</p>
      </div>

      <div className="flex gap-x-2 items-center mb-2">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src={shopIcon} className="h-8 w-8 object-contain" />
        </div>
        <p className="text-xs flex-1">
          {t("chapterDashboard.spendTickets", { ticket: chapterTicket })}
        </p>
      </div>

      <div className="flex gap-x-2 items-center mb-2">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src={medal} className="h-8 w-8 object-contain" />
        </div>
        <p className="text-xs flex-1">
          {t("chapterDashboard.earnPointsToClaimRewards")}
        </p>
      </div>
    </div>
  );
};
