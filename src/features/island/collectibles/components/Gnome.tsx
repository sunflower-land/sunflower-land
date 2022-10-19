import React from "react";

import gnome from "assets/nfts/gnome.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const Gnome: React.FC = () => {
  return (
    <img
      src={gnome}
      style={{
        width: `${PIXEL_SCALE * 19}px`,
      }}
      alt="Gnome"
    />
  );
};
