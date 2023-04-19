import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import recenter from "assets/icons/recenter.png";

export const Recenter: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  return (
    <div
      onClick={() => scrollIntoView(Section.GameCenter)}
      className={"fixed z-50 cursor-pointer hover:img-highlight"}
      style={{
        right: `${PIXEL_SCALE * 3}px`,
        bottom: `${PIXEL_SCALE * 78}px`,
        width: `${PIXEL_SCALE * 22}px`,
      }}
    >
      <img
        src={SUNNYSIDE.ui.round_button}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
      />
      <img
        src={recenter}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 3.2}px`,
          left: `${PIXEL_SCALE * 3.4}px`,
          width: `${PIXEL_SCALE * 15}px`,
        }}
      />
    </div>
  );
};
