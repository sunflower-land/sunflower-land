import React from "react";
import { Button } from "components/ui/Button";
import { Font, changeFont } from "lib/utils/fonts";

export const FontSettings: React.FC = () => {
  const currentLanguage = localStorage.getItem("language") || "en";

  const fonts: Font[] = ["Default", "Bold", "Sans Serif", "Chunky (Old)"];

  return (
    <>
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
