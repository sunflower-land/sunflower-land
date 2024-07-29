import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const QebehsenuefJar: React.FC = () => {
  return (
    <>
      <img
        src={ITEM_DETAILS["Qebehsenuef Jar"].image}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0.5}px`,
        }}
        className="absolute"
        alt="Qebehsenuef Jar"
      />
    </>
  );
};
