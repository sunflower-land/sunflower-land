import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Beta: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <span className="text-shadow">{translate("statements.beta.one")}</span>
      <span className="text-shadow text-xs block mt-4">
        {translate("statements.beta.two")}
      </span>
    </>
  );
};
