import React from "react";

import bear from "assets/sfts/bears/rich_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RichBear: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center w-full h-ful"
      style={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        right: `${PIXEL_SCALE * -4}px`,
      }}
    >
      <img
        src={bear}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Rich Bear"
      />
    </div>
  );
};
