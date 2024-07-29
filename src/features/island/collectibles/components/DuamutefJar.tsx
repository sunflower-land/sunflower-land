import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const DuamutefJar: React.FC = () => {
  return (
    <>
      <img
        src={ITEM_DETAILS["Duamutef Jar"].image}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0.5}px`,
        }}
        className="absolute"
        alt="Duamutef Jar"
      />
    </>
  );
};
