import React from "react";

import image from "src/assets/sfts/festive_tree.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FestiveTree: React.FC = () => {
  return (
    <>
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute"
        alt="Festive Tree"
      />
    </>
  );
};
