import React from "react";
import { Button } from "components/ui/Button";
import { ContentComponentProps } from "../GameOptions";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ExperimentsSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();

  return (
    <div className="grid grid-cols-1 gap-1 min-h-[240px] content-start">
      <Button
        className="self-start"
        onClick={() => onSubMenuClick("economyEditor")}
      >
        <span>{t("gameOptions.experiments.economyEditor")}</span>
      </Button>
    </div>
  );
};
