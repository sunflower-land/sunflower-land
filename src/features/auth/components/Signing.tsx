import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Signing: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <span className="text-shadow loading">{t("welcome.signingIn")}</span>
      <span className="text-shadow block my-2 mx-2 sm:text-sm">
        {t("welcome.signIn.message")}
      </span>
    </>
  );
};
