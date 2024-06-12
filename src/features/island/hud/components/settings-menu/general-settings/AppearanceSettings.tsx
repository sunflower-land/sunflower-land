import React from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Font, changeFont } from "lib/utils/fonts";

export const AppearanceSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const { isDarkMode, toggleDarkMode } = useIsDarkMode();
  const currentLanguage = localStorage.getItem("language") || "en";

  const fonts: Font[] = ["Default", "Bold", "Sans Serif", "Chunky (Old)"];

  return (
    <>
      <Button className="mb-1" onClick={toggleDarkMode}>
        <span>
          {isDarkMode
            ? t("gameOptions.generalSettings.darkMode")
            : t("gameOptions.generalSettings.lightMode")}
        </span>
      </Button>
      <Label type="default" className="mb-2">
        {t("gameOptions.generalSettings.font")}
      </Label>
      {fonts.map((font) => (
        <Button
          key={font}
          className="mb-1"
          disabled={currentLanguage === "zh-CN"}
          onClick={() => changeFont(font)}
        >
          <span>{font}</span>
        </Button>
      ))}
    </>
  );
};
