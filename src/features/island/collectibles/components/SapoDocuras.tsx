import React from "react";

import frog from "assets/sfts/sapo_docuras.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SapoDocuras: React.FC = () => {
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
        alt="Sapo Docuras"
      />
    </>
  );
};
