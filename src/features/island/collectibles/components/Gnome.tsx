import React from "react";

import gnome from "assets/sfts/gnome.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Gnome: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 17}px`,
      }}
    >
      <img
        src={gnome}
        style={{
          width: `${PIXEL_SCALE * 17}px`,
        }}
        alt="Gnome"
        className="absolute"
      />
    </div>
  );
};
