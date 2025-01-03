import React, { useState } from "react";
import {
  changeFont,
  CHINESE_FONT_CONFIG,
  CYRILLIC_FONT_CONFIG,
  Font,
  FONT_CONFIG,
  getCachedFont,
  KOREAN_FONT_CONFIG,
} from "lib/utils/fonts";
import { getKeys } from "features/game/types/decorations";
import Dropdown from "components/ui/Dropdown";

export const FontSettings: React.FC = () => {
  const language = localStorage.getItem("language") ?? "en";
  const font = getCachedFont();
  const [currentFont, setFont] = useState<Font>(font);
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

  const handleFontChange = (font: string) => {
    setFont(font as Font);
    changeFont(font as Font);
  };

  return (
    <Dropdown
      label={"Font"}
      value={currentFont}
      onChange={handleFontChange}
      options={fonts}
    />
  );
};
