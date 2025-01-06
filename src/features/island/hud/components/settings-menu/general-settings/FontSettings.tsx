import React from "react";
import {
  changeFont,
  CHINESE_FONT_CONFIG,
  CYRILLIC_FONT_CONFIG,
  Font,
  FONT_CONFIG,
  KOREAN_FONT_CONFIG,
} from "lib/utils/fonts";
import { getKeys } from "features/game/types/decorations";
import CycleButton from "components/ui/CycleButton";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const FontSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const language = localStorage.getItem("language") ?? "en";
  const fonts = (() => {
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
  })();

  const handleFontChange = (font: string) => changeFont(font as Font);

  return (
    <div className={"flex items-center justify-between w-full"}>
      <span>{t("gameOptions.generalSettings.font")}</span>
      <CycleButton
        onChange={handleFontChange}
        options={fonts}
        className="w-48"
      />
    </div>
  );
};
