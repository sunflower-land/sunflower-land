import React from "react";

import poppy from "assets/sfts/poppy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Poppy: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <img
        src={poppy}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
        alt="Poppy"
      />
    </div>
  );
};
