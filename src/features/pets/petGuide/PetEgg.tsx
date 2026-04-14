import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { ChestRewardsList } from "components/ui/ChestRewardsList";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";

export const PetEgg: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
        <Label type="default">{t("petGuide.petEgg.title")}</Label>
      </div>
      <ChestRewardsList
        type="Pet Egg"
        chestDescription={[
          {
            text: t("petGuide.petEgg.description"),
            icon: SUNNYSIDE.icons.money_icon,
          },
          {
            text: t("petGuide.petEgg.description2"),
            icon: SUNNYSIDE.icons.heart,
          },
          {
            text: t("petGuide.petEgg.description3"),
            icon: SUNNYSIDE.icons.treasure,
          },
          {
            text: t("petGuide.petEgg.description4"),
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: t("petGuide.petEgg.description5"),
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: t("petGuide.petEgg.description6"),
            icon: SUNNYSIDE.icons.lock,
          },
        ]}
      />
    </InnerPanel>
  );
};
