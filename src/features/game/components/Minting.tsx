import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Minting: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center loading">{t("minting")}</span>
      <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/2 mt-2 mb-3" />
      <span className="text-sm">{t("statements.minting")}</span>
    </div>
  );
};
