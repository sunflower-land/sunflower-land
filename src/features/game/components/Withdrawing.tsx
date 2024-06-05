import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Withdrawing: React.FC = () => {
  const { t } = useAppTranslation();
  return <Loading text={t("transaction.withdraw.one")} />;
};
