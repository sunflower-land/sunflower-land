import React from "react";
import { Button } from "components/ui/Button";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ContentComponentProps } from "../GameOptions";

export const AppearanceSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { isDarkMode, toggleDarkMode } = useIsDarkMode();

  return (
    <>
      <Button className="mb-1" onClick={toggleDarkMode}>
        <span>
          {isDarkMode
            ? t("gameOptions.generalSettings.darkMode")
            : t("gameOptions.generalSettings.lightMode")}
        </span>
      </Button>
      <Button className="mb-1" onClick={() => onSubMenuClick("font")}>
        {t("gameOptions.generalSettings.font")}
      </Button>
    </>
  );
};
