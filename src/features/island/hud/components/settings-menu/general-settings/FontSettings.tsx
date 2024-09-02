import React from "react";
import { Button } from "components/ui/Button";
import {
  changeFont,
  CHINESE_FONT_CONFIG,
  CYRILLIC_FONT_CONFIG,
  FONT_CONFIG,
} from "lib/utils/fonts";
import { getKeys } from "features/game/types/decorations";

export const FontSettings: React.FC = () => {
  const language = localStorage.getItem("language") ?? "en";

  const getFontConfig = () => {
    switch (language) {
      case "zh-CN":
      case "zh-TW":
        return CHINESE_FONT_CONFIG;
      case "ru":
        return CYRILLIC_FONT_CONFIG;
      default:
        return FONT_CONFIG;
    }
  };
  const fonts = getKeys(getFontConfig());

  return (
    <>
      {fonts.map((font) => (
        <Button key={font} className="mb-1" onClick={() => changeFont(font)}>
          <span>{font}</span>
        </Button>
      ))}
    </>
  );
};
