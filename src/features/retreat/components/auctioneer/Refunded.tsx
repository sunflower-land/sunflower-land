import React from "react";

import trivia from "assets/npcs/trivia.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Refunded: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div>
      <div className="p-2 flex flex-col items-center">
        <img src={trivia} className="w-24 mb-2" />

        <p className="text-center mb-1">{t("refunded.itemsReturned")}</p>
        <p className="text-sm">{t("refunded.goodLuck")}</p>
      </div>
    </div>
  );
};
