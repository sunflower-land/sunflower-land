import React from "react";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Switch from "components/ui/Switch";
import { FontSettings } from "./FontSettings";

export const AppearanceSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const { isDarkMode, toggleDarkMode } = useIsDarkMode();

  return (
    <div className="flex flex-col items-center gap-2 m-3">
      <FontSettings />
      <Switch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        label={
          isDarkMode
            ? t("gameOptions.generalSettings.darkMode")
            : t("gameOptions.generalSettings.lightMode")
        }
      />
    </div>
  );
};
