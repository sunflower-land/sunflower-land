import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Withdrawing: React.FC = () => {
  const { t } = useAppTranslation();
    return <span className="loading">{t("transaction.withdraw.one")}</span>;
};
