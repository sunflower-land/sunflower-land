import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import fullMoon from "assets/icons/full_moon.png";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";

export const FullMoon: React.FC<{
  acknowledge: () => void;
}> = ({ acknowledge }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <Label type="vibrant" icon={fullMoon} className="mb-2">
            {t("fullMoon.specialEvent")}
          </Label>

          <NoticeboardItems
            items={[
              {
                text: t("fullMoon.one"),
                icon: ITEM_DETAILS["Eggplant"].image,
              },
              {
                text: t("fullMoon.two"),
                icon: ITEM_DETAILS["Lunara"].image,
              },
              {
                text: t("fullMoon.three"),
                icon: SUNNYSIDE.icons.fish_icon,
              },
            ]}
          />
        </div>
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </Panel>
    </>
  );
};
