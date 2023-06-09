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
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        alt="Field Maple"
      />
    </>
  );
};
