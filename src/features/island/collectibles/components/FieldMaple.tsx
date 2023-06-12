import React from "react";

import fieldMaple from "assets/decorations/field_maple.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FieldMaple: React.FC = () => {
  return (
    <>
      <img
        src={fieldMaple}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 1.5}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Field Maple"
      />
    </>
  );
};
