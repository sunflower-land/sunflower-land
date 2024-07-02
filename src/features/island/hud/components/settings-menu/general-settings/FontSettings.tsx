import React from "react";
import { Button } from "components/ui/Button";
import { Font, changeFont } from "lib/utils/fonts";

export const FontSettings: React.FC = () => {
  const currentLanguage = localStorage.getItem("language") || "en";

  const alphebeticalFonts: Font[] = [
    "Default",
    "Bold",
    "Chunky (Old)",
    "Sans Serif",
  ];

  const chineseFonts: Font[] = ["基本", "像素", "黑体", "Sans Serif"];

  const fonts = currentLanguage === "zh-CN" ? chineseFonts : alphebeticalFonts;

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
