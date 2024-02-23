import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const LetsGo: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col space-y-1 p-2">
      <p className="text-xs sm:text-sm">{t("letsGo.description")}</p>

      <p className="text-xs sm:text-sm">
        {t("letsGo.readMore")}
        <a
          className="text-xs sm:text-sm underline"
          href="https://docs.sunflower-land.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("letsGo.officialDocs")}
        </a>
        {"."}
      </p>
    </div>
  );
};
