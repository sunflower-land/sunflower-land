import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { Button } from "components/ui/Button";
import { ContentComponentProps } from "../GameOptions";

export const Advanced: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
      <Button onClick={() => onSubMenuClick("blockchain")}>
        <span>{t("gameOptions.blockchainSettings")}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("amoy")}>
        <span>{t("gameOptions.developerOptions")}</span>
      </Button>
    </div>
  );
};
