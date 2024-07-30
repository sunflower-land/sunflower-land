import React from "react";

import crimPeckster from "assets/animals/chickens/crim_peckster.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
export const CrimPeckster: React.FC = () => {
  return (
    <>
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute pointer-events-none"
      />
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -2}px`,
        }}
      >
        <img
          src={crimPeckster}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
          alt="Crim Peckster"
        />
      </div>
    </>
  );
};
