import React from "react";

import syncing from "assets/npcs/syncing.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Transacting: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <span className="mb-2 text-center">{t("transaction.transacting.one")}</span>
      <img src={syncing} className="w-1/4 mb-2 mr-10" />
      <span className="text-sm text-center mt-2 mb-2">
        {t("transaction.transacting.two")}
      </span>
      <a
        className="underline text-xxs text-center hover:text-white"
        href="https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals"
        target="_blank"
        rel="noreferrer"
      >
        {t("transaction.transacting.three")}
      </a>
    </div>
  );
};
