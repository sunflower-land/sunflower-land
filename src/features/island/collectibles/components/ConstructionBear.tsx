import React from "react";

import constructionBear from "assets/sfts/bears/construction_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ConstructionBear: React.FC = () => {
  return (
    <>
      <img
        src={constructionBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Construction Bear"
      />
    </>
  );
};
