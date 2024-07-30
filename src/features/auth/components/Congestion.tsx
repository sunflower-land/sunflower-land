import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Congestion: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div id="gameerror" className="flex flex-col items-center p-2">
      <span className="text-center">{t("error.polygon.cant.connect")}</span>
      <img src={SUNNYSIDE.npcs.humanDeath} className="w-1/2 -mt-4 ml-8" />
      <span className="text-xs text-center">{t("error.congestion.one")}</span>
      <span className="text-xs text-center">{t("error.congestion.two")}</span>
    </div>
  );
};
