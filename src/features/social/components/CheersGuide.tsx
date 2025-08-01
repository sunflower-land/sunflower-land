import React from "react";
import { InnerPanel } from "components/ui/Panel";
import cheer from "assets/icons/cheer.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

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
        <div className="flex gap-2 items-start sm:items-center">
          <div className="w-8 flex justify-center">
            <img src={cheer} alt="Cheer" className="object-contain mt-1 h-6" />
          </div>
          <p className="text-xs flex-1">{t("cheers.guide.description")}</p>
        </div>
        <div className="flex gap-2 items-start sm:items-center">
          <div className="w-8 flex justify-center">
            <img
              src={SUNNYSIDE.icons.stopwatch}
              alt="Clock"
              className="object-contain mt-1 h-6"
            />
          </div>
          <div className="flex items-center">
            <p className="text-xs flex-1">{t("cheers.guide.description2")}</p>
          </div>
        </div>
        <div className="flex gap-2 items-start sm:items-center">
          <div className="w-8 flex justify-center">
            <img
              src={ITEM_DETAILS.Trash.image}
              alt="Trash"
              className="object-contain mt-1 h-6"
            />
          </div>
          <p className="text-xs flex-1">{t("cheers.guide.description3")}</p>
        </div>
      </div>
    </InnerPanel>
  );
};
