import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const DuplicateWithdraw: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className=" p-1">
      <Label type="danger" className="mb-2">
        {t("withdraw.duplicate.title")}
      </Label>
      <p className="text-xs mb-1">{t("withdraw.duplicate.description")}</p>
      <p className="text-xs mt-2">{t("withdraw.duplicate.waitMessage")}</p>
    </div>
  );
};
