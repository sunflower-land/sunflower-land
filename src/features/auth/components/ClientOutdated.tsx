import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const ClientOutdated: React.FC = () => {
  const { t } = useAppTranslation();

  const reload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-1">
      <Label type="warning" className="ml-1">
        {t("clientOutdated.label")}
      </Label>
      <div className="flex flex-col p-2">
        <p className="text-xs">{t("clientOutdated.description")}</p>
      </div>
      <div className="flex justify-center mb-2">
        <Label type="default">
          {t("clientOutdated.currentVersion", {
            version: CONFIG.RELEASE_VERSION,
          })}
        </Label>
      </div>
      <Button onClick={reload}>{t("refresh")}</Button>
      <div></div>
    </div>
  );
};
