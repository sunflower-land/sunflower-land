import React, { useContext } from "react";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Switch from "components/ui/Switch";
import { FontSettings } from "./FontSettings";
import { Context } from "features/game/GameProvider";

export const AppearanceSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const { isDarkMode, toggleDarkMode } = useIsDarkMode();
  const { showTimers, toggleTimers } = useContext(Context);

  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="text-lg">{t("gameOptions.generalSettings.appearance")}</h1>
      <FontSettings />
      <Switch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        label={t("gameOptions.generalSettings.darkMode")}
      />
      <Switch
        checked={showTimers}
        onChange={toggleTimers}
        label="Show Timers"
      />
    </div>
  );
};
