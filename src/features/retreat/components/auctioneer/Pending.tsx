import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Pending: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="p-2 flex flex-col items-center">
      <img src={SUNNYSIDE.npcs.trivia} className="w-24 mb-2" />
      <p>{t("pending.calcul")}</p>
      <p className="text-sm">{t("pending.comeback")}</p>
    </div>
  );
};
