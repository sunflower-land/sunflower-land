import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const AddingSFL: React.FC = () => {
  const { t } = useAppTranslation();
  return <span className="loading">{translate("swapping")}</span>;
};
