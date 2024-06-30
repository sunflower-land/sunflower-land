import React from "react";

import crowRock from "assets/decorations/crow_rock.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CrowRock: React.FC = () => {
  return (
    <>
      <img
        src={crowRock}
        style={{
          width: `${PIXEL_SCALE * 29}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2 bottom-0"
        alt="Crow Rock"
      />
    </>
  );
};
