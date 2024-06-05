import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { Loading } from "./Loading";

export const Refreshing: React.FC = () => {
  const { t } = useAppTranslation();
  return <Loading text={t("refreshing")} />;
};
