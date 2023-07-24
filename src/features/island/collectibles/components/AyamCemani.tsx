import React from "react";

import ayamCemani from "assets/animals/chickens/ayam_cemani.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const AyamCemani: React.FC = () => {
  return (
    <>
      <img
        src={ayamCemani}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Ayam Cemani"
      />
    </>
  );
};
