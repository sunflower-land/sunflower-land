import React, { useEffect, useMemo, useState } from "react";
import {
  changeFont,
  CHINESE_FONT_CONFIG,
  CYRILLIC_FONT_CONFIG,
  Font,
  FONT_CONFIG,
  KOREAN_FONT_CONFIG,
} from "lib/utils/fonts";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Dropdown } from "components/ui/Dropdown";

const getStoredFont = (): Font =>
  (localStorage.getItem("settings.font") ?? "default") as Font;

export const FontSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const language = localStorage.getItem("language") ?? "en";
  const fonts = useMemo(() => {
    switch (language) {
      case "zh-CN":
        return getKeys(CHINESE_FONT_CONFIG);
      case "ru":
        return getKeys(CYRILLIC_FONT_CONFIG);
      case "ko":
        return getKeys(KOREAN_FONT_CONFIG);
      default:
        return getKeys(FONT_CONFIG);
    }
  }, [language]);

  const [font, setFont] = useState<Font>(() => getStoredFont());

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "settings.font" && event.newValue) {
        setFont(event.newValue as Font);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleFontChange = (nextFont: string) => {
    const typedFont = nextFont as Font;
    setFont(typedFont);
    changeFont(typedFont);
  };

  return (
    <div className={"flex items-center justify-between w-full"}>
      <span>{t("gameOptions.generalSettings.font")}</span>
      <Dropdown
        onChange={handleFontChange}
        options={fonts}
        value={font}
        className="w-48"
        initialIndex={fonts.indexOf(font)}
        maxHeight={20}
      />
    </div>
  );
};
