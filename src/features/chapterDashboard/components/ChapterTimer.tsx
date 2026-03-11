import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  CHAPTERS,
  getCurrentChapter,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import { ColorPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ChapterTimer: React.FC = () => {
  const { t } = useAppTranslation();
  const now = useNow();

  const chapter = getCurrentChapter(now);
  const { startDate, endDate, tasksBegin } = CHAPTERS[chapter];

  if (tasksBegin && now < tasksBegin.getTime()) {
    return (
      <ColorPanel type="default" className="flex p-1">
        <img src={SUNNYSIDE.icons.stopwatch} className="h-8 mr-1" />
        <div>
          <p className="text-xs">{t("chapterDashboard.chapterStarts")}</p>
          <p className="text-xs">
            {secondsToString((tasksBegin.getTime() - now) / 1000, {
              length: "short",
              isShortFormat: false,
            })}
          </p>
        </div>
      </ColorPanel>
    );
  }

  return (
    <ColorPanel type="default" className="flex p-1">
      <img src={SUNNYSIDE.icons.stopwatch} className="h-8 mr-2" />
      <div>
        <p className="text-xs">{t("tracks.chapterEnds")}</p>
        <p className="text-xs">
          {secondsToString(secondsLeftInChapter(now), { length: "short" })}
        </p>
      </div>
    </ColorPanel>
  );
};
