import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TooManyFarms: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col items-center text-center p-2">
      <h1 className="mb-1 text-lg text-center">{t("error.wentWrong")}</h1>
      <img
        src={SUNNYSIDE.npcs.suspiciousGoblin}
        alt="Warning"
        className="w-16 m-2"
      />
      <span className="text-xs mt-2 mb-2">{t("error.tooManyFarms")}</span>
    </div>
  );
};
