import React from "react";

import tikiTorch from "assets/decorations/tiki_torch.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const TikiTorch: React.FC = () => {
  return (
    <>
      <img
        src={tikiTorch}
        style={{
          width: `${PIXEL_SCALE * 9}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Tiki Torch"
      />
    </>
  );
};
