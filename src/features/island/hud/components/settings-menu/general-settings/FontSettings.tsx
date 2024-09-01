import React from "react";
import { Button } from "components/ui/Button";
import {
  ARABIC_FONT_CONFIG,
  changeFont,
  CHINESE_FONT_CONFIG,
  CYRILLIC_FONT_CONFIG,
  FONT_CONFIG,
} from "lib/utils/fonts";
import { getKeys } from "features/game/types/decorations";

export const FontSettings: React.FC = () => {
  const language = localStorage.getItem("language") ?? "en";

  let fontconfig;
  switch (language) {
    case "zh-CN":
      fontconfig = CHINESE_FONT_CONFIG;
      break;
    case "ar":
    case "fa":
      fontconfig = ARABIC_FONT_CONFIG;
      break;
    case "ru":
      fontconfig = CYRILLIC_FONT_CONFIG;
      break;
    default:
      fontconfig = FONT_CONFIG;
  }

  const fonts = getKeys(fontconfig);

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
