import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

interface Props {
  text?: string;
}

export const Loading: React.FC<Props> = ({ text }) => {
  const { t } = useAppTranslation();
  return <span className="loading">{text || t("loading")}</span>;
};
