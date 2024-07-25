import React from "react";

import sarcophagus from "src/assets/sfts/sarcophagus.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";

export const Sarcophagus: React.FC = () => {
  return (
    <>
      <img
        src={sarcophagus}
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          // Will adjust later
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Sarcophagus"
      />
    </>
  );
};
