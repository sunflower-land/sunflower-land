import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { ChestRewardsList } from "components/ui/ChestRewardsList";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const PetEgg: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg">{t("petGuide.petEgg.title")}</h2>

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
