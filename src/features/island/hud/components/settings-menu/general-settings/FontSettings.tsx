import React from "react";
import { Button } from "components/ui/Button";
import { Font, changeFont } from "lib/utils/fonts";

export const FontSettings: React.FC = () => {
  const fonts: Font[] = ["Default", "Bold", "Chunky (Old)", "Sans Serif"];

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
