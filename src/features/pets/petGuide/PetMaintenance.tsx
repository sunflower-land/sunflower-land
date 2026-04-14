import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const PetMaintenance: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="relative">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{t("petGuide.care.title")}</Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("petGuide.care.description"),
            icon: SUNNYSIDE.icons.sleeping,
          },
          {
            text: t("petGuide.care.description2"),
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: t("petGuide.care.description3"),
            icon: SUNNYSIDE.icons.lock,
          },
        ]}
      />
    </InnerPanel>
  );
};
