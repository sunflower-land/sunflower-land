import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
export const WarSkulls: React.FC = () => {
  return (
    <img
      src={SUNNYSIDE.decorations.warSkull}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      alt="War Skull"
    />
  );
};
