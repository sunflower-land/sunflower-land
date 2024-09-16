import React from "react";
import { Button } from "components/ui/Button";
import {
  changeFont,
  CHINESE_FONT_CONFIG,
  CYRILLIC_FONT_CONFIG,
  FONT_CONFIG,
  KOREAN_FONT_CONFIG,
} from "lib/utils/fonts";
import { getKeys } from "features/game/types/decorations";

export const FontSettings: React.FC = () => {
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
