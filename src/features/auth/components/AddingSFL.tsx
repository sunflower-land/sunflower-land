import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { Loading } from "./Loading";

export const AddingSFL: React.FC = () => {
  const { t } = useAppTranslation();
  return <Loading text={t("swapping")} />;
};
