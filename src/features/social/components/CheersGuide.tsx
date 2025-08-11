import React from "react";
import { InnerPanel } from "components/ui/Panel";
import cheer from "assets/icons/cheer.webp";
import helpIcon from "assets/icons/help.webp";
import helpedIcon from "assets/icons/helped.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

export const CheersGuide = () => {
  const { t } = useAppTranslation();
  // Calculate tomorrow's date in UTC by creating a new Date for now, then adding one day
  const now = new Date();
  const tomorrowUTCDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0,
    ),
  );

  return (
    <InnerPanel>
      <div className="flex flex-col space-y-2 p-2">
        <Label type="info" icon={cheer}>
          {t("cheers.moreFreeCheersIn", {
            time: getRelativeTime(tomorrowUTCDate.getTime()),
          })}
        </Label>
        <NoticeboardItems
          items={[
            { text: t("cheers.guide.description"), icon: cheer },
            {
              text: t("cheers.guide.description2"),
              icon: SUNNYSIDE.icons.stopwatch,
            },
            {
              text: t("cheers.guide.description3"),
              icon: ITEM_DETAILS.Weed.image,
            },
            {
              text: t("cheers.guide.description4"),
              icon: helpIcon,
            },
            {
              text: t("cheers.guide.description5"),
              icon: helpedIcon,
            },
            {
              text: t("cheers.guide.description6"),
              icon: ITEM_DETAILS["Advanced Cooking Pot"].image,
            },
          ]}
        />
      </div>
    </InnerPanel>
  );
};
