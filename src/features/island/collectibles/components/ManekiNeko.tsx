import React from "react";

import manekiNeko from "assets/sfts/maneki_neko.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ManekiNeko: React.FC = () => {
  return (
    <>
      <img
        src={manekiNeko}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Maneki Neko"
      />
    </>
  );
};
