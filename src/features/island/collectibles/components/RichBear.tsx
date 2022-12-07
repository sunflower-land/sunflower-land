import React from "react";

import bear from "assets/sfts/bears/rich_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RichBear: React.FC = () => {
  return (
    <>
      <img
        src={bear}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Rich Bear"
      />
    </>
  );
};
