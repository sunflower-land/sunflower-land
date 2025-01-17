import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import bountifulHarvest from "assets/icons/bountiful_harvest_icon.webp";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";

export const BountifulHarvest: React.FC<{
  acknowledge: () => void;
}> = ({ acknowledge }) => {
  const { t } = useAppTranslation();
  return (
    <Panel className="relative z-10">
      <div className="p-1">
        <Label type="vibrant" icon={bountifulHarvest} className="mb-2">
          {t("bountifulHarvest.specialEvent")}
        </Label>
        <NoticeboardItems
          items={[
            {
              text: t("bountifulHarvest.noticeboard.one"),
              icon: bountifulHarvest,
            },
            {
              text: t("bountifulHarvest.noticeboard.two"),
              icon: ITEM_DETAILS.Sunflower.image,
            },
            {
              text: t("bountifulHarvest.noticeboard.three"),
              icon: SUNNYSIDE.skills.crops,
            },
          ]}
        />
      </div>
      <Button onClick={acknowledge}>{t("continue")}</Button>
    </Panel>
  );
};
