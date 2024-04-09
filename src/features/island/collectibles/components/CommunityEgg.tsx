import React from "react";

import egg from "assets/sfts/easter_donation_egg.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CommunityEgg: React.FC = () => {
  return (
    <>
      <img
        src={egg}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Basic Bear"
      />
    </>
  );
};
