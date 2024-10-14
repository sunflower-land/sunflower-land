import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const Template: React.FC = () => {
  return (
    <>
      <img
        src={SUNNYSIDE.icons.expression_confused}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Template"
      />
    </>
  );
};
