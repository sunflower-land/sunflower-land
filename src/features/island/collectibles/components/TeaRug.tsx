import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import teaRug from "assets/sfts/tea_rug.webp";

export const TeaRug: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center items-center"
      style={{
        width: `${PIXEL_SCALE * 48}px`,
        height: `${PIXEL_SCALE * 49}px`,
      }}
    >
      <img src={teaRug} className="w-full h-full" alt="Tea Rug" />
    </div>
  );
};
