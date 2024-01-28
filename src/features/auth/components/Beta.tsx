import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Beta: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <span className="text-shadow">{t("statements.beta.one")}</span>
      <span className="text-shadow text-xs block mt-4">
        {t("statements.beta.two")}
      </span>
    </>
  );
};
