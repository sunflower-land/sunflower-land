import React from "react";

import foliantCase from "assets/sfts/foliant_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Foliant: React.FC = () => {
  return (
    <>
      <img
        src={foliantCase}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Foliant"
      />
    </>
  );
};
