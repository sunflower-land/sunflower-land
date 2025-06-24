import React from "react";

import pablo from "assets/sfts/pablo_bunny.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PabloBunny: React.FC = () => {
  return (
    <SFTDetailPopover name="Pablo Bunny">
      <div
        className="absolute top-0 left-0 h-full pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
          }}
          className="absolute bottom-0 left-0 pointer-events-none"
        />
        <img
          src={pablo}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute left-0 pointer-events-none"
          alt="Pablo The Bunny"
        />
      </div>
    </SFTDetailPopover>
  );
};
