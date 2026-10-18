import React, { useState } from "react";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Switch from "components/ui/Switch";
import { FontSettings } from "./FontSettings";
import {
  isCustomCursorEnabled,
  setCustomCursorEnabled,
} from "lib/utils/customCursor";

export const AppearanceSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const { isDarkMode, toggleDarkMode } = useIsDarkMode();
  const [customCursor, setCustomCursor] = useState(isCustomCursorEnabled);

  const toggleCustomCursor = () => {
    const next = !customCursor;
    setCustomCursor(next);
    setCustomCursorEnabled(next);
  };

  return (
    <div className="flex flex-col items-start gap-2 p-2 min-h-56">
      <FontSettings />
      <Switch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        label={t("gameOptions.generalSettings.darkMode")}
      />
      <Switch
        checked={customCursor}
        onChange={toggleCustomCursor}
        label={t("gameOptions.generalSettings.customCursor")}
      />
    </div>
  );
};
