import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const PetHouse: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="relative overflow-y-auto max-h-[400px] scrollable">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{t("petGuide.petHouse.title")}</Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("petGuide.petHouse.description"),
            icon: SUNNYSIDE.building.petHouse1,
          },
          {
            text: t("petGuide.petHouse.description2"),
            icon: SUNNYSIDE.icons.hammer,
          },
          {
            text: t("petGuide.petHouse.description3"),
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            text: t("petGuide.petHouse.description4"),
            icon: SUNNYSIDE.icons.lightning,
          },
          {
            text: t("petGuide.petHouse.description5"),
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: t("petGuide.petHouse.description6"),
            icon: SUNNYSIDE.icons.timer,
          },
          {
            text: t("petGuide.petHouse.description7"),
            icon: SUNNYSIDE.icons.lock,
          },
        ]}
      />
    </InnerPanel>
  );
};
