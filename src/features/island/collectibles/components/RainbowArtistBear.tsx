import React from "react";

import bear from "assets/sfts/bears/rainbow_artist_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const RainbowArtistBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Rainbow Artist Bear">
      <>
        <img
          src={bear}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Rainbow Bear"
        />
      </>
    </SFTDetailPopover>
  );
};
