import React from "react";
import beehive from "assets/sfts/beehive.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  id: string;
}

export const Beehive: React.FC<Props> = () => {
  return (
    <img
      src={beehive}
      alt="Beehive"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
      }}
    />
  );
};
