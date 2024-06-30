import React from "react";

import frog from "assets/sfts/sapo_travessura.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SapoTravessuras: React.FC = () => {
  return (
    <>
      <img
        src={frog}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Sapo Travessuras"
      />
    </>
  );
};
