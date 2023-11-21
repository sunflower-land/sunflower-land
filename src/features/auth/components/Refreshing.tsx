import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Refreshing: React.FC = () => {
  const { t } = useAppTranslation();
  return <span className="text-shadow loading">{t("refreshing")}</span>;
};
