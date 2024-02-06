import React from "react";
import trivia from "assets/npcs/trivia.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Pending: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="p-2 flex flex-col items-center">
      <img src={trivia} className="w-24 mb-2" />
      <p>{t("pending.calcul")}</p>
      <p className="text-sm">{t("pending.comeback")}</p>
    </div>
  );
};
