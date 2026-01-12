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

      <Label type="default" className="my-2">
        {t("withdraw.duplicate.howToWithdraw")}
      </Label>
      <p className="text-xs">{t("withdraw.duplicate.tip1")}</p>
      <p className="text-xs">{t("withdraw.duplicate.tip2")}</p>
      <p className="text-xs">{t("withdraw.duplicate.tip3")}</p>
      <p className="text-xs">{t("withdraw.duplicate.tip4")}</p>

      <p className="text-xxs italic mt-2">{t("withdraw.duplicate.note")}</p>
    </div>
  );
};
